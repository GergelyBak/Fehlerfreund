import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { llm } from "./llm/index.js";

await connectDb();

app.listen(env.PORT, () => {
  console.log(`Server listening on http://localhost:${env.PORT}`);
  console.log(`LLM mode: ${llm.mode}${llm.mode === "mock" ? " (no Claude calls, no cost)" : ""}`);
});
