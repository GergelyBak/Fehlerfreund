import { anthropic, MODELS } from "./client.js";
import { loadPrompt } from "./prompts.js";
import { recordUsage } from "./usage.js";
import type { TranslateParams } from "./types.js";

const LANGUAGE_NAMES: Record<string, string> = { hu: "Hungarian", en: "English" };

export async function translateText(opts: TranslateParams) {
  const { text: system } = await loadPrompt("translate", {
    language: LANGUAGE_NAMES[opts.targetLanguage] ?? "English",
  });
  const model = MODELS.translation;

  const response = await anthropic.messages.create({
    model,
    // Room for adaptive thinking on top of a short translation.
    max_tokens: 2048,
    output_config: { effort: "low" },
    system,
    messages: [{ role: "user", content: opts.text }],
  });
  await recordUsage(opts.userId, response.usage);

  if (response.stop_reason === "refusal" || response.stop_reason === "max_tokens") {
    throw new Error(`Translation stopped: ${response.stop_reason}`);
  }
  const text = response.content
    .flatMap((block) => (block.type === "text" ? [block.text] : []))
    .join("")
    .trim();
  if (!text) throw new Error("Empty translation");
  return { text, model };
}
