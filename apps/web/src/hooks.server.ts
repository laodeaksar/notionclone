import type { Handle } from "@sveltejs/kit";

// Auth protection is handled client-side in the app layout via useSession.
// Server-side cookie checks are unreliable in proxied environments (e.g. Replit)
// because the proxy may not forward cookies on full-page navigation requests.
export const handle: Handle = async ({ event, resolve }) => {
  return resolve(event);
};
