import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { ERROR_TYPES, SEVERITIES, type CorrectionItem } from "../llm/correctionSchema.js";
import { LEVELS } from "./User.js";

const correctionItemSchema = new Schema(
  {
    original: { type: String, required: true },
    corrected: { type: String, required: true },
    errorType: { type: String, enum: ERROR_TYPES, required: true },
    severity: { type: String, enum: SEVERITIES, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false },
);

// Stored on the user's message. status=failed means the chat went on without
// a correction (invalid output, refusal, API error); `reason` says why.
const storedCorrectionSchema = new Schema(
  {
    status: { type: String, enum: ["ok", "failed"], required: true },
    hasErrors: Boolean,
    correctedMessage: String,
    corrections: { type: [correctionItemSchema], default: undefined },
    reason: String,
    promptVersion: { type: String, required: true },
    model: { type: String, required: true },
  },
  { _id: false },
);

const messageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    correction: { type: storedCorrectionSchema, default: undefined },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const conversationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    situationId: { type: String, required: true },
    // Snapshot of the learner's level when the conversation started.
    level: { type: String, enum: LEVELS, required: true },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true },
);

export type ConversationDoc = HydratedDocument<InferSchemaType<typeof conversationSchema>>;
export type StoredCorrection =
  | ({ status: "ok"; hasErrors: boolean; correctedMessage: string; corrections: CorrectionItem[] } & CorrectionMeta)
  | ({ status: "failed"; reason: string } & CorrectionMeta);
type CorrectionMeta = { promptVersion: string; model: string };
export const Conversation = model("Conversation", conversationSchema);
