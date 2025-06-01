import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { supportedLngs, defaultLng } from "./langs";
export { supportedLngs, defaultLng };

import ko_KR from "./ko-KR.json";
import zh_CN from "./zh-CN.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.DEV,
    fallbackLng: defaultLng,
    supportedLngs,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      "ko-KR": ko_KR,
      "zh-CN": zh_CN,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

document.documentElement.lang = i18n.language;
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

export const changeLanguage = async (lng: string) => {
  if (!supportedLngs.includes(lng)) {
    console.warn(`[i18n] Unsupported language code: ${lng}`);
    return;
  }
  await i18n.changeLanguage(lng);
  document.documentElement.lang = lng;
};

export const getCurrentLanguage = () => {
  return i18n.language;
};

export default i18n;
