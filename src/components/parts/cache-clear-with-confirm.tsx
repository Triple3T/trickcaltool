import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteDB } from "idb";
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

export function CacheClearWithConfirm() {
  const { t } = useTranslation();
  const [started, setStarted] = useState(false);
  const cacheClear = useCallback(async () => {
    setStarted(true);
    try {
      if ("serviceWorker" in navigator) {
        for await (const key of await caches.keys()) {
          if (key === "workbox-precache-v2-https://tr.triple-lab.com/")
            continue;
          await caches.delete(key);
        }
        deleteDB('workbox-expiration');
      }
    } catch {
      toast.error(t("ui.index.versionCheck.cacheClearFailed"));
    }
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
          {t("ui.index.versionCheck.cacheClear")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-onemobile">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("ui.index.versionCheck.cacheClearTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="break-keep">
            {t("ui.index.versionCheck.cacheClearDescription")}
            <br />
            {t("ui.index.versionCheck.cacheClearAdditionalDesc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={started}>
            {t("ui.index.versionCheck.cacheClearCancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={cacheClear} disabled={started}>
            {t("ui.index.versionCheck.cacheClearConfirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CacheClearWithConfirm;
