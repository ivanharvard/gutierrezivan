import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses (0.0.0.0)
    port: 5173,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true, // Force polling for WSL
      interval: 1000, // Poll every 1 second
    },
    open: false, // Don't auto-open browser
  },
  build: {
    sourcemap: true,
  },
});