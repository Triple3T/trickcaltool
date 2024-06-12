import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const [started, setStarted] = useState(false);
  const hardReset = useCallback(async () => {
    setStarted(true);
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((r) => r.unregister())).catch(() => {
      window.location.reload();
    });
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map((k) => caches.delete(k))).catch(() => {
      window.location.reload();
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
                  window.location.reload();
                }
              }
            };
          } else {
            window.location.reload();
          }
        };
        registration
          .update()
          .then(() => {})
          .catch(() => {
            window.location.reload();
          });
      })
      .catch(() => {
        window.location.reload();
      });
  }, []);
  const { t } = useTranslation();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="w-full font-onemobile"
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
