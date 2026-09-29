import { describe, expect, it } from "vitest";
import { mockCorrect, mockReply, mockStreamRoleplay, mockTranslate } from "./mock.js";
import { MOCK_FALLBACK, getSituation } from "../situations.js";

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

describe("mock roleplay", () => {
  const arzt = getSituation("arzt")!;
  const opening = { role: "assistant" as const, content: arzt.opening.de };

  it("streams the situation's script in several chunks", async () => {
    const chunks: string[] = [];
    const history = [opening, { role: "user" as const, content: "Ich habe Kopfschmerzen." }];
    for await (const chunk of mockStreamRoleplay({ situationId: "arzt", history }, 0)) chunks.push(chunk);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join("")).toBe(arzt.mockScript[0]!.de);
  });

  it("advances one script line per partner reply", () => {
    const history = [
      opening,
      { role: "user" as const, content: "Ich habe Kopfschmerzen." },
      { role: "assistant" as const, content: arzt.mockScript[0]!.de },
      { role: "user" as const, content: "Seit gestern." },
    ];
    expect(mockReply({ situationId: "arzt", history })).toBe(arzt.mockScript[1]!.de);
  });

  it("falls back to a generic line when the script runs out", () => {
    const history = Array.from({ length: 20 }, (_, i) => ({
      role: i % 2 ? ("user" as const) : ("assistant" as const),
      content: "…",
    }));
    expect(mockReply({ situationId: "arzt", history })).toBe(MOCK_FALLBACK.de);
  });
});

describe("mockTranslate", () => {
  it("knows the Hungarian translation of every scripted line", () => {
    const arzt = getSituation("arzt")!;
    expect(mockTranslate(arzt.opening.de, "hu")).toBe(arzt.opening.hu);
    expect(mockTranslate(arzt.mockScript[2]!.de, "hu")).toBe(arzt.mockScript[2]!.hu);
  });

  it("marks unknown text and other languages as mock output", () => {
    expect(mockTranslate("Etwas ganz anderes.", "hu").startsWith("[Mock-fordítás]")).toBe(true);
    expect(mockTranslate(getSituation("arzt")!.opening.de, "en").startsWith("[Mock-fordítás]")).toBe(true);
  });
});
