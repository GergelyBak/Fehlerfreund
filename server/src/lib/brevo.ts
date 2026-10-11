// Sending email through Brevo's HTTP API (https://developers.brevo.com).
// Plain HTTPS, so it works where outgoing SMTP ports are blocked (Render's
// free plan). No env import here, so it's unit-testable.

export interface OutgoingMail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

/** "Fehlerfreund <me@example.com>" or "me@example.com" → { name?, email }. */
export function parseAddress(address: string) {
  const match = /^\s*(.*?)\s*<([^<>\s]+@[^<>\s]+)>\s*$/.exec(address);
  if (match) return { ...(match[1] ? { name: match[1].replace(/^"|"$/g, "") } : {}), email: match[2]! };
  const email = address.trim();
  if (!/^[^\s@<>]+@[^\s@<>]+$/.test(email)) throw new Error(`Invalid sender address: ${address}`);
  return { email };
}

export function brevoPayload(from: string, mail: OutgoingMail) {
  return {
    sender: parseAddress(from),
    to: [{ email: mail.to }],
    subject: mail.subject,
    htmlContent: mail.html,
    textContent: mail.text,
  };
}

export async function sendViaBrevo(apiKey: string, from: string, mail: OutgoingMail, fetchImpl: typeof fetch = fetch) {
  const res = await fetchImpl(BREVO_URL, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(brevoPayload(from, mail)),
    signal: AbortSignal.timeout(15_000),
  });
  // Brevo explains rejections (unverified sender, bad key…) in the body.
  if (!res.ok) throw new Error(`Brevo rejected the email (${res.status}): ${await res.text()}`);
}
