import { describe, expect, it } from "vitest";
import { loadCorrectionPrompt, renderExamples } from "./correctionPrompt.js";

describe("correction prompt v3", () => {
  it("is identical to the measured v2 prompt for Hungarian learners", async () => {
    const v2 = await loadCorrectionPrompt({ level: "A2", nativeLanguage: "hu", promptVersion: "v2" });
    const v3 = await loadCorrectionPrompt({ level: "A2", nativeLanguage: "hu", promptVersion: "v3" });
    expect(v3.text).toBe(v2.text);
    expect(v3.version).toBe("correction.v3");
  });

  it("gives English learners English examples, so explanations stay English", async () => {
    const { text } = await loadCorrectionPrompt({ level: "B1", nativeLanguage: "en", promptVersion: "v3" });
    expect(text).toContain("one short sentence in English");
    expect(text).toContain("'mit' always takes the dative");
    // No Hungarian left anywhere in the prompt.
    expect(text).not.toMatch(/[őűáé]|Dativ áll/);
    expect(text).not.toContain("{{");
  });

  it("renders valid JSON answers with explanations for every correction", () => {
    for (const lang of ["hu", "en"]) {
      const answers = renderExamples(lang)
        .split("\n")
        .filter((line) => line.startsWith("Answer: "))
        .map((line) => JSON.parse(line.slice("Answer: ".length)));
      expect(answers).toHaveLength(8);
      for (const a of answers) for (const c of a.corrections) expect(c.explanation.length).toBeGreaterThan(10);
    }
  });
});
