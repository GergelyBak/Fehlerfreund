# Daily reminder workflow (n8n)

`daily-reminders.json` emails learners who turned on the daily reminder (Statistics page) when cards are due for review, or when they haven't practised yet today and their streak would break.

```
Every hour → Config → Get due reminders → One item per email → Send email → Mark as sent
```

The API does the thinking and the workflow only delivers.

- `GET /api/internal/reminders` returns the users whose chosen local hour has passed and who haven't had a reminder today. Only users with something to say are included (due cards or a streak at risk). Each one comes with the finished subject, plain text and HTML in the learner's language.
- After each successful send, `POST /api/internal/reminders/sent` records the day, so nobody gets a second email.
- A failed send isn't marked, so the next hourly run retries it.

Both endpoints need `Authorization: Bearer <REMINDER_API_KEY>`. Without that variable on the server they don't exist.

Every email has a one-click unsubscribe link: a signed token, so no login is needed. Opening the link only asks for confirmation, because mail scanners open links on their own.

## Setup

1. **Server:** set `REMINDER_API_KEY` to a random string of at least 32 characters, for example from `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. On Render the Blueprint generates one; copy it from the dashboard.
2. **n8n:** run it locally with `npx n8n` (http://localhost:5678), or use n8n Cloud. Then go to *Workflows → Import from file* and pick `daily-reminders.json`.
3. **Credentials** (the imported nodes point to these names):
   - **Fehlerfreund API key**, type *Header Auth*: name `Authorization`, value `Bearer <REMINDER_API_KEY>`.
   - **Fehlerfreund SMTP**, type *SMTP*. For Gmail: host `smtp.gmail.com`, port `465`, SSL on, user = your Gmail address, password = a 16-character App Password.
4. **Config node:** set `apiUrl`, which is `http://localhost:4000` locally or your deployed URL, and `fromEmail`.
5. **Test:** set `ignoreTime` to `true` in Config, then run *Execute workflow*. Everyone with reminders on who hasn't had one today gets an email right away. Set it back to `false` and **activate** the workflow.

If the API runs on Render's free plan, the first call may wake it up. That's why the request has a 90-second timeout and 3 retries.
