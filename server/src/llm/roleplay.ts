import { anthropic, MODELS } from "./client.js";
import { loadPrompt } from "./prompts.js";
import { recordUsage } from "./usage.js";
import type { RoleplayParams } from "./types.js";

export async function* streamRoleplay(opts: RoleplayParams): AsyncGenerator<string, void> {
  const { text: system } = await loadPrompt("roleplay", {
    situation: opts.situation,
    role: opts.role,
    level: opts.level,
  });

  const stream = anthropic.messages.stream({
    model: MODELS.roleplay,
    // Replies are 1–3 sentences; the cap doubles as a cost guard.
    max_tokens: 1024,
    // Short in-character replies don't need deep reasoning; keeps latency low.
    output_config: { effort: "low" },
    system,
    messages: opts.history,
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield event.delta.text;
    }
  }

  const final = await stream.finalMessage();
  await recordUsage(opts.userId, final.usage);
}
