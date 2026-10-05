import type { GrammarTopic } from "../types.js";

export const nDeklination: GrammarTopic = {
  id: "n-deklination",
  level: "B1",
  order: 9,
  title: "N-Deklination: den Kollegen, dem Studenten",
  summary: "Egyes hímnemű főnevek Nominativon kívül mindenhol -(e)n végződést kapnak.",
  errorType: "Kasus",
  lesson: [
    {
      heading: "Mely főnevek?",
      text: "Az n-deklinációs főnevek mind hímneműek, és a Nominativ egyes szám kivételével minden esetben -n vagy -en végződést kapnak. Tipikus csoportok:",
      table: {
        headers: ["Csoport", "Példák"],
        rows: [
          ["-e végű személyek, állatok", "der Kollege, der Kunde, der Junge, der Neffe, der Löwe"],
          ["-ent, -ant, -ist végű", "der Student, der Praktikant, der Tourist, der Polizist"],
          ["néhány egyéb", "der Herr, der Mensch, der Nachbar, der Bauer"],
        ],
      },
    },
    {
      heading: "Ragozás",
      table: {
        headers: ["", "der Kollege", "der Student", "der Herr"],
        rows: [
          ["Nominativ", "der Kollege", "der Student", "der Herr"],
          ["Akkusativ", "den Kollegen", "den Studenten", "den Herrn"],
          ["Dativ", "dem Kollegen", "dem Studenten", "dem Herrn"],
          ["Genitiv", "des Kollegen", "des Studenten", "des Herrn"],
          ["többes szám", "die Kollegen", "die Studenten", "die Herren"],
        ],
      },
      tip: "Levélben: Sehr geehrter Herr Müller (Nominativ), de: ein Brief an Herrn Müller (Akkusativ). A Herr egyes számban -n, többes számban -en végződést kap.",
    },
  ],
  exercises: [
    {
      id: "n1",
      type: "gap",
      prompt: "Ich habe meinen ___ um Hilfe gebeten.",
      hint: "der Kollege",
      answers: ["Kollegen"],
      explanation: "Akkusativ, n-deklináció: den/meinen Kollegen.",
    },
    {
      id: "n2",
      type: "choice",
      prompt: "Kennst du den neuen ___?",
      options: ["Student", "Studenten", "Studente"],
      answer: "Studenten",
      explanation: "Akkusativ, -ent végű hímnemű főnév: den Studenten.",
    },
    {
      id: "n3",
      type: "choice",
      prompt: "Ich schreibe eine E-Mail an Herrn ___.",
      options: ["Müller", "Müllern", "Müllers"],
      answer: "Müller",
      explanation: "A Herr kapja az -n végződést (Herrn), a családnév változatlan marad.",
    },
    {
      id: "n4",
      type: "choice",
      prompt: "Der Kellner bringt dem ___ die Rechnung.",
      options: ["Kunde", "Kunden", "Kundes"],
      answer: "Kunden",
      explanation: "Dativ, n-deklináció: dem Kunden.",
    },
    {
      id: "n5",
      type: "gap",
      prompt: "Wir haben gestern unseren ___ zum Grillen eingeladen.",
      hint: "der Nachbar",
      answers: ["Nachbarn"],
      explanation: "A Nachbar n-deklinációs: den/unseren Nachbarn.",
    },
    {
      id: "n6",
      type: "choice",
      prompt: "Der Polizist hat dem ___ den Weg erklärt.",
      options: ["Tourist", "Touristen", "Touriste"],
      answer: "Touristen",
      explanation: "Dativ, -ist végű: dem Touristen.",
    },
    {
      id: "n7",
      type: "choice",
      prompt: "Das ist das Fahrrad des ___.",
      options: ["Jungen", "Junges", "Junge"],
      answer: "Jungen",
      explanation: "Az n-deklinációs főnevek Genitivben is -n végződést kapnak, nem -s-t: des Jungen.",
    },
    {
      id: "n8",
      type: "choice",
      prompt: "Mein ___ arbeitet als Programmierer.",
      options: ["Kollege", "Kollegen", "Kollegem"],
      answer: "Kollege",
      explanation: "Nominativ egyes szám: itt nincs végződés, der/mein Kollege.",
    },
  ],
};
