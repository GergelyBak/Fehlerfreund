import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env.js";

// The API key lives only here, on the server. The client never talks to Claude directly.
export const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export const MODELS = {
  // Streams the roleplay partner's replies.
  roleplay: "claude-sonnet-5",
  // Produces the structured correction JSON; cheaper and fast enough.
  correction: "claude-haiku-4-5",
} as const;
