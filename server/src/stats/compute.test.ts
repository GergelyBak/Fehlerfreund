import { describe, expect, it } from "vitest";
import { cardStage, computeStreak, dayKey, errorFreeRate, isValidTimeZone, lastNDays } from "./compute.js";

describe("dayKey", () => {
  it("uses the learner's time zone, not UTC", () => {
    // 23:30 UTC on 30 Sep is already 1 Oct in Budapest (UTC+2 in summer time).
    const late = new Date("2026-09-30T23:30:00Z");
    expect(dayKey(late, "UTC")).toBe("2026-09-30");
    expect(dayKey(late, "Europe/Budapest")).toBe("2026-10-01");
  });

  it("rejects unknown time zones", () => {
    expect(isValidTimeZone("Europe/Budapest")).toBe(true);
    expect(isValidTimeZone("Mars/Olympus")).toBe(false);
  });
});

describe("lastNDays", () => {
  it("lists calendar days oldest first, across a DST change", () => {
    // Europe switched back from summer time on 25 Oct 2026.
    expect(lastNDays("2026-10-26", 3)).toEqual(["2026-10-24", "2026-10-25", "2026-10-26"]);
    expect(lastNDays("2026-03-01", 2)).toEqual(["2026-02-28", "2026-03-01"]);
  });
});

describe("computeStreak", () => {
  const today = "2026-10-10";

  it("counts consecutive days ending today", () => {
    expect(computeStreak(new Set(["2026-10-08", "2026-10-09", "2026-10-10"]), today)).toBe(3);
  });

  it("keeps yesterday's streak alive while today is still open", () => {
    expect(computeStreak(new Set(["2026-10-08", "2026-10-09"]), today)).toBe(2);
  });

  it("breaks on a missed day", () => {
    expect(computeStreak(new Set(["2026-10-07", "2026-10-09", "2026-10-10"]), today)).toBe(2);
    expect(computeStreak(new Set(["2026-10-07"]), today)).toBe(0);
  });
});

describe("errorFreeRate", () => {
  it("ignores messages that were never corrected", () => {
    expect(
      errorFreeRate([
        { messages: 5, checked: 4, withErrors: 1 },
        { messages: 2, checked: 0, withErrors: 0 },
      ]),
    ).toBe(0.75);
  });

  it("returns null without corrected messages", () => {
    expect(errorFreeRate([{ messages: 3, checked: 0, withErrors: 0 }])).toBeNull();
  });
});

describe("cardStage", () => {
  it("splits new, learning and mature cards", () => {
    expect(cardStage({ reviewCount: 0, interval: 0 })).toBe("new");
    expect(cardStage({ reviewCount: 2, interval: 6 })).toBe("learning");
    expect(cardStage({ reviewCount: 4, interval: 21 })).toBe("mature");
  });
});
