import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import icSearch from "@/lib/initialConsonantSearch";
import Loading from "@/components/common/loading";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ItemSlot from "@/components/parts/item-slot";
import ComboboxFood from "@/components/parts/combobox-food";
import {
  personalityBG,
  personalityBGDisabled,
  personalityBGMarked,
} from "@/utils/personalityBG";
import { Personality } from "@/types/enums";

import chara from "@/data/chara";
import food from "@/data/food";
import material from "@/data/material";
import {
  useUserDataStatus,
  useUserDataCharaInfo,
} from "@/stores/useUserDataStore";

// af
import { useIsAFActive } from "@/stores/useAFDataStore";
import { getCharaImageUrl } from "@/utils/getImageUrl";

interface IComboboxOuterProp {
  value: string;
  onChange: (value: string) => void;
}

export const CharacterComboboxFood = ({
  value,
  onChange,
}: IComboboxOuterProp) => {
  const { t } = useTranslation();
  const isAF = useIsAFActive();
  const userCharaInfo = useUserDataCharaInfo();
  const [open, setOpen] = useState<boolean>(false);
  const [v, setV] = useState<string>(value ? t(`chara.${value}`) : "");
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
          {v ? v : t("ui.restaurant.selectCharacter")}
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
            placeholder={t("ui.restaurant.searchCharacter")}
            className="h-9"
          />
          <CommandEmpty>{t("ui.restaurant.characterNotFound")}</CommandEmpty>
          <ScrollArea className="max-h-[70vh] [&_[data-radix-scroll-area-viewport]]:max-h-[70vh]">
            <CommandList>
              <CommandGroup className="[&_[cmdk-group-items]]:grid [&_[cmdk-group-items]]:grid-cols-2 md:[&_[cmdk-group-items]]:grid-cols-3 [&_[cmdk-group-items]]:gap-1 p-2">
                {Object.keys(chara)
                  .sort((a, b) =>
                    t(`chara.${a}`).localeCompare(t(`chara.${b}`))
                  )
                  .map((charaId) => {
                    const disabled = !Object.keys(food.c).includes(charaId);
                    const selected = v === t(`chara.${charaId}`);
                    const bg = (() => {
                      if (disabled)
                        return personalityBGDisabled[
                          Number(chara[charaId].t[0]) as Personality
                        ];
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
                        className={cn(
                          "p-0 rounded-lg",
                          disabled && "data-disabled"
                        )}
                        value={t(`chara.${charaId}`)}
                        disabled={disabled}
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
                            src={getCharaImageUrl(
                              userCharaInfo?.[charaId].skin
                                ? `${charaId}Skin${userCharaInfo[charaId].skin}`
                                : `${charaId}`,
                              isAF && "af-i"
                            )}
                            className={cn(
                              "w-full aspect-square",
                              isAF && "scale-125"
                            )}
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

const Restaurant = () => {
  const { t } = useTranslation();
  const dataStatus = useUserDataStatus();
  const userDataCharaInfo = useUserDataCharaInfo();
  const isAF = useIsAFActive();
  const [selectedChara, setSelectedChara] = useState<string>("");
  const [selectedFood, setSelectedFood] = useState<string>("");
  // const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [producibleOnly, setProducibleOnly] = useState<boolean>(false);
  const [showValue, setShowValue] = useState<boolean>(false);
  const [showIngredients, setShowIngredients] = useState<boolean>(false);
  const [listScroll, setListScroll] = useState<boolean>(false);
  const searchChara = useCallback((charaId: string) => {
    setSelectedChara(charaId);
    setSelectedFood("");
    // setSelectedMaterial("");
  }, []);
  const searchFood = useCallback((foodId: string) => {
    setSelectedChara("");
    setSelectedFood(foodId);
    // setSelectedMaterial("");
  }, []);
  // const searchMaterial = useCallback((materialId: string) => {
  //   setSelectedChara("");
  //   setSelectedFood("");
  //   setSelectedMaterial(materialId);
  // }, []);

  if (dataStatus !== "initialized" || !userDataCharaInfo) return <Loading />;

  return (
    <>
      <div className="w-full h-4" />
      <Card className="mx-auto w-max max-w-full p-4 font-onemobile">
        <div className="flex flex-col p-2 gap-4">
          <div className="flex flex-col sm:flex-row p-2 gap-2">
            <CharacterComboboxFood
              value={selectedChara}
              onChange={searchChara}
            />
            <ComboboxFood value={selectedFood} onChange={searchFood} />
          </div>
          <div className="flex flex-col gap-2">
            {!selectedFood && (
              <div className="flex items-center gap-1.5">
                <Checkbox
                  id="producible-only"
                  checked={producibleOnly}
                  onCheckedChange={(v) => setProducibleOnly(Boolean(v))}
                />
                <label
                  htmlFor="producible-only"
                  className="text-sm font-onemobile"
                >
                  {t("ui.restaurant.producibleOnly")}
                </label>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Checkbox
                id="show-value"
                checked={showValue}
                onCheckedChange={(v) => setShowValue(Boolean(v))}
              />
              <label htmlFor="show-value" className="text-sm font-onemobile">
                {t("ui.restaurant.showValue")}
              </label>
            </div>
            {selectedFood && (
              <div className="flex items-center gap-1.5">
                <Checkbox
                  id="show-ingredients"
                  checked={showIngredients}
                  onCheckedChange={(v) => setShowIngredients(Boolean(v))}
                />
                <label
                  htmlFor="show-ingredients"
                  className="text-sm font-onemobile"
                >
                  {t("ui.restaurant.showIngredients")}
                </label>
              </div>
            )}
            {!!(selectedChara || selectedFood) && (
              <div className="flex items-center gap-1.5">
                <Checkbox
                  id="list-scroll"
                  checked={listScroll}
                  onCheckedChange={(v) => setListScroll(!!v)}
                />
                <label
                  htmlFor="list-scroll"
                  className="text-sm font-onemobile"
                >
                  {t("ui.restaurant.listScroll")}
                </label>
              </div>
            )}
          </div>
        </div>
      </Card>
      <div className="font-onemobile flex justify-center p-4 max-w-full">
        {selectedChara && (
          <div className="bg-foodcard ring-2 ring-foodcard-border rounded-lg p-4 min-w-60 max-w-full flex flex-col sm:flex-row gap-4">
            <div className="flex flex-row justify-center items-start">
              <div className="w-max p-1.5 bg-foodcard-frame relative">
                <img
                  src={getCharaImageUrl(
                    userDataCharaInfo?.[selectedChara].skin
                      ? `${selectedChara}Skin${userDataCharaInfo[selectedChara].skin}`
                      : `${selectedChara}`,
                    isAF && "af-i"
                  )}
                  className="w-48 h-48 bg-restaurant bg-cover bg-no-repeat"
                />
                <div className="relative -mt-8 pt-1.5 z-10 bg-foodcard-frame">
                  <div
                    className="text-2xl text-slate-900"
                    style={{
                      textShadow: Array(30).fill("0 0 3px #fff").join(", "),
                    }}
                  >
                    {t(`chara.${selectedChara}`)}
                  </div>
                </div>
                <img
                  src="/foods/Deco_Clip.png"
                  className="absolute -left-px -top-[1.7rem] h-[2.75rem]"
                />
              </div>
            </div>
            <div className="flex flex-col justify-between w-full overflow-hidden">
              <div className="w-full overflow-hidden">
                <div>{t("ui.restaurant.mostFavoriteFood")}</div>
                <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
                  <div className={cn("flex gap-2 p-2 justify-center", listScroll ? "w-max min-w-full" : "flex-wrap")}>
                    {food.c[selectedChara][5].map((fid) => {
                      if (!food.f[fid].t && producibleOnly) return null;
                      return (
                        <div
                          key={fid}
                          className="relative"
                          onClick={() => searchFood(fid.toString(10))}
                        >
                          <ItemSlot
                            rarityInfo={food.r[food.f[fid].r]}
                            item={`/foods/Icon_Food_${fid}`}
                            fullItemPath
                            amount={
                              showValue
                                ? `+${food.p[food.f[fid].r][4] + 1}~${
                                    food.p[food.f[fid].r][4] + 3
                                  }`
                                : undefined
                            }
                            size={4}
                            innerSize={60}
                          />
                          <img
                            src="/foods/MyHomeRestaurant_FeelingStatus_5.png"
                            className="absolute w-5 aspect-[28/25] -top-1 -right-1"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              <div className="w-full overflow-hidden">
                <div>{t("ui.restaurant.favoriteFood")}</div>
                <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
                  <div className={cn("flex gap-2 p-2 justify-center", listScroll ? "w-max min-w-full" : "flex-wrap")}>
                    {food.c[selectedChara][1].map((fid) => {
                      if (!food.f[fid].t && producibleOnly) return null;
                      return (
                        <div
                          key={fid}
                          className="relative"
                          onClick={() => searchFood(fid.toString(10))}
                        >
                          <ItemSlot
                            rarityInfo={food.r[food.f[fid].r]}
                            item={`/foods/Icon_Food_${fid}`}
                            fullItemPath
                            amount={
                              showValue
                                ? `+${food.p[food.f[fid].r][0] + 1}~${
                                    food.p[food.f[fid].r][0] + 3
                                  }`
                                : undefined
                            }
                            size={4}
                            innerSize={60}
                          />
                          <img
                            src="/foods/MyHomeRestaurant_FeelingStatus_1.png"
                            className="absolute w-5 aspect-[28/25] -top-1 -right-1"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              <div className="w-full overflow-hidden">
                <div>{t("ui.restaurant.dislikeFood")}</div>
                <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
                  <div className={cn("flex gap-2 p-2 justify-center", listScroll ? "w-max min-w-full" : "flex-wrap")}>
                    {food.c[selectedChara][3].map((fid) => {
                      if (!food.f[fid].t && producibleOnly) return null;
                      return (
                        <div
                          key={fid}
                          className="relative"
                          onClick={() => searchFood(fid.toString(10))}
                        >
                          <ItemSlot
                            rarityInfo={food.r[food.f[fid].r]}
                            item={`/foods/Icon_Food_${fid}`}
                            fullItemPath
                            amount={
                              showValue
                                ? `+${food.p[food.f[fid].r][2] + 1}~${
                                    food.p[food.f[fid].r][2] + 3
                                  }`
                                : undefined
                            }
                            size={4}
                            innerSize={60}
                          />
                          <img
                            src="/foods/MyHomeRestaurant_FeelingStatus_3.png"
                            className="absolute w-5 aspect-[28/25] -top-1 -right-1"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              {showValue && (
                <div className="w-full">
                  <div>{t("ui.restaurant.indifferenceFood")}</div>
                  <div className="w-full flex flex-row flex-wrap justify-stretch items-center p-2 gap-2 rounded-lg bg-background/80 dark:bg-background/50">
                    {food.r.map((v, i) => {
                      return (
                        <div
                          key={i}
                          className="flex flex-row flex-1 items-center gap-0.5 justify-center"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: v.b }}
                          />
                          <div className="text-sm text-center">
                            +{food.p[i][1] + 1}~{food.p[i][1] + 3}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {selectedFood && (
          <div className="bg-foodcard ring-2 ring-foodcard-border rounded-lg p-4 min-w-60 max-w-full flex flex-col sm:flex-row gap-4">
            <div className="flex flex-row justify-center">
              <div className="w-max p-1.5 relative">
                <div
                  className="text-xl text-slate-900"
                  style={{
                    textShadow: Array(30).fill("0 0 3px #fff").join(", "),
                  }}
                >
                  {t(`food.${selectedFood}`)}
                </div>
                {showValue && (
                  <div className="absolute w-full text-lg pr-3">{`+${
                    food.p[food.f[selectedFood].r][1] + 1
                  }~${food.p[food.f[selectedFood].r][1] + 3}`}</div>
                )}
                <div className="flex w-48 h-48 px-10 pt-12 pb-8 justify-center items-end bg-dish bg-cover bg-no-repeat -mt-4 mx-auto">
                  <img
                    src={`/foods/Icon_Food_${selectedFood}.png`}
                    className="max-w-full max-h-full"
                  />
                </div>
                {showIngredients && (
                  <div className="flex -mt-12 gap-1 justify-center">
                    {food.f[selectedFood].m ? (
                      Object.entries(food.f[selectedFood].m).map(([k, v]) => {
                        if (Number.isNaN(Number(k))) {
                          const mat = material.m[k];
                          const rarity = material.r[mat.r];
                          return (
                            <ItemSlot
                              key={k}
                              rarityInfo={rarity}
                              item={k}
                              amount={v}
                              size={3.5}
                            />
                          );
                        } else {
                          const mat = food.f[k];
                          const rarity = food.r[mat.r];
                          return (
                            <ItemSlot
                              key={k}
                              rarityInfo={rarity}
                              item={`/foods/Icon_Food_${k}`}
                              fullItemPath
                              amount={v}
                              size={3.5}
                            />
                          );
                        }
                      })
                    ) : (
                      <div className="rounded-full px-4 py-0.5 bg-rose-300 dark:bg-rose-700">
                        {t("ui.restaurant.uncookable")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between w-full overflow-hidden">
              {food.f[selectedFood].d && (
                <div className="w-full overflow-hidden">
                  <div>{t("ui.restaurant.mostLovingCharacter")}</div>
                  <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
                    <div className={cn("flex gap-2 p-2 justify-center", listScroll ? "w-max min-w-full" : "flex-wrap")}>
                      {Object.entries(food.c)
                        .filter(([, foodList]) =>
                          foodList[5].includes(Number(selectedFood))
                        )
                        .map(([c]) => {
                          const { skin } = userDataCharaInfo[c];
                          return (
                            <div
                              key={c}
                              className={cn(
                                "relative rounded w-16 h-16",
                                personalityBG[
                                  Number(chara[c].t[0]) as Personality
                                ]
                              )}
                              onClick={() => {
                                searchChara(c);
                              }}
                            >
                              <img
                                src={getCharaImageUrl(
                                  skin ? `${c}Skin${skin}` : `${c}`,
                                  isAF && "af-i"
                                )}
                                className={cn(
                                  "rounded w-16 h-16",
                                  isAF && "scale-125"
                                )}
                              />
                            </div>
                          );
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              )}
              <div className="w-full overflow-hidden">
                <div>{t("ui.restaurant.lovingCharacter")}</div>
                <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
                  <div className={cn("flex gap-2 p-2 justify-center", listScroll ? "w-max min-w-full" : "flex-wrap")}>
                    {Object.entries(food.c)
                      .filter(([, foodList]) =>
                        foodList[1].includes(Number(selectedFood))
                      )
                      .map(([c]) => {
                        const { skin } = userDataCharaInfo[c];
                        return (
                          <div
                            key={c}
                            className={cn(
                              "relative rounded w-16 h-16",
                              personalityBG[
                                Number(chara[c].t[0]) as Personality
                              ]
                            )}
                            onClick={() => {
                              searchChara(c);
                            }}
                          >
                            <img
                              src={getCharaImageUrl(
                                skin ? `${c}Skin${skin}` : `${c}`,
                                isAF && "af-i"
                              )}
                              className={cn(
                                "rounded w-16 h-16",
                                isAF && "scale-125"
                              )}
                            />
                          </div>
                        );
                      })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              {!food.f[selectedFood].d && (
                <div className="w-full overflow-hidden">
                  <div>
                    {Object.entries(food.c).filter(([, foodList]) =>
                      foodList[3].includes(Number(selectedFood))
                    ).length
                      ? t("ui.restaurant.hatingCharacter")
                      : t("ui.restaurant.indifferenceCharacter")}
                  </div>
                  <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
                    <div className={cn("flex gap-2 p-2 justify-center", listScroll ? "w-max min-w-full" : "flex-wrap")}>
                      {(Object.entries(food.c).filter(([, foodList]) =>
                        foodList[3].includes(Number(selectedFood))
                      ).length
                        ? Object.entries(food.c).filter(([, foodList]) =>
                            foodList[3].includes(Number(selectedFood))
                          )
                        : Object.entries(food.c).filter(
                            ([, foodList]) =>
                              !foodList[1].includes(Number(selectedFood)) &&
                              !foodList[3].includes(Number(selectedFood))
                          )
                      ).map(([c]) => {
                        const { skin } = userDataCharaInfo[c];
                        return (
                          <div
                            key={c}
                            className={cn(
                              "relative rounded w-16 h-16",
                              personalityBG[
                                Number(chara[c].t[0]) as Personality
                              ]
                            )}
                            onClick={() => {
                              searchChara(c);
                            }}
                          >
                            <img
                              src={getCharaImageUrl(
                                skin ? `${c}Skin${skin}` : `${c}`,
                                isAF && "af-i"
                              )}
                              className={cn(
                                "rounded w-16 h-16",
                                isAF && "scale-125"
                              )}
                            />
                          </div>
                        );
                      })}
                      {Object.entries(food.c).every(([, foodList]) =>
                        foodList[1].includes(Number(selectedFood))
                      ) && (
                        <div className="h-16 opacity-75">
                          {t("ui.restaurant.everyoneLoves")}
                        </div>
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div
        className={cn(
          "font-onemobile",
          !selectedChara && !selectedFood
            ? "text-lg mb-4"
            : "text-xs opacity-90 mt-1"
        )}
      >
        {(() => {
          if (selectedChara)
            return [
              "ui.restaurant.foodScrollableNotice",
              "ui.restaurant.tapFoodToSearch",
            ].slice(listScroll ? 0 : 1);
          if (selectedFood)
            return [
              "ui.restaurant.characterScrollableNotice",
              "ui.restaurant.tapCharacterToSearch",
            ].slice(listScroll ? 0 : 1);
          return ["ui.restaurant.needToSelect"];
        })().map((tKey) => {
          return <div key={tKey}>{t(tKey)}</div>;
        })}
      </div>
      {!selectedChara && !selectedFood && (
        <div className="flex flex-wrap justify-center p-4 gap-x-4 gap-y-6 font-onemobile">
          {Object.keys(food.c).map((c) => {
            return (
              <div
                key={c}
                className="bg-foodcard ring-2 ring-foodcard-border rounded-lg p-4 min-w-60 max-w-full flex flex-col sm:flex-row gap-4"
              >
                <div className="flex flex-row justify-center items-start">
                  <div
                    className="w-max p-1.5 bg-foodcard-frame relative"
                    onClick={() => {
                      setSelectedChara(c);
                    }}
                  >
                    <img
                      src={getCharaImageUrl(
                        userDataCharaInfo[c].skin
                          ? `${c}Skin${userDataCharaInfo[c].skin}`
                          : `${c}`,
                        isAF && "af-i"
                      )}
                      className="w-48 h-48 bg-restaurant bg-cover bg-no-repeat"
                    />
                    <div className="relative -mt-8 pt-1.5 z-10 bg-foodcard-frame">
                      <div
                        className="text-2xl text-slate-900"
                        style={{
                          textShadow: Array(30).fill("0 0 3px #fff").join(", "),
                        }}
                      >
                        {t(`chara.${c}`)}
                      </div>
                    </div>
                    <img
                      src="/foods/Deco_Clip.png"
                      className="absolute -left-px -top-[1.7rem] h-[2.75rem]"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between w-full overflow-hidden">
                  {food.c[c][5].length === 1 && (
                    <div className="w-full overflow-hidden">
                      <div>{t("ui.restaurant.mostFavoriteFood")}</div>
                      <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
                        <div className="flex w-max min-w-full space-x-2 p-2 justify-center">
                          {food.c[c][5].length === 1 &&
                            food.c[c][5].map((fid) => {
                              if (!food.f[fid].t) return null;
                              return (
                                <div
                                  key={fid}
                                  className="relative"
                                  onClick={() => searchFood(fid.toString(10))}
                                >
                                  <ItemSlot
                                    rarityInfo={food.r[food.f[fid].r]}
                                    item={`/foods/Icon_Food_${fid}`}
                                    fullItemPath
                                    amount={
                                      showValue
                                        ? `+${food.p[food.f[fid].r][4] + 1}~${
                                            food.p[food.f[fid].r][4] + 3
                                          }`
                                        : undefined
                                    }
                                    size={4}
                                    innerSize={60}
                                  />
                                  <img
                                    src="/foods/MyHomeRestaurant_FeelingStatus_5.png"
                                    className="absolute w-5 aspect-[28/25] -top-1 -right-1"
                                  />
                                </div>
                              );
                            })}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                  )}
                  <div className="w-full overflow-hidden">
                    <div>{t("ui.restaurant.favoriteFood")}</div>
                    <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
                      <div className="flex w-max min-w-full space-x-2 p-2 justify-center">
                        {food.c[c][1].map((fid) => {
                          if (!food.f[fid].t) return null;
                          return (
                            <div
                              key={fid}
                              className="relative"
                              onClick={() => searchFood(fid.toString(10))}
                            >
                              <ItemSlot
                                rarityInfo={food.r[food.f[fid].r]}
                                item={`/foods/Icon_Food_${fid}`}
                                fullItemPath
                                amount={
                                  showValue
                                    ? `+${food.p[food.f[fid].r][0] + 1}~${
                                        food.p[food.f[fid].r][0] + 3
                                      }`
                                    : undefined
                                }
                                size={4}
                                innerSize={60}
                              />
                              <img
                                src="/foods/MyHomeRestaurant_FeelingStatus_1.png"
                                className="absolute w-5 aspect-[28/25] -top-1 -right-1"
                              />
                            </div>
                          );
                        })}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <div className="w-full overflow-hidden">
                    <div>{t("ui.restaurant.dislikeFood")}</div>
                    <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
                      <div className="flex w-max min-w-full space-x-2 p-2 justify-center">
                        {food.c[c][3].map((fid) => {
                          if (!food.f[fid].t) return null;
                          return (
                            <div
                              key={fid}
                              className="relative"
                              onClick={() => searchFood(fid.toString(10))}
                            >
                              <ItemSlot
                                rarityInfo={food.r[food.f[fid].r]}
                                item={`/foods/Icon_Food_${fid}`}
                                fullItemPath
                                amount={
                                  showValue
                                    ? `+${food.p[food.f[fid].r][2] + 1}~${
                                        food.p[food.f[fid].r][2] + 3
                                      }`
                                    : undefined
                                }
                                size={4}
                                innerSize={60}
                              />
                              <img
                                src="/foods/MyHomeRestaurant_FeelingStatus_3.png"
                                className="absolute w-5 aspect-[28/25] -top-1 -right-1"
                              />
                            </div>
                          );
                        })}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Restaurant;
