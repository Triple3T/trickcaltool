import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ItemSlot from "@/components/parts/item-slot";
import LazyInput from "@/components/common/lazy-input";
import level from "@/data/level";

const { m: mocaroon, s: sucaroon } = level;
const levelMax = sucaroon.findIndex((v) => v === -1) + 100;
const calcMocaroon = (start: number, end: number, count: number) => {
  if (start >= end) return 0;
  return mocaroon.slice(start - 1, end - 1).reduce((a, c) => a + c, 0) * count;
};
const calcSucaroon = (start: number, end: number, count: number) => {
  if (start >= end) return 0;
  return (
    sucaroon.slice(start - 100, end - 100).reduce((a, c) => a + c, 0) * count
  );
};
const levelSectionCalc = (levelSection: number[]) => {
  const mocaroonSectionStart = Math.min(levelSection[0], 100);
  const mocaroonSectionEnd = Math.min(levelSection[1], 100);
  const sucaroonSectionStart = Math.max(levelSection[0], 100);
  const sucaroonSectionEnd = Math.max(levelSection[1], 100);
  const count = levelSection[2];
  return [
    calcMocaroon(mocaroonSectionStart, mocaroonSectionEnd, count),
    calcSucaroon(sucaroonSectionStart, sucaroonSectionEnd, count),
  ];
};

const inputClassName =
  "h-min px-2 py-1 bg-transparent text-right mx-1 rounded-none ring-0 border-x-0 border-t-0 border-b-2 focus-visible:border-b-greenicon focus-visible:ring-0 focus-visible:bg-greenicon/25 transition-colors";
const wrongInputClassName = "bg-red-500/25 border-b-red-500";

const MocaroonCalc = () => {
  const { t } = useTranslation();
  const [levelSections, setLevelSections] = useState<number[][]>([[1, 100, 0]]);
  const [requirements, setRequirements] = useState<number[]>([0, 0]);
  useEffect(() => {
    setRequirements(
      levelSections.reduce(
        (a, c) => {
          const [mocaroon, sucaroon] = levelSectionCalc(c);
          return [a[0] + mocaroon, a[1] + sucaroon];
        },
        [0, 0]
      )
    );
  }, [levelSections]);
  return (
    <>
      <Card className="p-4 max-w-80 mx-auto">
        <div className="text-xl">
          {t("ui.goodscalc.mocaroon.levelSectionInput")}
        </div>
        <div className="text-sm opacity-75">
          <p>{t("ui.goodscalc.mocaroon.levelSectionInputDesc")}</p>
          <p>{t("ui.goodscalc.mocaroon.levelSectionInputFormatDesc")}</p>
        </div>
        <div className="px-4 mt-4">
          {levelSections.map((levelSection, i) => {
            return (
              <div
                key={i}
                className="mb-4 pb-4 break-keep flex justify-between items-center"
              >
                <div className="flex items-baseline rounded py-1 -my-1 px-1 ">
                  Lv.
                  <LazyInput
                    value={`${levelSection[0]}`}
                    onValueChange={(v) =>
                      setLevelSections((s) => {
                        const newSections = s.map((v) => [...v]);
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
                    onValueChange={(v) =>
                      setLevelSections((s) => {
                        const newSections = s.map((v) => [...v]);
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
                  &nbsp;x
                  <LazyInput
                    value={`${levelSection[2]}`}
                    onValueChange={(v) =>
                      setLevelSections((s) => {
                        const newSections = s.map((v) => [...v]);
                        newSections[i][2] = Math.max(Number(v), 0);
                        return newSections;
                      })
                    }
                    placeholder="인원 수"
                    className={cn(inputClassName, "w-10")}
                  />
                  명
                </div>
                {i !== 0 && (
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
                setLevelSections((s) => [...s, [1, 100, 0]]);
              }}
            >
              <Plus className="w-8 h-8 opacity-50" strokeWidth={4} />
            </Button>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="text-lg">
          {t("ui.goodscalc.mocaroon.requiredTitle")}
        </div>
        <div className="flex justify-evenly px-4 my-4">
          {requirements[0] > 0 && (
            <ItemSlot
              rarityInfo={{ s: "Orange" }}
              item="/icons/CurrencyIcon_0007"
              fullItemPath
              amount={requirements[0]}
            />
          )}
          {requirements[1] > 0 && (
            <ItemSlot
              rarityInfo={{ s: "Orange" }}
              item="/icons/CurrencyIcon_0041"
              fullItemPath
              amount={requirements[1]}
            />
          )}
        </div>
        <div className="text-xs opacity-75 break-keep">
          {requirements.some((v) => v > 0)
            ? t("ui.goodscalc.mocaroon.requiredNotice")
            : t("ui.goodscalc.mocaroon.inputNotice")}
        </div>
      </Card>
    </>
  );
};

export default MocaroonCalc;
