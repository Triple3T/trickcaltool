import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { defaultLng, supportedLngNames } from "./langs";

const BASE_URL = process.env.WEBLATE_LANG_URL;
const API_KEY = process.env.WEBLATE_API_KEY;

interface LangEntryProps {
  language: {
    id: number;
    code: string;
    name: string;
    plural: Record<string, string | number>;
    aliases: string[];
    direction: "ltr" | "rtl";
    population: number;
    web_url: string;
    url: string;
    statistics_url: string;
  };
  language_code: string;
  id: number;
  filename: string;
  revision: string;
  web_url: string;
  share_url: string;
  translate_url: string;
  url: string;
  is_template: boolean;
  is_source: boolean;
  total: number;
  total_words: number;
  translated: number;
  translated_words: number;
  translated_percent: number;
  fuzzy: number;
  fuzzy_words: number;
  fuzzy_percent: number;
  failing_checks: number;
  failing_checks_words: number;
  failing_checks_percent: number;
  have_suggestion: number;
  have_comment: number;
  last_change: string;
  last_author: string;
  repository_url: string;
  file_url: string;
  statistics_url: string;
  changes_list_url: string;
  units_list_url: string;
}

const supportedCode = Object.keys(supportedLngNames);
if (process.env.DEV) {
  console.log("DEV mode: Supported language codes:", supportedCode);
  console.log("removing ko-KR as it is base language");
  supportedCode.splice(supportedCode.indexOf("ko-KR"), 1);
}
function deepFillMissingKeys(
  target: Record<string, Record<string, string> | string>,
  fallback: Record<string, Record<string, string> | string>
): void {
  for (const key in fallback) {
    if (!(key in target)) {
      target[key] = fallback[key];
    } else if (
      typeof fallback[key] === "object" &&
      typeof target[key] === "object" &&
      fallback[key] !== null &&
      target[key] !== null
    ) {
      deepFillMissingKeys(target[key], fallback[key]);
    }
  }
}
const getLocalizeFile = async () => {
  if (!BASE_URL || !API_KEY) {
    console.error(
      "[getLocalizeFile] WEBLATE_LANG_URL or WEBLATE_API_KEY is not set."
    );
    throw new Error(
      "[getLocalizeFile] WEBLATE_LANG_URL or WEBLATE_API_KEY is not set."
    );
  }
  const existTranslationsResult = await fetch(BASE_URL, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Token ${API_KEY}`,
    },
  });
  const existTranslations: { results: LangEntryProps[] } =
    await existTranslationsResult.json();
  const translationList = [];
  for (const lang of existTranslations.results) {
    const matchLangCode = [lang.language.code, ...lang.language.aliases].find(
      (v) =>
        supportedCode
          .map((s) => s.toLowerCase().replaceAll("-", "_"))
          .includes(v.toLowerCase().replaceAll("-", "_"))
    );
    if (!matchLangCode) continue;
    const matchedLangCode = supportedCode.find(
      (v) =>
        v.toLowerCase().replaceAll("-", "_") ===
        matchLangCode.toLowerCase().replaceAll("-", "_")
    )!;
    const langFileResponse = await fetch(lang.file_url, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Token ${API_KEY}`,
      },
    });
    console.log(
      `[getLocalizeFile] Fetching language file ${matchedLangCode}.json`
    );
    const langFileJson = await langFileResponse.json();
    writeFileSync(
      path.resolve(__dirname, `${matchedLangCode}.json`),
      JSON.stringify(langFileJson)
    );
    translationList.push(matchedLangCode);
  }
  const defaultLngIndex = translationList.indexOf(defaultLng as string);
  if (defaultLngIndex >= 0) translationList.splice(defaultLngIndex, 1);
  const defaultLngFile = JSON.parse(
    readFileSync(path.resolve(__dirname, `${defaultLng}.json`), "utf-8")
  );
  for (const lang of translationList) {
    const langFile = JSON.parse(
      readFileSync(path.resolve(__dirname, `${lang}.json`), "utf-8")
    );
    deepFillMissingKeys(langFile, defaultLngFile);
    writeFileSync(
      path.resolve(__dirname, `${lang}.json`),
      JSON.stringify(langFile)
    );
    console.log(`[getLocalizeFile] Updated language file ${lang}.json`);
  }
};

getLocalizeFile();
