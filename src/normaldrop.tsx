import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "./lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

import equip from "@/data/equip";

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
    .filter((key) => /1\d\d/.test(key))
    .forEach((num) => {
      returnArr.push({ type: "equip", pos: "accessory", num });
    });
  Object.keys(arm)
    .filter((key) => /1\d\d/.test(key))
    .forEach((num) => {
      returnArr.push({ type: "equip", pos: "armor", num });
    });
  Object.keys(wpn)
    .filter((key) => /1\d\d/.test(key))
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
    if (a.num.charAt(0) !== b.num.charAt(0))
      return b.num.charAt(0).localeCompare(a.num.charAt(0));
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
          {/* {v ? v : t("ui.restaurant.selectFood")} */}
          {"아이템 선택..."}
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
            // placeholder={t("ui.restaurant.searchFood")}
            placeholder={"아이템 검색..."}
            className="h-9"
          />
          {/* <CommandEmpty>{t("ui.restaurant.foodNotFound")}</CommandEmpty> */}
          <CommandEmpty>{"아이템을 찾을 수 없습니다."}</CommandEmpty>
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
  useEffect(() => {
    if (selectedEquip) {
      setEquips((prev) => [...prev, selectedEquip]);
      setSelectedEquip("");
    }
  }, [selectedEquip]);
  const fetchDrop = useCallback(() => {
    fetch("https://api.triple-lab.com/api/v1/tr/drop/normal")
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
  if (typeof errorFlag === "undefined") {
    return (
      <div className="font-onemobile flex flex-col mt-16 justify-center items-center">
        <Loading />
        <div className="text-xl m-4">드랍률 정보 불러오는 중...</div>
      </div>
    );
  }
  if (errorFlag) {
    return (
      <div className="font-onemobile flex flex-col mt-16 justify-center items-center">
        <div className="text-2xl m-4">
          드랍률 정보를 불러오는 도중 오류가 발생했습니다.
        </div>
        <Button onClick={fetchDrop}>다시 시도</Button>
      </div>
    );
  }
  return (
    <>
      <Card className="p-4 object-cover max-w-xl mt-0 mb-4 gap-2 mx-auto font-onemobile">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>설정</AccordionTrigger>
            <AccordionContent className="text-base">
              <div className="flex flex-col gap-1">
                <EquipCombobox
                  value={selectedEquip}
                  onChange={setSelectedEquip}
                />
              </div>
              <div>
                {equips.map((equip) => {
                  const [equipType, equipPos, equipNum] = equip.split(".");
                  const equipLocKey = idToLocKey(equip);
                  const fileName = `/equips/Equip_${
                    { e: "", p: "Piece_", r: "Recipe_" }[equipType]
                  }Icon_${equipPos.charAt(0).toUpperCase()}${equipPos.slice(
                    1
                  )}${equipNum}.png`;
                  return (
                    <div key={equip} className="flex items-center gap-2">
                      <img src={fileName} alt="" className="w-6 h-6" />
                      {t(`equip.${equipLocKey}`)}
                      <div
                        onClick={() =>
                          setEquips((prev) => prev.filter((v) => v !== equip))
                        }
                      >
                        X
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <div className="w-full font-onemobile">
        <div className="flex flex-row gap-2 flex-wrap">
          {Object.entries(dropTable)
            .sort(
              ([, drops1], [, drops2]) =>
                drops2.filter((d) => equips.includes(d)).length -
                drops1.filter((d) => equips.includes(d)).length
            )
            .map(([stage, drops]) => {
              if (equips.length && !drops.some((d) => equips.includes(d)))
                return null;
              return (
                <Card key={stage} className="p-4">
                  <div className="flex gap-2 items-baseline">
                    <div className="text-lg text-left">{stage}</div>
                    <div className="opacity-75">
                      {drops.filter((d) => equips.includes(d)).length}개 일치
                    </div>
                  </div>

                  <div className="flex flex-row gap-2">
                    {drops.map((drop) => {
                      const [equipType, equipPos, equipNum] = drop.split(".");
                      // const equipLocKey = idToLocKey(drop);
                      const fileName = `/equips/Equip_${
                        { e: "", p: "Piece_", r: "Recipe_" }[equipType]
                      }Icon_${equipPos.charAt(0).toUpperCase()}${equipPos.slice(
                        1
                      )}${equipNum}`;
                      return (
                        <ItemSlot
                          key={drop}
                          item={fileName}
                          size={3}
                          amount={
                            Number(stage.split("-")[0]) < 3
                              ? "--%"
                              : probs[stage].p[drop]
                          }
                          fullItemPath
                          rarityInfo={(() => {
                            if (["7", "8", "9"].includes(equipNum.charAt(0)))
                              return { s: "Purple", b: "#B371F5" };
                            if (["5", "6"].includes(equipNum.charAt(0)))
                              return { s: "Blue", b: "#65A7E9" };
                            if (["3", "4"].includes(equipNum.charAt(0)))
                              return { s: "Green", b: "#65DD82" };
                            return { s: "Gray", b: "#B0B0B0" };
                          })()}
                        />
                      );
                    })}
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
