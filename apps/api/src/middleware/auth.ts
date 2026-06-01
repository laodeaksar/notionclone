import { createMiddleware } from "hono/factory";
import { getAuth } from "@notion-clone/auth";
import type { Env, Variables } from "../types.js";

export type { Session } from "../types.js";

export const authMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: Variables;
}>(async (c, next) => {
  const auth = getAuth(c.env.DB, {
    secret: c.env.BETTER_AUTH_SECRET,
    url: c.env.BETTER_AUTH_URL,
    allowedOrigins: (c.env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
  });

  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("session", session);
  await next();
});
