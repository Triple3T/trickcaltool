import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Select from "@/components/common/combobox-select";
import { Separator } from "@/components/ui/separator";
import ItemSlot from "@/components/parts/item-slot";
import LazyInput from "@/components/common/lazy-input";
import level from "@/data/level";
import { Race } from "@/types/enums";

const { a: aside } = level;
const levelMax = aside.findIndex((v) => v === -1) + 1 || aside.length + 1;
const calcAside = (valueEntries: number[][]) => {
  return valueEntries.reduce((acc, values) => {
    const [start, end, count, race] = values;
    if (count < 1) return acc;
    if (start >= end) return acc;
    acc[race] =
      (acc[race] || 0) +
      aside.slice(start - 1, end - 1).reduce((a, c) => a + c, 0) * count;
    return acc;
  }, {} as Record<string, number>);
};

const inputClassName =
  "h-min px-2 py-1 bg-transparent text-right mx-1 rounded-none ring-0 border-x-0 border-t-0 border-b-2 focus-visible:border-b-greenicon focus-visible:ring-0 focus-visible:bg-greenicon/25 transition-colors";
const wrongInputClassName = "bg-red-500/25 border-b-red-500";

const AsideCalc = () => {
  const { t } = useTranslation();
  const [levelSections, setLevelSections] = useState<number[][]>([
    [1, 30, 1, 2],
  ]);
  const [requirement, setRequirement] = useState<Record<string, number>>({});
  useEffect(() => {
    setRequirement(calcAside(levelSections));
  }, [levelSections]);
  return (
    <Card className="p-4 max-w-80 mx-auto">
      <div className="text-xl">{t("ui.goodscalc.aside.levelSectionInput")}</div>
      <div className="text-sm opacity-75">
        {/* <p>{t("ui.goodscalc.aside.levelSectionInputDesc")}</p>
          <p>{t("ui.goodscalc.aside.levelSectionInputFormatDesc")}</p> */}
      </div>
      <div className="mt-4">
        {levelSections.map((levelSection, i) => {
          return (
            <div
              key={i}
              className="mb-4 pb-4 break-keep flex justify-around items-center"
            >
              <div className="flex flex-col">
                <div className="flex flex-row items-baseline rounded p-1 w-full">
                  Lv.
                  <LazyInput
                    value={`${levelSection[0]}`}
                    sanitize={(v) =>
                      `${parseInt(v.replaceAll(/\D/g, "") || "0") || 0}`
                    }
                    onValueChange={(v) =>
                      setLevelSections((s) => {
                        const newSections = s.map((a) => [...a]);
                        newSections[i][0] = Math.min(
                          Math.max(Number(v), 1),
                          levelMax
                        );
                        return newSections;
                      })
                    }
                    placeholder="시작 레벨"
                    className={cn(
                      inputClassName,
                      "w-12",
                      levelSection[0] < levelSection[1]
                        ? ""
                        : wrongInputClassName
                    )}
                  />
                  →
                  <LazyInput
                    value={`${levelSection[1]}`}
                    sanitize={(v) =>
                      `${parseInt(v.replaceAll(/\D/g, "") || "0") || 0}`
                    }
                    onValueChange={(v) =>
                      setLevelSections((s) => {
                        const newSections = s.map((a) => [...a]);
                        newSections[i][1] = Math.min(
                          Math.max(Number(v), 1),
                          levelMax
                        );
                        return newSections;
                      })
                    }
                    placeholder="종료 레벨"
                    className={cn(
                      inputClassName,
                      "w-12",
                      levelSection[0] < levelSection[1]
                        ? ""
                        : wrongInputClassName
                    )}
                  />
                </div>
                <div className="flex flex-row items-baseline rounded p-1 w-full gap-1">
                  x
                  <LazyInput
                    value={`${levelSection[2]}`}
                    sanitize={(v) =>
                      `${parseInt(v.replaceAll(/\D/g, "") || "0") || 0}`
                    }
                    onValueChange={(v) =>
                      setLevelSections((s) => {
                        const newSections = s.map((a) => [...a]);
                        newSections[i][2] = Math.max(Number(v), 0);
                        return newSections;
                      })
                    }
                    placeholder="인원 수"
                    className={cn(inputClassName, "w-10")}
                  />
                  명
                  <div className="flex-1" />
                  <Select
                    value={levelSection[3] + 1}
                    setValue={(v) =>
                      setLevelSections((s) => {
                        const newSections = s.map((a) => [...a]);
                        newSections[i][3] = v - 1;
                        return newSections;
                      })
                    }
                    items={Object.values(Race)
                      .filter((v) => typeof v === "string")
                      .map((v) => ({
                        value: Race[v as keyof typeof Race] + 1,
                        label: t(`race.${v}`),
                      }))}
                  />
                </div>
              </div>
              {levelSections.length > 1 && (
                <X
                  className="w-4 h-4 inline cursor-pointer opacity-50"
                  onClick={() =>
                    setLevelSections((s) => s.filter((_, j) => j !== i))
                  }
                />
              )}
            </div>
          );
        })}
        <div className="mb-0 pb-0">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              setLevelSections((s) => [...s, [1, 30, 0, 2]]);
            }}
          >
            <Plus className="w-8 h-8 opacity-50" strokeWidth={4} />
          </Button>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="text-lg">{t("ui.goodscalc.aside.requiredTitle")}</div>
      <div className="flex flex-wrap justify-evenly px-4 my-4 gap-2">
        {Object.keys(requirement).length > 0 &&
          Object.entries(requirement).map(([raceNumStr, req]) => {
            const race = Number(raceNumStr);
            return (
              <ItemSlot
                key={race}
                rarityInfo={{ s: "Gray", b: "#B0B0B0" }}
                item={`/commonicons/Item_TribeHeart_${
                  [6, 3, 1, 2, 5, 4, 7][race]
                }`}
                fullItemPath
                amount={Math.ceil(req / 2)}
              />
            );
          })}
      </div>
      <div className="text-xs opacity-75 break-keep">
        {Object.keys(requirement).length > 0
          ? t("ui.goodscalc.aside.requiredNotice")
          : t("ui.goodscalc.aside.inputNotice")}
      </div>
      {Object.keys(requirement).length > 0 && (
        <div className="text-xs opacity-75 break-keep">
          {t("ui.goodscalc.aside.otherRaceHeartNotice")}
        </div>
      )}
    </Card>
  );
};

export default AsideCalc;
