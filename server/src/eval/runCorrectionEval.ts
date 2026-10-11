// Measures correction quality on a fixed sentence set.
//
//   npm run eval:correction -- --prompt v2   (Ollama, OLLAMA_MODEL from .env)
//
// Runs the same path as the app: model → Zod → sanitizer. Free with Ollama;
// the paid Claude provider is deliberately not wired in here.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { sanitizeCorrection } from "../llm/sanitize.js";
import type { LlmProvider } from "../llm/types.js";
import { CORRECTION_CASES } from "./cases.js";
import { scoreCase, summarize, type CaseResult } from "./score.js";

const { values } = parseArgs({
  options: {
    prompt: { type: "string", default: "v1" },
  },
});

const provider: LlmProvider = (await import("../llm/ollama.js")).ollamaProvider;
const label = `${provider.mode}:${provider.model} · correction.${values.prompt}`;
console.log(`\nCorrection eval — ${label} — ${CORRECTION_CASES.length} sentences\n`);

const results: CaseResult[] = [];
const details = [];
for (const c of CORRECTION_CASES) {
  const started = Date.now();
  let correction = null;
  let reason = "";
  try {
    const raw = await provider.correct({
      userId: "eval",
      text: c.text,
      level: "A2",
      nativeLanguage: "hu",
      promptVersion: values.prompt,
    });
    if (raw.ok) correction = sanitizeCorrection(c.text, raw.correction);
    else reason = raw.reason;
  } catch (err) {
    reason = err instanceof Error ? err.message : String(err);
  }
  const r = scoreCase(c, correction, Date.now() - started);
  results.push(r);
  details.push({ ...r, text: c.text, reason, correctedMessage: correction?.correctedMessage ?? null, corrections: correction?.corrections ?? [] });

  const mark = !r.ok ? "!!" : r.expected === 0 ? (r.extra ? "FA" : "ok") : r.caught === r.expected ? "ok" : "--";
  const found = (correction?.corrections ?? []).map((i) => `${i.original}→${i.corrected} [${i.errorType}]`).join("; ");
  console.log(
    `${mark} ${String(r.caught).padStart(1)}/${r.expected} +${r.extra}  ${String(r.ms).padStart(5)}ms  ${c.text}` +
      (found ? `\n        ${found}` : "") +
      (reason ? `\n        (${reason})` : ""),
  );
}

const s = summarize(CORRECTION_CASES, results);
const pct = (x: number) => `${Math.round(x * 100)}%`;
console.log(`
Summary — ${label}
  recall (errors found)          ${pct(s.recall)}
  sentences fully corrected      ${pct(s.fullyCorrected)}
  false alarms on correct ones   ${pct(s.falseAlarmRate)}
  error type accuracy            ${pct(s.typeAccuracy)}
  precise fragment (card-ready)  ${pct(s.precision)}
  extra corrections (wrong ones) ${s.extraOnWrongSentences}
  failed / invalid outputs       ${s.failed}
  avg latency                    ${s.avgMs} ms
`);

const dir = path.resolve("eval-results");
await mkdir(dir, { recursive: true });
const file = path.join(dir, `correction-${provider.model.replace(/[:/]/g, "_")}-${values.prompt}-${Date.now()}.json`);
await writeFile(file, JSON.stringify({ label, summary: s, details }, null, 2));
console.log(`Saved: ${path.relative(process.cwd(), file)}`);
process.exit(0);
