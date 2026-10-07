// Pure helpers for the daily reminder email: who gets one, and what it says.
// No DB, no env, no clock, so all of it is unit-tested.
import { createHmac, timingSafeEqual } from "node:crypto";
import { dayKey } from "../stats/compute.js";

type Language = "hu" | "en";

export interface ReminderSettings {
  enabled?: boolean | null;
  hour?: number | null;
  timeZone?: string | null;
  lastSentDay?: string | null;
}

/** Local hour (0–23) of a moment in the given time zone. */
export function localHour(date: Date, timeZone: string) {
  const hour = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", hourCycle: "h23" })
    .formatToParts(date)
    .find((p) => p.type === "hour")?.value;
  return Number(hour);
}

/** Whether it's time for today's reminder. The workflow runs every hour; any
 *  run at or after the chosen hour sends it, so a missed run only delays it.
 *  `ignoreTime` skips the hour check, for testing the workflow by hand. */
export function isReminderTime(settings: ReminderSettings, now: Date, ignoreTime = false) {
  if (!settings.enabled) return false;
  const tz = settings.timeZone ?? "UTC";
  if (settings.lastSentDay === dayKey(now, tz)) return false;
  return ignoreTime || localHour(now, tz) >= (settings.hour ?? 18);
}

export interface ReminderFacts {
  dueCards: number;
  streak: number;
  practicedToday: boolean;
}

/** Nothing due and no streak at risk means no email: reminders that never
 *  have anything to say get ignored, then unsubscribed from. */
export function hasSomethingToSay(f: ReminderFacts) {
  return f.dueCards > 0 || (f.streak > 0 && !f.practicedToday);
}

const TEXT = {
  hu: {
    subjectStreak: (s: number) => `Ne szakadjon meg a ${s} napos sorozatod! 🔥`,
    subjectDue: (n: number) => `${n} kártya vár ismétlésre`,
    greeting: (name: string) => `Szia ${name}!`,
    due: (n: number) => `${n} kártya vár ismétlésre. Pár perc az egész.`,
    streak: (s: number) =>
      `${s} napja gyakorolsz egymás után, de ma még nem voltál. Egy rövid ismétlés vagy egy beszélgetés is megmenti a sorozatot.`,
    review: "Ismétlés indítása",
    practise: "Gyakorlás",
    footer: "Ezt a levelet azért kapod, mert bekapcsoltad a napi emlékeztetőt.",
    unsubscribe: "Leiratkozás",
  },
  en: {
    subjectStreak: (s: number) => `Don't break your ${s}-day streak! 🔥`,
    subjectDue: (n: number) => `${n} ${n === 1 ? "card is" : "cards are"} waiting for review`,
    greeting: (name: string) => `Hi ${name}!`,
    due: (n: number) => `${n} ${n === 1 ? "card is" : "cards are"} waiting for review. It only takes a few minutes.`,
    streak: (s: number) =>
      `You've practised ${s} ${s === 1 ? "day" : "days"} in a row, but not yet today. A quick review or one conversation keeps the streak alive.`,
    review: "Start review",
    practise: "Practise now",
    footer: "You're getting this because you turned on the daily reminder.",
    unsubscribe: "Unsubscribe",
  },
} satisfies Record<Language, unknown>;

export interface ReminderMailInput extends ReminderFacts {
  name: string;
  language: string;
  clientOrigin: string;
  unsubscribeUrl: string;
}

export function composeReminder(input: ReminderMailInput) {
  const t = TEXT[(input.language in TEXT ? input.language : "en") as Language];
  const streakAtRisk = input.streak > 0 && !input.practicedToday;
  // A streak about to break is the stronger hook, so it wins the subject line.
  const subject = streakAtRisk ? t.subjectStreak(input.streak) : t.subjectDue(input.dueCards);
  const lines = [
    ...(input.dueCards > 0 ? [t.due(input.dueCards)] : []),
    ...(streakAtRisk ? [t.streak(input.streak)] : []),
  ];
  const [label, link] =
    input.dueCards > 0 ? [t.review, `${input.clientOrigin}/review`] : [t.practise, `${input.clientOrigin}/`];

  const text = [
    t.greeting(input.name),
    "",
    ...lines,
    "",
    `${label}: ${link}`,
    "",
    "—",
    t.footer,
    `${t.unsubscribe}: ${input.unsubscribeUrl}`,
  ].join("\n");

  const html = `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;color:#0f172a">
        <h2 style="color:#4f46e5">Fehlerfreund</h2>
        <p>${escapeHtml(t.greeting(input.name))}</p>
        ${lines.map((l) => `<p>${escapeHtml(l)}</p>`).join("\n        ")}
        <p style="margin:28px 0">
          <a href="${escapeHtml(link)}" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">
            ${escapeHtml(label)}
          </a>
        </p>
        <p style="color:#64748b;font-size:13px">${escapeHtml(t.footer)}
          <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:#64748b">${escapeHtml(t.unsubscribe)}</a></p>
      </div>`;

  return { subject, text, html };
}

// --- Unsubscribe links: "<userId>.<signature>", so no login is needed ---

const sign = (userId: string, secret: string) =>
  createHmac("sha256", secret).update(`unsubscribe:${userId}`).digest("base64url");

export function unsubscribeToken(userId: string, secret: string) {
  return `${userId}.${sign(userId, secret)}`;
}

/** The user id, or null if the token was not signed by us. */
export function verifyUnsubscribeToken(token: string, secret: string) {
  const [userId, signature] = token.split(".");
  if (!userId || !signature || !/^[a-f0-9]{24}$/.test(userId)) return null;
  const expected = Buffer.from(sign(userId, secret));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given) ? userId : null;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
