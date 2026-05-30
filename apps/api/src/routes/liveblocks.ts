import { Elysia, t } from "elysia";
import { Effect, pipe } from "effect";
import { Liveblocks } from "@liveblocks/node";
import { eq, and } from "drizzle-orm";
import { db, page, workspaceMember } from "@notion-clone/db";
import { authMiddleware } from "../middleware/auth.js";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export const liveblocksRoutes = new Elysia()
  .use(authMiddleware)
  .post(
    "/api/liveblocks-auth",
    async ({ body, session }) => {
      const result = await Effect.runPromise(
        pipe(
          Effect.tryPromise(async () => {
            const { room } = body;
            const p = await db.query.page.findFirst({
              where: eq(page.id, room),
            });
            if (!p) throw new Error("Page not found");

            const member = await db.query.workspaceMember.findFirst({
              where: and(
                eq(workspaceMember.workspaceId, p.workspaceId),
                eq(workspaceMember.userId, session.user.id)
              ),
            });
            if (!member) throw new Error("Forbidden");

            const liveblocksSession = liveblocks.prepareSession(
              session.user.id,
              {
                userInfo: {
                  name: session.user.name,
                  email: session.user.email,
                },
              }
            );
            liveblocksSession.allow(room, liveblocksSession.FULL_ACCESS);
            const { status, body: responseBody } =
              await liveblocksSession.authorize();
            return new Response(responseBody, { status });
          })
        )
      );
      return result;
    },
    { body: t.Object({ room: t.String() }) }
  );
