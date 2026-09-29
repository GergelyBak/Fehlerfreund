import { CorrectionSchema, type CorrectionItem } from "./correctionSchema.js";
import { MOCK_FALLBACK, SITUATIONS, getSituation } from "../situations.js";
import type { CorrectParams, CorrectionResult, LlmProvider, RoleplayParams } from "./types.js";

// Free, offline stand-in for Claude, used during development (LLM_MODE=mock).
// It must not import env or the Anthropic client, so it runs without an API key.

interface MockRule {
  pattern: RegExp;
  replacement: string;
  errorType: CorrectionItem["errorType"];
  explanation: string;
}

// A handful of typical learner errors. Try e.g.
// "Ich habe gestern mit der Bus zu Arzt gefahren."
const RULES: MockRule[] = [
  {
    // Lookahead keeps the correction minimal ("habe" → "bin") so it doesn't
    // overlap with other errors between the auxiliary and the participle.
    pattern: /\bhabe(?=(?: \S+){0,6}? (?:gefahren|gegangen|gekommen|geflogen)\b)/i,
    replacement: "bin",
    errorType: "Tempus",
    explanation: "Helyváltoztatást kifejező igék (fahren, gehen, kommen) Perfektben 'sein' segédigét kapnak.",
  },
  {
    pattern: /\bmit der (Bus|Zug)\b/i,
    replacement: "mit dem $1",
    errorType: "Kasus",
    explanation: "A 'mit' után mindig Dativ áll: der Bus → mit dem Bus.",
  },
  {
    pattern: /\bzu Arzt\b/i,
    replacement: "zum Arzt",
    errorType: "Präposition",
    explanation: "zu + dem = zum; a névelő itt nem maradhat el.",
  },
  {
    pattern: /\bin der Bürgeramt\b/i,
    replacement: "im Bürgeramt",
    errorType: "Artikel",
    explanation: "A 'Bürgeramt' semleges nemű (das), ezért in + dem = im Bürgeramt.",
  },
  {
    pattern: /\bich habe (\d+) Jahre alt\b/i,
    replacement: "ich bin $1 Jahre alt",
    errorType: "Wortwahl",
    explanation: "Az életkort németül a 'sein' igével mondjuk: Ich bin 25 Jahre alt.",
  },
];

function matchCase(source: string, replacement: string) {
  const first = source.charAt(0);
  return first === first.toUpperCase()
    ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
    : replacement;
}

export function mockCorrect(text: string): CorrectionResult {
  const corrections: CorrectionItem[] = [];
  let correctedMessage = text;

  for (const rule of RULES) {
    const match = rule.pattern.exec(correctedMessage);
    if (!match) continue;
    const original = match[0];
    // Expand $1, $2… from this match; re-running the regex on the fragment
    // alone would fail for patterns with a lookahead.
    const expanded = rule.replacement.replace(/\$(\d)/g, (_, i: string) => match[Number(i)] ?? "");
    const corrected = matchCase(original, expanded);
    corrections.push({
      original,
      corrected,
      errorType: rule.errorType,
      severity: "major",
      explanation: rule.explanation,
    });
    correctedMessage =
      correctedMessage.slice(0, match.index) + corrected + correctedMessage.slice(match.index + original.length);
  }

  // Parse through the real schema so the mock can never drift from it.
  const correction = CorrectionSchema.parse({
    hasErrors: corrections.length > 0,
    correctedMessage,
    corrections,
  });
  return { ok: true, correction, promptVersion: "mock", model: "mock" };
}

// The partner's n-th reply follows the situation's script; the opening line
// is the first assistant message, so it is not counted.
export function mockReply(params: Pick<RoleplayParams, "situationId" | "history">) {
  const script = getSituation(params.situationId)?.mockScript ?? [];
  const replies = params.history.filter((m) => m.role === "assistant").length - 1;
  return (script[Math.max(replies, 0)] ?? MOCK_FALLBACK).de;
}

export async function* mockStreamRoleplay(
  params: Pick<RoleplayParams, "situationId" | "history">,
  delayMs = 40,
): AsyncGenerator<string, void> {
  // Word-by-word with a small delay, so the UI's streaming path is exercised.
  for (const chunk of mockReply(params).split(/(?<= )/)) {
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
    yield chunk;
  }
}

// Every German line the mock can produce, mapped to its Hungarian translation.
const KNOWN_TRANSLATIONS = new Map<string, string>(
  [MOCK_FALLBACK, ...SITUATIONS.flatMap((s) => [s.opening, ...s.mockScript, ...s.phrases])].map((l) => [l.de, l.hu]),
);

export function mockTranslate(text: string, targetLanguage: string) {
  const known = targetLanguage === "hu" ? KNOWN_TRANSLATIONS.get(text.trim()) : undefined;
  return known ?? `[Mock-fordítás] Élő módban (LLM_MODE=live) itt jelenne meg a valódi fordítás: „${text}”`;
}

export const mockProvider: LlmProvider = {
  mode: "mock",
  concurrent: true,
  correct: async (params: CorrectParams) => {
    // Simulate a little latency so loading states are visible.
    await new Promise((r) => setTimeout(r, 300));
    return mockCorrect(params.text);
  },
  streamRoleplay: (params) => mockStreamRoleplay(params),
  translate: async ({ text, targetLanguage }) => {
    await new Promise((r) => setTimeout(r, 250));
    return { text: mockTranslate(text, targetLanguage), model: "mock" };
  },
};
