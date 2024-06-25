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

interface ThemeEventBonusDialogProps {
  bonus: {
    c: string;
    b: number;
  }[];
}

const personalityBG = (p: string) => {
  switch (Number(p)) {
    case 0:
      return "bg-personality-Cool";
    case 1:
      return "bg-personality-Gloomy";
    case 2:
      return "bg-personality-Jolly";
    case 3:
      return "bg-personality-Mad";
    case 4:
      return "bg-personality-Naive";
    default:
      return "";
  }
};

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
                  src={`/charas/${c}.png`}
                  alt={t(`chara.${c}`)}
                  className={cn(
                    "w-full aspect-square",
                    personalityBG(chara[c].t[0])
                  )}
                />
                <div className="my-auto py-0.5">{t(`chara.${c}`)}</div>
                <div className="absolute top-10 w-full">
                  <Badge
                    variant="outline"
                    className="bg-slate-900/70 font-thin py-px text-xs"
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
