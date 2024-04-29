import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Moon, RotateCcw, Sun, SunMoon } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import Layout from "@/components/layout";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import SubtitleBar from "@/components/parts/subtitlebar";
import { dataFileRead, dataFileWrite } from "@/utils/dataRW";
import getServerHash from "@/utils/getServerHash";
import googleAccessUrl from "@/utils/googleAccessUrl";

const SettingCore = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { autoSave, isReady, googleLinked } = useContext(AuthContext);
  const fileInput = useRef<HTMLInputElement>(null);
  const [remoteHash, setRemoteHash] = useState<string>("");
  const [installButtonText, setInstallButtonText] = useState<string>(
    "ui.index.versionCheck.update"
  );
  useEffect(() => {
    getServerHash(setRemoteHash);
  }, []);
  const installNewVersion = useCallback(async () => {
    setInstallButtonText("ui.index.versionCheck.preparing");
    await fetch("/sw.js", { cache: "reload" });
    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            setInstallButtonText("ui.index.versionCheck.installing");
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  // At this point, the updated precached content has been fetched,
                  // but the previous service worker will still serve the older content
                  setInstallButtonText("ui.index.versionCheck.updateCompleted");
                  window.location.reload();
                  // toast.success(
                  //   t("ui.index.versionCheck.success")
                  // );
                }
                //  else {
                //   // At this point, everything has been precached.
                //   // It's the perfect time to display a
                //   // "Content is cached for offline use." message.
                //   console.log("Content is cached for offline use.");
                // }
              }
              // if (installingWorker.state === "activated") {
              //   setInstallButtonText("ui.index.versionCheck.updateCompleted");
              //   window.location.reload();
              // }
            };
          } else {
            setInstallButtonText("ui.index.versionCheck.updateFailed");
            window.location.reload();
          }
        };
        registration;
        registration.update().then(() => {
          setInstallButtonText("ui.index.versionCheck.update");
        });
      });
  }, []);
  return (
    <Card className="font-onemobile p-4 max-w-96 mx-auto">
      <div className="flex flex-col gap-2">
        <div>
          <SubtitleBar>{t("ui.common.themeTitle")}</SubtitleBar>
          <div className="p-2 flex gap-2 justify-center">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
            >
              <Sun className="mr-2 h-4 w-4" /> {t("ui.common.themeLight")}
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
            >
              <Moon className="mr-2 h-4 w-4" /> {t("ui.common.themeDark")}
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
            >
              <SunMoon className="mr-2 h-4 w-4" /> {t("ui.common.themeSystem")}
            </Button>
          </div>
        </div>
        <div>
          <SubtitleBar>{t("ui.common.authTitle")}</SubtitleBar>
          <div className="p-2">
            {isReady ? (
              googleLinked ? (
                t("ui.common.authAlreadyCompleted")
              ) : (
                <a href={googleAccessUrl} target="_self" rel="noreferrer">
                  {t("ui.common.authButtonText")}
                </a>
              )
            ) : (
              t("ui.common.authLoading")
            )}
          </div>
        </div>
        <div>
          <SubtitleBar>{t("ui.common.backUpAndRestore")}</SubtitleBar>
          <div className="flex flex-row gap-2 max-w-xl w-full px-4 py-2">
            <div className="flex-1">
              <Button className="w-full" onClick={() => dataFileWrite()}>
                {t("ui.common.backUp")}
              </Button>
            </div>
            <div className="flex-1">
              <Button
                className="w-full"
                onClick={() => fileInput.current?.click()}
              >
                {t("ui.common.restore")}
              </Button>
              <input
                type="file"
                accept=".txt"
                className="hidden"
                ref={fileInput}
                onChange={(e) =>
                  dataFileRead(e.target.files).then((v) => {
                    if (v.success) {
                      if (isReady && googleLinked && autoSave) {
                        toast.promise(autoSave, {
                          loading: t("ui.index.fileSync.uploading"),
                          success: t("ui.index.fileSync.uploadSuccess"),
                          error: t("ui.index.fileSync.uploadFailed"),
                        });
                      } else {
                        toast.success(t("ui.index.fileSync.success"));
                      }
                    } else {
                      toast.error(t(v.reason));
                    }
                  })
                }
              />
            </div>
          </div>
        </div>
        <div>
          <SubtitleBar>{t("ui.index.versionCheck.title")}</SubtitleBar>
          <div className="flex flex-col gap-1 max-w-xl w-full px-4 py-2">
            <div className="flex flex-row justify-between">
              <div>{t("ui.index.versionCheck.current")}</div>
              <div>{process.env.VERSION_HASH!.substring(0, 7)}</div>
            </div>
            <div className="flex flex-row justify-between">
              <div>
                {t("ui.index.versionCheck.latest")}
                <RotateCcw
                  className="w-4 h-4 inline-block ml-2"
                  onClick={() => {
                    setRemoteHash("");
                    getServerHash(setRemoteHash);
                  }}
                />
              </div>
              <div
                className={
                  remoteHash
                    ? process.env.VERSION_HASH === remoteHash
                      ? "text-green-600 dark:text-green-300"
                      : "text-red-600 dark:text-red-300"
                    : ""
                }
              >
                {remoteHash.substring(0, 7) ||
                  t("ui.index.versionCheck.loading")}
              </div>
            </div>
            <div className="w-full">
              <Button
                onClick={installNewVersion}
                variant="ghost"
                disabled={
                  process.env.VERSION_HASH === remoteHash ||
                  !remoteHash ||
                  installButtonText !== "ui.index.versionCheck.update"
                }
              >
                {installButtonText !== "ui.index.versionCheck.update" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t(installButtonText)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Setting = () => {
  return (
    <Layout>
      <SettingCore />
    </Layout>
  );
};

export default Setting;
