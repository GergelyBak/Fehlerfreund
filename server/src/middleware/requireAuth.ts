import type { RequestHandler } from "express";
import { AUTH_COOKIE, verifyToken } from "../lib/jwt.js";
import { HttpError } from "../lib/HttpError.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) throw new HttpError(401, "Not authenticated");
  try {
    req.userId = verifyToken(token).sub;
  } catch {
    throw new HttpError(401, "Invalid or expired session");
  }
  next();
};
