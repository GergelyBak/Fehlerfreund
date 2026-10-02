import { describe, expect, it } from "vitest";
import type { CorrectionItem } from "../llm/correctionSchema.js";
import { CORRECTION_CASES } from "./cases.js";
import { catches, containsPhrase, scoreCase, summarize } from "./score.js";

const item = (original: string, corrected: string, errorType: CorrectionItem["errorType"] = "Kasus"): CorrectionItem => ({
  original,
  corrected,
  errorType,
  severity: "major",
  explanation: "…",
});

describe("containsPhrase", () => {
  it("matches whole words only", () => {
    expect(containsPhrase("mit dem Bus", "dem")).toBe(true);
    expect(containsPhrase("Ich weiß, dass er kommt", "das")).toBe(false);
    expect(containsPhrase("Gestern bin ich ins Kino", "bin ich")).toBe(true);
  });
});

describe("catches", () => {
  const expected = { original: "der Bus", fix: "dem", types: ["Kasus" as const] };

  it("accepts a wider or narrower fragment with the right fix", () => {
    expect(catches(item("mit der Bus", "mit dem Bus"), expected)).toBe(true);
    expect(catches(item("Bus", "dem Bus"), expected)).toBe(true);
  });

  it("rejects the right place with the wrong fix, or the wrong place", () => {
    expect(catches(item("der Bus", "den Bus"), expected)).toBe(false);
    expect(catches(item("zu Arzt", "zum Arzt"), expected)).toBe(false);
  });
});

describe("scoreCase / summarize", () => {
  const busCase = CORRECTION_CASES.find((c) => c.id === "bus-arzt")!;
  const okCase = CORRECTION_CASES.find((c) => c.id === "ok-wasser")!;

  it("counts caught errors, right types and extras", () => {
    const r = scoreCase(
      busCase,
      {
        hasErrors: true,
        correctedMessage: "Ich bin gestern mit dem Bus zum Arzt gefahren.",
        corrections: [item("habe", "bin", "Tempus"), item("mit der Bus", "mit dem Bus", "Präposition"), item("gestern", "heute")],
      },
      100,
    );
    expect(r).toMatchObject({ expected: 3, caught: 2, typeCorrect: 1, precise: 2, extra: 1 });
  });

  it("does not count a whole-sentence fragment as precise", () => {
    const tisch = CORRECTION_CASES.find((c) => c.id === "ein-tisch")!;
    const r = scoreCase(tisch, { hasErrors: true, correctedMessage: "x", corrections: [item("Haben Sie ein Tisch für zwei Personen?", "Haben Sie einen Tisch für zwei Personen?")] }, 1);
    expect(r).toMatchObject({ caught: 1, precise: 0 });
  });

  it("treats any correction on a correct sentence as a false alarm", () => {
    const flagged = scoreCase(okCase, { hasErrors: true, correctedMessage: "x", corrections: [item("gern", "gerne")] }, 1);
    const clean = scoreCase(okCase, { hasErrors: false, correctedMessage: okCase.text, corrections: [] }, 1);
    const s = summarize([okCase, okCase], [flagged, clean]);
    expect(s.falseAlarmRate).toBe(0.5);
  });

  it("has a balanced, well-formed case set", () => {
    const ids = CORRECTION_CASES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of CORRECTION_CASES) {
      for (const e of c.errors) expect(containsPhrase(c.text, e.original)).toBe(true);
    }
    expect(CORRECTION_CASES.filter((c) => c.errors.length === 0).length).toBeGreaterThanOrEqual(8);
  });
});
