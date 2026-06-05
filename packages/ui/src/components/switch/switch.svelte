<script lang="ts" module>
  export interface SwitchProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    "aria-label"?: string;
    class?: string;
  }
</script>

<script lang="ts">
  import { cn } from "../../utils.js";

  let {
    checked = false,
    onCheckedChange,
    disabled = false,
    "aria-label": ariaLabel,
    class: className,
  }: SwitchProps = $props();

  function toggle() {
    if (disabled) return;
    onCheckedChange?.(!checked);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  }
</script>

<button
  type="button"
  role="switch"
  aria-checked={checked}
  aria-label={ariaLabel}
  {disabled}
  onclick={toggle}
  onkeydown={onKeydown}
  class={cn(
    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
    "transition-colors duration-200 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    checked ? "bg-primary" : "bg-input",
    disabled && "cursor-not-allowed opacity-50",
    className
  )}
>
  <span
    class={cn(
      "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-md",
      "transition-transform duration-200 ease-in-out",
      checked ? "translate-x-4" : "translate-x-0"
    )}
  ></span>
</button>
