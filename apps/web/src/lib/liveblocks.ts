import { createClient } from "@liveblocks/client";

export const liveblocks = createClient({
  publicApiKey: import.meta.env.PUBLIC_LIVEBLOCKS_KEY ?? "",
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
