import type { CorrectionItem, ErrorType } from "../llm/correctionSchema.js";

// Pure helpers that turn one correction into flashcard content.

export function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"„“”']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Same rule + same fix = same card, even from different sentences
// (e.g. every "habe → bin" with a motion verb).
export function cardKey(errorType: ErrorType, corrected: string) {
  return `${errorType}:${normalize(corrected)}`;
}

/**
 * The front of the card is the learner's sentence with *only this* error left
 * in: we take the fully corrected sentence and put the one mistake back. That
 * way each card practises exactly one rule.
 */
export function buildPrompt(item: Pick<CorrectionItem, "original" | "corrected">, correctedSentence: string, sourceSentence: string) {
  const at = correctedSentence.indexOf(item.corrected);
  if (at === -1) return sourceSentence;
  return correctedSentence.slice(0, at) + item.original + correctedSentence.slice(at + item.corrected.length);
}
