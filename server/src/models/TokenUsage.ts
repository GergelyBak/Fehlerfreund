import { Schema, model } from "mongoose";

// One document per user per UTC day; incremented after every Claude call.
const tokenUsageSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    day: { type: String, required: true }, // YYYY-MM-DD (UTC)
    inputTokens: { type: Number, default: 0 },
    outputTokens: { type: Number, default: 0 },
    requests: { type: Number, default: 0 },
  },
  { timestamps: true },
);

tokenUsageSchema.index({ userId: 1, day: 1 }, { unique: true });

export const TokenUsage = model("TokenUsage", tokenUsageSchema);
