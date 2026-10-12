import type { VocabWord } from "./types.js";

// Checking a typed answer against a word. Pure, so every rule is unit-tested.

export type Verdict = "correct" | "article" | "wrong" | "empty";

const ARTICLES = ["der", "die", "das"] as const;

/** Case, umlaut spelling (ae/oe/ue/ss), punctuation and spacing don't matter. */
export function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[.,!?;:'’¿¡]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const variants = (word: Pick<VocabWord, "de">) => word.de.split(" / ").map((v) => v.trim());

function splitArticle(s: string) {
  const [first, ...rest] = s.split(" ");
  return (ARTICLES as readonly string[]).includes(first!) ? { article: first!, noun: rest.join(" ") } : { article: null, noun: s };
}

export function gradeWord(word: Pick<VocabWord, "type" | "de">, given: string): Verdict {
  const g = normalize(given);
  if (!g) return "empty";
  const options = variants(word).map(normalize);
  if (options.includes(g)) return "correct";

  // Reflexive verbs count without "sich" too.
  if (word.type === "v" && options.some((o) => o.startsWith("sich ") && o.slice(5) === g)) return "correct";

  // Right noun, wrong or missing article: its own verdict, because that's a
  // different thing to practise than not knowing the word.
  if (word.type === "n") {
    const typed = splitArticle(g);
    if (options.some((o) => splitArticle(o).noun === typed.noun)) return "article";
  }
  return "wrong";
}
