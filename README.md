# Fehlerfreund

[![CI](https://github.com/GergelyBak/Fehlerfreund/actions/workflows/ci.yml/badge.svg)](https://github.com/GergelyBak/Fehlerfreund/actions/workflows/ci.yml)

A German conversation partner that teaches from your own mistakes.

**Live demo: [fehlerfreund.vercel.app](https://fehlerfreund.vercel.app)**. Register with any email. The chat runs on a free model on the developer's own machine, so it's only online while that machine is on. The app says when it's offline (see [Deployment](#deployment)). The first load can take up to a minute while the free API wakes up.

You chat in real-life situations (Bürgeramt, doctor, flat viewing, job interview…) at your CEFR level. An LLM plays the other side and corrects each message, with an explanation in your native language. Your mistakes become flashcards, and an SM-2 spaced-repetition scheduler brings them back for review. There is also a textbook-style A1–B1 grammar course and a vocabulary trainer by level and topic, and your wrong test answers go into the same deck.

## Features

- **Roleplay chat.** 10 situations, each with 3 goals to tick off and useful phrases that insert into the message box. Replies stream live.
- **Correction on every message.** Error type (`Kasus`, `Tempus`, `Wortstellung`…), the fix, and a short explanation in Hungarian or English.
- **English and Hungarian UI.** The app, situations, emails and explanations follow the account's language. A HU/EN switch in the header changes it instantly. Before sign-in, the browser language decides. The grammar lessons themselves are in Hungarian for now.
- **Translate and listen.** Translate any partner message into your language on demand. German is read aloud at normal or slow speed, with optional auto-read.
- **Flashcards with SM-2.** Chat mistakes and wrong grammar answers become cards. The review page has keyboard grading, and forgotten cards come back within the same session.
- **Vocabulary by level.** 2,394 words: 663 for A1 and 670 for A2 in 25 topics each, and 1,061 for B1 in 40 topics (career, healthcare, society, politics, law, opinions, idioms, verbs with prepositions, formal letters…). Every word has its article and plural, Hungarian and English translations, an example sentence and read-aloud. Each topic has a test (translation → German), and wrong answers become "say it in German" cards. A wrong article on the right noun is graded separately and filed under `Artikel`, so the statistics show whether you don't know the word or just its gender. The list is the project's own, sized to the Goethe exam levels; it isn't copied from them.
- **Grammar course, A1 to B1.** 33 hand-written topics: 10 for A1 (present tense, articles, plural, Akkusativ, word order, nicht/kein, modal verbs, separable verbs, possessives, imperative), 13 for A2 and 10 for B1. Each has explanations, tables, spoken examples and a graded test. The A2 topics: Perfekt, Präteritum, Dativ, Wechselpräpositionen, weil/dass/wenn, comparison, adjective endings, Konjunktiv II, reflexive verbs, verbs with prepositions, indirect questions, time expressions, and prepositions with a fixed case. The B1 topics: relative clauses, Passiv, Genitiv, temporal clauses (als/wenn, bevor, nachdem), zu-infinitive and um … zu, Präteritum for storytelling, Plusquamperfekt, past Konjunktiv II, n-declension, and paired conjunctions (sowohl … als auch, je … desto).
- **Statistics.** Your weakest area, mistakes by error type, a 14-day activity chart, card maturity, grammar progress and a daily streak. One click starts targeted practice for an error type.
- **Daily reminder email.** Opt-in and sent by an [n8n workflow](n8n/README.md): it goes out at the learner's chosen local hour, but only when cards are due or a streak is about to break. It is sent at most once a day and has a one-click unsubscribe.
- **Installable on phones (PWA).** It has its own icon and opens full-screen without the browser bar:
  - **Android** and desktop Chrome/Edge show a one-tap install button.
  - **iPhone** users get the Safari "Add to Home Screen" steps.
  - **Offline:** the service worker serves pages network-first with an offline fallback and caches the hashed assets. It never caches `/api`, so data is always live.
- **Accounts.** JWT auth, password reset by email, and per-user progress.

## Stack

- **Client:** React 19, TypeScript, Tailwind CSS 4, Vite, React Router, Web Speech API
- **Server:** Node.js, Express 5, TypeScript, MongoDB Atlas (Mongoose), Zod, Nodemailer
- **LLM:** a local model via [Ollama](https://ollama.com) (default `gemma3:4b`), or the Claude API (`claude-sonnet-5`)
- **Tests:** Vitest (220 tests) and a correction-quality eval

## Engineering notes

- **Two interchangeable LLM providers behind one interface** (`LLM_MODE`), and the routes never know which one runs:
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
- **Grammar content is hand-written, and tests are graded on the server.** Textbook material has to be correct, which a small model can't guarantee. Solutions never reach the browser before answering. Answer checking accepts any letter case and `ae`/`ss` for `ä`/`ß` (Hungarian keyboards have neither). Content-integrity tests guard the hand-written data. The vocabulary is written one word per line (`n | der Apfel | Äpfel | alma | apple | Ich esse einen Apfel.`), so hundreds of entries stay reviewable. Tests check every line: column count, an article on every noun, a filled plural, an example sentence, and no word taught twice across all levels.
- **Flashcards and SM-2.** A chat card's front is the learner's sentence with *only that* error left in, so each card practises one rule. Repeating a known mistake bumps the card and restarts its schedule instead of creating a duplicate. SM-2 is a pure, unit-tested function (`server/src/srs/sm2.ts`), and the interval preview on each answer button comes from the same function.
- **Statistics in the learner's time zone.** Daily activity is grouped with MongoDB `$dateToString` in the browser's IANA time zone, and the streak logic works on calendar days, so a late-evening session or a daylight-saving change can't break a streak. The helpers are pure and unit-tested (`server/src/stats/compute.ts`).
- **Reminders: n8n delivers, the API decides.** Every hour the workflow asks the API who needs an email right now and gets back the finished, localized messages. It sends them, then confirms each one, so a failed send is retried on the next run and a sent one is never repeated that day. Time zones, the "only if there's something to say" rule and the wording all live in unit-tested TypeScript (`server/src/reminders/compose.ts`), not in workflow expressions. The internal endpoints need a bearer key that is compared in constant time. Unsubscribe links are HMAC-signed, and opening one only asks for confirmation, because mail scanners follow links.
- **Versioned prompts** live in `server/prompts/*.vN.md`, and the version is stored with each correction.
- **Few-shot examples set the language, not the instruction.** Adding English exposed a bug: with v2's Hungarian worked examples, English learners got Hungarian or even German explanations from `gemma3:4b`, even though the prompt asked for English (5 of 6 test sentences, plus 1 broken JSON). In v3 the examples are rendered in the learner's language (`server/src/llm/correctionPrompt.ts`), and the result was 6 of 6 in English. A test pins the Hungarian v3 prompt to be byte-identical to v2, so v2's measured quality still holds.
- **Typed UI translations without a library.** `client/src/i18n/hu.ts` is the source; `en.ts` is typed against it, so a missing or misspelled key is a compile error rather than a blank on screen. Server error messages stay English and are mapped per language on the client.
- **Production concerns:**
  - Auth uses a JWT in an httpOnly cookie.
  - There are per-user rate limits and a daily token budget.
  - The API key stays server-side only.
  - Password-reset tokens are single-use and stored hashed, and the reset endpoint doesn't reveal which emails have accounts.
  - Environment variables are validated at startup, and unhandled errors are logged loudly.

## Running locally

Requirements: Node.js 20+ and a MongoDB connection string (a free Atlas cluster works). Ollama is needed for the chat (`LLM_MODE=ollama`, the default).

```bash
# optional: free local model
ollama pull gemma3:4b

# server
cd server
cp .env.example .env   # set MONGODB_URI and pick LLM_MODE (ollama / live)
npm install
npm run dev            # http://localhost:4000, restarts on changes to src, prompts and .env

# client
cd client
npm install
npm run dev            # http://localhost:5173 (proxies /api to the server)
```

Run the tests with `cd server && npm test`.

In development, password-reset emails are printed to the server terminal (`EMAIL_MODE=console`). To send real ones, set `EMAIL_MODE=brevo` (Brevo's HTTP API, also used in production) or `EMAIL_MODE=smtp`. The daily reminder needs `REMINDER_API_KEY` and the n8n workflow; see [n8n/README.md](n8n/README.md).

## Deployment

The public demo runs on free tiers: the client on **Vercel** (`client/vercel.json`), the API on **Render** (`render.yaml` Blueprint) and the database on **MongoDB Atlas**.

- The client calls the API through a Vercel rewrite (`/api/*` → Render), so the auth cookie stays first-party and works in browsers that block third-party cookies. That puts two proxies in front of the API, hence `TRUST_PROXY=2`, which keeps per-visitor rate limits.
- **The model runs at home, for free.** Render's free plan has no GPU and too little memory for a model, so the API calls Ollama on the developer's machine through a tunnel. Ollama has no authentication, so it sits behind [`ollama-gateway`](ollama-gateway/README.md), a dependency-free proxy:
  - it only accepts requests with a bearer token,
  - it only allows chat with one model,
  - it only exposes three endpoints, so pulling or deleting models is refused.
- **Offline is a normal state, not an error.** When the machine is off, `/api/llm/status` reports it (cached for 15 s) and the UI says the conversation partner is offline. A chat message then fails within a fraction of a second instead of timing out.
  - Every "upstream down" answer from the tunnel or the gateway (502/503/530, ngrok errors) maps to one `LlmUnavailableError`.
  - `/api/health` doesn't depend on the model, so Render never restarts a healthy API just because the model is away.
  - Grammar, flashcards, statistics and speech always work.
- Render's free plan blocks outgoing SMTP, so password-reset emails go through Brevo's HTTP API (`EMAIL_MODE=brevo`, `server/src/lib/brevo.ts`).
- Render free services sleep after 15 idle minutes. The client detects the unreachable API, shows a "waking up" notice and retries for up to 90 seconds.
- GitHub Actions runs type-checks, the unit tests, lint and both builds on every push.

## Next

- Pronunciation practice with speech recognition
- Higher recall from local models (word order and article gender are still the weak spots)
