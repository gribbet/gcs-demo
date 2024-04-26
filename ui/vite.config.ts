import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
    }),
  ],
  build: {
    outDir: "../dist",
    sourcemap: true,
    target: "esnext",
    rollupOptions: {
      input: {
        index: "./src/index.html",
        "service-worker": "./src/service-worker.ts",
      },
      output: {
        entryFileNames: assetInfo =>
          assetInfo.name === "service-worker"
            ? "service-worker.js"
            : "assets/[name]-[hash].js",
      },
    },
  },
});
