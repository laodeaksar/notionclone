---
name: Tiptap v3 Editor Architecture
description: How the editor is set up after removing Liveblocks and upgrading to Tiptap 3.25.0; covers package choices, store pattern for slash menu, and known API gotchas.
---

## Overview
Liveblocks + yjs collaboration removed; content now persists to `page.content` (TEXT column) via debounced `PATCH /api/pages/:id`.

## Key packages (all ^3.25.0)
- `@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/extension-image`
- `@tiptap/extension-placeholder`, `@tiptap/extension-typography`
- `@tiptap/extension-text-align`, `@tiptap/extension-text-style` (peer dep required explicitly)
- `@tiptap/suggestion` — for slash command menu
- `@tiptap/extension-file-handler` — image drag-drop/paste upload

## Slash menu pattern (Svelte store)
`editor.ts` exports a `writable` store `slashMenuStore`. The `Suggestion` plugin (inside a custom Extension) writes to it on `onStart/onUpdate/onExit`. Arrow key + Enter handling done inside `onKeyDown`. The Svelte component reads from the store and renders the dropdown. No `mount()`/`unmount()` needed.

**Why:** Avoids imperative Svelte 5 component mounting; store is reactive and works cleanly with `$derived`.

**How to apply:** Add items to `SLASH_ITEMS` in `editor.ts`; the store auto-updates.

## Import gotchas
- `Suggestion` is a **named** export: `import { Suggestion } from "@tiptap/suggestion"` ✓
- `FileHandler` is a named export: `import { FileHandler } from "@tiptap/extension-file-handler"` ✓
- `Response.json()` in browser code has no generic → use `await res.json() as SomeType` ✓
- `@tiptap/extension-text-style` must be explicitly listed in package.json at ^3.25.0 (otherwise FileHandler gets an unmet peer dep on the v2 version)

## Drag-handle context menu
Implemented without `@tiptap/extension-drag-handle` — pure Svelte `onmouseover` on the editor wrapper, iterating `.ProseMirror > *` children to find the hovered block. Handle positioned with `position:fixed` based on the block's `getBoundingClientRect()`. Context menu actions use `editor.state.doc.resolve(pos)` to get the block's range.

## Image alignment
Custom `align` attribute on `Image.extend()` (values: left/center/right/full-width). Bubble menu shown when `NodeSelection` is an image node; position derived from `editor.view.nodeDOM(selection.from).getBoundingClientRect()`.

## API change
`PATCH /api/pages/:id` now accepts `content?: string` in `UpdatePageSchema`.
