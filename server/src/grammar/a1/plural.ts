import type { GrammarTopic } from "../types.js";

export const plural: GrammarTopic = {
  id: "plural",
  level: "A1",
  order: 3,
  title: "Többes szám: Bücher, Lampen, Autos",
  summary: "A többes szám névelője és a leggyakoribb képzési minták.",
  errorType: "Sonstiges",
  lesson: [
    {
      heading: "A többes szám névelője",
      text: "Többes számban minden főnév névelője die, a nemétől függetlenül: der Tisch → die Tische, das Buch → die Bücher. A többes szám alakját szavanként kell megtanulni, de vannak gyakori minták.",
    },
    {
      heading: "Gyakori minták",
      table: {
        headers: ["Minta", "Kik kapják gyakran?", "Példa"],
        rows: [
          ["-e", "sok hímnemű főnév", "der Tisch → die Tische, der Tag → die Tage"],
          ["¨-e (umlauttal)", "hímnemű főnevek", "der Stuhl → die Stühle, der Zug → die Züge"],
          ["-(e)n", "szinte minden nőnemű főnév", "die Lampe → die Lampen, die Frau → die Frauen"],
          ["¨-er", "sok semlegesnemű főnév", "das Buch → die Bücher, das Haus → die Häuser"],
          ["-s", "idegen szavak", "das Auto → die Autos, das Handy → die Handys"],
          ["– vagy csak ¨", "az -er, -el, -en végűek", "der Lehrer → die Lehrer, der Apfel → die Äpfel"],
        ],
      },
      tip: "A szótár így jelöli: das Buch, ¨-er = die Bücher. A főnevet a névelőjével és a többes számával együtt tanuld meg.",
      examples: [
        { de: "Ich habe zwei Kinder.", hu: "Két gyerekem van." },
        { de: "Die Äpfel kosten zwei Euro.", hu: "Az alma két euróba kerül." },
      ],
    },
  ],
  exercises: [
    { id: "pl1", type: "gap", prompt: "Wir brauchen vier ___.", hint: "der Stuhl", answers: ["Stühle"], explanation: "der Stuhl → die Stühle (¨-e)." },
    { id: "pl2", type: "gap", prompt: "In der Stadt gibt es viele alte ___.", hint: "das Haus", answers: ["Häuser"], explanation: "das Haus → die Häuser (¨-er)." },
    { id: "pl3", type: "gap", prompt: "Ich habe zwei ___.", hint: "die Schwester", answers: ["Schwestern"], explanation: "A nőnemű főnevek többes száma -(e)n: die Schwestern." },
    { id: "pl4", type: "gap", prompt: "Die ___ sind sehr teuer.", hint: "das Auto", answers: ["Autos"], explanation: "Idegen szó, -s: die Autos." },
    { id: "pl5", type: "gap", prompt: "Er liest gern ___.", hint: "das Buch", answers: ["Bücher"], explanation: "das Buch → die Bücher (¨-er)." },
    { id: "pl6", type: "gap", prompt: "Im Kurs sind zehn ___.", hint: "der Student", answers: ["Studenten"], explanation: "der Student → die Studenten (-en)." },
    {
      id: "pl7",
      type: "choice",
      prompt: "Ich kaufe drei ___.",
      options: ["Apfel", "Äpfel", "Apfels"],
      answer: "Äpfel",
      explanation: "Az -el végű főnevek nem kapnak végződést, de itt umlaut lesz: der Apfel → die Äpfel.",
    },
    {
      id: "pl8",
      type: "choice",
      prompt: "___ Kinder sind im Park.",
      options: ["Der", "Die", "Das"],
      answer: "Die",
      explanation: "Többes számban a névelő mindig die, akkor is, ha egyes számban das Kind.",
    },
  ],
};
