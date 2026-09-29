# Fehlerfreund

A German conversation partner that teaches from your own mistakes.

You chat in real-life situations (Bürgeramt, doctor, flat viewing, job interview…) at your CEFR level. An LLM plays the other side and corrects each message, with an explanation in your native language. Your mistakes become flashcards, and an SM-2 spaced-repetition scheduler brings them back for review. There is also a textbook-style A2 grammar course, and your wrong test answers go into the same deck.

## Features

- **Roleplay chat.** 10 situations, each with 3 goals to tick off and useful phrases that insert into the message box. Replies stream live.
- **Correction on every message.** Error type (`Kasus`, `Tempus`, `Wortstellung`…), the fix, and a short explanation in Hungarian, English or Turkish.
- **Translate and listen.** Translate any partner message into your language on demand. German is read aloud at normal or slow speed, with optional auto-read.
- **Flashcards with SM-2.** Chat mistakes and wrong grammar answers become cards. The review page has keyboard grading, and forgotten cards come back within the same session.
- **A2 grammar course.** 13 hand-written topics. Each has explanations, tables, spoken examples and a graded test. The topics: Perfekt, Präteritum, Dativ, Wechselpräpositionen, weil/dass/wenn, comparison, adjective endings, Konjunktiv II, reflexive verbs, verbs with prepositions, indirect questions, time expressions, and prepositions with a fixed case.
- **Accounts.** JWT auth, password reset by email, and per-user progress.

## Stack

- **Client:** React 19, TypeScript, Tailwind CSS 4, Vite, React Router, Web Speech API
- **Server:** Node.js, Express 5, TypeScript, MongoDB Atlas (Mongoose), Zod, Nodemailer
- **LLM:** a local model via [Ollama](https://ollama.com) (default `gemma3:4b`), or the Claude API (`claude-sonnet-5`), or a mock
- **Tests:** Vitest (65 tests)

## Engineering notes

- **Three interchangeable LLM providers behind one interface** (`LLM_MODE`), and the routes never know which one runs:
  - `mock`: canned, per-situation scripts. Free and deterministic, used for UI work and tests.
  - `ollama`: a free local model via Ollama's REST API, with NDJSON streaming and JSON-schema structured output.
  - `live`: the Claude API.

  The chat header shows which one is answering.
- **Two calls per message.** The roleplay reply streams as Server-Sent Events, and the correction is a separate structured-output call validated with Zod. Hosted models run the two in parallel. A local model serves one request at a time, so there the reply goes first. A failed correction never breaks the chat. The browser reads the SSE stream from a `POST` with `fetch` and a hand-written parser, since `EventSource` only supports `GET`.
- **LLM output is never trusted as-is.** Corrections pass Zod validation and then deterministic sanity checks (`server/src/llm/sanitize.ts`), which drop these cases before they can become flashcards:
  - a fix that changes nothing,
  - a "mistake" that isn't in the learner's text,
  - an unchanged sentence reported as wrong.

  The test cases come from real small-model output.
- **Model choice was measured, not assumed.** On the same sentences, Claude Haiku 4.5 missed errors and explained a noun's gender wrongly, so the Claude path uses Sonnet at low effort. For running free, `gemma3:4b` gives good roleplay (about 0.8 s to first token on a 4 GB laptop GPU) but weaker corrections, which the sanitizer only partly offsets.
- **Grammar content is hand-written, and tests are graded on the server.** Textbook material has to be correct, which a small model can't guarantee. Solutions never reach the browser before answering. Answer checking accepts any letter case and `ae`/`ss` for `ä`/`ß` (Hungarian keyboards have neither). Content-integrity tests guard the hand-written data.
- **Flashcards and SM-2.** A chat card's front is the learner's sentence with *only that* error left in, so each card practises one rule. Repeating a known mistake bumps the card and restarts its schedule instead of creating a duplicate. SM-2 is a pure, unit-tested function (`server/src/srs/sm2.ts`), and the interval preview on each answer button comes from the same function.
- **Versioned prompts** live in `server/prompts/*.vN.md`, and the version is stored with each correction.
- **Production concerns:**
  - Auth uses a JWT in an httpOnly cookie.
  - There are per-user rate limits and a daily token budget.
  - The API key stays server-side only.
  - Password-reset tokens are single-use and stored hashed, and the reset endpoint doesn't reveal which emails have accounts.
  - Environment variables are validated at startup, and unhandled errors are logged loudly.

## Running locally

Requirements: Node.js 20+ and a MongoDB connection string (a free Atlas cluster works). Ollama is only needed for `LLM_MODE=ollama`.

```bash
# optional: free local model
ollama pull gemma3:4b

# server
cd server
cp .env.example .env   # set MONGODB_URI and pick LLM_MODE (mock / ollama / live)
npm install
npm run dev            # http://localhost:4000, restarts on changes to src, prompts and .env

# client
cd client
npm install
npm run dev            # http://localhost:5173 (proxies /api to the server)
```

Run the tests with `cd server && npm test`.

In development, password-reset emails are printed to the server terminal (`EMAIL_MODE=console`). Set `EMAIL_MODE=smtp` to send real ones.

## Next

- Error statistics ("your weakest area is the Dativ") and targeted practice
- B1 grammar topics
- Better corrections from local models (few-shot prompt, measured on a fixed test set)
