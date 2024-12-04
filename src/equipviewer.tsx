import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GroupedVirtuoso } from "react-virtuoso";
import { ArrowDown10, ArrowUp01, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import icSearch from "@/lib/initialConsonantSearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollAreaViewportRef } from "@/components/ui/scroll-area";
import Select from "@/components/common/combobox-select";
import ItemSlot from "@/components/parts/item-slot";
import { personalityBG, personalityBGMarked } from "@/utils/personalityBG";
import { Personality, StatType } from "@/types/enums";
import rankClassNames from "@/utils/rankClassNames";

import chara from "@/data/chara";
import equip from "@/data/equip";

interface IComboboxOuterProp {
  value: string;
  onChange: (value: string) => void;
}

const CharacterCombobox = ({ value, onChange }: IComboboxOuterProp) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value ? t(`chara.${value}`) : "");
  useEffect(() => {
    setV(value ? t(`chara.${value}`) : "");
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
          {v ? v : t("ui.equipviewer.selectCharacter")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 md:w-96 p-0 font-onemobile">
        <Command
          filter={(value, search) =>
            value.includes(search) || icSearch(value, search) ? 1 : 0
          }
        >
          <CommandInput
            placeholder={t("ui.equipviewer.searchCharacter")}
            className="h-9"
          />
          <CommandEmpty>{t("ui.equipviewer.characterNotFound")}</CommandEmpty>
          <ScrollArea className="max-h-[70vh] [&_[data-radix-scroll-area-viewport]]:max-h-[70vh]">
            <CommandList>
              <CommandGroup className="[&_[cmdk-group-items]]:grid [&_[cmdk-group-items]]:grid-cols-2 md:[&_[cmdk-group-items]]:grid-cols-3 [&_[cmdk-group-items]]:gap-1 p-2">
                {Object.keys(chara)
                  .sort((a, b) =>
                    t(`chara.${a}`).localeCompare(t(`chara.${b}`))
                  )
                  .map((charaId) => {
                    const selected = v === t(`chara.${charaId}`);
                    const bg = (() => {
                      if (selected)
                        return personalityBG[
                          Number(chara[charaId].t[0]) as Personality
                        ];
                      return personalityBGMarked[
                        Number(chara[charaId].t[0]) as Personality
                      ];
                    })();
                    return (
                      <CommandItem
                        key={charaId}
                        className="p-0 rounded-lg"
                        value={t(`chara.${charaId}`)}
                        onSelect={(currentValue) => {
                          setV(currentValue === v ? "" : currentValue);
                          onChange(currentValue === v ? "" : charaId);
                          setOpen(false);
                        }}
                      >
                        <div
                          className={cn(
                            "w-full aspect-square relative rounded-lg overflow-hidden border border-background flex",
                            "hover:scale-110 hover:z-10 transition-transform duration-100",
                            bg
                          )}
                        >
                          <img
                            src={`/charas/${charaId}.png`}
                            className="w-full aspect-square"
                          />
                          <div className="w-full absolute text-center text-sm py-0.5 bottom-0 left-0 bg-slate-100/90 dark:bg-slate-900/90">
                            {t(`chara.${charaId}`)}
                          </div>
                          {selected && (
                            <div className="h-6 w-6 p-1 absolute top-1 right-1 rounded-full bg-slate-100/80 dark:bg-slate-900/80">
                              <Check className="w-full h-full" />
                            </div>
                          )}
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
        : value.split(".")[2].charAt(0) === selectedRank
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
          {v
            ? t(`equip.${idToLocKey(v)}`) || t("ui.equipviewer.unknownEquip")
            : t("ui.equipviewer.selectEquip")}
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
            placeholder={t("ui.equipviewer.searchEquip")}
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>{t("ui.equipviewer.equipNotFound")}</CommandEmpty>
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
                  >
                    {t("ui.equiprank.rankText", { 0: rank })}
                  </Badge>
                );
              })}
            </div>
          )}
          <ScrollAreaViewportRef
            ref={refScrollParent}
            id="equip-combobox-scroll-area"
            className="max-h-[60vh] [&_[data-radix-scroll-area-viewport]]:max-h-[60vh]"
          >
            <CommandList
              style={{
                scrollbarWidth: "none",
              }}
            >
              <GroupedVirtuoso
                style={{ height: `${totalListHeight}px`, maxHeight: "60vh" }}
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
            </CommandList>
          </ScrollAreaViewportRef>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const EquipViewer = () => {
  const { t } = useTranslation();
  const [showEquipPartsRequired, setShowEquipPartsRequired] =
    useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showFullEnhanced, setShowFullEnhanced] = useState<boolean>(false);
  const [showEquipName, setShowEquipName] = useState<boolean>(false);
  const [selectedChara, setSelectedChara] = useState<string>("");
  const [selectedEquip, setSelectedEquip] = useState<string>("");
  const [selectedRank, setSelectedRank] = useState<number>(0);
  const [sortBy, setSortBy] = useState<number[]>([-1, 0]);
  const searchChara = useCallback((charaId: string) => {
    setSelectedChara(charaId);
    setSelectedEquip("");
    setSelectedRank(0);
  }, []);
  const searchEquip = useCallback((equipId: string) => {
    setSelectedChara("");
    setSelectedEquip(equipId);
    setSelectedRank(0);
  }, []);
  const searchRank = useCallback((rank: number) => {
    setSelectedChara("");
    setSelectedEquip("");
    setSelectedRank(rank);
  }, []);

  return (
    <div className="font-onemobile mx-auto max-w-lg p-4">
      <div className="w-full h-4" />
      <Card className="mx-auto w-max max-w-full p-4 font-onemobile">
        <div className="flex flex-col p-2 gap-4">
          <div className="flex flex-col sm:flex-row p-2 gap-2">
            <CharacterCombobox value={selectedChara} onChange={searchChara} />
            <EquipCombobox value={selectedEquip} onChange={searchEquip} />
            <Select
              value={selectedRank}
              setValue={searchRank}
              placeholder={t("ui.equipviewer.selectRank")}
              items={Array(9)
                .fill(0)
                .map((_, i) => ({
                  value: i + 1,
                  label: t("ui.equipviewer.rankText", { 0: i + 1 }),
                }))}
            />
          </div>
        </div>
        {selectedChara && (
          <div className="flex gap-2">
            <img src={`/charas/${selectedChara}.png`} className="w-24 h-24" />
            <div className="flex flex-col justify-start gap-1 p-1">
              <div className="text-2xl">{t(`chara.${selectedChara}`)}</div>
              <div className="text-sm flex items-center gap-2">
                <Checkbox
                  id="showEquipPartsRequired"
                  checked={showEquipPartsRequired}
                  onCheckedChange={(v) => setShowEquipPartsRequired(Boolean(v))}
                />
                <label
                  htmlFor="showEquipPartsRequired"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("ui.equipviewer.showEquipPartsRequired")}
                </label>
              </div>
              <div className="text-sm flex items-center gap-2">
                <Checkbox
                  id="showEquipName"
                  checked={showEquipName}
                  onCheckedChange={(v) => setShowEquipName(Boolean(v))}
                />
                <label
                  htmlFor="showEquipName"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("ui.equipviewer.showEquipName")}
                </label>
              </div>
              <div className="text-sm flex items-center gap-2">
                <Checkbox
                  id="showStats"
                  checked={showStats}
                  onCheckedChange={(v) => setShowStats(Boolean(v))}
                />
                <label
                  htmlFor="showStats"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("ui.equipviewer.showTotalStat")}
                </label>
              </div>
              {showStats && (
                <div className="text-sm flex items-center gap-2">
                  <Checkbox
                    id="showFullEnhanced"
                    checked={showFullEnhanced}
                    onCheckedChange={(v) => setShowFullEnhanced(Boolean(v))}
                  />
                  <label
                    htmlFor="showFullEnhanced"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t("ui.equipviewer.showFullEnhanced")}
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
        {selectedEquip && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <ItemSlot
                item={`/equips/Equip_Icon_${selectedEquip
                  .split(".")[1]
                  .charAt(0)
                  .toUpperCase()}${selectedEquip.split(".")[1].slice(1)}${
                  selectedEquip.split(".")[2]
                }`}
                size={4}
                fullItemPath
                rarityInfo={(() => {
                  const er = selectedEquip.split(".")[2].charAt(0);
                  if (["9"].includes(er)) return { s: "Yellow" };
                  if (["7", "8", "9"].includes(er))
                    return { s: "Purple", b: "#B371F5" };
                  if (["5", "6"].includes(er))
                    return { s: "Blue", b: "#65A7E9" };
                  if (["3", "4"].includes(er))
                    return { s: "Green", b: "#65DD82" };
                  return { s: "Gray", b: "#B0B0B0" };
                })()}
              />
              <div className="text-2xl">
                {t(
                  `equip.equip.${selectedEquip.split(".")[1]}.${
                    selectedEquip.split(".")[2]
                  }`
                ) || t("ui.equip.unknownEquip")}
              </div>
            </div>
            <div className="text-sm flex justify-evenly gap-x-2 gap-y-1">
              {((equipInfo) => {
                //
                return (
                  <>
                    <div>
                      {equipInfo && equipInfo.s ? (
                        Object.keys(equipInfo.s).length > 0 ? (
                          <div className="flex flex-col gap-1 flex-1">
                            {Object.entries(equipInfo.s).map(([st, stv]) => {
                              return (
                                <div
                                  key={st}
                                  className="flex flex-row items-center gap-2"
                                >
                                  <img
                                    src={`/icons/Icon_${st}.png`}
                                    className="w-6 h-6"
                                  />
                                  <div className="flex-auto text-sm text-left">
                                    {t(`stat.${st}`)}
                                  </div>
                                  <div className="flex-auto text-sm text-right">
                                    {stv}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex-1 text-sm text-center opacity-75">
                            {t("ui.equipviewer.noStat")}
                          </div>
                        )
                      ) : (
                        <div className="flex-1 text-sm text-center text-red-500">
                          {t("ui.equipviewer.noDataForStat")}
                        </div>
                      )}
                    </div>
                    <div>
                      {equipInfo ? (
                        "i" in equipInfo ? (
                          Object.keys(equipInfo.i).length > 0 ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-row gap-1 justify-center">
                                {Object.entries(equipInfo.i).map(
                                  ([ig, igv]) => {
                                    const [iType, iPart, iNum] = ig.split(".");
                                    const fileName = `/equips/Equip_${
                                      { e: "", p: "Piece_", r: "Recipe_" }[
                                        iType
                                      ]
                                    }Icon_${iPart
                                      .charAt(0)
                                      .toUpperCase()}${iPart.slice(1)}${iNum}`;
                                    return (
                                      <ItemSlot
                                        key={ig}
                                        item={fileName}
                                        amount={igv}
                                        size={3}
                                        fullItemPath
                                        rarityInfo={(() => {
                                          if (
                                            ["7", "8", "9"].includes(
                                              iNum.charAt(0)
                                            )
                                          )
                                            return {
                                              s: "Purple",
                                              b: "#B371F5",
                                            };
                                          if (
                                            ["5", "6"].includes(iNum.charAt(0))
                                          )
                                            return {
                                              s: "Blue",
                                              b: "#65A7E9",
                                            };
                                          if (
                                            ["3", "4"].includes(iNum.charAt(0))
                                          )
                                            return {
                                              s: "Green",
                                              b: "#65DD82",
                                            };
                                          return { s: "Gray", b: "#B0B0B0" };
                                        })()}
                                      />
                                    );
                                  }
                                )}
                              </div>
                              <div className="flex justify-center items-center text-sm">
                                <img
                                  className="w-4 h-4 mr-0.5"
                                  src="/icons/CurrencyIcon_0008.png"
                                />
                                {equipInfo.g}
                                <div className="w-4 h-4 ml-0.5" />
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-center text-red-500">
                              {t("ui.equipviewer.noDataForRecipe")}
                            </div>
                          )
                        ) : (
                          <div className="text-sm text-center opacity-75">
                            {t("ui.equipviewer.noRecipe")}
                          </div>
                        )
                      ) : (
                        <div className="text-sm text-center text-red-500">
                          {t("ui.equipviewer.noDataForRecipe")}
                        </div>
                      )}
                    </div>
                  </>
                );
              })(
                equip.e[
                  selectedEquip.split(".")[1] as
                    | "weapon"
                    | "armor"
                    | "accessory"
                ][selectedEquip.split(".")[2]]
              )}
            </div>
            <div>
              <div className="text-sm flex items-center gap-2">
                <Checkbox
                  id="showEquipName"
                  checked={showEquipName}
                  onCheckedChange={(v) => setShowEquipName(Boolean(v))}
                />
                <label
                  htmlFor="showEquipName"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("ui.equipviewer.showOtherEquipName")}
                </label>
              </div>
            </div>
          </div>
        )}
        {selectedRank > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Select
                value={sortBy[0] < 0 ? sortBy[0] : sortBy[0] + 1}
                setValue={(a) => setSortBy(([, b]) => [a > 0 ? a - 1 : a, b])}
                placeholder={t("ui.equipviewer.selectSortBy")}
                items={[
                  { value: -1, label: t("ui.equipviewer.equipPartsName") },
                  ...[8, 1, 0, 7, 6, 4, 2, 5, 3].map((stat) => ({
                    value: (stat as StatType) + 1,
                    label: t(`stat.${StatType[stat]}`),
                  })),
                ]}
              />
              {sortBy[1] ? (
                <Button
                  variant="outline"
                  onClick={() => setSortBy(([a]) => [a, 0])}
                >
                  <ArrowUp01 className="w-6 h-6" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setSortBy(([a]) => [a, 1])}
                >
                  <ArrowDown10 className="w-6 h-6" />
                </Button>
              )}
            </div>
            {sortBy[0] >= 0 && (
              <div className="text-sm flex items-center gap-2">
                <Checkbox
                  id="showFullEnhanced"
                  checked={showFullEnhanced}
                  onCheckedChange={(v) => setShowFullEnhanced(Boolean(v))}
                />
                <label
                  htmlFor="showFullEnhanced"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("ui.equipviewer.showFullEnhanced")}
                </label>
              </div>
            )}
          </div>
        )}
      </Card>
      {!selectedChara && !selectedEquip && !selectedRank && (
        <div className="mt-4">
          <div className="break-keep">{t("ui.equipviewer.selectAny")}</div>
        </div>
      )}
      <div
        className={cn(
          "font-onemobile flex max-w-full justify-center",
          selectedChara || selectedEquip || selectedRank
            ? "flex-wrap gap-6 p-4"
            : "flex-col"
        )}
      >
        {selectedChara
          ? equip.c[selectedChara] &&
            equip.c[selectedChara].map((es, i) => {
              return (
                <div key={`${selectedChara}-${i}`}>
                  <div className={cn("text-lg", rankClassNames[i][1])}>
                    {t("ui.equipviewer.rankText", { 0: i + 1 })}
                  </div>
                  <div
                    className={cn(
                      "flex flex-wrap justify-center gap-2 rounded-lg p-2",
                      showEquipName ? "w-48" : "w-32",
                      rankClassNames[i][0]
                    )}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {es.length
                        ? es.map((e, si) => {
                            const [iType, iPart, iNum] = e.split(".");
                            const fileName = `/equips/Equip_${
                              { e: "", p: "Piece_", r: "Recipe_" }[iType]
                            }Icon_${iPart.charAt(0).toUpperCase()}${iPart.slice(
                              1
                            )}${iNum}`;
                            return (
                              <div
                                key={si}
                                onClick={() => searchEquip(e)}
                                className="flex flex-col items-center"
                              >
                                <ItemSlot
                                  item={fileName}
                                  size={3}
                                  fullItemPath
                                  rarityInfo={(() => {
                                    if (["9"].includes(iNum.charAt(0)))
                                      return { s: "Yellow" };
                                    if (
                                      ["7", "8", "9"].includes(iNum.charAt(0))
                                    )
                                      return { s: "Purple", b: "#B371F5" };
                                    if (["5", "6"].includes(iNum.charAt(0)))
                                      return { s: "Blue", b: "#65A7E9" };
                                    if (["3", "4"].includes(iNum.charAt(0)))
                                      return { s: "Green", b: "#65DD82" };
                                    return { s: "Gray", b: "#B0B0B0" };
                                  })()}
                                />
                                <div className="text-sm">
                                  {showEquipName &&
                                    (t(
                                      `equip.equip.${e.split(".")[1]}.${
                                        e.split(".")[2]
                                      }`
                                    ) ||
                                      t("ui.equip.unknownEquip"))}
                                </div>
                              </div>
                            );
                          })
                        : t("ui.equipviewer.noData")}
                    </div>
                    {showEquipPartsRequired && (
                      <div className="flex w-full justify-center items-center gap-1">
                        <img
                          src="/icons/CurrencyIcon_0047.png"
                          alt=""
                          className="w-5 h-5"
                        />
                        <div>
                          {es.length > 0 &&
                            es
                              .reduce((acc, cur) => {
                                const [, iPart, iNum] = cur.split(".");
                                const equipInfo =
                                  equip.e[
                                    iPart as "weapon" | "armor" | "accessory"
                                  ][iNum];
                                if (!equipInfo) return acc;
                                if (!("i" in equipInfo)) {
                                  const iRank = Number(iNum.charAt(0));
                                  return acc + equip.v.partsRequire[iRank - 1];
                                }
                                const recipe = equipInfo.i;
                                const cost = Object.entries(recipe).reduce(
                                  (count, [ig, val]) => {
                                    const [, , igNum] = ig.split(".");
                                    const igRank = Number(igNum.charAt(0));
                                    return (
                                      count +
                                      val * equip.v.partsRequire[igRank - 1]
                                    );
                                  },
                                  0
                                );
                                return acc + cost;
                              }, 0)
                              .toLocaleString()}
                        </div>
                      </div>
                    )}
                    {es.length > 0 &&
                      showStats &&
                      ((stat: Record<string, number>) => {
                        const statOrder = [
                          "Hp",
                          "AttackPhysic",
                          "AttackMagic",
                          "DefensePhysic",
                          "DefenseMagic",
                          "CriticalRate",
                          "CriticalMult",
                          "CriticalResist",
                          "CriticalMultResist",
                        ];
                        return (
                          <div className="flex flex-col w-full items-stretch gap-1 px-1">
                            {statOrder.map((s) => {
                              return (
                                <div
                                  key={s}
                                  className="flex items-center justify-between"
                                >
                                  <img
                                    src={`/icons/Icon_${s}.png`}
                                    alt=""
                                    className="w-4 h-4"
                                  />
                                  <div className="text-sm">
                                    {(stat[s] || 0).toLocaleString()}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })(
                        es.reduce((acc, cur) => {
                          const [, iPart, iNum] = cur.split(".");
                          const equipInfo =
                            equip.e[iPart as "weapon" | "armor" | "accessory"][
                              iNum
                            ];
                          if (!equipInfo) return acc;
                          if (!("s" in equipInfo)) return acc;
                          const currentEquipStat = equipInfo.s;
                          return Object.fromEntries(
                            [
                              ...new Set([
                                ...Object.keys(acc),
                                ...Object.keys(currentEquipStat),
                              ]),
                            ].map((stat) => [
                              stat,
                              (acc[stat] || 0) +
                                (currentEquipStat[stat]
                                  ? Math.floor(
                                      (currentEquipStat[stat] *
                                        (showFullEnhanced
                                          ? 100 +
                                            equip.v.enhanceRate[
                                              Number(iNum.charAt(0)) - 1
                                            ][4]
                                          : 100)) /
                                        100
                                    )
                                  : 0),
                            ])
                          );
                        }, {} as Record<string, number>)
                      )}
                  </div>
                </div>
              );
            })
          : selectedEquip
          ? Object.entries(equip.c)
              .filter(([, sets]) => {
                const selectedRankIndex =
                  Number(selectedEquip.split(".")[2].substring(0, 1)) - 1;
                return sets[selectedRankIndex].includes(selectedEquip);
              })
              .map(([chara, sets]) => {
                const selectedRankIndex =
                  Number(selectedEquip.split(".")[2].substring(0, 1)) - 1;
                const eqSet = sets[selectedRankIndex];
                return (
                  <div key={chara}>
                    <div className="text-lg" onClick={() => searchChara(chara)}>
                      {t(`chara.${chara}`)}
                    </div>
                    <div
                      className={cn(
                        "flex flex-wrap justify-center gap-2 rounded-lg p-2 my-2",
                        showEquipName ? "w-48" : "w-32",
                        rankClassNames[selectedRankIndex][0]
                      )}
                    >
                      {eqSet.length ? (
                        <div className="grid grid-cols-2 gap-2">
                          {eqSet.map((e) => {
                            const [iType, iPart, iNum] = e.split(".");
                            const fileName = `/equips/Equip_${
                              { e: "", p: "Piece_", r: "Recipe_" }[iType]
                            }Icon_${iPart.charAt(0).toUpperCase()}${iPart.slice(
                              1
                            )}${iNum}`;
                            return (
                              <div
                                key={e}
                                onClick={() => searchEquip(e)}
                                className="flex flex-col items-center"
                              >
                                <ItemSlot
                                  item={fileName}
                                  size={3}
                                  fullItemPath
                                  rarityInfo={(() => {
                                    if (["9"].includes(iNum.charAt(0)))
                                      return { s: "Yellow" };
                                    if (
                                      ["7", "8", "9"].includes(iNum.charAt(0))
                                    )
                                      return { s: "Purple", b: "#B371F5" };
                                    if (["5", "6"].includes(iNum.charAt(0)))
                                      return { s: "Blue", b: "#65A7E9" };
                                    if (["3", "4"].includes(iNum.charAt(0)))
                                      return { s: "Green", b: "#65DD82" };
                                    return { s: "Gray", b: "#B0B0B0" };
                                  })()}
                                />
                                <div className="text-sm">
                                  {showEquipName &&
                                    (t(
                                      `equip.equip.${e.split(".")[1]}.${
                                        e.split(".")[2]
                                      }`
                                    ) ||
                                      t("ui.equip.unknownEquip"))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        "No Data"
                      )}
                    </div>
                  </div>
                );
              })
          : selectedRank
          ? Object.entries(
              Object.entries(equip.c)
                .filter(([, es]) => es[selectedRank - 1].length)
                .map(([name, es]) => {
                  const esValue =
                    sortBy[0] === -1
                      ? es[selectedRank - 1].reduce((acc, cur) => {
                          const [, iPart, iNum] = cur.split(".");
                          const equipInfo =
                            equip.e[iPart as "weapon" | "armor" | "accessory"][
                              iNum
                            ];
                          if (!equipInfo) return acc;
                          if (!("i" in equipInfo)) {
                            const iRank = Number(iNum.charAt(0));
                            return acc + equip.v.partsRequire[iRank - 1];
                          }
                          const recipe = equipInfo.i;
                          const cost = Object.entries(recipe).reduce(
                            (count, [ig, val]) => {
                              const [, , igNum] = ig.split(".");
                              const igRank = Number(igNum.charAt(0));
                              return (
                                count + val * equip.v.partsRequire[igRank - 1]
                              );
                            },
                            0
                          );
                          return acc + cost;
                        }, 0)
                      : es[selectedRank - 1].reduce((acc, cur) => {
                          const [, iPart, iNum] = cur.split(".");
                          const equipInfo =
                            equip.e[iPart as "weapon" | "armor" | "accessory"][
                              iNum
                            ];
                          if (!equipInfo) return acc;
                          if (!("s" in equipInfo)) return acc;
                          const currentEquipStat = equipInfo.s;
                          return Object.fromEntries(
                            [
                              ...new Set([
                                ...Object.keys(acc),
                                ...Object.keys(currentEquipStat),
                              ]),
                            ].map((stat) => [
                              stat,
                              (acc[stat] || 0) +
                                (currentEquipStat[stat]
                                  ? Math.floor(
                                      (currentEquipStat[stat] *
                                        (showFullEnhanced
                                          ? 100 +
                                            equip.v.enhanceRate[
                                              Number(iNum.charAt(0)) - 1
                                            ][4]
                                          : 100)) /
                                        100
                                    )
                                  : 0),
                            ])
                          );
                        }, {} as Record<string, number>)[StatType[sortBy[0]]] ||
                        0;
                  return [name, esValue] as [string, number];
                })
                .sort(([aName], [bName]) =>
                  t(`chara.${aName}`).localeCompare(t(`chara.${bName}`))
                )
                .reduce((prev, [aName, aPart]) => {
                  if (!prev[aPart]) prev[aPart] = [];
                  prev[aPart].push(aName);
                  return prev;
                }, {} as Record<string, string[]>)
            )
              .sort(([a], [b]) =>
                sortBy[1] ? Number(a) - Number(b) : Number(b) - Number(a)
              )
              .map(([part, names]) => {
                return (
                  <div key={part} className="flex flex-col gap-2 w-full">
                    <div
                      className={cn(
                        "flex justify-center gap-2 p-0.5 rounded items-center",
                        rankClassNames[selectedRank - 1][0]
                      )}
                    >
                      <img
                        src={
                          sortBy[0] === -1
                            ? "/icons/CurrencyIcon_0047.png"
                            : `/icons/Icon_${StatType[sortBy[0]]}.png`
                        }
                        className="w-5 h-5"
                      />
                      {Number(part).toLocaleString()}
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(5rem,_1fr))] gap-1">
                      {names.map((name) => {
                        return (
                          <div
                            key={name}
                            className="flex justify-between sm:min-w-16 md:min-w-20 max-w-32 rounded overflow-hidden border-slate-200 dark:border-slate-800 border-2 bg-slate-200 dark:bg-slate-800"
                            onClick={() => searchChara(name)}
                          >
                            <div className="flex flex-col items-center p-0 sm:min-w-16 sm:min-h-16 md:min-w-20 md:min-h-20 max-w-32 relative">
                              <img
                                src={`/charas/${name}.png`}
                                className={cn(
                                  "w-full aspect-square",
                                  personalityBG[
                                    Number(chara[name].t[0]) as Personality
                                  ]
                                )}
                              />
                              <div className="w-full -mt-3 bg-slate-200 dark:bg-slate-800 text-xs sm:text-sm break-keep flex-1 flex items-center justify-center py-0.5">
                                {t(`chara.${name}`)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
          : Object.entries(equip.c)
              .filter(([, es]) => !es.every((e) => e.length))
              .sort(([a], [b]) =>
                t(`chara.${a}`).localeCompare(t(`chara.${b}`))
              )
              .map(([charaId, es], idx) => {
                return (
                  <div
                    key={charaId}
                    className={cn(
                      "flex gap-2 px-4 py-1 items-center",
                      idx % 2 ? "bg-slate-200/25" : ""
                    )}
                  >
                    <div className="flex-1 text-left">
                      {t(`chara.${charaId}`)}
                    </div>
                    {es.map((c, i) => {
                      if (c.length) return null;
                      return (
                        <div
                          key={`${charaId}-${i}`}
                          className={cn(
                            rankClassNames[i][1],
                            "flex-0 opacity-100"
                          )}
                        >
                          {t("ui.equipviewer.rankText", { 0: i + 1 })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
      </div>
    </div>
  );
};

export default EquipViewer;
