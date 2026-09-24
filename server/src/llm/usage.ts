import type Anthropic from "@anthropic-ai/sdk";
import { TokenUsage } from "../models/TokenUsage.js";
import { env } from "../config/env.js";
import { HttpError } from "../lib/HttpError.js";

const today = () => new Date().toISOString().slice(0, 10);

export async function assertWithinBudget(userId: string) {
  const usage = await TokenUsage.findOne({ userId, day: today() }).lean();
  const used = (usage?.inputTokens ?? 0) + (usage?.outputTokens ?? 0);
  if (used >= env.DAILY_TOKEN_BUDGET) {
    throw new HttpError(429, "Daily practice limit reached, come back tomorrow");
  }
}

export async function recordUsage(userId: string, usage: Anthropic.Usage) {
  const input =
    usage.input_tokens +
    (usage.cache_read_input_tokens ?? 0) +
    (usage.cache_creation_input_tokens ?? 0);
  await TokenUsage.updateOne(
    { userId, day: today() },
    { $inc: { inputTokens: input, outputTokens: usage.output_tokens, requests: 1 } },
    { upsert: true },
  );
}
