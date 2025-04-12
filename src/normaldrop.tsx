import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronsUpDown, Check, X, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandItem,
  Command,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import ItemSlot from "@/components/parts/item-slot";
import Loading from "@/components/common/loading";
import icSearch from "@/lib/initialConsonantSearch";
import rankClassNames from "@/utils/rankClassNames";

import equip from "@/data/equip";
import stageData from "@/data/stage";

const droppableEquip = (() => {
  const typeOrder = ["equip", "piece", "recipe"] as const;
  const posOrder = ["weapon", "armor", "accessory"] as const;
  const { e, p, r } = equip;
  const acc = e.accessory;
  const arm = e.armor;
  const wpn = e.weapon;
  const parts = p;
  const recipe = r;
  const returnArr: {
    type: (typeof typeOrder)[number];
    pos: (typeof posOrder)[number];
    num: string;
  }[] = [];
  Object.keys(acc)
    .filter((key) => /^1\d\d$/.test(key))
    .forEach((num) => {
      returnArr.push({ type: "equip", pos: "accessory", num });
    });
  Object.keys(arm)
    .filter((key) => /^1\d\d$/.test(key))
    .forEach((num) => {
      returnArr.push({ type: "equip", pos: "armor", num });
    });
  Object.keys(wpn)
    .filter((key) => /^1\d\d$/.test(key))
    .forEach((num) => {
      returnArr.push({ type: "equip", pos: "weapon", num });
    });
  parts.accessory.forEach((num) => {
    returnArr.push({ type: "piece", pos: "accessory", num });
  });
  parts.armor.forEach((num) => {
    returnArr.push({ type: "piece", pos: "armor", num });
  });
  parts.weapon.forEach((num) => {
    returnArr.push({ type: "piece", pos: "weapon", num });
  });
  recipe.accessory.forEach((num) => {
    returnArr.push({ type: "recipe", pos: "accessory", num });
  });
  recipe.armor.forEach((num) => {
    returnArr.push({ type: "recipe", pos: "armor", num });
  });
  recipe.weapon.forEach((num) => {
    returnArr.push({ type: "recipe", pos: "weapon", num });
  });
  returnArr.sort((a, b) => {
    const aRank = Math.floor(Number(a.num) / 100);
    const bRank = Math.floor(Number(b.num) / 100);
    if (aRank !== bRank) return bRank - aRank;
    if (a.type !== b.type)
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
    if (a.pos !== b.pos)
      return posOrder.indexOf(a.pos) - posOrder.indexOf(b.pos);
    return a.num.localeCompare(b.num);
  });
  const typeDict = { equip: "e", piece: "p", recipe: "r" };
  return returnArr.map((v) => `${typeDict[v.type]}.${v.pos}.${v.num}`);
})();

const dropTable = (() => {
  const table = equip.d;
  const returnObj: Record<string, string[]> = {};
  Object.keys(table).forEach((world) => {
    table[world].forEach((v, i) => {
      const stage = `${world}-${i + 1}`;
      returnObj[stage] = v;
    });
  });
  return returnObj;
})();

const idToLocKey = (equipId: string) => {
  const [equipType, equipPos, equipNum] = equipId.split(".");
  const equipLocKey = `${
    { e: "equip", p: "piece", r: "recipe" }[equipType]
  }.${equipPos}.${equipNum}`;
  return equipLocKey;
};

interface IComboboxOuterProp {
  value: string;
  onChange: (value: string) => void;
}

const EquipCombobox = ({ value, onChange }: IComboboxOuterProp) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value ? value : "");
  useEffect(() => {
    setV(value ? value : "");
  }, [t, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-60 justify-between font-onemobile"
        >
          {t("ui.normaldrop.selectItem")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0 font-onemobile">
        <Command
          filter={(value, search) =>
            t(`equip.${idToLocKey(value)}`).includes(search) ||
            icSearch(t(`equip.${idToLocKey(value)}`), search)
              ? 1
              : 0
          }
        >
          <CommandInput
            placeholder={t("ui.normaldrop.searchItem")}
            className="h-9"
          />
          <CommandEmpty>{t("ui.normaldrop.itemNotFound")}</CommandEmpty>
          <ScrollArea className="max-h-[70vh] [&_[data-radix-scroll-area-viewport]]:max-h-[70vh]">
            <CommandList>
              <CommandGroup>
                {droppableEquip.map((equipId) => {
                  const [equipType, equipPos, equipNum] = equipId.split(".");
                  const equipLocKey = idToLocKey(equipId);
                  const selected = v === equipId;
                  const fileName = `/equips/Equip_${
                    { e: "", p: "Piece_", r: "Recipe_" }[equipType]
                  }Icon_${equipPos.charAt(0).toUpperCase()}${equipPos.slice(
                    1
                  )}${equipNum}.png`;
                  return (
                    <CommandItem
                      key={equipId}
                      value={equipId}
                      onSelect={(currentValue) => {
                        setV(currentValue === v ? "" : currentValue);
                        onChange(currentValue === v ? "" : equipId);
                        setOpen(false);
                      }}
                    >
                      <div className="w-full relative flex flex-row items-center gap-2">
                        <img src={fileName} alt="" className="w-4 h-4" />
                        <div className="flex-1">
                          {t(`equip.${equipLocKey}`)}
                        </div>
                        <Check
                          className={cn(
                            "w-4 h-4",
                            selected ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface DropProps {
  r: number;
  p: { [key: string]: string };
}

const NormalDrop = () => {
  const { t } = useTranslation();
  const [selectedEquip, setSelectedEquip] = useState("");
  const [equips, setEquips] = useState<string[]>([]);
  const [probs, setProbs] = useState<Record<string, DropProps>>({});
  const [errorFlag, setErrorFlag] = useState<boolean | undefined>(undefined);
  const [summaryView, setSummaryView] = useState<boolean>(true);
  useEffect(() => {
    if (selectedEquip) {
      setEquips((prev) => [...new Set([...prev, selectedEquip])]);
      setSelectedEquip("");
    }
  }, [selectedEquip]);
  const fetchDrop = useCallback(() => {
    fetch("https://api.triple-lab.com/api/v2/tr/drop/normal")
      .then((value) => {
        value
          .json()
          .then((json) => {
            setProbs(json as Record<string, DropProps>);
            setErrorFlag(false);
          })
          .catch(() => setErrorFlag(true));
      })
      .catch(() => setErrorFlag(true));
  }, []);
  useEffect(() => {
    fetchDrop();
  }, [fetchDrop]);
  const getStageExpectation = useCallback(
    (stageInfo: [string, string[]]) => {
      const [stage, drops] = stageInfo;
      return drops
        .filter((d) => equips.includes(d))
        .map((drop) =>
          Number((/(\d+)%/.exec(probs[stage]?.p?.[drop]) ?? ["0%", "0"])[1])
        )
        .reduce((acc, cur) => acc + cur, 0);
    },
    [equips, probs]
  );
  if (typeof errorFlag === "undefined") {
    return (
      <div className="font-onemobile flex flex-col mt-16 justify-center items-center">
        <Loading />
        <div className="text-xl m-4">{t("ui.normaldrop.loadingDropData")}</div>
      </div>
    );
  }
  if (errorFlag) {
    return (
      <div className="font-onemobile flex flex-col mt-16 justify-center items-center">
        <div className="text-2xl m-4">
          {t("ui.normaldrop.loadingDropDataError")}
        </div>
        <Button
          onClick={() => {
            setProbs({});
            setErrorFlag(false);
          }}
        >
          {t("ui.normaldrop.showLineupContinue")}
        </Button>
        <Button onClick={fetchDrop}>{t("ui.normaldrop.retryLoad")}</Button>
      </div>
    );
  }
  return (
    <>
      <Card className="p-4 object-cover max-w-xl mt-0 mb-4 gap-2 mx-auto font-onemobile">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("ui.normaldrop.setting")}</AccordionTrigger>
            <AccordionContent className="text-base">
              <div className="flex flex-col gap-1">
                <EquipCombobox
                  value={selectedEquip}
                  onChange={setSelectedEquip}
                />
              </div>
              <div className="mt-2">
                {equips.map((equip) => {
                  const [equipType, equipPos, equipNum] = equip.split(".");
                  const equipLocKey = idToLocKey(equip);
                  const fileName = `/equips/Equip_${
                    { e: "", p: "Piece_", r: "Recipe_" }[equipType]
                  }Icon_${equipPos.charAt(0).toUpperCase()}${equipPos.slice(
                    1
                  )}${equipNum}.png`;
                  const equipRank = Math.floor(Number(equipNum) / 100);
                  return (
                    <div
                      key={equip}
                      className={cn(
                        "flex items-center gap-2 w-max pl-2 pr-1 py-0.5 m-1 rounded-full",
                        rankClassNames[equipRank - 1][0]
                      )}
                    >
                      <img src={fileName} alt="" className="w-6 h-6" />
                      {t(`equip.${equipLocKey}`)}
                      <div
                        onClick={() =>
                          setEquips((prev) => prev.filter((v) => v !== equip))
                        }
                      >
                        <X
                          className="p-0.5 w-5 h-5 rounded-full text-background bg-foreground opacity-75 cursor-pointer"
                          strokeWidth={3}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex flex-row gap-2 justify-start items-center">
                <Checkbox
                  id="summary-view"
                  checked={summaryView}
                  onCheckedChange={(v) => setSummaryView(!!v)}
                />
                <label htmlFor="summary-view">
                  {t("ui.normaldrop.summary")}
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <div className="text-xs opacity-75 font-onemobile my-2">
        {t("ui.normaldrop.alert")}
      </div>
      <div className="w-full font-onemobile">
        <div className="flex flex-row gap-2 flex-wrap">
          {Object.entries(dropTable)
            .sort((stage1, stage2) => {
              return getStageExpectation(stage2) - getStageExpectation(stage1);
            })
            .map(([stage, drops]) => {
              if (equips.length && !drops.some((d) => equips.includes(d)))
                return null;
              const expectation = getStageExpectation([stage, drops]);
              const [world, stageNum] = stage.split("-");
              if (Number(world) < 3 && summaryView) return null;
              return (
                <Card
                  key={stage}
                  className={cn("p-4", summaryView && "w-[8.625rem]")}
                >
                  <div className="flex gap-3 items-center">
                    <div className="text-xl text-left">{stage}</div>
                    {!summaryView && (
                      <div className="text-left">
                        <div>{t(`stage.normal.${world}.${stageNum}`)}</div>
                        <div className="text-xs opacity-70">
                          {t("ui.normaldrop.recommendPower", {
                            0: stageData.n[world][
                              Number(stageNum) - 1
                            ].toLocaleString(),
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  {equips.length > 0 && (
                    <div className="opacity-80 text-left text-sm mt-1 break-keep">
                      {t("ui.normaldrop.hitCount", {
                        0: drops.filter((d) => equips.includes(d)).length,
                      })}
                      <Dot className="inline-block" />
                      {t("ui.normaldrop.expectValue", {
                        0: (expectation / 100).toFixed(2),
                      })}
                    </div>
                  )}

                  <div className="flex flex-row gap-2 mt-1">
                    {drops.map((drop) => {
                      const [equipType, equipPos, equipNum] = drop.split(".");
                      const fileName = `/equips/Equip_${
                        { e: "", p: "Piece_", r: "Recipe_" }[equipType]
                      }Icon_${equipPos.charAt(0).toUpperCase()}${equipPos.slice(
                        1
                      )}${equipNum}`;
                      const equipRank = Math.floor(Number(equipNum) / 100);
                      if (equipRank === 1 && summaryView) return null;
                      return (
                        <ItemSlot
                          key={drop}
                          item={fileName}
                          size={3}
                          amount={probs[stage]?.p?.[drop] ?? "--%"}
                          fullItemPath
                          rarityInfo={(() => {
                            if ([7, 8, 9, 10].includes(equipRank))
                              return { s: "Purple", b: "#B371F5" };
                            if ([5, 6].includes(equipRank))
                              return { s: "Blue", b: "#65A7E9" };
                            if ([3, 4].includes(equipRank))
                              return { s: "Green", b: "#65DD82" };
                            return { s: "Gray", b: "#B0B0B0" };
                          })()}
                        />
                      );
                    })}
                  </div>
                  <div className="text-left text-xs mt-1">
                    {t(`ui.normaldrop.reliability.${probs[stage]?.r ?? 0}`)}
                    <div
                      className={cn(
                        "ml-2 h-2.5 w-2.5 inline-block rounded-full align-middle",
                        [
                          "bg-gray-500",
                          "bg-red-500",
                          "bg-yellow-500",
                          "bg-green-500",
                          "bg-blue-500",
                        ][probs[stage]?.r ?? 0]
                      )}
                    ></div>
                  </div>
                </Card>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default NormalDrop;
