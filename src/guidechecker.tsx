import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import Select from "@/components/common/combobox-select";
import board from "@/data/board";
import chara from "@/data/chara";
import {
  BoardType,
  StatType,
} from "@/types/enums";
import type { UserDataOwnedCharaInfo } from "@/types/types";
import {
  useUserDataCharaInfo,
  useUserDataStatPercents,
  useUserDataUnowned,
} from "@/stores/useUserDataStore";
import { Badge } from "./components/ui/badge";
import { Check, X } from "lucide-react";

const GuideChecker = () => {
  const { t } = useTranslation();
  const [displayStat, setDisplayStat] = useState<StatType>(StatType.Hp);
  const userDataCharas = useUserDataCharaInfo();
  const userDataStatPercents = useUserDataStatPercents();
  const userDataUnowned = useUserDataUnowned();
  const targetBoardTypeList = useMemo(() => {
    return board.s
      .map((stats, boardType) => ({ boardType, stats }))
      .filter(({ stats }) => stats.includes(displayStat))
      .map(({ boardType }) => boardType) as BoardType[];
  }, [displayStat]);

  if (!userDataCharas || !userDataUnowned) return null;

  return (
    <div className="font-onemobile">
      <div className="text-xl">{t("ui.check.guide.index")}</div>
      <div className="text-sm break-keep opacity-50">
        {t("ui.check.guide.description")}
      </div>
      <div className="text-sm break-keep opacity-50 mb-4">
        {t("ui.check.guide.description2")}
      </div>
      <Card className="px-1 pt-4 pb-2 max-w-lg mx-auto">
        <div className="flex flex-row flex-wrap-reverse justify-between items-baseline gap-x-2 gap-y-4 px-2">
          <div className="bg-accent/75 rounded px-2 max-w-80 min-w-48 w-full">
            <div className="-mt-2.5 flex flex-row justify-between">
              <div>
                <img
                  src={`/icons/Icon_${StatType[displayStat]}.png`}
                  className="w-5 h-5 inline mr-1 mb-1"
                />
                <span className="text-shadow-glow">
                  {t(`stat.${StatType[displayStat]}`)}
                </span>
              </div>
              <div className="text-shadow-glow">
                {userDataStatPercents[StatType[displayStat]] || 0}%
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end items-baseline gap-1 flex-auto max-w-xl">
            <div className="max-w-56 min-w-36 flex-auto">
              <Select
                value={displayStat + 1}
                setValue={(value) => setDisplayStat(value - 1)}
                items={[
                  StatType.Hp,
                  StatType.AttackPhysic,
                  StatType.AttackMagic,
                  StatType.CriticalRate,
                  StatType.CriticalMult,
                  StatType.CriticalResist,
                  StatType.CriticalMultResist,
                  StatType.DefensePhysic,
                  StatType.DefenseMagic,
                ].map((stat) => ({
                  value: (stat + 1) as number,
                  label: t(`stat.${StatType[stat]}`),
                }))}
              />
            </div>
            <div className="min-w-max max-w-56 flex-auto">
              <Badge
                variant="outline"
                className="w-full h-10 text-sm font-normal rounded-md justify-center"
              >
                {t("ui.check.guide.sortByName")}
              </Badge>
            </div>
          </div>
        </div>
        <div className="bg-accent/50 mt-6 rounded-lg grid grid-cols-2 gap-0.5 p-0.5 auto-cols-auto auto-rows-auto">
          {Object.keys(chara)
            .filter(
              (charaName) =>
                targetBoardTypeList.some((boardType) =>
                  board.c[charaName].b
                    .flatMap((bt) => bt.toString())
                    .join("")
                    .includes(boardType.toString())
                ) && userDataUnowned?.o.includes(charaName)
            )
            .sort((a, b) => t(`chara.${a}`).localeCompare(t(`chara.${b}`)))
            .map((charaName) => {
              const charaBoard = board.c[charaName].b;
              const userCharaBoardInfo = (
                userDataCharas[charaName] as UserDataOwnedCharaInfo
              ).board;
              const nthBoardTargetExists = charaBoard.map((bt) =>
                targetBoardTypeList.some((target) =>
                  bt
                    .map((b) => b.toString())
                    .join()
                    .includes(target.toString())
                )
              );
              const nthBoardTargetProgress = charaBoard.map((nthboard, nth) => {
                if (!nthBoardTargetExists[nth])
                  return {
                    totalBoardCount: 0,
                    checkedCount: 0,
                    totalStat: 0,
                    gainedStat: 0,
                  };
                let totalBoardCount = 0;
                let totalStat = 0;
                let checkedCount = 0;
                let gainedStat = 0;
                nthboard.map((boardLockGroup, ldx) => {
                  boardLockGroup
                    .toString()
                    .split("")
                    .forEach((c, bdx) => {
                      const currentBoardType = parseInt(c);
                      if (!targetBoardTypeList.includes(currentBoardType))
                        return;
                      const currentBoardStatAmount =
                        board.b[currentBoardType][
                          board.s[currentBoardType].indexOf(displayStat)
                        ][nth];
                      totalBoardCount += 1;
                      totalStat += currentBoardStatAmount;
                      if (userCharaBoardInfo[nth][ldx] & (1 << bdx)) {
                        checkedCount += 1;
                        gainedStat += currentBoardStatAmount;
                      }
                    });
                });
                return { totalBoardCount, checkedCount, totalStat, gainedStat };
              });

              return (
                <Card key={charaName} className="flex flex-col overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex flex-row flex-auto">
                      <div
                        style={{
                          backgroundImage: `url(/charas/${charaName}.png)`,
                          backgroundSize: "175%",
                          backgroundPosition: "50% 30%",
                        }}
                        className="w-8 h-8"
                      />
                      <div className="text-sm overflow-hidden overflow-ellipsis flex flex-row items-center ml-px">
                        {t(`chara.${charaName}`)}
                      </div>
                    </div>
                    <div className="flex flex-row flex-auto justify-around p-1">
                      {Array(3)
                        .fill(0)
                        .map((_, i) => {
                          const nthBoard = i + 1;
                          const nthBoardProgress = nthBoardTargetProgress[i];
                          if (nthBoardProgress.totalBoardCount === 0)
                            return (
                              <div
                                key={i}
                                className="w-7 h-7 flex justify-center items-center rounded-full bg-foreground/90 text-background"
                              >
                                <X className="w-5 h-5" strokeWidth={3} />
                              </div>
                            );
                          if (
                            nthBoardProgress.totalBoardCount > 0 &&
                            nthBoardProgress.totalBoardCount ===
                              nthBoardProgress.checkedCount
                          )
                            return (
                              <div
                                key={i}
                                className="w-7 h-7 flex justify-center items-center rounded-full bg-foreground/90 text-green-400 dark:text-emerald-600"
                              >
                                <Check className="w-5 h-5" strokeWidth={3} />
                              </div>
                            );
                          return (
                            <div
                              key={i}
                              className="w-7 h-7 flex justify-center items-center rounded-full bg-accent/25"
                            >
                              {nthBoard}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="p-px bg-accent/25 flex flex-row flex-wrap items-baseline justify-between flex-1">
                    <div className="text-xs text-left flex-auto">
                      {t("ui.check.guide.remainStatAmountBefore")}
                      {t(`stat.${StatType[displayStat]}`)}
                      {t("ui.check.guide.remainStatAmountAfter")}
                    </div>
                    <div className="text-blue-700 dark:text-blue-300 text-sm text-right flex-auto">
                      +
                      {((x: { totalStat: number; gainedStat: number }) =>
                        x.totalStat - x.gainedStat)(
                        nthBoardTargetProgress.reduce(
                          (a, b) => ({
                            totalStat: a.totalStat + b.totalStat,
                            gainedStat: a.gainedStat + b.gainedStat,
                          }),
                          { totalStat: 0, gainedStat: 0 }
                        )
                      )}
                      %
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      </Card>
    </div>
  );
};

export default GuideChecker;
