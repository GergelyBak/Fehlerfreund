import { createHash, timingSafeEqual } from "node:crypto";
import { Router, type RequestHandler } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { env } from "../config/env.js";
import { Card } from "../models/Card.js";
import { Conversation } from "../models/Conversation.js";
import { GrammarProgress } from "../models/GrammarProgress.js";
import { ReviewLog } from "../models/ReviewLog.js";
import { User } from "../models/User.js";
import { HttpError } from "../lib/HttpError.js";
import { validateBody } from "../middleware/validate.js";
import { computeStreak, dayKey } from "../stats/compute.js";
import {
  composeReminder,
  hasSomethingToSay,
  isReminderTime,
  type ReminderSettings,
  unsubscribeToken,
  verifyUnsubscribeToken,
} from "../reminders/compose.js";

// --- Internal API for the n8n workflow (Bearer REMINDER_API_KEY) ---
//
// n8n runs every hour: GET /  → who needs a reminder now, with the finished
// email; it sends them, then POST /sent → so nobody gets a second one today.
// The server decides who and what, so time zones and wording stay in tested
// code and the workflow stays a dumb pipe.

const sha256 = (s: string) => createHash("sha256").update(s).digest();

const requireApiKey: RequestHandler = (req, _res, next) => {
  // Without a key the feature is off, and the endpoints don't exist.
  if (!env.REMINDER_API_KEY) throw new HttpError(404, "Not found");
  const header = req.get("authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  // Hashing first makes the comparison constant-time regardless of length.
  if (!timingSafeEqual(sha256(given), sha256(env.REMINDER_API_KEY))) throw new HttpError(401, "Invalid API key");
  next();
};

export const internalReminderRoutes = Router();
internalReminderRoutes.use(requireApiKey);

const HISTORY_DAYS = 120;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Days (in the learner's time zone) with any practice: chat, review or grammar. */
async function activeDays(userId: Types.ObjectId, tz: string, now: Date) {
  const since = new Date(now.getTime() - HISTORY_DAYS * DAY_MS);
  const byDay = (field: string) => ({ $dateToString: { format: "%Y-%m-%d", date: field, timezone: tz } });
  const [messageDays, reviewDays, grammar] = await Promise.all([
    Conversation.aggregate<{ _id: string }>([
      { $match: { userId } },
      { $unwind: "$messages" },
      { $match: { "messages.role": "user", "messages.createdAt": { $gte: since } } },
      { $group: { _id: byDay("$messages.createdAt") } },
    ]),
    ReviewLog.aggregate<{ _id: string }>([
      { $match: { userId, reviewedAt: { $gte: since } } },
      { $group: { _id: byDay("$reviewedAt") } },
    ]),
    GrammarProgress.find({ userId, lastAttemptAt: { $gte: since } }, { lastAttemptAt: 1 }).lean(),
  ]);
  const days = new Set([...messageDays, ...reviewDays].map((d) => d._id));
  for (const g of grammar) if (g.lastAttemptAt) days.add(dayKey(g.lastAttemptAt, tz));
  return days;
}

internalReminderRoutes.get("/", async (req, res) => {
  const now = new Date();
  const ignoreTime = req.query.ignoreTime === "1";
  const users = await User.find({ "reminders.enabled": true });

  const reminders = [];
  for (const user of users) {
    const settings: ReminderSettings = user.reminders ?? {};
    if (!isReminderTime(settings, now, ignoreTime)) continue;

    const tz = settings.timeZone ?? "UTC";
    const userId = user._id;
    const [dueCards, days] = await Promise.all([
      Card.countDocuments({ userId, dueAt: { $lte: now } }),
      activeDays(userId, tz, now),
    ]);
    const today = dayKey(now, tz);
    const facts = { dueCards, streak: computeStreak(days, today), practicedToday: days.has(today) };
    if (!hasSomethingToSay(facts)) continue;

    const token = unsubscribeToken(userId.toString(), env.JWT_SECRET);
    const mail = composeReminder({
      ...facts,
      name: user.displayName,
      language: user.nativeLanguage ?? "hu",
      clientOrigin: env.CLIENT_ORIGIN,
      unsubscribeUrl: `${env.CLIENT_ORIGIN}/api/reminders/unsubscribe?token=${token}`,
    });
    reminders.push({ userId: userId.toString(), to: user.email, ...facts, ...mail });
  }

  res.json({ checked: users.length, reminders });
});

const SentSchema = z.object({
  userIds: z.array(z.string().regex(/^[a-f0-9]{24}$/)).min(1).max(1000),
});

internalReminderRoutes.post("/sent", validateBody(SentSchema), async (req, res) => {
  const { userIds } = req.body as z.infer<typeof SentSchema>;
  const now = new Date();
  const users = await User.find({ _id: { $in: userIds } }, { reminders: 1 });
  // "Today" is per user, in their own time zone.
  const result = await User.bulkWrite(
    users.map((u) => ({
      updateOne: {
        filter: { _id: u._id },
        update: { $set: { "reminders.lastSentDay": dayKey(now, u.reminders?.timeZone ?? "UTC") } },
      },
    })),
  );
  res.json({ updated: result.modifiedCount });
});

// --- Public: one-click unsubscribe from the email, no login needed ---

const PAGE_TEXT = {
  hu: {
    confirm: "Leiratkozol a napi emlékeztetőről?",
    button: "Igen, leiratkozom",
    done: "Leiratkoztál. Nem küldünk több emlékeztetőt.",
    later: "Az alkalmazás Statisztika oldalán bármikor újra bekapcsolhatod.",
  },
  en: {
    confirm: "Unsubscribe from the daily reminder?",
    button: "Yes, unsubscribe",
    done: "You're unsubscribed. No more reminders.",
    later: "You can turn it back on any time on the Statistics page.",
  },
} as const;

function page(body: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fehlerfreund</title></head>
<body style="font-family:system-ui,sans-serif;max-width:420px;margin:15vh auto;padding:0 16px;color:#0f172a">
<h2 style="color:#4f46e5">Fehlerfreund</h2>${body}</body></html>`;
}

async function userFromToken(token: unknown) {
  const userId = typeof token === "string" ? verifyUnsubscribeToken(token, env.JWT_SECRET) : null;
  const user = userId ? await User.findById(userId) : null;
  if (!user) throw new HttpError(400, "Invalid unsubscribe link");
  const lang = (user.nativeLanguage ?? "hu") in PAGE_TEXT ? (user.nativeLanguage as keyof typeof PAGE_TEXT) : "en";
  return { user, t: PAGE_TEXT[lang] };
}

export const reminderRoutes = Router();

// GET only asks: mail scanners open links in emails, and that alone
// shouldn't unsubscribe anyone.
reminderRoutes.get("/unsubscribe", async (req, res) => {
  const { t } = await userFromToken(req.query.token);
  const token = encodeURIComponent(String(req.query.token));
  res.type("html").send(
    page(`<p>${t.confirm}</p>
<form method="post" action="unsubscribe?token=${token}">
<button style="background:#4f46e5;color:#fff;border:0;padding:12px 20px;border-radius:8px;font-weight:600;font-size:16px">${t.button}</button>
</form>`),
  );
});

reminderRoutes.post("/unsubscribe", async (req, res) => {
  const { user, t } = await userFromToken(req.query.token);
  await User.updateOne({ _id: user._id }, { $set: { "reminders.enabled": false } });
  res.type("html").send(page(`<p>${t.done}</p><p style="color:#64748b">${t.later}</p>`));
});
