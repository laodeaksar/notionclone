import { Elysia, t } from "elysia";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db, workspace, workspaceMember } from "@notion-clone/db";
import { authMiddleware } from "../middleware/auth.js";

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

const createWorkspaceSchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 100 }),
  description: t.Optional(t.String()),
});

const updateWorkspaceSchema = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
  description: t.Optional(t.String()),
});

export const workspaceRoutes = new Elysia({ prefix: "/api/workspaces" })
  .use(authMiddleware)
  // GET /api/workspaces
  .get("/", async ({ session }) => {
    const members = await db.query.workspaceMember.findMany({
      where: eq(workspaceMember.userId, session.user.id),
      with: { workspace: true },
    });
    return members.map((m) => m.workspace);
  })
  // POST /api/workspaces
  .post(
    "/",
    async ({ body, session }) => {
      const id = nanoid();
      const slug = slugify(body.name);
      const [ws] = await db
        .insert(workspace)
        .values({ id, name: body.name, description: body.description, slug })
        .returning();
      await db.insert(workspaceMember).values({
        id: nanoid(),
        workspaceId: ws.id,
        userId: session.user.id,
        role: "owner",
      });
      return ws;
    },
    {
      body: createWorkspaceSchema,
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
    if (!member) throw new Error("Not found");
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
      if (!member || member.role !== "owner") throw new Error("Forbidden");
      const [updated] = await db
        .update(workspace)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(workspace.id, params.id))
        .returning();
      return updated;
    },
    {
      body: updateWorkspaceSchema,
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
    if (!member || member.role !== "owner") throw new Error("Forbidden");
    await db.delete(workspace).where(eq(workspace.id, params.id));
    return { success: true };
  });
