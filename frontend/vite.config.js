import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // 👈 ESSENCIAL PARA ELECTRON
  plugins: [react()],
  server: {
    port: 5173,
    hmr: {
      port: 5173
    }
  }
});