import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { icons } from "./public/AppImages/icons.json";
console.log(__dirname);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      registerType: "autoUpdate",
      manifest: {
        name: "트릭컬툴",
        description: "Trickcal Tools by TripleLab",
        theme_color: "#a2dd73",
        background_color: "#09090b",
        icons: icons.map(({ src, sizes }) => ({
          src: `/AppImages/${src}`,
          type: "image/png",
          sizes,
        })),
        display: "standalone",
        scope: "/",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
