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
    // ollama = free local model; live = Claude API (paid).
    LLM_MODE: z.enum(["ollama", "live"]).default("ollama"),
    // Locally Ollama itself; in production the ollama-gateway behind a tunnel.
    OLLAMA_URL: z.url().default("http://localhost:11434"),
    // Sent as a Bearer token; required by the ollama-gateway, ignored by plain Ollama.
    OLLAMA_API_KEY: optionalString,
    OLLAMA_MODEL: z.string().min(1).default("gemma3:4b"),
    ANTHROPIC_API_KEY: optionalString,
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    CLIENT_ORIGIN: z.url().default("http://localhost:5173"),
    DAILY_TOKEN_BUDGET: z.coerce.number().int().positive().default(200_000),
    // console = print emails (e.g. password reset links) to the server log;
    // smtp = send via an SMTP server; brevo = send via Brevo's HTTP API (works
    // on hosts that block outgoing SMTP ports, like Render's free plan).
    EMAIL_MODE: z.enum(["console", "smtp", "brevo"]).default("console"),
    BREVO_API_KEY: optionalString,
    SMTP_HOST: optionalString,
    SMTP_PORT: z.coerce.number().int().positive().default(465),
    SMTP_USER: optionalString,
    SMTP_PASS: optionalString,
    MAIL_FROM: optionalString,
    // Shared secret for the n8n reminder workflow. Unset = the internal
    // reminder endpoints are switched off.
    REMINDER_API_KEY: z.preprocess((v) => (v === "" ? undefined : v), z.string().min(32).optional()),
  })
  .refine((e) => e.LLM_MODE !== "live" || e.ANTHROPIC_API_KEY, {
    message: "ANTHROPIC_API_KEY is required when LLM_MODE=live",
    path: ["ANTHROPIC_API_KEY"],
  })
  .refine((e) => e.EMAIL_MODE !== "smtp" || (e.SMTP_HOST && e.SMTP_USER && e.SMTP_PASS), {
    message: "SMTP_HOST, SMTP_USER and SMTP_PASS are required when EMAIL_MODE=smtp",
    path: ["SMTP_HOST"],
  })
  .refine((e) => e.EMAIL_MODE !== "brevo" || (e.BREVO_API_KEY && e.MAIL_FROM), {
    message: "BREVO_API_KEY and MAIL_FROM (a sender verified in Brevo) are required when EMAIL_MODE=brevo",
    path: ["BREVO_API_KEY"],
  });

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
