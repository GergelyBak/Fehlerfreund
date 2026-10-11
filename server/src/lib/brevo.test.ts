import { describe, expect, it, vi } from "vitest";
import { brevoPayload, parseAddress, sendViaBrevo } from "./brevo.js";

const mail = { to: "learner@example.com", subject: "Hi", text: "plain", html: "<p>html</p>" };

describe("parseAddress", () => {
  it("reads 'Name <email>' and plain addresses", () => {
    expect(parseAddress("Fehlerfreund <me@example.com>")).toEqual({ name: "Fehlerfreund", email: "me@example.com" });
    expect(parseAddress('"Fehler Freund" <me@example.com>')).toEqual({ name: "Fehler Freund", email: "me@example.com" });
    expect(parseAddress(" me@example.com ")).toEqual({ email: "me@example.com" });
    expect(parseAddress("<me@example.com>")).toEqual({ email: "me@example.com" });
  });

  it("rejects things that aren't addresses", () => {
    expect(() => parseAddress("Fehlerfreund")).toThrow();
  });
});

describe("brevo", () => {
  it("builds the API payload with both text and HTML", () => {
    expect(brevoPayload("Fehlerfreund <me@example.com>", mail)).toEqual({
      sender: { name: "Fehlerfreund", email: "me@example.com" },
      to: [{ email: "learner@example.com" }],
      subject: "Hi",
      htmlContent: "<p>html</p>",
      textContent: "plain",
    });
  });

  it("sends the key in the api-key header", async () => {
    const fetchImpl = vi.fn(async () => new Response('{"messageId":"x"}', { status: 201 }));
    await sendViaBrevo("key-123", "me@example.com", mail, fetchImpl as unknown as typeof fetch);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect((init.headers as Record<string, string>)["api-key"]).toBe("key-123");
  });

  it("surfaces Brevo's reason when it refuses", async () => {
    const fetchImpl = async () => new Response('{"message":"Sender not verified"}', { status: 400 });
    await expect(sendViaBrevo("k", "me@example.com", mail, fetchImpl as unknown as typeof fetch)).rejects.toThrow(
      /400.*Sender not verified/,
    );
  });
});
