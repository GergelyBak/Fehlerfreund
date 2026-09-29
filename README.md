# Fehlerfreund

A German conversation partner that teaches from your own mistakes.

Chat in a real-life situation (Bürgeramt, doctor, flat viewing…) at your CEFR level. Claude plays the other side and corrects each message with a structured explanation in your native language. Your mistakes become flashcards, and an SM-2 spaced-repetition scheduler brings them back for review.

> Work in progress. Done so far: auth (with password reset), 10 situations with goals and useful phrases, streamed (SSE) roleplay chat with parallel corrections and on-demand translation, flashcards from mistakes with SM-2 review. Next: error statistics.

## Stack

- **Client:** React 19, TypeScript, Tailwind CSS 4, Vite, React Router
- **Server:** Node.js, Express 5, TypeScript, MongoDB Atlas (Mongoose), Zod
- **AI:** Claude API, `claude-sonnet-5` for both the streamed roleplay and the structured corrections (Haiku 4.5 was tested for corrections, but it missed errors and gave wrong explanations)
- **Tests:** Vitest

## Engineering notes

- **Two calls per message.** The roleplay reply streams as plain text, while the correction is a separate structured-output call validated with Zod. When the output fails validation, the chat keeps going without that correction.
- **Flashcards from mistakes + SM-2.** Each major error becomes a card whose front is the learner's sentence with *only that* error left in. Repeating a known mistake bumps the card instead of duplicating it. Scheduling is a pure, unit-tested SM-2 implementation (`server/src/srs/sm2.ts`), and the interval preview on each answer button comes from the same function.
- **Closed error taxonomy** (`Kasus`, `Artikel`, `Wortstellung`…) so the mistakes can be aggregated into statistics.
- **Versioned prompts** in `server/prompts/*.vN.md`. The version is stored with each correction.
- **Three interchangeable LLM providers** behind one interface (`LLM_MODE`): `mock` (canned, per-situation scripts, used for tests), `ollama` (free local model, e.g. `gemma3:4b`, via Ollama's REST API with NDJSON streaming and JSON-schema output) and `live` (Claude API). The routes never know which one runs.
- **Corrections are never trusted as-is.** Every provider's output goes through Zod validation and then deterministic sanity checks (`server/src/llm/sanitize.ts`): a fix that changes nothing, a "mistake" that isn't in the learner's text, or an unchanged sentence reported as wrong are dropped before they can become flashcards.
- **Production concerns:** the API key stays server-side only. Auth uses a JWT in an httpOnly cookie. There are per-user rate limits and a daily token budget.

## Running locally

```bash
# server
cd server
cp .env.example .env   # fill in MONGODB_URI; pick LLM_MODE (mock / ollama / live)
npm install
npm run dev            # http://localhost:4000

# client
cd client
npm install
npm run dev            # http://localhost:5173 (proxies /api to the server)
```

Run the tests with `cd server && npm test`.
