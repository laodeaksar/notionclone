---
name: Validation consistency
description: How validation is structured across API and shared schemas; why zod was removed.
---

# Validation Consistency

## Rule
All API route validation must use shared Valibot schemas from `@notion-clone/schemas`. Do NOT add a second validation library (e.g. Zod) to the `apps/api` package.

## Why
`packages/schemas` already defines all request schemas in Valibot (`PageCreateSchema`, `WorkspaceCreateSchema`, `LiveblocksAuthSchema`, etc.). The API previously duplicated all these with Zod, creating two sources of truth. After this fix, `zod` was removed from `apps/api/package.json` and `valibot` added directly.

## How to apply
```ts
import * as v from "valibot";
import { PageCreateSchema } from "@notion-clone/schemas";

const data = v.parse(PageCreateSchema, await c.req.json());
```

`ValiError` thrown by `v.parse()` is caught in `apps/api/src/app.ts` global error handler and returned as HTTP 400 with `{ error: issues[0].message }`.

## ValiError handler (app.ts)
```ts
import { ValiError } from "valibot";

app.onError((err, c) => {
  if (err instanceof ValiError) {
    return c.json({ error: err.issues[0]?.message ?? "Validation error" }, 400);
  }
  ...
});
```
