import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSyncQuery } from "@/hooks/useSyncQuery";
import { useUserToken } from "@/stores/useUserDataStore";
import Loading from "@/components/common/loading";
import {
  ArrowDownFromLine,
  Files,
  Link,
  SquarePen,
  Trash,
  X,
} from "lucide-react";

interface MyTeamDataType {
  title: string;
  members: string[];
  teamtype: number;
  unique_key: string;
  created_at: string;
  updated_at: string;
}

interface MyTeamListDialogProps {
  openFromTeamList: (key: string) => void;
  copyFromTeamList: (key: string, callback: () => void) => void;
  renameFromTeamList: (key: string, callback: () => void) => void;
  copyLinkFromTeamList: (key: string) => void;
  deleteFromTeamList: (key: string, callback: () => void) => void;
}

const MyTeamListDialog = ({
  openFromTeamList,
  copyFromTeamList,
  renameFromTeamList,
  copyLinkFromTeamList,
  deleteFromTeamList,
}: MyTeamListDialogProps) => {
  const { t } = useTranslation();
  const { applyBackup } = useSyncQuery();
  const token = useUserToken();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [teamDatas, setTeamDatas] = useState<MyTeamDataType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const getTeamData = useCallback(() => {
    setError(null);
    setLoading(true);
    fetch(`${process.env.API_HOSTNAME}/api/v3/tr/teambuilder/my`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setLoading(false);
      if (res.ok) {
        res.json().then((k) => setTeamDatas(k));
      } else {
        setError("ui.error.api.networkFailed");
      }
    });
  }, [token]);
  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        setOpen(true);
        setLoading(true);
        getTeamData();
      } else {
        setOpen(false);
        setTeamDatas([]);
      }
    },
    [getTeamData]
  );
  const copyTeam = useCallback((key: string) => {
    copyFromTeamList(key, () => {
      getTeamData();
      toast.success(t("ui.teambuilder.teamCopied"));
    });
  }, [copyFromTeamList, getTeamData, t]);
  const renameTeam = useCallback((key: string) => {
    renameFromTeamList(key, () => {
      getTeamData();
      toast.success(t("ui.teambuilder.teamRenamed"));
    });
  }, [getTeamData, renameFromTeamList, t]);
  const deleteTeam = useCallback((key: string) => {
    deleteFromTeamList(key, () => {
      getTeamData();
      toast.success(t("ui.teambuilder.teamDeleted"));
    });
  }, [deleteFromTeamList, getTeamData, t])
  if (!applyBackup) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>{t("ui.teambuilder.listMyTeam")}</Button>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("ui.teambuilder.listMyTeam")}</DialogTitle>
        </DialogHeader>
        {(() => {
          if (loading) return <Loading />;
          if (error) return <div>{t(error)}</div>;
          if (teamDatas.length === 0)
            return <div>{t("ui.teambuilder.listMyTeamEmpty")}</div>;
          return (
            <div className="flex flex-col">
              <div className="px-2 flex flex-row">
                <div className="flex-auto text-left">
                  {t("ui.teambuilder.usingSlotCount")}
                </div>
                <div className="flex-auto text-right">
                  <span className="text-blue-700 dark:text-blue-300">
                    {teamDatas.length}
                  </span>
                  <span className="text-sm">/100</span>
                </div>
              </div>
              <ScrollArea className="max-w-full whitespace-nowrap rounded-md h-96">
                {teamDatas.map(
                  ({
                    title,
                    members,
                    teamtype,
                    unique_key,
                    created_at,
                    updated_at,
                  }) => {
                    return (
                      <div key={unique_key} className="p-2 -mx-2">
                        <Card className="p-4">
                          <div className="flex flex-row">
                            <div className="flex-1 text-sm opacity-75">
                              {t(
                                `ui.teambuilder.${
                                  [
                                    "noRestrict",
                                    "soloRaidRestrict",
                                    "soloEndRestrict",
                                  ][teamtype]
                                }`
                              )}
                            </div>
                            <div className="flex flex-row flex-0 gap-1.5">
                              <ArrowDownFromLine className="w-4 h-4" onClick={() => openFromTeamList(unique_key)} />
                              <Files className="w-4 h-4" onClick={() => copyTeam(unique_key)} />
                              <SquarePen className="w-4 h-4" onClick={() => renameTeam(unique_key)} />
                              <Link className="w-4 h-4" onClick={() => copyLinkFromTeamList(unique_key)} />
                              <Trash className="w-4 h-4" onClick={() => deleteTeam(unique_key)} />
                            </div>
                          </div>
                          <div className="text-lg">{title}</div>
                          <div className="text-xs">
                            {t("ui.teambuilder.createdAt")}:{" "}
                            {new Date(created_at).toLocaleString()}
                          </div>
                          <div className="text-xs">
                            {t("ui.teambuilder.updatedAt")}:{" "}
                            {new Date(updated_at).toLocaleString()}
                          </div>
                          <div className="h-4" />
                          <div className="flex flex-row flex-wrap w-full gap-0.5">
                            {members.map((m, i) => {
                              const className = "w-8 h-8 rounded-sm";
                              if (!m)
                                return (
                                  <div
                                    key={i}
                                    className={cn(className, "bg-slate-600")}
                                  >
                                    <X
                                      className={cn(
                                        className,
                                        "text-slate-300"
                                      )}
                                    />
                                  </div>
                                );
                              return (
                                <div
                                  key={i}
                                  className={cn(
                                    className,
                                    "relative overflow-hidden aspect-square"
                                  )}
                                >
                                  <img
                                    src={`/charas/${m}.png`}
                                    alt=""
                                    className="absolute max-w-[calc(100%_/_0.43)] w-[calc(100%_/_0.43)] h-[calc(100%_/_0.43)] aspect-square -top-[46%] -left-[64%]"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </Card>
                      </div>
                    );
                  }
                )}
              </ScrollArea>
            </div>
          );
        })()}
      </DialogContent>
    </Dialog>
  );
};

export default MyTeamListDialog;
