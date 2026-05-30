import { Elysia } from "elysia";
import { auth } from "@notion-clone/auth";

export type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export const authMiddleware = new Elysia({ name: "auth-middleware" }).derive(
  { as: "scoped" },
  async ({ request, set }): Promise<{ session: Session }> => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      set.status = 401;
      throw new Error("Unauthorized");
    }
    return { session };
  }
);
