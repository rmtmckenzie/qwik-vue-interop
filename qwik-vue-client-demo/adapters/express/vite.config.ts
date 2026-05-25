import { defineConfig } from "vite";
import baseConfigFn from "../../vite.config";

export default defineConfig((env) => {
  const baseConfig = typeof baseConfigFn === "function" ? baseConfigFn(env) : baseConfigFn;
  return {
    ...baseConfig,
    build: {
      ...baseConfig.build,
      ssr: true,
      outDir: "server",
      rollupOptions: {
        input: ["src/entry.express.tsx"],
      },
    },
  };
});
