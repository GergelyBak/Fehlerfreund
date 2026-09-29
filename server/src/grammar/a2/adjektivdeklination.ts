import type { GrammarTopic } from "../types.js";

export const adjektivdeklination: GrammarTopic = {
  id: "adjektivdeklination",
  level: "A2",
  order: 7,
  title: "Melléknévragozás",
  summary: "Milyen végződést kap a melléknév a főnév előtt, határozott és határozatlan névelő után?",
  errorType: "Adjektivdeklination",
  lesson: [
    {
      heading: "Mikor kap végződést a melléknév?",
      text: "Ha a melléknév az ige után áll, nem kap végződést: Das Auto ist neu. Ha a főnév előtt áll, végződést kap, és ez a névelőtől, a főnév nemétől és az esettől függ: das neue Auto.",
    },
    {
      heading: "Határozott névelő után (der, die, das)",
      table: {
        headers: ["", "hímnem", "nőnem", "semlegesnem", "többes szám"],
        rows: [
          ["Nominativ", "der neue Tisch", "die neue Lampe", "das neue Bett", "die neuen Stühle"],
          ["Akkusativ", "den neuen Tisch", "die neue Lampe", "das neue Bett", "die neuen Stühle"],
          ["Dativ", "dem neuen Tisch", "der neuen Lampe", "dem neuen Bett", "den neuen Stühlen"],
        ],
      },
      tip: "Határozott névelő után csak -e vagy -en lehet a végződés. -e öt helyen áll: Nominativban mindhárom nemben, és Akkusativban nőnemben és semlegesnemben. Minden más esetben -en.",
    },
    {
      heading: "Határozatlan névelő után (ein, eine, kein, mein…)",
      table: {
        headers: ["", "hímnem", "nőnem", "semlegesnem", "többes szám"],
        rows: [
          ["Nominativ", "ein neuer Tisch", "eine neue Lampe", "ein neues Bett", "meine neuen Stühle"],
          ["Akkusativ", "einen neuen Tisch", "eine neue Lampe", "ein neues Bett", "meine neuen Stühle"],
          ["Dativ", "einem neuen Tisch", "einer neuen Lampe", "einem neuen Bett", "meinen neuen Stühlen"],
        ],
      },
      tip: "Ahol az ein-nek nincs végződése (ein Tisch, ein Bett), ott a melléknév mutatja meg a nemet: ein neuer Tisch (der), ein neues Bett (das).",
      examples: [
        { de: "Ich suche eine günstige Wohnung.", hu: "Egy olcsó lakást keresek." },
        { de: "Wir wohnen in einem alten Haus.", hu: "Egy régi házban lakunk." },
      ],
    },
  ],
  exercises: [
    {
      id: "a1",
      type: "gap",
      prompt: "Das ist ein ___ Auto.",
      hint: "schön",
      answers: ["schönes"],
      explanation: "das Auto, Nominativ, ein után: az ein-nek nincs végződése, ezért a melléknév kapja meg az -es-t: ein schönes Auto.",
    },
    {
      id: "a2",
      type: "gap",
      prompt: "Ich kaufe einen ___ Mantel.",
      hint: "warm",
      answers: ["warmen"],
      explanation: "der Mantel, Akkusativ: einen warmen Mantel.",
    },
    {
      id: "a3",
      type: "gap",
      prompt: "Der ___ Film war langweilig.",
      hint: "neu",
      answers: ["neue"],
      explanation: "der Film, Nominativ, határozott névelő után: -e → der neue Film.",
    },
    {
      id: "a4",
      type: "gap",
      prompt: "Wir wohnen in einer ___ Wohnung.",
      hint: "klein",
      answers: ["kleinen"],
      explanation: "die Wohnung, Dativ (Wo? → in + Dativ): in einer kleinen Wohnung.",
    },
    {
      id: "a5",
      type: "choice",
      prompt: "Sie trägt eine ___ Bluse.",
      options: ["rote", "roten", "roter"],
      answer: "rote",
      explanation: "die Bluse, Akkusativ, nőnem: eine rote Bluse.",
    },
    {
      id: "a6",
      type: "choice",
      prompt: "Ich spreche mit dem ___ Nachbarn.",
      options: ["nette", "netten", "netter"],
      answer: "netten",
      explanation: "A mit után Dativ áll. Dativban határozott névelő után mindig -en: mit dem netten Nachbarn.",
    },
    {
      id: "a7",
      type: "gap",
      prompt: "Das ist mein ___ Freund Tom.",
      hint: "gut",
      answers: ["guter"],
      explanation: "der Freund, Nominativ, a mein-nek nincs végződése, ezért a melléknév mutatja a hímnemet: mein guter Freund.",
    },
    {
      id: "a8",
      type: "gap",
      prompt: "Ich habe die ___ Schuhe gekauft.",
      hint: "schwarz",
      answers: ["schwarzen"],
      explanation: "Többes szám, határozott névelő után mindig -en: die schwarzen Schuhe.",
    },
  ],
};
