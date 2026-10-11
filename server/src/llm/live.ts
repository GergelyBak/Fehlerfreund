import { correctMessage } from "./correct.js";
import { streamRoleplay } from "./roleplay.js";
import { translateText } from "./translate.js";
import type { LlmProvider } from "./types.js";
import { MODELS } from "./client.js";

export const liveProvider: LlmProvider = {
  mode: "live",
  concurrent: true,
  model: MODELS.roleplay,
  correct: correctMessage,
  streamRoleplay,
  translate: translateText,
  // A hosted API: if it is down, the request itself reports that.
  isAvailable: async () => true,
};
