import { z } from "zod";
import { env } from "../config/env.js";
import { CorrectionSchema } from "./correctionSchema.js";
import { loadPrompt } from "./prompts.js";
import type { CorrectParams, CorrectionResult, LlmProvider, RoleplayParams, TranslateParams } from "./types.js";

// Free, local alternative to Claude (LLM_MODE=ollama), using Ollama's REST API
// directly: https://github.com/ollama/ollama/blob/main/docs/api.md
// Same prompts and the same Zod schema as the Claude provider, so the modes
// stay comparable.

const LANGUAGE_NAMES: Record<string, string> = { hu: "Hungarian", en: "English", tr: "Turkish" };
const MODEL_LABEL = `ollama:${env.OLLAMA_MODEL}`;
// A 4k context is plenty for one conversation and lets a 4B model fit fully
// into a 4 GB laptop GPU (the 16k default spills over to the CPU).
const BASE_OPTIONS = { num_ctx: 4096 };
// Keep the model loaded between messages; loading it takes ~30 s on a laptop.
const KEEP_ALIVE = "30m";
// The correction schema as JSON Schema, for Ollama's structured output.
const CORRECTION_JSON_SCHEMA = z.toJSONSchema(CorrectionSchema);

interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatChunk {
  message?: { content: string };
  done: boolean;
  error?: string;
}

async function chat(body: Record<string, unknown>, signal?: AbortSignal) {
  let res: Response;
  try {
    res = await fetch(`${env.OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: env.OLLAMA_MODEL, keep_alive: KEEP_ALIVE, ...body }),
      signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new Error(`Ollama is not reachable at ${env.OLLAMA_URL}. Is it running? (${String(err)})`);
  }
  if (!res.ok) {
    throw new Error(`Ollama error ${res.status}: ${await res.text()}`);
  }
  return res;
}

// Non-streamed calls always get a token cap and a deadline: a small model can
// occasionally keep generating without stopping, and without these limits that
// request (and the chat message waiting on it) would hang for minutes.
async function complete(
  messages: OllamaMessage[],
  options: Record<string, unknown> & { num_predict: number },
  limits: { timeoutMs: number; format?: unknown },
) {
  const res = await chat(
    {
      messages,
      stream: false,
      options: { ...BASE_OPTIONS, ...options },
      ...(limits.format ? { format: limits.format } : {}),
    },
    AbortSignal.timeout(limits.timeoutMs),
  );
  const data = (await res.json()) as ChatChunk;
  if (data.error) throw new Error(`Ollama error: ${data.error}`);
  return data.message?.content ?? "";
}

function toOllamaHistory(history: RoleplayParams["history"]): OllamaMessage[] {
  return history.map((m) => ({
    role: m.role,
    content: typeof m.content === "string" ? m.content : m.content.map((b) => ("text" in b ? b.text : "")).join(""),
  }));
}

async function* streamRoleplay(opts: RoleplayParams): AsyncGenerator<string, void> {
  const { text: system } = await loadPrompt("roleplay", {
    situation: opts.situation,
    role: opts.role,
    level: opts.level,
    tasks: opts.tasks.map((t) => `- ${t}`).join("\n"),
  });

  // Aborted in `finally`, so a client that leaves mid-stream also stops the model.
  const controller = new AbortController();
  try {
    const res = await chat(
      {
        messages: [{ role: "system", content: system }, ...toOllamaHistory(opts.history)],
        stream: true,
        // Short replies, like the Claude provider's max_tokens cap.
        options: { ...BASE_OPTIONS, temperature: 0.7, num_predict: 200 },
      },
      controller.signal,
    );
    if (!res.body) throw new Error("Ollama returned no body");

    // The stream is newline-delimited JSON: one ChatChunk per line.
    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      let newline: number;
      while ((newline = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line) continue;
        const chunk = JSON.parse(line) as ChatChunk;
        if (chunk.error) throw new Error(`Ollama error: ${chunk.error}`);
        if (chunk.message?.content) yield chunk.message.content;
        if (chunk.done) return;
      }
    }
  } finally {
    controller.abort();
  }
}

async function correct(opts: CorrectParams): Promise<CorrectionResult> {
  const { text: system, version: promptVersion } = await loadPrompt(
    "correction",
    { level: opts.level, nativeLanguage: LANGUAGE_NAMES[opts.nativeLanguage] ?? "English" },
    opts.promptVersion,
  );
  let content: string;
  try {
    content = await complete(
      [
        { role: "system", content: system },
        { role: "user", content: opts.text },
      ],
      // Room for a few corrections with explanations, nowhere near a runaway.
      { temperature: 0, num_predict: 600 },
      { timeoutMs: 45_000, format: CORRECTION_JSON_SCHEMA },
    );
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.warn("Ollama correction timed out");
      return { ok: false, reason: "timeout", promptVersion, model: MODEL_LABEL };
    }
    throw err;
  }

  // Constrained decoding makes valid JSON likely, not guaranteed: validate
  // exactly like the Claude path, and skip the correction if it doesn't fit.
  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch {
    // Usually output cut off at the token cap.
    console.warn("Ollama correction was not valid JSON:", content.slice(0, 200));
    return { ok: false, reason: "invalid_output", promptVersion, model: MODEL_LABEL };
  }
  const parsed = CorrectionSchema.safeParse(json);
  if (!parsed.success) {
    console.warn("Ollama correction failed validation:", z.prettifyError(parsed.error));
    return { ok: false, reason: "invalid_output", promptVersion, model: MODEL_LABEL };
  }
  return { ok: true, correction: parsed.data, promptVersion, model: MODEL_LABEL };
}

async function translate(opts: TranslateParams) {
  const { text: system } = await loadPrompt("translate", {
    language: LANGUAGE_NAMES[opts.targetLanguage] ?? "English",
  });
  const text = (
    await complete(
      [
        { role: "system", content: system },
        { role: "user", content: opts.text },
      ],
      { temperature: 0.2, num_predict: 300 },
      { timeoutMs: 30_000 },
    )
  ).trim();
  if (!text) throw new Error("Empty translation");
  return { text, model: MODEL_LABEL };
}

// Startup check, so a missing model shows up in the terminal right away
// instead of as a failed chat message.
export async function checkOllama() {
  try {
    const res = await fetch(`${env.OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
    const { models } = (await res.json()) as { models: { name: string }[] };
    const names = models.map((m) => m.name);
    const wanted = env.OLLAMA_MODEL.includes(":") ? env.OLLAMA_MODEL : `${env.OLLAMA_MODEL}:latest`;
    if (!names.includes(wanted)) {
      return `⚠️ model ${env.OLLAMA_MODEL} not found, run: ollama pull ${env.OLLAMA_MODEL}`;
    }
    // Load the model now (a chat with no messages just loads it), so the
    // learner's first message doesn't pay the start-up time.
    const started = Date.now();
    await chat({ messages: [], options: BASE_OPTIONS });
    return `model ${env.OLLAMA_MODEL} loaded in ${((Date.now() - started) / 1000).toFixed(1)} s`;
  } catch {
    return `⚠️ Ollama not reachable at ${env.OLLAMA_URL}; start the Ollama app`;
  }
}

export const ollamaProvider: LlmProvider = {
  mode: "ollama",
  concurrent: false,
  model: env.OLLAMA_MODEL,
  correct,
  streamRoleplay,
  translate,
};
