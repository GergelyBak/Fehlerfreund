import type { GrammarTopic } from "../types.js";

export const akkusativ: GrammarTopic = {
  id: "akkusativ",
  level: "A1",
  order: 4,
  title: "Akkusativ: kit? mit?",
  summary: "A tárgyeset névelői és személyes névmásai. Jó hír: csak a hímnem változik.",
  errorType: "Kasus",
  lesson: [
    {
      heading: "Mikor áll Akkusativ?",
      text: "Az Akkusativ a tárgyeset, a „kit? mit?” kérdésre felel. Akkusativban áll a legtöbb ige tárgya (haben, sehen, kaufen, brauchen, möchten, es gibt), és bizonyos elöljárók után is (für, ohne). A névelők közül csak a hímneműek változnak.",
      table: {
        headers: ["", "hímnem", "nőnem", "semlegesnem", "többes szám"],
        rows: [
          ["Nominativ", "der / ein / kein", "die / eine / keine", "das / ein / kein", "die / – / keine"],
          ["Akkusativ", "den / einen / keinen", "die / eine / keine", "das / ein / kein", "die / – / keine"],
        ],
      },
      examples: [
        { de: "Ich habe einen Bruder.", hu: "Van egy fiútestvérem." },
        { de: "Ich brauche den Schlüssel.", hu: "Szükségem van a kulcsra." },
        { de: "Hier gibt es keinen Supermarkt.", hu: "Itt nincs szupermarket." },
      ],
    },
    {
      heading: "Személyes névmások Akkusativban",
      table: {
        headers: ["Nominativ", "ich", "du", "er", "sie", "es", "wir", "ihr", "sie / Sie"],
        rows: [["Akkusativ", "mich", "dich", "ihn", "sie", "es", "uns", "euch", "sie / Sie"]],
      },
      examples: [
        { de: "Siehst du ihn?", hu: "Látod őt?" },
        { de: "Ich liebe dich.", hu: "Szeretlek." },
      ],
    },
  ],
  exercises: [
    {
      id: "ak1",
      type: "choice",
      prompt: "Ich habe ___ Hund.",
      options: ["ein", "einen", "eine"],
      answer: "einen",
      explanation: "A haben tárgya Akkusativban áll. der Hund hímnemű: einen Hund.",
    },
    {
      id: "ak2",
      type: "choice",
      prompt: "Wir kaufen ___ Tisch.",
      options: ["der", "den", "dem"],
      answer: "den",
      explanation: "A kaufen tárgya Akkusativ: der Tisch → den Tisch.",
    },
    {
      id: "ak3",
      type: "choice",
      prompt: "Er trinkt ___ Kaffee.",
      options: ["ein", "einen", "einem"],
      answer: "einen",
      explanation: "der Kaffee hímnemű, tárgy: einen Kaffee.",
    },
    {
      id: "ak4",
      type: "choice",
      prompt: "Ich sehe ___ Frau dort.",
      options: ["die", "den", "der"],
      answer: "die",
      explanation: "A nőnemű névelő Akkusativban nem változik: die Frau.",
    },
    {
      id: "ak5",
      type: "gap",
      prompt: "Ich brauche ___ Auto.",
      hint: "das Auto (határozott)",
      answers: ["das"],
      explanation: "A semlegesnemű névelő Akkusativban nem változik: das Auto.",
    },
    {
      id: "ak6",
      type: "gap",
      prompt: "Kennst du ___? Er ist mein Lehrer.",
      hint: "er",
      answers: ["ihn"],
      explanation: "er Akkusativban: ihn.",
    },
    {
      id: "ak7",
      type: "gap",
      prompt: "Ich rufe ___ morgen an.",
      hint: "du",
      answers: ["dich"],
      explanation: "du Akkusativban: dich.",
    },
    {
      id: "ak8",
      type: "choice",
      prompt: "Hier gibt es ___ Bahnhof.",
      options: ["kein", "keinen", "keine"],
      answer: "keinen",
      explanation: "Az es gibt után Akkusativ áll. der Bahnhof → keinen Bahnhof.",
    },
    {
      id: "ak9",
      type: "choice",
      prompt: "Das Geschenk ist für ___ Vater.",
      options: ["mein", "meinen", "meinem"],
      answer: "meinen",
      explanation: "A für után Akkusativ áll. der Vater → für meinen Vater.",
    },
  ],
};
