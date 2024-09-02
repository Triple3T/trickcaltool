import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import ItemSlot from "@/components/parts/item-slot";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import equip from "@/data/equip";
import icSearch from "@/lib/initialConsonantSearch";
import rankClassNames from "@/utils/rankClassNames";

interface IComboboxOuterProp {
  value: string;
  onChange: (value: string) => void;
}

const idToLocKey = (equipId: string) => {
  const [equipType, equipPos, equipNum] = equipId.split(".");
  const equipLocKey = `${
    { e: "equip", p: "piece", r: "recipe" }[equipType]
  }.${equipPos}.${equipNum}`;
  return equipLocKey;
};
const allEquipArray = (() => {
  const typeOrder = ["equip", "piece", "recipe"] as const;
  const posOrder = ["weapon", "armor", "accessory"] as const;
  const { e } = equip;
  const { accessory, armor, weapon } = e;
  const returnArr: {
    type: (typeof typeOrder)[number];
    pos: (typeof posOrder)[number];
    num: string;
  }[] = [];
  Object.keys(accessory).forEach((num) =>
    returnArr.push({ type: "equip", pos: "accessory", num })
  );
  Object.keys(armor).forEach((num) =>
    returnArr.push({ type: "equip", pos: "armor", num })
  );
  Object.keys(weapon).forEach((num) =>
    returnArr.push({ type: "equip", pos: "weapon", num })
  );
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
const rankEquips = (() => {
  const returnObj: Record<string, string[]> = {};
  for (const eq of allEquipArray) {
    const [equipType, , equipNum] = eq.split(".");
    if (equipType !== "e") continue;
    const targetRank = equipNum.charAt(0);
    if (!returnObj[targetRank]) returnObj[targetRank] = [];
    returnObj[equipNum.charAt(0)].push(eq);
  }
  return returnObj;
})();

const EquipCombobox = ({ value, onChange }: IComboboxOuterProp) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value ? value : "");
  useEffect(() => {
    setV(value ? value : "");
  }, [t, value]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRank, setSelectedRank] = useState("9");

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
          {v ? t(`equip.${idToLocKey(v)}`) || "???" : "아이템 선택..."}
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
            value={searchValue}
            onValueChange={setSearchValue}
          />
          {/* <CommandEmpty>{t("ui.restaurant.foodNotFound")}</CommandEmpty> */}
          <CommandEmpty>{"아이템을 찾을 수 없습니다."}</CommandEmpty>
          {!searchValue && (
            <div className="flex flex-wrap p-1 gap-1 justify-evenly">
              {Object.keys(rankEquips).map((rank) => {
                return (
                  <Badge
                    className={cn(
                      "font-normal text-center",
                      selectedRank === rank
                        ? rankClassNames[Number(rank) - 1][2]
                        : "opacity-80",
                      rankClassNames[Number(rank) - 1][6]
                    )}
                    key={rank}
                    onClick={() => setSelectedRank(rank)}
                  >{`RANK ${rank}`}</Badge>
                );
              })}
            </div>
          )}
          <ScrollArea className="max-h-[60vh] [&_[data-radix-scroll-area-viewport]]:max-h-[60vh]">
            <CommandList>
              {!searchValue ? (
                <CommandGroup>
                  {rankEquips[selectedRank] &&
                    rankEquips[selectedRank].map((equipId) => {
                      const [, equipPos, equipNum] = equipId.split(".");
                      const equipLocKey = idToLocKey(equipId);
                      const selected = v === equipId;
                      const fileName = `/equips/Equip_Icon_${equipPos
                        .charAt(0)
                        .toUpperCase()}${equipPos.slice(1)}${equipNum}.png`;
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
              ) : (
                Object.entries(rankEquips).map(([rank, equips]) => {
                  return (
                    <CommandGroup key={rank} heading={`RANK ${rank}`}>
                      {equips.map((equipId) => {
                        const [, equipPos, equipNum] = equipId.split(".");
                        const equipLocKey = idToLocKey(equipId);
                        const selected = v === equipId;
                        const fileName = `/equips/Equip_Icon_${equipPos
                          .charAt(0)
                          .toUpperCase()}${equipPos.slice(1)}${equipNum}.png`;
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
                                {t(`equip.${equipLocKey}`) || "???"}
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
                  );
                })
              )}
              {/* <CommandGroup>
                {allEquipArray.map((equipId) => {
                  const [, equipPos, equipNum] = equipId.split(".");
                  const equipLocKey = idToLocKey(equipId);
                  const selected = v === equipId;
                  const fileName = `/equips/Equip_Icon_${equipPos
                    .charAt(0)
                    .toUpperCase()}${equipPos.slice(1)}${equipNum}.png`;
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
              </CommandGroup> */}
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const { v } = equip;
const getStoneBefore250 = (reqPoint: number): Array<number> => {
  if (reqPoint < 60) return [0, 0, 0, reqPoint];
  if (reqPoint < 150) return [Math.floor(reqPoint / 60), 0, 0, reqPoint % 60];
  const r150 = Math.floor((reqPoint % 60) / 30);
  const m150 = Math.floor(reqPoint / 150);
  const i150 = Math.min(r150, m150);
  const remainingPointAfter150 = reqPoint - 150 * i150;
  const i60 = Math.floor(remainingPointAfter150 / 60);
  const remainingPointAfter60 = remainingPointAfter150 - 60 * i60;
  return [i60, i150, 0, remainingPointAfter60];
};
const getStoneAfter250 = (reqPoint: number): Array<number> => {
  const r250 = Math.floor((reqPoint % 60) / 10) % 3;
  const m250 = Math.floor(reqPoint / 250);
  const i250 = Math.min(r250, m250);
  const remainingPointAfter250 = reqPoint - 250 * i250;
  const r150 = Math.floor((remainingPointAfter250 % 60) / 30);
  const m150 = Math.floor(remainingPointAfter250 / 150);
  const i150 = Math.min(r150, m150);
  const remainingPointAfter150 = remainingPointAfter250 - 150 * i150;
  const i60 = Math.floor(remainingPointAfter150 / 60);
  const remainingPointAfter60 = remainingPointAfter150 - 60 * i60;
  return [i60, i150, i250, remainingPointAfter60];
};
const enhanceRequire = (
  rank: number,
  enhance: number
): [number, number, number[]] => {
  if (enhance === 0) return [0, 0, []];
  if (rank === 0) return [0, 0, []];
  const reqPoint = v.enhanceRequire[rank - 1][enhance - 1];
  const reqGold = reqPoint * v.enhanceCost[rank - 1];
  if (reqPoint < 250) return [reqPoint, reqGold, getStoneBefore250(reqPoint)];
  return [reqPoint, reqGold, getStoneAfter250(reqPoint)];
};

const EquipEnhanceCalc = () => {
  const { t } = useTranslation();
  const [requirements, setRequirements] = useState<[number, number, number[]]>([
    0,
    0,
    [],
  ]);
  const [selectedEquip, setSelectedEquip] = useState<string>("");
  const [rank, setRank] = useState<number>(0);
  const [enhanceLevel, setEnhanceLevel] = useState<number>(0);
  useEffect(() => {
    if (selectedEquip) {
      const r = Number(selectedEquip.split(".")[2].charAt(0));
      setRank(r);
      setRequirements(enhanceRequire(r, enhanceLevel));
    } else {
      setRank(0);
      setRequirements([0, 0, []]);
    }
  }, [enhanceLevel, selectedEquip]);
  return (
    <Card className="p-4 max-w-80 mx-auto">
      <div className="text-xl">{t("ui.goodscalc.equipenhance.equipInput")}</div>
      <div className="mt-4">
        <EquipCombobox value={selectedEquip} onChange={setSelectedEquip} />
      </div>
      {selectedEquip ? (
        <div className="mt-4 flex flex-row gap-2">
          <div className="flex flex-initial">
            <ItemSlot
              rarityInfo={(() => {
                const er = selectedEquip.split(".")[2].charAt(0);
                if (["9"].includes(er)) return { s: "Yellow" };
                if (["7", "8", "9"].includes(er))
                  return { s: "Purple", b: "#B371F5" };
                if (["5", "6"].includes(er)) return { s: "Blue", b: "#65A7E9" };
                if (["3", "4"].includes(er))
                  return { s: "Green", b: "#65DD82" };
                return { s: "Gray", b: "#B0B0B0" };
              })()}
              item={`/equips/Equip_Icon_${selectedEquip
                .split(".")[1]
                .charAt(0)
                .toUpperCase()}${selectedEquip.split(".")[1].slice(1)}${
                selectedEquip.split(".")[2]
              }`}
              size={5}
              fullItemPath
            />
          </div>
          <div className="flex flex-col flex-1 gap-2.5 items-stretch">
            <div className="text-lg overflow-hidden text-ellipsis">
              {t(`equip.equip.${selectedEquip.substring(2)}`)}
            </div>
            <div className="bg-green-200 dark:bg-green-800 rounded-full w-4/5 mx-auto">
              <div className="-mt-2 -mb-0.5 flex flex-row gap-4 items-center text-xl justify-center">
                <div
                  className="text-slate-900"
                  style={{
                    textShadow: Array(20).fill("0 0 2px #fff").join(","),
                  }}
                >
                  +0
                </div>
                {enhanceLevel > 0 && (
                  <>
                    <img src="/common/CommonLevelUpArrow.png" className="h-3" />
                    <div
                      className="text-[#5082e6]"
                      style={{
                        textShadow: Array(20).fill("0 0 2px #fff").join(","),
                      }}
                    >
                      +{enhanceLevel}
                    </div>
                  </>
                )}
              </div>
            </div>
            <Slider
              value={[enhanceLevel]}
              onValueChange={([v]) => setEnhanceLevel(v)}
              min={0}
              max={5}
              step={1}
            />
          </div>
        </div>
      ) : (
        <div className="px-4 mt-4 opacity-75">
          {t("ui.goodscalc.equipenhance.equipInputNotice")}
        </div>
      )}
      <Separator className="my-4" />
      <div className="text-lg">
        {t("ui.goodscalc.equipenhance.requiredTitle")}
      </div>
      {selectedEquip && requirements[0] ? (
        <>
          <div className="flex justify-evenly my-4">
            {requirements[2].map((v, i) => {
              if (!v) return null;
              return (
                <ItemSlot
                  key={i}
                  rarityInfo={
                    [
                      { s: "Gray" },
                      { s: "Green" },
                      { s: "Blue" },
                      { s: "Gray" },
                    ][i]
                  }
                  item={`/equips/Equip_EnhanceStone${i + 1}`}
                  fullItemPath
                  amount={v}
                  size={3.5}
                />
              );
            })}
          </div>
          <div className="flex flex-row gap-2 justify-center items-center bg-green-50 dark:bg-green-950 rounded ring-1 ring-green-100 dark:ring-green-900 p-0.5">
            <img src="/icons/CurrencyIcon_0008.png" className="w-5 h-5" />
            <div>{requirements[1].toLocaleString()}</div>
          </div>
          <Separator className="my-4" />
          <div className="text-lg">
            {t("ui.goodscalc.equipenhance.enhancedStatTitle")}
          </div>
          <div className="flex flex-col mt-2 gap-1">
            {Object.entries(
              equip.e[
                selectedEquip.split(".")[1] as "weapon" | "armor" | "accessory"
              ][selectedEquip.split(".")[2]]?.s || {}
            ).map(([stat, value]) => {
              return (
                <div key={stat} className="flex flex-row">
                  <div className="flex flex-row gap-1 text-left flex-auto items-center">
                    <img
                      src={`/icons/Icon_${stat}.png`}
                      alt=""
                      className="w-4 h-4"
                    />
                    {t(`stat.${stat}`)}
                  </div>
                  <div className="text-right flex-auto flex flex-row justify-end gap-px items-baseline">
                    <div
                      className="text-[#5082e6] mr-1"
                      style={{
                        textShadow: Array(20).fill("0 0 2px #fff").join(","),
                      }}
                    >
                      {Math.floor(
                        (value *
                          (equip.v.enhanceRate[rank - 1][enhanceLevel - 1] +
                            100)) /
                          100
                      ).toLocaleString()}
                    </div>
                    <div className="opacity-80 text-sm">
                      {value.toLocaleString()}
                    </div>
                    <div className="text-sm">
                      +
                      {Math.floor(
                        (value *
                          equip.v.enhanceRate[rank - 1][enhanceLevel - 1]) /
                          100
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-xs opacity-75 break-keep">
          {t("ui.goodscalc.equipenhance.inputNotice")}
        </div>
      )}
    </Card>
  );
};

export default EquipEnhanceCalc;
