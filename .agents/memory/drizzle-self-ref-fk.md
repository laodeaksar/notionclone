---
name: Drizzle self-referential FK
description: How to correctly type a self-referential foreign key in drizzle-orm pg-core without TypeScript errors.
---

## Rule
Import `AnyPgColumn` from `drizzle-orm/pg-core` and use it as the return type annotation for self-referential `references()` callbacks.

```typescript
import { type AnyPgColumn } from "drizzle-orm/pg-core";

parentId: text("parent_id").references((): AnyPgColumn => page.id, {
  onDelete: "set null",
}),
```

**Why:** TypeScript cannot infer the circular type when a column references a column on the same table. `(): ReturnType<typeof text>` produces a mismatched type error because `text()` returns a builder, not a column. `AnyPgColumn` is the correct base type.

**How to apply:** Any time a table has a self-referential FK (e.g., page.parentId → page.id, category.parentId → category.id), use this pattern.
