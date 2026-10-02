import { Router } from "express";
import { Types } from "mongoose";
import { requireAuth } from "../middleware/requireAuth.js";
import { Card } from "../models/Card.js";
import { Conversation } from "../models/Conversation.js";
import { GrammarProgress } from "../models/GrammarProgress.js";
import { ReviewLog } from "../models/ReviewLog.js";
import { GRAMMAR_TOPICS } from "../grammar/index.js";
import { ERROR_TYPES, type ErrorType } from "../llm/correctionSchema.js";
import {
  MATURE_INTERVAL_DAYS,
  computeStreak,
  dayKey,
  errorFreeRate,
  isValidTimeZone,
  lastNDays,
  type DayMessages,
} from "../stats/compute.js";

const router = Router();
router.use(requireAuth);

const CHART_DAYS = 14;
// Far enough back for a long streak, small enough to stay cheap.
const HISTORY_DAYS = 120;
const PASS_SCORE = 0.8;

// Grammar topics that practise each error category, for "go learn this" links.
const TOPICS_BY_ERROR_TYPE = new Map<ErrorType, { id: string; title: string }[]>();
for (const t of GRAMMAR_TOPICS) {
  const list = TOPICS_BY_ERROR_TYPE.get(t.errorType) ?? [];
  list.push({ id: t.id, title: t.title });
  TOPICS_BY_ERROR_TYPE.set(t.errorType, list);
}

router.get("/", async (req, res) => {
  const tz = typeof req.query.tz === "string" && isValidTimeZone(req.query.tz) ? req.query.tz : "UTC";
  const userId = new Types.ObjectId(req.userId);
  const now = new Date();
  const since = new Date(now.getTime() - HISTORY_DAYS * 24 * 60 * 60 * 1000);
  const byDay = (field: string) => ({ $dateToString: { format: "%Y-%m-%d", date: field, timezone: tz } });

  const [messageDays, reviewDays, cardGroups, grammar, totalMessages] = await Promise.all([
    Conversation.aggregate<{ _id: string } & DayMessages>([
      { $match: { userId } },
      { $unwind: "$messages" },
      { $match: { "messages.role": "user", "messages.createdAt": { $gte: since } } },
      {
        $group: {
          _id: byDay("$messages.createdAt"),
          messages: { $sum: 1 },
          checked: { $sum: { $cond: [{ $eq: ["$messages.correction.status", "ok"] }, 1, 0] } },
          withErrors: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$messages.correction.status", "ok"] }, { $eq: ["$messages.correction.hasErrors", true] }] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
    ReviewLog.aggregate<{ _id: string; reviews: number }>([
      { $match: { userId, reviewedAt: { $gte: since } } },
      { $group: { _id: byDay("$reviewedAt"), reviews: { $sum: 1 } } },
    ]),
    Card.aggregate<{
      _id: ErrorType;
      mistakes: number;
      cards: number;
      due: number;
      newCards: number;
      mature: number;
    }>([
      { $match: { userId } },
      {
        $group: {
          _id: "$errorType",
          mistakes: { $sum: "$occurrences" },
          cards: { $sum: 1 },
          due: { $sum: { $cond: [{ $lte: ["$dueAt", now] }, 1, 0] } },
          newCards: { $sum: { $cond: [{ $eq: ["$reviewCount", 0] }, 1, 0] } },
          mature: {
            $sum: { $cond: [{ $and: [{ $gt: ["$reviewCount", 0] }, { $gte: ["$interval", MATURE_INTERVAL_DAYS] }] }, 1, 0] },
          },
        },
      },
    ]),
    GrammarProgress.find({ userId }).lean(),
    Conversation.aggregate<{ total: number }>([
      { $match: { userId } },
      { $unwind: "$messages" },
      { $match: { "messages.role": "user" } },
      { $count: "total" },
    ]),
  ]);

  // --- Activity: last 14 days, plus the streak over the longer history ---
  const today = dayKey(now, tz);
  const messagesByDay = new Map(messageDays.map((d) => [d._id, d]));
  const reviewsByDay = new Map(reviewDays.map((d) => [d._id, d.reviews]));
  const activeDays = new Set<string>([...messagesByDay.keys(), ...reviewsByDay.keys()]);
  for (const g of grammar) if (g.lastAttemptAt) activeDays.add(dayKey(g.lastAttemptAt, tz));

  const days = lastNDays(today, CHART_DAYS);
  const activity = days.map((date) => ({
    date,
    messages: messagesByDay.get(date)?.messages ?? 0,
    reviews: reviewsByDay.get(date) ?? 0,
  }));
  const dayStats = (keys: string[]) =>
    keys.map((k) => messagesByDay.get(k) ?? { messages: 0, checked: 0, withErrors: 0 });

  // --- Errors by type, most frequent first ---
  const errorTypes = cardGroups
    .filter((g) => (ERROR_TYPES as readonly string[]).includes(g._id))
    .map((g) => ({
      errorType: g._id,
      mistakes: g.mistakes,
      cards: g.cards,
      due: g.due,
      mature: g.mature,
      topics: TOPICS_BY_ERROR_TYPE.get(g._id) ?? [],
    }))
    .sort((a, b) => b.mistakes - a.mistakes);

  const cardTotals = cardGroups.reduce(
    (t, g) => ({
      total: t.total + g.cards,
      due: t.due + g.due,
      new: t.new + g.newCards,
      mature: t.mature + g.mature,
    }),
    { total: 0, due: 0, new: 0, mature: 0 },
  );

  // --- Grammar: every topic in course order, with the learner's best score ---
  const progressByTopic = new Map(grammar.map((g) => [g.topicId, g]));
  const grammarTopics = GRAMMAR_TOPICS.map((t) => ({
    id: t.id,
    level: t.level,
    order: t.order,
    title: t.title,
    bestScore: progressByTopic.get(t.id)?.bestScore ?? null,
  }));

  res.json({
    timeZone: tz,
    streak: computeStreak(activeDays, today),
    totalMessages: totalMessages[0]?.total ?? 0,
    errorFree: {
      last7: errorFreeRate(dayStats(days.slice(-7))),
      previous7: errorFreeRate(dayStats(days.slice(0, 7))),
    },
    activity,
    errorTypes,
    cards: { ...cardTotals, learning: cardTotals.total - cardTotals.new - cardTotals.mature },
    grammar: {
      topics: grammarTopics,
      attempted: grammarTopics.filter((t) => t.bestScore !== null).length,
      passed: grammarTopics.filter((t) => (t.bestScore ?? 0) >= PASS_SCORE).length,
    },
  });
});

export default router;
