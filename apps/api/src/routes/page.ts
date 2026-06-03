import { Hono } from "hono";
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb, page, pageVersion, workspaceMember } from "@notion-clone/db";
import type { DB } from "@notion-clone/db";
import { authMiddleware } from "../middleware/auth.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../errors.js";
import type { Env, Variables } from "../types.js";

async function ensureMember(db: DB, workspaceId: string, userId: string) {
  const member = await db.query.workspaceMember.findFirst({
    where: and(
      eq(workspaceMember.workspaceId, workspaceId),
      eq(workspaceMember.userId, userId)
    ),
  });
  if (!member) throw new ForbiddenError();
  return member;
}

const CreatePageSchema = z.object({
  title: z.string(),
  workspaceId: z.string(),
  parentId: z.string().optional(),
  icon: z.string().optional(),
  coverImage: z.string().optional(),
});

const UpdatePageSchema = z.object({
  title: z.string().optional(),
  icon: z.string().optional(),
  coverImage: z.string().optional(),
  parentId: z.string().nullable().optional(),
  content: z.string().optional(),
});

const ReorderSchema = z.object({
  parentId: z.string().nullable().optional(),
  order: z.number(),
});

const VersionSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const pageRoutes = new Hono<{ Bindings: Env; Variables: Variables }>()
  .use("*", authMiddleware)

  // GET /api/pages?workspaceId=&limit=&offset=
  .get("/", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const workspaceId = c.req.query("workspaceId") ?? "";
    const limit = Math.min(Number(c.req.query("limit") ?? 100), 200);
    const offset = Number(c.req.query("offset") ?? 0);

    if (!workspaceId) return c.json({ error: "workspaceId is required" }, 400);
    await ensureMember(db, workspaceId, session.user.id);

    const pages = await db.query.page.findMany({
      where: and(eq(page.workspaceId, workspaceId), eq(page.isArchived, false)),
      orderBy: (p, { asc }) => [asc(p.order), asc(p.createdAt)],
      limit,
      offset,
    });
    return c.json(pages);
  })

  // POST /api/pages
  .post("/", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const { title, workspaceId, parentId, icon, coverImage } =
      CreatePageSchema.parse(await c.req.json());

    await ensureMember(db, workspaceId, session.user.id);

    const [newPage] = await db
      .insert(page)
      .values({
        id: nanoid(),
        title: title || "Untitled",
        workspaceId,
        parentId: parentId ?? null,
        icon: icon ?? null,
        coverImage: coverImage ?? null,
        createdBy: session.user.id,
      })
      .returning();
    return c.json(newPage, 201);
  })

  // GET /api/pages/:id
  .get("/:id", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const p = await db.query.page.findFirst({
      where: eq(page.id, c.req.param("id")),
      with: { children: true, creator: true },
    });
    if (!p) throw new NotFoundError("Page");
    await ensureMember(db, p.workspaceId, session.user.id);
    return c.json(p);
  })

  // PATCH /api/pages/:id
  .patch("/:id", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const data = UpdatePageSchema.parse(await c.req.json());

    const existing = await db.query.page.findFirst({
      where: eq(page.id, c.req.param("id")),
    });
    if (!existing) throw new NotFoundError("Page");
    await ensureMember(db, existing.workspaceId, session.user.id);

    const [updated] = await db
      .update(page)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(page.id, c.req.param("id")))
      .returning();
    return c.json(updated);
  })

  // DELETE /api/pages/:id (soft delete — arsip)
  .delete("/:id", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");

    const existing = await db.query.page.findFirst({
      where: eq(page.id, c.req.param("id")),
    });
    if (!existing) throw new NotFoundError("Page");
    await ensureMember(db, existing.workspaceId, session.user.id);

    await db
      .update(page)
      .set({ isArchived: true, updatedAt: new Date() })
      .where(eq(page.id, c.req.param("id")));
    return c.json({ success: true });
  })

  // PATCH /api/pages/:id/reorder
  .patch("/:id/reorder", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const { parentId, order } = ReorderSchema.parse(await c.req.json());

    const existing = await db.query.page.findFirst({
      where: eq(page.id, c.req.param("id")),
    });
    if (!existing) throw new NotFoundError("Page");
    await ensureMember(db, existing.workspaceId, session.user.id);

    if (parentId) {
      const parent = await db.query.page.findFirst({
        where: eq(page.id, parentId),
      });
      if (!parent || parent.workspaceId !== existing.workspaceId) {
        throw new BadRequestError(
          "Parent page does not belong to the same workspace"
        );
      }
    }

    const [updated] = await db
      .update(page)
      .set({ parentId, order, updatedAt: new Date() })
      .where(eq(page.id, c.req.param("id")))
      .returning();
    return c.json(updated);
  })

  // GET /api/pages/:id/versions
  .get("/:id/versions", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const limit = Math.min(Number(c.req.query("limit") ?? 20), 50);
    const offset = Number(c.req.query("offset") ?? 0);

    const existing = await db.query.page.findFirst({
      where: eq(page.id, c.req.param("id")),
    });
    if (!existing) throw new NotFoundError("Page");
    await ensureMember(db, existing.workspaceId, session.user.id);

    const versions = await db.query.pageVersion.findMany({
      where: eq(pageVersion.pageId, c.req.param("id")),
      with: {
        savedByUser: { columns: { id: true, name: true, email: true } },
      },
      orderBy: [desc(pageVersion.createdAt)],
      limit,
      offset,
    });
    return c.json(versions);
  })

  // POST /api/pages/:id/versions
  .post("/:id/versions", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const { title, content } = VersionSchema.parse(await c.req.json());

    const existing = await db.query.page.findFirst({
      where: eq(page.id, c.req.param("id")),
    });
    if (!existing) throw new NotFoundError("Page");
    await ensureMember(db, existing.workspaceId, session.user.id);

    const [version] = await db
      .insert(pageVersion)
      .values({
        id: nanoid(),
        pageId: c.req.param("id"),
        title,
        content,
        icon: existing.icon,
        coverImage: existing.coverImage,
        savedBy: session.user.id,
      })
      .returning();
    return c.json(version, 201);
  })

  // POST /api/pages/:id/versions/:versionId/restore
  .post("/:id/versions/:versionId/restore", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");

    const existing = await db.query.page.findFirst({
      where: eq(page.id, c.req.param("id")),
    });
    if (!existing) throw new NotFoundError("Page");
    await ensureMember(db, existing.workspaceId, session.user.id);

    const version = await db.query.pageVersion.findFirst({
      where: and(
        eq(pageVersion.id, c.req.param("versionId")),
        eq(pageVersion.pageId, c.req.param("id"))
      ),
    });
    if (!version) throw new NotFoundError("Version");

    const [updated] = await db
      .update(page)
      .set({
        title: version.title,
        content: version.content,
        icon: version.icon,
        coverImage: version.coverImage,
        updatedAt: new Date(),
      })
      .where(eq(page.id, c.req.param("id")))
      .returning();
    return c.json(updated);
  });
