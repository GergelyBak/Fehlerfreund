import { randomBytes } from "node:crypto";
import { deleteAccountData } from "../lib/accountData.js";
import { rememberSessionVersion } from "../lib/sessionCache.js";
import { Card } from "../models/Card.js";
import { Conversation } from "../models/Conversation.js";
import { GrammarProgress } from "../models/GrammarProgress.js";
import { ReviewLog } from "../models/ReviewLog.js";
import { User } from "../models/User.js";
import { buildDemoData, type DemoLanguage } from "./seed.js";

const DEMO_LIFETIME_MS = 24 * 60 * 60 * 1000;
// Not a bcrypt hash, so no password can ever match: the only way in is the
// session the demo endpoint hands out.
const NO_PASSWORD = "demo-account-has-no-password";

/** A private account with sample data, so visitors can't see or disturb each other. */
export async function createDemoAccount(language: DemoLanguage) {
  const now = new Date();
  const user = await User.create({
    // .invalid is reserved and can never receive mail.
    email: `demo-${randomBytes(8).toString("hex")}@demo.invalid`,
    passwordHash: NO_PASSWORD,
    displayName: "Demo",
    nativeLanguage: language,
    level: "A2",
    demoExpiresAt: new Date(now.getTime() + DEMO_LIFETIME_MS),
  });
  const { conversations, cards, reviews, progress } = buildDemoData(user._id, language, now);
  await Promise.all([
    // The driver directly: Mongoose would overwrite the backdated timestamps.
    Conversation.collection.insertMany(conversations),
    Card.collection.insertMany(cards),
    ReviewLog.collection.insertMany(reviews),
    GrammarProgress.collection.insertMany(progress),
  ]);
  return user;
}

/** Runs whenever a new demo starts, so the number of demo accounts stays bounded. */
export async function removeExpiredDemos() {
  const expired = await User.find({ demoExpiresAt: { $lte: new Date() } }).select({ _id: 1 }).lean();
  if (expired.length === 0) return;
  const ids = expired.map((u) => u._id);
  await deleteAccountData(ids);
  await User.deleteMany({ _id: { $in: ids } });
  for (const id of ids) rememberSessionVersion(String(id), null);
}
