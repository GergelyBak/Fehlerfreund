# ollama-gateway

The public demo's chat is answered by Ollama (`gemma3:4b`) running on the developer's own machine, so the AI costs nothing. The API on Render reaches it through a tunnel:

```
Render API ──HTTPS──▶ tunnel (ngrok) ──▶ gateway.mjs :11500 ──▶ Ollama :11434
                                         (bearer token, allowlist)
```

Ollama has no authentication, so it is never exposed directly. `gateway.mjs` (no dependencies) only lets through:
- requests with the right bearer token,
- `GET /api/version`, `GET /api/tags` and `POST /api/chat`,
- chat requests for the allowed model.

Pulling, deleting or running other models is refused. The gateway listens on `127.0.0.1` only.

When the machine is off, the app says the conversation partner is offline (`/api/llm/status`). Grammar, flashcards, statistics and speech keep working.

## One-time setup

1. **Token:** generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
2. **`ollama-gateway/.env`** (gitignored):
   ```
   GATEWAY_TOKEN=<the token>
   ```
3. **ngrok:** create a free account at ngrok.com. Then install it (`winget install ngrok.ngrok`), run `ngrok config add-authtoken <your authtoken>`, and claim your free static domain (Dashboard → Domains), e.g. `something.ngrok-free.app`.
4. **Render** (fehlerfreund-api → Environment):
   - `LLM_MODE` = `ollama`
   - `OLLAMA_URL` = `https://something.ngrok-free.app`
   - `OLLAMA_API_KEY` = the same token
   - `OLLAMA_MODEL` = `gemma3:4b`

## Putting the demo online

With Ollama running, one command starts both and Ctrl+C stops both. It needs `NGROK_DOMAIN=something.ngrok-free.app` in `.env` too.

```powershell
powershell -ExecutionPolicy Bypass -File ollama-gateway\start.ps1
```

Or start the gateway and the tunnel by hand, in two terminals:

```bash
cd ollama-gateway
node --env-file=.env gateway.mjs
```

```bash
ngrok http --domain=something.ngrok-free.app 11500
```

The app notices within about 20 seconds. Stop both (Ctrl+C) to take the chat offline.

**Without an ngrok account:** `cloudflared tunnel --url http://localhost:11500` works too. The URL changes on every start, though, so `OLLAMA_URL` on Render has to be updated each time.

## Settings

| Variable | Default | |
|---|---|---|
| `GATEWAY_TOKEN` | (required) | at least 32 characters, same as `OLLAMA_API_KEY` on the server |
| `GATEWAY_PORT` | `11500` | |
| `OLLAMA_URL` | `http://127.0.0.1:11434` | the local Ollama |
| `GATEWAY_MODELS` | `gemma3:4b` | comma-separated allowlist |
