import type { GrammarTopic } from "../types.js";

export const wechselpraepositionen: GrammarTopic = {
  id: "wechselpraepositionen",
  level: "A2",
  order: 4,
  title: "Wo oder wohin? Kétirányú elöljárószók",
  summary: "in, an, auf, unter, über, vor, hinter, neben, zwischen: mikor Dativ, mikor Akkusativ?",
  errorType: "Kasus",
  lesson: [
    {
      heading: "A szabály",
      text: "Ez a kilenc elöljárószó kétféle esetet vonzhat. Ha a kérdés wo? (hol? – helyzet, nincs mozgás egy cél felé), Dativ áll. Ha a kérdés wohin? (hová? – mozgás egy cél felé), Akkusativ áll.",
      table: {
        headers: ["Kérdés", "Eset", "Példa"],
        rows: [
          ["Wo? (hol?)", "Dativ", "Das Buch liegt auf dem Tisch."],
          ["Wohin? (hová?)", "Akkusativ", "Ich lege das Buch auf den Tisch."],
        ],
      },
    },
    {
      heading: "A kilenc elöljárószó",
      text: "in (-ban/-ben, -ba/-be), an (-nál/-nél, -hoz; függőleges felületen), auf (-on/-en, -ra/-re; vízszintes felületen), unter (alatt), über (fölött), vor (előtt), hinter (mögött), neben (mellett), zwischen (között).",
      examples: [
        { de: "Ich bin im Kino.", hu: "Moziban vagyok." },
        { de: "Ich gehe ins Kino.", hu: "Moziba megyek." },
        { de: "Das Bild hängt an der Wand.", hu: "A kép a falon lóg." },
      ],
    },
    {
      heading: "Tipikus igepárok",
      table: {
        headers: ["Wo? + Dativ", "Wohin? + Akkusativ"],
        rows: [
          ["liegen (fekszik)", "legen (fektet, tesz)"],
          ["stehen (áll)", "stellen (állít, tesz)"],
          ["sitzen (ül)", "sich setzen (leül)"],
          ["hängen (lóg)", "hängen (felakaszt)"],
          ["sein (van valahol)", "gehen / fahren (megy valahová)"],
        ],
      },
      tip: "Összevont alakok: in dem → im, in das → ins, an dem → am, an das → ans.",
    },
  ],
  exercises: [
    {
      id: "w1",
      type: "choice",
      prompt: "Die Katze schläft unter ___ Tisch.",
      options: ["den", "dem", "der"],
      answer: "dem",
      explanation: "Hol alszik? Wo? → Dativ. der Tisch → unter dem Tisch.",
    },
    {
      id: "w2",
      type: "choice",
      prompt: "Ich stelle die Flasche auf ___ Tisch.",
      options: ["dem", "den", "der"],
      answer: "den",
      explanation: "Hová teszem? A stellen mozgás egy cél felé, Wohin? → Akkusativ. der Tisch → auf den Tisch.",
    },
    {
      id: "w3",
      type: "choice",
      prompt: "Wir gehen heute Abend ___ Theater.",
      options: ["im", "ins", "in dem"],
      answer: "ins",
      explanation: "Hová megyünk? Wohin? → Akkusativ. in das Theater → ins Theater.",
    },
    {
      id: "w4",
      type: "choice",
      prompt: "Mein Auto steht vor ___ Haus.",
      options: ["dem", "das", "den"],
      answer: "dem",
      explanation: "Hol áll? Wo? → Dativ. das Haus → vor dem Haus.",
    },
    {
      id: "w5",
      type: "gap",
      prompt: "Er hängt das Bild an ___ Wand.",
      hint: "die Wand",
      answers: ["die"],
      explanation: "Hová akasztja? Wohin? → Akkusativ. Nőnemben az Akkusativ névelője ugyanaz, mint a Nominativé: an die Wand.",
    },
    {
      id: "w6",
      type: "gap",
      prompt: "Das Handy liegt in ___ Tasche.",
      hint: "die Tasche",
      answers: ["der"],
      explanation: "Hol van? Wo? → Dativ. die Tasche → in der Tasche.",
    },
    {
      id: "w7",
      type: "choice",
      prompt: "Die Kinder spielen ___ Garten.",
      options: ["im", "ins", "in den"],
      answer: "im",
      explanation: "Hol játszanak? Wo? → Dativ. in dem Garten → im Garten.",
    },
    {
      id: "w8",
      type: "choice",
      prompt: "Setz dich neben ___ Oma!",
      options: ["der", "die", "dem"],
      answer: "die",
      explanation: "Hová ülj? A sich setzen mozgás, Wohin? → Akkusativ. die Oma → neben die Oma.",
    },
  ],
};
