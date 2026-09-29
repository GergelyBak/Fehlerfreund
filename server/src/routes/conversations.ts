import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import type Anthropic from "@anthropic-ai/sdk";
import { Conversation, type ConversationDoc, type StoredCorrection } from "../models/Conversation.js";
import { User } from "../models/User.js";
import { SITUATIONS, getSituation, toPublicSituation } from "../situations.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody } from "../middleware/validate.js";
import { aiLimiter } from "../middleware/rateLimit.js";
import { HttpError } from "../lib/HttpError.js";
import { initSse, sendEvent } from "../lib/sse.js";
import { llm, type CorrectionResult } from "../llm/index.js";
import { assertWithinBudget } from "../llm/usage.js";
import { addCardsFromCorrection } from "../srs/cards.js";
import { sanitizeCorrection } from "../llm/sanitize.js";

// Caps context size (and cost) per conversation.
const MAX_MESSAGES = 60;
const MAX_MESSAGE_LENGTH = 500;

const router = Router();
router.use(requireAuth);

router.get("/situations", (_req, res) => {
  res.json({ situations: SITUATIONS.map(toPublicSituation) });
});

async function findOwned(id: string, userId: string) {
  if (!isValidObjectId(id)) throw new HttpError(404, "Conversation not found");
  const convo = await Conversation.findOne({ _id: id, userId });
  if (!convo) throw new HttpError(404, "Conversation not found");
  return convo;
}

function toPublicConversation(convo: ConversationDoc) {
  return {
    id: convo.id as string,
    situationId: convo.situationId,
    level: convo.level,
    completedTasks: convo.completedTasks,
    createdAt: convo.createdAt,
    updatedAt: convo.updatedAt,
    messages: convo.messages.map((m) => ({
      id: m._id.toString(),
      role: m.role,
      content: m.content,
      correction: m.correction ?? null,
      translation: m.translation ? { language: m.translation.language, text: m.translation.text } : null,
      createdAt: m.createdAt,
    })),
  };
}

function toStoredCorrection(result: CorrectionResult): StoredCorrection {
  return result.ok
    ? { status: "ok", ...result.correction, promptVersion: result.promptVersion, model: result.model }
    : { status: "failed", reason: result.reason, promptVersion: result.promptVersion, model: result.model };
}

// The conversation opens with the partner's greeting, but the Messages API
// expects the first turn to come from the user, so we add a stage direction.
function toClaudeHistory(convo: ConversationDoc): Anthropic.MessageParam[] {
  const history: Anthropic.MessageParam[] = convo.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  if (history[0]?.role === "assistant") {
    history.unshift({ role: "user", content: "[Die Person kommt herein. Das Gespräch beginnt.]" });
  }
  return history;
}

router.get("/", async (req, res) => {
  const convos = await Conversation.find({ userId: req.userId })
    .sort({ updatedAt: -1 })
    .limit(20)
    .select({ situationId: 1, level: 1, updatedAt: 1, messages: { $slice: -1 } })
    .lean();
  const counts = await Conversation.aggregate<{ _id: unknown; count: number }>([
    { $match: { _id: { $in: convos.map((c) => c._id) } } },
    { $project: { count: { $size: "$messages" } } },
  ]);
  const countById = new Map(counts.map((c) => [String(c._id), c.count]));
  res.json({
    conversations: convos.map((c) => ({
      id: String(c._id),
      situationId: c.situationId,
      level: c.level,
      updatedAt: c.updatedAt,
      messageCount: countById.get(String(c._id)) ?? 0,
      lastMessage: c.messages[0]?.content ?? "",
    })),
  });
});

const CreateSchema = z.object({ situationId: z.string() });

router.post("/", validateBody(CreateSchema), async (req, res) => {
  const { situationId } = req.body as z.infer<typeof CreateSchema>;
  const situation = getSituation(situationId);
  if (!situation) throw new HttpError(400, "Unknown situation");
  const user = await User.findById(req.userId);
  if (!user) throw new HttpError(401, "User no longer exists");

  const convo = await Conversation.create({
    userId: user._id,
    situationId,
    level: user.level,
    messages: [{ role: "assistant", content: situation.opening.de }],
  });
  res.status(201).json({ conversation: toPublicConversation(convo) });
});

router.get("/:id", async (req, res) => {
  const convo = await findOwned(req.params.id as string, req.userId!);
  res.json({ conversation: toPublicConversation(convo) });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id as string;
  if (!isValidObjectId(id)) throw new HttpError(404, "Conversation not found");
  // Filtering by userId too means nobody can delete someone else's conversation.
  const { deletedCount } = await Conversation.deleteOne({ _id: id, userId: req.userId });
  if (!deletedCount) throw new HttpError(404, "Conversation not found");
  res.status(204).end();
});

const TaskSchema = z.object({ taskId: z.string(), done: z.boolean() });

router.patch("/:id/tasks", validateBody(TaskSchema), async (req, res) => {
  const { taskId, done } = req.body as z.infer<typeof TaskSchema>;
  const convo = await findOwned(req.params.id as string, req.userId!);
  if (!getSituation(convo.situationId)?.tasks.some((t) => t.id === taskId)) {
    throw new HttpError(400, "Unknown task");
  }
  const updated = await Conversation.findByIdAndUpdate(
    convo._id,
    done ? { $addToSet: { completedTasks: taskId } } : { $pull: { completedTasks: taskId } },
    { new: true },
  );
  res.json({ completedTasks: updated?.completedTasks ?? [] });
});

router.post("/:id/messages/:messageId/translate", aiLimiter, async (req, res) => {
  const userId = req.userId!;
  const convo = await findOwned(req.params.id as string, userId);
  const message = convo.messages.id(req.params.messageId as string);
  if (!message || message.role !== "assistant") throw new HttpError(404, "Message not found");
  const user = await User.findById(userId);
  if (!user) throw new HttpError(401, "User no longer exists");

  // Served from the cache when this message was already translated into the same language.
  if (message.translation?.language === user.nativeLanguage && message.translation.text) {
    res.json({ translation: message.translation.text, cached: true });
    return;
  }

  await assertWithinBudget(userId);
  let result;
  try {
    result = await llm.translate({ userId, text: message.content, targetLanguage: user.nativeLanguage });
  } catch (err) {
    console.error("Translation failed:", err);
    throw new HttpError(502, "Translation failed, please try again");
  }
  message.set("translation", { language: user.nativeLanguage, text: result.text, model: result.model });
  await convo.save();
  res.json({ translation: result.text, cached: false });
});

const SendSchema = z.object({
  text: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
});

/**
 * Streams the reply as Server-Sent Events:
 *   user_message { id }                         learner's message was saved
 *   delta        { text }                       next chunk of the partner's reply
 *   correction   { messageId, correction,       may arrive before, during or after the deltas
 *                  cardsAdded }
 *   done         { assistantMessageId }         reply finished and saved
 *   error        { error }                      reply failed; the learner's message is kept
 */
router.post("/:id/messages", aiLimiter, validateBody(SendSchema), async (req, res) => {
  const userId = req.userId!;
  const { text } = req.body as z.infer<typeof SendSchema>;
  const convo = await findOwned(req.params.id as string, userId);
  if (convo.messages.length >= MAX_MESSAGES) {
    throw new HttpError(409, "This conversation is full, start a new one");
  }
  const situation = getSituation(convo.situationId);
  if (!situation) throw new HttpError(500, "Situation no longer exists");
  const user = await User.findById(userId);
  if (!user) throw new HttpError(401, "User no longer exists");
  await assertWithinBudget(userId);

  convo.messages.push({ role: "user", content: text });
  await convo.save();
  const userMessage = convo.messages[convo.messages.length - 1]!;

  // From here on the response is a stream: errors become `error` events,
  // not HTTP status codes.
  initSse(res);
  let clientGone = false;
  res.on("close", () => {
    if (!res.writableEnded) clientGone = true;
  });
  sendEvent(res, "user_message", { id: userMessage._id.toString() });

  // The correction is sent as its own event as soon as it's ready.
  const runCorrection = () =>
    llm
      .correct({ userId, text, level: convo.level, nativeLanguage: user.nativeLanguage })
      .catch((err: unknown): CorrectionResult => {
        console.error("Correction failed:", err);
        return { ok: false, reason: "api_error", promptVersion: "unknown", model: "unknown" };
      })
      .then(async (raw) => {
        // Same checks for every provider; the model's answer is never trusted as-is.
        const result: CorrectionResult = raw.ok ? { ...raw, correction: sanitizeCorrection(text, raw.correction) } : raw;
        const stored = toStoredCorrection(result);
        // Cards are a bonus: if creating them fails, the chat still goes on.
        const cardsAdded = result.ok
          ? await addCardsFromCorrection({
              userId,
              sourceSentence: text,
              correction: result.correction,
              conversationId: convo._id,
              situationId: convo.situationId,
            }).catch((err: unknown) => {
              console.error("Creating cards failed:", err);
              return 0;
            })
          : 0;
        sendEvent(res, "correction", { messageId: userMessage._id.toString(), correction: stored, cardsAdded });
        return stored;
      });

  // Hosted models run it in parallel with the reply. A local model serves one
  // request at a time, so there the reply goes first and the correction after,
  // otherwise the learner would stare at an empty bubble.
  let correctionDone = llm.concurrent ? runCorrection() : undefined;

  let reply = "";
  let streamFailed = false;
  try {
    for await (const chunk of llm.streamRoleplay({
      userId,
      situationId: situation.id,
      situation: situation.scenario,
      role: situation.role,
      level: convo.level,
      tasks: situation.tasks.map((t) => t.de),
      history: toClaudeHistory(convo),
    })) {
      // Leaving the loop early also aborts the upstream Claude request.
      if (clientGone) break;
      reply += chunk;
      sendEvent(res, "delta", { text: chunk });
    }
  } catch (err) {
    console.error("Roleplay stream failed:", err);
    streamFailed = true;
  }

  // Headers are already sent, so the error middleware can't respond anymore:
  // every failure past this point has to end the stream itself.
  try {
    correctionDone ??= runCorrection();
    userMessage.set("correction", await correctionDone);
    // Keep a partial reply if the stream broke midway; it's still valid context.
    if (reply.trim()) convo.messages.push({ role: "assistant", content: reply });
    await convo.save();

    if (streamFailed && !reply.trim()) {
      sendEvent(res, "error", { error: "The conversation partner couldn't answer, please try again" });
    } else {
      const last = convo.messages[convo.messages.length - 1]!;
      sendEvent(res, "done", { assistantMessageId: last._id.toString() });
    }
  } catch (err) {
    console.error("Saving the conversation failed:", err);
    sendEvent(res, "error", { error: "Saving the conversation failed" });
  } finally {
    res.end();
  }
});

export default router;
