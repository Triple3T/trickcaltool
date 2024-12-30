import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { icons } from "./public/AppImages/icons.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    VitePWA({
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css}"],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/tr\.triple-lab\.com\/api\/.*/i,
            handler: "NetworkOnly",
          },
          {
            urlPattern: /^https:\/\/api\.triple-lab\.com\/api\/.*/i,
            handler: "NetworkOnly",
          },
          {
            urlPattern: /^https:\/\/www\.googleapis\.com\/.*/i,
            handler: "NetworkOnly",
          },
          {
            urlPattern:
              /^https:\/\/tr\.triple-lab\.com\/.*\.(png|jpg|svg|webp|ttf|otf)(\?)?.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "trickcalnote-assets",
              expiration: {
                maxEntries: 720,
                maxAgeSeconds: 60 * 60 * 24 * 28,
                matchOptions: {
                  ignoreSearch: true,
                },
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern:
              /^https:\/\/tr\.triple-lab\.com\/.*\.(js|css)(\?)?.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "trickcalnote-components",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 28,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern:
              /^https:\/\/tr\.triple-lab\.com\/.*\.(html)(\?)?.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "trickcalnote-base",
              expiration: {
                maxEntries: 6,
                maxAgeSeconds: 60 * 60 * 24 * 14,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/tr\.triple-lab\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "trickcalnote-fallback",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: "트릭컬 노트",
        short_name: "트릭컬 노트",
        description: "내 성장 현황 메모하기",
        lang: "ko",
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
            description: "사도들의 장비 랭크를 메모합니다.",
            icons: [
              {
                src: "/itemslot/Tab_Equip_Default.png",
                sizes: "120x120",
              },
            ],
          },
          {
            name: "교단 연구 노트",
            url: "/lab",
            description: "교단의 연구 현황을 체크합니다.",
            icons: [
              {
                src: "/mainlobby/HousingButton.png",
                sizes: "144x144",
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
  define: {
    "process.env.VERSION_HASH": `"${
      process.env.CF_PAGES_COMMIT_SHA ?? "DEV0001"
    }"`,
    "process.env.HOSTNAME": `"${
      process.env.VITE_HOSTNAME ?? "https://tr.triple-lab.com"
    }"`,
    "process.env.GOOGLE_CLIENT_ID": `"${
      process.env.REACT_APP_GAPI_CLIENT_ID ??
      "637944158863-l548alrsg15njgk49kpaq13d5gnijo3j.apps.googleusercontent.com"
    }"`,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("i18next")) return "i18next";
            if (id.includes("lucide-react")) return "lucide-react";
            if (id.includes("tailwind-merge")) return "tailwind-merge";
            if (id.includes("sonner")) return "sonner";
            if (id.includes("router")) return "router";
            return "vendor";
          }
        },
      },
    },
  },
});
