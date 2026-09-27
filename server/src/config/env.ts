import "dotenv/config";
import { z } from "zod";

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    MONGODB_URI: z.string().startsWith("mongodb"),
    // mock = free canned responses for development; live = real Claude calls.
    LLM_MODE: z.enum(["mock", "live"]).default("mock"),
    // An empty `ANTHROPIC_API_KEY=` line counts as not set.
    ANTHROPIC_API_KEY: z.preprocess((v) => (v === "" ? undefined : v), z.string().optional()),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    CLIENT_ORIGIN: z.url().default("http://localhost:5173"),
    DAILY_TOKEN_BUDGET: z.coerce.number().int().positive().default(200_000),
  })
  .refine((e) => e.LLM_MODE === "mock" || e.ANTHROPIC_API_KEY, {
    message: "ANTHROPIC_API_KEY is required when LLM_MODE=live",
    path: ["ANTHROPIC_API_KEY"],
  });

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
