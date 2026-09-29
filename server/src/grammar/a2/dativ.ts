import type { GrammarTopic } from "../types.js";

export const dativ: GrammarTopic = {
  id: "dativ",
  level: "A2",
  order: 3,
  title: "Dativ: kinek? kivel?",
  summary: "A részes eset névelői és személyes névmásai, és az igék, amelyek Dativot kérnek.",
  errorType: "Kasus",
  lesson: [
    {
      heading: "Mikor áll Dativ?",
      text: "A Dativ a „kinek?”, „kivel?” kérdésre felel. Dativot kérnek bizonyos igék (helfen, danken, gefallen, gehören, schmecken, antworten), a kéttárgyú igék „kinek” része (jemandem etwas geben, schenken, zeigen), és a Dativos elöljárószók (aus, bei, mit, nach, seit, von, zu).",
      examples: [
        { de: "Ich helfe meiner Mutter.", hu: "Segítek az anyámnak." },
        { de: "Das Buch gehört mir.", hu: "A könyv az enyém." },
        { de: "Ich fahre mit dem Bus.", hu: "Busszal megyek." },
      ],
    },
    {
      heading: "A névelők",
      table: {
        headers: ["", "hímnem", "nőnem", "semlegesnem", "többes szám"],
        rows: [
          ["Nominativ", "der / ein", "die / eine", "das / ein", "die / –"],
          ["Dativ", "dem / einem", "der / einer", "dem / einem", "den / – (+ -n a főnéven)"],
        ],
      },
      tip: "Többes szám Dativban a főnév is kap egy -n végződést: mit den Kindern. Kivétel, ha a főnév -s-re vagy -n-re végződik: mit den Autos, mit den Frauen.",
    },
    {
      heading: "A személyes névmások",
      table: {
        headers: ["Nominativ", "ich", "du", "er", "sie", "es", "wir", "ihr", "sie / Sie"],
        rows: [["Dativ", "mir", "dir", "ihm", "ihr", "ihm", "uns", "euch", "ihnen / Ihnen"]],
      },
      examples: [
        { de: "Wie geht es dir?", hu: "Hogy vagy?" },
        { de: "Kannst du mir helfen?", hu: "Tudsz nekem segíteni?" },
      ],
    },
  ],
  exercises: [
    {
      id: "d1",
      type: "choice",
      prompt: "Ich helfe ___ Freund beim Umzug.",
      options: ["meinen", "meinem", "mein"],
      answer: "meinem",
      explanation: "A helfen Dativot kér. der Freund → meinem Freund.",
    },
    {
      id: "d2",
      type: "choice",
      prompt: "Wir fahren mit ___ Zug nach Hamburg.",
      options: ["der", "den", "dem"],
      answer: "dem",
      explanation: "A mit után mindig Dativ áll. der Zug → mit dem Zug.",
    },
    {
      id: "d3",
      type: "gap",
      prompt: "Das Kleid gefällt ___.",
      hint: "ich",
      answers: ["mir"],
      explanation: "A gefallen Dativot kér: ich → mir. („Nekem tetszik.”)",
    },
    {
      id: "d4",
      type: "gap",
      prompt: "Kannst du ___ helfen?",
      hint: "wir",
      answers: ["uns"],
      explanation: "A helfen Dativot kér: wir → uns.",
    },
    {
      id: "d5",
      type: "choice",
      prompt: "Ich schenke ___ Schwester ein Buch.",
      options: ["meine", "meiner", "meinem"],
      answer: "meiner",
      explanation: "Kinek ajándékozok? A „kinek” Dativ. die Schwester → meiner Schwester.",
    },
    {
      id: "d6",
      type: "gap",
      prompt: "Wie geht es ___?",
      hint: "du",
      answers: ["dir"],
      explanation: "Az „es geht” után Dativ áll: du → dir.",
    },
    {
      id: "d7",
      type: "choice",
      prompt: "Er wohnt seit einem Jahr bei ___ Eltern.",
      options: ["seine", "seinen", "seiner"],
      answer: "seinen",
      explanation: "A bei után Dativ áll. Többes számban: die Eltern → seinen Eltern.",
    },
    {
      id: "d8",
      type: "gap",
      prompt: "Ich danke ___ für die Hilfe.",
      hint: "Sie (magázás)",
      answers: ["Ihnen"],
      explanation: "A danken Dativot kér. A magázó Sie Dativban Ihnen, nagy kezdőbetűvel.",
    },
    {
      id: "d9",
      type: "choice",
      prompt: "Die Tasche gehört ___ Frau dort.",
      options: ["die", "der", "den"],
      answer: "der",
      explanation: "A gehören Dativot kér. die Frau → der Frau.",
    },
  ],
};
