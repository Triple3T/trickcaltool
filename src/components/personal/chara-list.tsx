import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { VirtuosoGrid } from "react-virtuoso";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import SearchBox from "@/components/common/search-with-icon";
import chara from "@/data/chara";
import skillcoefficient from "@/data/skillcoefficient";
import { personalityBG } from "@/utils/personalityBG";
import icSearch from "@/lib/initialConsonantSearch";
import { Personality, Attack, Position, Class, Race } from "@/types/enums";
import CharaFilter from "./chara-filter";

import { useUserDataCharaInfo } from "@/stores/useUserDataStore";

import {
  FilterProperty,
  SortProperty,
  sortArray,
  // FILTER_COUNT,
} from "./filtersort";

// af
import { useIsAFActive } from "@/stores/useAFDataStore";
import { getCharaImageUrl } from "@/utils/getImageUrl";

type CharaMetaType = [Personality, number, Attack, Position, Class, Race];

interface CharaListProps {
  setTargetChara: (name: string) => void;
}

const filterSearchChara = (search: string) => {
  return (c: string) => (c ? c.includes(search) || icSearch(c, search) : true);
};
const filterPropertyChara = (
  propertyType: FilterProperty,
  propertyFilter: number[]
) => {
  if (propertyFilter.length === 0) return () => true;
  if (propertyType >= 0 && propertyType <= 5) {
    return (c: string) =>
      propertyFilter.includes(Number(chara[c].t.charAt(propertyType)));
  } else if (propertyType === 6) {
    return (c: string) =>
      Object.values(skillcoefficient.c[c].k)
        .flat()
        .some((k) => propertyFilter.includes(k));
  } else if (propertyType === 7) {
    if (propertyFilter.length === 1) {
      return (c: string) => (chara[c].a ? 1 : 2) & propertyFilter[0];
    }
    return () => true;
  } else if (propertyType === 8) {
    return (c: string) =>
      skillcoefficient.c[c].a?.e3.some((e) => propertyFilter.includes(e));
  } else if (propertyType === 9) {
    return (c: string) =>
      skillcoefficient.c[c].a?.s3
        ?.map((e) => e[0])
        ?.some((e) => propertyFilter.includes(e));
  }
  return () => true;
};
const applyAllFilter = (properties: [FilterProperty, number[]][]) => {
  if (properties.length === 0) return () => true;
  return (c: string) =>
    properties.every(([propertyType, propertyFilter]) =>
      filterPropertyChara(propertyType, propertyFilter)(c)
    );
};

const sortPropertyChara = (sortType: SortProperty) => {
  if (sortType === SortProperty.Name) return () => 0;
  if (sortType >= 0 && sortType <= 5) {
    return (a: string, b: string) => {
      return (
        sortArray[sortType].indexOf(Number(chara[a].t.charAt(sortType))) -
        sortArray[sortType].indexOf(Number(chara[b].t.charAt(sortType)))
      );
    };
  }
  return () => 0;
};

const CharaList = ({ setTargetChara }: CharaListProps) => {
  const { t } = useTranslation();
  const isAF = useIsAFActive();
  const userCharaInfo = useUserDataCharaInfo();
  const [search, setSearch] = useState<string>("");
  const [filterProperties, setFilterProperties] = useState<
    [FilterProperty, number[]][]
  >([]);
  const [sortProperty, setSortProperty] = useState<SortProperty>(
    SortProperty.Name
  );
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const resetFilter = useCallback(() => setFilterProperties([]), []);
  return (
    <div className="font-onemobile">
      <div className="text-2xl my-2">{t("ui.personal.charaList")}</div>
      <div className="flex flex-row justify-stretch items-center gap-2 my-2">
        <SearchBox
          className="font-onemobile flex-1"
          value={search}
          onValueChange={setSearch}
          placeholder={t("ui.charaSelect.searchByName")}
        />
        <CharaFilter
          filters={filterProperties}
          applyFilters={setFilterProperties}
          sort={sortProperty}
          applySort={setSortProperty}
          asc={sortAsc}
          applyAsc={setSortAsc}
          resetFilter={resetFilter}
        />
      </div>
      <VirtuosoGrid
        useWindowScroll
        className="font-onemobile mt-4"
        listClassName="grid grid-cols-[repeat(auto-fill,_minmax(6rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(7rem,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(8rem,_1fr))] gap-1"
        data={Object.entries(chara)
          .filter(([c]) => filterSearchChara(search)(t(`chara.${c}`)))
          .filter(([c]) => applyAllFilter(filterProperties)(c))
          .sort(
            ([a], [b]) =>
              (sortPropertyChara(sortProperty)(a, b) ||
                t(`chara.${a}`).localeCompare(t(`chara.${b}`))) *
              (sortAsc ? 1 : -1)
          )
          .map(([name]) => name)}
        itemContent={(_, name) => {
          const charaInfo = chara[name];
          const [
            personality,
            initialStar,
            attackType,
            position,
            unitClass,
            race,
          ] = charaInfo.t.split("").map((v) => Number(v)) as CharaMetaType;
          return (
            <div
              key={name}
              className="flex justify-between sm:min-w-16 md:min-w-20 max-w-32 rounded overflow-hidden border-slate-200 dark:border-slate-800 border-2 bg-slate-200 dark:bg-slate-800"
              onClick={() => setTargetChara(name)}
            >
              <div className="flex flex-col items-center p-0 sm:min-w-16 sm:min-h-16 md:min-w-20 md:min-h-20 max-w-32 w-full relative overflow-hidden">
                <img
                  src={getCharaImageUrl(
                    userCharaInfo?.[name].skin
                      ? `${name}Skin${userCharaInfo[name].skin}`
                      : `${name}`,
                    isAF && "af"
                  )}
                  className={cn(
                    "w-full aspect-square",
                    personalityBG[personality],
                    isAF && "scale-125"
                  )}
                />
                {charaInfo.e && charaInfo.e > 0 && (
                  <Badge className="text-[0.625rem] sm:text-xs font-normal h-4 px-1 sm:px-1.5 absolute top-1 right-6 bg-background/50 text-shadow-glow-0.75 text-shadow-glow-foreground flex justify-center items-center whitespace-nowrap">
                    {t(`eldain.${charaInfo.e}`)}
                  </Badge>
                )}
                <img
                  src={`/album/Album_Icon_${Race[race]}.webp`}
                  alt=""
                  className="w-4 h-4 absolute top-1 right-1"
                />
                <div className="w-full -mt-8 md:-mt-9 break-keep flex-1 flex flex-col items-stretch justify-center gap-0.5 z-10">
                  <div className="h-5 md:h-6">
                    <div className="flex justify-center gap-0.5 p-0.5 w-max mx-auto rounded-full bg-slate-200/65 dark:bg-slate-800/65">
                      <img
                        src={`/icons/Common_UnitPersonality_${Personality[personality]}.webp`}
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                      <img
                        src={`/icons/Common_Unit${Class[unitClass]}.webp`}
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                      <img
                        src={`/icons/Common_UnitAttack${Attack[attackType]}.webp`}
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                      <img
                        src={`/icons/Common_Position${Position[position]}.webp`}
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row justify-center -mt-1.5 -mb-2 z-10">
                    {Array(initialStar)
                      .fill(0)
                      .map((_, i) => {
                        return (
                          <img
                            key={i}
                            src={`/icons/HeroGrade_000${
                              [0, 3, 3, 4][initialStar]
                            }.webp`}
                            alt=""
                            className="w-6 h-6 -mx-[3px]"
                          />
                        );
                      })}
                  </div>
                  <div className="bg-slate-200 dark:bg-slate-800 pt-1.5 pb-0.5 text-sm sm:text-base overflow-hidden text-clip height-min whitespace-nowrap">
                    {t(`chara.${name}`)}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default CharaList;
