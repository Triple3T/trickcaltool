import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { CircleArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Select from "@/components/common/combobox-select";
import Loading from "@/components/common/loading";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
// import SelectChara from "@/components/parts/select-chara";
const SelectChara = lazy(() => import("@/components/parts/select-chara"));
import SubtitleBar from "@/components/parts/subtitlebar";
import BoardCharaSlot from "@/components/parts/board-chara-slot";
import { BoardInfoDialog } from "@/components/parts/board-info-dialog";
import type { BoardInfoDialogProps } from "@/components/parts/board-info-dialog";
import BoardGuideDialog from "@/components/parts/board-guide-dialog";
import board from "@/data/board";
import chara from "@/data/chara";
import route from "@/data/route";
import clonefactory from "@/data/clonefactory";
import {
  Attack,
  BoardType,
  Class,
  Personality,
  Position,
  Race,
  StatType,
} from "@/types/enums";
import int1BitCount from "@/utils/int1bitCount";

import {
  personalityBG,
  personalityBGDisabled,
  personalityBGMarked,
} from "@/utils/personalityBG";
import type { UserDataOwnedCharaInfo } from "@/types/types";
import {
  useUserDataActions,
  useUserDataStatus,
  useUserDataBoard,
  useUserDataCharaInfo,
  useUserDataAside3Stats,
} from "@/stores/useUserDataStore";

interface BoardDataPropsBoard {
  charas: {
    name: string;
    ldx: number; // 자물쇠 개수, 0~2
    bdx: number; // 몇 번째 자릿수인지, 0~6?
    checked: boolean; // 색칠했는지 여부
    unowned: boolean; // 보유 여부
    clf: false | number;
  }[]; // 캐릭터 중복 포함 모두 나열(ldx와 bdx 때문에 모두 unique함)
}

export const BoardStatStatistic = ({
  stat,
  data,
  additionalValue = 0,
  withoutScrollButton = false,
}: {
  stat: string;
  data: { [key: string]: BoardDataPropsBoard[] };
  additionalValue?: number;
  withoutScrollButton?: boolean;
}) => {
  const { t } = useTranslation();
  const statType = StatType[stat as keyof typeof StatType];
  const xref = board.s
    .map<[number[], number]>((v, i) => [v, i])
    .filter(([s]) => s.includes(statType))
    .map(([s, i]) => [
      i,
      board.b[i][s.indexOf(statType)].reduce((a, b) => a + b, 0),
    ])
    .sort((a, b) => b[1] - a[1])[0][0];
  const elementQuery = `#statcard${BoardType[xref]}`;
  const statStatistic = Object.entries(data).map(([b, d]) => {
    const boardType = BoardType[b as keyof typeof BoardType];
    const statMult = board.b[boardType][board.s[boardType].indexOf(statType)];
    const cur = d.map((nth) => nth.charas.filter((c) => c.checked).length);
    const stat = d.map(
      (nth, n) => nth.charas.filter((c) => c.checked).length * statMult[n]
    );
    const max = d.map((nth) => nth.charas.length);
    return { cur, max, stat };
  });
  const statCheckedTotal = statStatistic.reduce(
    (a, b) => ({
      cur: Array.from(Array(Math.max(a.cur.length, b.cur.length)).keys()).map(
        (i) => (a.cur[i] ?? 0) + (b.cur[i] ?? 0)
      ),
      max: Array.from(Array(Math.max(a.max.length, b.max.length)).keys()).map(
        (i) => (a.max[i] ?? 0) + (b.max[i] ?? 0)
      ),
    }),
    {
      cur: [] as number[],
      max: [] as number[],
    }
  );
  const finalStat =
    statStatistic.reduce((a, b) => a + b.stat.reduce((a, b) => a + b, 0), 0) +
    additionalValue;
  return (
    <div className="flex">
      <div className="relative z-10">
        <img
          className="h-10 mr-2 aspect-square inline-block align-middle"
          src={`/icons/Icon_${stat}.png`}
        />
      </div>
      <div className="flex flex-col flex-1 gap-1 -ml-8">
        <div className="bg-gradient-to-r from-transparent via-[#f2f9e7] dark:via-[#36a52d] via-[28px] to-[#f2f9e7] dark:to-[#36a52d] py-0.5 pr-2.5 pl-8 rounded-r-[14px] flex flex-row dark:contrast-125 dark:brightness-80">
          <div className="text-left flex-auto">{t(`stat.${stat}`)}</div>
          <div className="text-right flex-auto">
            {finalStat.toLocaleString()}%
          </div>
          {!withoutScrollButton && (
            <CircleArrowDown
              className={cn(
                "w-4 h-4 my-1 ml-1 -mr-1",
                document.querySelector(elementQuery)
                  ? "cursor-pointer"
                  : "opacity-50"
              )}
              onClick={() => {
                const element = document.querySelector(elementQuery);
                if (!element) return;
                element.scrollIntoView({
                  block: "start",
                  inline: "nearest",
                  behavior: "smooth",
                });
              }}
            />
          )}
        </div>
        <div className="bg-gradient-to-r from-transparent via-[#e9f5cf] dark:via-[#169a2d] via-[28px] to-[#e9f5cf] dark:to-[#169a2d] py-px pr-2.5 pl-8 rounded-r-[11px] flex flex-row gap-1 text-sm dark:contrast-125 dark:brightness-80">
          {statCheckedTotal.max.map((m, i) => {
            const max = m;
            const cur = statCheckedTotal.cur[i];
            return (
              <div key={i} className="flex-1 text-center">
                <img
                  src={`/icons/RecordReward_Tab_${
                    ["Easy", "Herd", "VeryHard"][i]
                  }Lv.png`}
                  className="bg-greenicon rounded-full align-middle h-4 aspect-square mr-1 inline-block dark:border dark:border-white"
                />
                <span
                  className={cn(
                    cur === max ? "text-red-600 dark:text-red-400" : ""
                  )}
                >
                  {cur}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const BoardCrayonStatistic = ({
  rarity,
  data,
  require,
}: {
  rarity: number;
  data: number[][][];
  require: number[];
}) => {
  const { t } = useTranslation();
  const statStatistic = data
    .map((charaBoard) =>
      charaBoard.map((nthBoard) =>
        nthBoard.reduce((a, b) => a + int1BitCount(b), 0)
      )
    )
    .reduce(
      (a, b) =>
        a.length > b.length
          ? a.map((v, i) => v + (b[i] ?? 0))
          : b.map((v, i) => v + (a[i] ?? 0)),
      []
    );
  return (
    <div className="flex">
      <div className="relative z-10">
        <img
          className="h-10 mr-2 aspect-square inline-block align-middle"
          src={`/icons/Item_Crayon${rarity}.png`}
        />
      </div>
      <div className="flex flex-col flex-1 gap-1 -ml-8">
        <div className="bg-gradient-to-r from-transparent via-[#f2f9e7] dark:via-[#36a52d] via-[28px] to-[#f2f9e7] dark:to-[#36a52d] py-0.5 pr-2.5 pl-8 rounded-r-[14px] flex flex-row dark:contrast-125 dark:brightness-80">
          <div className="text-left flex-auto">
            {t(`ui.board.usedCountLabel`)}
          </div>
          <div className="text-right flex-auto">
            {statStatistic
              .reduce((a, b, i) => a + b * require[i], 0)
              .toLocaleString()}
            {t("ui.board.crayonCountUnit")}
          </div>
        </div>
        <div className="bg-gradient-to-r from-transparent via-[#e9f5cf] dark:via-[#169a2d] via-[28px] to-[#e9f5cf] dark:to-[#169a2d] py-px pr-2.5 pl-8 rounded-r-[11px] flex flex-row gap-1 text-sm dark:contrast-125 dark:brightness-80">
          {statStatistic.map((count, i) => (
            <div key={i} className="flex-1 text-center">
              <img
                src={`/icons/RecordReward_Tab_${
                  ["Easy", "Herd", "VeryHard"][i]
                }Lv.png`}
                className="bg-greenicon rounded-full align-middle h-4 aspect-square mr-1 inline-block dark:border dark:border-white"
              />
              <span>{count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BoardTotal = ({ current, max }: { current: number; max: number }) => {
  const className = ["text-3xl/4 min-w-max"];
  if (current === 0) className.push("text-red-600", "dark:text-red-500");
  else if (current === max)
    className.push("text-green-500", "dark:text-green-400");
  else className.push("text-orange-500", "dark:text-orange-400");
  return (
    <>
      {current === max && (
        <div className="absolute w-14 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 z-10">
          <img
            src="/icons/Photo_Complete_Stamp.png"
            className="w-100 opacity-100"
          />
        </div>
      )}
      <span className={className.join(" ")}>{current}</span>
      <span className="text-sm min-w-max">&nbsp;/{max}</span>
    </>
  );
};

const TrickcalBoard = () => {
  const { t } = useTranslation();
  const dataStatus = useUserDataStatus();
  const {
    boardVisible,
    boardClassification,
    boardViewNthBoard,
    boardClick,
    boardIndex: changeBoardIndex,
  } = useUserDataActions();
  const userDataBoard = useUserDataBoard();
  const userDataCharaInfo = useUserDataCharaInfo();
  const userDataAside3Stats = useUserDataAside3Stats();
  const [enableDialog, setEnableDialog] = useState(true);
  const [charaDrawerOpen, setCharaDrawerOpen] = useState(false);
  const [newCharaAlert, setNewCharaAlert] = useState(false);
  const [boardDialogOpened, setBoardDialogOpened] = useState(false);
  const [includeAside, setIncludeAside] = useState(false);
  const [boardDialogProp, setBoardDialogProp] =
    useState<Omit<BoardInfoDialogProps, "opened" | "onOpenChange">>();

  // data optimize & memoize
  const routeMap = useMemo(() => {
    const map = new Map<string, number | string | string[]>();
    // (s or r), race, boardindex, (b or s), routeindex
    const routeDataTypeCollection = ["s", "r"] as const;
    const raceStringCollection = Object.values(Race).filter(
      (v) => typeof v === "string"
    ) as string[];
    const boardIndexCollection = [0, 1, 2];
    const routeDataBoardOrStartCollection = ["b", "s"] as const;

    routeDataTypeCollection.forEach((a) => {
      raceStringCollection.forEach((b) => {
        boardIndexCollection.forEach((c) => {
          routeDataBoardOrStartCollection.forEach((d) => {
            const routeData = route[a][b][c][d];
            if (!routeData) return;
            if (Array.isArray(routeData)) {
              routeData.forEach((e, i) => {
                map.set(`${a}.${b}.${c}.${d}.${i}`, e);
              });
              map.set(`${a}.${b}.${c}.${d}`, routeData);
            } else {
              map.set(`${a}.${b}.${c}.${d}`, routeData);
            }
          });
        });
      });
    });
    return map;
  }, []);
  const getFromRouteMap = useCallback(
    (key: string) => {
      return routeMap.get(key);
    },
    [routeMap]
  );
  const boardMap = useMemo(() => {
    const map = new Map<string, string[]>();
    Object.entries(board.c).forEach(([charaName, value]) => {
      const charaRace = Race[Number(chara[charaName].t.charAt(5))];
      const otherBoards = value.b.map((b) =>
        b.map((v) => v.toString()).join("")
      );
      const otherRoutes = value.r.map((b, index) =>
        b
          .join(".")
          .split(".")
          .map((v) => route.r[charaRace][index].b[Number(v)])
      );
      map.set(`${charaName}.otherBoards`, otherBoards);
      otherRoutes.forEach((r, i) =>
        map.set(`${charaName}.otherRoutes.${i}`, r)
      );
    });
    return map;
  }, []);
  const getFromBoardMap = useCallback(
    (key: string) => {
      return boardMap.get(key);
    },
    [boardMap]
  );

  useEffect(() => {
    if (newCharaAlert) {
      toast.info(t("ui.index.newCharacterAlert"));
      setNewCharaAlert(false);
    }
  }, [newCharaAlert, t]);

  if (dataStatus !== "initialized" || !userDataBoard || !userDataCharaInfo)
    return <Loading />;

  return (
    <>
      <Card className="p-4 object-cover max-w-xl mt-0 mb-4 gap-2 mx-auto font-onemobile">
        {/* Settings */}
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("ui.board.settings")}</AccordionTrigger>
            <AccordionContent className="text-base">
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
                <div className="flex flex-col gap-2">
                  <SubtitleBar>{t("ui.board.selectBoardType")}</SubtitleBar>
                  <div className="px-4 flex gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        boardVisible(
                          (
                            Object.values(BoardType).filter(
                              (b) => typeof b === "string"
                            ) as string[]
                          ).map((b) => BoardType[b as keyof typeof BoardType])
                        )
                      }
                    >
                      {t("ui.board.selectBoardTypeAll")}
                    </Button>
                    <BoardGuideDialog
                      onCloseGuide={boardVisible}
                      commonProps={[
                        BoardType.AttackBoth,
                        BoardType.CriticalMult,
                        BoardType.CriticalRate,
                        BoardType.Hp,
                      ]}
                      criticalResistProp={BoardType.CriticalResist}
                      criticalMultResistProp={BoardType.CriticalMultResist}
                      criticalResistDefault={
                        (userDataBoard.v.includes(BoardType.CriticalResist) ??
                          false) &&
                        !(
                          userDataBoard.v.includes(
                            BoardType.CriticalMultResist
                          ) ?? false
                        )
                      }
                      criticalMultResistDefault={
                        (userDataBoard.v.includes(
                          BoardType.CriticalMultResist
                        ) ??
                          false) &&
                        !(
                          userDataBoard.v.includes(BoardType.CriticalResist) ??
                          false
                        )
                      }
                    />
                  </div>
                  <div className="px-4">
                    <ToggleGroup
                      type="multiple"
                      className="flex-wrap"
                      value={
                        userDataBoard.v.map((b) => BoardType[b]) ??
                        (Object.values(BoardType).filter(
                          (b) => typeof b === "string"
                        ) as string[])
                      }
                      onValueChange={(v) => {
                        boardVisible(
                          v.map((b) => BoardType[b as keyof typeof BoardType])
                        );
                      }}
                    >
                      {(
                        Object.values(BoardType).filter(
                          (b) => typeof b === "string"
                        ) as string[]
                      ).map((bt) => {
                        return (
                          <ToggleGroupItem
                            key={bt}
                            value={bt}
                            aria-label={`Toggle ${bt}`}
                            className="px-2"
                          >
                            <img
                              src={`/boards/Tile_${bt}On.png`}
                              className="h-8 w-8 aspect-square"
                            />
                          </ToggleGroupItem>
                        );
                      })}
                    </ToggleGroup>
                  </div>
                </div>
                {/* <div className="flex flex-col gap-2">
                  <SubtitleBar>{t("ui.board.mainClassification")}</SubtitleBar>
                  <div></div>
                </div> */}
                <div className="flex flex-col gap-2">
                  <SubtitleBar>{t("ui.board.subClassification")}</SubtitleBar>
                  <div className="w-full px-4">
                    <Select
                      value={userDataBoard.c[0] ?? 0}
                      setValue={(payload) =>
                        boardClassification([Number(payload)])
                      }
                      placeholder={t("ui.index.personality")}
                      items={[
                        "personality",
                        "defaultstar",
                        "attack",
                        "position",
                        "class",
                        "race",
                      ].map((key, value) => ({
                        value,
                        label: t(`ui.index.${key}`),
                      }))}
                    />
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
              {t("ui.board.allStatPercentTotal")}
            </AccordionTrigger>
            <AccordionContent className="text-base">
              <div className="flex flex-row mb-2">
                <div className="flex-1 text-left flex items-center gap-2">
                  <Switch
                    id="include-aside"
                    checked={includeAside}
                    onCheckedChange={setIncludeAside}
                  />
                  <Label htmlFor="include-aside">
                    {t("ui.board.includeAside")}
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-auto gap-2.5">
                {[1, 0, 7, 6, 4, 2, 5, 3, 8].map((statNum) => {
                  const stat = StatType[statNum];
                  const includedBoards = board.s
                    .map((s, i) => [s, i] as [number[], number])
                    .filter(([s]) => s.includes(statNum))
                    .map(([, i]) => i);
                  const data = Object.fromEntries(
                    includedBoards.map((b) => [
                      BoardType[b],
                      Array(3)
                        .fill(0)
                        .map((_, nthboard) => {
                          return {
                            charas: Object.entries(board.c)
                              .filter(([, boardData]) => {
                                return boardData.b[nthboard]
                                  .map((cb) => cb.toString())
                                  .join("")
                                  .includes(`${b}`);
                              })
                              .map(([charaName, boardData]) => {
                                return boardData.b[nthboard]
                                  .map((cb, j) => {
                                    const returnArray =
                                      [] as BoardDataPropsBoard["charas"];
                                    cb.toString(10)
                                      .split("")
                                      .forEach((cbi, k) => {
                                        if (cbi === `${b}`) {
                                          const unowned =
                                            userDataCharaInfo[charaName]
                                              .unowned;
                                          returnArray.push({
                                            name: charaName,
                                            ldx: j,
                                            bdx: k,
                                            checked: unowned
                                              ? false
                                              : (userDataCharaInfo[charaName]
                                                  .board[nthboard][j] &
                                                  (1 << k)) >
                                                0,
                                            unowned,
                                            clf: clonefactory.l[clonefactory.f]
                                              .flat()
                                              .includes(charaName)
                                              ? clonefactory.l[
                                                  clonefactory.f
                                                ].findIndex((a) =>
                                                  a.includes(charaName)
                                                )
                                              : false,
                                          });
                                        }
                                      });
                                    return returnArray;
                                  })
                                  .flat();
                              })
                              .flat(),
                          };
                        }),
                    ])
                  );
                  return (
                    <BoardStatStatistic
                      key={stat}
                      stat={stat}
                      data={data}
                      additionalValue={
                        includeAside
                          ? (userDataAside3Stats[10000 + statNum] ?? 0) / 100
                          : 0
                      }
                    />
                  );
                })}

                <BoardCrayonStatistic
                  rarity={4}
                  data={Object.values(userDataCharaInfo).map((c) =>
                    c.unowned ? [[0], [0], [0]] : c.board
                  )}
                  require={[2, 4, 6]}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <div className="w-full font-onemobile">
        <Tabs value={`${userDataBoard.i}`} className="w-full">
          <TabsList className="w-full flex">
            {Array.from(Array(3).keys()).map((v) => {
              const isCompleted = Object.values(board.c).every(
                (b) => b.b[v] && b.b[v].length
              );
              return (
                <TabsTrigger
                  key={v}
                  value={`${v}`}
                  className="flex-1"
                  onClick={() => {
                    if (v === userDataBoard.i) return;
                    boardViewNthBoard(v);
                    if (enableDialog) {
                      setEnableDialog(false);
                      setTimeout(() => setEnableDialog(true), 0);
                    }
                  }}
                >
                  <div>{t(`ui.board.board${v + 1}`)}</div>
                  {!isCompleted && (
                    <div className="text-red-700 dark:text-red-400">*</div>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
        {!Object.values(board.c).every(
          (b) => b.b[userDataBoard.i] && b.b[userDataBoard.i].length
        ) ? (
          <div className="mt-1 text-sm text-red-700 dark:text-red-400 w-full text-right">
            *
            {t("ui.board.dataIncompleteStatus", {
              0: Object.values(board.c).filter(
                (b) => b.b[userDataBoard.i] && b.b[userDataBoard.i].length
              ).length,
              1: Object.values(board.c).length,
            })}
          </div>
        ) : (
          <div className="mt-1 text-sm text-red-700 dark:text-red-400">
            &nbsp;
          </div>
        )}
      </div>
      {userDataBoard && (
        <div className="font-onemobile max-w-[1920px] columns-1 md:columns-2 lg:columns-3 gap-4 py-4">
          {(
            Object.values(BoardType).filter(
              (bt) =>
                typeof bt === "string" &&
                userDataBoard.v.includes(
                  BoardType[bt as keyof typeof BoardType]
                )
            ) as string[]
          ).map((bt) => {
            const currentBoardType = BoardType[bt as keyof typeof BoardType];
            const currentBoardCharas = Object.entries(board.c)
              .filter(([, boardData]) => {
                return boardData.b[userDataBoard.i]
                  .map((cb) => cb.toString())
                  .join("")
                  .includes(`${currentBoardType}`);
              })
              .map(([charaName, boardData]) => {
                return boardData.b[userDataBoard.i]
                  .map((cb, j) => {
                    const returnArray = [] as BoardDataPropsBoard["charas"];
                    cb.toString(10)
                      .split("")
                      .forEach((cbi, k) => {
                        if (cbi === `${currentBoardType}`) {
                          const unowned = userDataCharaInfo[charaName].unowned;
                          returnArray.push({
                            name: charaName,
                            ldx: j,
                            bdx: k,
                            checked: unowned
                              ? false
                              : (userDataCharaInfo[charaName].board[
                                  userDataBoard.i
                                ][j] &
                                  (1 << k)) >
                                0,
                            unowned,
                            clf: clonefactory.l[clonefactory.f]
                              .flat()
                              .includes(charaName)
                              ? clonefactory.l[clonefactory.f].findIndex((a) =>
                                  a.includes(charaName)
                                )
                              : false,
                          });
                        }
                      });
                    return returnArray;
                  })
                  .flat();
              })
              .flat();
            if (currentBoardCharas.length < 1) return null;
            return (
              <Card
                key={bt}
                id={`statcard${bt}`}
                className="p-4 object-cover max-w-full break-inside-avoid mt-0 mb-4 scroll-mt-14"
              >
                {/* title bar */}
                <div className="flex gap-2 items-center">
                  <img
                    className="bg-board-special rotate-10 w-[3.2rem] flex-initial flex-shrink-0 bg-cover dark:brightness-80 dark:contrast-125"
                    src={`/boards/Tile_${bt}On.png`}
                  />
                  <div className="flex-initial flex-shrink-0 flex flex-col items-start">
                    <div className="text-sm">
                      <img
                        className="mr-1 w-[1.2rem] inline-flex bg-greenicon rounded-full align-middle"
                        src={`/icons/RecordReward_Tab_${
                          ["Easy", "Herd", "VeryHard"][userDataBoard.i]
                        }Lv.png`}
                      />
                      <span className="align-middle">
                        {t(`ui.board.board${userDataBoard.i + 1}`)}
                      </span>
                    </div>
                    <div className="text-2xl">{t(`board.${bt}`)}</div>
                  </div>
                  <div className="flex-1" />
                  <div className="shrink relative w-18">
                    <BoardTotal
                      current={
                        currentBoardCharas.filter((c) => c.checked).length
                      }
                      max={currentBoardCharas.length}
                    />
                  </div>
                </div>
                {/* chara list bar */}
                <div className="flex flex-col gap-4 mt-4">
                  {(
                    Object.values(
                      [
                        Personality,
                        { 1: "3", 2: "2", 3: "1" },
                        Attack,
                        Position,
                        Class,
                        Race,
                      ][userDataBoard.c[0]]
                    ).filter((c) => typeof c === "string") as string[]
                  ).map((k) => {
                    const displayCharas = currentBoardCharas.filter(
                      ({ name }) =>
                        chara[name].t[userDataBoard.c[0]] ===
                        `${
                          (
                            [
                              Personality,
                              { 1: 1, 2: 2, 3: 3 },
                              Attack,
                              Position,
                              Class,
                              Race,
                            ][userDataBoard.c[0]] as {
                              [key: string]: string | number;
                            }
                          )[k]
                        }`
                    );
                    if (displayCharas.length < 1) return null;
                    return (
                      <div key={`${k}`} className="flex flex-col gap-2">
                        {/* chara list title */}
                        <div className="w-full text-left">
                          {userDataBoard.c[0] === 1 ? (
                            <>
                              {Array.from(Array(Number(k)).keys()).map((v) => (
                                <img
                                  key={v}
                                  className="w-6 mr-1 inline-flex align-middle"
                                  src={`/icons/HeroGrade_000${
                                    [5, 3, 4][Number(k) - 1]
                                  }.png`}
                                />
                              ))}
                            </>
                          ) : (
                            <>
                              <img
                                className="w-6 mr-1 inline-flex align-middle"
                                src={`${
                                  [
                                    "/icons/Common_UnitPersonality_",
                                    "",
                                    "/icons/Common_UnitAttack",
                                    "/icons/Common_Position",
                                    "/icons/Common_Unit",
                                    "/album/Album_Icon_",
                                  ][userDataBoard.c[0]]
                                }${k}.png`}
                              />
                              {t(
                                `${
                                  [
                                    "personality",
                                    "",
                                    "attack",
                                    "position",
                                    "class",
                                    "race",
                                  ][userDataBoard.c[0]]
                                }.${k}`
                              )}
                            </>
                          )}
                        </div>
                        {/* chara grid */}
                        <div className="grid grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] auto-rows-auto">
                          {displayCharas
                            .sort((a, b) =>
                              chara[a.name].t.localeCompare(chara[b.name].t)
                            )
                            .map((b) => {
                              const { name, ldx, bdx, checked, unowned, clf } =
                                b;
                              const bgClassName = (() => {
                                if (unowned)
                                  return personalityBGDisabled[
                                    Number(chara[name].t[0]) as Personality
                                  ];
                                if (checked)
                                  return personalityBGMarked[
                                    Number(chara[name].t[0]) as Personality
                                  ];
                                return personalityBG[
                                  Number(chara[name].t[0]) as Personality
                                ];
                              })();
                              const imgClassName = (() => {
                                if (unowned) return "grayscale-[90%]";
                                if (checked) return "opacity-50";
                                return "";
                              })();
                              const boardIndex = userDataBoard.i;
                              const boardShape = board.c[name].s;
                              const boardPosition = Number(
                                board.c[name].r[boardIndex][ldx].split(".")[bdx]
                              );
                              return (
                                <BoardCharaSlot
                                  key={`${name}${ldx}${bdx}`}
                                  name={name}
                                  charaTypes={chara[name].t}
                                  eldainFlag={chara[name].e}
                                  boardTypeString={bt}
                                  boardIndex={boardIndex}
                                  boardShape={boardShape}
                                  ldx={ldx}
                                  bdx={bdx}
                                  blocked={
                                    ldx === 0
                                      ? undefined
                                      : board.c[name].k[boardIndex][
                                          ldx - 1
                                        ].split(".")[bdx]
                                  }
                                  boardPosition={boardPosition}
                                  bgClassName={bgClassName}
                                  imgClassName={imgClassName}
                                  enableDialog={enableDialog}
                                  boardClick={boardClick}
                                  skin={userDataCharaInfo[name].skin}
                                  unlockedBoard={
                                    unowned
                                      ? 0
                                      : (
                                          userDataCharaInfo[
                                            name
                                          ] as UserDataOwnedCharaInfo
                                        ).nthboard
                                  }
                                  changeBoardIndex={changeBoardIndex}
                                  setBoardDialogProp={setBoardDialogProp}
                                  setBoardDialogOpened={setBoardDialogOpened}
                                  checked={checked}
                                  unowned={unowned}
                                  getFromRouteMap={getFromRouteMap}
                                  getFromBoardMap={getFromBoardMap}
                                  clf={clf}
                                />
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 flex gap-1 sm:gap-2 lg:gap-3">
                  <div
                    className="flex-initial aspect-square h-full bg-cover relative w-[60px]"
                    style={{
                      backgroundImage:
                        "url(/AppImages/windows11/Square44x44Logo.scale-200.png)",
                    }}
                  >
                    <div className="absolute bottom-[2.5%] left-[5%] right-[8%] bg-contain bg-item-slot-value aspect-[196/28]" />
                    <div
                      className="absolute bottom-[3%] left-0 right-0 w-full text-center text-slate-900 text-sm"
                      style={{
                        textShadow: Array(20).fill("0 0 1.2px #fff").join(", "),
                      }}
                    >
                      {currentBoardCharas.filter((c) => c.checked).length *
                        (userDataBoard.i + 1) *
                        2}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-1 mt-[-0.75px]">
                    <div className="flex flex-col">
                      {board.s[currentBoardType].map((statNum, statIndex) => {
                        const stat = StatType[statNum];
                        return (
                          <div
                            key={statNum}
                            className="flex justify-end items-center"
                          >
                            <img
                              src={`/icons/Icon_${stat}.png`}
                              className="h-6 mr-1"
                            />
                            <span>
                              {t(`stat.${stat}`)} +
                              {currentBoardCharas.filter((c) => c.checked)
                                .length *
                                board.b[currentBoardType][statIndex][
                                  userDataBoard.i
                                ]}
                              %
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="h-1 items-stretch flex">
                      <div
                        className={"bg-[#50ca30] dark:bg-[#80ca50]"}
                        style={{
                          flex: `${
                            currentBoardCharas.filter((c) => c.checked).length
                          }`,
                        }}
                      />
                      <div
                        className={"bg-[#50ca307f] dark:bg-[#80ca507f]"}
                        style={{
                          flex: `${
                            currentBoardCharas.filter(
                              (c) => !c.checked && !c.unowned
                            ).length
                          }`,
                        }}
                      />
                      <div
                        className={"bg-slate-300 dark:bg-slate-700"}
                        style={{
                          flex: `${
                            currentBoardCharas.filter((c) => c.unowned).length
                          }`,
                        }}
                      />
                    </div>
                    <div className="flex gap-0.5">
                      <div className="flex gap-1 flex-none text-left">
                        <div className="bg-[#50ca30] dark:bg-[#80ca50] border-slate-900 dark:border-slate-50 border text-xs py-0.5 w-8 inline-block text-center rounded">
                          {currentBoardCharas.filter((c) => c.checked).length}
                        </div>
                        <div className="bg-[#50ca307f] dark:bg-[#80ca507f] border-slate-900 dark:border-slate-50 border text-xs py-0.5 w-8 inline-block text-center rounded">
                          {
                            currentBoardCharas.filter(
                              (c) => !c.checked && !c.unowned
                            ).length
                          }
                        </div>
                        <div className="bg-slate-300 dark:bg-slate-700 border-slate-900 dark:border-slate-50 border text-xs py-0.5 w-8 inline-block text-center rounded">
                          {currentBoardCharas.filter((c) => c.unowned).length}
                        </div>
                        {/* {t("ui.board.usedCount", {
                          0:
                            currentBoard.charas.filter((c) => c.checked)
                              .length *
                            (userData.board.i + 1) *
                            2,
                        })} */}
                      </div>
                      <div className="flex flex-1 items-center justify-end overflow-hidden">
                        <div className="align-middle text-sm md:text-base whitespace-nowrap">
                          {currentBoardCharas.length ===
                          currentBoardCharas.filter((c) => c.checked).length
                            ? t("ui.board.usedMax")
                            : t("ui.board.remainToMax", {
                                0:
                                  (currentBoardCharas.length -
                                    currentBoardCharas.filter((c) => c.checked)
                                      .length) *
                                  (userDataBoard.i + 1) *
                                  2,
                              })}
                          {Object.values(board.c).every(
                            (b) =>
                              b.b[userDataBoard.i] &&
                              b.b[userDataBoard.i].length
                          )
                            ? ""
                            : "?"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {boardDialogProp && (
        <BoardInfoDialog
          {...({
            ...boardDialogProp,
            opened: boardDialogOpened,
            onOpenChange: setBoardDialogOpened,
          } as BoardInfoDialogProps)}
        />
      )}
    </>
  );
};

export default TrickcalBoard;
