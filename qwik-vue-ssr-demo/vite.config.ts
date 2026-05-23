import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    plugins: [
      qwikVite(),
      tsconfigPaths(),
      vue()
    ],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
