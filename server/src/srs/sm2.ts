// SM-2 spaced repetition (Wozniak, 1987) – the algorithm behind early Anki.
// Pure functions only: no DB, no Date.now(), so it's trivially testable.

export interface Sm2State {
  easiness: number; // "E-Factor", ≥ 1.3, starts at 2.5
  interval: number; // days until the next review
  repetitions: number; // successful reviews in a row
}

// 0–5 as in the paper; the UI uses 1 (forgot), 3 (hard), 4 (good), 5 (easy).
export type Grade = 0 | 1 | 2 | 3 | 4 | 5;

export const INITIAL_STATE: Sm2State = { easiness: 2.5, interval: 0, repetitions: 0 };
export const MIN_EASINESS = 1.3;
const DAY_MS = 24 * 60 * 60 * 1000;

export function sm2(state: Sm2State, grade: Grade): Sm2State {
  // EF' = EF + (0.1 − (5 − q)(0.08 + (5 − q)·0.02)), never below 1.3.
  const q = grade;
  const easiness = Math.max(
    MIN_EASINESS,
    round2(state.easiness + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))),
  );

  if (q < 3) {
    // Forgotten: start the sequence over, but keep the (lowered) easiness.
    return { easiness, interval: 1, repetitions: 0 };
  }

  const repetitions = state.repetitions + 1;
  const interval =
    repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.round(state.interval * state.easiness);
  return { easiness, interval, repetitions };
}

export function nextDueDate(interval: number, now: Date): Date {
  return new Date(now.getTime() + interval * DAY_MS);
}

export const UI_GRADES = [1, 3, 4, 5] as const satisfies readonly Grade[];

// Days until the next review for each button, computed with the same function
// the review endpoint uses, so the preview can't drift from the real schedule.
export function intervalPreviews(state: Sm2State): Record<(typeof UI_GRADES)[number], number> {
  return Object.fromEntries(UI_GRADES.map((g) => [g, sm2(state, g).interval])) as Record<
    (typeof UI_GRADES)[number],
    number
  >;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
