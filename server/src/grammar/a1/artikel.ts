import type { GrammarTopic } from "../types.js";

export const artikel: GrammarTopic = {
  id: "artikel",
  level: "A1",
  order: 2,
  title: "Névelők: der, die, das, ein, kein",
  summary: "A főnevek neme, a határozott, a határozatlan és a tagadó névelő.",
  errorType: "Artikel",
  lesson: [
    {
      heading: "Három nem",
      text: "Minden német főnévnek neme van: hímnem (der), nőnem (die) vagy semlegesnem (das). A nem gyakran nem logikus (das Mädchen = a lány), ezért a főnevet mindig a névelőjével együtt tanuld meg.",
      table: {
        headers: ["", "hímnem", "nőnem", "semlegesnem", "többes szám"],
        rows: [
          ["határozott", "der Tisch", "die Lampe", "das Buch", "die Bücher"],
          ["határozatlan", "ein Tisch", "eine Lampe", "ein Buch", "– Bücher"],
          ["tagadó", "kein Tisch", "keine Lampe", "kein Buch", "keine Bücher"],
        ],
      },
    },
    {
      heading: "Segítő szabályok",
      table: {
        headers: ["Végződés vagy csoport", "Nem", "Példa"],
        rows: [
          ["-ung, -heit, -keit, -schaft, -ion", "die", "die Wohnung, die Freiheit, die Information"],
          ["-chen, -lein", "das", "das Mädchen, das Brötchen"],
          ["napok, hónapok, évszakok", "der", "der Montag, der Juli, der Winter"],
          ["többes szám", "die", "die Kinder, die Häuser"],
          ["-e végű főnevek többsége", "die", "die Straße, die Tasche (kivétel: der Name, der Käse)"],
        ],
      },
    },
    {
      heading: "Határozott vagy határozatlan?",
      text: "Az ein/eine akkor áll, ha valamit először említünk, vagy nem egy konkrét dologra gondolunk. A der/die/das akkor, ha már tudjuk, melyikről van szó.",
      examples: [
        { de: "Das ist ein Auto. Das Auto ist neu.", hu: "Ez egy autó. Az autó új." },
        { de: "Ich habe keine Zeit.", hu: "Nincs időm." },
      ],
    },
  ],
  exercises: [
    {
      id: "ar1",
      type: "choice",
      prompt: "___ Wohnung ist sehr schön.",
      options: ["Der", "Die", "Das"],
      answer: "Die",
      explanation: "Az -ung végű főnevek nőneműek: die Wohnung.",
    },
    {
      id: "ar2",
      type: "choice",
      prompt: "___ Mädchen heißt Lisa.",
      options: ["Der", "Die", "Das"],
      answer: "Das",
      explanation: "A -chen végű főnevek semlegesneműek: das Mädchen.",
    },
    {
      id: "ar3",
      type: "choice",
      prompt: "Das ist ___ Tisch.",
      options: ["ein", "eine", "einen"],
      answer: "ein",
      explanation: "der Tisch hímnemű, Nominativban: ein Tisch.",
    },
    {
      id: "ar4",
      type: "choice",
      prompt: "Das ist ___ Tasche.",
      options: ["ein", "eine", "kein"],
      answer: "eine",
      explanation: "die Tasche nőnemű: eine Tasche.",
    },
    {
      id: "ar5",
      type: "choice",
      prompt: "___ Kinder spielen im Garten.",
      options: ["Der", "Die", "Das"],
      answer: "Die",
      explanation: "Többes számban a névelő mindig die.",
    },
    {
      id: "ar6",
      type: "choice",
      prompt: "Hast du ein Auto? – Nein, ich habe ___ Auto.",
      options: ["kein", "keine", "nicht"],
      answer: "kein",
      explanation: "Az ein + főnév tagadása kein. das Auto semlegesnemű, ezért kein Auto.",
    },
    {
      id: "ar7",
      type: "choice",
      prompt: "___ Montag ist mein Lieblingstag.",
      options: ["Der", "Die", "Das"],
      answer: "Der",
      explanation: "A hét napjai hímneműek: der Montag.",
    },
    {
      id: "ar8",
      type: "choice",
      prompt: "Das ist ein Foto. ___ Foto ist von 2020.",
      options: ["Ein", "Das", "Der"],
      answer: "Das",
      explanation: "A fényképet már említettük, tudjuk, melyikről van szó, ezért határozott névelő: das Foto.",
    },
    {
      id: "ar9",
      type: "choice",
      prompt: "___ Information ist sehr wichtig.",
      options: ["Der", "Die", "Das"],
      answer: "Die",
      explanation: "Az -ion végű főnevek nőneműek: die Information.",
    },
  ],
};
