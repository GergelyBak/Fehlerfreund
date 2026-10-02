# Fehlerfreund

[![CI](https://github.com/GergelyBak/Fehlerfreund/actions/workflows/ci.yml/badge.svg)](https://github.com/GergelyBak/Fehlerfreund/actions/workflows/ci.yml)

A German conversation partner that teaches from your own mistakes.

You chat in real-life situations (Bürgeramt, doctor, flat viewing, job interview…) at your CEFR level. An LLM plays the other side and corrects each message, with an explanation in your native language. Your mistakes become flashcards, and an SM-2 spaced-repetition scheduler brings them back for review. There is also a textbook-style A2 grammar course, and your wrong test answers go into the same deck.

## Features

- **Roleplay chat.** 10 situations, each with 3 goals to tick off and useful phrases that insert into the message box. Replies stream live.
- **Correction on every message.** Error type (`Kasus`, `Tempus`, `Wortstellung`…), the fix, and a short explanation in Hungarian, English or Turkish.
- **Translate and listen.** Translate any partner message into your language on demand. German is read aloud at normal or slow speed, with optional auto-read.
- **Flashcards with SM-2.** Chat mistakes and wrong grammar answers become cards. The review page has keyboard grading, and forgotten cards come back within the same session.
- **A2 grammar course.** 13 hand-written topics. Each has explanations, tables, spoken examples and a graded test. The topics: Perfekt, Präteritum, Dativ, Wechselpräpositionen, weil/dass/wenn, comparison, adjective endings, Konjunktiv II, reflexive verbs, verbs with prepositions, indirect questions, time expressions, and prepositions with a fixed case.
- **Statistics.** Your weakest area, mistakes by error type, a 14-day activity chart, card maturity, grammar progress and a daily streak. One click starts targeted practice for an error type.
- **Accounts.** JWT auth, password reset by email, and per-user progress.

## Stack

- **Client:** React 19, TypeScript, Tailwind CSS 4, Vite, React Router, Web Speech API
- **Server:** Node.js, Express 5, TypeScript, MongoDB Atlas (Mongoose), Zod, Nodemailer
- **LLM:** a local model via [Ollama](https://ollama.com) (default `gemma3:4b`), or the Claude API (`claude-sonnet-5`), or a mock
- **Tests:** Vitest (82 tests) and a correction-quality eval

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
- **Correction quality is measured, not guessed.** `npm run eval:correction -- --prompt v2` (in `server/`) runs 28 fixed A2 sentences (18 with known errors, 10 correct) through the same path as the app: model → Zod → sanitizer. It reports recall, false alarms, error-type accuracy and whether the marked fragment is precise enough for a flashcard. Results for `gemma3:4b`:

  | | prompt v1 | prompt v2 |
  |---|---|---|
  | Errors found (recall) | 52% | 52% |
  | False alarms on correct sentences | 0% | 0% |
  | Error type correct | 55% | **91%** |
  | Precise fragment (card-ready) | 45% | **91%** |
  | Failed outputs | 0 | 0 |
  | Avg latency | 3.6 s | 3.4 s |

  v2 adds a step-by-step checklist and worked examples. Measuring it surfaced two real bugs. First, Hungarian „…” quotes in the examples made the model close a JSON string with `”` and then emit whitespace until the request hung for 5 minutes, so non-streamed Ollama calls now have a token cap and a timeout. Second, v2 made more over-eager fixes, so the sanitizer now drops any fix that contradicts the model's own corrected sentence. That removed half of them and lost no real finds. With 28 sentences, differences of a few points are noise; the 45% → 91% jumps are not.
- **Model choice was measured, not assumed.** On the same sentences, Claude Haiku 4.5 missed errors and explained a noun's gender wrongly, so the Claude path uses Sonnet at low effort. For running free, `gemma3:4b` gives good roleplay (about 0.8 s to first token on a 4 GB laptop GPU) but weaker corrections, which the sanitizer only partly offsets.
- **Grammar content is hand-written, and tests are graded on the server.** Textbook material has to be correct, which a small model can't guarantee. Solutions never reach the browser before answering. Answer checking accepts any letter case and `ae`/`ss` for `ä`/`ß` (Hungarian keyboards have neither). Content-integrity tests guard the hand-written data.
- **Flashcards and SM-2.** A chat card's front is the learner's sentence with *only that* error left in, so each card practises one rule. Repeating a known mistake bumps the card and restarts its schedule instead of creating a duplicate. SM-2 is a pure, unit-tested function (`server/src/srs/sm2.ts`), and the interval preview on each answer button comes from the same function.
- **Statistics in the learner's time zone.** Daily activity is grouped with MongoDB `$dateToString` in the browser's IANA time zone, and the streak logic works on calendar days, so a late-evening session or a daylight-saving change can't break a streak. The helpers are pure and unit-tested (`server/src/stats/compute.ts`).
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

## Deployment

The public demo runs on free tiers: the client on **Vercel** (`client/vercel.json`), the API on **Render** (`render.yaml` Blueprint) and the database on **MongoDB Atlas**.

- The client calls the API through a Vercel rewrite (`/api/*` → Render), so the auth cookie stays first-party and works in browsers that block third-party cookies. That puts two proxies in front of the API, hence `TRUST_PROXY=2`, which keeps per-visitor rate limits.
- The free plan has no GPU and too little memory for a local model, so the demo chat runs with `LLM_MODE=mock`, and the app says so. Everything else (grammar, flashcards, statistics, speech) is fully functional.
- Render free services sleep after 15 idle minutes. The client detects the unreachable API, shows a "waking up" notice and retries for up to 90 seconds.
- GitHub Actions runs type-checks, the unit tests, lint and both builds on every push.

## Next

- B1 grammar topics
- Higher recall from local models (word order and article gender are still the weak spots)
