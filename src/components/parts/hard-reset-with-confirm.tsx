import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function HardResetWithConfirm() {
  const { t } = useTranslation();
  const [started, setStarted] = useState(false);
  const hardReset = useCallback(async () => {
    setStarted(true);
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((r) => r.unregister())).catch(() => {
      toast.error(t("ui.index.versionCheck.hardResetFailed"));
    });
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map((k) => caches.delete(k))).catch(() => {
      toast.error(t("ui.index.versionCheck.hardResetFailed"));
    });
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  toast.error(t("ui.index.versionCheck.hardResetFailed"));
                }
              }
            };
          } else {
            toast.error(t("ui.index.versionCheck.hardResetFailed"));
          }
        };
        registration
          .update()
          .then(() => {
            toast.success(t("ui.index.versionCheck.hardResetSuccess"));
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          })
          .catch(() => {
            toast.error(t("ui.index.versionCheck.hardResetFailed"));
          });
      })
      .catch(() => {
        toast.error(t("ui.index.versionCheck.hardResetFailed"));
      });
  }, [t]);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full font-onemobile text-red-600 dark:text-red-400"
          disabled={started}
        >
          {t("ui.index.versionCheck.hardReset")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-onemobile">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("ui.index.versionCheck.hardResetTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="break-keep">
            {t("ui.index.versionCheck.hardResetDescription")}
            <br />
            {t("ui.index.versionCheck.hardResetAdditionalDesc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={started}>
            {t("ui.index.versionCheck.hardResetCancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={hardReset} disabled={started}>
            {t("ui.index.versionCheck.hardResetConfirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default HardResetWithConfirm;
