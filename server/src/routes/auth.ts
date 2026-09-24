import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User, LEVELS, NATIVE_LANGUAGES, type UserDoc } from "../models/User.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { AUTH_COOKIE, authCookieOptions, signToken } from "../lib/jwt.js";
import { HttpError } from "../lib/HttpError.js";

const router = Router();

const RegisterSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8, "At least 8 characters"),
  displayName: z.string().trim().min(1).max(50),
  nativeLanguage: z.enum(NATIVE_LANGUAGES).default("hu"),
  level: z.enum(LEVELS).default("A2"),
});

const LoginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1),
});

const UpdateMeSchema = z
  .object({
    displayName: z.string().trim().min(1).max(50),
    nativeLanguage: z.enum(NATIVE_LANGUAGES),
    level: z.enum(LEVELS),
  })
  .partial();

function toPublic(user: UserDoc) {
  return {
    id: user.id as string,
    email: user.email,
    displayName: user.displayName,
    nativeLanguage: user.nativeLanguage,
    level: user.level,
  };
}

router.post("/register", authLimiter, validateBody(RegisterSchema), async (req, res) => {
  const { password, ...data } = req.body as z.infer<typeof RegisterSchema>;
  if (await User.exists({ email: data.email })) {
    throw new HttpError(409, "Email already registered");
  }
  const user = await User.create({ ...data, passwordHash: await bcrypt.hash(password, 12) });
  res.cookie(AUTH_COOKIE, signToken(user.id), authCookieOptions);
  res.status(201).json({ user: toPublic(user) });
});

router.post("/login", authLimiter, validateBody(LoginSchema), async (req, res) => {
  const { email, password } = req.body as z.infer<typeof LoginSchema>;
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, "Invalid email or password");
  }
  res.cookie(AUTH_COOKIE, signToken(user.id), authCookieOptions);
  res.json({ user: toPublic(user) });
});

router.post("/logout", (_req, res) => {
  const { maxAge: _maxAge, ...clearOptions } = authCookieOptions;
  res.clearCookie(AUTH_COOKIE, clearOptions);
  res.status(204).end();
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new HttpError(401, "User no longer exists");
  res.json({ user: toPublic(user) });
});

router.patch("/me", requireAuth, validateBody(UpdateMeSchema), async (req, res) => {
  const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true, runValidators: true });
  if (!user) throw new HttpError(401, "User no longer exists");
  res.json({ user: toPublic(user) });
});

export default router;
