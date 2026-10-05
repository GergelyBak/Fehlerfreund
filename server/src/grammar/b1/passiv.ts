import type { GrammarTopic } from "../types.js";

export const passiv: GrammarTopic = {
  id: "passiv",
  level: "B1",
  order: 2,
  title: "Passiv: wird gemacht, wurde gemacht",
  summary: "Amikor nem az a fontos, ki csinálja, hanem az, hogy mi történik: werden + Partizip II.",
  errorType: "Tempus",
  lesson: [
    {
      heading: "Mikor használjuk?",
      text: "A Passivban nem az a fontos, ki csinál valamit, hanem az, hogy mi történik. Gyakori hivatalos szövegekben, leírásokban és folyamatoknál (receptek, utasítások). Képzése: a werden ragozott alakja és a mondat végén a Partizip II.",
      table: {
        headers: ["", "Aktiv", "Passiv"],
        rows: [
          ["Präsens", "Der Mechaniker repariert das Auto.", "Das Auto wird repariert."],
          ["Präteritum", "Der Mechaniker reparierte das Auto.", "Das Auto wurde repariert."],
          ["Perfekt", "Der Mechaniker hat das Auto repariert.", "Das Auto ist repariert worden."],
        ],
      },
      tip: "Perfektben a werden alakja worden, ge- nélkül, és a segédige mindig sein: ist … worden.",
    },
    {
      heading: "A werden ragozása",
      table: {
        headers: ["", "Präsens", "Präteritum"],
        rows: [
          ["ich", "werde", "wurde"],
          ["du", "wirst", "wurdest"],
          ["er / sie / es", "wird", "wurde"],
          ["wir", "werden", "wurden"],
          ["ihr", "werdet", "wurdet"],
          ["sie / Sie", "werden", "wurden"],
        ],
      },
    },
    {
      heading: "Ki csinálja? – von + Dativ",
      text: "Ha mégis meg akarjuk nevezni, ki a cselekvő, von + Dativ szerkezetet használunk.",
      examples: [
        { de: "Das Haus wurde von meinem Großvater gebaut.", hu: "A házat a nagyapám építette." },
        { de: "Hier wird nicht geraucht.", hu: "Itt nem dohányoznak." },
        { de: "Die Briefe werden morgen verschickt.", hu: "A leveleket holnap küldik el." },
      ],
    },
  ],
  exercises: [
    {
      id: "p1",
      type: "choice",
      prompt: "Das Paket ___ morgen geliefert.",
      options: ["wird", "ist", "hat"],
      answer: "wird",
      explanation: "Passiv Präsens: werden + Partizip II. Das Paket wird geliefert.",
    },
    {
      id: "p2",
      type: "choice",
      prompt: "Die Fenster ___ jeden Monat geputzt.",
      options: ["wird", "werden", "wurde"],
      answer: "werden",
      explanation: "Az alany többes számú (die Fenster), ezért werden.",
    },
    {
      id: "p3",
      type: "gap",
      prompt: "Das Rathaus ___ 1905 gebaut.",
      hint: "werden, Präteritum",
      answers: ["wurde"],
      explanation: "Passiv Präteritum: wurde + Partizip II.",
    },
    {
      id: "p4",
      type: "gap",
      prompt: "Die Rechnung wird sofort ___.",
      hint: "bezahlen",
      answers: ["bezahlt"],
      explanation: "A Partizip II a mondat végére kerül. A be- nem elváló, ezért nincs ge-: bezahlt.",
    },
    {
      id: "p5",
      type: "choice",
      prompt: "Das Auto ist schon ___ worden.",
      options: ["repariert", "reparieren", "gerepariert"],
      answer: "repariert",
      explanation: "Passiv Perfekt: ist + Partizip II + worden. Az -ieren végű igék nem kapnak ge-t.",
    },
    {
      id: "p6",
      type: "choice",
      prompt: "Die Briefe sind gestern verschickt ___.",
      options: ["geworden", "worden", "wurden"],
      answer: "worden",
      explanation: "Passiv Perfektben a werden alakja worden, ge- nélkül.",
    },
    {
      id: "p7",
      type: "choice",
      prompt: "Der Film wurde ___ einem bekannten Regisseur gedreht.",
      options: ["von", "durch", "mit"],
      answer: "von",
      explanation: "A cselekvőt von + Dativ vezeti be.",
    },
    {
      id: "p8",
      type: "choice",
      prompt: "Hier ___ nicht geraucht.",
      options: ["wird", "werden", "ist"],
      answer: "wird",
      explanation: "Személytelen Passiv, amelynek nincs alanya: az ige egyes szám harmadik személyben áll, wird.",
    },
  ],
};
