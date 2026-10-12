export type VocabLevel = "A1" | "A2" | "B1";
export type WordType = "n" | "v" | "a" | "x"; // noun, verb, adjective/adverb, other (phrases, small words)

export interface VocabWord {
  id: string;
  type: WordType;
  // German, nouns with their article. Accepted alternatives are separated by
  // " / " (e.g. "der Lehrer / die Lehrerin").
  de: string;
  // Nouns: the plural ("–" if none). Irregular verbs: "er isst, hat gegessen".
  forms: string;
  hu: string;
  en: string;
  example: string;
}

export interface VocabTheme {
  id: string;
  level: VocabLevel;
  order: number;
  title: { hu: string; en: string };
  words: VocabWord[];
}
