import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Relative base so the build works on GitHub Pages project sites.
  base: "./",
  server: {
    port: 5173,
  },
  test: {
    // Playwright specs live in e2e/ and run via `pnpm test:e2e`.
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
