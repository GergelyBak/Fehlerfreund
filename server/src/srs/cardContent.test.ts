import { describe, expect, it } from "vitest";
import { buildPrompt, cardKey, normalize } from "./cardContent.js";

describe("buildPrompt", () => {
  const source = "Ich habe gestern mit der Bus zu Arzt gefahren.";
  const corrected = "Ich bin gestern mit dem Bus zum Arzt gefahren.";

  it("leaves only the card's own error in the sentence", () => {
    expect(buildPrompt({ original: "mit der Bus", corrected: "mit dem Bus" }, corrected, source)).toBe(
      "Ich bin gestern mit der Bus zum Arzt gefahren.",
    );
    expect(buildPrompt({ original: "habe", corrected: "bin" }, corrected, source)).toBe(
      "Ich habe gestern mit dem Bus zum Arzt gefahren.",
    );
  });

  it("falls back to the original sentence when the fix can't be located", () => {
    expect(buildPrompt({ original: "x", corrected: "not in sentence" }, corrected, source)).toBe(source);
  });
});

describe("cardKey", () => {
  it("ignores case, punctuation and extra spaces", () => {
    expect(cardKey("Kasus", "Mit dem  Bus.")).toBe(cardKey("Kasus", "mit dem bus"));
  });

  it("keeps different rules apart", () => {
    expect(cardKey("Kasus", "dem Bus")).not.toBe(cardKey("Artikel", "dem Bus"));
  });

  it("normalizes German quotes too", () => {
    expect(normalize("„Hallo“, sagt er!")).toBe("hallo sagt er");
  });
});
