---
name: Tailwind v4 + Vite setup
description: How to correctly configure Tailwind CSS v4 in a SvelteKit + Vite project without PostCSS conflicts.
---

## Rule
Use `@tailwindcss/vite` as the Vite plugin. Do NOT use a `postcss.config.js` — its presence causes Tailwind v4 to throw "trying to use tailwindcss directly as a PostCSS plugin" errors.

```typescript
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()], // tailwindcss FIRST
});
```

```css
/* app.css — v4 syntax */
@import "tailwindcss";

@theme inline {
  --color-background: hsl(var(--background));
  /* ... all design tokens */
}

@layer base {
  :root { --background: 0 0% 100%; ... }
}
```

**Why:** Tailwind v4 splits the PostCSS plugin into `@tailwindcss/postcss` (separate package). The old `tailwindcss` package no longer exports a working PostCSS plugin. With `@tailwindcss/vite`, PostCSS config is not needed at all — autoprefixer is built into v4.

**How to apply:**
1. `pnpm add -D @tailwindcss/vite`
2. Remove `tailwind.config.js` (configuration is CSS-first in v4)
3. Delete `postcss.config.js` entirely
4. Update `app.css` to use `@import "tailwindcss"` + `@theme inline` for shadcn/ui-style HSL variables
5. In `@theme inline`, colors map to `--color-{name}` which enables `bg-{name}`, `text-{name}`, `border-{name}` utilities
