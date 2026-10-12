import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // Relative base so the build works on GitHub Pages project sites.
  base: "./",
  server: {
    port: 5173,
  },
});
