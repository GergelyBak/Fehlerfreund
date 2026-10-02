import type { ErrorType } from "../llm/correctionSchema.js";

// A fixed set of A2-level learner sentences for measuring correction quality.
// Each expected error names the faulty fragment, a word or phrase the fix must
// contain, and the error types we accept for it.
// Keep this set stable: changing it makes old and new scores incomparable.

export interface ExpectedError {
  original: string;
  fix: string;
  types: ErrorType[];
}

export interface EvalCase {
  id: string;
  text: string;
  errors: ExpectedError[]; // empty = the sentence is correct
}

export const CORRECTION_CASES: EvalCase[] = [
  // --- sentences with errors ---
  {
    id: "bus-arzt",
    text: "Ich habe gestern mit der Bus zu Arzt gefahren.",
    errors: [
      { original: "habe", fix: "bin", types: ["Tempus", "Verbkonjugation"] },
      { original: "der Bus", fix: "dem", types: ["Kasus", "Artikel"] },
      { original: "zu Arzt", fix: "zum", types: ["Präposition", "Artikel", "Kasus"] },
    ],
  },
  {
    id: "weil-aufenthaltstitel",
    text: "Ich möchte einen Termin machen, weil ich brauche eine neue Aufenthaltstitel.",
    errors: [
      { original: "ich brauche", fix: "brauche", types: ["Wortstellung"] },
      { original: "eine neue Aufenthaltstitel", fix: "einen neuen", types: ["Artikel", "Adjektivdeklination", "Kasus"] },
    ],
  },
  {
    id: "ein-tisch",
    text: "Haben Sie ein Tisch für zwei Personen?",
    errors: [{ original: "ein Tisch", fix: "einen", types: ["Kasus", "Artikel"] }],
  },
  {
    id: "die-schnitzel",
    text: "Ich möchte die Schnitzel und ein Bier, bitte.",
    errors: [{ original: "die Schnitzel", fix: "das", types: ["Artikel"] }],
  },
  {
    id: "gestern-ich-bin",
    text: "Gestern ich bin ins Kino gegangen.",
    errors: [{ original: "Gestern ich bin", fix: "bin ich", types: ["Wortstellung"] }],
  },
  {
    id: "seit-jahre",
    text: "Ich wohne in Berlin seit zwei Jahre.",
    errors: [{ original: "zwei Jahre", fix: "Jahren", types: ["Kasus", "Präposition", "Sonstiges"] }],
  },
  {
    id: "verstehe-nicht",
    text: "Ich verstehe nicht die Aufgabe.",
    errors: [{ original: "verstehe nicht die Aufgabe", fix: "Aufgabe nicht", types: ["Wortstellung"] }],
  },
  {
    id: "aelter-wie",
    text: "Mein Bruder ist älter wie ich.",
    errors: [{ original: "wie", fix: "als", types: ["Wortwahl", "Präposition", "Adjektivdeklination", "Sonstiges"] }],
  },
  {
    id: "habe-jahre-alt",
    text: "Ich habe 30 Jahre alt.",
    errors: [{ original: "habe", fix: "bin", types: ["Wortwahl", "Verbkonjugation", "Sonstiges"] }],
  },
  {
    id: "getrunkt",
    text: "Wir haben uns in der Stadt getroffen und Kaffee getrunkt.",
    errors: [{ original: "getrunkt", fix: "getrunken", types: ["Tempus", "Verbkonjugation"] }],
  },
  {
    id: "bei-seine-eltern",
    text: "Er wohnt bei seine Eltern.",
    errors: [{ original: "seine", fix: "seinen", types: ["Kasus"] }],
  },
  {
    id: "interessiere-auf",
    text: "Ich interessiere mich auf Musik.",
    errors: [{ original: "auf", fix: "für", types: ["Präposition"] }],
  },
  {
    id: "ein-gute-idee",
    text: "Das ist ein gute Idee.",
    errors: [{ original: "ein gute", fix: "eine", types: ["Artikel", "Adjektivdeklination"] }],
  },
  {
    id: "morgen-ich-gehe",
    text: "Morgen ich gehe zum Arzt.",
    errors: [{ original: "Morgen ich gehe", fix: "gehe ich", types: ["Wortstellung"] }],
  },
  {
    id: "wo-ist-bahnhof",
    text: "Ich weiß nicht, wo ist der Bahnhof.",
    errors: [{ original: "wo ist der Bahnhof", fix: "Bahnhof ist", types: ["Wortstellung"] }],
  },
  {
    id: "gelest",
    text: "Er hat mir ein Buch geschenkt, aber ich habe es noch nicht gelest.",
    errors: [{ original: "gelest", fix: "gelesen", types: ["Tempus", "Verbkonjugation"] }],
  },
  {
    id: "geld-brauchen",
    text: "Ich gehe zur Bank, weil ich Geld brauchen.",
    errors: [{ original: "brauchen", fix: "brauche", types: ["Verbkonjugation"] }],
  },
  {
    id: "deshalb-sie-geht",
    text: "Sie ist sehr müde, deshalb sie geht früh ins Bett.",
    errors: [{ original: "deshalb sie geht", fix: "geht sie", types: ["Wortstellung"] }],
  },

  // --- correct sentences: any correction here is a false alarm ---
  { id: "ok-konto", text: "Guten Tag, ich möchte ein Konto eröffnen.", errors: [] },
  { id: "ok-bus-arzt", text: "Ich bin gestern mit dem Bus zum Arzt gefahren.", errors: [] },
  { id: "ok-bahnhof", text: "Können Sie mir bitte sagen, wo der Bahnhof ist?", errors: [] },
  { id: "ok-gearbeitet", text: "Wir haben am Wochenende viel gearbeitet.", errors: [] },
  { id: "ok-wasser", text: "Ich hätte gern ein Glas Wasser.", errors: [] },
  { id: "ok-beschwerden", text: "Ich habe seit drei Tagen Kopfschmerzen.", errors: [] },
  { id: "ok-aelter-als", text: "Mein Bruder ist zwei Jahre älter als ich.", errors: [] },
  { id: "ok-interessiere", text: "Ich interessiere mich für Fußball und Musik.", errors: [] },
  { id: "ok-wohnung", text: "Die Wohnung gefällt mir sehr gut.", errors: [] },
  { id: "ok-ja-bitte", text: "Ja, bitte.", errors: [] },
];
