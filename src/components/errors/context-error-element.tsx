import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dot, Mail } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import cuts from "./cuts";
import getServerHash from "@/utils/getServerHash";
import { openNoteDataDB, loadData as idbLoadData } from "@/utils/idbRW";
import { loadData as lsLoadData } from "@/utils/localStorageRW";
import {
  dataFileRead,
  exportTextFile,
  migrateIntoIdbFile,
} from "@/utils/dataRW";
import googleAccessUrlLegacy from "@/utils/googleAccessUrlLegacy";

const ContextErrorElement = ({ error }: { error: unknown }) => {
  const { t } = useTranslation();
  const [bgFileName, setBgFileName] = useState<string>("");
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const componentTitle = t("ui.error.title");
    const appTitle = t("ui.index.title");
    document.title = `${componentTitle} - ${appTitle}`;
    setBgFileName(cuts[Math.floor(Math.random() * cuts.length)]);
  }, [t]);
  const [importButtonText, setImportButtonText] =
    useState<string>("ui.common.restore");
  const [updateButtonText, setUpdateButtonText] = useState<string>(
    "ui.error.checkingUpdate"
  );
  useEffect(() => {
    getServerHash()
      .then((v) => {
        if (process.env.VERSION_HASH !== v) {
          setUpdateButtonText("ui.error.update");
        } else {
          setUpdateButtonText("ui.error.goto.refresh");
        }
      })
      .catch(() => {});
  }, []);
  const installNewVersion = useCallback(async () => {
    setUpdateButtonText("ui.error.updating");
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((r) => r.unregister())).catch(() => {
      setUpdateButtonText("ui.index.versionCheck.updateFailed");
      window.location.reload();
    });
    try {
      const cacheKeys = await caches.keys();
      const targetKey = cacheKeys.find((k) =>
        k.startsWith("trickcalnote-base")
      );
      if (targetKey) {
        const targetCache = await caches.open(targetKey);
        await targetCache.delete("/index.html", { ignoreSearch: true });
      }
      await caches.delete("trickcalnote-fallback");
    } catch {
      setUpdateButtonText("ui.index.versionCheck.updateFailed");
      window.location.reload();
    }
    setUpdateButtonText("ui.index.versionCheck.preparing");
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            setUpdateButtonText("ui.error.updating");
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  setUpdateButtonText("ui.index.versionCheck.updateCompleted");
                  window.location.reload();
                }
              }
            };
          } else {
            setUpdateButtonText("ui.index.versionCheck.updateFailed");
            window.location.reload();
          }
        };
        registration
          .update()
          .then(() => {
            setUpdateButtonText("ui.error.update");
          })
          .catch(() => {
            setUpdateButtonText("ui.index.versionCheck.updateFailed");
            window.location.reload();
          });
      })
      .catch(() => {
        setUpdateButtonText("ui.index.versionCheck.updateFailed");
        window.location.reload();
      });
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div
        className="absolute left-0 top-0 bg-center bg-cover w-full h-full font-onemobile bg-no-repeat bg-blend-overlay bg-slate-100/90 dark:bg-slate-900/90"
        style={{ backgroundImage: `url(/dialogcut/${bgFileName}.png)` }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-8 opacity-70 max-h-full overflow-y-auto">
          <div className="text-6xl">{t("ui.error.title")}</div>
          <div className="h-4" />
          <div className="text-lg">{t("ui.error.subtitle")}</div>
          <div className="break-keep">{t("ui.error.descriptionContext")}</div>
          <div className="text-xs mt-1 rounded-sm bg-slate-100 dark:bg-slate-900 p-1 max-h-[40vh]">
            {`${error}`}
          </div>
          <div className="text-sm mt-1 flex flex-col sm:flex-row justify-center items-center gap-1 p-1 my-1 text-blue-800/90 dark:text-blue-200/90 text-shadow-glow">
            <a href={googleAccessUrlLegacy}>{t("ui.common.loadLegacy")}</a>
            <Dot className="w-3 h-3 hidden sm:inline-block" strokeWidth={3} />
            <span
              className="cursor-pointer"
              onClick={async () =>
                exportTextFile({
                  fileName: "trickcal-note-legacymigration.txt",
                  data: await migrateIntoIdbFile(),
                })
              }
            >
              {t("ui.common.retryLegacyMigration")}
            </span>
            <Dot className="w-3 h-3 hidden sm:inline-block" strokeWidth={3} />
            <a href="mailto:trickcal-note@triple-lab.com">
              <Mail className="w-4 h-4 mr-1 inline-block" />
              {t("ui.error.contact")}
            </a>
          </div>
          <div className="mt-4 text-lg flex flex-wrap gap-2 justify-center">
            <a href="/">
              <Button>{t("ui.error.goto.main")}</Button>
            </a>
            <Button
              disabled={updateButtonText === "ui.error.checkingUpdate"}
              onClick={async () => {
                try {
                  await openNoteDataDB();
                  const { timestamp, data } = await idbLoadData();
                  exportTextFile({
                    fileName: `trickcalboard-backup-${timestamp}.txt`,
                    data,
                  });
                } catch {
                  const { timestamp, data } = await lsLoadData();
                  exportTextFile({
                    fileName: `trickcalboard-backup-${timestamp}.txt`,
                    data,
                  });
                }
              }}
            >
              {t("ui.error.export")}
            </Button>
            <Button onClick={() => fileInput.current?.click()}>
              {t(importButtonText)}
            </Button>
            <input
              type="file"
              accept=".txt"
              className="hidden"
              ref={fileInput}
              onChange={(e) => {
                if (!e.target.files || !e.target.files[0]) {
                  setImportButtonText("ui.index.fileSync.invalidFileInput");
                  setTimeout(() => {
                    setImportButtonText("ui.common.restore");
                  }, 2000);
                  return;
                }
                dataFileRead(e.target.files).then((v) => {
                  if (v.success) {
                    window.location.reload();
                  } else {
                    setImportButtonText("ui.index.fileSync.invalidFileInput");
                    setTimeout(() => {
                      setImportButtonText("ui.common.restore");
                    }, 2000);
                    return;
                  }
                });
              }}
            />
            <Button
              disabled={updateButtonText === "ui.error.checkingUpdate"}
              onClick={() => {
                if (updateButtonText === "error.goto.refresh") {
                  window.location.reload();
                } else {
                  installNewVersion();
                }
              }}
            >
              {t(updateButtonText)}
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ContextErrorElement;
