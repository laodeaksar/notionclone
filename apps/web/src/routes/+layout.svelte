<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { themeStore } from "$lib/stores/theme.js";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { persistQueryClient } from "@tanstack/query-persist-client-core";
  import { createIdbPersister } from "$lib/persister.js";

  let { children } = $props();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // gcTime must be >= maxAge in the persister (24 h) so cached
        // data isn't collected from memory before it can be written to IDB.
        gcTime: 24 * 60 * 60_000,
        refetchOnWindowFocus: true,
        // Show cached data immediately; fetch in background when online.
        networkMode: "offlineFirst",
      },
      mutations: {
        // Queue mutations when offline; replay automatically on reconnect.
        networkMode: "offlineFirst",
      },
    },
  });

  onMount(() => {
    themeStore.init();

    const persister = createIdbPersister();
    const [unsubscribe] = persistQueryClient({
      queryClient,
      persister,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return unsubscribe;
  });
</script>

<QueryClientProvider client={queryClient}>
  {@render children()}
</QueryClientProvider>
