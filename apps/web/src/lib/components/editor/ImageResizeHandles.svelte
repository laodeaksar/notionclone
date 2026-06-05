<script lang="ts">
  import type { Editor } from "@tiptap/core";

  let {
    visible = false,
    imageRect = null,
    editor,
  }: {
    visible?: boolean;
    imageRect?: { left: number; top: number; width: number; height: number } | null;
    editor: Editor | null;
  } = $props();

  type HandleSide = "right" | "bottom-right" | "bottom-left";

  let resizing = $state(false);
  let activeSide = $state<HandleSide | null>(null);
  let startX = $state(0);
  let startWidth = $state(0);

  function handlePos(side: HandleSide) {
    if (!imageRect) return { left: 0, top: 0 };
    const H = 10;
    const half = H / 2;
    switch (side) {
      case "right":
        return {
          left: imageRect.left + imageRect.width - half,
          top: imageRect.top + imageRect.height / 2 - half,
        };
      case "bottom-right":
        return {
          left: imageRect.left + imageRect.width - half,
          top: imageRect.top + imageRect.height - half,
        };
      case "bottom-left":
        return {
          left: imageRect.left - half,
          top: imageRect.top + imageRect.height - half,
        };
    }
  }

  function onMouseDown(e: MouseEvent, side: HandleSide) {
    e.preventDefault();
    e.stopPropagation();
    if (!imageRect) return;
    resizing = true;
    activeSide = side;
    startX = e.clientX;
    startWidth = imageRect.width;

    function onMove(me: MouseEvent) {
      if (!resizing || !editor) return;
      const delta = me.clientX - startX;
      const sign = side === "bottom-left" ? -1 : 1;
      const newWidth = Math.max(80, Math.round(startWidth + sign * delta));
      editor.chain().updateAttributes("image", { width: newWidth }).run();
    }

    function onUp() {
      resizing = false;
      activeSide = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  const sides: HandleSide[] = ["right", "bottom-right", "bottom-left"];
</script>

{#if visible && imageRect}
  {#each sides as side (side)}
    {@const pos = handlePos(side)}
    <div
      role="separator"
      aria-label="Resize image"
      class="fixed z-50 w-2.5 h-2.5 rounded-full border-2 border-primary bg-background shadow
             cursor-col-resize select-none hover:bg-primary transition-colors"
      class:cursor-nwse-resize={side === "bottom-right"}
      class:cursor-nesw-resize={side === "bottom-left"}
      style="left:{pos.left}px;top:{pos.top}px;"
      onmousedown={(e) => onMouseDown(e, side)}
    ></div>
  {/each}
{/if}
