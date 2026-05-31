---
name: Elysia error handler codes
description: Elysia onError receives a `code` string for known error types; missing branches cause them to log as internal errors.
---

## Rule
The global `onError` in Elysia must explicitly handle all built-in error codes or they fall through to the generic `console.error("[Internal Error]", ...)` branch and pollute logs.

```typescript
.onError(({ error, set, code }) => {
  if (code === "VALIDATION") { set.status = 400; return { error: "Validation error" }; }
  if (code === "NOT_FOUND")  { set.status = 404; return { error: "Not found" }; }
  // then custom HttpError check, then generic 500
})
```

**Why:** Elysia throws a `NOT_FOUND` error for unmatched routes. Without handling it, every 404 (including browser favicon/manifest requests) is logged as an internal error, creating noise that hides real bugs.

**How to apply:** When adding new error codes (e.g., `PARSE_ERROR`, `UNKNOWN`), add a branch in `apps/api/src/app.ts` onError before the generic catch-all.
