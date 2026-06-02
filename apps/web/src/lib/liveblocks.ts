import { createClient } from "@liveblocks/client";

export const liveblocks = createClient({
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
