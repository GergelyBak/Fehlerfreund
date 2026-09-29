import type { ErrorType } from "../llm/correctionSchema.js";

// Grammar lessons are hand-written, not generated: textbook content has to be
// right, and a small local model can't guarantee that.

export interface Example {
  de: string;
  hu: string;
}

export interface LessonSection {
  heading: string;
  text?: string;
  table?: { headers: string[]; rows: string[][] };
  examples?: Example[];
  tip?: string;
}

interface ExerciseBase {
  id: string;
  // German sentence with exactly one "___" gap.
  prompt: string;
  // Shown next to the gap, e.g. the infinitive to conjugate.
  hint?: string;
  // Why the answer is right, in Hungarian; also becomes the flashcard explanation.
  explanation: string;
}

export interface ChoiceExercise extends ExerciseBase {
  type: "choice";
  options: string[];
  answer: string;
}

export interface GapExercise extends ExerciseBase {
  type: "gap";
  // Every accepted spelling; the first one is shown as the solution.
  answers: string[];
}

export type Exercise = ChoiceExercise | GapExercise;

export interface GrammarTopic {
  id: string;
  level: "A1" | "A2" | "B1" | "B2";
  order: number;
  title: string;
  summary: string;
  // Category for flashcards made from wrong answers.
  errorType: ErrorType;
  lesson: LessonSection[];
  exercises: Exercise[];
}

export const GAP = "___";
