import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import conversationRoutes from "./routes/conversations.js";
import cardRoutes from "./routes/cards.js";
import grammarRoutes from "./routes/grammar.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { HttpError } from "./lib/HttpError.js";
import { llm } from "./llm/index.js";

export const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "50kb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  // The mode is shown in the chat header, so it's always clear what is answering.
  res.json({ ok: true, llm: { mode: llm.mode, model: llm.model } });
});

app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/grammar", grammarRoutes);

app.use(() => {
  throw new HttpError(404, "Not found");
});

app.use(errorHandler);
