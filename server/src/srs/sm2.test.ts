import { describe, expect, it } from "vitest";
import { INITIAL_STATE, MIN_EASINESS, intervalPreviews, nextDueDate, sm2, type Grade } from "./sm2.js";

const run = (grades: Grade[]) => grades.reduce(sm2, INITIAL_STATE);

describe("sm2 intervals", () => {
  it("follows 1 → 6 → interval × EF for successful reviews", () => {
    const first = sm2(INITIAL_STATE, 4);
    expect(first).toEqual({ easiness: 2.5, interval: 1, repetitions: 1 });

    const second = sm2(first, 4);
    expect(second).toEqual({ easiness: 2.5, interval: 6, repetitions: 2 });

    const third = sm2(second, 4);
    expect(third).toEqual({ easiness: 2.5, interval: 15, repetitions: 3 }); // round(6 × 2.5)
  });

  it("uses the easiness from before the update for the interval", () => {
    // After two "easy" answers EF is 2.7; the third interval is round(6 × 2.7) = 16.
    const state = run([5, 5]);
    expect(state.easiness).toBe(2.7);
    expect(sm2(state, 5).interval).toBe(16);
  });

  it("resets repetitions and interval when the answer is forgotten", () => {
    const learned = run([4, 4, 4]);
    const lapsed = sm2(learned, 1);
    expect(lapsed.repetitions).toBe(0);
    expect(lapsed.interval).toBe(1);
    // …and the next success starts the 1 → 6 sequence again.
    expect(sm2(lapsed, 4).interval).toBe(1);
    expect(sm2(sm2(lapsed, 4), 4).interval).toBe(6);
  });
});

describe("sm2 easiness", () => {
  it.each([
    [5, 2.6],
    [4, 2.5],
    [3, 2.36],
    [1, 1.96],
    [0, 1.7],
  ] as const)("grade %i changes EF 2.5 → %f", (grade, expected) => {
    expect(sm2(INITIAL_STATE, grade).easiness).toBe(expected);
  });

  it("never drops below 1.3", () => {
    const state = run([0, 0, 0, 0, 0, 0]);
    expect(state.easiness).toBe(MIN_EASINESS);
  });
});

describe("scheduling helpers", () => {
  it("computes the due date from a fixed 'now'", () => {
    const now = new Date("2026-01-01T10:00:00Z");
    expect(nextDueDate(6, now).toISOString()).toBe("2026-01-07T10:00:00.000Z");
  });

  it("previews the interval for each button", () => {
    expect(intervalPreviews(INITIAL_STATE)).toEqual({ 1: 1, 3: 1, 4: 1, 5: 1 });
    expect(intervalPreviews(run([4, 4]))).toEqual({ 1: 1, 3: 15, 4: 15, 5: 15 });
  });
});
