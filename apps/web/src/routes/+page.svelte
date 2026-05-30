<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client.js";

  onMount(async () => {
    const session = await authClient.getSession();
    if (session.data?.user) {
      goto("/app");
    } else {
      goto("/login");
    }
  });
</script>

<div class="flex h-screen items-center justify-center">
  <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
</div>
