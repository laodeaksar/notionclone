import { Hono } from "hono";
import * as v from "valibot";
import { eq, and, isNull, asc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb, comment, page, workspaceMember } from "@notion-clone/db";
import type { DB } from "@notion-clone/db";
import {
  CommentCreateSchema,
  CommentReplyCreateSchema,
  CommentUpdateSchema,
} from "@notion-clone/schemas";
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

export const commentRoutes = new Hono<{ Bindings: Env; Variables: Variables }>()
  .use("*", authMiddleware)

  // GET /api/pages/:pageId/comments
  .get("/pages/:pageId/comments", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const pageId = c.req.param("pageId");

    const p = await db.query.page.findFirst({ where: eq(page.id, pageId) });
    if (!p) throw new NotFoundError("Page");
    await ensureMember(db, p.workspaceId, session.user.id);

    const threads = await db.query.comment.findMany({
      where: and(eq(comment.pageId, pageId), isNull(comment.parentId)),
      with: {
        author: { columns: { id: true, name: true, email: true } },
        replies: {
          with: {
            author: { columns: { id: true, name: true, email: true } },
          },
          orderBy: [asc(comment.createdAt)],
        },
      },
      orderBy: [asc(comment.createdAt)],
    });

    return c.json(threads);
  })

  // POST /api/pages/:pageId/comments
  .post("/pages/:pageId/comments", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const pageId = c.req.param("pageId");
    const { content, quote } = v.parse(CommentCreateSchema, await c.req.json());

    const p = await db.query.page.findFirst({ where: eq(page.id, pageId) });
    if (!p) throw new NotFoundError("Page");
    await ensureMember(db, p.workspaceId, session.user.id);

    const id = nanoid();
    await db.insert(comment).values({
      id,
      pageId,
      authorId: session.user.id,
      content: content.trim(),
      quote: quote?.trim() ?? null,
    });

    const full = await db.query.comment.findFirst({
      where: eq(comment.id, id),
      with: {
        author: { columns: { id: true, name: true, email: true } },
        replies: {
          with: { author: { columns: { id: true, name: true, email: true } } },
          orderBy: [asc(comment.createdAt)],
        },
      },
    });

    return c.json(full, 201);
  })

  // POST /api/pages/:pageId/comments/:commentId/replies
  .post("/pages/:pageId/comments/:commentId/replies", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const pageId = c.req.param("pageId");
    const commentId = c.req.param("commentId");
    const { content } = v.parse(CommentReplyCreateSchema, await c.req.json());

    const p = await db.query.page.findFirst({ where: eq(page.id, pageId) });
    if (!p) throw new NotFoundError("Page");
    await ensureMember(db, p.workspaceId, session.user.id);

    const parent = await db.query.comment.findFirst({
      where: and(eq(comment.id, commentId), eq(comment.pageId, pageId)),
    });
    if (!parent) throw new NotFoundError("Comment");
    if (parent.parentId) throw new BadRequestError("Cannot reply to a reply");

    const id = nanoid();
    await db.insert(comment).values({
      id,
      pageId,
      authorId: session.user.id,
      parentId: commentId,
      content: content.trim(),
    });

    const full = await db.query.comment.findFirst({
      where: eq(comment.id, id),
      with: { author: { columns: { id: true, name: true, email: true } } },
    });

    return c.json(full, 201);
  })

  // PATCH /api/comments/:id
  .patch("/comments/:id", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const commentId = c.req.param("id");
    const body = v.parse(CommentUpdateSchema, await c.req.json());

    if (body.content === undefined && body.resolved === undefined) {
      throw new BadRequestError("At least one of content or resolved is required");
    }

    const existing = await db.query.comment.findFirst({
      where: eq(comment.id, commentId),
    });
    if (!existing) throw new NotFoundError("Comment");

    const p = await db.query.page.findFirst({
      where: eq(page.id, existing.pageId),
    });
    if (!p) throw new NotFoundError("Page");
    await ensureMember(db, p.workspaceId, session.user.id);

    if (body.content !== undefined && existing.authorId !== session.user.id) {
      throw new ForbiddenError();
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (body.content !== undefined) updates.content = body.content.trim();
    if (body.resolved !== undefined) updates.resolved = body.resolved;

    const [updated] = await db
      .update(comment)
      .set(updates as never)
      .where(eq(comment.id, commentId))
      .returning();

    return c.json(updated);
  })

  // DELETE /api/comments/:id
  .delete("/comments/:id", async (c) => {
    const db = getDb(c.env.DB);
    const session = c.get("session");
    const commentId = c.req.param("id");

    const existing = await db.query.comment.findFirst({
      where: eq(comment.id, commentId),
    });
    if (!existing) throw new NotFoundError("Comment");

    const p = await db.query.page.findFirst({
      where: eq(page.id, existing.pageId),
    });
    if (!p) throw new NotFoundError("Page");
    await ensureMember(db, p.workspaceId, session.user.id);

    if (existing.authorId !== session.user.id) throw new ForbiddenError();

    await db.delete(comment).where(eq(comment.id, commentId));
    return c.json({ success: true });
  });
