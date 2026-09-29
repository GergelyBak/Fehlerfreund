import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody } from "../middleware/validate.js";
import { HttpError } from "../lib/HttpError.js";
import { GrammarProgress } from "../models/GrammarProgress.js";
import { GRAMMAR_TOPICS, fillGap, getTopic, gradeTopic, toPublicTopic } from "../grammar/index.js";
import { upsertCards } from "../srs/cards.js";

const router = Router();
router.use(requireAuth);

function toPublicProgress(p: { bestScore: number; lastScore: number; attempts: number } | null | undefined) {
  return p ? { bestScore: p.bestScore, lastScore: p.lastScore, attempts: p.attempts } : null;
}

router.get("/topics", async (req, res) => {
  const progress = await GrammarProgress.find({ userId: req.userId }).lean();
  const byTopic = new Map(progress.map((p) => [p.topicId, p]));
  res.json({
    topics: GRAMMAR_TOPICS.map((t) => ({
      id: t.id,
      level: t.level,
      order: t.order,
      title: t.title,
      summary: t.summary,
      exerciseCount: t.exercises.length,
      progress: toPublicProgress(byTopic.get(t.id)),
    })),
  });
});

function findTopic(id: string) {
  const topic = getTopic(id);
  if (!topic) throw new HttpError(404, "Topic not found");
  return topic;
}

router.get("/topics/:id", async (req, res) => {
  const topic = findTopic(req.params.id as string);
  const progress = await GrammarProgress.findOne({ userId: req.userId, topicId: topic.id }).lean();
  res.json({ topic: toPublicTopic(topic), progress: toPublicProgress(progress) });
});

const CheckSchema = z.object({
  answers: z.record(z.string(), z.string().max(200)),
});

// Graded on the server, so the solutions never reach the browser before answering.
router.post("/topics/:id/check", validateBody(CheckSchema), async (req, res) => {
  const topic = findTopic(req.params.id as string);
  const { answers } = req.body as z.infer<typeof CheckSchema>;
  const { results, score, total } = gradeTopic(topic, answers);
  const fraction = total ? score / total : 0;

  const existing = await GrammarProgress.findOne({ userId: req.userId, topicId: topic.id });
  const progress = await GrammarProgress.findOneAndUpdate(
    { userId: req.userId, topicId: topic.id },
    {
      $set: { lastScore: fraction, lastAttemptAt: new Date(), bestScore: Math.max(existing?.bestScore ?? 0, fraction) },
      $inc: { attempts: 1 },
    },
    { upsert: true, new: true },
  );

  // Wrong answers become flashcards, like mistakes in the chat. Blank answers
  // are skipped: a card needs an actual mistake on its front.
  const cardsAdded = await upsertCards(
    req.userId!,
    results
      .filter((r) => !r.correct && r.given)
      .map((r) => {
        const exercise = topic.exercises.find((e) => e.id === r.id)!;
        return {
          key: `grammar:${topic.id}:${r.id}`,
          errorType: topic.errorType,
          original: r.given,
          corrected: r.solution,
          explanation: r.explanation,
          prompt: fillGap(exercise.prompt, r.given),
          answer: fillGap(exercise.prompt, r.solution),
        };
      }),
  ).catch((err: unknown) => {
    console.error("Creating grammar cards failed:", err);
    return 0;
  });

  res.json({ results, score, total, cardsAdded, progress: toPublicProgress(progress) });
});

export default router;
