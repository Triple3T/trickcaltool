import { use, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ExternalLink,
  Loader2,
  LogOut,
  MessageCircleWarning,
  Moon,
  RotateCcw,
  Sun,
  SunMoon,
} from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import { useTheme } from "@/components/theme-provider";
import Loading from "@/components/common/loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import AccountDeleteConfirmDialog from "@/components/parts/account-delete-confirm-dialog";
import HardResetWithConfirm from "@/components/parts/hard-reset-with-confirm";
import OnlineBackupListDialog from "@/components/parts/online-backup-list-dialog";
import SkinChangeableCombobox from "@/components/parts/skin-changeable-combobox";
import SubtitleBar from "@/components/parts/subtitlebar";
import { dataFileRead, dataFileWrite } from "@/utils/dataRW";
import getServerHash from "@/utils/getServerHash";
import googleAccessUrl from "@/utils/googleAccessUrl";
import chara from "@/data/chara";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { currentSignature, oldSignatures } from "@/utils/versionMigrate";

const b64t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_";
const b64IntoNumber = (b64: string) => {
  return b64
    .split("")
    .map((v) => b64t.indexOf(v))
    .reduce((acc, v) => acc * 64 + v, 0);
};

interface IFileImportDialogProps {
  open: boolean;
  filename?: string;
  timestamp: number;
  crayon: number;
  rank: number;
  pcrayon: number;
  onConfirm: () => void;
}

const Setting = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const {
    forceUpload,
    userData,
    userDataDispatch,
    readIntoUserData,
    isReady,
    googleLinked,
  } = use(AuthContext);
  const fileInput = useRef<HTMLInputElement>(null);
  const [remoteHash, setRemoteHash] = useState<string>("");
  const [installButtonText, setInstallButtonText] = useState<string>(
    "ui.index.versionCheck.update"
  );
  const [skinChangeChara, setSkinChangeChara] = useState<string>("");
  const [skinNameId, setSkinNameId] = useState<string>("");
  const [fileImportDialogProp, setFileImportDialogProp] = useState<
    IFileImportDialogProps | undefined
  >(undefined);
  useEffect(() => {
    getServerHash()
      .then((v) => {
        setRemoteHash(v);
        if (process.env.VERSION_HASH !== v) {
          setInstallButtonText("ui.index.versionCheck.update");
        } else {
          setInstallButtonText("ui.index.versionCheck.alreadyLatest");
        }
      })
      .catch(() => {});
  }, []);
  const installNewVersion = useCallback(async () => {
    setInstallButtonText("ui.index.versionCheck.cleaning");
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((r) => r.unregister())).catch(() => {
      setInstallButtonText("ui.index.versionCheck.updateFailed");
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
      setInstallButtonText("ui.index.versionCheck.updateFailed");
      window.location.reload();
    }
    setInstallButtonText("ui.index.versionCheck.preparing");
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            setInstallButtonText("ui.index.versionCheck.installing");
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  setInstallButtonText("ui.index.versionCheck.updateCompleted");
                  window.location.reload();
                }
              }
            };
          } else {
            setInstallButtonText("ui.index.versionCheck.updateFailed");
            window.location.reload();
          }
        };
        registration
          .update()
          .then(() => {
            setInstallButtonText("ui.index.versionCheck.update");
          })
          .catch(() => {
            setInstallButtonText("ui.index.versionCheck.updateFailed");
            window.location.reload();
          });
      })
      .catch(() => {
        setInstallButtonText("ui.index.versionCheck.updateFailed");
        window.location.reload();
      });
  }, []);
  if (!userData || !userDataDispatch || !readIntoUserData) return <Loading />;

  return (
    <>
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
                <SunMoon className="mr-2 h-4 w-4" />{" "}
                {t("ui.common.themeSystem")}
              </Button>
            </div>
          </div>
          <div>
            <SubtitleBar>{t("ui.common.authTitle")}</SubtitleBar>
            {isReady ? (
              googleLinked ? (
                <div className="p-2">
                  <div>{t("ui.common.authAlreadyCompleted")}</div>
                  <div className="text-right text-sm">
                    <a href="/clear">
                      <Button variant="link">
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("ui.common.logout")}
                      </Button>
                    </a>
                  </div>
                  <div className="text-right text-xs">
                    <AccountDeleteConfirmDialog />
                  </div>
                </div>
              ) : (
                <div className="p-2">
                  <a href={googleAccessUrl} target="_self" rel="noreferrer">
                    {t("ui.common.authButtonText")}
                  </a>
                  <Alert variant="default" className="mt-2">
                    <MessageCircleWarning className="h-5 w-5" />
                    {/* <AlertTitle>{t("ui.board.aboutBestRouteTitle")}</AlertTitle> */}
                    <AlertDescription className="break-keep text-sm">
                      {t("ui.common.beforeAuthAnnounce")}
                    </AlertDescription>
                  </Alert>
                </div>
              )
            ) : (
              <div className="p-2">{t("ui.common.authLoading")}</div>
            )}
          </div>
          {isReady && googleLinked && (
            <div>
              <SubtitleBar>{t("ui.common.onlineBackup")}</SubtitleBar>
              <div className="flex flex-row justify-center gap-2 max-w-xl w-full px-4 py-2">
                <OnlineBackupListDialog />
              </div>
            </div>
          )}
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
                  onChange={(e) => {
                    if (!e.target.files || !e.target.files[0]) {
                      toast.error(t("ui.index.fileSync.invalidFileInput"));
                      return;
                    }
                    const onConfirm = () =>
                      dataFileRead(e.target.files).then((v) => {
                        if (v.success) {
                          readIntoUserData();
                          if (isReady && googleLinked && forceUpload) {
                            toast.promise(forceUpload, {
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
                      });
                    e.target.files[0].text().then((text) => {
                      const metadata = text.slice(0, 22);
                      const header = metadata.slice(0, 2);
                      const timestamp = b64IntoNumber(metadata.slice(2, 10));
                      const crayon = b64IntoNumber(metadata.slice(10, 14));
                      const rank = b64IntoNumber(metadata.slice(14, 18));
                      const pcrayon = b64IntoNumber(metadata.slice(18, 22));
                      if (
                        header === currentSignature ||
                        oldSignatures.indexOf(header) > 1
                      ) {
                        setFileImportDialogProp({
                          open: true,
                          timestamp,
                          crayon,
                          rank,
                          pcrayon,
                          onConfirm,
                        });
                      } else {
                        setFileImportDialogProp({
                          open: true,
                          filename: e.target.files![0].name,
                          timestamp: -1,
                          crayon: -1,
                          rank: -1,
                          pcrayon: -1,
                          onConfirm,
                        });
                      }
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <SubtitleBar>{t("ui.index.costumeChange.title")}</SubtitleBar>
            <div className="flex flex-col max-w-xl w-full px-2 mt-1 text-xs opacity-75 text-right">
              <div>{t("ui.index.costumeChange.description1")}</div>
              <div>{t("ui.index.costumeChange.description2")}</div>
            </div>
            <div className="flex flex-row gap-2 max-w-xl w-full px-2 py-2">
              <div className="flex-[4rem_0_0]">
                {skinChangeChara ? (
                  <img
                    className="w-16 h-16"
                    src={
                      userData.charaInfo[skinChangeChara].skin
                        ? `/charas/${skinChangeChara}Skin${userData.charaInfo[skinChangeChara].skin}.png`
                        : `/charas/${skinChangeChara}.png`
                    }
                  />
                ) : (
                  <div className="w-16 h-16" />
                )}
                <div className="w-16 text-sm break-keep">
                  {skinChangeChara && t(skinNameId)}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1 max-w-[calc(100%_-_4.5rem)] items-start">
                <div>
                  <SkinChangeableCombobox
                    value={skinChangeChara}
                    onChange={(v) => {
                      setSkinChangeChara(v);
                      const skinId = userData.charaInfo[skinChangeChara].skin;
                      setSkinNameId(
                        skinId ? `skin.${v}.${skinId}` : "defaultSkin"
                      );
                    }}
                  />
                </div>
                <ScrollArea className="w-full whitespace-nowrap h-14 rounded-md border">
                  <div className="flex w-max space-x-2 p-2">
                    {skinChangeChara &&
                      Array((chara[skinChangeChara]?.s || 0) + 1)
                        .fill(0)
                        .map((_, i) => {
                          const imgName = i
                            ? `${skinChangeChara}Skin${i}`
                            : skinChangeChara;
                          const skinNameId = i
                            ? `skin.${skinChangeChara}.${i}`
                            : "defaultSkin";
                          return (
                            <img
                              key={`${skinChangeChara}-${i}`}
                              src={`/charas/${imgName}.png`}
                              alt={t(skinNameId)}
                              className="w-9 h-9"
                              onClick={() => {
                                userDataDispatch.charaSkin(skinChangeChara, i);
                                setSkinNameId(skinNameId);
                              }}
                            />
                          );
                        })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
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
                      getServerHash()
                        .then((v) => {
                          setRemoteHash(v);
                          if (process.env.VERSION_HASH !== v) {
                            setInstallButtonText(
                              "ui.index.versionCheck.update"
                            );
                          } else {
                            setInstallButtonText(
                              "ui.index.versionCheck.alreadyLatest"
                            );
                          }
                        })
                        .catch(() => {});
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
              <div className="w-full flex flex-col gap-2 mt-1">
                <Button
                  className="w-full"
                  size="sm"
                  onClick={installNewVersion}
                  disabled={
                    process.env.VERSION_HASH === remoteHash ||
                    !remoteHash ||
                    (installButtonText !== "ui.index.versionCheck.update" &&
                      installButtonText !==
                        "ui.index.versionCheck.alreadyLatest")
                  }
                >
                  {installButtonText !== "ui.index.versionCheck.update" &&
                    installButtonText !==
                      "ui.index.versionCheck.alreadyLatest" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                  {t(installButtonText)}
                </Button>
                <div className="text-right text-sm">
                  <a
                    className="text-xs hover:underline"
                    href="https://triple3t.notion.site/102c52e157ae80f5a581dda26232a96b"
                  >
                    {t("ui.index.versionCheck.updateLog")}
                    <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <SubtitleBar>{t("ui.common.retryLegacyMigration")}</SubtitleBar>
            <div className="flex flex-col gap-1 max-w-xl w-full px-4 py-2">
              <div className="text-xs opacity-75">
                {t("ui.common.retryLegacyMigrationDesc")}
              </div>
              <Button
                onClick={async () =>
                  exportTextFile({
                    fileName: "trickcal-note-legacymigration.txt",
                    data: await migrateIntoIdbFile(),
                  })
                }
              >
                {t("ui.common.retryLegacyMigration")}
              </Button>
            </div>
          </div>
          <Separator className="my-2" />
          <div>
            <SubtitleBar>{t("ui.index.versionCheck.dangerZone")}</SubtitleBar>
            <div className="flex flex-col gap-1 max-w-xl w-full px-4 py-2">
              <HardResetWithConfirm />
            </div>
          </div>
        </div>
      </Card>
      <div className="font-onemobile text-xs text-right opacity-50 max-w-96 mt-4 -mb-4 mx-auto">
        <a href="https://www.buymeacoffee.com/_triple">
          {t("ui.index.buyMeACoffee")}
          <ExternalLink className="w-3 h-3 ml-0.5 inline" />
        </a>
      </div>
      <AlertDialog open={fileImportDialogProp?.open}>
        <AlertDialogContent className="font-onemobile">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("ui.common.restore")}</AlertDialogTitle>
            <AlertDialogDescription className="break-keep">
              {t("ui.index.fileSync.dataFileImportInfo")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {fileImportDialogProp &&
            (fileImportDialogProp.filename ? (
              <div>{fileImportDialogProp.filename}</div>
            ) : (
              <div className="flex flex-col gap-2">
                <div>
                  {t("ui.index.fileSync.dataFileTimestamp", {
                    0: new Date(
                      fileImportDialogProp.timestamp ?? 0
                    ).toLocaleString(),
                  })}
                </div>
                <div className="flex flex-row gap-2">
                  <div className="flex-1">
                    {t("ui.index.fileSync.dataFileCrayon", {
                      0: fileImportDialogProp.crayon ?? -1,
                    })}
                  </div>
                  <div className="flex-1">
                    {t("ui.index.fileSync.dataFileTotalRank", {
                      0: fileImportDialogProp.rank ?? -1,
                    })}
                  </div>
                </div>
              </div>
            ))}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setFileImportDialogProp(undefined);
              }}
            >
              {t("ui.index.fileSync.dataFileImportCancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (fileImportDialogProp) {
                  fileImportDialogProp.onConfirm();
                  setFileImportDialogProp(undefined);
                }
              }}
            >
              {t("ui.index.fileSync.dataFileImportConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Setting;
