import { describe, expect, it } from "vitest";
import { SITUATIONS, toPublicSituation } from "./situations.js";

// Guards the hand-written content: easy to break when adding a situation.
describe("situations content", () => {
  it("has unique situation ids", () => {
    const ids = SITUATIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(SITUATIONS.map((s) => [s.id, s] as const))("%s is complete", (_id, s) => {
    expect(s.tasks).toHaveLength(3);
    expect(new Set(s.tasks.map((t) => t.id)).size).toBe(3);
    expect(s.phrases.length).toBeGreaterThanOrEqual(6);
    expect(s.mockScript.length).toBeGreaterThanOrEqual(5);
    for (const line of [s.opening, ...s.phrases, ...s.mockScript]) {
      expect(line.de.trim()).not.toBe("");
      expect(line.hu.trim()).not.toBe("");
    }
    for (const task of s.tasks) {
      expect(task.hu.trim()).not.toBe("");
      expect(task.de.trim()).not.toBe("");
    }
  });

  it("keeps prompt-only fields out of the public shape", () => {
    const pub = toPublicSituation(SITUATIONS[0]!);
    expect(pub).not.toHaveProperty("scenario");
    expect(pub).not.toHaveProperty("mockScript");
    expect(pub.tasks[0]).not.toHaveProperty("de");
  });
});
