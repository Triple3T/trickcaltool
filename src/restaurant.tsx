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
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ItemSlot from "@/components/parts/item-slot";

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
      <PopoverContent className="w-60 p-0 font-onemobile">
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
          <CommandGroup>
            {Object.keys(chara)
              .sort((a, b) => t(`chara.${a}`).localeCompare(t(`chara.${b}`)))
              .map((charaId) => (
                <CommandItem
                  key={charaId}
                  value={t(`chara.${charaId}`)}
                  disabled={!Object.keys(food.c).includes(charaId)}
                  onSelect={(currentValue) => {
                    setV(currentValue === v ? "" : currentValue);
                    onChange(currentValue === v ? "" : charaId);
                    setOpen(false);
                  }}
                >
                  {t(`chara.${charaId}`)}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      v === t(`chara.${charaId}`) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
          </CommandGroup>
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
      <PopoverContent className="w-60 p-0 font-onemobile">
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
          <CommandGroup>
            {Object.keys(food.f)
              .sort((a, b) => t(`food.${a}`).localeCompare(t(`food.${b}`)))
              .map((foodId) => (
                <CommandItem
                  key={foodId}
                  value={t(`food.${foodId}`)}
                  onSelect={(currentValue) => {
                    setV(currentValue === v ? "" : currentValue);
                    onChange(currentValue === v ? "" : foodId);
                    setOpen(false);
                  }}
                >
                  {t(`food.${foodId}`)}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      v === t(`food.${foodId}`) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
          </CommandGroup>
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
          <div className="bg-[#eee8d8] ring-2 ring-[#e2d2c3] rounded-lg p-4 min-w-60 max-w-full flex flex-col sm:flex-row gap-4">
            <div className="flex flex-row justify-center">
              <div className="w-max p-1.5 bg-[#55355e] relative">
                <img
                  src={`/charas/${selectedChara}.png`}
                  className="w-48 h-48 bg-restaurant bg-cover bg-no-repeat"
                />
                <div className="relative -mt-8 pt-1.5 z-10 bg-[#55355e]">
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
                  className="absolute -left-px -top-[27.2px] h-[44px]"
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
          <div className="bg-[#eee8d8] ring-2 ring-[#e2d2c3] rounded-lg p-4 min-w-60 max-w-full flex flex-col sm:flex-row gap-4">
            <div className="flex flex-row justify-center">
              <div className="w-max p-1.5 relative">
                <div
                  className="text-2xl text-slate-900"
                  style={{
                    textShadow: Array(30).fill("0 0 3px #fff").join(", "),
                  }}
                >
                  {t(`food.${selectedFood}`)}
                </div>
                {showValue && (
                  <div className="absolute w-full text-lg pr-3">{`+${
                    food.p[food.f[selectedFood].r][2] + 1
                  }~${food.p[food.f[selectedFood].r][2] + 3}`}</div>
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
                                [
                                  "bg-personality-Cool",
                                  "bg-personality-Gloomy",
                                  "bg-personality-Jolly",
                                  "bg-personality-Mad",
                                  "bg-personality-Naive",
                                ][Number(chara[c].t[0])]
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
                <div>{t("ui.restaurant.hatingCharacter")}</div>
                <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
                  <div className="flex w-max min-w-full space-x-2 p-2 justify-center">
                    {Object.entries(food.c)
                      .filter(([, foodList]) =>
                        foodList[3].includes(Number(selectedFood))
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
                                [
                                  "bg-personality-Cool",
                                  "bg-personality-Gloomy",
                                  "bg-personality-Jolly",
                                  "bg-personality-Mad",
                                  "bg-personality-Naive",
                                ][Number(chara[c].t[0])]
                              )}
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
                className="bg-[#eee8d8] ring-2 ring-[#e2d2c3] rounded-lg p-4 min-w-60 max-w-full flex flex-col sm:flex-row gap-4"
              >
                <div className="flex flex-row justify-center">
                  <div className="w-max p-1.5 bg-[#55355e] relative">
                    <img
                      src={`/charas/${c}.png`}
                      className="w-48 h-48 bg-restaurant bg-cover bg-no-repeat"
                    />
                    <div className="relative -mt-8 pt-1.5 z-10 bg-[#55355e]">
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
                      className="absolute -left-px -top-[27.2px] h-[44px]"
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
