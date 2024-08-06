import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import icSearch from "@/lib/initialConsonantSearch";
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
import {
  personalityBG,
  personalityBGDisabled,
  personalityBGMarked,
} from "@/utils/personalityBG";
import { Personality } from "@/types/enums";

import chara from "@/data/chara";
import food from "@/data/food";

import userdata from "@/utils/userdata";

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

const FoodCombobox = ({ value, onChange }: IComboboxOuterProp) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value ? t(`food.${value}`) : "");
  useEffect(() => {
    setV(value ? t(`food.${value}`) : "");
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
          {v ? v : t("ui.restaurant.selectFood")}
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
            placeholder={t("ui.restaurant.searchFood")}
            className="h-9"
          />
          <CommandEmpty>{t("ui.restaurant.foodNotFound")}</CommandEmpty>
          <ScrollArea className="max-h-[70vh] [&_[data-radix-scroll-area-viewport]]:max-h-[70vh]">
            <CommandList>
              <CommandGroup className="[&_[cmdk-group-items]]:grid [&_[cmdk-group-items]]:grid-cols-2 md:[&_[cmdk-group-items]]:grid-cols-3 [&_[cmdk-group-items]]:gap-1 p-2">
                {Object.keys(food.f)
                  .sort((a, b) => t(`food.${a}`).localeCompare(t(`food.${b}`)))
                  .map((foodId) => {
                    const selected = v === t(`food.${foodId}`);
                    return (
                      <CommandItem
                        key={foodId}
                        value={t(`food.${foodId}`)}
                        onSelect={(currentValue) => {
                          setV(currentValue === v ? "" : currentValue);
                          onChange(currentValue === v ? "" : foodId);
                          setOpen(false);
                        }}
                      >
                        <div className="w-full relative flex flex-col items-center py-0.5">
                          <div className="text-sm text-center break-keep absolute h-12 -top-1 flex items-center">
                            {t(`food.${foodId}`)}
                          </div>
                          <div className="flex w-[5.8125rem] h-[5.8125rem] md:w-[calc(19.375rem_/_3)] md:h-[calc(19.375rem_/_3)] px-4 pt-6 pb-3 mt-4 justify-center items-end bg-dish bg-cover bg-no-repeat">
                            <img
                              src={`/foods/Icon_Food_${foodId}.png`}
                              className="max-w-full max-h-full"
                            />
                          </div>
                          {selected && (
                            <div className="h-6 w-6 p-1 absolute -top-0.5 -right-1 rounded-full bg-slate-100/80 dark:bg-slate-900/80">
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
  const [skinData, setSkinData] = useState<Record<string, number>>({});
  useEffect(() => {
    setSkinData(userdata.skin.load());
  }, []);
  const [selectedChara, setSelectedChara] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  // const [selectedMaterial, setSelectedMaterial] = useState("");
  const [producibleOnly, setProducibleOnly] = useState(false);
  const [showValue, setShowValue] = useState(false);
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

  return (
    <>
      <div className="w-full h-4" />
      <Card className="mx-auto w-max max-w-full p-4 font-onemobile">
        <div className="flex flex-col p-2 gap-4">
          <div className="flex flex-col sm:flex-row p-2 gap-2">
            <CharacterCombobox value={selectedChara} onChange={searchChara} />
            <FoodCombobox value={selectedFood} onChange={searchFood} />
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
          </div>
        </div>
      </Card>
      <div className="font-onemobile flex justify-center p-4 max-w-full">
        {selectedChara && (
          <div className="bg-foodcard ring-2 ring-foodcard-border rounded-lg p-4 min-w-60 max-w-full flex flex-col sm:flex-row gap-4">
            <div className="flex flex-row justify-center">
              <div className="w-max p-1.5 bg-foodcard-frame relative">
                <img
                  src={`/charas/${selectedChara}.png`}
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
                <div>{t("ui.restaurant.favoriteFood")}</div>
                <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
                  <div className="flex w-max min-w-full space-x-2 p-2 justify-center">
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
                  <div className="flex w-max min-w-full space-x-2 p-2 justify-center">
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
                <div className="flex w-48 h-48 px-10 pt-12 pb-8 justify-center items-end bg-dish bg-cover bg-no-repeat -mt-4">
                  <img
                    src={`/foods/Icon_Food_${selectedFood}.png`}
                    className="max-w-full max-h-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between w-full overflow-hidden">
              <div className="w-full overflow-hidden">
                <div>{t("ui.restaurant.lovingCharacter")}</div>
                <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
                  <div className="flex w-max min-w-full space-x-2 p-2 justify-center">
                    {Object.entries(food.c)
                      .filter(([, foodList]) =>
                        foodList[1].includes(Number(selectedFood))
                      )
                      .map(([c]) => {
                        return (
                          <div
                            key={c}
                            className="relative"
                            onClick={() => {
                              searchChara(c);
                            }}
                          >
                            <img
                              src={
                                skinData[c]
                                  ? `/charas/${c}Skin${skinData[c]}.png`
                                  : `/charas/${c}.png`
                              }
                              className={cn(
                                "rounded w-16 h-16",
                                personalityBG[
                                  Number(chara[c].t[0]) as Personality
                                ]
                              )}
                            />
                          </div>
                        );
                      })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              <div className="w-full overflow-hidden">
                <div>
                  {Object.entries(food.c).filter(([, foodList]) =>
                    foodList[3].includes(Number(selectedFood))
                  ).length
                    ? t("ui.restaurant.hatingCharacter")
                    : t("ui.restaurant.indifferenceCharacter")}
                </div>
                <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
                  <div className="flex w-max min-w-full space-x-2 p-2 justify-center">
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
                      return (
                        <div
                          key={c}
                          className="relative"
                          onClick={() => {
                            searchChara(c);
                          }}
                        >
                          <img
                            src={
                              skinData[c]
                                ? `/charas/${c}Skin${skinData[c]}.png`
                                : `/charas/${c}.png`
                            }
                            className={cn(
                              "rounded w-16 h-16",
                              personalityBG[
                                Number(chara[c].t[0]) as Personality
                              ]
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
            ];
          if (selectedFood)
            return [
              "ui.restaurant.characterScrollableNotice",
              "ui.restaurant.tapCharacterToSearch",
            ];
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
                <div className="flex flex-row justify-center">
                  <div className="w-max p-1.5 bg-foodcard-frame relative">
                    <img
                      src={`/charas/${c}.png`}
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
