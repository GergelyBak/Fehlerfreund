import { Schema, model } from "mongoose";

// One document per user per grammar topic.
const grammarProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    topicId: { type: String, required: true },
    // Scores are fractions (0–1), so they survive adding exercises to a topic.
    bestScore: { type: Number, default: 0 },
    lastScore: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    lastAttemptAt: Date,
  },
  { timestamps: true },
);

grammarProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

export const GrammarProgress = model("GrammarProgress", grammarProgressSchema);
