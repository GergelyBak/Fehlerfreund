import type { RequestHandler } from "express";
import { AUTH_COOKIE, verifyToken } from "../lib/jwt.js";
import { HttpError } from "../lib/HttpError.js";
import { sessionVersionOf } from "../lib/sessionCache.js";
import { User } from "../models/User.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const loadVersion = async (id: string) =>
  (await User.findById(id, { sessionVersion: 1 }).lean())?.sessionVersion ?? (null as number | null);

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) throw new HttpError(401, "Not authenticated");
  let claims: { sub: string; v: number };
  try {
    claims = verifyToken(token);
  } catch {
    throw new HttpError(401, "Invalid or expired session");
  }
  // A deleted account, or a token issued before the last password change or
  // "sign out everywhere", is no longer a valid session.
  const current = await sessionVersionOf(claims.sub, loadVersion);
  if (current === null || claims.v < current) throw new HttpError(401, "Invalid or expired session");
  req.userId = claims.sub;
  next();
};
