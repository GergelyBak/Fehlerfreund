import { rateLimit, ipKeyGenerator } from "express-rate-limit";

// Brute-force protection for login/register (per IP).
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many attempts, try again later" },
});

// Stricter limit for requesting reset emails, so it can't be used to spam someone's inbox.
export const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many attempts, try again later" },
});

// Per-user limit for Claude-backed endpoints (mount after requireAuth).
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => req.userId ?? ipKeyGenerator(req.ip ?? ""),
  message: { error: "Too many messages per minute, slow down a little" },
});
