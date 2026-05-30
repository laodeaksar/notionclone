import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { db, user, session, account, verification } from "@notion-clone/db";

const extraOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  advanced: {
    cookiePrefix: "notion-clone",
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  },
  trustedOrigins: [
    "http://localhost:5000",
    "http://localhost:5173",
    "http://0.0.0.0:5000",
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    ...extraOrigins,
  ],
  plugins: [organization()],
});

export type Auth = typeof auth;
