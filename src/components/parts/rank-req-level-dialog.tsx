import { useTranslation } from "react-i18next";
import { ArrowUpToLine, PlusCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import rankClassNames from "@/utils/rankClassNames";
import { cn } from "@/lib/utils";

const RankReqLevelDialog = ({
  reqs,
  maxRank,
}: {
  reqs: number[];
  maxRank: number;
}) => {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger>
        <PlusCircle
          className="ml-1 w-4 h-4 inline-block align-middle"
          strokeWidth={3}
        />
      </DialogTrigger>
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="font-normal">
              {t("ui.equiprank.rankReqLevelTitle")}
            </div>
          </DialogTitle>
        </DialogHeader>
        <Alert variant="default">
          <ArrowUpToLine className="h-4 w-4" />
          <AlertTitle>{t("ui.equiprank.aboutReqLevelTitle")}</AlertTitle>
          <AlertDescription className="break-keep">
            {t("ui.equiprank.aboutReqLevelDescription")}
          </AlertDescription>
        </Alert>
        <div className="p-2 flex flex-col gap-2">
          {reqs.slice(0, maxRank).map((lv, i) => {
            const rank = i + 1;
            return (
              <div key={i} className="pl-4">
                <div
                  className={cn(rankClassNames[i][5], "flex flex-row border-b")}
                >
                  <div
                    className={cn(
                      rankClassNames[i][3],
                      rankClassNames[i][4],
                      "rounded-full -my-px -ml-4 px-4 py-1 flex-initial"
                    )}
                  >
                    {t("ui.equiprank.rankText", { 0: `${rank}` })}
                  </div>
                  <div className="-my-px px-1 py-1 text-right flex-grow">
                    {t("ui.equiprank.levelText", { 0: `${lv}` })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RankReqLevelDialog;
