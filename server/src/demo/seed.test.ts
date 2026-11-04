import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import { GRAMMAR_TOPICS } from "../grammar/index.js";
import { Card } from "../models/Card.js";
import { Conversation } from "../models/Conversation.js";
import { GrammarProgress } from "../models/GrammarProgress.js";
import { ReviewLog } from "../models/ReviewLog.js";
import { getSituation } from "../situations.js";
import { computeStreak, dayKey } from "../stats/compute.js";
import { VOCAB_THEMES, vocabProgressId } from "../vocab/index.js";
import { buildDemoData } from "./seed.js";

const NOW = new Date("2026-11-04T12:00:00Z");
const userId = new Types.ObjectId();
const data = buildDemoData(userId, "hu", NOW);

describe("demo data", () => {
  it("matches the real schemas", async () => {
    await Promise.all([
      ...data.conversations.map((doc) => new Conversation(doc).validate()),
      ...data.cards.map((doc) => new Card(doc).validate()),
      ...data.reviews.map((doc) => new ReviewLog(doc).validate()),
      ...data.progress.map((doc) => new GrammarProgress(doc).validate()),
    ]);
  });

  it("only ticks off tasks the situation has", () => {
    for (const c of data.conversations) {
      const tasks = getSituation(c.situationId)!.tasks.map((t) => t.id);
      for (const id of c.completedTasks) expect(tasks).toContain(id);
    }
  });

  it("only refers to topics that exist", () => {
    const known = new Set([...GRAMMAR_TOPICS.map((t) => t.id), ...VOCAB_THEMES.map((t) => vocabProgressId(t.id))]);
    for (const p of data.progress) expect(known).toContain(p.topicId);
  });

  it("makes a card from every mistake, with that mistake on its front", () => {
    const mistakes = data.conversations.flatMap((c) =>
      c.messages.flatMap((m) => (m as { correction?: { corrections: unknown[] } }).correction?.corrections ?? []),
    );
    const chatCards = data.cards.filter((c) => c.conversationId);
    expect(chatCards).toHaveLength(mistakes.length);
    for (const card of chatCards) expect(card.prompt).toContain(card.original);
  });

  it("gives every card its own key", () => {
    const keys = data.cards.map((c) => c.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("has cards to review right now and cards scheduled for later", () => {
    const due = data.cards.filter((c) => c.dueAt <= NOW);
    expect(due.length).toBeGreaterThan(0);
    expect(due.length).toBeLessThan(data.cards.length);
  });

  it("shows a streak that includes today", () => {
    const days = new Set(data.reviews.map((r) => dayKey(r.reviewedAt, "UTC")));
    expect(computeStreak(days, dayKey(NOW, "UTC"))).toBe(9);
  });

  it("is written in the requested language", () => {
    const explanation = (lang: "hu" | "en") =>
      buildDemoData(userId, lang, NOW).cards.find((c) => c.original === "ein Tisch")!.explanation;
    expect(explanation("hu")).toContain("tárgyeset");
    expect(explanation("en")).toContain("accusative");
  });
});
