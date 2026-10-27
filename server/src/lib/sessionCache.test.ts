import { describe, expect, it, vi } from "vitest";
import { rememberSessionVersion, sessionVersionOf } from "./sessionCache.js";

describe("sessionVersionOf", () => {
  it("loads once, then serves from the cache until it expires", async () => {
    const load = vi.fn(async () => 3);
    const t0 = 1_000_000;
    expect(await sessionVersionOf("user-a", load, t0)).toBe(3);
    expect(await sessionVersionOf("user-a", load, t0 + 30_000)).toBe(3);
    expect(load).toHaveBeenCalledTimes(1);
    // After a minute the database is asked again.
    expect(await sessionVersionOf("user-a", load, t0 + 61_000)).toBe(3);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("sees a version bump made in this process immediately", async () => {
    const load = vi.fn(async () => 0);
    expect(await sessionVersionOf("user-b", load)).toBe(0);
    // Password changed: older tokens must stop working right away, not after the TTL.
    rememberSessionVersion("user-b", 1);
    expect(await sessionVersionOf("user-b", load)).toBe(1);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("remembers deleted accounts as null", async () => {
    rememberSessionVersion("user-c", null);
    expect(await sessionVersionOf("user-c", async () => 5)).toBeNull();
  });
});
