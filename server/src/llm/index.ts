import { env } from "../config/env.js";
import type { LlmProvider } from "./types.js";

// Imported lazily so Ollama mode never constructs the Anthropic client (and
// never needs an API key).
export const llm: LlmProvider =
  env.LLM_MODE === "live" ? (await import("./live.js")).liveProvider : (await import("./ollama.js")).ollamaProvider;

export { LlmUnavailableError } from "./types.js";
export type { LlmProvider, CorrectionResult, CorrectParams, RoleplayParams, TranslateParams } from "./types.js";
