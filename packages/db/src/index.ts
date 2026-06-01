import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema.js";

export type DB = ReturnType<typeof getDb>;

/**
 * Buat instance Drizzle baru dari D1 binding.
 * Dipanggil per-request karena D1Database hanya tersedia lewat c.env.DB.
 */
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export * from "./schema.js";
export type { InferSelectModel, InferInsertModel } from "drizzle-orm";
