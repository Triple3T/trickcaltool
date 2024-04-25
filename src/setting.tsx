import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Moon, Sun, SunMoon } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import Layout from "@/components/layout";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import SubtitleBar from "@/components/parts/subtitlebar";
import { dataFileRead, dataFileWrite } from "@/utils/dataRW";
import googleAccessUrl from "@/utils/googleAccessUrl";

const SettingCore = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { autoSave, isReady, googleLinked } = useContext(AuthContext);
  const fileInput = useRef<HTMLInputElement>(null);
  const [remoteHash, setRemoteHash] = useState<string>("");
  useEffect(() => {
    const getRemoteHash = async () => {
      const res = await fetch("https://tr.triple-lab.com/api/hash");
      const text = await res.text();
      setRemoteHash(text);
    };
    getRemoteHash();
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
                      toast.success(t("ui.index.fileSync.success"));
                      if (isReady && googleLinked && autoSave) {
                        autoSave();
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
        {localStorage.getItem("testkey") && (
          <div>
            <SubtitleBar>{t("ui.index.versionCheck.title")}</SubtitleBar>
            <div className="flex flex-col gap-1 max-w-xl w-full px-4 py-2">
              <div className="flex flex-row justify-between">
                <div>{t("ui.index.versionCheck.current")}</div>
                <div>{REACT_APP_VERSION_HASH}</div>
              </div>
              <div className="flex flex-row justify-between">
                <div>{t("ui.index.versionCheck.latest")}</div>
                <div
                  className={
                    remoteHash
                      ? REACT_APP_VERSION_HASH === remoteHash
                        ? "text-green-600 dark:text-green-300"
                        : "text-red-600 dark:text-red-300"
                      : ""
                  }
                >
                  {remoteHash || t("ui.index.versionCheck.loading")}
                </div>
              </div>
            </div>
          </div>
        )}
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
