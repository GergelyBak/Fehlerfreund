import { env } from "../config/env.js";
import { mockProvider } from "./mock.js";
import type { LlmProvider } from "./types.js";

// Live provider is imported lazily so mock mode never constructs the Anthropic
// client (and never needs an API key).
export const llm: LlmProvider =
  env.LLM_MODE === "live" ? (await import("./live.js")).liveProvider : mockProvider;

export type { LlmProvider, CorrectionResult, CorrectParams, RoleplayParams } from "./types.js";
