import { Elysia, t } from "elysia";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db, workspace, workspaceMember } from "@notion-clone/db";
import { authMiddleware } from "../middleware/auth.js";
import { NotFoundError, ForbiddenError } from "../errors.js";

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    nanoid(6)
  );
}

export const workspaceRoutes = new Elysia({ prefix: "/api/workspaces" })
  .use(authMiddleware)
  // GET /api/workspaces
  .get(
    "/",
    async ({ query, session }) => {
      const limit = Math.min(Number(query.limit ?? 50), 100);
      const offset = Number(query.offset ?? 0);
      const members = await db.query.workspaceMember.findMany({
        where: eq(workspaceMember.userId, session.user.id),
        with: { workspace: true },
        limit,
        offset,
      });
      return members.map((m) => m.workspace);
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric()),
        offset: t.Optional(t.Numeric()),
      }),
    }
  )
  // POST /api/workspaces
  .post(
    "/",
    async ({ body, session }) => {
      const id = nanoid();
      const slug = slugify(body.name);
      const ws = await db.transaction(async (tx) => {
        const [newWs] = await tx
          .insert(workspace)
          .values({ id, name: body.name, description: body.description, slug })
          .returning();
        await tx.insert(workspaceMember).values({
          id: nanoid(),
          workspaceId: newWs.id,
          userId: session.user.id,
          role: "owner",
        });
        return newWs;
      });
      return ws;
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        description: t.Optional(t.String()),
      }),
    }
  )
  // GET /api/workspaces/:id
  .get("/:id", async ({ params, session }) => {
    const member = await db.query.workspaceMember.findFirst({
      where: and(
        eq(workspaceMember.workspaceId, params.id),
        eq(workspaceMember.userId, session.user.id)
      ),
      with: { workspace: true },
    });
    if (!member) throw new NotFoundError("Workspace");
    return member.workspace;
  })
  // PATCH /api/workspaces/:id
  .patch(
    "/:id",
    async ({ params, body, session }) => {
      const member = await db.query.workspaceMember.findFirst({
        where: and(
          eq(workspaceMember.workspaceId, params.id),
          eq(workspaceMember.userId, session.user.id)
        ),
      });
      if (!member) throw new NotFoundError("Workspace");
      if (member.role !== "owner") throw new ForbiddenError();
      const [updated] = await db
        .update(workspace)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(workspace.id, params.id))
        .returning();
      return updated;
    },
    {
      body: t.Object({
        name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
        description: t.Optional(t.String()),
      }),
    }
  )
  // DELETE /api/workspaces/:id
  .delete("/:id", async ({ params, session }) => {
    const member = await db.query.workspaceMember.findFirst({
      where: and(
        eq(workspaceMember.workspaceId, params.id),
        eq(workspaceMember.userId, session.user.id)
      ),
    });
    if (!member) throw new NotFoundError("Workspace");
    if (member.role !== "owner") throw new ForbiddenError();
    await db.delete(workspace).where(eq(workspace.id, params.id));
    return { success: true };
  });
