import type { RequestHandler } from "express";
import { z } from "zod";
import { HttpError } from "../lib/HttpError.js";

export const validateBody =
  <T extends z.ZodType>(schema: T): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new HttpError(400, "Validation failed", z.flattenError(result.error).fieldErrors);
    }
    req.body = result.data;
    next();
  };
