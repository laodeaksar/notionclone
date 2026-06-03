<<<<<<< HEAD
// Collaboration via Liveblocks has been removed.
// Content is now persisted directly to the database (page.content field).
export {};
=======
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
>>>>>>> 75982b92e8c79649b1a477c4d72f3f54d9a5e844
