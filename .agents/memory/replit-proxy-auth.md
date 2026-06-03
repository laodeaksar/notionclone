---
name: Replit proxy auth pattern
description: Why server-side cookie checks fail in Replit dev, and how to do auth correctly.
---

## The rule
Never use `hooks.server.ts` cookie-based redirects for auth protection in Replit dev. Use client-side `useSession()` from better-auth/svelte instead.

**Why:** The Replit reverse proxy strips (or does not forward) `Cookie` headers when the browser performs a full-page navigation (hard reload). This means `event.cookies.get(SESSION_COOKIE_NAME)` in `hooks.server.ts` always returns `undefined` on reload, causing immediate redirect to login even when the user has a valid session. Client-side fetch requests (XHR/fetch) do carry cookies correctly because they go through the Vite proxy.

**How to apply:**
- `hooks.server.ts` should be a pass-through (`return resolve(event)`) — no cookie checks.
- Auth guard goes in the layout's `$effect`: check `$session.isPending`, then `$session.data?.user`, then redirect only when `!isPending && !error && !data?.user`.
- Use `useSession()` (reactive store) not `authClient.getSession()` (one-shot async fn) — the store caches the result and doesn't re-fetch on every navigation.
- Do NOT redirect to login when `$session.error` is set (network errors, API slow to start) — show loading spinner until resolved.

**Pattern:**
```svelte
const session = useSession();
const ready = $derived(!$session.isPending && !!$session.data?.user);
$effect(() => {
  if (!$session.isPending && !$session.error && !$session.data?.user) {
    goto("/login");
  }
});
```
