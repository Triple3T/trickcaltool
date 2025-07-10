import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Select from "@/components/common/combobox-select";
import { Separator } from "@/components/ui/separator";
import GoldSlot from "@/components/parts/gold-slot";
import ItemSlot from "@/components/parts/item-slot";
import LazyInput from "@/components/common/lazy-input";
import level from "@/data/level";
import { Class } from "@/types/enums";

const { k: skill } = level;
const levelMaxLow = skill.l.length + 1;
const levelMaxHigh = skill.h.length + 1;
type SkillRequirementKeys = `${"l" | "m" | "h"}${1 | 2 | 3}` | "g";
type SkillRequirementProps = {
  [key in SkillRequirementKeys]: number;
};
const rarityInfo = {
  l: { s: "Gray", b: "#B0B0B0" },
  m: { s: "Blue" },
  h: { s: "Yellow" },
};
const itemNameInfo = {
  l: "Low",
  m: "Mid",
  h: "High",
};
const itemClassInfo = ["", "Dealer", "Tanker", "Supporter"];
const mergeObject = <T extends Record<string, number>>(obj1: T, obj2: T): T => {
  const keys = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])];
  return Object.fromEntries(
    keys.map((key) => [key, (obj1[key] || 0) + (obj2[key] || 0)])
  ) as T;
};
const calcSkill = (section: number[]) => {
  const lowStart = Math.min(section[0], levelMaxLow);
  const lowEnd = Math.min(section[1], levelMaxLow);
  const highStart = Math.min(section[2], levelMaxHigh);
  const highEnd = Math.min(section[3], levelMaxHigh);
  const classNum = section[4];
  const count = section[5];
  const lowSlice =
    lowStart < lowEnd ? skill.l.slice(lowStart - 1, lowEnd - 1) : [];
  const highSlice =
    highStart < highEnd ? skill.h.slice(highStart - 1, highEnd - 1) : [];
  const thisResult = [...lowSlice, ...highSlice].reduce(mergeObject, { g: 0 });
  return Object.fromEntries(
    Object.entries(thisResult).map(([key, val]) => {
      if (key === "g") return [key, val * count];
      else return [`${key}${classNum}`, val * count];
    })
  );
};

const inputClassName =
  "h-min px-2 py-1 bg-transparent text-right mx-1 rounded-none ring-0 border-x-0 border-t-0 border-b-2 focus-visible:border-b-greenicon focus-visible:ring-0 focus-visible:bg-greenicon/25 transition-colors";
const wrongInputClassName = "bg-red-500/25 border-b-red-500";

const SkillCalc = () => {
  const { t } = useTranslation();
  const [levelSections, setLevelSections] = useState<number[][]>([
    [1, 10, 1, 10, Class.Class_0001, 1],
  ]);
  const [requirement, setRequirement] = useState<
    Partial<SkillRequirementProps>
  >({});
  useEffect(() => {
    setRequirement(
      levelSections
        .map((levelSection) => calcSkill(levelSection))
        .reduce(mergeObject, { g: 0 })
    );
  }, [levelSections]);
  return (
    <Card className="p-4 max-w-80 mx-auto">
      <div className="text-xl">{t("ui.goodscalc.skill.levelSectionInput")}</div>
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
                <div className="flex items-baseline rounded p-1 w-full justify-center">
                  {t("ui.goodscalc.skill.admissionSkillShort")} Lv.
                  <LazyInput
                    value={`${levelSection[0]}`}
                    sanitize={(v) =>
                      `${parseInt(v.replaceAll(/\D/g, "") || "0") || 0}`
                    }
                    onValueChange={(a) =>
                      setLevelSections((s) => {
                        const newSections = s.map((a) => [...a]);
                        newSections[i][0] = Math.min(
                          Math.max(Number(a), 1),
                          levelMaxLow
                        );
                        return newSections;
                      })
                    }
                    placeholder={t("ui.goodscalc.skill.levelStart")}
                    className={cn(
                      inputClassName,
                      "w-12",
                      levelSection[0] > levelSection[1]
                        ? wrongInputClassName
                        : ""
                    )}
                  />
                  &rarr;
                  <LazyInput
                    value={`${levelSection[1]}`}
                    sanitize={(v) =>
                      `${parseInt(v.replaceAll(/\D/g, "") || "0") || 0}`
                    }
                    onValueChange={(b) =>
                      setLevelSections((s) => {
                        const newSections = s.map((a) => [...a]);
                        newSections[i][1] = Math.min(
                          Math.max(Number(b), 1),
                          levelMaxLow
                        );
                        return newSections;
                      })
                    }
                    placeholder={t("ui.goodscalc.skill.levelEnd")}
                    className={cn(
                      inputClassName,
                      "w-12",
                      levelSection[0] > levelSection[1]
                        ? wrongInputClassName
                        : ""
                    )}
                  />
                </div>
                <div className="flex items-baseline rounded p-1 w-full justify-center">
                  {t("ui.goodscalc.skill.graduationSkillShort")} Lv.
                  <LazyInput
                    value={`${levelSection[2]}`}
                    sanitize={(v) =>
                      `${parseInt(v.replaceAll(/\D/g, "") || "0") || 0}`
                    }
                    onValueChange={(c) =>
                      setLevelSections((s) => {
                        const newSections = s.map((a) => [...a]);
                        newSections[i][2] = Math.min(
                          Math.max(Number(c), 1),
                          levelMaxHigh
                        );
                        return newSections;
                      })
                    }
                    placeholder={t("ui.goodscalc.skill.levelStart")}
                    className={cn(
                      inputClassName,
                      "w-12",
                      levelSection[2] > levelSection[3]
                        ? wrongInputClassName
                        : ""
                    )}
                  />
                  &rarr;
                  <LazyInput
                    value={`${levelSection[3]}`}
                    sanitize={(v) =>
                      `${parseInt(v.replaceAll(/\D/g, "") || "0") || 0}`
                    }
                    onValueChange={(d) =>
                      setLevelSections((s) => {
                        const newSections = s.map((a) => [...a]);
                        newSections[i][3] = Math.min(
                          Math.max(Number(d), 1),
                          levelMaxHigh
                        );
                        return newSections;
                      })
                    }
                    placeholder={t("ui.goodscalc.skill.levelEnd")}
                    className={cn(
                      inputClassName,
                      "w-12",
                      levelSection[2] > levelSection[3]
                        ? wrongInputClassName
                        : ""
                    )}
                  />
                </div>
                <div className="flex items-baseline rounded p-1 w-full justify-center">
                  <Select
                    value={levelSection[4]}
                    setValue={(e) =>
                      setLevelSections((s) => {
                        const newSections = s.map((a) => [...a]);
                        newSections[i][4] = Math.min(e, levelMaxHigh);
                        return newSections;
                      })
                    }
                    items={Object.values(Class)
                      .filter((v) => typeof v === "string")
                      .map((v) => ({
                        value: Class[v as keyof typeof Class],
                        label: t(`class.${v}`),
                      }))}
                  />
                  <div className="flex-1" />x
                  <LazyInput
                    value={`${levelSection[5]}`}
                    sanitize={(v) =>
                      `${parseInt(v.replaceAll(/\D/g, "") || "0") || 0}`
                    }
                    onValueChange={(f) =>
                      setLevelSections((s) => {
                        const newSections = s.map((a) => [...a]);
                        newSections[i][5] = Math.min(
                          Math.max(Number(f), 0),
                          levelMaxHigh
                        );
                        return newSections;
                      })
                    }
                    placeholder={t("ui.goodscalc.mocaroon.charaCount")}
                    className={cn(inputClassName, "w-10")}
                  />
                  {t("ui.common.charaCountUnit")}
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
              setLevelSections((s) => [
                ...s,
                [1, 10, 1, 10, Class.Class_0001, 0],
              ]);
            }}
          >
            <Plus className="w-8 h-8 opacity-50" strokeWidth={4} />
          </Button>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="text-lg">{t("ui.goodscalc.skill.requiredTitle")}</div>
      <div className="flex flex-wrap justify-evenly my-4">
        {Object.entries(requirement).map(([key, val]) => {
          if (!val) return null;
          if (key === "g") return null;
          const [kind, cls] = key.split("") as [
            "l" | "m" | "h",
            "1" | "2" | "3"
          ];
          return (
            <ItemSlot
              key={key}
              rarityInfo={rarityInfo[kind]}
              item={`/icons/Item_Skill_${itemClassInfo[cls]}${itemNameInfo[kind]}`}
              fullItemPath
              size={4}
              amount={val}
            />
          );
        })}
        {requirement.g && requirement.g > 0 && (
          <GoldSlot size={4} amount={requirement.g} />
        )}
      </div>
      {/* <div className="text-xs opacity-75 break-keep">
          {requirement > 0
            ? t("ui.goodscalc.aside.requiredNotice")
            : t("ui.goodscalc.aside.inputNotice")}
        </div> */}
      {Object.values(requirement).every((v) => v === 0) && (
        <div className="text-xs opacity-75 break-keep">
          {t("ui.goodscalc.skill.inputNotice")}
        </div>
      )}
    </Card>
  );
};

export default SkillCalc;
