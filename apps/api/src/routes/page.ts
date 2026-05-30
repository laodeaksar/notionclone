import { Elysia, t } from "elysia";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db, page, pageVersion, workspaceMember } from "@notion-clone/db";
import { authMiddleware } from "../middleware/auth.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../errors.js";

async function ensureMember(workspaceId: string, userId: string) {
  const member = await db.query.workspaceMember.findFirst({
    where: and(
      eq(workspaceMember.workspaceId, workspaceId),
      eq(workspaceMember.userId, userId)
    ),
  });
  if (!member) throw new ForbiddenError();
  return member;
}

export const pageRoutes = new Elysia({ prefix: "/api/pages" })
  .use(authMiddleware)
  // GET /api/pages?workspaceId=&limit=&offset=
  .get(
    "/",
    async ({ query, session }) => {
      const limit = Math.min(Number(query.limit ?? 100), 200);
      const offset = Number(query.offset ?? 0);
      await ensureMember(query.workspaceId, session.user.id);
      return db.query.page.findMany({
        where: and(
          eq(page.workspaceId, query.workspaceId),
          eq(page.isArchived, false)
        ),
        orderBy: (p, { asc }) => [asc(p.order), asc(p.createdAt)],
        limit,
        offset,
      });
    },
    {
      query: t.Object({
        workspaceId: t.String(),
        limit: t.Optional(t.Numeric()),
        offset: t.Optional(t.Numeric()),
      }),
    }
  )
  // POST /api/pages
  .post(
    "/",
    async ({ body, session }) => {
      await ensureMember(body.workspaceId, session.user.id);
      const [newPage] = await db
        .insert(page)
        .values({
          id: nanoid(),
          title: body.title || "Untitled",
          workspaceId: body.workspaceId,
          parentId: body.parentId ?? null,
          icon: body.icon ?? null,
          coverImage: body.coverImage ?? null,
          createdBy: session.user.id,
        })
        .returning();
      return newPage;
    },
    {
      body: t.Object({
        title: t.String(),
        workspaceId: t.String(),
        parentId: t.Optional(t.String()),
        icon: t.Optional(t.String()),
        coverImage: t.Optional(t.String()),
      }),
    }
  )
  // GET /api/pages/:id
  .get("/:id", async ({ params, session }) => {
    const p = await db.query.page.findFirst({
      where: eq(page.id, params.id),
      with: { children: true, creator: true },
    });
    if (!p) throw new NotFoundError("Page");
    await ensureMember(p.workspaceId, session.user.id);
    return p;
  })
  // PATCH /api/pages/:id
  .patch(
    "/:id",
    async ({ params, body, session }) => {
      const existing = await db.query.page.findFirst({
        where: eq(page.id, params.id),
      });
      if (!existing) throw new NotFoundError("Page");
      await ensureMember(existing.workspaceId, session.user.id);
      const [updated] = await db
        .update(page)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(page.id, params.id))
        .returning();
      return updated;
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        icon: t.Optional(t.String()),
        coverImage: t.Optional(t.String()),
        parentId: t.Optional(t.Nullable(t.String())),
      }),
    }
  )
  // DELETE /api/pages/:id
  .delete("/:id", async ({ params, session }) => {
    const existing = await db.query.page.findFirst({
      where: eq(page.id, params.id),
    });
    if (!existing) throw new NotFoundError("Page");
    await ensureMember(existing.workspaceId, session.user.id);
    await db
      .update(page)
      .set({ isArchived: true, updatedAt: new Date() })
      .where(eq(page.id, params.id));
    return { success: true };
  })
  // PATCH /api/pages/:id/reorder
  .patch(
    "/:id/reorder",
    async ({ params, body, session }) => {
      const existing = await db.query.page.findFirst({
        where: eq(page.id, params.id),
      });
      if (!existing) throw new NotFoundError("Page");
      await ensureMember(existing.workspaceId, session.user.id);

      // Validate parentId belongs to the same workspace (prevent cross-workspace page stealing)
      if (body.parentId) {
        const parent = await db.query.page.findFirst({
          where: eq(page.id, body.parentId),
        });
        if (!parent || parent.workspaceId !== existing.workspaceId) {
          throw new BadRequestError("Parent page does not belong to the same workspace");
        }
      }

      const [updated] = await db
        .update(page)
        .set({
          parentId: body.parentId ?? null,
          order: body.order,
          updatedAt: new Date(),
        })
        .where(eq(page.id, params.id))
        .returning();
      return updated;
    },
    {
      body: t.Object({
        parentId: t.Optional(t.Nullable(t.String())),
        order: t.Number(),
      }),
    }
  )
  // GET /api/pages/:id/versions
  .get(
    "/:id/versions",
    async ({ params, query, session }) => {
      const existing = await db.query.page.findFirst({
        where: eq(page.id, params.id),
      });
      if (!existing) throw new NotFoundError("Page");
      await ensureMember(existing.workspaceId, session.user.id);
      const limit = Math.min(Number(query.limit ?? 20), 50);
      const offset = Number(query.offset ?? 0);
      return db.query.pageVersion.findMany({
        where: eq(pageVersion.pageId, params.id),
        with: { savedByUser: { columns: { id: true, name: true, email: true } } },
        orderBy: [desc(pageVersion.createdAt)],
        limit,
        offset,
      });
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric()),
        offset: t.Optional(t.Numeric()),
      }),
    }
  )
  // POST /api/pages/:id/versions
  .post(
    "/:id/versions",
    async ({ params, body, session }) => {
      const existing = await db.query.page.findFirst({
        where: eq(page.id, params.id),
      });
      if (!existing) throw new NotFoundError("Page");
      await ensureMember(existing.workspaceId, session.user.id);
      const [version] = await db
        .insert(pageVersion)
        .values({
          id: nanoid(),
          pageId: params.id,
          title: body.title,
          content: body.content,
          icon: existing.icon,
          coverImage: existing.coverImage,
          savedBy: session.user.id,
        })
        .returning();
      return version;
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.String(),
      }),
    }
  )
  // POST /api/pages/:id/versions/:versionId/restore
  .post("/:id/versions/:versionId/restore", async ({ params, session }) => {
    const existing = await db.query.page.findFirst({
      where: eq(page.id, params.id),
    });
    if (!existing) throw new NotFoundError("Page");
    await ensureMember(existing.workspaceId, session.user.id);

    const version = await db.query.pageVersion.findFirst({
      where: and(
        eq(pageVersion.id, params.versionId),
        eq(pageVersion.pageId, params.id)
      ),
    });
    if (!version) throw new NotFoundError("Version");

    // Restore ALL version fields — including content — back to the page table
    const [updated] = await db
      .update(page)
      .set({
        title: version.title,
        content: version.content,
        icon: version.icon,
        coverImage: version.coverImage,
        updatedAt: new Date(),
      })
      .where(eq(page.id, params.id))
      .returning();
    return updated;
  });
