import type { Types } from "mongoose";
import { Card } from "../models/Card.js";
import { Conversation } from "../models/Conversation.js";
import { GrammarProgress } from "../models/GrammarProgress.js";
import { ReviewLog } from "../models/ReviewLog.js";
import { TokenUsage } from "../models/TokenUsage.js";

/** Everything that belongs to these users, except the user documents themselves. */
export async function deleteAccountData(userIds: Types.ObjectId[]) {
  const filter = { userId: { $in: userIds } };
  await Promise.all([
    Conversation.deleteMany(filter),
    Card.deleteMany(filter),
    GrammarProgress.deleteMany(filter),
    ReviewLog.deleteMany(filter),
    TokenUsage.deleteMany(filter),
  ]);
}
