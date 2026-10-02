import type { GrammarTopic } from "../types.js";

export const negation: GrammarTopic = {
  id: "negation",
  level: "A1",
  order: 6,
  title: "Tagadás: nicht vagy kein?",
  summary: "Mikor kein, mikor nicht, és hová kerül a nicht a mondatban.",
  errorType: "Wortwahl",
  lesson: [
    {
      heading: "A szabály",
      text: "A kein-nel olyan főnevet tagadunk, amely előtt ein állna, vagy amelynek nincs névelője. Minden más esetben nicht áll: igét, melléknevet, határozott névelős főnevet, nevet, birtokos névmással álló főnevet tagad.",
      table: {
        headers: ["Mit tagadunk?", "Szó", "Példa"],
        rows: [
          ["ein + főnév", "kein", "Das ist ein Hund. → Das ist kein Hund."],
          ["névelő nélküli főnév", "kein", "Ich habe Zeit. → Ich habe keine Zeit."],
          ["ige", "nicht", "Ich schwimme nicht."],
          ["melléknév", "nicht", "Das ist nicht teuer."],
          ["határozott névelős vagy birtokos főnév", "nicht", "Das ist nicht mein Handy."],
        ],
      },
    },
    {
      heading: "Hová kerül a nicht?",
      text: "Ha az egész mondatot tagadja, a nicht általában a mondat végére kerül: Ich komme heute nicht. A melléknév, az elöljárós kifejezés és az elváló igekötő elé kerül: Das ist nicht gut. Ich wohne nicht in Berlin. Ich rufe dich nicht an.",
    },
    {
      heading: "A kein ragozása",
      text: "A kein úgy ragozódik, mint az ein: kein Tisch, keine Lampe, kein Buch, többes számban keine Bücher. Akkusativban hímnemben keinen: Ich habe keinen Bruder.",
      examples: [
        { de: "Ich habe keine Kinder.", hu: "Nincsenek gyerekeim." },
        { de: "Ich verstehe das nicht.", hu: "Ezt nem értem." },
      ],
    },
  ],
  exercises: [
    {
      id: "n1",
      type: "choice",
      prompt: "Ich habe ___ Auto.",
      options: ["nicht", "kein", "keine"],
      answer: "kein",
      explanation: "Az ein Auto tagadása: kein Auto.",
    },
    {
      id: "n2",
      type: "choice",
      prompt: "Das Essen ist ___ gut.",
      options: ["kein", "keine", "nicht"],
      answer: "nicht",
      explanation: "Melléknevet (gut) nicht-tel tagadunk.",
    },
    {
      id: "n3",
      type: "choice",
      prompt: "Ich habe heute ___ Zeit.",
      options: ["nicht", "kein", "keine"],
      answer: "keine",
      explanation: "Névelő nélküli főnevet kein-nel tagadunk. die Zeit nőnemű: keine Zeit.",
    },
    {
      id: "n4",
      type: "choice",
      prompt: "Er kommt heute ___.",
      options: ["nicht", "kein", "keinen"],
      answer: "nicht",
      explanation: "Igét tagadunk, ezért nicht, a mondat végén.",
    },
    {
      id: "n5",
      type: "choice",
      prompt: "Wir haben ___ Kinder.",
      options: ["nicht", "keine", "kein"],
      answer: "keine",
      explanation: "Többes számú főnév névelő nélkül: keine Kinder.",
    },
    {
      id: "n6",
      type: "gap",
      prompt: "Hast du einen Bruder? – Nein, ich habe ___ Bruder.",
      hint: "kein, Akkusativ",
      answers: ["keinen"],
      explanation: "der Bruder hímnemű, és a haben tárgya Akkusativ: keinen Bruder.",
    },
    {
      id: "n7",
      type: "choice",
      prompt: "Das ist ___ mein Handy.",
      options: ["kein", "nicht", "keine"],
      answer: "nicht",
      explanation: "Birtokos névmással álló főnevet nicht-tel tagadunk: nicht mein Handy.",
    },
    {
      id: "n8",
      type: "choice",
      prompt: "Ich wohne ___ in Berlin.",
      options: ["kein", "nicht", "keine"],
      answer: "nicht",
      explanation: "Elöljárós helyhatározót tagadunk, ezért nicht, az elöljáró elé.",
    },
  ],
};
