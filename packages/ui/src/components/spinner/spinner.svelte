<script lang="ts">
	import { cn } from "../../utils.js";
	import type { SVGAttributes } from "svelte/elements";
	import { Loader2 } from "lucide-svelte";

	let {
		class: className,
		role = "status",
		name,
		color,
		stroke,
		"aria-label": ariaLabel = "Loading",
		...restProps
	}: SVGAttributes<SVGSVGElement> = $props();
</script>

<Loader2
	{role}
	name={name === null ? undefined : name}
	color={color === null ? undefined : color}
	stroke={stroke === null ? undefined : stroke}
	aria-label={ariaLabel}
	class={cn("size-4 animate-spin", className)}
	{...restProps}
/>
