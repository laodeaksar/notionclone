import { Elysia, t } from "elysia";
import { Effect, pipe } from "effect";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db, page, pageVersion, workspaceMember } from "@notion-clone/db";
import { authMiddleware } from "../middleware/auth.js";

async function ensureMember(workspaceId: string, userId: string) {
  const member = await db.query.workspaceMember.findFirst({
    where: and(
      eq(workspaceMember.workspaceId, workspaceId),
      eq(workspaceMember.userId, userId)
    ),
  });
  if (!member) throw new Error("Forbidden");
  return member;
}

export const pageRoutes = new Elysia({ prefix: "/api/pages" })
  .use(authMiddleware)
  // GET /api/pages?workspaceId=
  .get(
    "/",
    async ({ query, session }) => {
      const result = await Effect.runPromise(
        pipe(
          Effect.tryPromise(async () => {
            await ensureMember(query.workspaceId, session.user.id);
            return db.query.page.findMany({
              where: and(
                eq(page.workspaceId, query.workspaceId),
                eq(page.isArchived, false)
              ),
              orderBy: (p, { asc }) => [asc(p.order), asc(p.createdAt)],
            });
          })
        )
      );
      return result;
    },
    {
      query: t.Object({ workspaceId: t.String() }),
    }
  )
  // POST /api/pages
  .post(
    "/",
    async ({ body, session }: { body: { title: string; workspaceId: string; parentId?: string; icon?: string; coverImage?: string }; session: any }) => {
      const result = await Effect.runPromise(
        pipe(
          Effect.tryPromise(async () => {
            await ensureMember(body.workspaceId, session.user.id);
            const id = nanoid();
            const [newPage] = await db
              .insert(page)
              .values({
                id,
                title: body.title || "Untitled",
                workspaceId: body.workspaceId,
                parentId: body.parentId ?? null,
                icon: body.icon ?? null,
                coverImage: body.coverImage ?? null,
                createdBy: session.user.id,
              })
              .returning();
            return newPage;
          })
        )
      );
      return result;
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
    const result = await Effect.runPromise(
      pipe(
        Effect.tryPromise(async () => {
          const p = await db.query.page.findFirst({
            where: eq(page.id, params.id),
            with: { children: true, creator: true },
          });
          if (!p) throw new Error("Not found");
          await ensureMember(p.workspaceId, session.user.id);
          return p;
        })
      )
    );
    return result;
  })
  // PATCH /api/pages/:id
  .patch(
    "/:id",
    async ({ params, body, session }: { params: { id: string }; body: { title?: string; icon?: string; coverImage?: string; parentId?: string | null }; session: any }) => {
      const result = await Effect.runPromise(
        pipe(
          Effect.tryPromise(async () => {
            const existing = await db.query.page.findFirst({
              where: eq(page.id, params.id),
            });
            if (!existing) throw new Error("Not found");
            await ensureMember(existing.workspaceId, session.user.id);
            const [updated] = await db
              .update(page)
              .set({ ...body, updatedAt: new Date() })
              .where(eq(page.id, params.id))
              .returning();
            return updated;
          })
        )
      );
      return result;
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
    await Effect.runPromise(
      pipe(
        Effect.tryPromise(async () => {
          const existing = await db.query.page.findFirst({
            where: eq(page.id, params.id),
          });
          if (!existing) throw new Error("Not found");
          await ensureMember(existing.workspaceId, session.user.id);
          await db
            .update(page)
            .set({ isArchived: true, updatedAt: new Date() })
            .where(eq(page.id, params.id));
        })
      )
    );
    return { success: true };
  })
  // PATCH /api/pages/:id/reorder
  .patch(
    "/:id/reorder",
    async ({ params, body, session }: { params: { id: string }; body: { parentId?: string | null; order: number }; session: any }) => {
      const result = await Effect.runPromise(
        pipe(
          Effect.tryPromise(async () => {
            const existing = await db.query.page.findFirst({
              where: eq(page.id, params.id),
            });
            if (!existing) throw new Error("Not found");
            await ensureMember(existing.workspaceId, session.user.id);
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
          })
        )
      );
      return result;
    },
    {
      body: t.Object({
        parentId: t.Optional(t.Nullable(t.String())),
        order: t.Number(),
      }),
    }
  )
  // GET /api/pages/:id/versions
  .get("/:id/versions", async ({ params, session }) => {
    const result = await Effect.runPromise(
      pipe(
        Effect.tryPromise(async () => {
          const existing = await db.query.page.findFirst({
            where: eq(page.id, params.id),
          });
          if (!existing) throw new Error("Not found");
          await ensureMember(existing.workspaceId, session.user.id);
          return db.query.pageVersion.findMany({
            where: eq(pageVersion.pageId, params.id),
            with: { savedByUser: { columns: { id: true, name: true, email: true } } },
            orderBy: [desc(pageVersion.createdAt)],
          });
        })
      )
    );
    return result;
  })
  // POST /api/pages/:id/versions
  .post(
    "/:id/versions",
    async ({ params, body, session }: { params: { id: string }; body: { title: string; content: string }; session: any }) => {
      const result = await Effect.runPromise(
        pipe(
          Effect.tryPromise(async () => {
            const existing = await db.query.page.findFirst({
              where: eq(page.id, params.id),
            });
            if (!existing) throw new Error("Not found");
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
          })
        )
      );
      return result;
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
    const result = await Effect.runPromise(
      pipe(
        Effect.tryPromise(async () => {
          const existing = await db.query.page.findFirst({
            where: eq(page.id, params.id),
          });
          if (!existing) throw new Error("Not found");
          await ensureMember(existing.workspaceId, session.user.id);
          const version = await db.query.pageVersion.findFirst({
            where: and(
              eq(pageVersion.id, params.versionId),
              eq(pageVersion.pageId, params.id)
            ),
          });
          if (!version) throw new Error("Version not found");
          const [updated] = await db
            .update(page)
            .set({
              title: version.title,
              icon: version.icon,
              coverImage: version.coverImage,
              updatedAt: new Date(),
            })
            .where(eq(page.id, params.id))
            .returning();
          return { page: updated, content: version.content };
        })
      )
    );
    return result;
  });
