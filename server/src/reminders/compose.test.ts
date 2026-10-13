import { describe, expect, it } from "vitest";
import {
  composeReminder,
  hasSomethingToSay,
  huArticle,
  isReminderTime,
  localHour,
  unsubscribeToken,
  verifyUnsubscribeToken,
} from "./compose.js";

describe("isReminderTime", () => {
  // 16:30 UTC = 18:30 in Budapest (summer time).
  const now = new Date("2026-10-07T16:30:00Z");
  const base = { enabled: true, hour: 18, timeZone: "Europe/Budapest" };

  it("uses the learner's local hour", () => {
    expect(localHour(now, "Europe/Budapest")).toBe(18);
    expect(localHour(now, "UTC")).toBe(16);
    expect(isReminderTime(base, now)).toBe(true);
    expect(isReminderTime({ ...base, timeZone: "UTC" }, now)).toBe(false);
  });

  it("sends late rather than never if a run was missed", () => {
    expect(isReminderTime({ ...base, hour: 9 }, now)).toBe(true);
    expect(isReminderTime({ ...base, hour: 19 }, now)).toBe(false);
  });

  it("sends at most once a day, and only when turned on", () => {
    expect(isReminderTime({ ...base, lastSentDay: "2026-10-07" }, now)).toBe(false);
    expect(isReminderTime({ ...base, lastSentDay: "2026-10-06" }, now)).toBe(true);
    expect(isReminderTime({ ...base, enabled: false }, now)).toBe(false);
  });

  it("can ignore the hour for a manual test run, but not the once-a-day rule", () => {
    expect(isReminderTime({ ...base, hour: 23 }, now, true)).toBe(true);
    expect(isReminderTime({ ...base, lastSentDay: "2026-10-07" }, now, true)).toBe(false);
  });
});

describe("hasSomethingToSay", () => {
  it("needs due cards or a streak at risk", () => {
    expect(hasSomethingToSay({ dueCards: 3, streak: 0, practicedToday: false })).toBe(true);
    expect(hasSomethingToSay({ dueCards: 0, streak: 5, practicedToday: false })).toBe(true);
    expect(hasSomethingToSay({ dueCards: 0, streak: 5, practicedToday: true })).toBe(false);
    expect(hasSomethingToSay({ dueCards: 0, streak: 0, practicedToday: false })).toBe(false);
  });
});

describe("composeReminder", () => {
  const input = {
    name: "Anna",
    language: "hu",
    clientOrigin: "https://app.example",
    unsubscribeUrl: "https://app.example/api/reminders/unsubscribe?token=x",
    dueCards: 12,
    streak: 7,
    practicedToday: false,
  };

  it("leads with the streak when it is at risk", () => {
    const mail = composeReminder(input);
    expect(mail.subject).toBe("Ne szakadjon meg a 7 napos sorozatod! 🔥");
    expect(mail.text).toContain("12 kártya vár ismétlésre");
    expect(mail.text).toContain("https://app.example/review");
    expect(mail.text).toContain(input.unsubscribeUrl);
  });

  it("only talks about cards once today's practice is done", () => {
    const mail = composeReminder({ ...input, practicedToday: true });
    expect(mail.subject).toBe("12 kártya vár ismétlésre");
    expect(mail.text).not.toContain("sorozat");
  });

  it("links to practice when no card is due", () => {
    const mail = composeReminder({ ...input, dueCards: 0 });
    expect(mail.text).toContain("Gyakorlás: https://app.example/");
    expect(mail.text).not.toContain("/review");
  });

  it("speaks the learner's language, with English as fallback", () => {
    expect(composeReminder({ ...input, language: "en", streak: 0, dueCards: 1 }).subject).toBe(
      "1 card is waiting for review",
    );
    expect(composeReminder({ ...input, language: "xx", streak: 0 }).subject).toBe("12 cards are waiting for review");
  });

  it("escapes the name in the HTML version", () => {
    const mail = composeReminder({ ...input, name: "<b>Anna</b>" });
    expect(mail.html).not.toContain("<b>Anna</b>");
    expect(mail.html).toContain("&#60;b&#62;Anna");
  });
});

describe("huArticle", () => {
  it("uses 'az' when the spoken number starts with a vowel", () => {
    // egy, öt, ötven, ötszáz, ezer, ezerkétszáz
    for (const n of [1, 5, 50, 500, 1000, 1200]) expect(huArticle(n), String(n)).toBe("az");
    // kettő, tíz, tizenegy, tizenöt, száz, hétszáz
    for (const n of [2, 10, 11, 15, 100, 700]) expect(huArticle(n), String(n)).toBe("a");
  });

  it("fixes the streak subject for a 1- or 5-day streak", () => {
    const base = { name: "Anna", language: "hu", clientOrigin: "x", unsubscribeUrl: "y", dueCards: 0, practicedToday: false };
    expect(composeReminder({ ...base, streak: 1 }).subject).toBe("Ne szakadjon meg az 1 napos sorozatod! 🔥");
    expect(composeReminder({ ...base, streak: 5 }).subject).toBe("Ne szakadjon meg az 5 napos sorozatod! 🔥");
    expect(composeReminder({ ...base, streak: 2 }).subject).toBe("Ne szakadjon meg a 2 napos sorozatod! 🔥");
  });
});

describe("unsubscribe tokens", () => {
  const secret = "x".repeat(40);
  const userId = "652f1c2e9b1e8a3d4c5b6a79";

  it("round-trips", () => {
    expect(verifyUnsubscribeToken(unsubscribeToken(userId, secret), secret)).toBe(userId);
  });

  it("rejects forged or tampered tokens", () => {
    const token = unsubscribeToken(userId, secret);
    const otherUser = "652f1c2e9b1e8a3d4c5b6a7a";
    expect(verifyUnsubscribeToken(`${otherUser}.${token.split(".")[1]}`, secret)).toBeNull();
    expect(verifyUnsubscribeToken(token, "y".repeat(40))).toBeNull();
    expect(verifyUnsubscribeToken("garbage", secret)).toBeNull();
    expect(verifyUnsubscribeToken(`${userId}.`, secret)).toBeNull();
  });
});
