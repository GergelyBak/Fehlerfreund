import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { llm } from "./llm/index.js";

// Make crashes loud: without these, a stray async error can take the server
// down mid-request and the only visible trace is the client's ECONNRESET.
process.on("unhandledRejection", (reason) => {
  console.error("💥 Unhandled promise rejection (server keeps running):", reason);
});
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught exception, server is stopping:", err);
  process.exit(1);
});

await connectDb();

app.listen(env.PORT, () => {
  console.log(`Server listening on http://localhost:${env.PORT}`);
  const note = { mock: " (canned replies, no cost)", ollama: " (local model, no cost)", live: " (Claude API, paid)" }[llm.mode];
  console.log(`LLM mode: ${llm.mode}${note}`);
  if (llm.mode === "ollama") void import("./llm/ollama.js").then(async (m) => console.log(`Ollama: ${await m.checkOllama()}`));
});
