import { Elysia, t } from "elysia";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db, workspaceMember, user } from "@notion-clone/db";
import { authMiddleware } from "../middleware/auth.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../errors.js";

async function ensureOwner(workspaceId: string, userId: string) {
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

export const workspaceMemberRoutes = new Elysia({
  prefix: "/api/workspaces/:id/members",
})
  .use(authMiddleware)
  // GET /api/workspaces/:id/members — list all members with user info
  .get("/", async ({ params, session }) => {
    const isMember = await db.query.workspaceMember.findFirst({
      where: and(
        eq(workspaceMember.workspaceId, params.id),
        eq(workspaceMember.userId, session.user.id)
      ),
    });
    if (!isMember) throw new ForbiddenError();

    return db.query.workspaceMember.findMany({
      where: eq(workspaceMember.workspaceId, params.id),
      with: {
        user: {
          columns: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: (m, { asc }) => [asc(m.createdAt)],
    });
  })
  // POST /api/workspaces/:id/members — add member by userId
  .post(
    "/",
    async ({ params, body, session }) => {
      await ensureOwner(params.id, session.user.id);

      const targetUser = await db.query.user.findFirst({
        where: eq(user.id, body.userId),
        columns: { id: true },
      });
      if (!targetUser) throw new NotFoundError("User");

      const existing = await db.query.workspaceMember.findFirst({
        where: and(
          eq(workspaceMember.workspaceId, params.id),
          eq(workspaceMember.userId, body.userId)
        ),
      });
      if (existing) throw new BadRequestError("User is already a member of this workspace");

      const [member] = await db
        .insert(workspaceMember)
        .values({
          id: nanoid(),
          workspaceId: params.id,
          userId: body.userId,
          role: body.role ?? "member",
        })
        .returning();
      return member;
    },
    {
      body: t.Object({
        userId: t.String(),
        role: t.Optional(t.Union([t.Literal("owner"), t.Literal("member")])),
      }),
    }
  )
  // PATCH /api/workspaces/:id/members/:memberId — update role
  .patch(
    "/:memberId",
    async ({ params, body, session }) => {
      await ensureOwner(params.id, session.user.id);

      const target = await db.query.workspaceMember.findFirst({
        where: and(
          eq(workspaceMember.id, params.memberId),
          eq(workspaceMember.workspaceId, params.id)
        ),
      });
      if (!target) throw new NotFoundError("Member");

      // Prevent demoting self (owner cannot demote themselves if last owner)
      if (target.userId === session.user.id) {
        throw new BadRequestError("Cannot change your own role");
      }

      const [updated] = await db
        .update(workspaceMember)
        .set({ role: body.role })
        .where(eq(workspaceMember.id, params.memberId))
        .returning();
      return updated;
    },
    {
      body: t.Object({
        role: t.Union([t.Literal("owner"), t.Literal("member")]),
      }),
    }
  )
  // DELETE /api/workspaces/:id/members/:memberId — remove member
  .delete("/:memberId", async ({ params, session }) => {
    await ensureOwner(params.id, session.user.id);

    const target = await db.query.workspaceMember.findFirst({
      where: and(
        eq(workspaceMember.id, params.memberId),
        eq(workspaceMember.workspaceId, params.id)
      ),
    });
    if (!target) throw new NotFoundError("Member");
    if (target.userId === session.user.id) {
      throw new BadRequestError("Cannot remove yourself from the workspace");
    }

    await db
      .delete(workspaceMember)
      .where(eq(workspaceMember.id, params.memberId));
    return { success: true };
  });
