// import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubtitleBar from "@/components/parts/subtitlebar";
import { Personality, Attack, Position, Class, Race } from "@/types/enums";

import { SortProperty, KEYWORD_COUNT, sortArray } from "./filtersort";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface CharaFilterProps {
  filters: [number, number[]][];
  applyFilters: (filters: [number, number[]][]) => void;
  sort: number;
  applySort: (sort: number) => void;
  asc: boolean;
  applyAsc: (asc: boolean) => void;
  resetFilter: () => void;
}

export function CharaFilter({
  filters,
  applyFilters,
  sort,
  applySort,
  asc,
  applyAsc,
  resetFilter,
}: CharaFilterProps) {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="flex-initial w-10 h-10 p-2"
        >
          <Filter className="w-6 h-6 opacity-80" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] font-onemobile max-h-[600px]">
        <DialogHeader>
          <DialogTitle>{t("ui.personal.charaFilterDialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("ui.personal.charaFilterDialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Tabs>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger className="" value="sort">
                {t("ui.personal.charaSort")}
              </TabsTrigger>
              <TabsTrigger className="" value="filter">
                {t("ui.personal.charaFilter")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="sort">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  Object.entries(SortProperty).filter(
                    ([a, b]) => typeof a === "string" && typeof b === "number"
                  ) as [string, number][]
                ).map(([key, num]) => {
                  return (
                    <Button
                      key={key}
                      className={cn(
                        sort === num ? "bg-accent/50" : "bg-background/50"
                      )}
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (sort === num) applyAsc(!asc);
                        else {
                          applySort(num);
                          applyAsc(true);
                        }
                      }}
                    >
                      {sort === num ? (
                        asc ? (
                          <ArrowUp className="w-5 h-5 mr-1" />
                        ) : (
                          <ArrowDown className="w-5 h-5 mr-1" />
                        )
                      ) : (
                        <div className="w-5 h-5 mr-1" />
                      )}
                      {t(`ui.personal.charaSort${key}`)}
                      <div className="w-5 h-5 mr-1" />
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="filter">
              <ScrollArea className="h-80 p-2">
                <div>
                  <SubtitleBar>
                    {t(`ui.personal.charaSortPersonality`)}
                  </SubtitleBar>
                  <ToggleGroup
                    type="multiple"
                    value={filters[0]?.[1]?.map((v) => v.toString()) ?? []}
                    onValueChange={(v) => {
                      const newFilterLength = Math.max(1, filters.length);
                      applyFilters(
                        Array(newFilterLength)
                          .fill(0)
                          .map((_, i) =>
                            i === 0
                              ? [0, v.map((s) => Number(s))]
                              : filters[i] ?? [i, []]
                          )
                      );
                    }}
                    className="grid grid-cols-3 sm:grid-cols-5"
                  >
                    {sortArray[SortProperty.Personality].map((num) => {
                      return (
                        <ToggleGroupItem
                          key={num}
                          value={num.toString()}
                          variant="outline"
                          className={cn()}
                        >
                          <img
                            src={`/icons/Common_UnitPersonality_${Personality[num]}.png`}
                            alt={`personality.${Personality[num]}`}
                            className="w-6 h-6"
                          />
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                </div>
                <div>
                  <SubtitleBar>
                    {t(`ui.personal.charaSortInitialStar`)}
                  </SubtitleBar>
                  <ToggleGroup
                    type="multiple"
                    value={filters[1]?.[1]?.map((v) => v.toString()) ?? []}
                    onValueChange={(v) => {
                      const newFilterLength = Math.max(1, filters.length);
                      applyFilters(
                        Array(newFilterLength)
                          .fill(0)
                          .map((_, i) =>
                            i === 1
                              ? [1, v.map((s) => Number(s))]
                              : filters[i] ?? [i, []]
                          )
                      );
                    }}
                    className="grid grid-cols-3 sm:grid-cols-5"
                  >
                    {Array(3)
                      .fill(0)
                      .map((_, num) => {
                        const starCount = 3 - num;
                        const starNum = [4, 3, 5][num];
                        return (
                          <ToggleGroupItem
                            key={num}
                            value={starCount.toString()}
                            variant="outline"
                            className={cn("-space-x-1.5")}
                          >
                            {Array(starCount).fill(
                              <img
                                src={`/icons/HeroGrade_000${starNum}.png`}
                                className="w-6 h-6"
                              />
                            )}
                          </ToggleGroupItem>
                        );
                      })}
                  </ToggleGroup>
                </div>
                <div>
                  <SubtitleBar>
                    {t(`ui.personal.charaSortAttackType`)}
                  </SubtitleBar>
                  <ToggleGroup
                    type="multiple"
                    value={filters[2]?.[1]?.map((v) => v.toString()) ?? []}
                    onValueChange={(v) => {
                      const newFilterLength = Math.max(2, filters.length);
                      applyFilters(
                        Array(newFilterLength)
                          .fill(0)
                          .map((_, i) =>
                            i === 2
                              ? [2, v.map((s) => Number(s))]
                              : filters[i] ?? [i, []]
                          )
                      );
                    }}
                    className="grid grid-cols-3 sm:grid-cols-5"
                  >
                    {sortArray[SortProperty.AttackType].map((num) => {
                      return (
                        <ToggleGroupItem
                          key={num}
                          value={num.toString()}
                          variant="outline"
                          className={cn()}
                        >
                          <img
                            src={`/icons/Common_UnitAttack${Attack[num]}.png`}
                            alt={`attack.${Attack[num]}`}
                            className="w-6 h-6"
                          />
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                </div>
                <div>
                  <SubtitleBar>
                    {t(`ui.personal.charaSortPosition`)}
                  </SubtitleBar>
                  <ToggleGroup
                    type="multiple"
                    value={filters[3]?.[1]?.map((v) => v.toString()) ?? []}
                    onValueChange={(v) => {
                      const newFilterLength = Math.max(3, filters.length);
                      applyFilters(
                        Array(newFilterLength)
                          .fill(0)
                          .map((_, i) =>
                            i === 3
                              ? [3, v.map((s) => Number(s))]
                              : filters[i] ?? [i, []]
                          )
                      );
                    }}
                    className="grid grid-cols-3 sm:grid-cols-5"
                  >
                    {sortArray[SortProperty.Position].map((num) => {
                      return (
                        <ToggleGroupItem
                          key={num}
                          value={num.toString()}
                          variant="outline"
                          className={cn()}
                        >
                          <img
                            src={`/icons/Common_Position${Position[num]}.png`}
                            alt={`position.${Position[num]}`}
                            className="w-6 h-6"
                          />
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                </div>
                <div>
                  <SubtitleBar>{t(`ui.personal.charaSortClass`)}</SubtitleBar>
                  <ToggleGroup
                    type="multiple"
                    value={filters[4]?.[1]?.map((v) => v.toString()) ?? []}
                    onValueChange={(v) => {
                      const newFilterLength = Math.max(4, filters.length);
                      applyFilters(
                        Array(newFilterLength)
                          .fill(0)
                          .map((_, i) =>
                            i === 4
                              ? [4, v.map((s) => Number(s))]
                              : filters[i] ?? [i, []]
                          )
                      );
                    }}
                    className="grid grid-cols-3 sm:grid-cols-5"
                  >
                    {sortArray[SortProperty.Class].map((num) => {
                      return (
                        <ToggleGroupItem
                          key={num}
                          value={num.toString()}
                          variant="outline"
                          className={cn()}
                        >
                          <img
                            src={`/icons/Common_Unit${Class[num]}.png`}
                            alt={`class.${Class[num]}`}
                            className="w-6 h-6"
                          />
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                </div>
                <div>
                  <SubtitleBar>{t(`ui.personal.charaSortRace`)}</SubtitleBar>
                  <ToggleGroup
                    type="multiple"
                    value={filters[5]?.[1]?.map((v) => v.toString()) ?? []}
                    onValueChange={(v) => {
                      const newFilterLength = Math.max(5, filters.length);
                      applyFilters(
                        Array(newFilterLength)
                          .fill(0)
                          .map((_, i) =>
                            i === 5
                              ? [5, v.map((s) => Number(s))]
                              : filters[i] ?? [i, []]
                          )
                      );
                    }}
                    className="grid grid-cols-3 sm:grid-cols-5"
                  >
                    {sortArray[SortProperty.Race].map((num) => {
                      return (
                        <ToggleGroupItem
                          key={num}
                          value={num.toString()}
                          variant="outline"
                          className={cn()}
                        >
                          <img
                            src={`/album/Album_Icon_${Race[num]}.png`}
                            alt={`race.${Race[num]}`}
                            className="w-6 h-6"
                          />
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                </div>
                <div>
                  <SubtitleBar>{t(`ui.personal.charaSortKeyword`)}</SubtitleBar>
                  <ToggleGroup
                    type="multiple"
                    value={filters[6]?.[1]?.map((v) => v.toString()) ?? []}
                    onValueChange={(v) => {
                      const newFilterLength = Math.max(6, filters.length);
                      applyFilters(
                        Array(newFilterLength)
                          .fill(0)
                          .map((_, i) =>
                            i === 6
                              ? [6, v.map((s) => Number(s))]
                              : filters[i] ?? [i, []]
                          )
                      );
                    }}
                    className="grid grid-cols-2 sm:grid-cols-4"
                  >
                    {Array(KEYWORD_COUNT).fill(0).map((_, num) => {
                      const keywordNum = num + 1
                      return (
                        <ToggleGroupItem
                          key={keywordNum}
                          value={keywordNum.toString()}
                          variant="outline"
                          className={cn()}
                        >
                          {t(`skill.commonKeyword.${keywordNum}.name`)}
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex flex-row justify-between gap-2">
          <Button type="reset" onClick={resetFilter}>
            {t("ui.personal.charaFilterReset")}
          </Button>
          <DialogClose asChild>
            <Button type="submit">
              {t("ui.personal.charaFilterDialogApply")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CharaFilter;
