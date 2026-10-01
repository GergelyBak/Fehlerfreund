import { Schema, model } from "mongoose";
import { ERROR_TYPES } from "../llm/correctionSchema.js";

// One document per card review, for activity statistics. Cards only keep their
// latest state, so without this log "what did I do on Tuesday" is unknowable.
const reviewLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  cardId: { type: Schema.Types.ObjectId, ref: "Card", required: true },
  errorType: { type: String, enum: ERROR_TYPES, required: true },
  grade: { type: Number, required: true },
  reviewedAt: { type: Date, required: true, default: () => new Date() },
});

reviewLogSchema.index({ userId: 1, reviewedAt: -1 });

export const ReviewLog = model("ReviewLog", reviewLogSchema);
