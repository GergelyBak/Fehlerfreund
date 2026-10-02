import type { GrammarTopic } from "../types.js";

export const imperativ: GrammarTopic = {
  id: "imperativ",
  level: "A1",
  order: 10,
  title: "Felszólító mód: Komm! Kommen Sie!",
  summary: "Kérés és utasítás a du, az ihr és a Sie alakkal.",
  errorType: "Verbkonjugation",
  lesson: [
    {
      heading: "Három alak",
      table: {
        headers: ["Kinek?", "Képzés", "Példa"],
        rows: [
          ["du", "a du alak -st nélkül, alany nélkül", "du kommst → Komm!"],
          ["ihr", "az ihr alak, alany nélkül", "ihr kommt → Kommt!"],
          ["Sie", "ige + Sie", "Kommen Sie!"],
        ],
      },
      examples: [
        { de: "Mach bitte das Fenster zu!", hu: "Csukd be, kérlek, az ablakot!" },
        { de: "Nehmen Sie bitte Platz!", hu: "Foglaljon helyet, kérem!" },
      ],
    },
    {
      heading: "Különlegességek",
      text: "Az e → i/ie tőhangváltós igéknél a du alak megtartja a változást: sprechen → Sprich!, lesen → Lies!, nehmen → Nimm! Az a → ä változás viszont nem marad meg: fahren → Fahr! Elváló igekötős igéknél az igekötő a végére kerül: Steh auf! Ruf mich an! A sein rendhagyó: Sei leise! Seid pünktlich! Seien Sie bitte pünktlich!",
      tip: "A bitte udvariasabbá teszi a kérést: Komm bitte! Hilf mir bitte!",
    },
  ],
  exercises: [
    {
      id: "i1",
      type: "gap",
      prompt: "___ bitte langsamer!",
      hint: "sprechen, du",
      answers: ["Sprich"],
      explanation: "du sprichst → Sprich! Az e → i tőhangváltás megmarad.",
    },
    {
      id: "i2",
      type: "gap",
      prompt: "___ bitte das Fenster zu!",
      hint: "zumachen, du",
      answers: ["Mach", "Mache"],
      explanation: "du machst → Mach! Az igekötő (zu) a mondat végére kerül.",
    },
    {
      id: "i3",
      type: "choice",
      prompt: "___ Sie bitte Platz!",
      options: ["Nehmen", "Nimm", "Nehmt"],
      answer: "Nehmen",
      explanation: "Magázó felszólítás: ige + Sie, főnévi igenévvel azonos alak: Nehmen Sie!",
    },
    {
      id: "i4",
      type: "choice",
      prompt: "Kinder, ___ bitte leise!",
      options: ["sei", "seid", "seien"],
      answer: "seid",
      explanation: "Több gyereknek szól (ihr): Seid leise!",
    },
    {
      id: "i5",
      type: "gap",
      prompt: "___ mich morgen an!",
      hint: "anrufen, du",
      answers: ["Ruf", "Rufe"],
      explanation: "du rufst an → Ruf … an! Az an a mondat végére kerül.",
    },
    {
      id: "i6",
      type: "choice",
      prompt: "___ mir bitte!",
      options: ["Hilf", "Helf", "Hilfst"],
      answer: "Hilf",
      explanation: "helfen, du hilfst → Hilf! Az e → i tőhangváltás megmarad.",
    },
    {
      id: "i7",
      type: "gap",
      prompt: "___ bitte pünktlich, Herr Müller!",
      hint: "sein, Sie",
      answers: ["Seien Sie"],
      explanation: "A sein rendhagyó, magázva: Seien Sie!",
    },
    {
      id: "i8",
      type: "choice",
      prompt: "Lukas, ___ nicht so schnell!",
      options: ["fahr", "fährst", "fähr"],
      answer: "fahr",
      explanation: "Az a → ä változás nem marad meg a felszólításban: Fahr!",
    },
  ],
};
