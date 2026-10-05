import type { GrammarTopic } from "../types.js";

export const genitiv: GrammarTopic = {
  id: "genitiv",
  level: "B1",
  order: 3,
  title: "Genitiv: des Mannes, wegen des Regens",
  summary: "A birtokos eset és a Genitivet kérő elöljárók (wegen, trotz, während, statt).",
  errorType: "Kasus",
  lesson: [
    {
      heading: "Kinek a …-ja?",
      text: "A Genitiv birtokviszonyt fejez ki, főleg írott és választékos nyelvben. Beszédben gyakran von + Dativ helyettesíti: das Auto meines Vaters = das Auto von meinem Vater.",
      table: {
        headers: ["", "hímnem", "nőnem", "semlegesnem", "többes szám"],
        rows: [
          ["határozott", "des Mannes", "der Frau", "des Kindes", "der Kinder"],
          ["határozatlan", "eines Mannes", "einer Frau", "eines Kindes", "–"],
          ["birtokos névmással", "meines Vaters", "meiner Mutter", "meines Autos", "meiner Eltern"],
        ],
      },
      tip: "Hímnemben és semlegesnemben a főnév is kap végződést: -s, egy szótagú szavaknál gyakran -es: des Vaters, des Mannes, des Hauses.",
      examples: [
        { de: "Das ist das Haus meiner Großeltern.", hu: "Ez a nagyszüleim háza." },
        { de: "Der Name des Hotels fällt mir nicht ein.", hu: "Nem jut eszembe a szálloda neve." },
      ],
    },
    {
      heading: "Genitivet kérő elöljárók",
      table: {
        headers: ["Elöljáró", "Jelentés", "Példa"],
        rows: [
          ["wegen", "miatt", "Wegen des Regens bleiben wir zu Hause."],
          ["trotz", "ellenére", "Trotz des schlechten Wetters gehen wir spazieren."],
          ["während", "alatt, közben", "Während des Essens spricht er nicht."],
          ["statt", "helyett", "Statt eines Autos kauft er ein Fahrrad."],
        ],
      },
      tip: "Beszédben a wegen után gyakran Dativot hallasz (wegen dem Regen), de írásban és a vizsgán a Genitiv a helyes.",
    },
  ],
  exercises: [
    {
      id: "g1",
      type: "choice",
      prompt: "Das ist das Auto ___ Vaters.",
      options: ["meinem", "meines", "meinen"],
      answer: "meines",
      explanation: "Birtokviszony, Genitiv, hímnem: meines Vaters.",
    },
    {
      id: "g2",
      type: "choice",
      prompt: "Die Farbe ___ Hauses gefällt mir.",
      options: ["des", "der", "dem"],
      answer: "des",
      explanation: "das Haus semlegesnemű, Genitivben: des Hauses.",
    },
    {
      id: "g3",
      type: "choice",
      prompt: "Der Name ___ Lehrerin ist Frau Weber.",
      options: ["des", "der", "die"],
      answer: "der",
      explanation: "die Lehrerin nőnemű, Genitivben: der Lehrerin.",
    },
    {
      id: "g4",
      type: "gap",
      prompt: "Wegen ___ Regens bleiben wir zu Hause.",
      hint: "der Regen",
      answers: ["des"],
      explanation: "A wegen Genitivet kér. der Regen → des Regens.",
    },
    {
      id: "g5",
      type: "choice",
      prompt: "Trotz ___ Wetters machen wir einen Ausflug.",
      options: ["des schlechten", "dem schlechten", "das schlechte"],
      answer: "des schlechten",
      explanation: "A trotz Genitivet kér. A melléknév határozott névelő után Genitivben -en végződést kap: des schlechten Wetters.",
    },
    {
      id: "g6",
      type: "choice",
      prompt: "Während ___ Fahrt habe ich geschlafen.",
      options: ["des", "der", "die"],
      answer: "der",
      explanation: "A während Genitivet kér. die Fahrt nőnemű: während der Fahrt.",
    },
    {
      id: "g7",
      type: "gap",
      prompt: "Das Zimmer meines ___ ist sehr groß.",
      hint: "der Bruder",
      answers: ["Bruders"],
      explanation: "Hímnemben Genitivben a főnév is kap -s végződést: meines Bruders.",
    },
    {
      id: "g8",
      type: "choice",
      prompt: "Die Spielsachen ___ liegen überall.",
      options: ["der Kinder", "des Kindern", "den Kindern"],
      answer: "der Kinder",
      explanation: "Többes szám Genitivben: der Kinder.",
    },
  ],
};
