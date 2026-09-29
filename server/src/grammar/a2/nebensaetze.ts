import type { GrammarTopic } from "../types.js";

export const nebensaetze: GrammarTopic = {
  id: "nebensaetze",
  level: "A2",
  order: 5,
  title: "Mellékmondatok: weil, dass, wenn",
  summary: "A kötőszó után a ragozott ige a mellékmondat végére kerül.",
  errorType: "Wortstellung",
  lesson: [
    {
      heading: "Szórend a mellékmondatban",
      text: "Főmondatban a ragozott ige a 2. helyen áll. A weil, dass, wenn (és például az ob, als, obwohl) kötőszóval kezdődő mellékmondatban viszont a ragozott ige a mondat legvégére kerül. A mellékmondatot mindig vessző választja el.",
      table: {
        headers: ["Mondat", "Szórend"],
        rows: [
          ["Főmondat", "Ich bleibe heute zu Hause. (ige a 2. helyen)"],
          ["weil-mondat", "…, weil ich krank bin. (ige a végén)"],
          ["Perfektben", "…, weil ich keine Zeit gehabt habe."],
          ["Módbeli igével", "…, weil ich arbeiten muss."],
        ],
      },
    },
    {
      heading: "Mit jelentenek?",
      table: {
        headers: ["Kötőszó", "Jelentés", "Példa"],
        rows: [
          ["weil", "mert", "Ich komme nicht, weil ich arbeiten muss."],
          ["dass", "hogy", "Ich glaube, dass er recht hat."],
          ["wenn", "ha / amikor (ismétlődő)", "Wenn es regnet, bleibe ich zu Hause."],
        ],
      },
      examples: [
        { de: "Ich lerne Deutsch, weil ich in Deutschland arbeiten will.", hu: "Németül tanulok, mert Németországban akarok dolgozni." },
        { de: "Ich hoffe, dass du bald kommst.", hu: "Remélem, hogy hamarosan jössz." },
      ],
    },
    {
      heading: "Ha a mellékmondat áll elöl",
      text: "Ha a mellékmondat kezdi a mondatot, az egész mellékmondat számít első helynek. Ezért a főmondat a ragozott igével kezdődik.",
      examples: [{ de: "Wenn ich Zeit habe, komme ich gern.", hu: "Ha lesz időm, szívesen eljövök." }],
      tip: "Vessző után ige, aztán alany: „…, komme ich”. Az „…, ich komme” ebben a helyzetben hibás.",
    },
  ],
  exercises: [
    {
      id: "n1",
      type: "choice",
      prompt: "Ich komme heute nicht, ___",
      options: ["weil ich bin krank.", "weil ich krank bin.", "weil bin ich krank."],
      answer: "weil ich krank bin.",
      explanation: "A weil után a ragozott ige (bin) a mellékmondat végére kerül.",
    },
    {
      id: "n2",
      type: "choice",
      prompt: "Ich glaube, ___",
      options: ["dass er kommt morgen.", "dass morgen er kommt.", "dass er morgen kommt."],
      answer: "dass er morgen kommt.",
      explanation: "A dass után a ragozott ige (kommt) a mellékmondat végére kerül.",
    },
    {
      id: "n3",
      type: "choice",
      prompt: "___, bleibe ich zu Hause.",
      options: ["Wenn es regnet", "Wenn regnet es", "Wenn es regnen"],
      answer: "Wenn es regnet",
      explanation: "A wenn után a ragozott ige (regnet) a mellékmondat végére kerül.",
    },
    {
      id: "n4",
      type: "choice",
      prompt: "Wenn ich Zeit habe, ___",
      options: ["ich komme gern.", "komme ich gern.", "gern ich komme."],
      answer: "komme ich gern.",
      explanation: "Ha a mellékmondat áll elöl, a főmondat az igével kezdődik: komme ich.",
    },
    {
      id: "n5",
      type: "choice",
      prompt: "Er lernt Deutsch, ___",
      options: ["weil er in Berlin arbeiten will.", "weil er will in Berlin arbeiten.", "weil er in Berlin will arbeiten."],
      answer: "weil er in Berlin arbeiten will.",
      explanation: "Módbeli igével a ragozott módbeli ige (will) áll a legvégén, a főnévi igenév (arbeiten) előtte.",
    },
    {
      id: "n6",
      type: "gap",
      prompt: "Ich weiß, ___ du recht hast.",
      hint: "hogy",
      answers: ["dass"],
      explanation: "„Tudom, hogy…” → dass.",
    },
    {
      id: "n7",
      type: "gap",
      prompt: "Ich trinke einen Kaffee, ___ ich müde bin.",
      hint: "mert",
      answers: ["weil"],
      explanation: "„…, mert fáradt vagyok” → weil.",
    },
    {
      id: "n8",
      type: "choice",
      prompt: "Sie sagt, dass sie gestern ___",
      options: ["im Kino gewesen ist.", "ist im Kino gewesen.", "im Kino ist gewesen."],
      answer: "im Kino gewesen ist.",
      explanation: "Perfektben a mellékmondat végére a Partizip II, majd legutoljára a ragozott segédige kerül: gewesen ist.",
    },
  ],
};
