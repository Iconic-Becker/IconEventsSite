import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
      "/_local": "http://localhost:3000",
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          lightbox: ["yet-another-react-lightbox", "yet-another-react-lightbox/plugins/zoom", "yet-another-react-lightbox/plugins/video"],
        },
      },
    },
  },
})
