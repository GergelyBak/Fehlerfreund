import type Anthropic from "@anthropic-ai/sdk";
import type { Correction } from "./correctionSchema.js";

export interface CorrectParams {
  userId: string;
  text: string;
  level: string;
  nativeLanguage: string;
  // Only the eval sets this, to compare prompt versions.
  promptVersion?: string;
}

export type CorrectionResult =
  | { ok: true; correction: Correction; promptVersion: string; model: string }
  | { ok: false; reason: string; promptVersion: string; model: string };

export interface RoleplayParams {
  userId: string;
  situationId: string;
  situation: string;
  role: string;
  level: string;
  // Goals the partner should steer the learner towards (German).
  tasks: string[];
  // Full conversation so far, starting with the partner's opening line and
  // ending with the learner's latest message.
  history: Anthropic.MessageParam[];
}

export interface TranslateParams {
  userId: string;
  text: string;
  // "hu" | "en"
  targetLanguage: string;
}

// Both the Claude and the Ollama implementation provide this, so routes never
// know (or care) which one is running.
export interface LlmProvider {
  mode: "live" | "ollama";
  // Whether correction and reply can run at the same time without slowing each other down.
  concurrent: boolean;
  // Model that writes the partner's replies, for display (e.g. "gemma3:4b").
  model: string;
  correct(params: CorrectParams): Promise<CorrectionResult>;
  // Yields text chunks as they arrive.
  streamRoleplay(params: RoleplayParams): AsyncGenerator<string, void>;
  translate(params: TranslateParams): Promise<{ text: string; model: string }>;
  // Whether the model can answer right now (Ollama runs on a machine that may be off).
  isAvailable(): Promise<boolean>;
}

// Thrown when the model can't be reached at all, so the UI can say
// "offline" instead of a generic error.
export class LlmUnavailableError extends Error {}
