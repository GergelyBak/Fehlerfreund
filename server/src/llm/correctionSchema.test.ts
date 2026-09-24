import { describe, expect, it } from "vitest";
import { CorrectionSchema } from "./correctionSchema.js";

const valid = {
  hasErrors: true,
  correctedMessage: "Ich fahre mit dem Bus.",
  corrections: [
    {
      original: "mit der Bus",
      corrected: "mit dem Bus",
      errorType: "Kasus",
      severity: "major",
      explanation: "A 'mit' után mindig Dativ áll.",
    },
  ],
};

describe("CorrectionSchema", () => {
  it("accepts a well-formed correction", () => {
    expect(CorrectionSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts the no-error case", () => {
    const result = CorrectionSchema.safeParse({
      hasErrors: false,
      correctedMessage: "Guten Tag!",
      corrections: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an error type outside the closed list", () => {
    const bad = structuredClone(valid);
    bad.corrections[0]!.errorType = "Dativ";
    expect(CorrectionSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects missing fields", () => {
    const { correctedMessage: _omit, ...bad } = valid;
    expect(CorrectionSchema.safeParse(bad).success).toBe(false);
  });
});
