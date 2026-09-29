import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { ERROR_TYPES } from "../llm/correctionSchema.js";

// A card is self-contained: it keeps its own copy of the sentence and the
// correction, so deleting the conversation it came from doesn't affect it.
const cardSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    key: { type: String, required: true },

    errorType: { type: String, enum: ERROR_TYPES, required: true },
    original: { type: String, required: true },
    corrected: { type: String, required: true },
    explanation: { type: String, required: true },
    prompt: { type: String, required: true }, // sentence with only this error
    answer: { type: String, required: true }, // fully corrected sentence
    // How many times the learner made this mistake.
    occurrences: { type: Number, default: 1 },

    // Optional references, only for context; may point to deleted docs.
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
    situationId: String,

    // SM-2 state
    easiness: { type: Number, default: 2.5 },
    interval: { type: Number, default: 0 },
    repetitions: { type: Number, default: 0 },
    dueAt: { type: Date, default: () => new Date() },
    lastReviewedAt: Date,
    reviewCount: { type: Number, default: 0 },
    lapses: { type: Number, default: 0 },
  },
  { timestamps: true },
);

cardSchema.index({ userId: 1, key: 1 }, { unique: true });
cardSchema.index({ userId: 1, dueAt: 1 });

export type CardDoc = HydratedDocument<InferSchemaType<typeof cardSchema>>;
export const Card = model("Card", cardSchema);
