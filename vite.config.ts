import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: env.VITE_BASE_URL || "/cable-zone/", // Use env var or default
    plugins: [react()],
    server: {
      host: true, // Allow network access for mobile testing
      port: 5173,
    },
  };
});
