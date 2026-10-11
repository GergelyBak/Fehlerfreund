import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { sendViaBrevo } from "./brevo.js";

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
  if (env.EMAIL_MODE === "brevo") {
    // Both are checked at startup when EMAIL_MODE=brevo.
    await sendViaBrevo(env.BREVO_API_KEY!, env.MAIL_FROM!, mail);
    return;
  }
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

const RESET_TEXT = {
  hu: {
    subject: "Fehlerfreund – új jelszó beállítása",
    greeting: (name: string) => `Szia ${name}!`,
    intro: "Új jelszót kértél a Fehlerfreund-fiókodhoz. Az alábbi linken beállíthatod (1 óráig érvényes):",
    introHtml: "Új jelszót kértél a fiókodhoz. A gombra kattintva beállíthatod. A link <strong>1 óráig</strong> érvényes.",
    button: "Új jelszó beállítása",
    ignore: "Ha nem te kérted, nyugodtan hagyd figyelmen kívül ezt a levelet, a jelszavad nem változik.",
  },
  en: {
    subject: "Fehlerfreund – set a new password",
    greeting: (name: string) => `Hi ${name}!`,
    intro: "You asked for a new password for your Fehlerfreund account. You can set it here (valid for 1 hour):",
    introHtml: "You asked for a new password for your account. Click the button to set it. The link is valid for <strong>1 hour</strong>.",
    button: "Set a new password",
    ignore: "If you didn't ask for this, just ignore this email. Your password won't change.",
  },
};

export function passwordResetMail(to: string, name: string, link: string, language = "hu"): Mail {
  const t = language === "en" ? RESET_TEXT.en : RESET_TEXT.hu;
  return {
    to,
    subject: t.subject,
    text: [t.greeting(name), "", t.intro, link, "", t.ignore].join("\n"),
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;color:#0f172a">
        <h2 style="color:#4f46e5">Fehlerfreund</h2>
        <p>${escapeHtml(t.greeting(name))}</p>
        <p>${t.introHtml}</p>
        <p style="margin:28px 0">
          <a href="${link}" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">
            ${t.button}
          </a>
        </p>
        <p style="color:#64748b;font-size:14px">${t.ignore}</p>
      </div>`,
  };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
