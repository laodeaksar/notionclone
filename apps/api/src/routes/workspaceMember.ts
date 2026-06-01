import { Hono } from "hono";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb, workspaceMember, user } from "@notion-clone/db";
import type { DB } from "@notion-clone/db";
import { authMiddleware } from "../middleware/auth.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../errors.js";
import type { Env, Variables } from "../types.js";

async function ensureOwner(db: DB, workspaceId: string, userId: string) {
  const member = await db.query.workspaceMember.findFirst({
    where: and(
      eq(workspaceMember.workspaceId, workspaceId),
      eq(workspaceMember.userId, userId)
    ),
  });
  if (!member) throw new NotFoundError("Workspace");
  if (member.role !== "owner") throw new ForbiddenError();
  return member;
}

const AddMemberSchema = z.object({
  userId: z.string(),
  role: z.enum(["owner", "member"]).optional(),
});

const UpdateMemberRoleSchema = z.object({
  role: z.enum(["owner", "member"]),
});

// Route dipasang di app.ts sebagai: app.route("/api/workspaces", workspaceMemberRoutes)
// sehingga path di sini relative: /:id/members, /:id/members/:memberId, dst.
export const workspaceMemberRoutes = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>()
  .use("*", authMiddleware)

  // GET /api/workspaces/:id/members
  .get("/:id/members", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const workspaceId = c.req.param("id");

    const isMember = await db.query.workspaceMember.findFirst({
      where: and(
        eq(workspaceMember.workspaceId, workspaceId),
        eq(workspaceMember.userId, session.user.id)
      ),
    });
    if (!isMember) throw new ForbiddenError();

    const members = await db.query.workspaceMember.findMany({
      where: eq(workspaceMember.workspaceId, workspaceId),
      with: {
        user: {
          columns: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: (m, { asc }) => [asc(m.createdAt)],
    });
    return c.json(members);
  })

  // POST /api/workspaces/:id/members
  .post("/:id/members", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const workspaceId = c.req.param("id");
    await ensureOwner(db, workspaceId, session.user.id);

    const { userId, role = "member" } = AddMemberSchema.parse(
      await c.req.json()
    );

    const targetUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
      columns: { id: true },
    });
    if (!targetUser) throw new NotFoundError("User");

    const existing = await db.query.workspaceMember.findFirst({
      where: and(
        eq(workspaceMember.workspaceId, workspaceId),
        eq(workspaceMember.userId, userId)
      ),
    });
    if (existing)
      throw new BadRequestError("User is already a member of this workspace");

    const [member] = await db
      .insert(workspaceMember)
      .values({ id: nanoid(), workspaceId, userId, role })
      .returning();
    return c.json(member, 201);
  })

  // PATCH /api/workspaces/:id/members/:memberId
  .patch("/:id/members/:memberId", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const workspaceId = c.req.param("id");
    const memberId = c.req.param("memberId");
    await ensureOwner(db, workspaceId, session.user.id);

    const { role } = UpdateMemberRoleSchema.parse(await c.req.json());

    const target = await db.query.workspaceMember.findFirst({
      where: and(
        eq(workspaceMember.id, memberId),
        eq(workspaceMember.workspaceId, workspaceId)
      ),
    });
    if (!target) throw new NotFoundError("Member");
    if (target.userId === session.user.id)
      throw new BadRequestError("Cannot change your own role");

    const [updated] = await db
      .update(workspaceMember)
      .set({ role })
      .where(eq(workspaceMember.id, memberId))
      .returning();
    return c.json(updated);
  })

  // DELETE /api/workspaces/:id/members/:memberId
  .delete("/:id/members/:memberId", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const workspaceId = c.req.param("id");
    const memberId = c.req.param("memberId");
    await ensureOwner(db, workspaceId, session.user.id);

    const target = await db.query.workspaceMember.findFirst({
      where: and(
        eq(workspaceMember.id, memberId),
        eq(workspaceMember.workspaceId, workspaceId)
      ),
    });
    if (!target) throw new NotFoundError("Member");
    if (target.userId === session.user.id)
      throw new BadRequestError("Cannot remove yourself from the workspace");

    await db
      .delete(workspaceMember)
      .where(eq(workspaceMember.id, memberId));
    return c.json({ success: true });
  });
