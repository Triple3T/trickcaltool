import {
  Suspense,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowDownUp,
  ArrowDownZA,
  ArrowUpAZ,
  Filter,
  Info,
} from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import LazyInput from "@/components/common/lazy-input";
import SearchBox from "@/components/common/search-with-icon";
import board from "@/data/board";
import chara from "@/data/chara";
import eqrank from "@/data/eqrank";
import clonefactory from "@/data/clonefactory";
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
// import SelectChara from "@/components/parts/select-chara";
const SelectChara = lazy(() => import("@/components/parts/select-chara"));
import SubtitleBar from "@/components/parts/subtitlebar";
import rankClassNames from "@/utils/rankClassNames";

import userdata from "@/utils/userdata";
import { UserDataEqRank, UserDataUnowned } from "@/types/types";
// import { dataFileRead, dataFileWrite } from "@/utils/dataRW";
import sortChange from "@/utils/sortChange";
import filterChange from "@/utils/filterChange";

const MAX_RANK = 8;

const personalityBG = {
  [Personality.Cool]: "bg-personality-Cool",
  [Personality.Gloomy]: "bg-personality-Gloomy",
  [Personality.Jolly]: "bg-personality-Jolly",
  [Personality.Mad]: "bg-personality-Mad",
  [Personality.Naive]: "bg-personality-Naive",
};

type ViewType = "input" | "rankView" | "targetView";

interface RankDataPropsRank {
  charas: {
    chara: string;
    reqRank: number; // 스탯 획득에 필요한 랭크
    statValue: number; // 스탯 획득량
  }[]; // 캐릭터 모두 나열(랭크 2개씩이라 두 번씩 옴)
}

interface RankDataPropsChara {
  rank: number;
  unowned: boolean;
  clf: false | number;
}

interface RankDataPropsCore {
  rankStat: {
    [key: string]: RankDataPropsRank; // 스탯 종류별로
  };
  charas: {
    [key: string]: RankDataPropsChara;
  };
  user: UserDataEqRank & UserDataUnowned;
  targetStat: StatType[]; // 스탯 종류
  minRank: number;
  maxRank: number;
  sortAndFilter: number[][]; // 정렬 및 필터
  dirty: boolean;
  isDirty: number;
}

type RankDataProps = RankDataPropsCore | undefined;

const saveUserData = (rankData: UserDataEqRank & UserDataUnowned) => {
  const { r, o, u, s, v, f } = rankData;
  userdata.eqrank.save({ r, s, v, f });
  userdata.unowned.save({ o, u });
};

interface RankDataRestoreAction {
  type: "restore";
  payload: RankDataProps;
}

interface RankDataCharaRankModify {
  type: "rank";
  payload: {
    chara: string;
    rank: number;
  };
}

const rankDataCharaRankModifyActionHandler = (
  state: NonNullable<RankDataProps>,
  action: RankDataCharaRankModify
) => {
  const { chara, rank } = action.payload;
  const userData = {
    ...state.user,
    r: {
      ...state.user.r,
      [chara]: rank,
    },
  };
  saveUserData(userData);
  return {
    ...state,
    isDirty: ((state.isDirty + 1) % 32768) + 65536,
    user: userData,
    charas: {
      ...state.charas,
      [chara]: {
        ...state.charas[chara],
        rank,
      },
    },
  };
};

interface RankDataChangeTargetStat {
  type: "targetstats";
  payload: StatType[];
}

const rankDataChangeTargetStatActionHandler = (
  state: NonNullable<RankDataProps>,
  action: RankDataChangeTargetStat
) => {
  const userData = {
    ...state.user,
    v: action.payload,
  };
  saveUserData(userData);
  return {
    ...state,
    isDirty: ((state.isDirty + 1) % 32768) + 65536,
    user: userData,
    targetStat: action.payload,
  };
};

interface RankDataChangeMinRank {
  type: "minrank";
  payload: number;
}

const rankDataChangeMinRankActionHandler = (
  state: NonNullable<RankDataProps>,
  action: RankDataChangeMinRank
) => {
  return {
    ...state,
    minRank: Math.min(state.maxRank, action.payload),
    maxRank: Math.max(state.maxRank, action.payload),
    dirty: true,
  };
};

interface RankDataChangeMaxRank {
  type: "maxrank";
  payload: number;
}

const rankDataChangeMaxRankActionHandler = (
  state: NonNullable<RankDataProps>,
  action: RankDataChangeMaxRank
) => {
  return {
    ...state,
    minRank: Math.min(state.minRank, action.payload),
    maxRank: Math.max(state.minRank, action.payload),
    dirty: true,
  };
};

interface RankDataApplyMinMax {
  type: "applyminmax";
}

const rankDataApplyMinMaxActionHandler = (
  state: NonNullable<RankDataProps>
) => {
  const userData = {
    ...state.user,
    r: Object.fromEntries(
      Object.entries(state.charas).map(([c, v]) => [
        c,
        Math.min(Math.max(v.rank, state.minRank), state.maxRank),
      ])
    ),
    s: [state.minRank, state.maxRank],
  };
  saveUserData(userData);
  return {
    ...state,
    isDirty: ((state.isDirty + 1) % 32768) + 65536,
    user: userData,
    charas: Object.fromEntries(
      Object.entries(state.charas).map(([c, v]) => {
        return [
          c,
          {
            ...v,
            rank: Math.max(Math.min(v.rank, state.maxRank), state.minRank),
          },
        ];
      })
    ),
    dirty: false,
  };
};

interface RankDataChangeSort {
  type: "sort";
  payload: SortBy;
}

const rankDataChangeSortActionHandler = (
  state: NonNullable<RankDataProps>,
  action: RankDataChangeSort
) => {
  const sortAndFilterData = sortChange(state.sortAndFilter, action.payload);
  const userData = {
    ...state.user,
    f: sortAndFilterData,
  };
  saveUserData(userData);
  return {
    ...state,
    sortAndFilter: sortAndFilterData,
    user: userData,
    isDirty: ((state.isDirty + 1) % 32768) + 65536,
  };
};

interface RankDataChangeFilter {
  type: "filter";
  payload: {
    filterBy: FilterBy;
    target: number;
  };
}

const rankDataChangeFilterActionHandler = (
  state: NonNullable<RankDataProps>,
  action: RankDataChangeFilter
) => {
  const sortAndFilterData = filterChange(
    state.sortAndFilter,
    action.payload.filterBy,
    action.payload.target
  );
  const userData = {
    ...state.user,
    f: sortAndFilterData,
  };
  saveUserData(userData);
  return {
    ...state,
    sortAndFilter: sortAndFilterData,
    user: userData,
    isDirty: ((state.isDirty + 1) % 32768) + 65536,
  };
};

interface RankDataClean {
  type: "clean";
}

const rankDataCleanActionHandler = (
  state: NonNullable<RankDataProps>
): RankDataProps => {
  return {
    ...state,
    isDirty: 0,
  };
};

type RankDataReduceAction =
  | RankDataRestoreAction
  | RankDataCharaRankModify
  | RankDataChangeTargetStat
  | RankDataChangeMinRank
  | RankDataChangeMaxRank
  | RankDataApplyMinMax
  | RankDataChangeSort
  | RankDataChangeFilter
  | RankDataClean;

const rankDataReducer = (
  state: RankDataProps,
  action: RankDataReduceAction
): RankDataProps => {
  if (action.type === "restore") return action.payload;
  if (!state) return state;
  switch (action.type) {
    case "rank":
      return rankDataCharaRankModifyActionHandler(state, action);
    case "targetstats":
      return rankDataChangeTargetStatActionHandler(state, action);
    case "minrank":
      return rankDataChangeMinRankActionHandler(state, action);
    case "maxrank":
      return rankDataChangeMaxRankActionHandler(state, action);
    case "applyminmax":
      return rankDataApplyMinMaxActionHandler(state);
    case "sort":
      return rankDataChangeSortActionHandler(state, action);
    case "filter":
      return rankDataChangeFilterActionHandler(state, action);
    case "clean":
      return rankDataCleanActionHandler(state);
  }
};

const EquipRank = () => {
  const { t } = useTranslation();
  const { googleLinked, isReady, autoLoad, autoSave } = useContext(AuthContext);
  const [rankData, dispatchRankData] = useReducer(rankDataReducer, undefined);
  const [viewType, setViewType] = useState<ViewType>("rankView");
  const [enableDialog, setEnableDialog] = useState(false);
  const [charaDrawerOpen, setCharaDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [withBoardStat, setWithBoardStat] = useState(false);
  const [boardStat, setBoardStat] = useState<{ [key: string]: number }>({});
  const [newCharaAlert, setNewCharaAlert] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [dirtyRankCharas, setDirtyRankCharas] = useState<string[]>([]);
  const [rankDialogOpened, setRankDialogOpened] = useState(false);
  const [rankDialogProp, setRankDialogProp] =
    useState<Omit<RankInfoDialogProps, "opened" | "onOpenChange">>();

  const initFromUserData = useCallback(() => {
    const charaList = Object.keys(chara);
    const { autoRepaired: ar1, ...userDataEqRankProto } =
      userdata.eqrank.load();
    const { autoRepaired: ar2, ...userDataUnownedProto } =
      userdata.unowned.load();
    const userData = { ...userDataEqRankProto, ...userDataUnownedProto };
    const ownNotEqual = !userData.o.every((c) => userData.r[c]);
    const unownNotEqual = userData.u.some((c) => userData.r[c]);
    const { eqrank: ed } = userdata.dialog.load();
    setEnableDialog(ed);
    if (ar1 || ar2) setNewCharaAlert(true);
    if (ownNotEqual || unownNotEqual) {
      if (ownNotEqual) {
        userData.o
          .filter((c) => !userData.r[c])
          .forEach((c) => {
            userData.r[c] = 1;
          });
      }
      if (unownNotEqual) {
        userData.r = Object.fromEntries(
          Object.entries(userData.r).filter(([c]) => !userData.u.includes(c))
        );
      }
      setNewCharaAlert(true);
      saveUserData(userData);
    }
    const sortedCharaList = [...charaList].sort(
      (a, b) => Number(chara[b].t) - Number(chara[a].t)
    );
    const rankStatLists = eqrank.r.map((rsl) =>
      rsl.map((singleRank) =>
        singleRank.map((statIndex) => eqrank.s[statIndex])
      )
    );
    const rankStat: RankDataPropsCore["rankStat"] = {};
    const charas: RankDataPropsCore["charas"] = {};
    userData.o.forEach((c) => {
      charas[c] = {
        rank: userData.r[c],
        unowned: false,
        clf: clonefactory.flat().includes(c)
          ? clonefactory.findIndex((a) => a.includes(c))
          : false,
      };
    });
    sortedCharaList.forEach((chara) => {
      const rankStatList = rankStatLists[eqrank.c[chara].r];
      rankStatList.forEach((singleRankStats, i) => {
        const reqRank = i + 2;
        singleRankStats.forEach((stat) => {
          const statType = StatType[stat[0]];
          const statValue = stat[1];
          if (rankStat[statType]) {
            rankStat[statType].charas.push({
              chara,
              reqRank,
              statValue,
            });
          } else {
            rankStat[statType] = {
              charas: [
                {
                  chara,
                  reqRank,
                  statValue,
                },
              ],
            };
          }
        });
      });
    });
    const dirty = Object.values(charas).some(
      (c) =>
        c.rank < (userData.s[0] || 1) || c.rank > (userData.s[1] || MAX_RANK)
    );
    dispatchRankData({
      type: "restore",
      payload: {
        rankStat,
        charas,
        user: userData,
        targetStat: userData.v || [],
        minRank: userData.s[0] || 1,
        maxRank: userData.s[1] || MAX_RANK,
        sortAndFilter: userData.f,
        dirty,
        isDirty: 65536,
      },
    });
  }, []);
  useEffect(() => {
    if (rankData && rankData.dirty) {
      setViewType("input");
      setDirtyRankCharas(
        Object.entries(rankData.charas)
          .filter(
            ([, v]) => v.rank < rankData.minRank || v.rank > rankData.maxRank
          )
          .map(([c]) => c)
      );
    } else {
      setDirtyRankCharas([]);
    }
  }, [rankData]);
  useEffect(initFromUserData, [initFromUserData]);
  const setDialogEnabled = useCallback((enabled: boolean) => {
    setEnableDialog(enabled);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { autoRepaired, ...userDialogData } = userdata.dialog.load();
    userdata.dialog.save({ ...userDialogData, eqrank: enabled });
  }, []);
  const saveSelectChara = useCallback(() => {
    setCharaDrawerOpen(false);
    initFromUserData();
  }, [initFromUserData]);
  useEffect(() => {
    if (newCharaAlert) {
      toast.info(t("ui.index.newCharacterAlert"));
      setNewCharaAlert(false);
    }
  }, [newCharaAlert, t]);
  // const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      if (isReady) {
        if (googleLinked && autoLoad && !loaded) {
          await autoLoad();
          initFromUserData();
          setLoaded(true);
        }
        if (!googleLinked) initFromUserData();
      }
    })();
  }, [isReady, googleLinked, autoLoad, initFromUserData, t, loaded]);

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const autosaver = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      dispatchRankData({ type: "clean" });
      if (isReady && googleLinked && autoSave) {
        autoSave();
      }
    }, 500);
  }, [autoSave, googleLinked, isReady]);
  useEffect(() => {
    if (rankData && rankData.isDirty) autosaver();
  }, [autosaver, rankData]);

  const getBoardStats = useCallback(() => {
    if (Object.keys(boardStat).length !== 0) return;
    const boardStats: { [key: string]: number } = {};
    const boardData = userdata.board.load().b;
    Object.entries(boardData).forEach(([c, b]) => {
      const charaBoard = board.c[c].b;
      charaBoard.forEach((nthboard, i) => {
        nthboard.forEach((boardList, j) => {
          boardList
            .toString(10)
            .split("")
            .forEach((targetBoardString, k) => {
              const targetBoard = Number(targetBoardString);
              const isChecked = b[i][j] & (1 << k);
              if (isChecked) {
                const statList = board.s[targetBoard];
                statList.forEach((stat, statIndex) => {
                  const statType = StatType[stat];
                  const statValue = board.b[targetBoard][statIndex][i];
                  boardStats[statType] =
                    (boardStats[statType] ?? 0) + statValue;
                });
              }
            });
        });
      });
    });
    setBoardStat(boardStats);
  }, [boardStat]);

  const changeRank = useCallback((chara: string, rank: number) => {
    dispatchRankData({ type: "rank", payload: { chara, rank } });
  }, []);

  type SortFuncType = (a: string, b: string) => number;
  const sortFunc = useMemo<SortFuncType>(() => {
    const defaultFunc: SortFuncType = (a, b) =>
      t(`chara.${a}`).localeCompare(t(`chara.${b}`));
    if (!rankData) return defaultFunc;
    const { sortAndFilter } = rankData;
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
  }, [rankData, t]);

  type FilterFuncType = (c: string) => boolean;
  const filterFunc = useMemo<FilterFuncType>(() => {
    const defaultFunc: FilterFuncType = () => true;
    if (!rankData) return defaultFunc;
    const { sortAndFilter } = rankData;
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
  }, [rankData]);

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
                        saveAndClose={saveSelectChara}
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
                          value={`${rankData?.minRank || 1}`}
                          onValueChange={(v) =>
                            dispatchRankData({
                              type: "minrank",
                              payload: Number(v),
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t("ui.equiprank.rankText", {
                                0: "1",
                              })}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(Array(MAX_RANK).keys()).map((i) => {
                              return (
                                <SelectItem key={i + 1} value={`${i + 1}`}>
                                  {t("ui.equiprank.rankText", {
                                    0: `${i + 1}`,
                                  })}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <Select
                          value={`${rankData?.maxRank || 1}`}
                          onValueChange={(v) =>
                            dispatchRankData({
                              type: "maxrank",
                              payload: Number(v),
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t("ui.equiprank.rankText", {
                                0: "1",
                              })}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(Array(MAX_RANK).keys()).map((i) => {
                              return (
                                <SelectItem key={i + 1} value={`${i + 1}`}>
                                  {t("ui.equiprank.rankText", {
                                    0: `${i + 1}`,
                                  })}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="text-right text-red-500 dark:text-red-400 text-sm">
                        {t("ui.equiprank.reqLevel", {
                          0: `${rankData?.maxRank || 1}`,
                          1: `${eqrank.q[(rankData?.maxRank || 1) - 1]}`,
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
                              const sortedWith = rankData?.sortAndFilter.find(
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
                                  onClick={() =>
                                    dispatchRankData({
                                      type: "sort",
                                      payload: SortBy[s],
                                    })
                                  }
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
                              rankData?.sortAndFilter.find(
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
                                  dispatchRankData({
                                    type: "filter",
                                    payload: {
                                      filterBy: FilterBy.Personality,
                                      target: personalityNumber,
                                    },
                                  })
                                }
                                className={cn(
                                  "flex-1 max-w-10 min-w-6 w-full h-auto aspect-square",
                                  hasPersonality ? "bg-[#dfeeab]/75" : ""
                                )}
                              >
                                <img
                                  src={`/icons/Common_UnitPersonality_${p}.png`}
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
                        dispatchRankData({
                          type: "targetstats",
                          payload: (
                            Object.values(StatType).filter(
                              (b) => typeof b === "string"
                            ) as string[]
                          ).map((b) => StatType[b as keyof typeof StatType]),
                        })
                      }
                    >
                      {t("ui.equiprank.selectTargetStatAll")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        dispatchRankData({
                          type: "targetstats",
                          payload: [
                            StatType.AttackMagic,
                            StatType.AttackPhysic,
                            StatType.Hp,
                          ],
                        })
                      }
                    >
                      {t("ui.equiprank.selectTargetStatRecommended")}
                    </Button>
                  </div>
                  <div className="px-4">
                    <ToggleGroup
                      type="multiple"
                      className="flex-wrap"
                      value={rankData?.targetStat.map((b) => StatType[b]) ?? []}
                      onValueChange={(v) => {
                        dispatchRankData({
                          type: "targetstats",
                          payload: v.map(
                            (b) => StatType[b as keyof typeof StatType]
                          ),
                        });
                      }}
                    >
                      {(
                        Object.values(StatType).filter(
                          (b) => typeof b === "string"
                        ) as string[]
                      ).map((bt) => {
                        return (
                          <ToggleGroupItem
                            key={bt}
                            value={bt}
                            aria-label={`Toggle ${bt}`}
                          >
                            <img
                              src={`/icons/Icon_${bt}.png`}
                              className="h-6 w-6 aspect-square"
                            />
                          </ToggleGroupItem>
                        );
                      })}
                    </ToggleGroup>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <SubtitleBar>
                    {t("ui.common.dialogEnableSwitchTitle")}
                  </SubtitleBar>
                  <div className="w-full px-4 my-2 text-left flex items-center gap-2">
                    <Switch
                      id="show-dialog-trigger"
                      checked={enableDialog}
                      onCheckedChange={(e) => {
                        setDialogEnabled(e);
                      }}
                    />
                    <Label htmlFor="show-dialog-trigger">
                      {t("ui.common.dialogEnableSwitchTitle")}
                    </Label>
                  </div>
                </div>
                {/* <div className="flex flex-col gap-2">
                  <SubtitleBar>{t("ui.common.backUpAndRestore")}</SubtitleBar>
                  <div className="flex flex-row gap-2 max-w-xl w-full px-4">
                    <div className="flex-1">
                      <Button
                        className="w-full"
                        onClick={() => dataFileWrite()}
                      >
                        {t("ui.common.backUp")}
                      </Button>
                    </div>
                    <div className="flex-1">
                      <Button
                        className="w-full"
                        onClick={() => fileInput.current?.click()}
                      >
                        {t("ui.common.restore")}
                      </Button>
                      <input
                        type="file"
                        accept=".txt"
                        className="hidden"
                        ref={fileInput}
                        onChange={(e) =>
                          dataFileRead(e.target.files).then((v) => {
                            if (v.success) {
                              toast.success(t("ui.index.fileSync.success"));
                              initFromUserData();
                              if (isReady && googleLinked && autoSave) {
                                autoSave();
                              }
                            } else {
                              toast.error(t(v.reason));
                            }
                          })
                        }
                      />
                    </div>
                  </div>
                </div> */}
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
                    if (c) getBoardStats();
                  }}
                />
                <Label htmlFor="view-all-stat-with-board">
                  {t("ui.equiprank.viewAllStatWithBoard")}
                </Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-auto gap-2.5">
                {rankData &&
                  Object.entries(
                    Object.entries(rankData.charas)
                      .filter(([, v]) => !v.unowned)
                      .map(([c, v]) =>
                        eqrank.r[eqrank.c[c].r]
                          .slice(0, v.rank - 1)
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
                              src={`/icons/Icon_${stat}.png`}
                            />
                          </div>
                          <div className="flex-1 -ml-8 bg-gradient-to-r from-transparent via-[#f2f9e7] dark:via-[#36a52d] via-[28px] to-[#f2f9e7] dark:to-[#36a52d] py-0.5 pr-2.5 pl-8 rounded-r-[14px] flex flex-row dark:contrast-125 dark:brightness-80">
                            <div className="text-left flex-auto">
                              {t(`stat.${stat}`)}
                            </div>
                            <div className="text-right flex-auto">
                              {withBoardStat
                                ? Math.round(
                                    (statValue *
                                      ((boardStat[stat] ?? 0) + 100)) /
                                      100
                                  )
                                : statValue}
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

      {rankData && (
        <div className="font-onemobile max-w-[1920px]">
          <Tabs
            value={viewType}
            className="w-full"
            onValueChange={(v) => {
              setViewType(v as ViewType);
              if (enableDialog) {
                setEnableDialog(false);
                setTimeout(() => setEnableDialog(true), 0);
              }
            }}
          >
            <TabsList
              className={cn("w-full flex", rankData.dirty ? "invisible" : "")}
            >
              <TabsTrigger value="input" className="flex-1">
                <div>{t("ui.equiprank.input")}</div>
              </TabsTrigger>
              <TabsTrigger
                value="rankView"
                className="flex-1"
                disabled={rankData.dirty}
              >
                <div>{t("ui.equiprank.rankView")}</div>
              </TabsTrigger>
              <TabsTrigger
                value="targetView"
                className="flex-1"
                disabled={rankData.dirty}
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
                {rankData.dirty && (
                  <div className="flex-initial text-right">
                    <Button
                      variant="destructive"
                      onClick={() => dispatchRankData({ type: "applyminmax" })}
                    >
                      {t("ui.equiprank.applyMinMax")}
                    </Button>
                  </div>
                )}
              </div>
              <div className="text-sm text-right opacity-50 py-2">
                {(rankData.dirty
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
                {rankData.user.o
                  .sort((a, b) =>
                    t(`chara.${a}`).localeCompare(t(`chara.${b}`))
                  )
                  .filter((c) => {
                    if (search)
                      return (
                        t(`chara.${c}`).includes(search) ||
                        icSearch(t(`chara.${c}`), search)
                      );
                    if (rankData.dirty) return dirtyRankCharas.includes(c);
                    return true;
                  })
                  .map((c) => {
                    return (
                      <div key={c} className="flex flex-col gap-1">
                        <div className="min-w-28 min-h-28 sm:min-w-32 sm:min-h-32 aspect-square border border-gray-700 rounded shadow-sm overflow-hidden relative">
                          <img
                            src={`/charas/${c}.png`}
                            className={`${
                              personalityBG[
                                Number(chara[c].t[0]) as Personality
                              ]
                            } aspect-square w-full`}
                          />
                          <div className="absolute w-full left-0 bottom-0 bg-slate-100/75 dark:bg-gray-800/75 text-sm text-center py-0.5">
                            {t(`chara.${c}`)}
                          </div>
                        </div>
                        <div className="flex flex-row gap-2 pl-2 pr-1 py-1 rounded bg-slate-400 dark:bg-slate-600">
                          <Slider
                            value={[rankData.charas[c].rank]}
                            min={rankData.minRank}
                            max={rankData.maxRank}
                            onValueChange={(v) =>
                              dispatchRankData({
                                type: "rank",
                                payload: {
                                  chara: c,
                                  rank: Math.max(
                                    Math.min(Number(v[0]), rankData.maxRank),
                                    rankData.minRank
                                  ),
                                },
                              })
                            }
                            className="w-full"
                            tabIndex={-1}
                          />
                          <LazyInput
                            type="text"
                            className={cn(
                              "w-8 p-1.5 text-right h-full",
                              rankData.charas[c].rank > rankData.maxRank ||
                                rankData.charas[c].rank < rankData.minRank
                                ? "ring-2 ring-red-400 dark:ring-red-600 bg-red-200 dark:bg-red-900"
                                : ""
                            )}
                            pattern="[0-9]{1,2}"
                            value={`${Math.max(
                              Math.min(
                                rankData.charas[c].rank,
                                rankData.maxRank
                              ),
                              rankData.minRank
                            )}`}
                            onValueChange={(v) =>
                              dispatchRankData({
                                type: "rank",
                                payload: {
                                  chara: c,
                                  rank: Math.max(
                                    Math.min(Number(v), rankData.maxRank),
                                    rankData.minRank
                                  ),
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>
            <TabsContent value="rankView">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-xl w-full text-left">
                    {t("ui.equiprank.rankProgressTitle")}
                  </div>
                  <div className="flex flex-col gap-1 items-stretch w-full">
                    {/* <div></div> */}
                    <div className="w-full flex flex-row h-1">
                      {Array.from(Array(rankData.maxRank).keys()).map((i) => {
                        const count = rankData.user.o.filter(
                          (c) => rankData.charas[c]?.rank === i + 1
                        ).length;
                        if (!count) return null;
                        return (
                          <div
                            key={i}
                            className={`${rankClassNames[i][2]} h-1`}
                            style={{
                              flex: `${count}`,
                            }}
                          />
                        );
                      })}
                    </div>
                    <div className="flex gap-0.5">
                      <div className="flex gap-1 flex-wrap text-left">
                        {Array.from(Array(rankData.maxRank).keys()).map((i) => {
                          const count = rankData.user.o.filter(
                            (c) => rankData.charas[c]?.rank === i + 1
                          ).length;
                          return (
                            <div
                              key={i}
                              className={`${rankClassNames[i][0]} border-slate-900 dark:border-slate-50 border text-xs py-0.5 w-8 inline-block text-center rounded`}
                            >
                              {count}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                {rankClassNames
                  .slice(0, rankData.maxRank)
                  .map((s, i) => ({ rank: i + 1, bg: s[0], txt: s[1] }))
                  .reverse()
                  .map((s) => {
                    const { rank, bg, txt } = s;
                    return (
                      <div key={bg}>
                        <div className={`${txt} text-xl w-full text-left`}>
                          {t("ui.equiprank.rankText", { 0: `${rank}` })}
                        </div>
                        <div
                          className={`${bg} w-full p-2 rounded-xl min-h-6 grid grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] gap-1`}
                        >
                          {rankData.user.o
                            .filter(filterFunc)
                            .sort(sortFunc)
                            .map((c) => {
                              if (rankData.charas[c]?.rank !== rank)
                                return null;
                              return (
                                <div
                                  key={c}
                                  className="min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 aspect-square border border-gray-700 rounded shadow-sm overflow-hidden relative"
                                >
                                  {enableDialog && (
                                    <div className="absolute right-0 top-0 p-0.5">
                                      <Info
                                        className="h-4 w-4 rounded-full"
                                        fill="#a0a0a0"
                                        onClick={() => {
                                          setRankDialogProp({
                                            chara: c,
                                            charaTypes: chara[c].t,
                                            rank,
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
                                            maxRank: rankData.maxRank,
                                            changeRank,
                                          });
                                          setRankDialogOpened(true);
                                        }}
                                      />
                                    </div>
                                  )}
                                  <img
                                    src={`/charas/${c}.png`}
                                    className={`${
                                      personalityBG[
                                        Number(chara[c].t[0]) as Personality
                                      ]
                                    } aspect-square w-full`}
                                  />
                                </div>
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
                {rankData.targetStat.length < 1 ? (
                  <div className="p-4 text-red-500 dark:text-red-400">
                    {t("ui.equiprank.shouldSetTargetStat")}
                  </div>
                ) : (
                  rankClassNames
                    .slice(1, rankData.maxRank)
                    .map((s, i) => ({ rank: i + 2, bg: s[0], txt: s[1] }))
                    .reverse()
                    .map((s) => {
                      const { rank, bg, txt } = s;
                      const targets = [
                        ...new Set(
                          rankData.targetStat
                            .map((stat) =>
                              rankData.rankStat[StatType[stat]].charas
                                .filter(
                                  (c) =>
                                    c.reqRank === rank &&
                                    rankData.user.o.includes(c.chara)
                                )
                                .map((c) => c.chara)
                            )
                            .flat()
                        ),
                      ];
                      const targetCount = targets.length;
                      const checkedCount = targets.filter(
                        (c) => rankData.charas[c].rank >= rank
                      ).length;
                      return (
                        <div key={bg}>
                          <div className="flex items-end">
                            <div
                              className={`${txt} text-xl flex-auto text-left`}
                            >
                              {t("ui.equiprank.rankText", { 0: `${rank}` })}
                            </div>
                            <div className="flex-auto text-right">
                              {checkedCount === targetCount && (
                                <img
                                  src="/icons/Photo_Complete_Stamp.png"
                                  className="h-10 -my-1.5 -mr-5 inline-block relative z-10"
                                />
                              )}
                              <span className={`${txt}`}>{checkedCount}</span>
                              <span className="text-sm">/{targetCount}</span>
                            </div>
                          </div>
                          <div
                            className={`${bg} w-full p-2 rounded-xl min-h-6 grid grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] gap-1`}
                          >
                            {targets
                              .sort((a, b) => {
                                const aRank = rankData.charas[a].rank;
                                const bRank = rankData.charas[b].rank;
                                const aSort = (aRank + 99 - rank) % 99;
                                const bSort = (bRank + 99 - rank) % 99;
                                return aRank !== bRank
                                  ? bSort - aSort
                                  : t(`chara.${a}`).localeCompare(
                                      t(`chara.${b}`)
                                    );
                              })
                              .map((c) => {
                                return (
                                  <div
                                    key={c}
                                    className={`min-w-14 sm:min-w-16`}
                                  >
                                    <div className="min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 aspect-square border border-gray-700 rounded shadow-sm overflow-hidden relative">
                                      <div className="min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 aspect-square">
                                        <img
                                          src={`/charas/${c}.png`}
                                          className={`${
                                            personalityBG[
                                              Number(
                                                chara[c].t[0]
                                              ) as Personality
                                            ]
                                          } aspect-square w-full${
                                            rank > rankData.charas[c].rank
                                              ? ""
                                              : " opacity-60"
                                          }`}
                                        />
                                      </div>
                                      {rank <= rankData.charas[c].rank && (
                                        <div className="absolute w-8/12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 z-10">
                                          <img
                                            src="/icons/Stage_RewardChack.png"
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
                                                rank: rankData.charas[c].rank,
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
                                                maxRank: rankData.maxRank,
                                                changeRank,
                                              });
                                              setRankDialogOpened(true);
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <div
                                      className={`${
                                        rankClassNames[
                                          rankData.charas[c].rank - 1
                                        ][1]
                                      } text-sm w-full text-center`}
                                    >
                                      {t("ui.equiprank.rankText", {
                                        0: `${rankData.charas[c].rank}`,
                                      })}
                                    </div>
                                    <div className="flex flex-col gap-1 text-center">
                                      {eqrank.r[eqrank.c[c].r]
                                        .map((rs) => rs.map((r) => eqrank.s[r]))
                                        .at(rank - 2)!
                                        .filter(([stat]) =>
                                          rankData.targetStat.includes(stat)
                                        )
                                        .map(([s, v]) => {
                                          return (
                                            <div
                                              key={s}
                                              className="flex flex-row gap-1 text-sm justify-center items-center"
                                            >
                                              <img
                                                src={`/icons/Icon_${StatType[s]}.png`}
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
      )}
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
