import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

const PROTECTED_PATHS = ["/app"];

// Cookie name matches the cookiePrefix set in packages/auth: "notion-clone"
const SESSION_COOKIE_NAME = "notion-clone.session_token";

export const handle: Handle = async ({ event, resolve }) => {
  const isProtected = PROTECTED_PATHS.some((p) =>
    event.url.pathname.startsWith(p)
  );

  if (isProtected) {
    const sessionToken = event.cookies.get(SESSION_COOKIE_NAME);
    if (!sessionToken) {
      redirect(302, `/login?redirectTo=${encodeURIComponent(event.url.pathname)}`);
    }
  }

  return resolve(event);
};
