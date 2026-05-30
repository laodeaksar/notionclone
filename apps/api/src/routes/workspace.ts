import { Elysia, t } from "elysia";
import { Effect, pipe } from "effect";
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

export const workspaceRoutes = new Elysia({ prefix: "/api/workspaces" })
  .use(authMiddleware)
  // GET /api/workspaces
  .get("/", async ({ session }) => {
    const result = await Effect.runPromise(
      pipe(
        Effect.tryPromise(() =>
          db.query.workspaceMember.findMany({
            where: eq(workspaceMember.userId, session.user.id),
            with: { workspace: true },
          })
        ),
        Effect.map((members) => members.map((m) => m.workspace))
      )
    );
    return result;
  })
  // POST /api/workspaces
  .post(
    "/",
    async ({ body, session }: { body: { name: string; description?: string }; session: any }) => {
      const result = await Effect.runPromise(
        pipe(
          Effect.tryPromise(async () => {
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
          })
        )
      );
      return result;
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        description: t.Optional(t.String()),
      }),
    }
  )
  // GET /api/workspaces/:id
  .get("/:id", async ({ params, session, set }) => {
    const result = await Effect.runPromise(
      pipe(
        Effect.tryPromise(() =>
          db.query.workspaceMember.findFirst({
            where: and(
              eq(workspaceMember.workspaceId, params.id),
              eq(workspaceMember.userId, session.user.id)
            ),
            with: { workspace: true },
          })
        ),
        Effect.flatMap((member) =>
          member
            ? Effect.succeed(member.workspace)
            : Effect.fail(new Error("Not found"))
        )
      )
    );
    return result;
  })
  // PATCH /api/workspaces/:id
  .patch(
    "/:id",
    async ({ params, body, session }: { params: { id: string }; body: { name?: string; description?: string }; session: any }) => {
      const result = await Effect.runPromise(
        pipe(
          Effect.tryPromise(() =>
            db.query.workspaceMember.findFirst({
              where: and(
                eq(workspaceMember.workspaceId, params.id),
                eq(workspaceMember.userId, session.user.id)
              ),
            })
          ),
          Effect.flatMap((member) =>
            member && member.role === "owner"
              ? Effect.tryPromise(() =>
                  db
                    .update(workspace)
                    .set({ ...body, updatedAt: new Date() })
                    .where(eq(workspace.id, params.id))
                    .returning()
                    .then((r) => r[0])
                )
              : Effect.fail(new Error("Forbidden"))
          )
        )
      );
      return result;
    },
    {
      body: t.Object({
        name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
        description: t.Optional(t.String()),
      }),
    }
  )
  // DELETE /api/workspaces/:id
  .delete("/:id", async ({ params, session }) => {
    await Effect.runPromise(
      pipe(
        Effect.tryPromise(() =>
          db.query.workspaceMember.findFirst({
            where: and(
              eq(workspaceMember.workspaceId, params.id),
              eq(workspaceMember.userId, session.user.id)
            ),
          })
        ),
        Effect.flatMap((member) =>
          member && member.role === "owner"
            ? Effect.tryPromise(() =>
                db.delete(workspace).where(eq(workspace.id, params.id))
              )
            : Effect.fail(new Error("Forbidden"))
        )
      )
    );
    return { success: true };
  });
