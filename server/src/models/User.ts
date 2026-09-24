import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

export const NATIVE_LANGUAGES = ["hu", "en", "tr"] as const;
export const LEVELS = ["A1", "A2", "B1", "B2"] as const;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    displayName: { type: String, required: true, trim: true },
    nativeLanguage: { type: String, enum: NATIVE_LANGUAGES, default: "hu" },
    level: { type: String, enum: LEVELS, default: "A2" },
  },
  { timestamps: true },
);

export type UserDoc = HydratedDocument<InferSchemaType<typeof userSchema>>;
export const User = model("User", userSchema);
