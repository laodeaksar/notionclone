import { Hono } from "hono";
import * as v from "valibot";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb, workspace, workspaceMember } from "@notion-clone/db";
import {
  WorkspaceCreateSchema,
  WorkspaceUpdateSchema,
} from "@notion-clone/schemas";
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
    const { name, description } = v.parse(
      WorkspaceCreateSchema,
      await c.req.json()
    );

    const id = nanoid();
    const slug = slugify(name);
    const now = new Date();

    // Use two sequential inserts instead of a transaction with .returning()
    // to avoid Drizzle D1 batch-transaction mid-read issues.
    await db
      .insert(workspace)
      .values({ id, name, description: description ?? null, slug, createdAt: now, updatedAt: now });

    await db.insert(workspaceMember).values({
      id: nanoid(),
      workspaceId: id,
      userId: session.user.id,
      role: "owner",
      createdAt: now,
    });

    return c.json({ id, name, description: description ?? null, slug, createdAt: now, updatedAt: now }, 201);
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
    const data = v.parse(WorkspaceUpdateSchema, await c.req.json());

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
