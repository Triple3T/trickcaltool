import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
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
interface skillRequirementProps {
  l: number;
  m: number;
  h: number;
  g: number;
}
const calcSkill = (section: number[]) => {
  const lowStart = Math.min(section[0], levelMaxLow);
  const lowEnd = Math.min(section[1], levelMaxLow);
  const highStart = Math.min(section[2], levelMaxHigh);
  const highEnd = Math.min(section[3], levelMaxHigh);
  const lowSlice =
    lowStart < lowEnd ? skill.l.slice(lowStart - 1, lowEnd - 1) : [];
  const highSlice =
    highStart < highEnd ? skill.h.slice(highStart - 1, highEnd - 1) : [];
  return [...lowSlice, ...highSlice].reduce(
    (a, c) => ({ l: a.l + c.l, m: a.m + c.m, h: a.h + c.h, g: a.g + c.g }),
    { l: 0, m: 0, h: 0, g: 0 }
  );
};

const inputClassName =
  "h-min px-2 py-1 bg-transparent text-right mx-1 rounded-none ring-0 border-x-0 border-t-0 border-b-2 focus-visible:border-b-greenicon focus-visible:ring-0 focus-visible:bg-greenicon/25 transition-colors";
const wrongInputClassName = "bg-red-500/25 border-b-red-500";

const SkillCalc = () => {
  const { t } = useTranslation();
  const [levelSection, setLevelSection] = useState<number[]>([1, 10, 1, 10]);
  const [requirement, setRequirement] = useState<skillRequirementProps>({
    l: 0,
    m: 0,
    h: 0,
    g: 0,
  });
  const [cls, setCls] = useState<Class>(Class.Class_0001);
  useEffect(() => {
    setRequirement(calcSkill(levelSection));
  }, [levelSection]);
  return (
    <Card className="p-4 max-w-80 mx-auto">
      <div className="text-xl">{t("ui.goodscalc.skill.levelSectionInput")}</div>
      <div className="text-sm opacity-75">
        {/* <p>{t("ui.goodscalc.aside.levelSectionInputDesc")}</p>
          <p>{t("ui.goodscalc.aside.levelSectionInputFormatDesc")}</p> */}
      </div>
      <div className="px-4 mt-4">
        <div className="flex items-baseline rounded p-1 w-full justify-center">
          저학년 Lv.
          <LazyInput
            value={`${levelSection[0]}`}
            onValueChange={(a) =>
              setLevelSection(([, b, c, d]) => [
                Math.min(Math.max(Number(a), 1), levelMaxLow),
                b,
                c,
                d,
              ])
            }
            placeholder="시작 레벨"
            className={cn(
              inputClassName,
              "w-12",
              levelSection[0] > levelSection[1] ? wrongInputClassName : ""
            )}
          />
          →
          <LazyInput
            value={`${levelSection[1]}`}
            onValueChange={(b) =>
              setLevelSection(([a, , c, d]) => [
                a,
                Math.min(Math.max(Number(b), 1), levelMaxLow),
                c,
                d,
              ])
            }
            placeholder="종료 레벨"
            className={cn(
              inputClassName,
              "w-12",
              levelSection[0] > levelSection[1] ? wrongInputClassName : ""
            )}
          />
        </div>
      </div>
      <div className="px-4 mt-4">
        <div className="flex items-baseline rounded p-1 w-full justify-center">
          고학년 Lv.
          <LazyInput
            value={`${levelSection[2]}`}
            onValueChange={(c) =>
              setLevelSection(([a, b, , d]) => [
                a,
                b,
                Math.min(Math.max(Number(c), 1), levelMaxHigh),
                d,
              ])
            }
            placeholder="시작 레벨"
            className={cn(
              inputClassName,
              "w-12",
              levelSection[2] > levelSection[3] ? wrongInputClassName : ""
            )}
          />
          →
          <LazyInput
            value={`${levelSection[3]}`}
            onValueChange={(d) =>
              setLevelSection(([a, b, c]) => [
                a,
                b,
                c,
                Math.min(Math.max(Number(d), 1), levelMaxHigh),
              ])
            }
            placeholder="종료 레벨"
            className={cn(
              inputClassName,
              "w-12",
              levelSection[2] > levelSection[3] ? wrongInputClassName : ""
            )}
          />
        </div>
      </div>
      <div className="px-4 mt-4">
        <Select
          value={cls}
          setValue={setCls}
          items={Object.values(Class)
            .filter((v) => typeof v === "string")
            .map((v) => ({
              value: Class[v as keyof typeof Class],
              label: t(`class.${v}`),
            }))}
        />
      </div>
      <Separator className="my-4" />
      <div className="text-lg">{t("ui.goodscalc.skill.requiredTitle")}</div>
      <div className="flex flex-wrap justify-evenly my-4">
        {requirement.l > 0 && (
          <ItemSlot
            rarityInfo={{ s: "Gray", b: "#B0B0B0" }}
            item={`/icons/Item_Skill_${
              ["Dealer", "Tanker", "Supporter"][cls - 1]
            }Low`}
            fullItemPath
            size={4}
            amount={requirement.l}
          />
        )}
        {requirement.m > 0 && (
          <ItemSlot
            rarityInfo={{ s: "Blue" }}
            item={`/icons/Item_Skill_${
              ["Dealer", "Tanker", "Supporter"][cls - 1]
            }Mid`}
            fullItemPath
            size={4}
            amount={requirement.m}
          />
        )}
        {requirement.h > 0 && (
          <ItemSlot
            rarityInfo={{ s: "Yellow" }}
            item={`/icons/Item_Skill_${
              ["Dealer", "Tanker", "Supporter"][cls - 1]
            }High`}
            fullItemPath
            size={4}
            amount={requirement.h}
          />
        )}
        {requirement.g > 0 && <GoldSlot size={4} amount={requirement.g} />}
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
