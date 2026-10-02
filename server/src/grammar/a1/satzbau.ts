import type { GrammarTopic } from "../types.js";

export const satzbau: GrammarTopic = {
  id: "satzbau",
  level: "A1",
  order: 5,
  title: "Szórend: az ige a 2. helyen, kérdések",
  summary: "Hová kerül az ige a kijelentő mondatban, a kérdőszavas és az eldöntendő kérdésben.",
  errorType: "Wortstellung",
  lesson: [
    {
      heading: "Az ige a 2. helyen",
      text: "A német kijelentő mondatban a ragozott ige mindig a 2. helyen áll. Az 1. helyen állhat az alany, de egy időhatározó vagy egy tárgy is. Ilyenkor az alany az ige mögé kerül.",
      table: {
        headers: ["1. hely", "2. hely (ige)", "a mondat többi része"],
        rows: [
          ["Ich", "trinke", "morgens Kaffee."],
          ["Morgens", "trinke", "ich Kaffee."],
          ["Heute", "habe", "ich keine Zeit."],
          ["In Berlin", "wohnt", "meine Schwester."],
        ],
      },
    },
    {
      heading: "Kérdések",
      text: "A kérdőszavas kérdésben (W-Frage) a kérdőszó áll elöl, utána jön az ige. Az eldöntendő kérdésben (igen/nem) az ige áll az 1. helyen.",
      table: {
        headers: ["Típus", "Szórend", "Példa"],
        rows: [
          ["W-Frage", "kérdőszó + ige + alany", "Wo wohnst du?"],
          ["Ja/Nein-Frage", "ige + alany", "Wohnst du in Berlin?"],
        ],
      },
      tip: "Kérdőszavak: wer (ki), was (mi), wo (hol), woher (honnan), wohin (hová), wann (mikor), wie (hogyan), warum (miért), wie viel (mennyi).",
      examples: [
        { de: "Woher kommst du? – Ich komme aus Ungarn.", hu: "Honnan jössz? – Magyarországról." },
        { de: "Sprechen Sie Deutsch?", hu: "Beszél németül?" },
      ],
    },
  ],
  exercises: [
    {
      id: "s1",
      type: "choice",
      prompt: "Heute ___",
      options: ["ich arbeite nicht.", "arbeite ich nicht.", "ich nicht arbeite."],
      answer: "arbeite ich nicht.",
      explanation: "A Heute foglalja el az 1. helyet, ezért az ige jön a 2. helyen, utána az alany.",
    },
    {
      id: "s2",
      type: "choice",
      prompt: "___",
      options: ["Wo du wohnst?", "Wo wohnst du?", "Wohnst wo du?"],
      answer: "Wo wohnst du?",
      explanation: "Kérdőszavas kérdés: kérdőszó + ige + alany.",
    },
    {
      id: "s3",
      type: "choice",
      prompt: "Am Wochenende ___",
      options: ["wir fahren nach Wien.", "fahren wir nach Wien.", "wir nach Wien fahren."],
      answer: "fahren wir nach Wien.",
      explanation: "Az időhatározó az 1. helyen áll, ezért az ige a 2. helyre kerül, az alany utána jön.",
    },
    {
      id: "s4",
      type: "choice",
      prompt: "Morgen ___",
      options: ["ich habe einen Termin.", "habe ich einen Termin.", "einen Termin habe ich."],
      answer: "habe ich einen Termin.",
      explanation: "A Morgen az 1. hely, utána a ragozott ige (habe), aztán az alany (ich).",
    },
    {
      id: "s5",
      type: "choice",
      prompt: "___",
      options: ["Sprechen Sie Englisch?", "Sie Englisch sprechen?", "Englisch sprechen Sie?"],
      answer: "Sprechen Sie Englisch?",
      explanation: "Eldöntendő kérdésben az ige áll az 1. helyen.",
    },
    {
      id: "s6",
      type: "gap",
      prompt: "___ kommst du? – Aus Ungarn.",
      hint: "honnan",
      answers: ["Woher"],
      explanation: "A „honnan” kérdőszó: woher.",
    },
    {
      id: "s7",
      type: "gap",
      prompt: "___ ist das? – Das ist mein Bruder.",
      hint: "ki",
      answers: ["Wer"],
      explanation: "Személyre kérdezünk: wer.",
    },
    {
      id: "s8",
      type: "choice",
      prompt: "Um 7 Uhr ___",
      options: ["ich stehe auf.", "stehe ich auf.", "auf ich stehe."],
      answer: "stehe ich auf.",
      explanation: "Az „Um 7 Uhr” az 1. hely, ezért az ige (stehe) jön, utána az alany. Az elváló auf a mondat végére kerül.",
    },
  ],
};
