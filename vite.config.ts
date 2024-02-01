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
        name: "트릭컬 노트",
        short_name: "트릭컬 노트",
        description: "내 성장 현황 메모하기",
        lang: "ko",
        orientation: "natural",
        dir: "ltr",
        theme_color: "#a2dd73",
        background_color: "#09090b",
        icons: icons.map(({ src, sizes }) => ({
          src: `/AppImages/${src}`,
          type: "image/png",
          sizes,
        })),
        display: "standalone",
        display_override: ["standalone", "window-controls-overlay"],
        scope: "/",
        shortcuts: [
          {
            name: "최상급 보드 노트",
            url: "/board",
            description: "전체 스탯 % 보드 현황을 체크합니다.",
            icons: [
              {
                src: "/icons/Item_Crayon4.png",
                sizes: "256x256",
              },
            ],
          },
          {
            name: "랭크 메모장",
            url: "/eqrank",
            description: "사도들의 장비 랭크를 메모해 둡니다.",
            icons: [
              {
                src: "/itemslot/Tab_Equip_Default.png",
                sizes: "120x120",
              },
            ],
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
