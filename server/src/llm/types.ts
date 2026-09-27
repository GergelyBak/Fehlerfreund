import type Anthropic from "@anthropic-ai/sdk";
import type { Correction } from "./correctionSchema.js";

export interface CorrectParams {
  userId: string;
  text: string;
  level: string;
  nativeLanguage: string;
}

export type CorrectionResult =
  | { ok: true; correction: Correction; promptVersion: string; model: string }
  | { ok: false; reason: string; promptVersion: string; model: string };

export interface RoleplayParams {
  userId: string;
  situation: string;
  role: string;
  level: string;
  // Full conversation so far, ending with the learner's latest message.
  history: Anthropic.MessageParam[];
}

// Both the live Claude implementation and the mock implement this, so routes
// never know (or care) which one is running.
export interface LlmProvider {
  mode: "live" | "mock";
  correct(params: CorrectParams): Promise<CorrectionResult>;
  // Yields text chunks as they arrive.
  streamRoleplay(params: RoleplayParams): AsyncGenerator<string, void>;
}
