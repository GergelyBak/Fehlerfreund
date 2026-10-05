import type { GrammarTopic } from "../types.js";

export const temporaleNebensaetze: GrammarTopic = {
  id: "temporale-nebensaetze",
  level: "B1",
  order: 4,
  title: "Időbeli mellékmondatok: als, wenn, bevor, seit",
  summary: "Mikor als és mikor wenn, és a többi időbeli kötőszó: während, bevor, nachdem, seit, bis.",
  errorType: "Wortwahl",
  lesson: [
    {
      heading: "als vagy wenn?",
      table: {
        headers: ["Kötőszó", "Mikor?", "Példa"],
        rows: [
          ["als", "egyszeri esemény a múltban", "Als ich ein Kind war, wohnten wir in Pécs."],
          ["wenn", "jelenben vagy jövőben, egyszer vagy többször", "Wenn ich nach Hause komme, koche ich."],
          ["(immer) wenn", "ismétlődő esemény a múltban (valahányszor)", "Immer wenn es regnete, spielten wir drinnen."],
        ],
      },
      tip: "Magyarul mindkettő „amikor”. Kérdezd meg magadtól: egyszer történt a múltban? Ha igen, als. Minden más esetben wenn.",
    },
    {
      heading: "További időbeli kötőszók",
      table: {
        headers: ["Kötőszó", "Jelentés", "Példa"],
        rows: [
          ["während", "miközben", "Während ich koche, hört sie Musik."],
          ["bevor", "mielőtt", "Bevor ich schlafen gehe, lese ich."],
          ["nachdem", "miután", "Nachdem er gegessen hatte, ging er spazieren."],
          ["seit / seitdem", "amióta", "Seit ich in Berlin wohne, spreche ich besser Deutsch."],
          ["bis", "amíg (…nem)", "Warte, bis ich komme."],
        ],
      },
      tip: "Mindegyik mellékmondatot vezet be, ezért a ragozott ige a végére kerül. A wann viszont kérdőszó (mikor?), nem kötőszó: Weißt du, wann der Kurs beginnt?",
    },
  ],
  exercises: [
    {
      id: "t1",
      type: "choice",
      prompt: "___ ich 18 war, bin ich nach Wien gezogen.",
      options: ["Als", "Wenn", "Wann"],
      answer: "Als",
      explanation: "Egyszeri esemény a múltban (18 éves koromban), ezért als.",
    },
    {
      id: "t2",
      type: "choice",
      prompt: "___ ich Zeit habe, gehe ich ins Fitnessstudio.",
      options: ["Als", "Wenn", "Wann"],
      answer: "Wenn",
      explanation: "Jelenben, ismétlődően (valahányszor időm van), ezért wenn.",
    },
    {
      id: "t3",
      type: "choice",
      prompt: "Immer ___ ich meine Oma besuchte, backte sie Kuchen.",
      options: ["als", "wenn", "wann"],
      answer: "wenn",
      explanation: "Ismétlődő esemény a múltban (valahányszor), ezért wenn, akkor is, ha múlt időben vagyunk.",
    },
    {
      id: "t4",
      type: "choice",
      prompt: "___ du gehst, mach bitte das Licht aus.",
      options: ["Bevor", "Nachdem", "Seit"],
      answer: "Bevor",
      explanation: "Mielőtt elmész: bevor.",
    },
    {
      id: "t5",
      type: "choice",
      prompt: "___ ich in Deutschland lebe, spreche ich viel besser Deutsch.",
      options: ["Seit", "Bevor", "Als"],
      answer: "Seit",
      explanation: "Amióta itt élek, és ez ma is tart: seit.",
    },
    {
      id: "t6",
      type: "gap",
      prompt: "___ ich koche, hört mein Mann Musik.",
      hint: "miközben",
      answers: ["Während"],
      explanation: "Két egyidejű cselekvés: während.",
    },
    {
      id: "t7",
      type: "choice",
      prompt: "Warte hier, ___ ich zurückkomme.",
      options: ["bis", "bevor", "als"],
      answer: "bis",
      explanation: "Várj addig, amíg vissza nem jövök: bis.",
    },
    {
      id: "t8",
      type: "choice",
      prompt: "Weißt du, ___ der Kurs beginnt?",
      options: ["wann", "wenn", "als"],
      answer: "wann",
      explanation: "Itt egy kérdést ágyazunk be (Wann beginnt der Kurs?), ezért a kérdőszó, wann marad.",
    },
  ],
};
