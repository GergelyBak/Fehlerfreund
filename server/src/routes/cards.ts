import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { Card, type CardDoc } from "../models/Card.js";
import { ReviewLog } from "../models/ReviewLog.js";
import { ERROR_TYPES, type ErrorType } from "../llm/correctionSchema.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody } from "../middleware/validate.js";
import { HttpError } from "../lib/HttpError.js";
import { UI_GRADES, intervalPreviews, nextDueDate, sm2, type Grade } from "../srs/sm2.js";

const router = Router();
router.use(requireAuth);

function toPublicCard(card: CardDoc) {
  const state = { easiness: card.easiness, interval: card.interval, repetitions: card.repetitions };
  return {
    id: card.id as string,
    errorType: card.errorType,
    original: card.original,
    corrected: card.corrected,
    explanation: card.explanation,
    prompt: card.prompt,
    answer: card.answer,
    occurrences: card.occurrences,
    situationId: card.situationId ?? null,
    dueAt: card.dueAt,
    interval: card.interval,
    repetitions: card.repetitions,
    reviewCount: card.reviewCount,
    // Days until the next review for each answer button.
    previews: intervalPreviews(state),
  };
}

// Optional ?errorType=Kasus narrows everything to one error category, for
// targeted practice from the statistics page.
function cardFilter(req: { userId?: string; query: Record<string, unknown> }): { userId?: string; errorType?: ErrorType } {
  const errorType = req.query.errorType;
  if (errorType === undefined) return { userId: req.userId };
  if (typeof errorType !== "string" || !(ERROR_TYPES as readonly string[]).includes(errorType)) {
    throw new HttpError(400, "Unknown error type");
  }
  return { userId: req.userId, errorType: errorType as ErrorType };
}

router.get("/stats", async (req, res) => {
  const now = new Date();
  const filter = cardFilter(req);
  const [total, due, next] = await Promise.all([
    Card.countDocuments(filter),
    Card.countDocuments({ ...filter, dueAt: { $lte: now } }),
    Card.findOne({ ...filter, dueAt: { $gt: now } }).sort({ dueAt: 1 }).select({ dueAt: 1 }).lean(),
  ]);
  res.json({ total, due, nextDueAt: next?.dueAt ?? null });
});

router.get("/due", async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
  // ?ahead=1 also returns cards that aren't due yet ("review ahead"), for
  // practising a weak area on purpose. Oldest-due first either way.
  const ahead = req.query.ahead === "1";
  const cards = await Card.find({ ...cardFilter(req), ...(ahead ? {} : { dueAt: { $lte: new Date() } }) })
    .sort({ dueAt: 1 })
    .limit(limit);
  res.json({ cards: cards.map(toPublicCard) });
});

const ReviewSchema = z.object({
  grade: z.union(UI_GRADES.map((g) => z.literal(g))),
});

router.post("/:id/review", validateBody(ReviewSchema), async (req, res) => {
  const { grade } = req.body as { grade: Grade };
  const card = await findOwned(req.params.id as string, req.userId!);

  const now = new Date();
  const next = sm2({ easiness: card.easiness, interval: card.interval, repetitions: card.repetitions }, grade);
  card.set({
    ...next,
    dueAt: nextDueDate(next.interval, now),
    lastReviewedAt: now,
    reviewCount: card.reviewCount + 1,
    lapses: card.lapses + (grade < 3 ? 1 : 0),
  });
  await card.save();
  await ReviewLog.create({ userId: card.userId, cardId: card._id, errorType: card.errorType, grade, reviewedAt: now });
  res.json({ card: toPublicCard(card) });
});

router.delete("/:id", async (req, res) => {
  // Lets the learner drop a card, e.g. when the AI's correction was wrong.
  const card = await findOwned(req.params.id as string, req.userId!);
  await card.deleteOne();
  res.status(204).end();
});

async function findOwned(id: string, userId: string) {
  if (!isValidObjectId(id)) throw new HttpError(404, "Card not found");
  const card = await Card.findOne({ _id: id, userId });
  if (!card) throw new HttpError(404, "Card not found");
  return card;
}

export default router;
