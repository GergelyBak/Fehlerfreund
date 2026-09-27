import { describe, expect, it } from "vitest";
import { mockCorrect, mockStreamRoleplay } from "./mock.js";

describe("mockCorrect", () => {
  it("finds the typical errors and fixes the full message", () => {
    const result = mockCorrect("Ich habe gestern mit der Bus zu Arzt gefahren.");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { correction } = result;
    expect(correction.hasErrors).toBe(true);
    expect(correction.corrections.map((c) => c.errorType)).toEqual(["Tempus", "Kasus", "Präposition"]);
    expect(correction.correctedMessage).toBe("Ich bin gestern mit dem Bus zum Arzt gefahren.");
  });

  it("keeps sentence-initial capitalisation", () => {
    const result = mockCorrect("Ich habe 25 Jahre alt.");
    expect(result.ok && result.correction.correctedMessage).toBe("Ich bin 25 Jahre alt.");
  });

  it("returns the no-error shape for a correct sentence", () => {
    const result = mockCorrect("Guten Tag, ich möchte eine Wohnung besichtigen.");
    expect(result).toMatchObject({
      ok: true,
      correction: { hasErrors: false, corrections: [] },
    });
  });
});

describe("mockStreamRoleplay", () => {
  it("streams a reply in several chunks and advances with the conversation", async () => {
    const collect = async (history: Parameters<typeof mockStreamRoleplay>[0]["history"]) => {
      const chunks: string[] = [];
      for await (const chunk of mockStreamRoleplay({ history }, 0)) chunks.push(chunk);
      return chunks;
    };

    const first = await collect([{ role: "user", content: "Hallo" }]);
    expect(first.length).toBeGreaterThan(1);

    const second = await collect([
      { role: "user", content: "Hallo" },
      { role: "assistant", content: first.join("") },
      { role: "user", content: "Ich brauche einen Termin." },
    ]);
    expect(second.join("")).not.toBe(first.join(""));
  });
});
