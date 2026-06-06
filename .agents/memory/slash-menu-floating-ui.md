---
name: SlashMenu floating-ui implementation
description: How @floating-ui/dom is wired into the Tiptap SlashMenu to replace manual viewport math.
---

## Rule
Use `@floating-ui/dom` `computePosition` + `autoUpdate` with a virtual element built from `@tiptap/suggestion`'s `clientRect` function.

**Why:** The old manual `bottom/left` calculation using `window.visualViewport` was fragile — didn't handle viewport edges, flip, or scroll inside nested containers. `@floating-ui` handles all of this via `flip()`, `shift()`, and `autoUpdate`.

## Key design decisions

### SlashMenuState shape (`editor.ts`)
```typescript
export interface SlashMenuState {
  open: boolean;
  items: SlashItem[];
  selectedIndex: number;
  rect: (() => DOMRect | null | undefined) | null;  // clientRect fn from @tiptap/suggestion
  contextElement: Element | null;                    // editor.view.dom (for autoUpdate scroll tracking)
  executeCommand: ((item: SlashItem) => void) | null;
}
```

- Store the **function** `props.clientRect` (not the result) — floating-ui calls it fresh each time
- Store `editor.view.dom` as `contextElement` — required for `autoUpdate` to track ancestor scroll

### Extension wiring (`onStart` / `onUpdate`)
```typescript
slashMenuStore.set({
  open: true,
  items: localItems,
  selectedIndex: 0,
  rect: props.clientRect ?? null,    // function, not called
  contextElement: editor.view.dom,
  executeCommand: (item) => localCommand?.(item),
});
```

### SlashMenu.svelte positioning
```svelte
// Virtual element passed to computePosition
const virtualRef = {
  getBoundingClientRect: (): DOMRect => rect() ?? new DOMRect(0, 0, 0, 0),
  ...(ctx ? { contextElement: ctx } : {}),
};

// autoUpdate options for virtual element
const cleanup = autoUpdate(virtualRef, menuEl, updatePos, {
  ancestorScroll: true,
  ancestorResize: true,
  elementResize: false,  // virtual element has no ResizeObserver
  layoutShift: false,
});
```

Middlewares: `offset(6)` → `flip({ padding: 8, fallbackPlacements: ["top-start"] })` → `shift({ padding: 8, crossAxis: true })`

CSS: `position: fixed; top: 0; left: 0; transform: translate({x}px, {y}px); will-change: transform`
— do NOT use `top`/`left` pixel values from floating-ui directly (use transform for compositor perf)

**How to apply:** Follow this same pattern for any other floating Svelte menus (context menus, tooltips) that need to float relative to a caret/virtual position in a Tiptap editor.
