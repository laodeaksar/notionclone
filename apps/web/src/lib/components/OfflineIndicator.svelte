<script lang="ts">
  import { isOnline } from "$lib/stores/network.js";
  import { WifiOff, Wifi } from "lucide-svelte";

  let wasOffline = $state(false);
  let showSynced = $state(false);
  let syncedTimer: ReturnType<typeof setTimeout>;

  $effect(() => {
    if (!$isOnline) {
      wasOffline = true;
      showSynced = false;
      clearTimeout(syncedTimer);
    } else if (wasOffline) {
      showSynced = true;
      syncedTimer = setTimeout(() => {
        showSynced = false;
        wasOffline = false;
      }, 3000);
    }
  });

  const visible = $derived(!$isOnline || showSynced);
</script>

{#if visible}
  <div
    class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-all duration-300
      {$isOnline
      ? 'bg-emerald-500 text-white'
      : 'bg-zinc-800 text-white dark:bg-zinc-700'}"
  >
    {#if $isOnline}
      <Wifi class="h-4 w-4" strokeWidth={1.5} />
      <span>Kembali online — tersinkron</span>
    {:else}
      <WifiOff class="h-4 w-4" strokeWidth={1.5} />
      <span>Offline — perubahan akan disinkronkan saat terhubung</span>
    {/if}
  </div>
{/if}
