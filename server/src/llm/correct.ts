import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, MODELS } from "./client.js";
import { CorrectionSchema } from "./correctionSchema.js";
import { loadPrompt } from "./prompts.js";
import { recordUsage } from "./usage.js";
import type { CorrectParams, CorrectionResult } from "./types.js";

const LANGUAGE_NAMES: Record<string, string> = { hu: "Hungarian", en: "English" };

export async function correctMessage(opts: CorrectParams): Promise<CorrectionResult> {
  const { text: system, version: promptVersion } = await loadPrompt(
    "correction",
    { level: opts.level, nativeLanguage: LANGUAGE_NAMES[opts.nativeLanguage] ?? "English" },
    opts.promptVersion,
  );
  const model = MODELS.correction;

  let response;
  try {
    response = await anthropic.messages.parse({
      model,
      // Sonnet 5 thinks adaptively by default; thinking counts toward max_tokens.
      max_tokens: 8000,
      system,
      messages: [{ role: "user", content: opts.text }],
      // Low effort found the same errors as medium in testing, at about half
      // the tokens and latency.
      output_config: { effort: "low", format: zodOutputFormat(CorrectionSchema) },
    });
  } catch (err) {
    // The SDK throws a plain AnthropicError when the JSON fails to parse or
    // fails Zod validation (e.g. truncated output). Real API errors
    // (rate limit, overload, auth) are APIError subclasses and propagate.
    if (err instanceof Anthropic.APIError || !(err instanceof Anthropic.AnthropicError)) throw err;
    console.warn("Correction output failed validation:", err.message);
    return { ok: false, reason: "invalid_output", promptVersion, model };
  }
  await recordUsage(opts.userId, response.usage);

  // A failed correction must never break the chat: the caller shows the
  // roleplay reply either way and just skips cards for this message.
  if (response.stop_reason === "max_tokens") {
    return { ok: false, reason: "truncated", promptVersion, model };
  }
  if (response.stop_reason === "refusal") {
    return { ok: false, reason: "refusal", promptVersion, model };
  }
  if (!response.parsed_output) {
    return { ok: false, reason: "invalid_output", promptVersion, model };
  }
  return { ok: true, correction: response.parsed_output, promptVersion, model };
}
