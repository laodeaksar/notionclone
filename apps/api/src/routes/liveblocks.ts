import { Elysia, t } from "elysia";
import { Liveblocks } from "@liveblocks/node";
import { eq, and } from "drizzle-orm";
import { db, page, workspaceMember } from "@notion-clone/db";
import { authMiddleware } from "../middleware/auth.js";

function getLiveblocks() {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret || !secret.startsWith("sk_")) {
    throw new Error(
      "LIVEBLOCKS_SECRET_KEY is not configured. Please add it to your secrets."
    );
  }
  return new Liveblocks({ secret });
}

export const liveblocksRoutes = new Elysia()
  .use(authMiddleware)
  .post(
    "/api/liveblocks-auth",
    async ({ body, session }) => {
      const p = await db.query.page.findFirst({
        where: eq(page.id, body.room),
      });
      if (!p) throw new Error("Page not found");

      const member = await db.query.workspaceMember.findFirst({
        where: and(
          eq(workspaceMember.workspaceId, p.workspaceId),
          eq(workspaceMember.userId, session.user.id)
        ),
      });
      if (!member) throw new Error("Forbidden");

      const liveblocksSession = getLiveblocks().prepareSession(
        session.user.id,
        {
          userInfo: {
            name: session.user.name,
            email: session.user.email,
          },
        }
      );
      liveblocksSession.allow(body.room, liveblocksSession.FULL_ACCESS);
      const { status, body: responseBody } = await liveblocksSession.authorize();
      return new Response(responseBody, { status });
    },
    { body: t.Object({ room: t.String() }) }
  );
