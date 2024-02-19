import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatType } from "@/types/enums";
import SubtitleBar from "./subtitlebar";
import { ScrollArea } from "../ui/scroll-area";

interface RankInfoDialogProps {
  rank: number;
  chara: string;
  rankStats: number[][][];
  sameRankBonus?: string[];
}

const RankInfoDialog = ({
  rank,
  chara,
  rankStats,
  sameRankBonus,
}: RankInfoDialogProps) => {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger>
        <Info className="h-4 w-4 rounded-full" fill="#a0a0a0" />
      </DialogTrigger>
      <DialogContent className="font-onemobile">
        <DialogHeader>
          <DialogTitle>
            <div className="flex gap-2 font-normal">
              <img src={`/charas/${chara}.png`} className="w-12 h-12" />
              <div className="flex-initial flex-shrink-0 flex flex-col items-start">
                <div className="text-sm">
                  <span className="align-middle">
                    {t("ui.equiprank.allRankBonusesTitle")}
                  </span>
                </div>
                <div className="text-2xl">{t(`chara.${chara}`)}</div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <SubtitleBar>{t("ui.equiprank.allRankBonusesTitle")}</SubtitleBar>
            <ScrollArea className="h-72 -mx-1 sm:mx-0 md:mx-1 px-1">
              <div className="flex flex-col gap-1.5 px-2">
                {rankStats.map((rankStatSet, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-row items-stretch rounded-lg overflow-hidden ring-1 ring-offset-0 ring-[#cfe992] dark:ring-[#519d1f]"
                    >
                      <div className="flex flex-col items-center justify-center w-28 bg-[#cfe992] dark:bg-[#519d1f] relative">
                        <div className="text-lg">
                          {t("ui.equiprank.rankText", { 0: index + 2 })}
                        </div>
                        {rank > index + 1 && (
                          <img
                          src="/icons/Stage_RewardChack.png"
                          className="w-10 inline-block align-middle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 pl-3 pr-1.5 py-1 bg-[#f3fbe3] dark:bg-[#cfe992]">
                        {rankStatSet.map(([stat, value], i) => {
                          return (
                            <div
                              key={i}
                              className="flex flex-row gap-2 rounded-xl bg-[#f9fdef] dark:bg-[#36a52d] px-2"
                            >
                              <div className="flex-auto text-left">
                                <img
                                  src={`/icons/Icon_${StatType[stat]}.png`}
                                  className="w-6 h-6 -my-1 -ml-4 mr-1 inline-block align-middle"
                                />
                                {t(`stat.${StatType[stat]}`)}
                              </div>
                              <div className="flex-auto text-right">
                                {value}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          <div className="flex flex-col gap-2">
            <SubtitleBar>{t("ui.equiprank.hasSameRankBonusTitle")}</SubtitleBar>
            {sameRankBonus && sameRankBonus.length > 0 ? (
              <ScrollArea className="h-36 -mx-1 sm:mx-0 md:mx-1 px-1">
                <div className="grid grid-cols-[repeat(auto-fill,_minmax(3rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] gap-1 px-2">
                  {sameRankBonus.map((chara) => {
                    return (
                      <div
                        key={chara}
                        className="min-w-12 sm:min-w-14 aspect-square"
                      >
                        <img src={`/charas/${chara}.png`} className="w-full" />
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center">
                {t("ui.equiprank.noSameRankBonus")}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RankInfoDialog;
