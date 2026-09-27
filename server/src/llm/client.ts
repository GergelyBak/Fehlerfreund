import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env.js";

// The API key lives only here, on the server. The client never talks to Claude directly.
export const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export const MODELS = {
  // Streams the roleplay partner's replies.
  roleplay: "claude-sonnet-5",
  // Produces the structured correction JSON. Haiku 4.5 was tried first, but it
  // missed errors (habe/bin + fahren) and gave wrong explanations, and those
  // would become flashcards.
  correction: "claude-sonnet-5",
} as const;
