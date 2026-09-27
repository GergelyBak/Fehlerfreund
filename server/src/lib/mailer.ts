import nodemailer from "nodemailer";
import { env } from "../config/env.js";

export interface Mail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const transport =
  env.EMAIL_MODE === "smtp"
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      })
    : null;

export async function sendMail(mail: Mail) {
  if (!transport) {
    // Development: no mail server needed, the link shows up in the terminal.
    console.log(`\n📧 [EMAIL_MODE=console] To: ${mail.to}\n   Subject: ${mail.subject}\n\n${mail.text}\n`);
    return;
  }
  await transport.sendMail({
    from: env.MAIL_FROM ?? `Fehlerfreund <${env.SMTP_USER}>`,
    ...mail,
  });
}

export function passwordResetMail(to: string, name: string, link: string): Mail {
  return {
    to,
    subject: "Fehlerfreund – új jelszó beállítása",
    text: [
      `Szia ${name}!`,
      "",
      "Új jelszót kértél a Fehlerfreund-fiókodhoz. Az alábbi linken beállíthatod (1 óráig érvényes):",
      link,
      "",
      "Ha nem te kérted, nyugodtan hagyd figyelmen kívül ezt a levelet, a jelszavad nem változik.",
    ].join("\n"),
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;color:#0f172a">
        <h2 style="color:#4f46e5">Fehlerfreund</h2>
        <p>Szia ${escapeHtml(name)}!</p>
        <p>Új jelszót kértél a fiókodhoz. A gombra kattintva beállíthatod. A link <strong>1 óráig</strong> érvényes.</p>
        <p style="margin:28px 0">
          <a href="${link}" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">
            Új jelszó beállítása
          </a>
        </p>
        <p style="color:#64748b;font-size:14px">Ha nem te kérted, nyugodtan hagyd figyelmen kívül ezt a levelet, a jelszavad nem változik.</p>
      </div>`,
  };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
