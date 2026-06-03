import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb, user, session, account, verification } from "@notion-clone/db";

export interface AuthEnv {
  secret: string;
  url?: string;
  allowedOrigins?: string[];
}

/**
 * Buat instance betterAuth baru dari D1 binding.
 * Dipanggil per-request karena D1Database hanya tersedia via c.env.DB.
 */
export function getAuth(d1: D1Database, env: AuthEnv) {
  const db = getDb(d1);
  const extraOrigins = env.allowedOrigins ?? [];

  return betterAuth({
    secret: env.secret,
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: { user, session, account, verification },
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },
    advanced: {
      cookiePrefix: "notion-clone",
      defaultCookieAttributes: {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      },
    },
    trustedOrigins: [
      "http://localhost:5000",
      "http://localhost:5173",
      "http://0.0.0.0:5000",
      env.url ?? "http://localhost:3000",
      ...extraOrigins,
    ],
  });
}

export type Auth = ReturnType<typeof getAuth>;
