import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import LazyInput from "@/components/common/lazy-input";
import SearchBox from "@/components/common/search-with-icon";
import chara from "@/data/chara";
import eqrank from "@/data/eqrank";
import clonefactory from "@/data/clonefactory";
import { StatType, Personality } from "@/types/enums";
import RankInfoDialog from "@/components/parts/rank-info-dialog";
import SelectChara from "@/components/parts/select-chara";
import SubtitleBar from "@/components/parts/subtitlebar";

import userdata from "@/utils/userdata";
import { UserDataEqRank, UserDataUnowned } from "@/types/types";
import { dataFileRead, dataFileWrite } from "@/utils/dataRW";

const MAX_RANK = 7;

const rankClassNames = [
  [
    "bg-red-300 dark:bg-red-800",
    "text-red-800 dark:text-red-300",
    "bg-red-500 dark:bg-red-400",
  ],
  [
    "bg-orange-300 dark:bg-orange-800",
    "text-orange-800 dark:text-orange-300",
    "bg-orange-500 dark:bg-orange-400",
  ],
  [
    "bg-yellow-300 dark:bg-yellow-800",
    "text-yellow-800 dark:text-yellow-300",
    "bg-yellow-500 dark:bg-yellow-400",
  ],
  [
    "bg-lime-300 dark:bg-lime-800",
    "text-lime-800 dark:text-lime-300",
    "bg-lime-500 dark:bg-lime-400",
  ],
  [
    "bg-emerald-300 dark:bg-emerald-800",
    "text-emerald-800 dark:text-emerald-300",
    "bg-emerald-500 dark:bg-emerald-400",
  ],
  [
    "bg-cyan-300 dark:bg-cyan-800",
    "text-cyan-800 dark:text-cyan-300",
    "bg-cyan-500 dark:bg-cyan-400",
  ],
  [
    "bg-indigo-300 dark:bg-indigo-800",
    "text-indigo-800 dark:text-indigo-300",
    "bg-indigo-500 dark:bg-indigo-400",
  ],
  [
    "bg-fuchsia-300 dark:bg-fuchsia-800",
    "text-fuchsia-800 dark:text-fuchsia-300",
    "bg-fuchsia-500 dark:bg-fuchsia-400",
  ],
  [
    "bg-pink-300 dark:bg-pink-800",
    "text-pink-800 dark:text-pink-300",
    "bg-pink-500 dark:bg-pink-400",
  ],
];

const personalityBG = {
  [Personality.Cool]: "bg-personality-Cool",
  [Personality.Gloomy]: "bg-personality-Gloomy",
  [Personality.Jolly]: "bg-personality-Jolly",
  [Personality.Mad]: "bg-personality-Mad",
  [Personality.Naive]: "bg-personality-Naive",
};

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
  viewType: "input" | "rankView" | "targetView";
  targetStat: StatType[]; // 스탯 종류
  minRank: number;
  maxRank: number;
  dirty: boolean;
}

type RankDataProps = RankDataPropsCore | undefined;

const saveUserData = (rankData: UserDataEqRank & UserDataUnowned) => {
  const { r, o, u, s, v } = rankData;
  userdata.eqrank.save({ r, s, v });
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

interface RankDataSwitchViewType {
  type: "viewtype";
  payload: "input" | "rankView" | "targetView";
}

const rankDataSwitchViewTypeActionHandler = (
  state: NonNullable<RankDataProps>,
  action: RankDataSwitchViewType
) => {
  if (state.dirty) return state;
  return {
    ...state,
    viewType: action.payload,
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

type RankDataReduceAction =
  | RankDataRestoreAction
  | RankDataCharaRankModify
  | RankDataSwitchViewType
  | RankDataChangeTargetStat
  | RankDataChangeMinRank
  | RankDataChangeMaxRank
  | RankDataApplyMinMax;

const rankDataReducer = (
  state: RankDataProps,
  action: RankDataReduceAction
): RankDataProps => {
  if (action.type === "restore") return action.payload;
  if (!state) return state;
  switch (action.type) {
    case "rank":
      return rankDataCharaRankModifyActionHandler(state, action);
    case "viewtype":
      return rankDataSwitchViewTypeActionHandler(state, action);
    case "targetstats":
      return rankDataChangeTargetStatActionHandler(state, action);
    case "minrank":
      return rankDataChangeMinRankActionHandler(state, action);
    case "maxrank":
      return rankDataChangeMaxRankActionHandler(state, action);
    case "applyminmax":
      return rankDataApplyMinMaxActionHandler(state);
  }
};

const EquipRank = () => {
  const { t } = useTranslation();
  const [rankData, dispatchRankData] = useReducer(rankDataReducer, undefined);
  const [charaDrawerOpen, setCharaDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");

  const initFromUserData = useCallback(() => {
    const charaList = Object.keys(chara);
    const UserDataEqRankProto = userdata.eqrank.load();
    const userDataUnownedProto = userdata.unowned.load();
    const userData = { ...UserDataEqRankProto, ...userDataUnownedProto };
    const ownNotEqual = !userData.o.every((c) => userData.r[c]);
    const unownNotEqual = userData.u.some((c) => userData.r[c]);
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
    dispatchRankData({
      type: "restore",
      payload: {
        rankStat,
        charas,
        user: userData,
        viewType: "input",
        targetStat: userData.v || [],
        minRank: userData.s[0] || 1,
        maxRank: userData.s[1] || MAX_RANK,
        dirty: Object.values(charas).some(
          (c) =>
            c.rank < (userData.s[0] || 1) ||
            c.rank > (userData.s[1] || MAX_RANK)
        ),
      },
    });
  }, []);
  useEffect(initFromUserData, [initFromUserData]);
  const saveSelectChara = useCallback(() => {
    setCharaDrawerOpen(false);
    initFromUserData();
  }, [initFromUserData]);
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <Layout>
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
                    <SelectChara
                      isOpen={charaDrawerOpen}
                      onOpenChange={setCharaDrawerOpen}
                      saveAndClose={saveSelectChara}
                    />
                  </div>
                </div>
                {rankData?.viewType === "input" && (
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
                            } else {
                              toast.error(t(v.reason));
                            }
                          })
                        }
                      />
                    </div>
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
                              {statValue}
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
          <Tabs value={rankData.viewType} className="w-full">
            <TabsList
              className={`w-full flex${rankData.dirty ? " invisible" : ""}`}
            >
              <TabsTrigger
                value="input"
                className="flex-1"
                onClick={() =>
                  dispatchRankData({ type: "viewtype", payload: "input" })
                }
              >
                <div>{t("ui.equiprank.input")}</div>
              </TabsTrigger>
              <TabsTrigger
                value="rankView"
                className="flex-1"
                onClick={() =>
                  dispatchRankData({ type: "viewtype", payload: "rankView" })
                }
                disabled={rankData.dirty}
              >
                <div>{t("ui.equiprank.rankView")}</div>
              </TabsTrigger>
              <TabsTrigger
                value="targetView"
                className="flex-1"
                onClick={() =>
                  dispatchRankData({ type: "viewtype", payload: "targetView" })
                }
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
                  .filter((c) =>
                    search ? t(`chara.${c}`).includes(search) : true
                  )
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
                            className={`w-8 p-1.5 text-right h-full${
                              rankData.charas[c].rank > rankData.maxRank ||
                              rankData.charas[c].rank < rankData.minRank
                                ? " ring-2 ring-red-400 dark:ring-red-600 bg-red-200 dark:bg-red-900"
                                : ""
                            }`}
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
                  <div className="text-lg w-full text-left">
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
                        <div className={`${txt} text-lg w-full text-left`}>
                          {t("ui.equiprank.rankText", { 0: `${rank}` })}
                        </div>
                        <div
                          className={`${bg} w-full p-2 rounded-xl min-h-6 grid grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] gap-1`}
                        >
                          {rankData.user.o
                            .sort((a, b) =>
                              t(`chara.${a}`).localeCompare(t(`chara.${b}`))
                            )
                            .map((c) => {
                              if (rankData.charas[c]?.rank !== rank)
                                return null;
                              return (
                                <div
                                  key={c}
                                  className="min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 aspect-square border border-gray-700 rounded shadow-sm overflow-hidden relative"
                                >
                                  <div className="absolute right-0 top-0 p-0.5">
                                    <RankInfoDialog
                                      chara={c}
                                      rank={rank}
                                      rankStats={eqrank.r[eqrank.c[c].r].map(
                                        (rs) => rs.map((r) => eqrank.s[r])
                                      )}
                                      sameRankBonus={Object.entries(eqrank.c)
                                        .filter(
                                          ([k, v]) =>
                                            k !== c && v.r === eqrank.c[c].r
                                        )
                                        .map(([k]) => k)}
                                    />
                                  </div>
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
                      return (
                        <div key={bg}>
                          <div className={`${txt} text-lg w-full text-left`}>
                            {t("ui.equiprank.rankText", { 0: `${rank}` })}
                          </div>
                          <div
                            className={`${bg} w-full p-2 rounded-xl min-h-6 grid grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] gap-1`}
                          >
                            {[
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
                            ]
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
                                      <div className="absolute right-0 top-0 p-0.5">
                                        <RankInfoDialog
                                          chara={c}
                                          rank={rankData.charas[c].rank}
                                          rankStats={eqrank.r[
                                            eqrank.c[c].r
                                          ].map((rs) =>
                                            rs.map((r) => eqrank.s[r])
                                          )}
                                          sameRankBonus={Object.entries(
                                            eqrank.c
                                          )
                                            .filter(
                                              ([k, v]) =>
                                                k !== c && v.r === eqrank.c[c].r
                                            )
                                            .map(([k]) => k)}
                                        />
                                      </div>
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
    </Layout>
  );
};

export default EquipRank;
