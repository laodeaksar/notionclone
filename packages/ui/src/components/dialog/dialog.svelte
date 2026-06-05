<script lang="ts" module>
  export interface DialogProps {
    onClose: () => void;
    title?: string;
    description?: string;
    maxWidth?: string;
    children?: import("svelte").Snippet;
  }
</script>

<script lang="ts">
  import { cn } from "../../utils.js";

  let {
    onClose,
    title,
    description,
    maxWidth = "max-w-md",
    children,
  }: DialogProps = $props();

  function trapFocus(node: HTMLElement) {
    const selector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function getFocusable() {
      return Array.from(node.querySelectorAll<HTMLElement>(selector));
    }

    queueMicrotask(() => getFocusable()[0]?.focus());

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    node.addEventListener("keydown", handleKeydown);
    return {
      destroy() {
        node.removeEventListener("keydown", handleKeydown);
      },
    };
  }
</script>

<!-- Backdrop -->
<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
  onclick={(e) => e.target === e.currentTarget && onClose()}
  role="presentation"
>
  <!-- Panel -->
  <div
    use:trapFocus
    role="dialog"
    aria-modal="true"
    aria-label={title}
    class={cn(
      "w-full rounded-xl bg-background border border-border shadow-2xl overflow-hidden",
      maxWidth
    )}
  >
    {#if title}
      <div class="px-6 py-4 border-b border-border">
        <h2 class="text-base font-semibold text-foreground">{title}</h2>
        {#if description}
          <p class="text-sm text-muted-foreground mt-0.5">{description}</p>
        {/if}
      </div>
    {/if}

    {@render children?.()}
  </div>
</div>
