import adapterNode from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// Use adapter-vercel only when building on Vercel (VERCEL=1 is set by Vercel CI).
// Everything else (local dev, local build) uses adapter-node.
let adapter;
if (process.env.VERCEL === "1") {
  const { default: adapterVercel } = await import("@sveltejs/adapter-vercel");
  adapter = adapterVercel();
} else {
  adapter = adapterNode();
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter,
  },
};

export default config;
