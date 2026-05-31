import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const connectionString = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === "production";

type AnyDrizzle =
  | NeonHttpDatabase<typeof schema>
  | PostgresJsDatabase<typeof schema>;

/**
 * In production we use Neon's HTTP driver — no persistent TCP connections,
 * serverless-friendly, works behind connection limits.
 * In development we use postgres.js with a pool for fast local queries.
 */
export const db: AnyDrizzle = await (async (): Promise<AnyDrizzle> => {
  if (isProduction) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    return drizzle(neon(connectionString), { schema });
  }

  const { default: postgres } = await import("postgres");
  const { drizzle } = await import("drizzle-orm/postgres-js");
  return drizzle(postgres(connectionString, { max: 10 }), { schema });
})();

export * from "./schema.js";
export type { InferSelectModel, InferInsertModel } from "drizzle-orm";
