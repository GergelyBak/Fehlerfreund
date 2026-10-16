import { A1_PART1 } from "./a1/part1.js";
import { A1_PART2 } from "./a1/part2.js";
import { A2_PART1 } from "./a2/part1.js";
import { A2_PART2 } from "./a2/part2.js";
import { B1_PART1 } from "./b1/part1.js";
import { B1_PART2 } from "./b1/part2.js";
import { gradeWord, variants, type Verdict } from "./grade.js";
import type { VocabTheme, VocabWord } from "./types.js";

export type { VocabTheme, VocabWord } from "./types.js";

export const VOCAB_THEMES: VocabTheme[] = [...A1_PART1, ...A1_PART2, ...A2_PART1, ...A2_PART2, ...B1_PART1, ...B1_PART2].sort(
  (a, b) => a.level.localeCompare(b.level) || a.order - b.order,
);

export function getTheme(id: string) {
  return VOCAB_THEMES.find((t) => t.id === id);
}

type Lang = "hu" | "en";

/** The prompt a learner translates from, in their language. */
export const translationOf = (word: VocabWord, lang: Lang) => (lang === "en" ? word.en : word.hu);

export function toPublicTheme(theme: VocabTheme, lang: Lang) {
  return {
    id: theme.id,
    level: theme.level,
    order: theme.order,
    title: theme.title[lang],
    // The German is public on purpose: the list is for studying. Only the
    // grading (and the cards it creates) happens on the server.
    words: theme.words.map((w) => ({
      id: w.id,
      type: w.type,
      de: w.de,
      forms: w.forms,
      translation: translationOf(w, lang),
      example: w.example,
    })),
  };
}

export interface WordResult {
  id: string;
  verdict: Verdict;
  given: string;
  solution: string;
}

export function gradeTheme(theme: VocabTheme, answers: Record<string, string>) {
  const results: WordResult[] = theme.words.map((w) => {
    const given = (answers[w.id] ?? "").trim();
    return { id: w.id, verdict: gradeWord(w, given), given, solution: variants(w).join(" / ") };
  });
  const score = results.filter((r) => r.verdict === "correct").length;
  return { results, score, total: theme.words.length };
}
