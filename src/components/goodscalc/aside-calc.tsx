import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Select from "@/components/common/combobox-select";
import { Separator } from "@/components/ui/separator";
import ItemSlot from "@/components/parts/item-slot";
import LazyInput from "@/components/common/lazy-input";
import level from "@/data/level";
import { Race } from "@/types/enums";

const { a: aside } = level;
const levelMax = aside.findIndex((v) => v === -1) + 1 || aside.length + 1;
const calcAside = (start: number, end: number) => {
  if (start >= end) return 0;
  return aside.slice(start - 1, end - 1).reduce((a, c) => a + c, 0);
};

const inputClassName =
  "h-min px-2 py-1 bg-transparent text-right mx-1 rounded-none ring-0 border-x-0 border-t-0 border-b-2 focus-visible:border-b-greenicon focus-visible:ring-0 focus-visible:bg-greenicon/25 transition-colors";
const wrongInputClassName = "bg-red-500/25 border-b-red-500";

const AsideCalc = () => {
  const { t } = useTranslation();
  const [levelSection, setLevelSection] = useState<number[]>([1, 30]);
  const [requirement, setRequirement] = useState<number>(0);
  const [race, setRace] = useState<Race>(Race.Fairy);
  useEffect(() => {
    setRequirement(calcAside(levelSection[0], levelSection[1]));
  }, [levelSection]);
  return (
    <Card className="p-4 max-w-80 mx-auto">
      <div className="text-xl">{t("ui.goodscalc.aside.levelSectionInput")}</div>
      <div className="text-sm opacity-75">
        {/* <p>{t("ui.goodscalc.aside.levelSectionInputDesc")}</p>
          <p>{t("ui.goodscalc.aside.levelSectionInputFormatDesc")}</p> */}
      </div>
      <div className="px-4 mt-4">
        <div className="flex items-baseline rounded p-1 w-full">
          Lv.
          <LazyInput
            value={`${levelSection[0]}`}
            onValueChange={(a) =>
              setLevelSection(([, b]) => [
                Math.min(Math.max(Number(a), 1), levelMax),
                b,
              ])
            }
            placeholder="시작 레벨"
            className={cn(
              inputClassName,
              "w-12",
              levelSection[0] < levelSection[1] ? "" : wrongInputClassName
            )}
          />
          →
          <LazyInput
            value={`${levelSection[1]}`}
            onValueChange={(b) =>
              setLevelSection(([a]) => [
                a,
                Math.min(Math.max(Number(b), 1), levelMax),
              ])
            }
            placeholder="종료 레벨"
            className={cn(
              inputClassName,
              "w-12",
              levelSection[0] < levelSection[1] ? "" : wrongInputClassName
            )}
          />
          <div className="flex-1" />
          <Select
            value={race + 1}
            setValue={(v) => setRace(v - 1)}
            items={Object.values(Race)
              .filter((v) => typeof v === "string")
              .map((v) => ({
                value: Race[v as keyof typeof Race] + 1,
                label: t(`race.${v}`),
              }))}
          />
        </div>
      </div>
      <Separator className="my-4" />
      <div className="text-lg">{t("ui.goodscalc.aside.requiredTitle")}</div>
      <div className="flex justify-evenly px-4 my-4">
        {requirement > 0 && (
          <ItemSlot
            rarityInfo={{ s: "Gray", b: "#B0B0B0" }}
            item={`/commonicons/Item_TribeHeart_${[6, 3, 1, 2, 5, 4, 7][race]}`}
            fullItemPath
            amount={requirement}
          />
        )}
      </div>
      <div className="text-xs opacity-75 break-keep">
        {requirement > 0
          ? t("ui.goodscalc.aside.requiredNotice")
          : t("ui.goodscalc.aside.inputNotice")}
      </div>
      {requirement > 0 && (
        <div className="text-xs opacity-75 break-keep">
          {t("ui.goodscalc.aside.otherRaceHeartNotice")}
        </div>
      )}
    </Card>
  );
};

export default AsideCalc;
