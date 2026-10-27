import jwt from "jsonwebtoken";
import type { CookieOptions } from "express";
import { env, isProd } from "../config/env.js";

export const AUTH_COOKIE = "ff_token";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// `v` is the user's sessionVersion when the token was issued; a token whose
// version is behind the user's current one has been revoked.
export function signToken(userId: string, sessionVersion = 0) {
  return jwt.sign({ sub: userId, v: sessionVersion }, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { sub: string; v: number } {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (typeof payload === "string" || typeof payload.sub !== "string") {
    throw new Error("Invalid token payload");
  }
  // Tokens from before session versions existed count as version 0.
  return { sub: payload.sub, v: typeof payload.v === "number" ? payload.v : 0 };
}

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  // The client reaches the API through its own origin (Vite proxy in dev, a
  // Vercel rewrite in production), so this is always a first-party cookie.
  sameSite: "lax",
  maxAge: MAX_AGE_MS,
  path: "/",
};

// For clearing the cookie: the same options without an expiry.
export const clearCookieOptions: CookieOptions = (({ maxAge: _maxAge, ...rest }) => rest)(authCookieOptions);
