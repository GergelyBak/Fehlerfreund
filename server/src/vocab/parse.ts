import type { VocabLevel, VocabTheme, VocabWord, WordType } from "./types.js";

// Word lists are written as one line per word, so thousands of entries stay
// readable and reviewable:
//
//   type | German | forms | Hungarian | English | example sentence
//   n | der Apfel | Äpfel | alma | apple | Ich esse einen Apfel.
//
// The content tests check every line (columns, articles, duplicates).

const TYPES = new Set<WordType>(["n", "v", "a", "x"]);

export function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/^(der|die|das) /, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseWords(themeId: string, block: string): VocabWord[] {
  return block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const cols = line.split("|").map((c) => c.trim());
      if (cols.length !== 6) throw new Error(`${themeId}: expected 6 columns, got ${cols.length}: ${line}`);
      const [type, de, forms, hu, en, example] = cols as [WordType, string, string, string, string, string];
      if (!TYPES.has(type)) throw new Error(`${themeId}: unknown word type "${type}": ${line}`);
      const first = de.split(" / ")[0]!;
      return { id: `${themeId}:${type}-${slug(first)}`, type, de, forms, hu, en, example };
    });
}

export function theme(
  id: string,
  level: VocabLevel,
  order: number,
  title: { hu: string; en: string },
  block: string,
): VocabTheme {
  return { id, level, order, title, words: parseWords(id, block) };
}
