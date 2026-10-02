import type { GrammarTopic } from "../types.js";

export const modalverben: GrammarTopic = {
  id: "modalverben",
  level: "A1",
  order: 7,
  title: "Módbeli igék: können, müssen, möchten",
  summary: "Mit jelentenek, hogyan ragozzuk őket, és hová kerül a második ige.",
  errorType: "Verbkonjugation",
  lesson: [
    {
      heading: "Jelentés",
      table: {
        headers: ["Ige", "Jelentés", "Példa"],
        rows: [
          ["können", "tud, képes, lehet", "Ich kann schwimmen."],
          ["müssen", "kell", "Ich muss arbeiten."],
          ["wollen", "akar", "Er will ein Auto kaufen."],
          ["möchten", "szeretne (udvarias)", "Ich möchte einen Kaffee."],
          ["dürfen", "szabad", "Hier darf man nicht rauchen."],
          ["sollen", "kell (valaki más akarja)", "Du sollst mehr schlafen."],
        ],
      },
    },
    {
      heading: "Ragozás",
      table: {
        headers: ["", "können", "müssen", "wollen", "möchten", "dürfen"],
        rows: [
          ["ich", "kann", "muss", "will", "möchte", "darf"],
          ["du", "kannst", "musst", "willst", "möchtest", "darfst"],
          ["er / sie / es", "kann", "muss", "will", "möchte", "darf"],
          ["wir", "können", "müssen", "wollen", "möchten", "dürfen"],
          ["ihr", "könnt", "müsst", "wollt", "möchtet", "dürft"],
          ["sie / Sie", "können", "müssen", "wollen", "möchten", "dürfen"],
        ],
      },
      tip: "Az ich és az er/sie/es alak ugyanaz, és nincs végződése: er kann, er muss (nem: er kannt).",
    },
    {
      heading: "Szórend: a második ige a végén",
      text: "A módbeli ige ragozva a 2. helyen áll, a másik ige pedig főnévi igenévként (Infinitiv) a mondat végére kerül.",
      examples: [
        { de: "Ich kann heute nicht kommen.", hu: "Ma nem tudok jönni." },
        { de: "Musst du morgen arbeiten?", hu: "Holnap dolgoznod kell?" },
      ],
    },
  ],
  exercises: [
    { id: "m1", type: "gap", prompt: "Ich ___ gut schwimmen.", hint: "können", answers: ["kann"], explanation: "können, ich alak: ich kann (végződés nélkül)." },
    { id: "m2", type: "gap", prompt: "Du ___ morgen früh aufstehen.", hint: "müssen", answers: ["musst"], explanation: "müssen, du alak: du musst." },
    {
      id: "m3",
      type: "choice",
      prompt: "Er ___ ein neues Handy kaufen.",
      options: ["will", "willt", "wollt"],
      answer: "will",
      explanation: "A módbeli ige er alakja végződés nélküli: er will.",
    },
    {
      id: "m4",
      type: "choice",
      prompt: "___ ihr heute Abend ins Kino gehen?",
      options: ["Wollt", "Wollen", "Willst"],
      answer: "Wollt",
      explanation: "wollen, ihr alak: ihr wollt.",
    },
    {
      id: "m5",
      type: "choice",
      prompt: "Hier ___ man nicht parken.",
      options: ["darf", "darfst", "dürfen"],
      answer: "darf",
      explanation: "A man után egyes szám harmadik személy áll: man darf.",
    },
    {
      id: "m6",
      type: "choice",
      prompt: "Ich möchte ___",
      options: ["einen Kaffee trinken.", "trinken einen Kaffee.", "einen Kaffee trinke."],
      answer: "einen Kaffee trinken.",
      explanation: "A második ige főnévi igenévként (trinken) a mondat végére kerül.",
    },
    { id: "m7", type: "gap", prompt: "___ Sie mir bitte helfen?", hint: "können", answers: ["Können"], explanation: "können, Sie alak: Können Sie …?" },
    { id: "m8", type: "gap", prompt: "Wir ___ heute nicht arbeiten.", hint: "müssen", answers: ["müssen"], explanation: "müssen, wir alak: wir müssen." },
  ],
};
