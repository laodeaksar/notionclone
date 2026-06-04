import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    VitePWA({
      registerType: "autoUpdate",
      // Let SvelteKit handle its own routing; only cache static assets.
      injectRegister: "auto",
      manifest: {
        name: "Notion Clone",
        short_name: "Notes",
        description: "Aplikasi catatan kolaboratif",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/favicon.png",
            sizes: "any",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // Cache JS, CSS, fonts, and images for offline app-shell.
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        // Network-first for API calls: try server, fall back to cache.
        runtimeCaching: [
          {
            urlPattern: /^\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [0, 200] },
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
