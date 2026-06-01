import { Hono } from "hono";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb, workspace, workspaceMember } from "@notion-clone/db";
import { authMiddleware } from "../middleware/auth.js";
import { NotFoundError, ForbiddenError } from "../errors.js";
import type { Env, Variables } from "../types.js";

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

const WorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export const workspaceRoutes = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>()
  .use("*", authMiddleware)

  // GET /api/workspaces
  .get("/", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const limit = Math.min(Number(c.req.query("limit") ?? 50), 100);
    const offset = Number(c.req.query("offset") ?? 0);

    const members = await db.query.workspaceMember.findMany({
      where: eq(workspaceMember.userId, session.user.id),
      with: { workspace: true },
      limit,
      offset,
    });
    return c.json(members.map((m) => m.workspace));
  })

  // POST /api/workspaces
  .post("/", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const body = WorkspaceSchema.parse(await c.req.json());
    const { name, description } = body;

    const id = nanoid();
    const slug = slugify(name);

    const ws = await db.transaction(async (tx) => {
      const [newWs] = await tx
        .insert(workspace)
        .values({ id, name, description, slug })
        .returning();
      await tx.insert(workspaceMember).values({
        id: nanoid(),
        workspaceId: newWs.id,
        userId: session.user.id,
        role: "owner",
      });
      return newWs;
    });

    return c.json(ws, 201);
  })

  // GET /api/workspaces/:id
  .get("/:id", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const member = await db.query.workspaceMember.findFirst({
      where: and(
        eq(workspaceMember.workspaceId, c.req.param("id")),
        eq(workspaceMember.userId, session.user.id)
      ),
      with: { workspace: true },
    });
    if (!member) throw new NotFoundError("Workspace");
    return c.json(member.workspace);
  })

  // PATCH /api/workspaces/:id
  .patch("/:id", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const data = WorkspaceSchema.partial().parse(await c.req.json());

    const member = await db.query.workspaceMember.findFirst({
      where: and(
        eq(workspaceMember.workspaceId, c.req.param("id")),
        eq(workspaceMember.userId, session.user.id)
      ),
    });
    if (!member) throw new NotFoundError("Workspace");
    if (member.role !== "owner") throw new ForbiddenError();

    const [updated] = await db
      .update(workspace)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(workspace.id, c.req.param("id")))
      .returning();
    return c.json(updated);
  })

  // DELETE /api/workspaces/:id
  .delete("/:id", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");

    const member = await db.query.workspaceMember.findFirst({
      where: and(
        eq(workspaceMember.workspaceId, c.req.param("id")),
        eq(workspaceMember.userId, session.user.id)
      ),
    });
    if (!member) throw new NotFoundError("Workspace");
    if (member.role !== "owner") throw new ForbiddenError();

    await db.delete(workspace).where(eq(workspace.id, c.req.param("id")));
    return c.json({ success: true });
  });
