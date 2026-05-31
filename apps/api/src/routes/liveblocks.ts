import { Elysia, t } from "elysia";
import { type Static } from "@sinclair/typebox";
import { Liveblocks } from "@liveblocks/node";
import { eq, and } from "drizzle-orm";
import { db, page, workspaceMember } from "@notion-clone/db";
import { authMiddleware } from "../middleware/auth.js";
import { NotFoundError, ForbiddenError } from "../errors.js";

if (!process.env.LIVEBLOCKS_SECRET_KEY?.startsWith("sk_")) {
  console.warn(
    "[liveblocks] LIVEBLOCKS_SECRET_KEY is not configured. Collaboration features will be unavailable."
  );
}

function getLiveblocks() {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret?.startsWith("sk_")) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is not configured");
  }
  return new Liveblocks({ secret });
}

const LiveblocksAuthSchema = t.Object({ room: t.String() });
type LiveblocksAuthDto = Static<typeof LiveblocksAuthSchema>;

export const liveblocksRoutes = new Elysia()
  .use(authMiddleware)
  .post(
    "/api/liveblocks-auth",
    async ({ body, session }) => {
      const { room } = body as LiveblocksAuthDto;

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

      const liveblocksSession = getLiveblocks().prepareSession(
        session.user.id,
        {
          userInfo: {
            name: session.user.name,
            email: session.user.email,
          },
        }
      );
      liveblocksSession.allow(room, liveblocksSession.FULL_ACCESS);
      const { status, body: responseBody } = await liveblocksSession.authorize();
      return new Response(responseBody, { status });
    },
    { body: LiveblocksAuthSchema }
  );
