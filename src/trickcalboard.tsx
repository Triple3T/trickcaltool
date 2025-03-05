import { Suspense, lazy, use, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleArrowDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/contexts/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import Select from "@/components/common/combobox-select";
import Loading from "@/components/common/loading";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
// import SelectChara from "@/components/parts/select-chara";
const SelectChara = lazy(() => import("@/components/parts/select-chara"));
import SubtitleBar from "@/components/parts/subtitlebar";
import {
  BoardInfoDialog,
  BoardInfoDialogTrigger,
} from "@/components/parts/board-info-dialog";
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
// import { dataFileRead, dataFileWrite } from "@/utils/dataRW";

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
  withoutScrollButton,
}: {
  stat: string;
  data: { [key: string]: BoardDataPropsBoard[] };
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
            {statStatistic
              .reduce((a, b) => a + b.stat.reduce((a, b) => a + b, 0), 0)
              .toLocaleString()}
            %
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
  const { userData, userDataDispatch } = use(AuthContext);
  const [enableDialog, setEnableDialog] = useState(true);
  const [charaDrawerOpen, setCharaDrawerOpen] = useState(false);
  const [newCharaAlert, setNewCharaAlert] = useState(false);
  const [boardDialogOpened, setBoardDialogOpened] = useState(false);
  const [boardDialogProp, setBoardDialogProp] =
    useState<Omit<BoardInfoDialogProps, "opened" | "onOpenChange">>();

  // const setDialogEnabled = useCallback((enabled: boolean) => {
  //   setEnableDialog(enabled);
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const { autoRepaired, ...userDialogData } = userdata.dialog.load();
  //   userdata.dialog.save({ ...userDialogData, board: enabled }, true);
  // }, []);
  useEffect(() => {
    if (newCharaAlert) {
      toast.info(t("ui.index.newCharacterAlert"));
      setNewCharaAlert(false);
    }
  }, [newCharaAlert, t]);

  if (!userData || !userDataDispatch) return <Loading />;

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
                        userDataDispatch.boardVisible(
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
                      onCloseGuide={userDataDispatch.boardVisible}
                      commonProps={[
                        BoardType.AttackBoth,
                        BoardType.CriticalMult,
                        BoardType.CriticalRate,
                        BoardType.Hp,
                      ]}
                      criticalResistProp={BoardType.CriticalResist}
                      criticalMultResistProp={BoardType.CriticalMultResist}
                      criticalResistDefault={
                        (userData.board.v.includes(BoardType.CriticalResist) ??
                          false) &&
                        !(
                          userData.board.v.includes(
                            BoardType.CriticalMultResist
                          ) ?? false
                        )
                      }
                      criticalMultResistDefault={
                        (userData.board.v.includes(
                          BoardType.CriticalMultResist
                        ) ??
                          false) &&
                        !(
                          userData.board.v.includes(BoardType.CriticalResist) ??
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
                        userData.board.v.map((b) => BoardType[b]) ??
                        (Object.values(BoardType).filter(
                          (b) => typeof b === "string"
                        ) as string[])
                      }
                      onValueChange={(v) => {
                        userDataDispatch.boardVisible(
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
                      value={userData.board.c[0] ?? 0}
                      setValue={(payload) =>
                        userDataDispatch.boardClassification([Number(payload)])
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
                    {/* <Select
                      value={`${boardData?.user.c ?? 0}`}
                      onValueChange={(v) =>
                        dispatchBoardData({
                          type: "classification",
                          payload: Number(v),
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("ui.index.personality")} />
                      </SelectTrigger>
                      <SelectContent className="font-onemobile">
                        {[
                          "personality",
                          "defaultstar",
                          "attack",
                          "position",
                          "class",
                          "race",
                        ].map((v, i) => (
                          <SelectItem
                            key={v}
                            value={`${i}`}
                            onClick={() =>
                              dispatchBoardData({
                                type: "classification",
                                payload: i,
                              })
                            }
                            onTouchStart={(e) => e.stopPropagation()}
                          >
                            {t(`ui.index.${v}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}
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
              {t("ui.board.allStatPercentTotal")}
            </AccordionTrigger>
            <AccordionContent className="text-base">
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
                                            userData.charaInfo[charaName]
                                              .unowned;
                                          returnArray.push({
                                            name: charaName,
                                            ldx: j,
                                            bdx: k,
                                            checked: unowned
                                              ? false
                                              : (userData.charaInfo[charaName]
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
                    <BoardStatStatistic key={stat} stat={stat} data={data} />
                  );
                })}

                <BoardCrayonStatistic
                  rarity={4}
                  data={Object.values(userData.charaInfo).map((c) =>
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
        <Tabs value={`${userData.board.i}`} className="w-full">
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
                    if (v === userData.board.i) return;
                    userDataDispatch.boardViewNthBoard(v);
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
          (b) => b.b[userData.board.i] && b.b[userData.board.i].length
        ) ? (
          <div className="mt-1 text-sm text-red-700 dark:text-red-400 w-full text-right">
            *
            {t("ui.board.dataIncompleteStatus", {
              0: Object.values(board.c).filter(
                (b) => b.b[userData.board.i] && b.b[userData.board.i].length
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
      {userData && (
        <div className="font-onemobile max-w-[1920px] columns-1 md:columns-2 lg:columns-3 gap-4 py-4">
          {(
            Object.values(BoardType).filter(
              (bt) =>
                typeof bt === "string" &&
                userData.board.v.includes(
                  BoardType[bt as keyof typeof BoardType]
                )
            ) as string[]
          ).map((bt) => {
            const currentBoardType = BoardType[bt as keyof typeof BoardType];
            const currentBoardCharas = Object.entries(board.c)
              .filter(([, boardData]) => {
                return boardData.b[userData.board.i]
                  .map((cb) => cb.toString())
                  .join("")
                  .includes(`${currentBoardType}`);
              })
              .map(([charaName, boardData]) => {
                return boardData.b[userData.board.i]
                  .map((cb, j) => {
                    const returnArray = [] as BoardDataPropsBoard["charas"];
                    cb.toString(10)
                      .split("")
                      .forEach((cbi, k) => {
                        if (cbi === `${currentBoardType}`) {
                          const unowned = userData.charaInfo[charaName].unowned;
                          returnArray.push({
                            name: charaName,
                            ldx: j,
                            bdx: k,
                            checked: unowned
                              ? false
                              : (userData.charaInfo[charaName].board[
                                  userData.board.i
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
                          ["Easy", "Herd", "VeryHard"][userData.board.i]
                        }Lv.png`}
                      />
                      <span className="align-middle">
                        {t(`ui.board.board${userData.board.i + 1}`)}
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
                      ][userData.board.c[0]]
                    ).filter((c) => typeof c === "string") as string[]
                  ).map((k) => {
                    const displayCharas = currentBoardCharas.filter(
                      ({ name }) =>
                        chara[name].t[userData.board.c[0]] ===
                        `${
                          (
                            [
                              Personality,
                              { 1: 1, 2: 2, 3: 3 },
                              Attack,
                              Position,
                              Class,
                              Race,
                            ][userData.board.c[0]] as {
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
                          {userData.board.c[0] === 1 ? (
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
                                  ][userData.board.c[0]]
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
                                  ][userData.board.c[0]]
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
                              return (
                                <div
                                  key={`${name}${ldx}${bdx}`}
                                  className="sm:min-w-14 sm:min-h-14 md:min-w-16 md:min-h-16 max-w-24 relative aspect-square"
                                >
                                  <div
                                    className={cn(
                                      "min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 max-w-24 aspect-square",
                                      bgClassName
                                    )}
                                  >
                                    <img
                                      src={
                                        userData.charaInfo[name].skin
                                          ? `/charas/${name}Skin${userData.charaInfo[name].skin}.png`
                                          : `/charas/${name}.png`
                                      }
                                      className={cn(
                                        "aspect-square w-full",
                                        imgClassName
                                      )}
                                      onClick={() =>
                                        userDataDispatch.boardClick(
                                          name,
                                          userData.board.i,
                                          ldx,
                                          bdx
                                        )
                                      }
                                    />
                                  </div>
                                  {enableDialog && (
                                    <div className="absolute w-full h-5 p-0.5 top-0 left-0 opacity-100">
                                      <Suspense
                                        fallback={
                                          <Loader2
                                            className="w-4 h-4 animate-spin absolute right-0"
                                            strokeWidth={3}
                                          />
                                        }
                                      >
                                        <BoardInfoDialogTrigger
                                          route={
                                            route.r[
                                              Race[Number(chara[name].t[5])]
                                            ][userData.board.i].b[
                                              Number(
                                                board.c[name].r[
                                                  userData.board.i
                                                ][ldx].split(".")[bdx]
                                              )
                                            ]
                                          }
                                          onClick={() => {
                                            setBoardDialogProp({
                                              boardIndex: userData.board.i,
                                              boardShape:
                                                route.s[
                                                  Race[Number(chara[name].t[5])]
                                                ][userData.board.i].b[
                                                  board.c[name].s
                                                ],
                                              boardTypeString: bt,
                                              chara: name,
                                              charaTypes: chara[name].t,
                                              route:
                                                route.r[
                                                  Race[Number(chara[name].t[5])]
                                                ][userData.board.i].b[
                                                  Number(
                                                    board.c[name].r[
                                                      userData.board.i
                                                    ][ldx].split(".")[bdx]
                                                  )
                                                ],
                                              rstart:
                                                route.r[
                                                  Race[Number(chara[name].t[5])]
                                                ][userData.board.i].s,
                                              otherBoards: board.c[name].b.map(
                                                (b) =>
                                                  b
                                                    .map((v) => v.toString())
                                                    .join("")
                                              ),
                                              otherRoutes: board.c[name].r[
                                                userData.board.i
                                              ]
                                                .join(".")
                                                .split(".")
                                                .map(
                                                  (v) =>
                                                    route.r[
                                                      Race[
                                                        Number(chara[name].t[5])
                                                      ]
                                                    ][userData.board.i].b[
                                                      Number(v)
                                                    ]
                                                ),
                                              blocked:
                                                ldx === 0
                                                  ? undefined
                                                  : board.c[name].k[
                                                      userData.board.i
                                                    ][ldx - 1].split(".")[bdx],
                                              checked,
                                              unowned,
                                              eldain: chara[name].e,
                                              skin:
                                                userData.charaInfo[name].skin ||
                                                0,
                                              unlockedBoard: userData.charaInfo[
                                                name
                                              ].unowned
                                                ? 0
                                                : userData.charaInfo[name]
                                                    .nthboard || 0,
                                              changeBoardIndex: unowned
                                                ? undefined
                                                : (i) =>
                                                    userDataDispatch.boardIndex(
                                                      name,
                                                      i
                                                    ),
                                            });
                                            setBoardDialogOpened(true);
                                          }}
                                        />
                                      </Suspense>
                                    </div>
                                  )}
                                  {checked && (
                                    <div
                                      className="absolute w-8/12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100"
                                      onClick={() =>
                                        userDataDispatch.boardClick(
                                          name,
                                          userData.board.i,
                                          ldx,
                                          bdx
                                        )
                                      }
                                    >
                                      <img
                                        src="/icons/Stage_RewardChack.png"
                                        className="w-100 opacity-100"
                                      />
                                    </div>
                                  )}
                                  {unowned && typeof clf === "number" && (
                                    <div
                                      className="absolute w-2/3 bottom-0 right-0 opacity-100"
                                      onClick={() =>
                                        userDataDispatch.boardClick(
                                          name,
                                          userData.board.i,
                                          ldx,
                                          bdx
                                        )
                                      }
                                    >
                                      <img
                                        src="/clonefactoryicon/GradeDungeon_Logo.png"
                                        className="w-100 opacity-100"
                                      />
                                      <div className="text-xs [text-shadow:_1px_1px_2px_rgb(0_0_0_/_70%)] text-slate-50">
                                        {clf + 1},{clf + 7},{clf + 13}
                                      </div>
                                    </div>
                                  )}
                                  {!userData.charaInfo[name].unowned &&
                                    !checked &&
                                    userData.charaInfo[name].nthboard >
                                      userData.board.i && (
                                      <div className="absolute right-0.5 bottom-0.5 flex flex-row p-px w-3 h-3">
                                        <div
                                          className={cn(
                                            "flex-1 rounded-full aspect-square border border-slate-100 ring-1 ring-slate-900",
                                            [
                                              "bg-transparent",
                                              "bg-slate-400",
                                              "bg-emerald-500",
                                              "bg-amber-400",
                                            ][userData.charaInfo[name].nthboard]
                                          )}
                                        />
                                      </div>
                                    )}
                                </div>
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
                        (userData.board.i + 1) *
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
                                  userData.board.i
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
                                  (userData.board.i + 1) *
                                  2,
                              })}
                          {Object.values(board.c).every(
                            (b) =>
                              b.b[userData.board.i] &&
                              b.b[userData.board.i].length
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
