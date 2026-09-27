import { correctMessage } from "./correct.js";
import { streamRoleplay } from "./roleplay.js";
import type { LlmProvider } from "./types.js";

export const liveProvider: LlmProvider = {
  mode: "live",
  correct: correctMessage,
  streamRoleplay,
};
