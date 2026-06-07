<script lang="ts">
	import { cn } from "../../utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import type { WithElementRef } from "../../utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="select-separator"
	role="separator"
	class={cn("cn-select-separator pointer-events-none shrink-0 bg-border h-px w-full", className)}
	{...restProps}
></div>
