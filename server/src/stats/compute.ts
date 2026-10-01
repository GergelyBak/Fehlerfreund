// Pure helpers for the statistics page: no DB, no clock, easy to test.

const DAY_MS = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD" of a moment in the given IANA time zone. */
export function dayKey(date: Date, timeZone: string) {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function isValidTimeZone(tz: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** The n calendar days ending with `todayKey`, oldest first. Works on the date
 *  itself, so daylight-saving changes can't skip or repeat a day. */
export function lastNDays(todayKey: string, n: number) {
  const today = Date.parse(`${todayKey}T00:00:00Z`);
  return Array.from({ length: n }, (_, i) => new Date(today - (n - 1 - i) * DAY_MS).toISOString().slice(0, 10));
}

/** Consecutive active days up to today. A streak survives until today ends,
 *  so if today has no activity yet, counting starts from yesterday. */
export function computeStreak(activeDays: Set<string>, todayKey: string) {
  const days = lastNDays(todayKey, 400).reverse(); // today first
  let i = activeDays.has(days[0]!) ? 0 : 1;
  let streak = 0;
  while (i < days.length && activeDays.has(days[i]!)) {
    streak++;
    i++;
  }
  return streak;
}

export interface DayMessages {
  messages: number;
  checked: number;
  withErrors: number;
}

/** Share of corrected messages that had no error, or null without data. */
export function errorFreeRate(days: DayMessages[]) {
  const checked = days.reduce((sum, d) => sum + d.checked, 0);
  if (checked === 0) return null;
  const withErrors = days.reduce((sum, d) => sum + d.withErrors, 0);
  return (checked - withErrors) / checked;
}

/** Anki's convention: an interval of 21+ days counts as "learned". */
export const MATURE_INTERVAL_DAYS = 21;

export function cardStage(card: { reviewCount: number; interval: number }) {
  if (card.reviewCount === 0) return "new" as const;
  return card.interval >= MATURE_INTERVAL_DAYS ? ("mature" as const) : ("learning" as const);
}
