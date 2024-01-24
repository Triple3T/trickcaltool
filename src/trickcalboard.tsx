import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";
import board from "@/data/board";
import chara from "@/data/chara";
import clonefactory from "@/data/clonefactory";
import {
  Attack,
  BoardType,
  Class,
  Personality,
  Position,
  Race,
} from "@/types/enums";
import SelectChara from "@/components/parts/select-chara";
import SubtitleBar from "@/components/parts/subtitlebar";

import userdata from "@/utils/userdata";
import { UserDataBoard, UserDataUnowned } from "./types/types";
import { dataFileRead, dataFileWrite } from "./utils/dataRW";

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

interface BoardDataPropsCore {
  board: {
    [key: string]: BoardDataPropsBoard; // 보드 종류별로
  }[]; // [1차보드, 2차보드, 3차보드]
  user: UserDataBoard & UserDataUnowned;
  boardIndex: number;
}

type BoardDataProps = BoardDataPropsCore | undefined;

const saveBoardData = (boardData: UserDataBoard & UserDataUnowned) => {
  const { b, c, o, u } = boardData;
  userdata.board.save({ b, c });
  userdata.unowned.save({ o, u });
};

interface BoardDataRestoreAction {
  type: "restore";
  payload: BoardDataPropsCore;
}

const boardDataRestoreActionHandler = (
  action: BoardDataRestoreAction
): BoardDataProps => {
  return action.payload;
};

interface BoardDataClickAction {
  type: "click";
  payload: {
    charaName: string;
    ldx: number;
    bdx: number;
  };
}

const boardDataClickActionHandler = (
  state: NonNullable<BoardDataProps>,
  action: BoardDataClickAction
): BoardDataProps => {
  const { boardIndex } = state;
  if (state.user.u.includes(action.payload.charaName)) {
    const inIfUserData = {
      b: {
        ...state.user.b,
        [action.payload.charaName]: board.c[action.payload.charaName].b.map(
          (a) => a.map(() => 0)
        ),
      },
      c: state.user.c,
      o: [...state.user.o, action.payload.charaName],
      u: state.user.u.filter((c) => c !== action.payload.charaName),
    };
    saveBoardData(inIfUserData);
    return {
      ...state,
      board: state.board.map((nthboard) => {
        return Object.fromEntries(
          Object.entries(nthboard).map(([bt, { charas }]) => {
            return [
              bt,
              {
                charas: charas.map((c) => ({
                  ...c,
                  unowned:
                    c.name === action.payload.charaName ? false : c.unowned,
                })),
              },
            ];
          })
        );
      }),
      user: inIfUserData,
    };
  }
  const outIfUserData = {
    ...state.user,
    b: {
      ...state.user.b,
      [action.payload.charaName]: state.user.b[action.payload.charaName].map(
        (a, i) =>
          i === boardIndex
            ? a.map((b, j) =>
                j === action.payload.ldx ? b ^ (1 << action.payload.bdx) : b
              )
            : a
      ),
    },
  };
  saveBoardData(outIfUserData);
  return {
    ...state,
    board: state.board.map((nthboard, n) => {
      if (n !== boardIndex) return nthboard;
      return Object.fromEntries(
        Object.entries(nthboard).map(([bt, { charas }]) => {
          return [
            bt,
            {
              charas: charas.map((c) => ({
                ...c,
                checked:
                  c.name === action.payload.charaName &&
                  c.bdx === action.payload.bdx &&
                  c.ldx === action.payload.ldx
                    ? !c.checked
                    : c.checked,
              })),
            },
          ];
        })
      );
    }),
    user: outIfUserData,
  };
};

interface BoardDataChangeClassificationAction {
  type: "classification";
  payload: number;
}

const boardDataChangeClassificationActionHandler = (
  state: NonNullable<BoardDataProps>,
  action: BoardDataChangeClassificationAction
): BoardDataProps => {
  const userData = {
    b: state.user.b,
    c: action.payload,
    o: state.user.o,
    u: state.user.u,
  };
  saveBoardData(userData);
  return {
    ...state,
    user: userData,
  };
};

interface BoardDataChangeIndex {
  type: "index";
  payload: number;
}

const boardDataChangeIndexActionHandler = (
  state: NonNullable<BoardDataProps>,
  action: BoardDataChangeIndex
): BoardDataProps => {
  return {
    ...state,
    boardIndex: action.payload,
  };
};

type BoardDataReduceAction =
  | BoardDataRestoreAction
  | BoardDataClickAction
  | BoardDataChangeClassificationAction
  | BoardDataChangeIndex;

const boardDataReducer = (
  state: BoardDataProps,
  action: BoardDataReduceAction
): BoardDataProps => {
  if (action.type === "restore") {
    return boardDataRestoreActionHandler(action);
  }
  if (!state) return state;
  switch (action.type) {
    case "click":
      return boardDataClickActionHandler(state, action);
    case "classification":
      return boardDataChangeClassificationActionHandler(state, action);
    case "index":
      return boardDataChangeIndexActionHandler(state, action);
    default:
      throw new Error();
  }
};

const BoardStatStatistic = ({
  stat,
  data,
}: {
  stat: string;
  data: BoardDataPropsBoard[];
}) => {
  const { t } = useTranslation();
  const statStatistic = data.map((d) => {
    const cur = d.charas.filter((c) => c.checked).length;
    const max = d.charas.length;
    return { cur, max };
  });
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
          <div className="text-left flex-auto">{t(`board.${stat}`)}</div>
          <div className="text-right flex-auto">
            {statStatistic.reduce(
              (a, b, i) => a + b.cur * board.b[BoardType[stat as keyof typeof BoardType]][i],
              0
            )}
            %
          </div>
        </div>
        <div className="bg-gradient-to-r from-transparent via-[#e9f5cf] dark:via-[#169a2d] via-[28px] to-[#e9f5cf] dark:to-[#169a2d] py-px pr-2.5 pl-8 rounded-r-[11px] flex flex-row gap-1 text-sm dark:contrast-125 dark:brightness-80">
          {statStatistic.map(({ cur, max }, i) => (
            <div key={i} className="flex-1 text-center">
              <img
                src={`/icons/RecordReward_Tab_${
                  ["Easy", "Herd", "VeryHard"][i]
                }Lv.png`}
                className="bg-greenicon rounded-full align-middle h-4 aspect-square mr-1 inline-block dark:border dark:border-white"
              />
              <span
                className={`${
                  cur === max ? "text-red-600 dark:text-red-400" : ""
                }`}
              >
                {cur}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BoardCrayonStatistic = ({ data }: { data: BoardDataPropsBoard[] }) => {
  const { t } = useTranslation();
  const statStatistic = data.map((d) => {
    return d.charas.filter((c) => c.checked).length;
  });
  return (
    <div className="flex">
      <div className="relative z-10">
        <img
          className="h-10 mr-2 aspect-square inline-block align-middle"
          src={`/icons/Item_Crayon4.png`}
        />
      </div>
      <div className="flex flex-col flex-1 gap-1 -ml-8">
        <div className="bg-gradient-to-r from-transparent via-[#f2f9e7] dark:via-[#36a52d] via-[28px] to-[#f2f9e7] dark:to-[#36a52d] py-0.5 pr-2.5 pl-8 rounded-r-[14px] flex flex-row dark:contrast-125 dark:brightness-80">
          <div className="text-left flex-auto">
            {t(`ui.board.usedCountLabel`)}
          </div>
          <div className="text-right flex-auto">
            {statStatistic.reduce((a, b, i) => a + b * (i + 1), 0) * 2}
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
              <span>{count}</span>
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
  const [boardData, dispatchBoardData] = useReducer(
    boardDataReducer,
    undefined
  );
  const [charaDrawerOpen, setCharaDrawerOpen] = useState(false);

  const initFromUserData = useCallback(() => {
    const charaList = Object.keys(chara);
    const userDataBoardProto = userdata.board.load();
    const userDataUnownedProto = userdata.unowned.load();
    const userData = { ...userDataBoardProto, ...userDataUnownedProto };
    if (!userData.o.every((c) => userData.b[c])) {
      userData.o
        .filter((c) => !userData.b[c])
        .forEach((c) => {
          userData.b[c] = board.c[c].b.map((a) => a.map(() => 0));
        });
    }
    const sortedCharaList = [...charaList].sort(
      (a, b) =>
        Number(chara[b].t[userData.c]) - Number(chara[a].t[userData.c]) ||
        Number(chara[b].t) - Number(chara[a].t)
    );
    const boardTypes = Object.values(BoardType).filter(
      (bt) => typeof bt === "string"
    ) as string[];
    const boardDataSkel = Array.from(Array(3).keys()).map(() =>
      Object.fromEntries(
        boardTypes.map((bt) => {
          return [bt, { charas: [] }] as [string, BoardDataPropsBoard];
        })
      )
    );
    sortedCharaList.forEach((c) => {
      const charaBoard = board.c[c].b;
      charaBoard.forEach((cb, i) => {
        cb.forEach((cbi, j) => {
          const cba = cbi.toString(10).split("");
          cba.forEach((cbin, k) => {
            boardDataSkel[i][BoardType[Number(cbin)]].charas.push({
              name: c,
              ldx: j,
              bdx: k,
              checked:
                ((userData.b[c]?.[i]?.[j] ?? 0) & (1 << k)) > 0 ? true : false,
              unowned: userData.u.includes(c),
              clf: clonefactory.flat().includes(c)
                ? clonefactory.findIndex((a) => a.includes(c))
                : false,
            });
          });
        });
      });
    });
    dispatchBoardData({
      type: "restore",
      payload: {
        board: boardDataSkel,
        user: userData,
        boardIndex: 0,
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="absolute top-0 left-0 p-2 flex gap-2 w-full">
        <div className="flex-1 flex justify-end">
          <ModeToggle />
        </div>
      </div>
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
                    <SelectChara
                      isOpen={charaDrawerOpen}
                      onOpenChange={setCharaDrawerOpen}
                      saveAndClose={saveSelectChara}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <SubtitleBar>{t("ui.board.selectBoard")}</SubtitleBar>
                  <div className="w-full px-4">
                    <Tabs
                      value={`${boardData?.boardIndex ?? 0}`}
                      className="w-full"
                    >
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
                              onClick={() =>
                                dispatchBoardData({ type: "index", payload: v })
                              }
                            >
                              <div>{t(`ui.board.board${v + 1}`)}</div>
                              {!isCompleted && (
                                <div className="text-red-700 dark:text-red-400">
                                  *
                                </div>
                              )}
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>
                    </Tabs>

                    {!Object.values(board.c).every(
                      (b) =>
                        b.b[boardData?.boardIndex ?? 0] &&
                        b.b[boardData?.boardIndex ?? 0].length
                    ) ? (
                      <div className="mt-1 text-sm text-red-700 dark:text-red-400 w-full text-right">
                        *
                        {t("ui.board.dataIncompleteStatus", {
                          0: Object.values(board.c).filter(
                            (b) =>
                              b.b[boardData?.boardIndex ?? 0] &&
                              b.b[boardData?.boardIndex ?? 0].length
                          ).length,
                          1: Object.values(board).length,
                        })}
                      </div>
                    ) : (
                      <div className="mt-1 text-sm text-red-700 dark:text-red-400">
                        &nbsp;
                      </div>
                    )}
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
                      <SelectContent>
                        {Array.from(Array(6).keys()).map((v) => (
                          <SelectItem
                            key={v}
                            value={`${v}`}
                            onClick={() =>
                              dispatchBoardData({
                                type: "classification",
                                payload: v,
                              })
                            }
                          >
                            {t(
                              `ui.index.${
                                [
                                  "personality",
                                  "defaultstar",
                                  "attack",
                                  "position",
                                  "class",
                                  "race",
                                ][v]
                              }`
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              {t("ui.board.allStatPercentTotal")}
            </AccordionTrigger>
            <AccordionContent className="text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-auto gap-2.5">
                {boardData &&
                  (
                    Object.values(BoardType).filter(
                      (bt) => typeof bt === "string"
                    ) as string[]
                  )
                    .sort(
                      (a, b) =>
                        [1, 0, 7, 6, 4, 2, 5, 3, 9].indexOf(
                          BoardType[a as keyof typeof BoardType]
                        ) -
                        [1, 0, 7, 6, 4, 2, 5, 3, 9].indexOf(
                          BoardType[b as keyof typeof BoardType]
                        )
                    )
                    .map((stat) => {
                      const data = boardData.board.map(
                        (nthboard) => nthboard[stat]
                      );
                      return (
                        <BoardStatStatistic
                          key={stat}
                          stat={stat}
                          data={data}
                        />
                      );
                    })}
                {boardData && (
                  <BoardCrayonStatistic
                    data={boardData.board.map((nthboard) => {
                      return {
                        charas: Object.values(nthboard).reduce(
                          (a, b) => a.concat(b.charas),
                          [] as BoardDataPropsBoard["charas"]
                        ),
                      };
                    })}
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      {boardData && (
        <div className="font-onemobile max-w-[1920px] columns-1 md:columns-2 lg:columns-3 gap-4 p-4">
          {(
            Object.values(BoardType).filter(
              (bt) => typeof bt === "string"
            ) as string[]
          ).map((bt) => {
            const currentBoard = boardData.board[boardData.boardIndex][bt];
            if (currentBoard.charas.length < 1) return null;
            return (
              <Card
                key={bt}
                className="p-4 object-cover max-w-full break-inside-avoid mt-0 mb-4"
              >
                {/* title bar */}
                <div className="flex gap-2 items-center">
                  <img
                    className="rotate-10 w-[3.2rem] flex-initial flex-shrink-0 bg-cover dark:brightness-80 dark:contrast-125"
                    src={`/boards/Tile_${bt}On.png`}
                    style={{ backgroundImage: "url(/boards/Rect_03.png)" }}
                  />
                  <div className="flex-initial flex-shrink-0 flex flex-col items-start">
                    <div className="text-sm">
                      <img
                        className="mr-1 w-[1.2rem] inline-flex bg-greenicon rounded-full align-middle"
                        src={`/icons/RecordReward_Tab_${
                          ["Easy", "Herd", "VeryHard"][boardData.boardIndex]
                        }Lv.png`}
                      />
                      <span className="align-middle">
                        {t(`ui.board.board${boardData.boardIndex + 1}`)}
                      </span>
                    </div>
                    <div className="text-2xl">{t(`board.${bt}`)}</div>
                  </div>
                  <div className="flex-1" />
                  <div className="shrink relative w-18">
                    <BoardTotal
                      current={
                        currentBoard.charas.filter((c) => c.checked).length
                      }
                      max={currentBoard.charas.length}
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
                      ][boardData.user.c]
                    ).filter((c) => typeof c === "string") as string[]
                  ).map((k) => {
                    const displayCharas = boardData.board[boardData.boardIndex][
                      bt
                    ].charas.filter(
                      ({ name }) =>
                        chara[name].t[boardData.user.c] ===
                        `${
                          (
                            [
                              Personality,
                              { 1: 1, 2: 2, 3: 3 },
                              Attack,
                              Position,
                              Class,
                              Race,
                            ][boardData.user.c] as {
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
                          {boardData.user.c === 1 ? (
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
                                src={`/icons/${
                                  [
                                    "Common_UnitPersonality_",
                                    "",
                                    "Common_UnitAttack",
                                    "Common_Position",
                                    "Common_Unit",
                                    "Common_UnitRace_",
                                  ][boardData.user.c]
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
                                  ][boardData.user.c]
                                }.${k}`
                              )}
                            </>
                          )}
                        </div>
                        {/* chara grid */}
                        <div className="grid grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] auto-rows-auto">
                          {displayCharas.map((b) => {
                            const { name, ldx, bdx, checked, unowned, clf } = b;
                            const bgClassNames = [
                              "min-w-14",
                              "sm:min-w-16",
                              "max-w-24",
                            ];
                            const imgClassNames = ["w-full"];
                            switch (Personality[Number(chara[name].t[0])]) {
                              case "Cool":
                                if (unowned)
                                  bgClassNames.push(
                                    "bg-personality-Cool-disabled"
                                  );
                                else if (checked)
                                  bgClassNames.push(
                                    "bg-personality-Cool-marked"
                                  );
                                else bgClassNames.push("bg-personality-Cool");
                                break;
                              case "Gloomy":
                                if (unowned)
                                  bgClassNames.push(
                                    "bg-personality-Gloomy-disabled"
                                  );
                                else if (checked)
                                  bgClassNames.push(
                                    "bg-personality-Gloomy-marked"
                                  );
                                else bgClassNames.push("bg-personality-Gloomy");
                                break;
                              case "Jolly":
                                if (unowned)
                                  bgClassNames.push(
                                    "bg-personality-Jolly-disabled"
                                  );
                                else if (checked)
                                  bgClassNames.push(
                                    "bg-personality-Jolly-marked"
                                  );
                                else bgClassNames.push("bg-personality-Jolly");
                                break;
                              case "Mad":
                                if (unowned)
                                  bgClassNames.push(
                                    "bg-personality-Mad-disabled"
                                  );
                                else if (checked)
                                  bgClassNames.push(
                                    "bg-personality-Mad-marked"
                                  );
                                else bgClassNames.push("bg-personality-Mad");
                                break;
                              case "Naive":
                                if (unowned)
                                  bgClassNames.push(
                                    "bg-personality-Naive-disabled"
                                  );
                                else if (checked)
                                  bgClassNames.push(
                                    "bg-personality-Naive-marked"
                                  );
                                else bgClassNames.push("bg-personality-Naive");
                                break;
                            }
                            if (unowned) {
                              imgClassNames.push("grayscale-[90%]");
                            } else if (checked) {
                              imgClassNames.push("opacity-50");
                            }
                            return (
                              <div
                                key={`${name}${ldx}${bdx}`}
                                className="sm:min-w-14 md:min-w-16 max-w-24 relative"
                                onClick={() =>
                                  dispatchBoardData({
                                    type: "click",
                                    payload: {
                                      charaName: name,
                                      ldx,
                                      bdx,
                                    },
                                  })
                                }
                              >
                                {ldx > 0 && (
                                  <div className="absolute w-1/4 top-0 left-0 opacity-100 z-10">
                                    <img
                                      src="/icons/TutorialPopupLock01.png"
                                      className="w-100 opacity-100"
                                    />
                                  </div>
                                )}
                                {ldx > 1 && (
                                  <div className="absolute w-1/4 top-0 left-1/8 opacity-100 z-10">
                                    <img
                                      src="/icons/TutorialPopupLock01.png"
                                      className="w-100 opacity-100"
                                    />
                                  </div>
                                )}
                                {checked && (
                                  <div className="absolute w-8/12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 z-10">
                                    <img
                                      src="/icons/Stage_RewardChack.png"
                                      className="w-100 opacity-100"
                                    />
                                  </div>
                                )}
                                {unowned && typeof clf === "number" && (
                                  <div className="absolute w-2/3 bottom-0 right-0 opacity-100 z-10">
                                    <img
                                      src="/clonefactoryicon/GradeDungeon_Logo.png"
                                      className="w-100 opacity-100"
                                    />
                                    <div className="text-xs [text-shadow:_1px_1px_2px_rgb(0_0_0_/_70%)] text-slate-50">
                                      {clf + 1},{clf + 7},{clf + 13}
                                    </div>
                                  </div>
                                )}
                                <div className={bgClassNames.join(" ")}>
                                  <img
                                    src={`/charas/${name}.png`}
                                    className={imgClassNames.join(" ")}
                                  />
                                </div>
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
                    <div
                      className="absolute bottom-[2.5%] left-[5%] right-[8%] bg-contain"
                      style={{
                        aspectRatio: "196/28",
                        backgroundImage:
                          "url(/itemslot/ItemSlot_ValueBase.png)",
                      }}
                    />
                    <div
                      className="absolute bottom-[3%] left-0 right-0 w-full text-center text-slate-900 text-sm"
                      style={{
                        textShadow: Array(20).fill("0 0 1.2px #fff").join(", "),
                      }}
                    >
                      {currentBoard.charas.filter((c) => c.checked).length *
                        (boardData.boardIndex + 1) *
                        2}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-1 mt-[-0.75px]">
                    <div className="flex justify-end items-center">
                      <img src={`/icons/Icon_${bt}.png`} className="h-6 mr-1" />
                      <span>
                        {t(`board.${bt}`)} +
                        {currentBoard.charas.filter((c) => c.checked).length *
                          board.b[BoardType[bt as keyof typeof BoardType]][boardData.boardIndex]}
                        %
                      </span>
                    </div>
                    <div className="h-1 items-stretch flex">
                      <div
                        className={"bg-[#50ca30] dark:bg-[#80ca50]"}
                        style={{
                          flex: `${
                            currentBoard.charas.filter((c) => c.checked).length
                          }`,
                        }}
                      />
                      <div
                        className={"bg-[#50ca307f] dark:bg-[#80ca507f]"}
                        style={{
                          flex: `${
                            currentBoard.charas.filter(
                              (c) => !c.checked && !c.unowned
                            ).length
                          }`,
                        }}
                      />
                      <div
                        className={"bg-slate-300 dark:bg-slate-700"}
                        style={{
                          flex: `${
                            currentBoard.charas.filter((c) => c.unowned).length
                          }`,
                        }}
                      />
                    </div>
                    <div className="flex gap-0.5">
                      <div className="flex gap-1 flex-none text-left">
                        <div className="bg-[#50ca30] dark:bg-[#80ca50] border-slate-900 dark:border-slate-50 border text-xs py-0.5 w-8 inline-block text-center rounded">
                          {currentBoard.charas.filter((c) => c.checked).length}
                        </div>
                        <div className="bg-[#50ca307f] dark:bg-[#80ca507f] border-slate-900 dark:border-slate-50 border text-xs py-0.5 w-8 inline-block text-center rounded">
                          {
                            currentBoard.charas.filter(
                              (c) => !c.checked && !c.unowned
                            ).length
                          }
                        </div>
                        <div className="bg-slate-300 dark:bg-slate-700 border-slate-900 dark:border-slate-50 border text-xs py-0.5 w-8 inline-block text-center rounded">
                          {currentBoard.charas.filter((c) => c.unowned).length}
                        </div>
                        {/* {t("ui.board.usedCount", {
                          0:
                            currentBoard.charas.filter((c) => c.checked)
                              .length *
                            (boardData.boardIndex + 1) *
                            2,
                        })} */}
                      </div>
                      <div className="flex flex-1 items-center justify-end overflow-hidden">
                        <div className="align-middle text-sm md:text-base whitespace-nowrap">
                          {currentBoard.charas.length ===
                          currentBoard.charas.filter((c) => c.checked).length
                            ? t("ui.board.usedMax")
                            : t("ui.board.remainToMax", {
                                0:
                                  (currentBoard.charas.length -
                                    currentBoard.charas.filter((c) => c.checked)
                                      .length) *
                                  (boardData.boardIndex + 1) *
                                  2,
                              })}
                          {Object.values(board.c).every(
                            (b) =>
                              b.b[boardData.boardIndex] &&
                              b.b[boardData.boardIndex].length
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
    </ThemeProvider>
  );
};

export default TrickcalBoard;
