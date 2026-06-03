<<<<<<< HEAD
// Liveblocks collaboration has been removed.
// This file is kept as a placeholder. It is not imported anywhere.
export {};
=======
import { Hono } from "hono";
import * as v from "valibot";
import { Liveblocks } from "@liveblocks/node";
import { eq, and } from "drizzle-orm";
import { getDb, page, workspaceMember } from "@notion-clone/db";
import { LiveblocksAuthSchema } from "@notion-clone/schemas";
import { authMiddleware } from "../middleware/auth.js";
import { NotFoundError, ForbiddenError } from "../errors.js";
import type { Env, Variables } from "../types.js";

function getLiveblocks(secret: string) {
  if (!secret?.startsWith("sk_")) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is not configured");
  }
  return new Liveblocks({ secret });
}

// Route dipasang di app.ts sebagai: app.route("/api", liveblocksRoutes)
export const liveblocksRoutes = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>()
  .use("*", authMiddleware)

  // POST /api/liveblocks-auth
  .post("/liveblocks-auth", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const { room } = v.parse(LiveblocksAuthSchema, await c.req.json());

    const p = await db.query.page.findFirst({
      where: eq(page.id, room),
    });
    if (!p) throw new NotFoundError("Page");

    const member = await db.query.workspaceMember.findFirst({
      where: and(
        eq(workspaceMember.workspaceId, p.workspaceId),
        eq(workspaceMember.userId, session.user.id)
      ),
    });
    if (!member) throw new ForbiddenError();

    const lb = getLiveblocks(c.env.LIVEBLOCKS_SECRET_KEY);
    const lbSession = lb.prepareSession(session.user.id, {
      userInfo: {
        name: session.user.name,
        email: session.user.email,
      },
    });
    lbSession.allow(room, lbSession.FULL_ACCESS);

    const { status, body } = await lbSession.authorize();
    return new Response(body, { status });
  });
>>>>>>> 75982b92e8c79649b1a477c4d72f3f54d9a5e844
