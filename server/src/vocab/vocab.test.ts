import { describe, expect, it } from "vitest";
import { gradeWord, normalize } from "./grade.js";
import { VOCAB_THEMES, getTheme, gradeTheme, toPublicTheme } from "./index.js";

// Guards the hand-written word lists: thousands of lines are easy to break.
describe("vocabulary content", () => {
  const words = VOCAB_THEMES.flatMap((t) => t.words.map((w) => ({ theme: t.id, level: t.level, ...w })));

  it("has unique theme ids and unique level + order", () => {
    expect(new Set(VOCAB_THEMES.map((t) => t.id)).size).toBe(VOCAB_THEMES.length);
    const keys = VOCAB_THEMES.map((t) => `${t.level}-${t.order}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("has unique word ids", () => {
    expect(new Set(words.map((w) => w.id)).size).toBe(words.length);
  });

  it("teaches every German word only once across all levels", () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const w of words) {
      const key = normalize(w.de);
      if (seen.has(key)) dupes.push(`${w.de} (${seen.get(key)} and ${w.theme})`);
      else seen.set(key, w.theme);
    }
    expect(dupes).toEqual([]);
  });

  it.each(VOCAB_THEMES.map((t) => [t.id, t] as const))("%s is complete", (_id, t) => {
    expect(t.title.hu.trim()).not.toBe("");
    expect(t.title.en.trim()).not.toBe("");
    // A test should be doable in one sitting.
    expect(t.words.length).toBeGreaterThanOrEqual(15);
    expect(t.words.length).toBeLessThanOrEqual(40);
    for (const w of t.words) {
      for (const field of [w.de, w.hu, w.en, w.example]) expect(field.trim(), w.id).not.toMatch(/^(|–)$/);
      expect(w.example, w.id).toMatch(/[.!?]$/);
      if (w.type === "n") {
        // Every noun variant carries its article, and the plural column is filled.
        for (const v of w.de.split(" / ")) expect(v, w.id).toMatch(/^(der|die|das) \S/);
        expect(w.forms, w.id).not.toBe("");
      }
    }
  });

  it.each(["A1", "A2"])("has a realistic %s size", (level) => {
    expect(words.filter((w) => w.level === level).length).toBeGreaterThanOrEqual(600);
  });
});

describe("gradeWord", () => {
  const apple = { type: "n" as const, de: "der Apfel" };

  it("accepts any case, umlaut spelling and trailing punctuation", () => {
    expect(gradeWord(apple, "der apfel")).toBe("correct");
    expect(gradeWord({ type: "n", de: "die Tür" }, "Die Tuer")).toBe("correct");
    expect(gradeWord({ type: "x", de: "Guten Morgen" }, "guten morgen!")).toBe("correct");
    expect(gradeWord({ type: "x", de: "Wie geht's" }, "Wie gehts?")).toBe("correct");
  });

  it("tells a wrong or missing article apart from a wrong word", () => {
    expect(gradeWord(apple, "die Apfel")).toBe("article");
    expect(gradeWord(apple, "Apfel")).toBe("article");
    expect(gradeWord(apple, "der Birne")).toBe("wrong");
    expect(gradeWord(apple, "  ")).toBe("empty");
  });

  it("accepts either form of a paired noun", () => {
    const teacher = { type: "n" as const, de: "der Lehrer / die Lehrerin" };
    expect(gradeWord(teacher, "die Lehrerin")).toBe("correct");
    expect(gradeWord(teacher, "der Lehrer")).toBe("correct");
    expect(gradeWord(teacher, "das Lehrer")).toBe("article");
  });

  it("does not demand 'sich' with reflexive verbs", () => {
    const verb = { type: "v" as const, de: "sich freuen" };
    expect(gradeWord(verb, "freuen")).toBe("correct");
    expect(gradeWord(verb, "sich freuen")).toBe("correct");
  });
});

describe("themes for the client", () => {
  it("serves translations in the requested language", () => {
    const theme = getTheme("a1-food")!;
    const apple = (lang: "hu" | "en") => toPublicTheme(theme, lang).words.find((w) => w.de === "der Apfel")!;
    expect(apple("hu").translation).toBe("alma");
    expect(apple("en").translation).toBe("apple");
    expect(toPublicTheme(theme, "en").title).toBe("Food");
  });

  it("grades a whole theme", () => {
    const theme = getTheme("a1-food")!;
    const [first, second] = theme.words;
    const { results, score, total } = gradeTheme(theme, { [first!.id]: first!.de, [second!.id]: "falsch" });
    expect(total).toBe(theme.words.length);
    expect(score).toBe(1);
    expect(results.find((r) => r.id === second!.id)?.verdict).toBe("wrong");
    expect(results.filter((r) => r.verdict === "empty")).toHaveLength(theme.words.length - 2);
  });
});
