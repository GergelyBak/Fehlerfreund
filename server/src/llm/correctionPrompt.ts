import { loadPrompt } from "./prompts.js";

// The few-shot examples of the correction prompt, with each explanation in the
// learner's language. A small model copies the examples' language over the
// instruction: with Hungarian examples, English learners got their
// explanations in German. The Hungarian rendering is byte-identical to
// correction.v2, so v2's measured results still apply (see the test).

type ExampleLanguage = "hu" | "en";

interface Example {
  learner: string;
  correctedMessage: string;
  corrections: {
    original: string;
    corrected: string;
    errorType: string;
    severity: "major" | "minor";
    explanation: Record<ExampleLanguage, string>;
  }[];
}

const EXAMPLES: Example[] = [
  {
    learner: "Ich bin mit meine Freundin ins Kino gegangen.",
    correctedMessage: "Ich bin mit meiner Freundin ins Kino gegangen.",
    corrections: [
      {
        original: "meine Freundin",
        corrected: "meiner Freundin",
        errorType: "Kasus",
        severity: "major",
        explanation: {
          hu: "A 'mit' után mindig Dativ áll: die Freundin → mit meiner Freundin.",
          en: "'mit' always takes the dative: die Freundin → mit meiner Freundin.",
        },
      },
    ],
  },
  {
    learner: "Am Wochenende ich habe Fußball gespielt.",
    correctedMessage: "Am Wochenende habe ich Fußball gespielt.",
    corrections: [
      {
        original: "ich habe",
        corrected: "habe ich",
        errorType: "Wortstellung",
        severity: "major",
        explanation: {
          hu: "A ragozott ige mindig a 2. helyen áll: ha a mondat nem az alannyal kezdődik, az ige megelőzi az alanyt.",
          en: "The conjugated verb always comes second: if the sentence doesn't start with the subject, the verb comes before it.",
        },
      },
    ],
  },
  {
    learner: "Wir haben nach Hamburg gefahren.",
    correctedMessage: "Wir sind nach Hamburg gefahren.",
    corrections: [
      {
        original: "haben",
        corrected: "sind",
        errorType: "Tempus",
        severity: "major",
        explanation: {
          hu: "A 'fahren' helyváltoztatás, ezért Perfektben sein segédigét kap.",
          en: "'fahren' is a change of place, so its Perfekt uses 'sein'.",
        },
      },
    ],
  },
  {
    learner: "Ich weiß nicht, ob er kommt morgen.",
    correctedMessage: "Ich weiß nicht, ob er morgen kommt.",
    corrections: [
      {
        original: "kommt morgen",
        corrected: "morgen kommt",
        errorType: "Wortstellung",
        severity: "major",
        explanation: {
          hu: "Az 'ob' után a ragozott ige a mellékmondat végére kerül.",
          en: "After 'ob' the conjugated verb goes to the end of the clause.",
        },
      },
    ],
  },
  {
    learner: "Ich kaufe ein neuer Mantel, weil der alte Mantel kaputt sind.",
    correctedMessage: "Ich kaufe einen neuen Mantel, weil der alte Mantel kaputt ist.",
    corrections: [
      {
        original: "ein neuer Mantel",
        corrected: "einen neuen Mantel",
        errorType: "Kasus",
        severity: "major",
        explanation: {
          hu: "A 'kaufen' után Akkusativ áll: der Mantel → einen neuen Mantel.",
          en: "'kaufen' takes the accusative: der Mantel → einen neuen Mantel.",
        },
      },
      {
        original: "sind",
        corrected: "ist",
        errorType: "Verbkonjugation",
        severity: "major",
        explanation: {
          hu: "Az alany egyes számú (der Mantel), ezért az ige is egyes számú: ist.",
          en: "The subject is singular (der Mantel), so the verb is singular too: ist.",
        },
      },
    ],
  },
  {
    learner: "Ich habe keine zeit.",
    correctedMessage: "Ich habe keine Zeit.",
    corrections: [
      {
        original: "zeit",
        corrected: "Zeit",
        errorType: "Rechtschreibung",
        severity: "minor",
        explanation: {
          hu: "A németben minden főnevet nagy kezdőbetűvel írunk.",
          en: "In German every noun starts with a capital letter.",
        },
      },
    ],
  },
  {
    learner: "Wir treffen uns am Freitag um acht Uhr.",
    correctedMessage: "Wir treffen uns am Freitag um acht Uhr.",
    corrections: [],
  },
  {
    learner: "Wissen Sie, wann der nächste Zug fährt?",
    correctedMessage: "Wissen Sie, wann der nächste Zug fährt?",
    corrections: [],
  },
];

const LANGUAGE_NAMES: Record<ExampleLanguage, string> = { hu: "Hungarian", en: "English" };

const exampleLanguage = (nativeLanguage: string): ExampleLanguage => (nativeLanguage === "hu" ? "hu" : "en");

export function renderExamples(nativeLanguage: string) {
  const lang = exampleLanguage(nativeLanguage);
  return EXAMPLES.map((ex) => {
    // Key order matters: it's the order the model sees and copies.
    const answer = {
      hasErrors: ex.corrections.length > 0,
      correctedMessage: ex.correctedMessage,
      corrections: ex.corrections.map((c) => ({
        original: c.original,
        corrected: c.corrected,
        errorType: c.errorType,
        severity: c.severity,
        explanation: c.explanation[lang],
      })),
    };
    return `Learner: ${ex.learner}\nAnswer: ${JSON.stringify(answer)}`;
  }).join("\n\n");
}

/** The correction system prompt for one learner, shared by every provider. */
export function loadCorrectionPrompt(opts: { level: string; nativeLanguage: string; promptVersion?: string }) {
  const lang = exampleLanguage(opts.nativeLanguage);
  return loadPrompt(
    "correction",
    // v1/v2 have no {{examples}} slot; the variable is simply unused there.
    { level: opts.level, nativeLanguage: LANGUAGE_NAMES[lang], examples: renderExamples(lang) },
    opts.promptVersion,
  );
}
