import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// Hotfix: Ensure Fly.io client deployment uses correct API URL (VITE_API_URL=https://deadpigeons-api.fly.dev)
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
