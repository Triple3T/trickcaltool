import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import LazyInput from "@/components/common/lazy-input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ComboboxFood from "@/components/parts/combobox-food";
import ItemSlot from "@/components/parts/item-slot";
import SubtitleBar from "@/components/parts/subtitlebar";
import food from "@/data/food";
import level from "@/data/level";

// af
import { useIsAFActive } from "@/stores/useAFDataStore";
import { getCharaImageUrl } from "@/utils/getImageUrl";

interface EquipViewerProps {
  charaName: string;
  skin?: number;
}

const getValuePlusRangeString = (value: number) => `+${value + 1}~${value + 3}`;

const FoodTasteViewer = ({ charaName, skin }: EquipViewerProps) => {
  const { t } = useTranslation();
  const isAF = useIsAFActive();
  const [prevLevel, setPrevLevel] = useState<number>(1);
  const [prevExp, setPrevExp] = useState<number>(0);
  const [plusValue, setPlusValue] = useState<number>(5);
  const [additionalPlusValue, setAdditionalPlusValue] = useState<number>(1);
  const [foodId, setFoodId] = useState<string>("");

  useEffect(() => {
    if (!foodId) return;
    const foodPlusRow = food.p[food.f[foodId].r];
    if (food.c[charaName][1].includes(Number(foodId)))
      setPlusValue(foodPlusRow[0] + additionalPlusValue);
    else if (food.c[charaName][3].includes(Number(foodId)))
      setPlusValue(foodPlusRow[2] + additionalPlusValue);
    else if (food.c[charaName][5].includes(Number(foodId)))
      setPlusValue(foodPlusRow[4] + additionalPlusValue);
    else setPlusValue(foodPlusRow[1] + additionalPlusValue);
  }, [additionalPlusValue, charaName, foodId]);

  const calcResult = useMemo(() => {
    if (level.f[prevLevel - 1] > prevExp + plusValue)
      return [prevLevel, prevExp + plusValue];
    if (prevLevel === 29 && level.f[28] <= prevExp + plusValue) return [30, 0];
    let afterLevel = prevLevel;
    let leftExp = plusValue - (level.f[prevLevel] - prevExp);
    while (leftExp >= 0 && afterLevel < 30) {
      afterLevel++;
      leftExp -= level.f[afterLevel - 2];
    }
    if (afterLevel === 30) return [30, 0];
    const finalLeft = level.f[afterLevel - 1] + leftExp;
    return [afterLevel, finalLeft];
  }, [plusValue, prevExp, prevLevel]);

  if (!Object.keys(food.c).includes(charaName))
    return <div className="mt-4">{t("ui.personal.noRestaurantData")}</div>;
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 justify-center md:justify-center md:items-start">
      <div className="flex flex-col flex-wrap gap-4 justify-center">
        <div>
          <SubtitleBar>{t("ui.restaurant.favoriteFood")}</SubtitleBar>
          <div className="flex flex-row flex-wrap gap-2 mt-2 justify-center">
            {food.c[charaName][5].map((fid) => {
              if (!food.f[fid].t) return null;
              return (
                <div key={fid} className="relative">
                  <ItemSlot
                    rarityInfo={food.r[food.f[fid].r]}
                    item={`/foods/Icon_Food_${fid}`}
                    fullItemPath
                    size={3.25}
                    innerSize={60}
                  />
                  <img
                    src="/foods/MyHomeRestaurant_FeelingStatus_5.png"
                    className="absolute w-5 aspect-[28/25] -top-1 -right-1"
                  />
                  <div className="text-sm">
                    {getValuePlusRangeString(food.p[food.f[fid].r][4])}
                  </div>
                </div>
              );
            })}
            {food.c[charaName][1].map((fid) => {
              if (!food.f[fid].t) return null;
              return (
                <div key={fid} className="relative">
                  <ItemSlot
                    rarityInfo={food.r[food.f[fid].r]}
                    item={`/foods/Icon_Food_${fid}`}
                    fullItemPath
                    size={3.25}
                    innerSize={60}
                  />
                  <img
                    src="/foods/MyHomeRestaurant_FeelingStatus_1.png"
                    className="absolute w-5 aspect-[28/25] -top-1 -right-1"
                  />
                  <div className="text-sm">
                    {getValuePlusRangeString(food.p[food.f[fid].r][0])}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <SubtitleBar>{t("ui.restaurant.dislikeFood")}</SubtitleBar>
          <div className="flex flex-row flex-wrap gap-2 mt-2 justify-center">
            {food.c[charaName][3].map((fid) => {
              if (!food.f[fid].t) return null;
              return (
                <div key={fid} className="relative">
                  <ItemSlot
                    rarityInfo={food.r[food.f[fid].r]}
                    item={`/foods/Icon_Food_${fid}`}
                    fullItemPath
                    size={3.25}
                    innerSize={60}
                  />
                  <img
                    src="/foods/MyHomeRestaurant_FeelingStatus_3.png"
                    className="absolute w-5 aspect-[28/25] -top-1 -right-1"
                  />
                  <div className="text-sm">
                    {getValuePlusRangeString(food.p[food.f[fid].r][2])}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div>
        <SubtitleBar>{t("ui.personal.valueCalcTitle")}</SubtitleBar>
        <div className="px-2 mt-2 w-64 sm:w-72 md:w-80 mx-auto">
          <ComboboxFood value={foodId} onChange={setFoodId} />
          {foodId && (
            <>
              <div className="flex flex-row items-baseline gap-2 mt-1">
                <div className="w-max flex-initial">
                  {t("ui.personal.valueCalcAdditional")}
                </div>
                <ToggleGroup
                  className="min-w-max flex-1"
                  value={`${additionalPlusValue}`}
                  onValueChange={(v) => v && setAdditionalPlusValue(Number(v))}
                  type="single"
                >
                  {Array(3)
                    .fill(0)
                    .map((_, v) => {
                      return (
                        <ToggleGroupItem
                          key={v}
                          value={`${v + 1}`}
                          className="flex-1"
                        >
                          +{v + 1}
                        </ToggleGroupItem>
                      );
                    })}
                </ToggleGroup>
              </div>
              <div className="relative mt-1 mb-4 bg-restaurant bg-cover px-2 pt-4 overflow-hidden rounded-lg">
                <div className="w-1/2 aspect-square mx-auto overflow-hidden">
                  <img
                    src={getCharaImageUrl(
                      skin ? `${charaName}Skin${skin}` : `${charaName}`,
                      isAF && "af"
                    )}
                    className={cn("w-full aspect-square", isAF && "scale-125")}
                  />
                </div>
                <img
                  src="/foods/MyHomeRestaurant_table.png"
                  alt=""
                  className="absolute w-[120%] left-0 -bottom-10"
                />
                <div className="w-1/4 absolute -bottom-2 right-1/2 bg-dish bg-cover aspect-square flex flex-row justify-center items-end px-1.5 pb-2">
                  <img
                    src={`/foods/Icon_Food_${foodId}.png`}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-row gap-1 items-center">
                <div className="flex-1">
                  <div className="flex flex-row text-sm items-baseline">
                    <div className="flex-initial">
                      {t("ui.personal.valueCalcLevelBefore")}
                    </div>
                    <LazyInput
                      value={`${prevLevel}`}
                      sanitize={(v) =>
                        `${Math.max(
                          1,
                          Math.min(
                            29,
                            parseInt(v.replaceAll(/\D/g, "") || "1") || 1
                          )
                        )}`
                      }
                      onValueChange={(e) => {
                        const value = Number(e);
                        setPrevLevel(value);
                        setPrevExp((x) => Math.min(level.f[value - 1] - 1, x));
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="w-full flex-1 p-1"
                    />
                  </div>
                  <div className="flex flex-col text-sm items-center gap-1">
                    <div className="flex-initial">
                      {t("ui.personal.valueCalcExp")}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <LazyInput
                        value={`${prevExp}`}
                        sanitize={(v) =>
                          `${Math.max(
                            0,
                            Math.min(
                              level.f[prevLevel - 1] - 1,
                              parseInt(v.replaceAll(/\D/g, "") || "0") || 0
                            )
                          )}`
                        }
                        onValueChange={(e) => setPrevExp(Number(e))}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full flex-1 p-1"
                      />
                      <div className="w-max flex-initial">
                        /{level.f[prevLevel - 1]}
                      </div>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 flex-initial" />
                <div className="flex-1">
                  <div className="flex flex-row text-sm h-10 items-baseline">
                    <div className="flex-initial">
                      {t("ui.personal.valueCalcLevelBefore")}
                    </div>
                    <div
                      className={
                        prevLevel < calcResult[0] ? "text-xl p-0.5" : "mt-2.5"
                      }
                    >
                      {calcResult[0]}
                    </div>
                  </div>
                  <div className="flex flex-col text-sm items-center gap-1">
                    <div className="flex-initial">
                      {t("ui.personal.valueCalcExp")}
                    </div>
                    <div className="w-full flex-initial h-10 px-1 py-3">
                      <div className="bg-amber-800 dark:bg-amber-200 rounded relative h-4 px-px">
                        <div
                          className="bg-amber-500 rounded-sm absolute top-px left-px h-3.5"
                          style={{
                            width: `${
                              calcResult[0] === 30
                                ? 100
                                : (calcResult[1] / level.f[calcResult[0] - 1]) *
                                  100
                            }%`,
                          }}
                        />
                        <div className="relative h-full py-2 flex justify-center items-center">
                          <div className="text-shadow-glow-1.5 text-base absolute">
                            {calcResult[0] === 30
                              ? "MAX"
                              : `${calcResult[1]} / ${
                                  level.f[calcResult[0] - 1]
                                }`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodTasteViewer;
