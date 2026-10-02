// Word-level phrase matching, ignoring case and punctuation.

export function words(s: string) {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"„“”']/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Does `haystack` contain `needle` as a whole-word sequence? */
export function containsPhrase(haystack: string, needle: string) {
  const h = words(haystack);
  const n = words(needle);
  if (n.length === 0) return false;
  return h.some((_, i) => n.every((w, j) => h[i + j] === w));
}
