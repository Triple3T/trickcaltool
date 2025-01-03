import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { VirtuosoGrid } from "react-virtuoso";
import { AuthContext } from "@/contexts/AuthContext";
import icSearch from "@/lib/initialConsonantSearch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import SearchBox from "@/components/common/search-with-icon";
import PurpleBoardCard from "@/components/parts/purple-board-card";
import SelectChara from "@/components/parts/select-chara";
import SubtitleBar from "@/components/parts/subtitlebar";
// import board from "@/data/board";
import chara from "@/data/chara";
import purpleboard from "@/data/purpleboard";
import purpleposition from "@/data/purpleposition";
import clonefactory from "@/data/clonefactory";
import { Personality, PurpleBoardType, Race, StatType } from "@/types/enums";
import { personalityBG } from "@/utils/personalityBG";

import userdata from "@/utils/userdata";
import {
  UserDataPurpleBoard,
  UserDataNthBoard,
  UserDataUnowned,
} from "@/types/types";
import { getTotalBoardStat } from "@/utils/getTotalStatBonus";
// import { dataFileRead, dataFileWrite } from "@/utils/dataRW";

interface BoardDataPropsBoard {
  charas: {
    name: string;
    ldx: number; // 황크: 자물쇠 개수, 0~2; 보크: 해당 스탯 보드 중 몇 번째인지, 0~2
    bdx: number; // 몇 번째 자릿수인지, 0~6?
    checked: boolean; // 색칠했는지 여부
    unowned: boolean; // 보유 여부
    clf: false | number;
  }[]; // 캐릭터 중복 포함 모두 나열(ldx와 bdx 때문에 모두 unique함)
}

interface BoardDataPropsCore {
  pboard: {
    [key: string]: BoardDataPropsBoard; // 보드 종류별로
  }[]; // [1차보드, 2차보드, 3차보드]
  user: UserDataPurpleBoard & UserDataNthBoard & UserDataUnowned;
  isDirty: number;
}

type BoardDataProps = BoardDataPropsCore | undefined;

const saveBoardData = (
  boardData: UserDataPurpleBoard & UserDataNthBoard & UserDataUnowned,
  withoutTimestamp: boolean
) => {
  const { d, n, o, p, u } = boardData;
  userdata.pboard.save({ p, d }, withoutTimestamp);
  userdata.nthboard.save({ n }, withoutTimestamp);
  userdata.unowned.save({ o, u }, withoutTimestamp);
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
    boardIndex: number;
    ldx: number;
    bdx: number;
  };
}

const boardDataClickActionHandler = (
  state: NonNullable<BoardDataProps>,
  action: BoardDataClickAction
): BoardDataProps => {
  const boardIndex = action.payload.boardIndex;
  const userData = {
    ...state.user,
    p: {
      ...state.user.p,
      [action.payload.charaName]: state.user.p[action.payload.charaName].map(
        (a, i) =>
          i === boardIndex
            ? a.map((b, j) =>
                j === action.payload.bdx ? b ^ (1 << action.payload.ldx) : b
              )
            : a
      ),
    },
    n: {
      ...state.user.n,
      [action.payload.charaName]: Math.max(
        state.user.n[action.payload.charaName],
        boardIndex + 1
      ),
    },
  };
  saveBoardData(userData, false);
  return {
    ...state,
    isDirty: ((state.isDirty + 1) % 32768) + 65536,
    pboard: state.pboard.map((nthboard, n) => {
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
    user: userData,
  };
};

interface BoardDataNthBoardOpenAction {
  type: "nthboard";
  payload: {
    charaName: string;
    index: number;
  };
}

const boardDataNthBoardOpenActionHandler = (
  state: NonNullable<BoardDataProps>,
  action: BoardDataNthBoardOpenAction
): BoardDataProps => {
  const userData = state.user;
  const chara = action.payload.charaName;
  const index = action.payload.index;
  userData.n[chara] = index;
  saveBoardData(userData, false);
  return {
    ...state,
    isDirty: ((state.isDirty + 1) % 32768) + 65536,
    user: userData,
  };
};
interface BoardDataClean {
  type: "clean";
}

const boardDataCleanActionHandler = (
  state: NonNullable<BoardDataProps>
): BoardDataProps => {
  return {
    ...state,
    isDirty: 0,
  };
};

type BoardDataReduceAction =
  | BoardDataRestoreAction
  | BoardDataClickAction
  | BoardDataNthBoardOpenAction
  | BoardDataClean;

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
    case "nthboard":
      return boardDataNthBoardOpenActionHandler(state, action);
    case "clean":
      return boardDataCleanActionHandler(state);
    default:
      throw new Error();
  }
};

const PurpleBoardStatStatistic = ({
  stat,
  percentStat,
  data,
}: {
  stat: string;
  percentStat: number;
  data: { [key: string]: BoardDataPropsBoard[] };
}) => {
  const { t } = useTranslation();
  const statType = StatType[stat as keyof typeof StatType];
  const statStatistic = Object.entries(data).map(([b, d]) => {
    const boardType = PurpleBoardType[b as keyof typeof PurpleBoardType];
    const statMult =
      purpleboard.b[boardType][purpleboard.s[boardType].indexOf(statType)];
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
            {Math.round(
              (statStatistic.reduce(
                (a, b) => a + b.stat.reduce((a, b) => a + b, 0),
                0
              ) *
                (100 + percentStat)) /
                100
            ).toLocaleString()}
          </div>
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
                  className={
                    cur === max ? "text-red-600 dark:text-red-400" : ""
                  }
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

const BoardCrayonStatistic = ({
  data,
  rarity,
  require,
}: {
  data: BoardDataPropsBoard[];
  rarity: number;
  require: number[];
}) => {
  const { t } = useTranslation();
  const statStatistic = data.map((d) => {
    return d.charas.filter((c) => c.checked).length;
  });
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

const PurpleBoard = () => {
  const { t } = useTranslation();
  const { googleLinked, isReady, autoLoad, autoSave } = useContext(AuthContext);
  const [boardData, dispatchBoardData] = useReducer(
    boardDataReducer,
    undefined
  );
  const [charaDrawerOpen, setCharaDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [boardStatMultiplied, setBoardStatMultiplied] = useState(false);
  const [boardStatPercent, setBoardStatPercent] = useState<{
    [key: string]: number;
  }>({});
  const [newCharaAlert, setNewCharaAlert] = useState(false);
  // const [viewMode, setViewMode] = useState<"target" | "full">("target");
  const [loaded, setLoaded] = useState(false);
  const [skinData, setSkinData] = useState<Record<string, number>>({});

  const initFromUserData = useCallback((dirtyFlag?: boolean) => {
    const charaList = Object.keys(chara);
    const { autoRepaired: ar1, ...userDataPBoardProto } =
      userdata.pboard.load();
    const { autoRepaired: ar2, ...userDataNthBoardProto } =
      userdata.nthboard.load();
    const { autoRepaired: ar3, ...userDataUnownedProto } =
      userdata.unowned.load();
    const userData = {
      ...userDataPBoardProto,
      ...userDataNthBoardProto,
      ...userDataUnownedProto,
    };
    if (ar1 || ar2 || ar3) setNewCharaAlert(true);
    setSkinData(userdata.skin.load());
    if (!userData.o.every((c) => userData.p[c])) {
      setNewCharaAlert(true);
      userData.o
        .filter((c) => !userData.p[c])
        .forEach((c) => {
          userData.p[c] = purpleboard.c[c].b.map((a) =>
            a
              .toString(10)
              .split("")
              .map(() => 0)
          );
        });
    }
    if (userData.u.some((c) => userData.p[c])) {
      setNewCharaAlert(true);
      userData.p = Object.fromEntries(
        Object.entries(userData.p).filter(([k]) => !userData.u.includes(k))
      );
    }
    if (userData.u.some((c) => userData.n[c])) {
      setNewCharaAlert(true);
      userData.n = Object.fromEntries(
        Object.entries(userData.n).filter(([k]) => !userData.u.includes(k))
      );
    }
    Object.keys(userData.p).forEach((c) => {
      userData.n[c] = Math.max(
        userData.p[c].findLastIndex((a) => a.some((b) => b !== 0)) + 1,
        userData.n[c] || 1
      );
      if (userData.p[c].some((b) => b.length !== purpleboard.c[c].b.length)) {
        userData.p[c] = purpleboard.c[c].b.map((a, i) =>
          a
            .toString(10)
            .split("")
            .map((_, j) => userData.p[c][i][j] ?? 0)
        );
      }
    });
    saveBoardData(userData, true);
    const pBoardTypes = Object.values(PurpleBoardType).filter(
      (bt) => typeof bt === "string"
    ) as string[];
    const pBoardDataSkel = Array.from(Array(3).keys()).map(() =>
      Object.fromEntries(
        pBoardTypes.map((bt) => {
          return [bt, { charas: [] }] as [string, BoardDataPropsBoard];
        })
      )
    );
    charaList.forEach((c) => {
      const charaBoard = purpleboard.c[c].b;
      const charaBoardPos = purpleboard.c[c].p;
      const charaRace = Number(chara[c].t[5]);
      const ppos = purpleposition.r[Race[charaRace]];
      charaBoard.forEach((cb, i) => {
        if (typeof cb !== "number") return;
        const cba = cb.toString(10).split("");
        const pposidx = charaBoardPos[i].split(".");
        cba.forEach((cbin, k) => {
          const pbpos = ppos[i].p[Number(pposidx[k])];
          pbpos.split(".").forEach((_, ldx) => {
            pBoardDataSkel[i][PurpleBoardType[parseInt(cbin, 10)]].charas.push({
              name: c,
              ldx,
              bdx: k,
              checked:
                ((userData.p[c]?.[i][k] ?? 0) & (1 << ldx)) > 0 ? true : false,
              unowned: userData.u.includes(c),
              clf: clonefactory.l[clonefactory.f].flat().includes(c)
                ? clonefactory.l[clonefactory.f].findIndex((a) => a.includes(c))
                : false,
            });
          });
        });
      });
    });
    dispatchBoardData({
      type: "restore",
      payload: {
        pboard: pBoardDataSkel,
        user: userData,
        isDirty: dirtyFlag ? 65536 : 0,
      },
    });
  }, []);
  useEffect(initFromUserData, [initFromUserData]);
  const saveSelectChara = useCallback(() => {
    setCharaDrawerOpen(false);
    initFromUserData(true);
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
          initFromUserData(true);
          setLoaded(true);
        }
        if (!googleLinked) initFromUserData(true);
      }
    })();
  }, [isReady, googleLinked, autoLoad, initFromUserData, t, loaded]);

  useEffect(() => {
    if (boardData && boardData.isDirty) {
      const timer = setTimeout(() => {
        dispatchBoardData({ type: "clean" });
        if (isReady && googleLinked && autoSave) {
          autoSave();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoSave, boardData, googleLinked, isReady]);

  useEffect(() => {
    setBoardStatPercent(getTotalBoardStat());
  }, []);
  // useEffect(() => {
  //   const boardStats: { [key: string]: number } = {};
  //   const boardData = userdata.board.load().b;
  //   Object.entries(boardData).forEach(([c, b]) => {
  //     const charaBoard = board.c[c].b;
  //     charaBoard.forEach((nthboard, i) => {
  //       nthboard.forEach((boardList, j) => {
  //         boardList
  //           .toString(10)
  //           .split("")
  //           .forEach((targetBoardString, k) => {
  //             const targetBoard = Number(targetBoardString);
  //             const isChecked = b[i][j] & (1 << k);
  //             if (isChecked) {
  //               const statList = board.s[targetBoard];
  //               statList.forEach((stat, statIndex) => {
  //                 const statType = StatType[stat];
  //                 const statValue = board.b[targetBoard][statIndex][i];
  //                 boardStats[statType] =
  //                   (boardStats[statType] ?? 0) + statValue;
  //               });
  //             }
  //           });
  //       });
  //     });
  //   });
  //   setBoardStatPercent(boardStats);
  // }, []);

  const dispatchClickBoardData = useCallback(
    (payload: BoardDataClickAction["payload"]) => {
      dispatchBoardData({
        type: "click",
        payload,
      });
    },
    []
  );
  const dispatchNthBoardData = useCallback(
    (payload: BoardDataNthBoardOpenAction["payload"]) => {
      dispatchBoardData({
        type: "nthboard",
        payload,
      });
    },
    []
  );

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
                    <SelectChara
                      isOpen={charaDrawerOpen}
                      onOpenChange={setCharaDrawerOpen}
                      saveAndClose={saveSelectChara}
                    />
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
              {t("ui.board.allStatBaseTotal")}
            </AccordionTrigger>
            <AccordionContent className="text-base">
              <div className="mb-2 text-left flex items-center gap-2">
                <Switch
                  id="view-all-stat-with-board"
                  checked={boardStatMultiplied}
                  onCheckedChange={(c) => {
                    setBoardStatMultiplied(c);
                  }}
                />
                <Label htmlFor="view-all-stat-with-board">
                  {t("ui.equiprank.viewAllStatWithBoard")}
                </Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-auto gap-2.5">
                {boardData &&
                  (
                    Object.values(StatType).filter(
                      (bt) => typeof bt === "string"
                    ) as string[]
                  )
                    .sort(
                      (a, b) =>
                        [1, 0, 5, 7, 4, 6, 3, 2, 8, 9][
                          StatType[a as keyof typeof StatType]
                        ] -
                        [1, 0, 5, 7, 4, 6, 3, 2, 8, 9][
                          StatType[b as keyof typeof StatType]
                        ]
                    )
                    .map((stat) => {
                      const statNum = StatType[stat as keyof typeof StatType];
                      const includedBoards = purpleboard.s
                        .map((s, i) => [s, i] as [number[], number])
                        .filter(([s]) => s.includes(statNum))
                        .map(([, i]) => i);
                      const data = Object.fromEntries(
                        includedBoards.map((b) => [
                          PurpleBoardType[b],
                          boardData.pboard.map(
                            (nthboard) => nthboard[PurpleBoardType[b]]
                          ),
                        ])
                      );
                      return (
                        <PurpleBoardStatStatistic
                          key={stat}
                          stat={stat}
                          percentStat={
                            boardStatMultiplied
                              ? boardStatPercent[stat] || 0
                              : 0
                          }
                          data={data}
                        />
                      );
                    })}
                {boardData && (
                  <BoardCrayonStatistic
                    rarity={3}
                    data={boardData.pboard.map((nthboard) => {
                      return {
                        charas: Object.values(nthboard).reduce(
                          (a, b) => a.concat(b.charas),
                          [] as BoardDataPropsBoard["charas"]
                        ),
                      };
                    })}
                    require={[3, 6, 9]}
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <SearchBox
        className="font-onemobile flex-auto"
        value={search}
        onValueChange={setSearch}
        placeholder={t("ui.charaSelect.searchByName")}
      />
      {boardData && (
        <VirtuosoGrid
          useWindowScroll
          className="font-onemobile mt-4"
          listClassName="gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-80 md:max-w-3xl lg:max-w-full mx-auto"
          data={boardData.user.o
            .filter((c) =>
              search
                ? t(`chara.${c}`).includes(search) ||
                  icSearch(t(`chara.${c}`), search)
                : true
            )
            .sort((a, b) => t(`chara.${a}`).localeCompare(t(`chara.${b}`)))}
          itemContent={(_, name) => {
            // const currentBoard = board.c[name].b;
            const currentPurpleBoard = purpleboard.c[name]; // b: 보크보드 종류, p: 해당 종류 위치 인덱스
            const charaPersonality = Number(chara[name].t[0]);
            const charaRace = Number(chara[name].t[5]);
            const personalityClassName =
              personalityBG[Number(charaPersonality) as Personality];
            const openBoardIndex = boardData.user.n[name];
            const skin: number | undefined = skinData[name];
            return (
              <PurpleBoardCard
                key={name}
                name={name}
                currentPurpleBoard={currentPurpleBoard}
                // charaPersonality,
                charaRace={charaRace}
                personalityClassName={personalityClassName}
                skin={skin}
                openBoardIndex={openBoardIndex}
                dispatchClickBoardData={dispatchClickBoardData}
                dispatchNthBoardData={dispatchNthBoardData}
                pboard={boardData.pboard}
              />
            );
          }}
        />
      )}
    </>
  );
};

export default PurpleBoard;
