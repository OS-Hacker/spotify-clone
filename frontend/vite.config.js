// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "spotify-clone-1-n0qq.onrender.com", // Your Render hostname
      "localhost", // For local development
    ],
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "spotify-clone-1-n0qq.onrender.com", // Your Render hostname
      "localhost",
    ],
  },
});
