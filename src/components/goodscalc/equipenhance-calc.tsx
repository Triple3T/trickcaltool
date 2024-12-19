import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GroupedVirtuoso } from "react-virtuoso";
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
import { ScrollAreaViewportRef } from "@/components/ui/scroll-area";
import icSearch from "@/lib/initialConsonantSearch";
import rankClassNames from "@/utils/rankClassNames";

import equip from "@/data/equip";

const MAX_RANK = 9;

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
const rankEquips = (() => {
  const returnObj: Record<string, string[]> = {};
  for (const eq of allEquipArray) {
    const [equipType, , equipNum] = eq.split(".");
    if (equipType !== "e") continue;
    const targetRank = Math.floor(Number(equipNum) / 100);
    if (!returnObj[targetRank]) returnObj[targetRank] = [];
    returnObj[targetRank].push(eq);
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
  const [selectedRank, setSelectedRank] = useState(MAX_RANK);
  const [scrollParent, setScrollParent] = useState<HTMLDivElement | null>(null);
  const refScrollParent = useCallback(
    (element: HTMLDivElement) => setScrollParent(element),
    []
  );
  const [totalListHeight, setTotalListHeight] = useState<number>(9999);

  const filteredValues = Object.values(rankEquips).map((values) =>
    values.filter((value) =>
      searchValue
        ? t(`equip.${idToLocKey(value)}`).includes(searchValue) ||
          icSearch(t(`equip.${idToLocKey(value)}`), searchValue)
        : Math.floor(Number(value.split(".")[2]) / 100) === selectedRank
    )
  );

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
          // filter={(value, search) =>
          //   t(`equip.${idToLocKey(value)}`).includes(search) ||
          //   icSearch(t(`equip.${idToLocKey(value)}`), search)
          //     ? 1
          //     : 0
          // }
          shouldFilter={false}
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
              {Object.keys(rankEquips).map((r) => {
                const rank = Number(r);
                return (
                  <Badge
                    className={cn(
                      "font-normal text-center",
                      selectedRank === rank
                        ? rankClassNames[rank - 1][2]
                        : "opacity-80",
                      rankClassNames[rank - 1][6]
                    )}
                    key={rank}
                    onClick={() => setSelectedRank(rank)}
                  >
                    {t("ui.equiprank.rankText", { 0: rank })}
                  </Badge>
                );
              })}
            </div>
          )}
          <CommandList className="h-fit">
            <ScrollAreaViewportRef
              ref={refScrollParent}
              className="max-h-[60vh] [&_[data-radix-scroll-area-viewport]]:max-h-[60vh]"
              style={{ height: `${totalListHeight}px` }}
            >
              <GroupedVirtuoso
                overscan={128}
                totalListHeightChanged={setTotalListHeight}
                customScrollParent={scrollParent ?? undefined}
                groupCounts={filteredValues
                  .map((f) => f.length)
                  .filter((length) => length > 0)}
                groupContent={(i) => {
                  return (
                    <CommandGroup
                      heading={t("ui.equiprank.rankText", {
                        0: filteredValues
                          .map((values, index) => ({
                            rank: index + 1,
                            length: values.length,
                          }))
                          .filter(({ length }) => length > 0)[i].rank,
                      })}
                      className="bg-popover"
                    />
                  );
                }}
                itemContent={(index) => {
                  const equipId = filteredValues.flat()[index];
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
                }}
              />
            </ScrollAreaViewportRef>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const { v } = equip;
const getStoneBefore250 = (reqPoint: number): number[] => {
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
const getStoneAfter250 = (reqPoint: number): number[] => {
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
const returnStone = (reqPoint: number): number[] => {
  const returnAmount = Math.floor((reqPoint * 6) / 10);
  if (returnAmount < 1) return [0, 0, 0, 0];
  const amount250 = Math.floor(returnAmount / 250);
  const remainAfter250 = returnAmount % 250;
  const amount150 = Math.floor(remainAfter250 / 150);
  const remainAfter150 = remainAfter250 % 150;
  const amount60 = Math.floor(remainAfter150 / 60);
  return [amount60, amount150, amount250, remainAfter150 % 60];
};
const getEnhanceRequire = (
  rank: number,
  [enhanceStart, enhanceEnd]: number[]
): [number, number, number[]] => {
  if (enhanceStart === enhanceEnd) return [0, 0, []];
  if (rank === 0) return [0, 0, []];
  const reqPointStart =
    enhanceStart > 0 ? v.enhanceRequire[rank - 1][enhanceStart - 1] : 0;
  const reqPointEnd =
    enhanceEnd > 0 ? v.enhanceRequire[rank - 1][enhanceEnd - 1] : 0;
  const reqPoint = Math.abs(reqPointStart - reqPointEnd);
  console.log(reqPoint);
  const reqGold = reqPoint * v.enhanceCost[rank - 1];
  if (reqPoint < 250) return [reqPoint, reqGold, getStoneBefore250(reqPoint)];
  return [reqPoint, reqGold, getStoneAfter250(reqPoint)];
};
const getEnhancedStat = (value: number, rank: number, level: number) =>
  level > 0
    ? Math.floor(
        (value * (equip.v.enhanceRate[rank - 1][level - 1] + 100)) / 100
      )
    : value;

const EquipEnhanceCalc = () => {
  const { t } = useTranslation();
  const [requirements, setRequirements] = useState<
    [number, number, number[], number[]]
  >([0, 0, [], []]);
  const [selectedEquip, setSelectedEquip] = useState<string>("");
  const [rank, setRank] = useState<number>(0);
  const [enhanceLevel, setEnhanceLevel] = useState<number[]>([0, 0]);
  useEffect(() => {
    if (selectedEquip) {
      const r = Math.floor(Number(selectedEquip.split(".")[2]) / 100);
      setRank(r);
      const req = getEnhanceRequire(r, enhanceLevel);
      const ret = returnStone(
        enhanceLevel[1] === 0
          ? 0
          : equip.v.enhanceRequire[r - 1][enhanceLevel[1] - 1]
      );
      setRequirements([...req, ret]);
    } else {
      setRank(0);
      setRequirements([0, 0, [], []]);
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
                const er = Math.floor(
                  Number(selectedEquip.split(".")[2]) / 100
                );
                if ([9, 10].includes(er)) return { s: "Yellow" };
                if ([7, 8].includes(er)) return { s: "Purple", b: "#B371F5" };
                if ([5, 6].includes(er)) return { s: "Blue", b: "#65A7E9" };
                if ([3, 4].includes(er)) return { s: "Green", b: "#65DD82" };
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
                  +{Math.min(...enhanceLevel)}
                </div>
                {enhanceLevel[0] !== enhanceLevel[1] && (
                  <>
                    <img src="/common/CommonLevelUpArrow.png" className="h-3" />
                    <div
                      className="text-[#5082e6]"
                      style={{
                        textShadow: Array(20).fill("0 0 2px #fff").join(","),
                      }}
                    >
                      +{Math.max(...enhanceLevel)}
                    </div>
                  </>
                )}
              </div>
            </div>
            <Slider
              value={enhanceLevel}
              onValueChange={setEnhanceLevel}
              defaultValue={[0, 0]}
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
                  rarityInfo={{ s: ["Gray", "Green", "Blue", "Gray"][i] }}
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
                      {getEnhancedStat(
                        value,
                        rank,
                        Math.max(...enhanceLevel)
                      ).toLocaleString()}
                      {/* {Math.floor(
                        (value *
                          (equip.v.enhanceRate[rank - 1][enhanceLevel - 1] +
                            100)) /
                          100
                      ).toLocaleString()} */}
                    </div>
                    <div className="opacity-80 text-sm">
                      {/* {value.toLocaleString()} */}
                      {getEnhancedStat(
                        value,
                        rank,
                        Math.min(...enhanceLevel)
                      ).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      +
                      {/* {Math.floor(
                        (value *
                          equip.v.enhanceRate[rank - 1][enhanceLevel - 1]) /
                          100
                      ).toLocaleString()} */}
                      {(
                        getEnhancedStat(
                          value,
                          rank,
                          Math.max(...enhanceLevel)
                        ) -
                        getEnhancedStat(value, rank, Math.min(...enhanceLevel))
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {selectedEquip && enhanceLevel[1] > 0 && (
            <>
              <Separator className="my-4" />
              <div className="text-lg">
                {t("ui.goodscalc.equipenhance.rankUpReturnGoods")}
              </div>
              <div className="flex justify-evenly my-4">
                {requirements[3].map((v, i) => {
                  if (!v) return null;
                  return (
                    <ItemSlot
                      key={i}
                      rarityInfo={{ s: ["Gray", "Green", "Blue", "Gray"][i] }}
                      item={`/equips/Equip_EnhanceStone${i + 1}`}
                      fullItemPath
                      amount={v}
                      size={3.5}
                    />
                  );
                })}
              </div>
            </>
          )}
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
