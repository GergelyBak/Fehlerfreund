import { adjektivdeklination } from "./a2/adjektivdeklination.js";
import { dativ } from "./a2/dativ.js";
import { festePraepositionen } from "./a2/festePraepositionen.js";
import { indirekteFragen } from "./a2/indirekteFragen.js";
import { komparation } from "./a2/komparation.js";
import { konjunktiv2 } from "./a2/konjunktiv2.js";
import { nebensaetze } from "./a2/nebensaetze.js";
import { perfekt } from "./a2/perfekt.js";
import { praeteritum } from "./a2/praeteritum.js";
import { reflexiv } from "./a2/reflexiv.js";
import { verbenMitPraepositionen } from "./a2/verbenMitPraepositionen.js";
import { wechselpraepositionen } from "./a2/wechselpraepositionen.js";
import { zeitangaben } from "./a2/zeitangaben.js";
import { GAP, type Exercise, type GrammarTopic } from "./types.js";

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  perfekt,
  praeteritum,
  dativ,
  wechselpraepositionen,
  nebensaetze,
  komparation,
  adjektivdeklination,
  konjunktiv2,
  reflexiv,
  verbenMitPraepositionen,
  indirekteFragen,
  zeitangaben,
  festePraepositionen,
].sort((a, b) => a.order - b.order);

export function getTopic(id: string) {
  return GRAMMAR_TOPICS.find((t) => t.id === id);
}

// What the client may see before answering: no solutions, no explanations.
export function toPublicTopic(topic: GrammarTopic) {
  const { errorType: _errorType, exercises, ...rest } = topic;
  return {
    ...rest,
    exercises: exercises.map((e) =>
      e.type === "choice"
        ? { id: e.id, type: e.type, prompt: e.prompt, hint: e.hint, options: e.options }
        : { id: e.id, type: e.type, prompt: e.prompt, hint: e.hint },
    ),
  };
}

// Lenient on what a keyboard makes hard, strict on the grammar: case,
// spacing and final punctuation don't matter; "ae"/"ss" count as "ä"/"ß",
// because Hungarian keyboards have no ä or ß.
export function normalizeAnswer(s: string) {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[.,!?;:]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function solutionOf(exercise: Exercise) {
  return exercise.type === "choice" ? exercise.answer : exercise.answers[0]!;
}

export function isCorrect(exercise: Exercise, given: string) {
  if (exercise.type === "choice") return given === exercise.answer;
  const g = normalizeAnswer(given);
  return g !== "" && exercise.answers.some((a) => normalizeAnswer(a) === g);
}

export function fillGap(prompt: string, text: string) {
  return prompt.replace(GAP, text);
}

export interface ExerciseResult {
  id: string;
  correct: boolean;
  given: string;
  solution: string;
  explanation: string;
}

export function gradeTopic(topic: GrammarTopic, answers: Record<string, string | undefined>) {
  const results: ExerciseResult[] = topic.exercises.map((e) => {
    const given = (answers[e.id] ?? "").trim();
    return { id: e.id, correct: isCorrect(e, given), given, solution: solutionOf(e), explanation: e.explanation };
  });
  const score = results.filter((r) => r.correct).length;
  return { results, score, total: results.length };
}
