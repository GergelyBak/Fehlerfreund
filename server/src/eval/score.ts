import type { Correction, CorrectionItem } from "../llm/correctionSchema.js";
import type { EvalCase, ExpectedError } from "./cases.js";
import { containsPhrase, words } from "../lib/phrase.js";

export { containsPhrase };

// Scoring is deliberately lenient about *how* the model phrases a fix and
// strict about *whether* it found the error: an expected error counts as
// caught when one correction points at an overlapping fragment and its fix
// contains the expected word(s).

/** Fragments overlap when one contains the other word-wise. */
export function fragmentsOverlap(a: string, b: string) {
  return containsPhrase(a, b) || containsPhrase(b, a);
}

export function catches(item: CorrectionItem, expected: ExpectedError) {
  return fragmentsOverlap(item.original, expected.original) && containsPhrase(item.corrected, expected.fix);
}

export interface CaseResult {
  id: string;
  ok: boolean; // false = no usable correction (invalid output, refusal, error)
  expected: number;
  caught: number;
  typeCorrect: number;
  // Caught errors whose `original` is a tight fragment, not half the sentence.
  // Matters for flashcards: a vague fragment makes a confusing card.
  precise: number;
  // Corrections that match no expected error. On a correct sentence every one
  // is a false alarm; on a wrong one it may be a fair extra find.
  extra: number;
  ms: number;
}

export function scoreCase(c: EvalCase, correction: Correction | null, ms: number): CaseResult {
  if (!correction) return { id: c.id, ok: false, expected: c.errors.length, caught: 0, typeCorrect: 0, precise: 0, extra: 0, ms };
  const items = correction.corrections;
  let caught = 0;
  let typeCorrect = 0;
  let precise = 0;
  for (const e of c.errors) {
    const hit = items.find((i) => catches(i, e));
    if (hit) {
      caught++;
      if (e.types.includes(hit.errorType)) typeCorrect++;
      if (words(hit.original).length <= words(e.original).length + 2) precise++;
    }
  }
  const extra = items.filter((i) => !c.errors.some((e) => catches(i, e))).length;
  return { id: c.id, ok: true, expected: c.errors.length, caught, typeCorrect, precise, extra, ms };
}

export function summarize(cases: EvalCase[], results: CaseResult[]) {
  const byId = new Map(cases.map((c) => [c.id, c]));
  const wrong = results.filter((r) => byId.get(r.id)!.errors.length > 0);
  const correct = results.filter((r) => byId.get(r.id)!.errors.length === 0);
  const sum = (rs: CaseResult[], f: (r: CaseResult) => number) => rs.reduce((s, r) => s + f(r), 0);

  const expected = sum(wrong, (r) => r.expected);
  const caught = sum(wrong, (r) => r.caught);
  return {
    cases: results.length,
    failed: results.filter((r) => !r.ok).length,
    // Share of real errors found.
    recall: expected ? caught / expected : 0,
    // Sentences where every error was found.
    fullyCorrected: wrong.length ? wrong.filter((r) => r.caught === r.expected).length / wrong.length : 0,
    // Correct sentences the model wrongly flagged.
    falseAlarmRate: correct.length ? correct.filter((r) => r.extra > 0).length / correct.length : 0,
    // Of the errors found, how many got an acceptable category.
    typeAccuracy: caught ? sum(wrong, (r) => r.typeCorrect) / caught : 0,
    // Of the errors found, how many were marked with a tight fragment.
    precision: caught ? sum(wrong, (r) => r.precise) / caught : 0,
    extraOnWrongSentences: sum(wrong, (r) => r.extra),
    avgMs: Math.round(sum(results, (r) => r.ms) / Math.max(results.length, 1)),
  };
}
