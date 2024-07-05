import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsRight, Dot, Pencil, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import LazyInput from "@/components/common/lazy-input";
import SubtitleBar from "./subtitlebar";
import {
  Attack,
  Class,
  Personality,
  Position,
  Race,
  StatType,
} from "@/types/enums";
import rankClassNames from "@/utils/rankClassNames";

export interface RankInfoDialogProps {
  rank: number;
  chara: string;
  charaTypes: string;
  rankStats: number[][][];
  sameRankBonus?: string[];
  maxRank: number;
  changeRank?: (chara: string, rank: number) => void;
  opened: boolean;
  onOpenChange: (open: boolean) => void;
  skin: number;
}

const RankInfoDialog = ({
  rank,
  chara,
  charaTypes,
  rankStats,
  sameRankBonus,
  maxRank,
  changeRank,
  opened,
  onOpenChange,
  skin,
}: RankInfoDialogProps) => {
  const { t } = useTranslation();
  const [currentRank, setCurrentRank] = useState(rank);
  const [rankSettingOpened, setRankSettingOpened] = useState(false);
  const [rankToBeChanged, setRankToBeChanged] = useState(rank);
  useEffect(() => {
    setCurrentRank(rank);
    setRankToBeChanged(rank);
  }, [rank, chara]);
  return (
    <Dialog
      open={opened}
      onOpenChange={(o) => {
        if (!o) setRankSettingOpened(false);
        setRankToBeChanged(currentRank);
        onOpenChange(o);
      }}
    >
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col gap-1 font-normal">
              <div className="text-sm text-left">
                <span className="align-middle">
                  {t("ui.equiprank.allRankBonusesTitle")}
                </span>
                <Dot className="inline-block w-4 h-4 mx-px align-middle" />
                <span className="align-middle mr-2">
                  {t("ui.equiprank.rankText", {
                    0: `${currentRank}`,
                  })}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="align-middle w-6 h-6 -m-1 p-1"
                  onClick={
                    changeRank
                      ? () => setRankSettingOpened((v) => !v)
                      : undefined
                  }
                >
                  <Pencil />
                </Button>
              </div>
              {changeRank && (
                <Accordion
                  type="multiple"
                  value={rankSettingOpened ? ["open"] : []}
                >
                  <AccordionItem value="open" className="border-none">
                    <AccordionContent>
                      <div className="flex items-center">
                        <div className="flex-1 text-lg text-center">
                          <span
                            className={[
                              rankClassNames[currentRank - 1][1],
                              "inline-block align-middle",
                            ].join(" ")}
                          >
                            {t("ui.equiprank.rankText", {
                              0: `${currentRank}`,
                            })}
                          </span>
                          <ChevronsRight className="inline-block mx-1 w-5 h-5 align-middle" />
                          <span
                            className={[
                              rankClassNames[rankToBeChanged - 1][1],
                              "inline-block align-middle",
                            ].join(" ")}
                          >
                            {t("ui.equiprank.rankText", {
                              0: `${rankToBeChanged}`,
                            })}
                          </span>
                        </div>
                        <div className="flex-initial flex flex-row gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="w-6 h-6"
                            onClick={() => {
                              setRankToBeChanged(currentRank);
                              setRankSettingOpened(false);
                            }}
                          >
                            <Undo2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="default"
                            className="w-6 h-6"
                            onClick={() => {
                              changeRank(chara, rankToBeChanged);
                              setCurrentRank(rankToBeChanged);
                              setRankSettingOpened(false);
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-row gap-2 pl-2 pr-1 py-1 mt-0.5 -mb-2">
                        <Slider
                          value={[rankToBeChanged]}
                          min={1}
                          max={maxRank}
                          onValueChange={(v) =>
                            setRankToBeChanged(
                              Math.max(Math.min(v[0], maxRank), 1)
                            )
                          }
                          className="w-full"
                          tabIndex={-1}
                        />
                        <LazyInput
                          type="text"
                          className={cn(
                            "w-8 p-1.5 text-right h-full",
                            rankToBeChanged > maxRank || rankToBeChanged < 1
                              ? "ring-2 ring-red-400 dark:ring-red-600 bg-red-200 dark:bg-red-900"
                              : ""
                          )}
                          pattern="[0-9]{1,2}"
                          value={`${Math.max(
                            Math.min(rankToBeChanged, maxRank),
                            1
                          )}`}
                          onValueChange={(v) =>
                            setRankToBeChanged(
                              Math.max(Math.min(Number(v), maxRank), 1)
                            )
                          }
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
              <div className="flex">
                <img
                  src={
                    skin
                      ? `/charas/${chara}Skin${skin}.png`
                      : `/charas/${chara}.png`
                  }
                  className="w-14 h-14"
                />
                <div className="flex-initial flex-shrink-0 flex flex-col items-start gap-0.5 p-0.5">
                  <div className="flex flex-row gap-px">
                    <img
                      src={`/icons/Common_UnitPersonality_${
                        Personality[Number(charaTypes[0])]
                      }.png`}
                      className="w-5 h-5 inline-block align-middle"
                    />
                    <img
                      src={`/icons/Common_UnitAttack${
                        Attack[Number(charaTypes[2])]
                      }.png`}
                      className="w-5 h-5 inline-block align-middle"
                    />
                    <img
                      src={`/icons/Common_Position${
                        Position[Number(charaTypes[3])]
                      }.png`}
                      className="w-5 h-5 inline-block align-middle"
                    />
                    <img
                      src={`/icons/Common_Unit${
                        Class[Number(charaTypes[4])]
                      }.png`}
                      className="w-5 h-5 inline-block align-middle"
                    />
                    <img
                      src={`/icons/Common_UnitRace_${
                        Race[Number(charaTypes[5])]
                      }.png`}
                      className="w-5 h-5 inline-block align-middle"
                    />
                  </div>
                  <div className="text-2xl">{t(`chara.${chara}`)}</div>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <SubtitleBar>{t("ui.equiprank.allRankBonusesTitle")}</SubtitleBar>
            <ScrollArea
              className={cn(
                rankSettingOpened ? "h-52" : "h-72",
                "-mx-1 sm:mx-0 md:mx-1 px-1"
              )}
              style={{ transition: "ease-out 0.2s" }}
            >
              <div className="flex flex-col gap-1.5 px-2 my-1">
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
                        {currentRank > index + 1 && (
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
              <ScrollArea className="h-24 -mx-1 sm:mx-0 md:mx-1 px-1">
                <div className="grid grid-cols-[repeat(auto-fill,_minmax(3rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] gap-1 px-2 my-1">
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
