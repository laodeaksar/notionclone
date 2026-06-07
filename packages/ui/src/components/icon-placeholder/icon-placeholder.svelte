<script lang="ts">
import {
	MoreHorizontal,
	ChevronRight,
	ChevronDown,
	ChevronUp,
	Check,
	X
} from "lucide-svelte";

const iconMap: Record<string, any> = {
	MoreHorizontalIcon: MoreHorizontal,
	ChevronRightIcon: ChevronRight,
	ChevronDownIcon: ChevronDown,
	ChevronUpIcon: ChevronUp,
	CheckIcon: Check,
	XIcon: X
};

let {
	lucide,
	class: className,
	...restProps
}: {
	lucide?: string;
	tabler?: string;
	hugeicons?: string;
	phosphor?: string;
	remixicon?: string;
	class?: string;
	[key: string]: any;
} = $props();

const IconComponent = $derived(lucide ? iconMap[lucide] : null);
</script>

{#if IconComponent}
	<IconComponent class={className} {...restProps} />
{/if}
