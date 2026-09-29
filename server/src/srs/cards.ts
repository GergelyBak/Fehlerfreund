import { Types } from "mongoose";
import { Card } from "../models/Card.js";
import type { Correction } from "../llm/correctionSchema.js";
import { buildPrompt, cardKey } from "./cardContent.js";

/**
 * Turns the major errors of a correction into cards. Repeating a known mistake
 * doesn't create a duplicate: it bumps `occurrences` and makes the card due
 * again right away, because it evidently hasn't stuck yet.
 * Returns how many cards were created or brought back.
 */
export async function addCardsFromCorrection(opts: {
  userId: string;
  sourceSentence: string;
  correction: Correction;
  conversationId?: Types.ObjectId;
  situationId?: string;
}) {
  const items = opts.correction.corrections.filter((c) => c.severity === "major");
  if (items.length === 0) return 0;

  const now = new Date();
  const ops = items.map((item) => ({
    updateOne: {
      filter: { userId: new Types.ObjectId(opts.userId), key: cardKey(item.errorType, item.corrected) },
      update: {
        // Refresh the content with the latest example of the mistake.
        $set: {
          errorType: item.errorType,
          original: item.original,
          corrected: item.corrected,
          explanation: item.explanation,
          prompt: buildPrompt(item, opts.correction.correctedMessage, opts.sourceSentence),
          answer: opts.correction.correctedMessage,
          conversationId: opts.conversationId,
          situationId: opts.situationId,
          // Making the mistake again means it hasn't stuck: restart the
          // 1 → 6 → … sequence instead of continuing from a long interval.
          // Easiness is kept, so a card that was hard stays hard.
          dueAt: now,
          interval: 0,
          repetitions: 0,
        },
        // occurrences is left out here on purpose: $inc on a new doc starts it at 1,
        // and naming the same path in both would be rejected as a conflict.
        $setOnInsert: { easiness: 2.5, reviewCount: 0, lapses: 0 },
        $inc: { occurrences: 1 },
      },
      upsert: true,
    },
  }));

  // ordered: false so one failed op (e.g. a race on the unique index) doesn't
  // stop the others.
  const result = await Card.bulkWrite(ops, { ordered: false });
  return result.upsertedCount + result.modifiedCount;
}
