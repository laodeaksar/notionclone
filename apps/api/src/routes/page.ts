import { Elysia, t } from "elysia";
import { type Static } from "@sinclair/typebox";
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

const CreatePageSchema = t.Object({
  title: t.String(),
  workspaceId: t.String(),
  parentId: t.Optional(t.String()),
  icon: t.Optional(t.String()),
  coverImage: t.Optional(t.String()),
});
type CreatePageDto = Static<typeof CreatePageSchema>;

const UpdatePageSchema = t.Object({
  title: t.Optional(t.String()),
  icon: t.Optional(t.String()),
  coverImage: t.Optional(t.String()),
  parentId: t.Optional(t.Nullable(t.String())),
});
type UpdatePageDto = Static<typeof UpdatePageSchema>;

const QuerySchema = t.Object({
  workspaceId: t.String(),
  limit: t.Optional(t.Numeric()),
  offset: t.Optional(t.Numeric()),
});
type QueryDto = Static<typeof QuerySchema>;

const VersionSchema = t.Object({
  title: t.String(),
  content: t.String(),
});
type VersionDto = Static<typeof VersionSchema>;

const QueryVersionSchema = t.Object({
        limit: t.Optional(t.Numeric()),
        offset: t.Optional(t.Numeric()),
      });
type QueryVersionDTO = Static<typeof QueryVersionSchema>;

const ReorderSchema = t.Object({
  parentId: t.Optional(t.Nullable(t.String())),
  order: t.Number(),
});
type ReorderDto = Static<typeof ReorderSchema>;

export const pageRoutes = new Elysia({ prefix: "/api/pages" })
  .use(authMiddleware)
  // GET /api/pages?workspaceId=&limit=&offset=
  .get(
    "/",
    async ({ query, session }) => {
      const { workspaceId, limit: rawLimit = 100, offset: rawOffset = 0 } = query as unknown as QueryDto;
      const limit = Math.min(Number(rawLimit), 200);
      const offset = Number(rawOffset);
      await ensureMember(workspaceId, session.user.id);
      return db.query.page.findMany({
        where: and(
          eq(page.workspaceId, workspaceId),
          eq(page.isArchived, false)
        ),
        orderBy: (p, { asc }) => [asc(p.order), asc(p.createdAt)],
        limit,
        offset,
      });
    },
    {
      query: QuerySchema,
    }
  )
  // POST /api/pages
  .post(
    "/",
    async ({ body, session }) => {
      const { title, workspaceId, parentId, icon, coverImage} = body as CreatePageDto;
      await ensureMember(workspaceId, session.user.id);
      const [newPage] = await db
        .insert(page)
        .values({
          id: nanoid(),
          title: title || "Untitled",
          workspaceId: workspaceId,
          parentId: parentId ?? null,
          icon: icon ?? null,
          coverImage: coverImage ?? null,
          createdBy: session.user.id,
        })
        .returning();
      return newPage;
    },
    {
      body: CreatePageSchema,
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
      const data = body as UpdatePageDto;
      const existing = await db.query.page.findFirst({
        where: eq(page.id, params.id),
      });
      if (!existing) throw new NotFoundError("Page");
      await ensureMember(existing.workspaceId, session.user.id);
      const [updated] = await db
        .update(page)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(page.id, params.id))
        .returning();
      return updated;
    },
    {
      body: UpdatePageSchema,
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
      const { parentId, order } = body as ReorderDto;
      const existing = await db.query.page.findFirst({
        where: eq(page.id, params.id),
      });
      if (!existing) throw new NotFoundError("Page");
      await ensureMember(existing.workspaceId, session.user.id);

      // Validate parentId belongs to the same workspace (prevent cross-workspace page stealing)
      if (parentId) {
        const parent = await db.query.page.findFirst({
          where: eq(page.id, parentId),
        });
        if (!parent || parent.workspaceId !== existing.workspaceId) {
          throw new BadRequestError("Parent page does not belong to the same workspace");
        }
      }

      const [updated] = await db
        .update(page)
        .set({
          parentId,
          order,
          updatedAt: new Date(),
        })
        .where(eq(page.id, params.id))
        .returning();
      return updated;
    },
    {
      body: ReorderSchema,
    }
  )
  // GET /api/pages/:id/versions
  .get(
    "/:id/versions",
    async ({ params, query, session }) => {
      const { limit: rawLimit = 20, offset: rawOffset = 0 } = query as unknown as QueryVersionDTO;
      const existing = await db.query.page.findFirst({
        where: eq(page.id, params.id),
      });
      if (!existing) throw new NotFoundError("Page");
      await ensureMember(existing.workspaceId, session.user.id);
      const limit = Math.min(Number(rawLimit), 50);
      const offset = Number(rawOffset);
      return db.query.pageVersion.findMany({
        where: eq(pageVersion.pageId, params.id),
        with: { savedByUser: { columns: { id: true, name: true, email: true } } },
        orderBy: [desc(pageVersion.createdAt)],
        limit,
        offset,
      });
    },
    {
      query: QueryVersionSchema,
    }
  )
  // POST /api/pages/:id/versions
  .post(
    "/:id/versions",
    async ({ params, body, session }) => {
    const { title, content } = body as VersionDto;
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
          title: title,
          content: content,
          icon: existing.icon,
          coverImage: existing.coverImage,
          savedBy: session.user.id,
        })
        .returning();
      return version;
    },
    {
      body: VersionSchema,
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
