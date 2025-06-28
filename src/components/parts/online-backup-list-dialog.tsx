import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DatabaseBackup } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSyncQuery } from "@/hooks/useSyncQuery";
import { useUserToken } from "@/stores/useUserDataStore";

interface BackupDataType {
  id: string;
  fileTimestamp: number;
  crayonStatistic: number;
  totalRankStatistic: number;
  purpleCrayonStatistic: number;
  storedAt: number;
}

const OnlineBackupListDialog = () => {
  const { t } = useTranslation();
  const { applyBackup } = useSyncQuery();
  const token = useUserToken();
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [backupDatas, setBackupDatas] = useState<BackupDataType[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>("-1");
  useEffect(() => {
    if (!backupDatas.length && token) {
      // fetch backup datas
      (async () => {
        const res = await fetch(
          "https://api.triple-lab.com/api/v3/tr/backuplist",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          setFailed(true);
          toast.error(t("ui.common.onlineBackupListFetchFailed"));
          return;
        }
        const data: BackupDataType[] = await res.json();
        setBackupDatas(data);
        setSuccess(true);
      })();
    }
  }, [backupDatas.length, t, token]);
  if (!applyBackup) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <DatabaseBackup className="w-4 h-4 mr-2 inline" />
          {t("ui.common.onlineBackupButton")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("ui.common.onlineBackup")}</DialogTitle>
          <DialogDescription className="break-keep">
            {t("ui.common.onlineBackupDescription")}
            <br />
            {t("ui.common.onlineBackupAdditionalDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="text-lg">{t("ui.common.onlineBackupList")}</div>
        {failed ? (
          <>{t("ui.common.onlineBackupListFetchFailed")}</>
        ) : (
          <ScrollArea className="max-w-full whitespace-nowrap rounded-md h-96">
            {success ? (
              backupDatas.length > 0 ? (
                backupDatas.map((dt) => {
                  return (
                    <Card
                      key={dt.id}
                      className={cn(
                        "flex flex-col w-full p-4 my-1 justify-center items-stretch text-sm",
                        "bg-gradient-to-br from-green-300/60 dark:from-green-700/60 via-transparent dark:via-transparent to-transparent dark:to-transparent via-25%",
                        dt.id === selectedIndex &&
                          "bg-green-500/20 ring-2 ring-green-200 dark:ring-green-800"
                      )}
                      onClick={() => setSelectedIndex(dt.id)}
                    >
                      <div>
                        {t("ui.index.fileSync.dataFileTimestamp", {
                          0: new Date(dt.fileTimestamp).toLocaleString(),
                        })}
                      </div>
                      <div>
                        {t("ui.index.fileSync.dataFileStoredTimestamp", {
                          0: new Date(dt.storedAt).toLocaleString(),
                        })}
                      </div>
                      <div>
                        {t("ui.index.fileSync.dataFileCrayon", { 0: dt.crayonStatistic })}
                      </div>
                      <div>
                        {t("ui.index.fileSync.dataFileTotalRank", { 0: dt.totalRankStatistic })}
                      </div>
                    </Card>
                  );
                })
              ) : (
                <>{t("ui.common.onlineBackupListNone")}</>
              )
            ) : (
              <>{t("ui.common.onlineBackupListFetching")}</>
            )}
          </ScrollArea>
        )}
        <div className="text-center opacity-75">
          {t(
            selectedIndex === "-1"
              ? "ui.common.onlineBackupSelect"
              : "ui.common.onlineBackupApply"
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="reset" variant="outline" onClick={() => {}}>
              {t("ui.common.no")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              onClick={() => applyBackup.mutateAsync(selectedIndex)}
              disabled={selectedIndex === "-1"}
            >
              {t("ui.common.yes")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnlineBackupListDialog;
