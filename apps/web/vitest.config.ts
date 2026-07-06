import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // React 19 is pinned at the monorepo root (see root package.json); dedupe
    // guards against a second copy sneaking in via nested installs.
    dedupe: ["react", "react-dom"],
  },
  test: {
    environment: "jsdom",
    include: ["test/**/*.test.{ts,tsx}"],
    setupFiles: ["test/setup.ts"],
    globals: true,
  },
});
