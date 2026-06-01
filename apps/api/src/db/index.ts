import { getDb as _getDb, type DB } from "@notion-clone/db";
import type { Env } from "../types.js";

export { getDb } from "@notion-clone/db";
export * from "@notion-clone/db";

/**
 * Shorthand: buat DB dari Cloudflare env binding langsung.
 * Biasanya dipanggil di route handler: const db = dbFromEnv(c.env)
 */
export function dbFromEnv(env: Env): DB {
  return _getDb(env.DB);
}
