import type { Correction } from "./correctionSchema.js";

// Deterministic sanity checks on a correction, whichever model produced it.
// A schema-valid answer can still be nonsense (small local models especially),
// and a bad correction here becomes a bad flashcard later.

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,!?;:"„“”']/g, "")
    .replace(/\s+/g, " ")
    .trim();

export function sanitizeCorrection(text: string, correction: Correction): Correction {
  // Nothing changed in the full sentence: whatever the list says, there was no error.
  if (norm(correction.correctedMessage) === norm(text)) {
    return { hasErrors: false, correctedMessage: text, corrections: [] };
  }

  const haystack = text.toLowerCase();
  const corrections = correction.corrections.filter(
    (c) =>
      // A "fix" that changes nothing.
      norm(c.original) !== norm(c.corrected) &&
      // The quoted mistake must actually be in what the learner wrote.
      c.original.trim() !== "" &&
      haystack.includes(c.original.trim().toLowerCase()),
  );

  return {
    hasErrors: corrections.length > 0,
    correctedMessage: corrections.length > 0 ? correction.correctedMessage : text,
    corrections,
  };
}
