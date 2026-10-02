import "dotenv/config";
import { z } from "zod";

// Treats an empty `KEY=` line in .env as not set.
const optionalString = z.preprocess((v) => (v === "" ? undefined : v), z.string().optional());

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    // How many proxies sit in front of the server. In production the request
    // passes Vercel (the /api rewrite) and Render, so it's 2 there; otherwise
    // every visitor would share one IP in the rate limiter.
    TRUST_PROXY: z.coerce.number().int().min(0).default(1),
    MONGODB_URI: z.string().startsWith("mongodb"),
    // mock = free canned responses; ollama = free local model; live = Claude API (paid).
    LLM_MODE: z.enum(["mock", "ollama", "live"]).default("mock"),
    OLLAMA_URL: z.url().default("http://localhost:11434"),
    OLLAMA_MODEL: z.string().min(1).default("gemma3:4b"),
    ANTHROPIC_API_KEY: optionalString,
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    CLIENT_ORIGIN: z.url().default("http://localhost:5173"),
    DAILY_TOKEN_BUDGET: z.coerce.number().int().positive().default(200_000),
    // console = print emails (e.g. password reset links) to the server log; smtp = really send them.
    EMAIL_MODE: z.enum(["console", "smtp"]).default("console"),
    SMTP_HOST: optionalString,
    SMTP_PORT: z.coerce.number().int().positive().default(465),
    SMTP_USER: optionalString,
    SMTP_PASS: optionalString,
    MAIL_FROM: optionalString,
  })
  .refine((e) => e.LLM_MODE === "mock" || e.ANTHROPIC_API_KEY, {
    message: "ANTHROPIC_API_KEY is required when LLM_MODE=live",
    path: ["ANTHROPIC_API_KEY"],
  })
  .refine((e) => e.EMAIL_MODE === "console" || (e.SMTP_HOST && e.SMTP_USER && e.SMTP_PASS), {
    message: "SMTP_HOST, SMTP_USER and SMTP_PASS are required when EMAIL_MODE=smtp",
    path: ["SMTP_HOST"],
  });

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
