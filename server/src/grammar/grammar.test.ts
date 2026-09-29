import { describe, expect, it } from "vitest";
import { ERROR_TYPES } from "../llm/correctionSchema.js";
import { GRAMMAR_TOPICS, fillGap, getTopic, gradeTopic, isCorrect, normalizeAnswer, toPublicTopic } from "./index.js";
import { GAP } from "./types.js";

// Hand-written content is easy to break with a typo; these guard it.
describe("grammar content", () => {
  it("has unique topic ids and orders", () => {
    expect(new Set(GRAMMAR_TOPICS.map((t) => t.id)).size).toBe(GRAMMAR_TOPICS.length);
    expect(new Set(GRAMMAR_TOPICS.map((t) => t.order)).size).toBe(GRAMMAR_TOPICS.length);
  });

  it.each(GRAMMAR_TOPICS.map((t) => [t.id, t] as const))("%s is well-formed", (_id, topic) => {
    expect(ERROR_TYPES).toContain(topic.errorType);
    expect(topic.lesson.length).toBeGreaterThan(0);
    expect(topic.exercises.length).toBeGreaterThanOrEqual(8);
    expect(new Set(topic.exercises.map((e) => e.id)).size).toBe(topic.exercises.length);

    for (const section of topic.lesson) {
      for (const row of section.table?.rows ?? []) {
        expect(row).toHaveLength(section.table!.headers.length);
      }
    }
    for (const e of topic.exercises) {
      // Exactly one gap per sentence.
      expect(e.prompt.split(GAP)).toHaveLength(2);
      expect(e.explanation.trim()).not.toBe("");
      if (e.type === "choice") {
        expect(e.options).toContain(e.answer);
        expect(new Set(e.options).size).toBe(e.options.length);
      } else {
        expect(e.answers.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps solutions and explanations out of the public shape", () => {
    const json = JSON.stringify(toPublicTopic(getTopic("perfekt")!));
    expect(json).not.toContain("explanation");
    expect(json).not.toContain("answers");
    expect(json).not.toContain('"answer"');
    expect(json).not.toContain("errorType");
  });
});

describe("answer checking", () => {
  const gap = getTopic("komparation")!.exercises.find((e) => e.id === "k8")!; // höchsten

  it("accepts case, spacing and ae/oe/ue/ss spellings", () => {
    expect(isCorrect(gap, "höchsten")).toBe(true);
    expect(isCorrect(gap, "  Höchsten ")).toBe(true);
    expect(isCorrect(gap, "hoechsten")).toBe(true);
    expect(normalizeAnswer("Größer.")).toBe("groesser");
  });

  it("rejects wrong forms and empty answers", () => {
    expect(isCorrect(gap, "hochsten")).toBe(false);
    expect(isCorrect(gap, "")).toBe(false);
  });

  it("requires the exact option for choice exercises", () => {
    const choice = getTopic("perfekt")!.exercises.find((e) => e.id === "p1")!; // bin
    expect(isCorrect(choice, "bin")).toBe(true);
    expect(isCorrect(choice, "habe")).toBe(false);
  });

  it("grades a whole test", () => {
    const topic = getTopic("perfekt")!;
    const { score, total, results } = gradeTopic(topic, { p1: "bin", p2: "sind", p5: "gegessen" });
    expect(total).toBe(topic.exercises.length);
    expect(score).toBe(2);
    expect(results.find((r) => r.id === "p2")).toMatchObject({ correct: false, given: "sind", solution: "haben" });
  });

  it("fills the gap for flashcards", () => {
    expect(fillGap("Gestern ___ ich ins Kino gegangen.", "habe")).toBe("Gestern habe ich ins Kino gegangen.");
  });
});
