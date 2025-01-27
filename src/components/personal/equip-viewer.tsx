import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, CheckCheck, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import Select from "@/components/common/combobox-select";
import EquipItemSlot from "@/components/parts/equip-item-slot";
import GoldSlot from "@/components/parts/gold-slot";
import SubtitleBar from "@/components/parts/subtitlebar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import equip from "@/data/equip";
import rankClassNames from "@/utils/rankClassNames";
import { getSpecificRangeResourceList } from "@/utils/equipCalc";

interface EquipViewerProps {
  charaName: string;
}

const MAX_RANK = 10;

const EquipViewer = ({ charaName }: EquipViewerProps) => {
  const { t } = useTranslation();
  const [rankStart, setRankStart] = useState<number>(1);
  const [rankStartEquipStatuses, setRankStartEquipStatuses] = useState<
    boolean[]
  >(Array(6).fill(false));
  const [rankEnd, setRankEnd] = useState<number>(1);
  const [rankEndEquipStatuses, setRankEndEquipStatuses] = useState<boolean[]>(
    Array(6).fill(true)
  );
  const calcResult = useMemo(
    () =>
      getSpecificRangeResourceList(
        charaName,
        { rank: rankStart, equip: rankStartEquipStatuses },
        { rank: rankEnd, equip: rankEndEquipStatuses }
      ),
    [
      charaName,
      rankEnd,
      rankEndEquipStatuses,
      rankStart,
      rankStartEquipStatuses,
    ]
  );
  return (
    <>
      <SubtitleBar>{t("ui.personal.requireRankEquips")}</SubtitleBar>
      <ScrollArea className="max-w-full whitespace-nowrap rounded-md mt-2 mb-4">
        <div className="flex w-max min-w-full space-x-2 p-2 justify-center items-stretch">
          {equip.c[charaName].map((equipset, i) => {
            const rank = i + 1;
            return (
              <div key={i} className="flex flex-col">
                <div
                  className={cn("text-lg flex-initial", rankClassNames[i][1])}
                >
                  {t("ui.equiprank.rankText", { 0: rank })}
                </div>
                <div
                  className={cn(
                    "grid grid-cols-2 p-2 w-48 flex-1 rounded",
                    rankClassNames[i][0]
                  )}
                >
                  {equipset.map((e, si) => {
                    const [, iPart, iNum] = e.split(".");
                    return (
                      <div key={si} className="flex flex-col items-center">
                        <EquipItemSlot equipCode={e} size={3} innerSize={60} />
                        <div className="text-sm w-full whitespace-break-spaces">
                          {t(`equip.equip.${iPart}.${iNum}`) ||
                            t("ui.equip.unknownEquip")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex flex-col md:flex-row gap-2 justify-stretch items-stretch">
        <div className="flex-auto md:flex-1">
          <SubtitleBar>{t("ui.personal.calcEquipRequirements")}</SubtitleBar>
          <div className="flex flex-row gap-2 items-center justify-between mt-2">
            <div className="flex-1">
              <Select
                value={rankStart}
                setValue={setRankStart}
                items={Array(MAX_RANK)
                  .fill(0)
                  .map((_, i) => ({
                    value: i + 1,
                    label: t("ui.equipviewer.rankText", { 0: i + 1 }),
                  }))}
              />
            </div>
            <ArrowRight className="w-5 h-5 flex-initial flex-shrink-0" />
            <div className="flex-1">
              <Select
                value={rankEnd}
                setValue={setRankEnd}
                items={Array(MAX_RANK)
                  .fill(0)
                  .map((_, i) => ({
                    value: i + 1,
                    label: t("ui.equipviewer.rankText", { 0: i + 1 }),
                  }))}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center justify-around p-2">
            <div className="flex flex-col gap-2">
              <div
                className={cn(
                  "grid grid-cols-2 p-2 gap-2 rounded",
                  rankClassNames[rankStart - 1][0]
                )}
              >
                {equip.c[charaName][rankStart - 1].map((e, si) => {
                  return (
                    <div
                      key={si}
                      className={
                        rankStartEquipStatuses[si] ? "" : "grayscale-[.9]"
                      }
                      onClick={() =>
                        setRankStartEquipStatuses((v) => {
                          v[si] = !v[si];
                          return [...v];
                        })
                      }
                    >
                      <EquipItemSlot
                        equipCode={e}
                        size={3}
                        innerSize={60}
                        slotOnly
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-row gap-1">
                <Button
                  variant="outline"
                  className="flex-1 bg-foreground/10 h-fit py-1.5"
                  onClick={() =>
                    setRankStartEquipStatuses(Array(6).fill(false))
                  }
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-foreground/10 h-fit py-1.5"
                  onClick={() => setRankStartEquipStatuses(Array(6).fill(true))}
                >
                  <CheckCheck className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div
                className={cn(
                  "grid grid-cols-2 p-2 gap-2 rounded",
                  rankClassNames[rankEnd - 1][0]
                )}
              >
                {equip.c[charaName][rankEnd - 1].map((e, si) => {
                  return (
                    <div
                      key={si}
                      className={
                        rankEndEquipStatuses[si] ? "" : "grayscale-[.9]"
                      }
                      onClick={() =>
                        setRankEndEquipStatuses((v) => {
                          v[si] = !v[si];
                          return [...v];
                        })
                      }
                    >
                      <EquipItemSlot
                        equipCode={e}
                        size={3}
                        innerSize={60}
                        slotOnly
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-row gap-1">
                <Button
                  variant="outline"
                  className="flex-1 bg-foreground/10 h-fit py-1.5"
                  onClick={() => setRankEndEquipStatuses(Array(6).fill(false))}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-foreground/10 h-fit py-1.5"
                  onClick={() => setRankEndEquipStatuses(Array(6).fill(true))}
                >
                  <CheckCheck className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-auto md:flex-1">
          <SubtitleBar>{t("ui.personal.calcEquipResult")}</SubtitleBar>
          {Object.keys(calcResult[0]).length > 0 ? (
            <div className="flex flex-row gap-1 flex-wrap justify-evenly mt-4">
              {Object.entries(calcResult[0])
                .sort(
                  ([a], [b]) =>
                    Math.floor(Number(a.split(".")[2]) / 100) -
                    Math.floor(Number(b.split(".")[2]) / 100)
                )
                .map(([e, i]) => {
                  return (
                    <EquipItemSlot
                      key={e}
                      equipCode={e}
                      amount={i}
                      size={3}
                      innerSize={60}
                    />
                  );
                })}
              <GoldSlot amount={calcResult[1]} size={3} innerSize={60} />
            </div>
          ) : (
            <div className="mt-4">{t("ui.personal.calcEquipWrongInput")}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default EquipViewer;
