import { correctMessage } from "./correct.js";
import { streamRoleplay } from "./roleplay.js";
import { translateText } from "./translate.js";
import type { LlmProvider } from "./types.js";

export const liveProvider: LlmProvider = {
  mode: "live",
  concurrent: true,
  correct: correctMessage,
  streamRoleplay,
  translate: translateText,
};
