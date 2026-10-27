// Current session version per user, cached briefly so checking a token
// doesn't cost a database round trip on every request. The API runs as a
// single instance, so updating the cache where the version changes keeps it
// exact; the TTL only bounds memory and staleness from outside changes.

const TTL_MS = 60_000;
const MAX_ENTRIES = 5_000;
const cache = new Map<string, { version: number | null; at: number }>();

/** `null` = the user doesn't exist (any more). */
export async function sessionVersionOf(userId: string, load: (id: string) => Promise<number | null>, now = Date.now()) {
  const hit = cache.get(userId);
  if (hit && now - hit.at < TTL_MS) return hit.version;
  const version = await load(userId);
  if (cache.size >= MAX_ENTRIES) cache.clear();
  cache.set(userId, { version, at: now });
  return version;
}

export function rememberSessionVersion(userId: string, version: number | null) {
  cache.set(userId, { version, at: Date.now() });
}
