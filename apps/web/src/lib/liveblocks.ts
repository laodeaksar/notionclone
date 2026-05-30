import { createClient } from "@liveblocks/client";
import { PUBLIC_LIVEBLOCKS_KEY } from "$env/static/public";

export const liveblocks = createClient({
  publicApiKey: PUBLIC_LIVEBLOCKS_KEY,
  authEndpoint: async (room) => {
    const response = await fetch("/api/liveblocks-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ room }),
    });
    return response.json();
  },
});
