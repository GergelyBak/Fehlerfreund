import jwt from "jsonwebtoken";
import type { CookieOptions } from "express";
import { env, isProd } from "../config/env.js";

export const AUTH_COOKIE = "ff_token";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function signToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { sub: string } {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (typeof payload === "string" || typeof payload.sub !== "string") {
    throw new Error("Invalid token payload");
  }
  return { sub: payload.sub };
}

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: MAX_AGE_MS,
  path: "/",
};
