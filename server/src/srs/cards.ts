import { Types } from "mongoose";
import { Card } from "../models/Card.js";
import type { Correction, ErrorType } from "../llm/correctionSchema.js";
import { buildPrompt, cardKey } from "./cardContent.js";

export interface CardContent {
  // Same key = same card; repeating the mistake bumps it instead of duplicating.
  key: string;
  errorType: ErrorType;
  original: string;
  corrected: string;
  explanation: string;
  prompt: string;
  answer: string;
  conversationId?: Types.ObjectId;
  situationId?: string;
}

/**
 * Creates cards, or brings existing ones back. A repeated mistake bumps
 * `occurrences` and makes the card due again right away, because it evidently
 * hasn't stuck yet. Returns how many cards were created or brought back.
 */
export async function upsertCards(userId: string, items: CardContent[]) {
  if (items.length === 0) return 0;
  const now = new Date();
  const ops = items.map(({ key, ...content }) => ({
    updateOne: {
      filter: { userId: new Types.ObjectId(userId), key },
      update: {
        // Refresh the content with the latest example of the mistake.
        $set: {
          ...content,
          // Restart the 1 → 6 → … sequence instead of continuing from a long
          // interval. Easiness is kept, so a card that was hard stays hard.
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

/** Cards from the major errors of a chat correction. */
export function addCardsFromCorrection(opts: {
  userId: string;
  sourceSentence: string;
  correction: Correction;
  conversationId?: Types.ObjectId;
  situationId?: string;
}) {
  const items = opts.correction.corrections
    .filter((c) => c.severity === "major")
    .map((item) => ({
      key: cardKey(item.errorType, item.corrected),
      errorType: item.errorType,
      original: item.original,
      corrected: item.corrected,
      explanation: item.explanation,
      prompt: buildPrompt(item, opts.correction.correctedMessage, opts.sourceSentence),
      answer: opts.correction.correctedMessage,
      conversationId: opts.conversationId,
      situationId: opts.situationId,
    }));
  return upsertCards(opts.userId, items);
}
