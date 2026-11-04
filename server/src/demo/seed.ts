import { Types } from "mongoose";
import type { CorrectionItem, ErrorType } from "../llm/correctionSchema.js";
import { getSituation } from "../situations.js";
import { buildPrompt, cardKey } from "../srs/cardContent.js";
import { vocabProgressId } from "../vocab/index.js";

// Sample history of a demo account: what a learner has after about two weeks.
// Pure (no DB, no clock), so a test can check it against the real schemas.
// Everything is placed relative to `now`, so the charts always look current.

export type DemoLanguage = "hu" | "en";
type Text = Record<DemoLanguage, string>;
type Fix = Omit<CorrectionItem, "explanation" | "severity"> & { explanation: Text };

interface Turn {
  said: string;
  // Omitted when the sentence had no mistake.
  fixed?: string;
  fixes?: Fix[];
  reply: { de: string } & Text;
}

interface SampleConversation {
  situationId: string;
  daysAgo: number;
  tasks: string[];
  turns: Turn[];
}

// Marks these as sample data: no model produced them.
const SAMPLE = "demo-sample";
const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

const CONVERSATIONS: SampleConversation[] = [
  {
    situationId: "restaurant",
    daysAgo: 10,
    tasks: ["tisch", "bestellen", "zahlen"],
    turns: [
      {
        said: "Nein, ich möchte ein Tisch für zwei Personen.",
        fixed: "Nein, ich möchte einen Tisch für zwei Personen.",
        fixes: [
          {
            original: "ein Tisch",
            corrected: "einen Tisch",
            errorType: "Kasus",
            explanation: {
              hu: "A möchte után tárgyeset (Akkusativ) áll, a der Tisch pedig hímnemű, ezért ein helyett einen kell.",
              en: "möchte takes the accusative, and der Tisch is masculine, so ein becomes einen.",
            },
          },
        ],
        reply: {
          de: "Kein Problem. Hier am Fenster ist noch ein Tisch frei. Was möchten Sie bestellen?",
          hu: "Semmi gond. Itt az ablaknál van még egy szabad asztal. Mit szeretnének rendelni?",
          en: "No problem. There's still a free table here by the window. What would you like to order?",
        },
      },
      {
        said: "Ich nehme ein Wasser und die Suppe, bitte.",
        reply: {
          de: "Sehr gern. Möchten Sie sonst noch etwas?",
          hu: "Nagyon szívesen. Parancsolnak még valamit?",
          en: "With pleasure. Would you like anything else?",
        },
      },
      {
        said: "Nein, danke. Ich kann mit Karte zahlen?",
        fixed: "Nein, danke. Kann ich mit Karte zahlen?",
        fixes: [
          {
            original: "Ich kann",
            corrected: "Kann ich",
            errorType: "Wortstellung",
            explanation: {
              hu: "Eldöntendő kérdésben az ige áll az első helyen, utána jön az alany.",
              en: "In a yes/no question the verb comes first, then the subject.",
            },
          },
        ],
        reply: {
          de: "Ja, natürlich, das ist kein Problem.",
          hu: "Igen, természetesen, ez nem probléma.",
          en: "Yes, of course, that's no problem.",
        },
      },
    ],
  },
  {
    situationId: "bahnhof",
    daysAgo: 8,
    tasks: ["ziel", "guenstiger", "gleis"],
    turns: [
      {
        said: "Ich möchte nach Hamburg fahren, in Samstag.",
        fixed: "Ich möchte nach Hamburg fahren, am Samstag.",
        fixes: [
          {
            original: "in Samstag",
            corrected: "am Samstag",
            errorType: "Präposition",
            explanation: {
              hu: "A hét napjai előtt az am elöljárót használjuk: am Montag, am Samstag.",
              en: "Days of the week take am: am Montag, am Samstag.",
            },
          },
        ],
        reply: {
          de: "Gern. Am Samstagmorgen fährt ein ICE um 8:30 Uhr. Die Fahrt kostet 79 Euro.",
          hu: "Szívesen. Szombat reggel 8:30-kor indul egy ICE. A jegy 79 euróba kerül.",
          en: "Certainly. On Saturday morning there's an ICE at 8:30. The journey costs 79 euros.",
        },
      },
      {
        said: "Das ist teuer. Gibt es einen billiger Zug?",
        fixed: "Das ist teuer. Gibt es einen billigeren Zug?",
        fixes: [
          {
            original: "billiger Zug",
            corrected: "billigeren Zug",
            errorType: "Adjektivdeklination",
            explanation: {
              hu: "A középfokú melléknév is ragozódik a főnév előtt: einen billigeren Zug.",
              en: "A comparative adjective also takes an ending before a noun: einen billigeren Zug.",
            },
          },
        ],
        reply: {
          de: "Ja, der Regionalzug ist günstiger, aber Sie müssen zweimal umsteigen.",
          hu: "Igen, a regionális vonat olcsóbb, de kétszer át kell szállnia.",
          en: "Yes, the regional train is cheaper, but you have to change twice.",
        },
      },
      {
        said: "Okay, ich nehme der ICE. Von welchem Gleis fährt er?",
        fixed: "Okay, ich nehme den ICE. Von welchem Gleis fährt er?",
        fixes: [
          {
            original: "der ICE",
            corrected: "den ICE",
            errorType: "Kasus",
            explanation: {
              hu: "A nehmen tárgyesetet (Akkusativ) kíván, a hímnemű der ilyenkor den lesz.",
              en: "nehmen takes the accusative, so masculine der becomes den.",
            },
          },
        ],
        reply: {
          de: "Der ICE fährt von Gleis 7. Gute Fahrt!",
          hu: "Az ICE a 7-es vágányról indul. Jó utat!",
          en: "The ICE leaves from platform 7. Have a good journey!",
        },
      },
    ],
  },
  {
    situationId: "arzt",
    daysAgo: 3,
    tasks: ["beschwerden", "seit-wann", "medikament"],
    turns: [
      {
        said: "Ich habe Kopfschmerzen und mein Hals tut weh.",
        reply: {
          de: "Das tut mir leid. Seit wann haben Sie die Beschwerden?",
          hu: "Sajnálom. Mióta vannak ezek a panaszai?",
          en: "I'm sorry to hear that. How long have you had these symptoms?",
        },
      },
      {
        said: "Seit drei Tage. Gestern ich habe auch Fieber gehabt.",
        fixed: "Seit drei Tagen. Gestern habe ich auch Fieber gehabt.",
        fixes: [
          {
            original: "drei Tage",
            corrected: "drei Tagen",
            errorType: "Kasus",
            explanation: {
              hu: "A seit után részes eset (Dativ) áll, többes számban a főnév -n végződést kap.",
              en: "seit takes the dative, and in the plural the noun gets an -n.",
            },
          },
          {
            original: "Gestern ich habe",
            corrected: "Gestern habe ich",
            errorType: "Wortstellung",
            explanation: {
              hu: "A ragozott ige mindig a második helyen áll, ezért a Gestern után közvetlenül az ige jön.",
              en: "The conjugated verb always comes second, so it follows Gestern directly.",
            },
          },
        ],
        reply: {
          de: "Verstehe. Ich verschreibe Ihnen ein Medikament. Nehmen Sie es dreimal am Tag nach dem Essen.",
          hu: "Értem. Felírok önnek egy gyógyszert. Naponta háromszor vegye be, étkezés után.",
          en: "I see. I'll prescribe you some medicine. Take it three times a day after meals.",
        },
      },
      {
        said: "Danke. Muss ich auch im Bett bleiben?",
        reply: {
          de: "Ja, bleiben Sie bitte zwei Tage zu Hause und trinken Sie viel Tee.",
          hu: "Igen, kérem, maradjon két napig otthon, és igyon sok teát.",
          en: "Yes, please stay at home for two days and drink plenty of tea.",
        },
      },
    ],
  },
  {
    situationId: "interview",
    daysAgo: 1,
    tasks: ["vorstellen", "erfahrung", "arbeitszeit"],
    turns: [
      {
        said: "Ich komme aus Ungarn und wohne seit zwei Jahren in Berlin.",
        reply: {
          de: "Schön! Welche Berufserfahrung haben Sie?",
          hu: "Nagyszerű! Milyen szakmai tapasztalata van?",
          en: "Lovely! What work experience do you have?",
        },
      },
      {
        said: "Ich bin drei Jahre in einem Büro gearbeitet.",
        fixed: "Ich habe drei Jahre in einem Büro gearbeitet.",
        fixes: [
          {
            original: "bin",
            corrected: "habe",
            errorType: "Tempus",
            explanation: {
              hu: "Az arbeiten nem helyváltoztatást fejez ki, ezért a Perfekt haben segédigével képződik.",
              en: "arbeiten doesn't express movement, so its Perfekt is formed with haben.",
            },
          },
        ],
        reply: {
          de: "Sehr gut. Haben Sie noch Fragen an uns?",
          hu: "Nagyon jó. Van még kérdése felénk?",
          en: "Very good. Do you have any questions for us?",
        },
      },
      {
        said: "Ja, wie sind die Arbeitszeiten bei Ihnen?",
        reply: {
          de: "Wir arbeiten von Montag bis Freitag, meistens von 9 bis 17 Uhr.",
          hu: "Hétfőtől péntekig dolgozunk, többnyire 9-től 17 óráig.",
          en: "We work Monday to Friday, usually from 9 am to 5 pm.",
        },
      },
    ],
  },
];

interface CardState {
  occurrences: number;
  reviewCount: number;
  interval: number;
  repetitions: number;
  easiness: number;
  lapses: number;
  // Negative = already due.
  dueInDays: number;
}

// One per chat mistake above, in order: a mix of due, scheduled and new cards.
const CHAT_CARD_STATES: CardState[] = [
  { occurrences: 3, reviewCount: 4, interval: 6, repetitions: 2, easiness: 2.36, lapses: 1, dueInDays: 2 },
  { occurrences: 1, reviewCount: 3, interval: 6, repetitions: 2, easiness: 2.5, lapses: 0, dueInDays: 3 },
  { occurrences: 2, reviewCount: 3, interval: 1, repetitions: 1, easiness: 2.18, lapses: 1, dueInDays: -0.1 },
  { occurrences: 2, reviewCount: 2, interval: 1, repetitions: 1, easiness: 2.36, lapses: 0, dueInDays: -0.2 },
  { occurrences: 2, reviewCount: 2, interval: 6, repetitions: 2, easiness: 2.5, lapses: 0, dueInDays: 4 },
  { occurrences: 2, reviewCount: 1, interval: 1, repetitions: 1, easiness: 2.5, lapses: 0, dueInDays: -0.3 },
  { occurrences: 1, reviewCount: 1, interval: 1, repetitions: 1, easiness: 2.5, lapses: 0, dueInDays: -0.1 },
  { occurrences: 1, reviewCount: 0, interval: 0, repetitions: 0, easiness: 2.5, lapses: 0, dueInDays: -1 },
];

const LEARNED: CardState = { occurrences: 1, reviewCount: 5, interval: 24, repetitions: 4, easiness: 2.6, lapses: 0, dueInDays: 20 };

// Older cards whose conversations are gone: cards outlive them.
const LEARNED_CARDS: { errorType: ErrorType; original: string; corrected: string; explanation: Text; prompt: string; answer: string }[] = [
  {
    errorType: "Artikel",
    original: "das Bus",
    corrected: "der Bus",
    explanation: { hu: "A Bus hímnemű: der Bus.", en: "Bus is masculine: der Bus." },
    prompt: "Wo hält das Bus?",
    answer: "Wo hält der Bus?",
  },
  {
    errorType: "Verbkonjugation",
    original: "du hat",
    corrected: "du hast",
    explanation: { hu: "A haben ige E/2. alakja: du hast.", en: "The du form of haben is du hast." },
    prompt: "Ich glaube, du hat heute Zeit.",
    answer: "Ich glaube, du hast heute Zeit.",
  },
];

const VOCAB_CARDS: { word: string; given: string; forms: string; example: string; prompt: Text; errorType: ErrorType; state: CardState }[] = [
  {
    word: "die Rechnung",
    given: "der Rechnung",
    forms: "Pl. Rechnungen",
    example: "Die Rechnung, bitte!",
    prompt: { hu: "számla", en: "bill" },
    errorType: "Artikel",
    state: { occurrences: 1, reviewCount: 1, interval: 1, repetitions: 1, easiness: 2.5, lapses: 0, dueInDays: -0.1 },
  },
  {
    word: "die Kaution",
    given: "die Miete",
    forms: "Pl. Kautionen",
    example: "Die Kaution sind drei Monatsmieten.",
    prompt: { hu: "kaució", en: "deposit" },
    errorType: "Wortwahl",
    state: { occurrences: 1, reviewCount: 2, interval: 6, repetitions: 2, easiness: 2.5, lapses: 0, dueInDays: 5 },
  },
];

// Reviews per day, today first. The gap at day 9 keeps the streak believable.
const REVIEWS_PER_DAY = [3, 6, 4, 7, 5, 4, 8, 5, 6, 0, 4, 5, 3];
const GRADES = [4, 3, 5, 4, 1, 4, 3];

const PROGRESS: { topicId: string; bestScore: number; attempts: number; daysAgo: number }[] = [
  { topicId: "artikel", bestScore: 1, attempts: 2, daysAgo: 12 },
  { topicId: "dativ", bestScore: 0.9, attempts: 2, daysAgo: 6 },
  { topicId: "perfekt", bestScore: 0.85, attempts: 3, daysAgo: 4 },
  { topicId: "wechselpraepositionen", bestScore: 0.6, attempts: 1, daysAgo: 2 },
  { topicId: "adjektivdeklination", bestScore: 0.5, attempts: 1, daysAgo: 1 },
  { topicId: vocabProgressId("a1-food"), bestScore: 0.92, attempts: 2, daysAgo: 7 },
  { topicId: vocabProgressId("a2-eating-out"), bestScore: 0.84, attempts: 1, daysAgo: 5 },
  { topicId: vocabProgressId("a2-housing"), bestScore: 0.61, attempts: 1, daysAgo: 2 },
];

interface SeedCard {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  key: string;
  kind: "fix" | "vocab";
  errorType: ErrorType;
  original: string;
  corrected: string;
  explanation: string;
  prompt: string;
  answer: string;
  dueAt: Date;
  conversationId?: Types.ObjectId;
  situationId?: string;
}

export function buildDemoData(userId: Types.ObjectId, lang: DemoLanguage, now: Date) {
  const at = (daysAgo: number, minutes = 0) => new Date(now.getTime() - daysAgo * DAY_MS + minutes * MINUTE_MS);
  // The driver writes these as they are, so the schema defaults are spelled out.
  const cardFields = (state: CardState) => ({
    _id: new Types.ObjectId(),
    userId,
    occurrences: state.occurrences,
    easiness: state.easiness,
    interval: state.interval,
    repetitions: state.repetitions,
    reviewCount: state.reviewCount,
    lapses: state.lapses,
    dueAt: at(-state.dueInDays),
    ...(state.reviewCount > 0 ? { lastReviewedAt: at(state.interval - state.dueInDays) } : {}),
    createdAt: at(14),
    updatedAt: at(0),
  });

  const chatCardStates = [...CHAT_CARD_STATES];
  const cards: SeedCard[] = [];

  const conversations = CONVERSATIONS.map((sample) => {
    const situation = getSituation(sample.situationId);
    if (!situation) throw new Error(`Unknown demo situation: ${sample.situationId}`);
    const conversationId = new Types.ObjectId();
    const start = at(sample.daysAgo);
    let minutes = 0;
    const stamp = () => ({ _id: new Types.ObjectId(), createdAt: new Date(start.getTime() + minutes++ * MINUTE_MS) });
    const partner = (line: { de: string } & Text) => ({
      ...stamp(),
      role: "assistant",
      content: line.de,
      translation: { language: lang, text: line[lang], model: SAMPLE },
    });

    const messages: Record<string, unknown>[] = [partner(situation.opening)];
    for (const turn of sample.turns) {
      const corrections = (turn.fixes ?? []).map((fix) => ({ ...fix, severity: "major", explanation: fix.explanation[lang] }));
      const correctedMessage = turn.fixed ?? turn.said;
      messages.push({
        ...stamp(),
        role: "user",
        content: turn.said,
        correction: {
          status: "ok",
          hasErrors: corrections.length > 0,
          correctedMessage,
          corrections,
          promptVersion: SAMPLE,
          model: SAMPLE,
        },
      });
      for (const item of corrections) {
        const state = chatCardStates.shift();
        if (!state) throw new Error("Every demo mistake needs a card state");
        cards.push({
          ...cardFields(state),
          key: cardKey(item.errorType, item.corrected),
          kind: "fix",
          errorType: item.errorType,
          original: item.original,
          corrected: item.corrected,
          explanation: item.explanation,
          prompt: buildPrompt(item, correctedMessage, turn.said),
          answer: correctedMessage,
          conversationId,
          situationId: sample.situationId,
        });
      }
      messages.push(partner(turn.reply));
    }

    return {
      _id: conversationId,
      userId,
      situationId: sample.situationId,
      level: "A2",
      messages,
      completedTasks: sample.tasks,
      createdAt: start,
      updatedAt: new Date(start.getTime() + minutes * MINUTE_MS),
    };
  });

  for (const card of LEARNED_CARDS) {
    cards.push({
      ...cardFields(LEARNED),
      ...card,
      key: cardKey(card.errorType, card.corrected),
      kind: "fix",
      explanation: card.explanation[lang],
    });
  }

  for (const { word, given, forms, example, prompt, errorType, state } of VOCAB_CARDS) {
    cards.push({
      ...cardFields(state),
      key: `vocab:demo-${word}`,
      kind: "vocab",
      errorType,
      original: given,
      corrected: word,
      explanation: `${forms} · ${example}`,
      prompt: prompt[lang],
      answer: word,
    });
  }

  let nth = 0;
  const reviews = REVIEWS_PER_DAY.flatMap((count, daysAgo) =>
    Array.from({ length: count }, (_, i) => {
      const card = cards[nth % cards.length]!;
      const grade = GRADES[nth % GRADES.length]!;
      nth++;
      return {
        _id: new Types.ObjectId(),
        userId,
        cardId: card._id,
        errorType: card.errorType,
        grade,
        reviewedAt: at(daysAgo, -(i + 1)),
      };
    }),
  );

  const progress = PROGRESS.map((p) => ({
    _id: new Types.ObjectId(),
    userId,
    topicId: p.topicId,
    bestScore: p.bestScore,
    lastScore: p.bestScore,
    attempts: p.attempts,
    lastAttemptAt: at(p.daysAgo),
    createdAt: at(p.daysAgo),
    updatedAt: at(p.daysAgo),
  }));

  return { conversations, cards, reviews, progress };
}
