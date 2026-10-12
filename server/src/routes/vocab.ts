import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody } from "../middleware/validate.js";
import { HttpError } from "../lib/HttpError.js";
import { GrammarProgress } from "../models/GrammarProgress.js";
import { User } from "../models/User.js";
import { VOCAB_THEMES, getTheme, gradeTheme, toPublicTheme, translationOf } from "../vocab/index.js";
import { upsertCards } from "../srs/cards.js";

const router = Router();
router.use(requireAuth);

// Vocabulary progress shares the grammar progress collection under a
// "vocab:" prefix, so vocabulary tests count for the streak, the statistics
// and the daily reminder without extra plumbing.
export const vocabProgressId = (themeId: string) => `vocab:${themeId}`;

const langOf = (q: unknown) => (q === "en" ? "en" : "hu");

function toPublicProgress(p: { bestScore: number; lastScore: number; attempts: number } | null | undefined) {
  return p ? { bestScore: p.bestScore, lastScore: p.lastScore, attempts: p.attempts } : null;
}

router.get("/themes", async (req, res) => {
  const lang = langOf(req.query.lang);
  const progress = await GrammarProgress.find({ userId: req.userId, topicId: /^vocab:/ }).lean();
  const byTheme = new Map(progress.map((p) => [p.topicId, p]));
  res.json({
    themes: VOCAB_THEMES.map((t) => ({
      id: t.id,
      level: t.level,
      order: t.order,
      title: t.title[lang],
      wordCount: t.words.length,
      progress: toPublicProgress(byTheme.get(vocabProgressId(t.id))),
    })),
  });
});

function findTheme(id: string) {
  const theme = getTheme(id);
  if (!theme) throw new HttpError(404, "Topic not found");
  return theme;
}

router.get("/themes/:id", async (req, res) => {
  const theme = findTheme(req.params.id as string);
  const progress = await GrammarProgress.findOne({ userId: req.userId, topicId: vocabProgressId(theme.id) }).lean();
  res.json({ theme: toPublicTheme(theme, langOf(req.query.lang)), progress: toPublicProgress(progress) });
});

const CheckSchema = z.object({
  answers: z.record(z.string(), z.string().max(100)),
});

router.post("/themes/:id/check", validateBody(CheckSchema), async (req, res) => {
  const theme = findTheme(req.params.id as string);
  const { answers } = req.body as z.infer<typeof CheckSchema>;
  const user = await User.findById(req.userId);
  if (!user) throw new HttpError(401, "User no longer exists");
  const lang = langOf(user.nativeLanguage);

  const { results, score, total } = gradeTheme(theme, answers);
  const fraction = total ? score / total : 0;
  const topicId = vocabProgressId(theme.id);
  const existing = await GrammarProgress.findOne({ userId: req.userId, topicId });
  const progress = await GrammarProgress.findOneAndUpdate(
    { userId: req.userId, topicId },
    {
      $set: { lastScore: fraction, lastAttemptAt: new Date(), bestScore: Math.max(existing?.bestScore ?? 0, fraction) },
      $inc: { attempts: 1 },
    },
    { upsert: true, new: true },
  );

  // A wrong (not blank) answer becomes a "translate this" card. A wrong
  // article on the right noun is filed under Artikel, everything else under
  // Wortwahl, so the statistics show which of the two needs work.
  const byId = new Map(theme.words.map((w) => [w.id, w]));
  const cardsAdded = await upsertCards(
    req.userId!,
    results
      .filter((r) => r.verdict === "wrong" || r.verdict === "article")
      .map((r) => {
        const word = byId.get(r.id)!;
        return {
          key: `vocab:${word.id}`,
          kind: "vocab" as const,
          errorType: r.verdict === "article" ? ("Artikel" as const) : ("Wortwahl" as const),
          original: r.given,
          corrected: r.solution,
          explanation: [word.forms && word.type === "n" ? `Pl. ${word.forms}` : word.forms, word.example].filter(Boolean).join(" · "),
          prompt: translationOf(word, lang),
          answer: r.solution,
        };
      }),
  ).catch((err: unknown) => {
    console.error("Creating vocabulary cards failed:", err);
    return 0;
  });

  res.json({ results, score, total, cardsAdded, progress: toPublicProgress(progress) });
});

export default router;
