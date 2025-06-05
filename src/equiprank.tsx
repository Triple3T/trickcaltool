import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowDownUp,
  ArrowDownZA,
  ArrowUpAZ,
  Filter,
  Info,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import icSearch from "@/lib/initialConsonantSearch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Select from "@/components/common/combobox-select";
import Loading from "@/components/common/loading";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import LazyInput from "@/components/common/lazy-input";
import SearchBox from "@/components/common/search-with-icon";
import chara from "@/data/chara";
import eqrank from "@/data/eqrank";
import {
  StatType,
  Personality,
  SortBy,
  FilterBy,
  SortOrFilter,
  SortType,
} from "@/types/enums";
import RankInfoDialog from "@/components/parts/rank-info-dialog";
import type { RankInfoDialogProps } from "@/components/parts/rank-info-dialog";
import RankReqLevelDialog from "@/components/parts/rank-req-level-dialog";
import RankViewElementWithPlusMinus from "@/components/parts/rank-view-element-with-plus-minus";
// import SelectChara from "@/components/parts/select-chara";
const SelectChara = lazy(() => import("@/components/parts/select-chara"));
import SubtitleBar from "@/components/parts/subtitlebar";
import { personalityBG } from "@/utils/personalityBG";
import rankClassNames from "@/utils/rankClassNames";

import { UserDataOwnedCharaInfo } from "@/types/types";
import {
  useUserDataActions,
  useUserDataStatus,
  useUserDataEqrank,
  useUserDataCharaInfo,
  useUserDataStatPercents,
  useUserDataUnowned,
  useUserDataStatistics,
} from "@/stores/useUserDataStore";

// af
import { useIsAFActive } from "@/stores/useAFDataStore";
import { getCharaImageUrl } from "@/utils/getImageUrl";

const MAX_RANK = 11;

type ViewType = "input" | "rankView" | "targetView";

const EquipRank = () => {
  const { t } = useTranslation();
  const dataStatus = useUserDataStatus();
  const {
    rankModify,
    rankTargetStat,
    rankMinRank,
    rankMaxRank,
    rankApplyMinMax,
    rankSort,
    rankFilter,
  } = useUserDataActions();
  const userDataEqrank = useUserDataEqrank();
  const userDataCharaInfo = useUserDataCharaInfo();
  const boardStat = useUserDataStatPercents();
  const userDataUnowned = useUserDataUnowned();
  const userStatistics = useUserDataStatistics();
  const isAF = useIsAFActive();
  const [viewType, setViewType] = useState<ViewType>("rankView");
  const [enableDialog, setEnableDialog] = useState(true);
  const [charaDrawerOpen, setCharaDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [withBoardStat, setWithBoardStat] = useState(false);
  // const [boardStat, setBoardStat] = useState<{ [key: string]: number }>({});
  const [newCharaAlert, setNewCharaAlert] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(true);
  const [rankDirty, setRankDirty] = useState(false);
  const [dirtyRankCharas, setDirtyRankCharas] = useState<string[]>([]);
  const [rankDialogOpened, setRankDialogOpened] = useState(false);
  const [rankDialogProp, setRankDialogProp] =
    useState<Omit<RankInfoDialogProps, "opened" | "onOpenChange">>();

  useEffect(() => {
    if (newCharaAlert) {
      toast.info(t("ui.index.newCharacterAlert"));
      setNewCharaAlert(false);
    }
  }, [newCharaAlert, t]);
  useEffect(() => {
    if (userDataCharaInfo && userDataEqrank) {
      const isRankNotDirty = Object.values(userDataCharaInfo)
        .map((c) => (c.unowned ? -1 : c.eqrank))
        .filter((r) => r > 0)
        .every((r) => r >= userDataEqrank.s[0] && r <= userDataEqrank.s[1]);
      setRankDirty(!isRankNotDirty);
      if (!isRankNotDirty) {
        setViewType("input");
        setDirtyRankCharas(
          Object.entries(userDataCharaInfo)
            .filter(
              ([, c]) =>
                !c.unowned &&
                (c.eqrank < userDataEqrank.s[0] ||
                  c.eqrank > userDataEqrank.s[1])
            )
            .map(([c]) => c)
        );
      } else {
        setDirtyRankCharas([]);
      }
    }
  }, [userDataCharaInfo, userDataEqrank]);

  type SortFuncType = (a: string, b: string) => number;
  const sortFunc = useMemo<SortFuncType>(() => {
    const defaultFunc: SortFuncType = (a, b) =>
      t(`chara.${a}`).localeCompare(t(`chara.${b}`));
    if (!userDataEqrank) return defaultFunc;
    const sortAndFilter = userDataEqrank.f;
    const sortedWith = sortAndFilter.find((v) => v[0] === SortOrFilter.Sort);
    if (!sortedWith) return defaultFunc;
    switch (sortedWith[1] ?? SortBy.Name) {
      case SortBy.Name:
        return (a, b) =>
          t(`chara.${a}`).localeCompare(t(`chara.${b}`)) *
          (-1) ** sortedWith[2];
      case SortBy.Personality:
        return (a, b) =>
          (Number(chara[a].t[0]) - Number(chara[b].t[0])) *
          (-1) ** sortedWith[2];
      case SortBy.StarGrade:
        return (a, b) =>
          (Number(chara[a].t[1]) - Number(chara[b].t[1])) *
          (-1) ** sortedWith[2];
      default:
        return defaultFunc;
    }
  }, [t, userDataEqrank]);

  type FilterFuncType = (c: string) => boolean;
  const filterFunc = useMemo<FilterFuncType>(() => {
    const defaultFunc: FilterFuncType = () => true;
    if (!userDataEqrank) return defaultFunc;
    const sortAndFilter = userDataEqrank.f;
    const filterByTypes = Object.values(FilterBy).filter(
      (f) => typeof f === "string"
    ) as (keyof typeof FilterBy)[];
    const filteredWithAll = filterByTypes.map<FilterFuncType>((f) => {
      const filterBy: FilterBy = FilterBy[f];
      const filterWith = sortAndFilter.find(
        (v) => v[0] === SortOrFilter.Filter && v[1] === filterBy
      );
      if (!filterWith || !filterWith[2]) return defaultFunc;
      return (c) => (filterWith[2] & (1 << Number(chara[c].t[filterBy]))) > 0;
    });
    return (c) => filteredWithAll.every((f) => f(c));
  }, [userDataEqrank]);

  const rankModifyAsProp = useCallback(
    (charaName: string, rank: number) => rankModify({ charaName, rank }),
    [rankModify]
  );

  if (
    dataStatus !== "initialized" ||
    !userDataEqrank ||
    !userDataCharaInfo ||
    !boardStat ||
    !userDataUnowned
  )
    return <Loading />;

  return (
    <>
      <Card className="p-4 object-cover max-w-xl mt-0 mb-4 gap-2 mx-auto font-onemobile">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("ui.equiprank.settings")}</AccordionTrigger>
            <AccordionContent className="text-base">
              {/* Settings */}
              <div className="w-full flex flex-col gap-2 px-2">
                <div className="flex flex-col gap-2">
                  <SubtitleBar>{t("ui.common.unownedCharacters")}</SubtitleBar>
                  <div>
                    <Suspense
                      fallback={<div>{t("ui.index.suspenseLoading")}</div>}
                    >
                      <SelectChara
                        isOpen={charaDrawerOpen}
                        onOpenChange={setCharaDrawerOpen}
                      />
                    </Suspense>
                  </div>
                </div>
                {viewType === "input" && (
                  <div className="flex flex-col gap-2">
                    <SubtitleBar>{t("ui.equiprank.rankMinMax")}</SubtitleBar>
                    <div className="flex flex-col gap-1 px-4">
                      <div className="flex flex-row gap-2">
                        <Select
                          value={Math.min(
                            MAX_RANK,
                            Math.max(userDataEqrank.s[0] || 1, 1)
                          )}
                          setValue={rankMinRank}
                          placeholder={t("ui.equiprank.rankText", {
                            0: "1",
                          })}
                          items={Array.from(Array(MAX_RANK).keys()).map(
                            (i) => ({
                              value: i + 1,
                              label: t("ui.equiprank.rankText", {
                                0: `${i + 1}`,
                              }),
                            })
                          )}
                        />
                        <Select
                          value={Math.min(
                            MAX_RANK,
                            Math.max(userDataEqrank.s[1] || 1, 1)
                          )}
                          setValue={rankMaxRank}
                          placeholder={t("ui.equiprank.rankText", {
                            0: "1",
                          })}
                          items={Array.from(Array(MAX_RANK).keys()).map(
                            (i) => ({
                              value: i + 1,
                              label: t("ui.equiprank.rankText", {
                                0: `${i + 1}`,
                              }),
                            })
                          )}
                        />
                      </div>
                      <div className="text-right text-red-500 dark:text-red-400 text-sm">
                        {t("ui.equiprank.reqLevel", {
                          0: `${userDataEqrank.s[1] || 1}`,
                          1: `${eqrank.q[(userDataEqrank.s[1] || 1) - 1]}`,
                        })}
                        <RankReqLevelDialog
                          reqs={eqrank.q}
                          maxRank={MAX_RANK}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {viewType === "rankView" && (
                  <div className="flex flex-col gap-2">
                    <SubtitleBar>{t("ui.equiprank.sortAndFilter")}</SubtitleBar>
                    <div className="flex flex-col gap-1 px-2">
                      <div className="flex flex-row gap-2">
                        <div className="flex items-center">
                          <ArrowDownUp className="w-5 h-5" />
                        </div>
                        <div className="flex flex-1 gap-1">
                          {(
                            Object.values(SortBy).filter(
                              (s) => typeof s === "string"
                            ) as (keyof typeof SortBy)[]
                          )
                            .sort((a, b) => SortBy[a] - SortBy[b])
                            .map((s) => {
                              const sortedWith = userDataEqrank.f.find(
                                (v) => v[0] === SortOrFilter.Sort
                              );
                              const sortedByThis =
                                sortedWith?.[1] === SortBy[s];
                              const hasDirection =
                                typeof sortedWith?.[2] === "number";
                              const sortedDirection = sortedWith?.[2];
                              return (
                                <Button
                                  key={s}
                                  className="flex-auto"
                                  size="sm"
                                  variant={sortedByThis ? "default" : "outline"}
                                  onClick={() => rankSort(SortBy[s])}
                                >
                                  {sortedByThis && hasDirection ? (
                                    sortedDirection === SortType.Asc ? (
                                      <ArrowUpAZ className="mr-1" />
                                    ) : (
                                      <ArrowDownZA className="mr-1" />
                                    )
                                  ) : null}
                                  {t(`ui.equiprank.sortBy${s}`)}
                                </Button>
                              );
                            })}
                        </div>
                      </div>
                      <div className="flex flex-row gap-2">
                        <div className="flex items-center">
                          <Filter className="w-5 h-5" />
                        </div>
                        <div className="flex flex-1 gap-1 justify-center">
                          {(
                            Object.values(Personality).filter(
                              (s) => typeof s === "string"
                            ) as (keyof typeof Personality)[]
                          ).map((p) => {
                            const filteredWithPersonality =
                              userDataEqrank.f.find(
                                (v) =>
                                  v[0] === SortOrFilter.Filter &&
                                  v[1] === FilterBy.Personality
                              );
                            const filterNumber =
                              filteredWithPersonality?.[2] ?? 0;
                            const personalityNumber = Personality[p];
                            const hasPersonality =
                              (filterNumber & (1 << personalityNumber)) > 0;
                            return (
                              <Button
                                key={p}
                                size="icon"
                                variant="outline"
                                onClick={() =>
                                  rankFilter({
                                    filterBy: FilterBy.Personality,
                                    filter: personalityNumber,
                                  })
                                }
                                className={cn(
                                  "flex-1 max-w-10 min-w-6 w-full h-auto aspect-square",
                                  hasPersonality ? "bg-[#dfeeab]/75" : ""
                                )}
                              >
                                <img
                                  src={`/icons/Common_UnitPersonality_${p}.webp`}
                                  className="max-w-full w-6 aspect-square"
                                />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <SubtitleBar>{t("ui.equiprank.targetStat")}</SubtitleBar>
                  <div className="px-4 flex gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        rankTargetStat(
                          (
                            Object.values(StatType).filter(
                              (b) => typeof b === "string"
                            ) as string[]
                          ).map((b) => StatType[b as keyof typeof StatType])
                        )
                      }
                    >
                      {t("ui.equiprank.selectTargetStatAll")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        rankTargetStat([
                          StatType.AttackMagic,
                          StatType.AttackPhysic,
                          StatType.Hp,
                        ])
                      }
                    >
                      {t("ui.equiprank.selectTargetStatRecommended")}
                    </Button>
                  </div>
                  <div className="px-4">
                    <ToggleGroup
                      type="multiple"
                      className="flex-wrap"
                      value={userDataEqrank.v.map((b) => StatType[b]) ?? []}
                      onValueChange={(v) =>
                        rankTargetStat(
                          v.map((b) => StatType[b as keyof typeof StatType])
                        )
                      }
                    >
                      {[1, 0, 7, 6, 4, 2, 5, 3, 8].map((statNum) => {
                        const bt = StatType[statNum];
                        return (
                          <ToggleGroupItem
                            key={bt}
                            value={bt}
                            aria-label={`Toggle ${bt}`}
                          >
                            <img
                              src={`/icons/Icon_${bt}.webp`}
                              className="h-6 w-6 aspect-square"
                            />
                          </ToggleGroupItem>
                        );
                      })}
                    </ToggleGroup>
                  </div>
                </div>
                {viewType === "targetView" && (
                  <div className="flex flex-col gap-2">
                    <SubtitleBar>{t("ui.equiprank.omitCompleted")}</SubtitleBar>
                    <div className="w-full px-4 my-2 text-left flex items-center gap-2">
                      <Switch
                        id="omit-complete-trigger"
                        checked={hideCompleted}
                        onCheckedChange={(e) => {
                          setHideCompleted(e);
                        }}
                      />
                      <Label htmlFor="omit-complete-trigger">
                        {t("ui.equiprank.hideCompletedDesc")}
                      </Label>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <SubtitleBar>
                    {t("ui.common.dialogEnableSwitchTitle")}
                  </SubtitleBar>
                  <div className="w-full px-4 my-2 text-left flex items-center gap-2">
                    <Switch
                      id="show-dialog-trigger"
                      checked={enableDialog}
                      onCheckedChange={(e) => {
                        // setDialogEnabled(e);
                        setEnableDialog(e);
                      }}
                    />
                    <Label htmlFor="show-dialog-trigger">
                      {t("ui.common.dialogEnableSwitchTitle")}
                    </Label>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              {t("ui.equiprank.allStatTotal")}
            </AccordionTrigger>
            <AccordionContent className="text-base">
              <div className="mb-2 text-left flex items-center gap-2">
                <Switch
                  id="view-all-stat-with-board"
                  checked={withBoardStat}
                  onCheckedChange={(c) => {
                    setWithBoardStat(c);
                    // if (c) getBoardStats();
                  }}
                />
                <Label htmlFor="view-all-stat-with-board">
                  {t("ui.equiprank.viewAllStatWithBoard")}
                </Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-auto gap-2.5">
                {Object.entries(
                  (
                    Object.entries(userDataCharaInfo).filter(
                      ([, v]) => !v.unowned
                    ) as Array<[string, UserDataOwnedCharaInfo]>
                  )
                    .map(([c, v]) =>
                      eqrank.r[eqrank.c[c].r]
                        .slice(0, v.eqrank - 1)
                        .flat()
                        .map((x) => eqrank.s[x])
                    )
                    .reduce((p, c) => {
                      c.forEach((s) => {
                        if (p[s[0]]) {
                          p[s[0]] += s[1];
                        } else {
                          p[s[0]] = s[1];
                        }
                      });
                      return p;
                    }, {} as { [key: string]: number })
                )
                  .sort(
                    (a, b) =>
                      [1, 0, 5, 7, 4, 6, 3, 2, 8, 9][parseInt(a[0], 10)] -
                      [1, 0, 5, 7, 4, 6, 3, 2, 8, 9][parseInt(b[0], 10)]
                  )
                  .map(([statTypeNum, statValue]) => {
                    const stat = StatType[parseInt(statTypeNum, 10)];
                    return (
                      <div className="flex" key={statTypeNum}>
                        <div className="relative z-10">
                          <img
                            className="h-6 mr-2 aspect-square inline-block align-middle"
                            src={`/icons/Icon_${stat}.webp`}
                          />
                        </div>
                        <div className="flex-1 -ml-8 bg-gradient-to-r from-transparent via-[#f2f9e7] dark:via-[#36a52d] via-[28px] to-[#f2f9e7] dark:to-[#36a52d] py-0.5 pr-2.5 pl-8 rounded-r-[14px] flex flex-row dark:contrast-125 dark:brightness-80">
                          <div className="text-left flex-auto">
                            {t(`stat.${stat}`)}
                          </div>
                          <div className="text-right flex-auto">
                            {(withBoardStat
                              ? Math.round(
                                  (statValue * ((boardStat[stat] ?? 0) + 100)) /
                                    100
                                )
                              : statValue
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {
        <div className="font-onemobile max-w-[1920px]">
          <Tabs
            value={viewType}
            className="w-full"
            onValueChange={(v) => {
              if (!v || viewType === v) return;
              setViewType(v as ViewType);
              if (enableDialog) {
                setEnableDialog(false);
                setTimeout(() => setEnableDialog(true), 0);
              }
            }}
          >
            <TabsList
              className={cn("w-full flex", rankDirty ? "invisible" : "")}
            >
              <TabsTrigger value="input" className="flex-1">
                <div>{t("ui.equiprank.input")}</div>
              </TabsTrigger>
              <TabsTrigger
                value="rankView"
                className="flex-1"
                disabled={rankDirty}
              >
                <div>{t("ui.equiprank.rankView")}</div>
              </TabsTrigger>
              <TabsTrigger
                value="targetView"
                className="flex-1"
                disabled={rankDirty}
              >
                <div>{t("ui.equiprank.targetView")}</div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="input">
              <div className="mt-4 flex gap-4">
                <SearchBox
                  className="font-onemobile flex-auto"
                  value={search}
                  onValueChange={setSearch}
                  placeholder={t("ui.charaSelect.searchByName")}
                />
                {rankDirty && (
                  <div className="flex-initial text-right">
                    <Button variant="destructive" onClick={rankApplyMinMax}>
                      {t("ui.equiprank.applyMinMax")}
                    </Button>
                  </div>
                )}
              </div>
              <div className="text-sm text-right opacity-50 py-2">
                {(rankDirty
                  ? t("ui.equiprank.aboutApplyMinMax")
                  : t("ui.equiprank.aboutSortingCriteria")
                )
                  .split("\n")
                  .map((l, i) => (
                    <div key={i}>{l}</div>
                  ))}
              </div>
              <div
                className={`border w-full p-3 sm:p-4 rounded-xl min-h-6 grid grid-cols-[repeat(auto-fill,_minmax(7rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(8rem,_1fr))] gap-3 sm:gap-4`}
              >
                {userDataUnowned.o
                  .sort((a, b) =>
                    t(`chara.${a}`).localeCompare(t(`chara.${b}`))
                  )
                  .filter((c) => {
                    if (search)
                      return (
                        t(`chara.${c}`).includes(search) ||
                        icSearch(t(`chara.${c}`), search)
                      );
                    if (rankDirty) return dirtyRankCharas.includes(c);
                    return true;
                  })
                  .map((c) => {
                    const currentCharaEqrank = (
                      userDataCharaInfo[c] as UserDataOwnedCharaInfo
                    ).eqrank;
                    return (
                      <div key={c} className="flex flex-col gap-1">
                        <div className="min-w-28 min-h-28 sm:min-w-32 sm:min-h-32 aspect-square border border-gray-700 rounded shadow-sm overflow-hidden relative">
                          <img
                            src={getCharaImageUrl(
                              userDataCharaInfo[c].skin
                                ? `${c}Skin${userDataCharaInfo[c].skin}`
                                : `${c}`,
                              isAF && "af-i"
                            )}
                            className={cn(
                              personalityBG[
                                Number(chara[c].t[0]) as Personality
                              ],
                              isAF && "scale-125",
                              "aspect-square w-full"
                            )}
                          />
                          <div className="absolute w-full left-0 bottom-0 bg-slate-100/75 dark:bg-gray-800/75 text-sm text-center py-0.5">
                            {t(`chara.${c}`)}
                          </div>
                        </div>
                        <div className="flex flex-row gap-2 pl-2 pr-1 py-1 rounded bg-slate-400 dark:bg-slate-600">
                          <Button
                            className="h-full p-0 aspect-square bg-greenicon"
                            disabled={currentCharaEqrank <= userDataEqrank.s[0]}
                            onClick={() =>
                              rankModify({
                                charaName: c,
                                rank: Math.max(
                                  Math.min(
                                    currentCharaEqrank - 1,
                                    userDataEqrank.s[1]
                                  ),
                                  userDataEqrank.s[0]
                                ),
                              })
                            }
                          >
                            <Minus className="w-full aspect-square" />
                          </Button>
                          <LazyInput
                            type="text"
                            className={cn(
                              "w-full p-1.5 text-right h-full",
                              currentCharaEqrank > userDataEqrank.s[1] ||
                                currentCharaEqrank < userDataEqrank.s[0]
                                ? "ring-2 ring-red-400 dark:ring-red-600 bg-red-200 dark:bg-red-900"
                                : ""
                            )}
                            pattern="[0-9]{1,2}"
                            value={`${Math.max(
                              Math.min(currentCharaEqrank, userDataEqrank.s[1]),
                              userDataEqrank.s[0]
                            )}`}
                            sanitize={(v) =>
                              `${Math.max(
                                Math.min(
                                  parseInt(v.replaceAll(/\D/g, "") || "0") || 0,
                                  userDataEqrank.s[1]
                                ),
                                userDataEqrank.s[0]
                              )}`
                            }
                            onValueChange={(v) =>
                              rankModify({
                                charaName: c,
                                rank: Number(v),
                              })
                            }
                          />
                          <Button
                            className="h-full p-0 aspect-square bg-greenicon"
                            disabled={currentCharaEqrank >= userDataEqrank.s[1]}
                            onClick={() =>
                              rankModify({
                                charaName: c,
                                rank: Math.max(
                                  Math.min(
                                    currentCharaEqrank + 1,
                                    userDataEqrank.s[1]
                                  ),
                                  userDataEqrank.s[0]
                                ),
                              })
                            }
                          >
                            <Plus className="w-full aspect-square" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>
            <TabsContent value="rankView">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex flex-row w-full gap-2 justify-between items-end">
                    <div className="text-xl flex-auto text-left">
                      {t("ui.equiprank.rankProgressTitle")}
                    </div>
                    <div className="flex-auto text-right text-sm opacity-80">
                      {t("ui.equiprank.rankTotal", {
                        0: userStatistics.rank,
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-stretch w-full">
                    {/* <div></div> */}
                    <div className="w-full flex flex-row h-1">
                      {Array.from(Array(userDataEqrank.s[1]).keys()).map(
                        (i) => {
                          const count = userDataUnowned.o.filter(
                            (c) =>
                              (userDataCharaInfo[c] as UserDataOwnedCharaInfo)
                                .eqrank ===
                              i + 1
                          ).length;
                          if (!count) return null;
                          return (
                            <div
                              key={i}
                              className={cn(rankClassNames[i][2], "h-1")}
                              style={{
                                flex: `${count}`,
                              }}
                            />
                          );
                        }
                      )}
                    </div>
                    <div className="flex gap-0.5">
                      <div className="flex gap-1 flex-wrap text-left">
                        {Array.from(Array(userDataEqrank.s[1]).keys()).map(
                          (i) => {
                            const count = userDataUnowned.o.filter(
                              (c) =>
                                (userDataCharaInfo[c] as UserDataOwnedCharaInfo)
                                  .eqrank ===
                                i + 1
                            ).length;
                            return (
                              <div
                                key={i}
                                className={cn(
                                  rankClassNames[i][0],
                                  "border-slate-900 dark:border-slate-50 border text-xs py-0.5 w-8 inline-block text-center rounded"
                                )}
                              >
                                {count}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {rankClassNames
                  .slice(0, userDataEqrank.s[1])
                  .map((s, i) => ({ rank: i + 1, bg: s[0], txt: s[1] }))
                  .reverse()
                  .map((s) => {
                    const { rank, bg, txt } = s;
                    return (
                      <div key={bg}>
                        <div className={cn(txt, "text-xl w-full text-left")}>
                          {t("ui.equiprank.rankText", { 0: `${rank}` })}
                        </div>
                        <div
                          className={cn(
                            bg,
                            "w-full p-2 rounded-xl min-h-6 grid grid-cols-[repeat(auto-fill,_minmax(5rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(5.5rem,_1fr))] gap-1"
                          )}
                        >
                          {userDataUnowned.o
                            .filter(filterFunc)
                            .sort(sortFunc)
                            .map((c) => {
                              if (
                                (userDataCharaInfo[c] as UserDataOwnedCharaInfo)
                                  .eqrank !== rank
                              )
                                return null;
                              return (
                                <RankViewElementWithPlusMinus
                                  key={c}
                                  enableDialog={enableDialog}
                                  rank={rank}
                                  skin={userDataCharaInfo[c].skin}
                                  maxRank={userDataEqrank.s[1]}
                                  charaName={c}
                                  setRankDialogProp={setRankDialogProp}
                                  setRankDialogOpened={setRankDialogOpened}
                                  rankModify={rankModifyAsProp}
                                />
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>
            <TabsContent value="targetView">
              <div className="flex flex-col gap-4">
                {userDataEqrank.v.length < 1 ? (
                  <div className="p-4 text-red-500 dark:text-red-400">
                    {t("ui.equiprank.shouldSetTargetStat")}
                  </div>
                ) : (
                  rankClassNames
                    .slice(1, userDataEqrank.s[1])
                    .map((s, i) => ({ rank: i + 2, bg: s[0], txt: s[1] }))
                    .reverse()
                    .map((s) => {
                      const { rank, bg, txt } = s;
                      const targets = [
                        ...new Set(
                          userDataEqrank.v
                            .map((stat) =>
                              userDataUnowned.o.filter((chara) =>
                                eqrank.r[eqrank.c[chara].r][rank - 2]
                                  .map((s) => eqrank.s[s][0])
                                  .includes(stat)
                              )
                            )
                            .flat()
                        ),
                      ];
                      const targetCount = targets.length;
                      const checkedCount = targets.filter(
                        (c) =>
                          !userDataCharaInfo[c].unowned &&
                          userDataCharaInfo[c].eqrank >= rank
                      ).length;
                      return (
                        <div key={bg}>
                          <div className="flex items-end">
                            <div
                              className={cn(txt, "text-xl flex-auto text-left")}
                            >
                              {t("ui.equiprank.rankText", { 0: `${rank}` })}
                            </div>
                            <div className="flex-auto text-right">
                              {checkedCount === targetCount && (
                                <img
                                  src="/icons/Photo_Complete_Stamp.webp"
                                  className="h-10 -my-1.5 -mr-5 inline-block relative z-10"
                                />
                              )}
                              <span className={txt}>{checkedCount}</span>
                              <span className="text-sm">/{targetCount}</span>
                            </div>
                          </div>
                          <div
                            className={cn(
                              bg,
                              "w-full p-2 rounded-xl min-h-6 grid grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] gap-1"
                            )}
                          >
                            {targets
                              .filter(
                                (c) =>
                                  !hideCompleted ||
                                  rank >
                                    (
                                      userDataCharaInfo[
                                        c
                                      ] as UserDataOwnedCharaInfo
                                    ).eqrank
                              )
                              .sort((a, b) => {
                                const aRank = (
                                  userDataCharaInfo[a] as UserDataOwnedCharaInfo
                                ).eqrank;
                                const bRank = (
                                  userDataCharaInfo[b] as UserDataOwnedCharaInfo
                                ).eqrank;
                                const aSort = (aRank + 99 - rank) % 99;
                                const bSort = (bRank + 99 - rank) % 99;
                                return aRank !== bRank
                                  ? bSort - aSort
                                  : t(`chara.${a}`).localeCompare(
                                      t(`chara.${b}`)
                                    );
                              })
                              .map((c) => {
                                const currentCharaEqrank = (
                                  userDataCharaInfo[c] as UserDataOwnedCharaInfo
                                ).eqrank;
                                return (
                                  <div
                                    key={c}
                                    className={`min-w-14 sm:min-w-16`}
                                  >
                                    <div className="min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 aspect-square border border-gray-700 rounded shadow-sm overflow-hidden relative">
                                      <div className="min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 aspect-square">
                                        <img
                                          src={getCharaImageUrl(
                                            userDataCharaInfo[c].skin
                                              ? `${c}Skin${userDataCharaInfo[c].skin}`
                                              : `${c}`,
                                            isAF && "af-i"
                                          )}
                                          className={cn(
                                            "aspect-square w-full",
                                            isAF && "scale-125",
                                            personalityBG[
                                              Number(
                                                chara[c].t[0]
                                              ) as Personality
                                            ],
                                            rank > currentCharaEqrank
                                              ? ""
                                              : "opacity-60"
                                          )}
                                        />
                                      </div>
                                      {rank <= currentCharaEqrank && (
                                        <div className="absolute w-8/12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 z-10">
                                          <img
                                            src="/icons/Stage_RewardChack.webp"
                                            className="w-100 opacity-100"
                                          />
                                        </div>
                                      )}
                                      {enableDialog && (
                                        <div className="absolute right-0 top-0 p-0.5">
                                          <Info
                                            className="h-4 w-4 rounded-full"
                                            fill="#a0a0a0"
                                            onClick={() => {
                                              setRankDialogProp({
                                                chara: c,
                                                charaTypes: chara[c].t,
                                                rank: currentCharaEqrank,
                                                rankStats: eqrank.r[
                                                  eqrank.c[c].r
                                                ].map((rs) =>
                                                  rs.map((r) => eqrank.s[r])
                                                ),
                                                sameRankBonus: Object.entries(
                                                  eqrank.c
                                                )
                                                  .filter(
                                                    ([k, v]) =>
                                                      k !== c &&
                                                      v.r === eqrank.c[c].r
                                                  )
                                                  .map(([k]) => k),
                                                maxRank: userDataEqrank.s[1],
                                                changeRank: rankModifyAsProp,
                                                skin:
                                                  userDataCharaInfo[c].skin ||
                                                  0,
                                              });
                                              setRankDialogOpened(true);
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <div
                                      className={cn(
                                        rankClassNames[
                                          currentCharaEqrank - 1
                                        ][1],
                                        "text-sm w-full text-center"
                                      )}
                                    >
                                      {t("ui.equiprank.rankText", {
                                        0: `${currentCharaEqrank}`,
                                      })}
                                    </div>
                                    <div className="flex flex-col gap-1 text-center">
                                      {eqrank.r[eqrank.c[c].r]
                                        .map((rs) => rs.map((r) => eqrank.s[r]))
                                        .at(rank - 2)!
                                        .filter(([stat]) =>
                                          userDataEqrank.v.includes(stat)
                                        )
                                        .map(([s, v]) => {
                                          return (
                                            <div
                                              key={s}
                                              className="flex flex-row gap-1 text-sm justify-center items-center"
                                            >
                                              <img
                                                src={`/icons/Icon_${StatType[s]}.webp`}
                                                className="w-5 h-5"
                                              />
                                              <div>+{v}</div>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      }
      {rankDialogProp && (
        <RankInfoDialog
          {...({
            ...rankDialogProp,
            opened: rankDialogOpened,
            onOpenChange: setRankDialogOpened,
          } as RankInfoDialogProps)}
        />
      )}
    </>
  );
};

export default EquipRank;
