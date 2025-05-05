import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import chara from "@/data/chara";
import { personalityBG } from "@/utils/personalityBG";
import { Personality } from "@/types/enums";

interface ThemeEventBonusDialogProps {
  bonus: {
    c: string;
    b: number;
  }[];
}

const ThemeEventBonusDialog = ({ bonus }: ThemeEventBonusDialogProps) => {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge className="font-normal">{t("ui.eventcalc.viewBonus")}</Badge>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("ui.eventcalc.viewBonusTitle")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row flex-wrap justify-center gap-2 max-w-96 mx-auto py-2">
          {bonus.map(({ c, b }) => {
            return (
              <Card
                key={c}
                className="flex flex-col w-16 text-center text-sm overflow-hidden relative"
              >
                <img
                  src={`/charas/${c}.webp`}
                  alt={t(`chara.${c}`)}
                  className={cn(
                    "w-full aspect-square",
                    personalityBG[Number(chara[c].t[0]) as Personality]
                  )}
                />
                <div className="my-auto py-0.5">{t(`chara.${c}`)}</div>
                <div className="absolute top-10 w-full">
                  <Badge
                    variant="outline"
                    className="bg-slate-100/70 dark:bg-slate-900/70 font-thin py-px text-xs"
                  >
                    {b}%
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeEventBonusDialog;
