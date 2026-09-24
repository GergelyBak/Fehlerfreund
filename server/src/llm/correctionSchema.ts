import { z } from "zod";

// Closed list so the statistics page can aggregate by type.
export const ERROR_TYPES = [
  "Kasus",
  "Artikel",
  "Wortstellung",
  "Verbkonjugation",
  "Tempus",
  "Präposition",
  "Adjektivdeklination",
  "Rechtschreibung",
  "Wortwahl",
  "Sonstiges",
] as const;

export const SEVERITIES = ["minor", "major"] as const;

export const CorrectionItemSchema = z.object({
  original: z.string().describe("The exact erroneous fragment from the learner's message"),
  corrected: z.string().describe("The corrected fragment"),
  errorType: z.enum(ERROR_TYPES),
  severity: z
    .enum(SEVERITIES)
    .describe("major = grammatical error worth practising; minor = style or small slip"),
  explanation: z
    .string()
    .describe("One or two short sentences in the learner's native language"),
});

export const CorrectionSchema = z.object({
  hasErrors: z.boolean(),
  correctedMessage: z
    .string()
    .describe("The full learner message with all errors fixed; identical to the input if none"),
  corrections: z.array(CorrectionItemSchema),
});

export type Correction = z.infer<typeof CorrectionSchema>;
export type CorrectionItem = z.infer<typeof CorrectionItemSchema>;
export type ErrorType = (typeof ERROR_TYPES)[number];
