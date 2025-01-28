import { use, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DatabaseBackup } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/contexts/AuthContext";
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

const OnlineBackupListDialog = () => {
  const { t } = useTranslation();
  const { forceApplyBackup, requestToken } = use(AuthContext);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [backupDatas, setBackupDatas] = useState<number[][]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  useEffect(() => {
    if (!requestToken) return;
    if (!backupDatas.length) {
      // fetch backup datas
      requestToken(
        async (tok) => {
          const res = await fetch(
            "https://api.triple-lab.com/api/v2/tr/backuplist",
            {
              method: "GET",
              credentials: "include",
              headers: {
                Authorization: `Bearer ${tok}`,
              },
            }
          );
          if (!res.ok) {
            setFailed(true);
            toast.error(t("ui.common.onlineBackupListFetchFailed"));
            return;
          }
          const data = await res.json();
          setBackupDatas(data);
          setSuccess(true);
        },
        () => {}
      );
    }
  }, [backupDatas.length, requestToken, t]);
  if (!forceApplyBackup) return null;

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
                backupDatas.map((dt, i) => {
                  return (
                    <Card
                      key={i}
                      className={cn(
                        "flex flex-col w-full p-4 my-1 justify-center items-stretch text-sm",
                        i === selectedIndex && "bg-blue-500/20"
                      )}
                      onClick={() => setSelectedIndex(i)}
                    >
                      <div>
                        {t("ui.index.fileSync.dataFileTimestamp", {
                          0: new Date(dt[0]).toLocaleString(),
                        })}
                      </div>
                      <div>
                        {t("ui.index.fileSync.dataFileCrayon", { 0: dt[1] })}
                      </div>
                      <div>
                        {t("ui.index.fileSync.dataFileTotalRank", { 0: dt[2] })}
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
            selectedIndex < 0
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
              onClick={() => forceApplyBackup(selectedIndex)}
              disabled={selectedIndex < 0}
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
