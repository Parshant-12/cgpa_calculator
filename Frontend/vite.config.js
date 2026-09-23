import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const frontendPort = Number(env.VITE_FRONTEND_PORT) || 3000;
  const backendUrl = env.VITE_BACKEND_URL || "http://localhost:5000";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: frontendPort,
      proxy: {
        "/api": {
          target: backendUrl,
        changeOrigin: true, // Changes the origin of the host header to the target URL
        secure: false, // Set to true only if your backend uses HTTPS
        },
      },
    },
  };
});