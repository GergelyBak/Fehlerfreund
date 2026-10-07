import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

export const NATIVE_LANGUAGES = ["hu", "en"] as const;
export const LEVELS = ["A1", "A2", "B1", "B2"] as const;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    displayName: { type: String, required: true, trim: true },
    nativeLanguage: { type: String, enum: NATIVE_LANGUAGES, default: "hu" },
    level: { type: String, enum: LEVELS, default: "A2" },
    // Only a SHA-256 hash of the reset token is stored, so a leaked database
    // can't be used to reset passwords.
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    // Daily email reminder (sent by the n8n workflow). Opt-in.
    reminders: {
      enabled: { type: Boolean, default: false },
      hour: { type: Number, min: 0, max: 23, default: 18 }, // local hour
      timeZone: { type: String, default: "Europe/Budapest" },
      // "YYYY-MM-DD" in the user's time zone, so at most one email a day.
      lastSentDay: String,
    },
  },
  { timestamps: true },
);

export type UserDoc = HydratedDocument<InferSchemaType<typeof userSchema>>;
export const User = model("User", userSchema);
