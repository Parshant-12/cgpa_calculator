import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // Explicitly set the frontend port
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true, // Changes the origin of the host header to the target URL
        secure: false, // Set to true only if your backend uses HTTPS
      },
    },
  },
});