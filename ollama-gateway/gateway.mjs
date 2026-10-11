// A small guard in front of a local Ollama, so it can be reached through a
// public tunnel without handing the whole Ollama API to the internet.
//
// Ollama has no authentication: anyone who reaches it can run any model,
// pull new ones or delete existing ones. This gateway only lets through
// what Fehlerfreund needs:
//   - requests with the right bearer token (constant-time comparison),
//   - GET /api/version, GET /api/tags and POST /api/chat,
//   - chat requests for the allowed model(s), up to 1 MB of JSON.
// Streaming responses are piped through unchanged.
//
//   GATEWAY_TOKEN=... node gateway.mjs
//
// No dependencies, Node 20+.

import { createHash, timingSafeEqual } from "node:crypto";
import http from "node:http";

const TOKEN = process.env.GATEWAY_TOKEN ?? "";
const PORT = Number(process.env.GATEWAY_PORT ?? 11500);
const OLLAMA_URL = (process.env.OLLAMA_URL ?? "http://127.0.0.1:11434").replace(/\/$/, "");
const MODELS = (process.env.GATEWAY_MODELS ?? "gemma3:4b").split(",").map((m) => m.trim());
const MAX_BODY = 1024 * 1024;

if (TOKEN.length < 32) {
  console.error("Set GATEWAY_TOKEN to a random string of at least 32 characters.");
  process.exit(1);
}

const ROUTES = new Set(["GET /api/version", "GET /api/tags", "POST /api/chat"]);
const sha256 = (s) => createHash("sha256").update(s).digest();
const EXPECTED = sha256(`Bearer ${TOKEN}`);

function reply(res, status, error) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error }));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error("Body too large"), { status: 413 }));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const path = new URL(req.url ?? "/", "http://x").pathname;
  const started = Date.now();
  res.on("finish", () => console.log(`${req.method} ${path} → ${res.statusCode} (${Date.now() - started} ms)`));

  // Hashing first makes the comparison constant-time regardless of length.
  if (!timingSafeEqual(sha256(req.headers.authorization ?? ""), EXPECTED)) return reply(res, 401, "Unauthorized");
  if (!ROUTES.has(`${req.method} ${path}`)) return reply(res, 404, "Not found");

  let body;
  try {
    if (req.method === "POST") {
      body = await readBody(req);
      const { model } = JSON.parse(body.toString("utf8"));
      if (!MODELS.includes(model)) return reply(res, 403, `Model not allowed: ${model}`);
    }
  } catch (err) {
    return reply(res, err.status ?? 400, err.status ? err.message : "Invalid JSON");
  }

  // Stop the model if the caller goes away mid-stream.
  const controller = new AbortController();
  res.on("close", () => controller.abort());

  let upstream;
  try {
    upstream = await fetch(`${OLLAMA_URL}${path}`, {
      method: req.method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body,
      signal: controller.signal,
    });
  } catch {
    // Ollama itself isn't running: the server treats 503 as "offline".
    return reply(res, 503, "Ollama is not running");
  }

  res.writeHead(upstream.status, { "Content-Type": upstream.headers.get("content-type") ?? "application/json" });
  if (!upstream.body) return res.end();
  try {
    for await (const chunk of upstream.body) res.write(chunk);
  } catch {
    // Client left or Ollama stopped; nothing more to send.
  }
  res.end();
});

// Only reachable from this machine; the tunnel connects locally.
server.listen(PORT, "127.0.0.1", () => {
  console.log(`ollama-gateway on http://127.0.0.1:${PORT} → ${OLLAMA_URL} (models: ${MODELS.join(", ")})`);
});
