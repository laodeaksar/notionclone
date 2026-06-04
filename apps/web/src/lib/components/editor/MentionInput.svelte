<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { workspaceMembersQueryOptions, type WorkspaceMember } from "$lib/queries.js";
  import { detectMentionAtCursor } from "$lib/mentionUtils.js";

  let {
    value = $bindable(""),
    workspaceId,
    placeholder = "",
    rows = 3,
    autofocus = false,
    textareaClass = "",
    onSubmit,
    onEscape,
  }: {
    value?: string;
    workspaceId: string;
    placeholder?: string;
    rows?: number;
    autofocus?: boolean;
    textareaClass?: string;
    onSubmit?: () => void;
    onEscape?: () => void;
  } = $props();

  let textareaEl = $state<HTMLTextAreaElement | null>(null);
  let wrapperEl = $state<HTMLDivElement | null>(null);

  // ── Mention state ────────────────────────────────────────────────────────────
  let mentionOpen = $state(false);
  let mentionQuery = $state("");
  let mentionStart = $state(-1);
  let highlightedIdx = $state(0);

  const membersQuery = createQuery(() => workspaceMembersQueryOptions(workspaceId));

  const filteredMembers = $derived(
    (membersQuery.data ?? [])
      .filter((m) =>
        mentionQuery.length === 0 ||
        m.user.name.toLowerCase().includes(mentionQuery.toLowerCase())
      )
      .slice(0, 6)
  );

  $effect(() => {
    if (!mentionOpen) return;
    highlightedIdx = Math.min(highlightedIdx, Math.max(0, filteredMembers.length - 1));
  });

  $effect(() => {
    if (autofocus && textareaEl) {
      setTimeout(() => textareaEl?.focus(), 30);
    }
  });

  function handleInput() {
    const el = textareaEl;
    if (!el) return;
    const cursor = el.selectionStart ?? 0;
    const result = detectMentionAtCursor(el.value, cursor);
    if (result) {
      mentionQuery = result.query;
      mentionStart = result.start;
      mentionOpen = true;
      highlightedIdx = 0;
    } else {
      mentionOpen = false;
    }
  }

  function selectMember(member: WorkspaceMember) {
    const el = textareaEl;
    if (!el) return;
    const cursor = el.selectionStart ?? 0;
    const before = value.slice(0, mentionStart);
    const after = value.slice(cursor);
    const insert = `@${member.user.name} `;
    value = before + insert + after;
    mentionOpen = false;
    const newPos = mentionStart + insert.length;
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(newPos, newPos);
    }, 0);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (mentionOpen && filteredMembers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        highlightedIdx = (highlightedIdx + 1) % filteredMembers.length;
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        highlightedIdx = (highlightedIdx - 1 + filteredMembers.length) % filteredMembers.length;
        return;
      }
      if (e.key === "Enter") {
        const member = filteredMembers[highlightedIdx];
        if (member) { e.preventDefault(); selectMember(member); return; }
      }
      if (e.key === "Escape") {
        e.preventDefault();
        mentionOpen = false;
        return;
      }
    }

    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit?.();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onEscape?.();
    }
  }

  function initials(name: string) {
    return name.split(" ").map((n) => n[0] ?? "").join("").slice(0, 2).toUpperCase();
  }

  function avatarBg(name: string) {
    const colors = ["bg-blue-100 text-blue-700","bg-green-100 text-green-700",
      "bg-purple-100 text-purple-700","bg-orange-100 text-orange-700",
      "bg-pink-100 text-pink-700","bg-teal-100 text-teal-700"];
    let h = 0;
    for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % colors.length;
    return colors[h];
  }
</script>

<div bind:this={wrapperEl} class="relative">
  <textarea
    bind:this={textareaEl}
    bind:value
    {placeholder}
    {rows}
    oninput={handleInput}
    onkeydown={handleKeydown}
    class={textareaClass}
  ></textarea>

  {#if mentionOpen && filteredMembers.length > 0}
    <div
      class="absolute bottom-full mb-1 left-0 z-50 w-56
             bg-popover border border-border rounded-lg shadow-xl overflow-hidden"
      role="listbox"
      aria-label="Mention suggestions"
    >
      {#if membersQuery.isLoading}
        <div class="px-3 py-2 text-xs text-muted-foreground">Loading members…</div>
      {:else}
        {#each filteredMembers as member, i (member.id)}
          <button
            role="option"
            aria-selected={i === highlightedIdx}
            onclick={() => selectMember(member)}
            onmouseenter={() => (highlightedIdx = i)}
            class="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs
                   transition-colors hover:bg-accent"
            class:bg-accent={i === highlightedIdx}
          >
            <div class="w-6 h-6 rounded-full {avatarBg(member.user.name)}
                         flex items-center justify-center text-[10px] font-semibold shrink-0">
              {initials(member.user.name)}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium truncate">{member.user.name}</p>
              <p class="text-muted-foreground truncate">{member.user.email}</p>
            </div>
          </button>
        {/each}
      {/if}
    </div>
  {/if}
</div>
