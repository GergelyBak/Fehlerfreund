import { describe, expect, it } from "vitest";
import { SITUATIONS, UI_LANGUAGES, toPublicSituation } from "./situations.js";

// Guards the hand-written content: easy to break when adding a situation.
describe("situations content", () => {
  it("has unique situation ids", () => {
    const ids = SITUATIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(SITUATIONS.map((s) => [s.id, s] as const))("%s is complete in every UI language", (_id, s) => {
    expect(s.tasks).toHaveLength(3);
    expect(new Set(s.tasks.map((t) => t.id)).size).toBe(3);
    expect(s.phrases.length).toBeGreaterThanOrEqual(6);
    for (const lang of UI_LANGUAGES) {
      expect(s.title[lang].trim()).not.toBe("");
      expect(s.description[lang].trim()).not.toBe("");
      for (const line of [s.opening, ...s.phrases]) expect(line[lang].trim(), `${s.id}: ${line.de}`).not.toBe("");
      for (const task of s.tasks) expect(task[lang].trim(), `${s.id}: ${task.id}`).not.toBe("");
    }
    for (const line of [s.opening, ...s.phrases]) expect(line.de.trim()).not.toBe("");
    for (const task of s.tasks) expect(task.de.trim()).not.toBe("");
  });

  it("keeps prompt-only fields out of the public shape", () => {
    const pub = toPublicSituation(SITUATIONS[0]!, "hu");
    expect(pub).not.toHaveProperty("scenario");
    expect(pub).not.toHaveProperty("role");
    expect(pub.tasks[0]).not.toHaveProperty("de");
  });

  it("serves the requested language", () => {
    const supermarket = SITUATIONS.find((s) => s.id === "supermarkt")!;
    expect(toPublicSituation(supermarket, "hu").title).toBe("Szupermarketben");
    const en = toPublicSituation(supermarket, "en");
    expect(en.title).toBe("At the supermarket");
    expect(en.phrases[0]).toEqual({ de: "Entschuldigung, wo finde ich Mehl?", translation: "Excuse me, where can I find flour?" });
  });
});
