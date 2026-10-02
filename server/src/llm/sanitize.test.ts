import { describe, expect, it } from "vitest";
import { sanitizeCorrection } from "./sanitize.js";
import type { CorrectionItem } from "./correctionSchema.js";

const item = (original: string, corrected: string): CorrectionItem => ({
  original,
  corrected,
  errorType: "Kasus",
  severity: "major",
  explanation: "…",
});

describe("sanitizeCorrection", () => {
  const text = "Ich habe gestern mit der Bus zu Arzt gefahren.";

  it("keeps real corrections", () => {
    const result = sanitizeCorrection(text, {
      hasErrors: true,
      correctedMessage: "Ich bin gestern mit dem Bus zum Arzt gefahren.",
      corrections: [item("habe", "bin"), item("mit der Bus", "mit dem Bus")],
    });
    expect(result.corrections).toHaveLength(2);
    expect(result.hasErrors).toBe(true);
  });

  it("drops a 'fix' that changes nothing", () => {
    // Real output from llama3.2:3b.
    const result = sanitizeCorrection(text, {
      hasErrors: true,
      correctedMessage: "Ich habe gestern mit dem Bus zum Arzt gefahren.",
      corrections: [item("Bus", "Bus"), item("zu Arzt", "zum Arzt")],
    });
    expect(result.corrections.map((c) => c.original)).toEqual(["zu Arzt"]);
  });

  it("drops a mistake that isn't in the learner's text", () => {
    const result = sanitizeCorrection(text, {
      hasErrors: true,
      correctedMessage: "Ich bin gestern mit dem Bus zum Arzt gefahren.",
      corrections: [item("mit die Bahn", "mit der Bahn")],
    });
    expect(result).toEqual({ hasErrors: false, correctedMessage: text, corrections: [] });
  });

  it("treats an unchanged sentence as error-free, whatever the list says", () => {
    // Real output from llama3.2:3b for a correct sentence.
    const ok = "Guten Tag, ich möchte eine Fahrkarte kaufen.";
    const result = sanitizeCorrection(ok, {
      hasErrors: true,
      correctedMessage: ok,
      corrections: [item("Fahrkarte", "eine Fahrkarte")],
    });
    expect(result).toEqual({ hasErrors: false, correctedMessage: ok, corrections: [] });
  });

  it("drops a fix that contradicts the model's own corrected sentence", () => {
    // Real output from gemma3:4b with prompt v2.
    const text = "Ich weiß nicht, wo ist der Bahnhof.";
    const result = sanitizeCorrection(text, {
      hasErrors: true,
      correctedMessage: "Ich weiß nicht, wo der Bahnhof ist.",
      corrections: [item("wo ist", "wo der ist")],
    });
    expect(result).toEqual({ hasErrors: false, correctedMessage: text, corrections: [] });
  });

  it("ignores case and punctuation when comparing", () => {
    const result = sanitizeCorrection("guten tag", {
      hasErrors: true,
      correctedMessage: "Guten Tag.",
      corrections: [item("guten tag", "Guten Tag.")],
    });
    expect(result.hasErrors).toBe(false);
  });
});
