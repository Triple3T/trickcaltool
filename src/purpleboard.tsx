import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/contexts/AuthContext";
import Layout from "@/components/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import SelectChara from "@/components/parts/select-chara";
import SubtitleBar from "@/components/parts/subtitlebar";
// import BoardInfoDialog from "@/components/parts/board-info-dialog";
import board from "@/data/board";
import chara from "@/data/chara";
import purpleboard from "@/data/purpleboard";
import purpleposition from "@/data/purpleposition";
// import route from "@/data/route";
import clonefactory from "@/data/clonefactory";
import {
  // Attack,
  BoardType,
  // Class,
  // Personality,
  // Position,
  PurpleBoardType,
  Race,
  StatType,
} from "@/types/enums";

import userdata from "@/utils/userdata";
import {
  UserDataBoard,
  UserDataPurpleBoard,
  UserDataNthBoard,
  UserDataUnowned,
} from "@/types/types";
import { dataFileRead, dataFileWrite } from "@/utils/dataRW";

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
  board: {
    [key: string]: BoardDataPropsBoard; // 보드 종류별로
  }[]; // [1차보드, 2차보드, 3차보드]
  pboard: {
    [key: string]: BoardDataPropsBoard; // 보드 종류별로
  }[]; // [1차보드, 2차보드, 3차보드]
  user: UserDataBoard &
    UserDataPurpleBoard &
    UserDataNthBoard &
    UserDataUnowned;
  boardIndex: number;
  visibleBoard: BoardType[];
  isDirty: number;
}

type BoardDataProps = BoardDataPropsCore | undefined;

const saveBoardData = (
  boardData: UserDataBoard &
    UserDataPurpleBoard &
    UserDataNthBoard &
    UserDataUnowned
) => {
  const { b, c, o, u, v, p, d, n } = boardData;
  userdata.board.save({ b, c, v });
  userdata.pboard.save({ p, d });
  userdata.nthboard.save({ n });
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
    boardIndex?: number;
    boardType: "g" | "p";
    ldx: number;
    bdx: number;
  };
}

const boardDataClickActionHandler = (
  state: NonNullable<BoardDataProps>,
  action: BoardDataClickAction
): BoardDataProps => {
  const boardIndex = action.payload.boardIndex ?? state.boardIndex;
  if (state.user.u.includes(action.payload.charaName)) {
    const inIfUserData = {
      ...state.user,
      b: {
        ...state.user.b,
        [action.payload.charaName]: board.c[action.payload.charaName].b.map(
          (a) => a.map(() => 0)
        ),
      },
      p: {
        ...state.user.p,
        [action.payload.charaName]: purpleboard.c[
          action.payload.charaName
        ].b.map((a) =>
          a
            .toString(10)
            .split("")
            .map(() => 0)
        ),
      },
      o: [...state.user.o, action.payload.charaName],
      u: state.user.u.filter((c) => c !== action.payload.charaName),
    };
    saveBoardData(inIfUserData);
    return {
      ...state,
      isDirty: ((state.isDirty + 1) % 32768) + 65536,
      [action.payload.boardType === "g" ? "board" : "pboard"]: state[
        action.payload.boardType === "g" ? "board" : "pboard"
      ].map((nthboard) => {
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
    b:
      action.payload.boardType !== "g"
        ? state.user.b
        : {
            ...state.user.b,
            [action.payload.charaName]: state.user.b[
              action.payload.charaName
            ].map((a, i) =>
              i === boardIndex
                ? a.map((b, j) =>
                    j === action.payload.ldx ? b ^ (1 << action.payload.bdx) : b
                  )
                : a
            ),
          },
    p:
      action.payload.boardType !== "p"
        ? state.user.p
        : {
            ...state.user.p,
            [action.payload.charaName]: state.user.p[
              action.payload.charaName
            ].map((a, i) =>
              i === boardIndex
                ? a.map((b, j) =>
                    j === action.payload.bdx ? b ^ (1 << action.payload.ldx) : b
                  )
                : a
            ),
          },
  };
  saveBoardData(outIfUserData);
  return {
    ...state,
    isDirty: ((state.isDirty + 1) % 32768) + 65536,
    board:
      action.payload.boardType !== "g"
        ? state.board
        : state.board.map((nthboard, n) => {
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
    pboard:
      action.payload.boardType !== "p"
        ? state.pboard
        : state.pboard.map((nthboard, n) => {
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
    ...state.user,
    c: action.payload,
  };
  saveBoardData(userData);
  return {
    ...state,
    isDirty: ((state.isDirty + 1) % 32768) + 65536,
    user: userData,
  };
};

interface boardDataChangeVisibleBoardAction {
  type: "visible";
  payload: BoardType[];
}

const boardDataChangeVisibleBoardActionHandler = (
  state: NonNullable<BoardDataProps>,
  action: boardDataChangeVisibleBoardAction
): BoardDataProps => {
  const userData = {
    ...state.user,
    v: action.payload,
  };
  saveBoardData(userData);
  return {
    ...state,
    isDirty: ((state.isDirty + 1) % 32768) + 65536,
    visibleBoard: action.payload,
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
  | BoardDataChangeClassificationAction
  | boardDataChangeVisibleBoardAction
  | BoardDataChangeIndex
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
    case "classification":
      return boardDataChangeClassificationActionHandler(state, action);
    case "visible":
      return boardDataChangeVisibleBoardActionHandler(state, action);
    case "index":
      return boardDataChangeIndexActionHandler(state, action);
    case "clean":
      return boardDataCleanActionHandler(state);
    default:
      throw new Error();
  }
};

const BoardStatStatistic = ({
  stat,
  data,
}: {
  stat: string;
  data: { [key: string]: BoardDataPropsBoard[] };
}) => {
  const { t } = useTranslation();
  const statType = StatType[stat as keyof typeof StatType];
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
            {statStatistic.reduce(
              (a, b) => a + b.stat.reduce((a, b) => a + b, 0),
              0
            )}
            %
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
                  className={`${
                    cur === max ? "text-red-600 dark:text-red-400" : ""
                  }`}
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
const PurpleBoardStatStatistic = ({
  stat,
  data,
}: {
  stat: string;
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
            {statStatistic.reduce(
              (a, b) => a + b.stat.reduce((a, b) => a + b, 0),
              0
            )}
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
                  className={`${
                    cur === max ? "text-red-600 dark:text-red-400" : ""
                  }`}
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
            {statStatistic.reduce((a, b, i) => a + b * require[i], 0)}
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

const PurpleBoard = () => {
  const { t } = useTranslation();
  const { googleLinked, isReady, autoLoad, autoSave } = useContext(AuthContext);
  const [boardData, dispatchBoardData] = useReducer(
    boardDataReducer,
    undefined
  );
  const [charaDrawerOpen, setCharaDrawerOpen] = useState(false);
  const [newCharaAlert, setNewCharaAlert] = useState(false);
  // const [viewMode, setViewMode] = useState<"target" | "full">("target");
  const [loaded, setLoaded] = useState(false);

  const initFromUserData = useCallback(() => {
    const charaList = Object.keys(chara);
    const { autoRepaired: ar1, ...userDataBoardProto } = userdata.board.load();
    const { autoRepaired: ar2, ...userDataPBoardProto } =
      userdata.pboard.load();
    const { autoRepaired: ar3, ...userDataNthBoardProto } =
      userdata.nthboard.load();
    const { autoRepaired: ar4, ...userDataUnownedProto } =
      userdata.unowned.load();
    const userData = {
      ...userDataBoardProto,
      ...userDataPBoardProto,
      ...userDataNthBoardProto,
      ...userDataUnownedProto,
    };
    if (ar1 || ar2 || ar3 || ar4) setNewCharaAlert(true);
    let flag = false;
    if (!userData.o.every((c) => userData.b[c])) {
      setNewCharaAlert(true);
      flag = true;
      userData.o
        .filter((c) => !userData.b[c])
        .forEach((c) => {
          userData.b[c] = board.c[c].b.map((a) => a.map(() => 0));
        });
    }
    Object.keys(userData.b).forEach((c) => {
      if (userData.b[c].some((b) => b.length !== board.c[c].b.length)) {
        flag = true;
        userData.b[c] = board.c[c].b.map((a, i) =>
          a.map((_, j) => userData.b[c][i][j] ?? 0)
        );
      }
    });
    if (!userData.o.every((c) => userData.p[c])) {
      setNewCharaAlert(true);
      flag = true;
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
    Object.keys(userData.p).forEach((c) => {
      if (userData.p[c].some((b) => b.length !== purpleboard.c[c].b.length)) {
        flag = true;
        userData.p[c] = purpleboard.c[c].b.map((a, i) =>
          a
            .toString(10)
            .split("")
            .map((_, j) => userData.p[c][i][j] ?? 0)
        );
      }
    });
    if (flag) saveBoardData(userData);
    const sortedCharaList = [...charaList].sort(
      (a, b) =>
        Number(chara[b].t[userData.c]) - Number(chara[a].t[userData.c]) ||
        Number(chara[b].t) - Number(chara[a].t)
    );
    const boardTypes = Object.values(BoardType).filter(
      (bt) => typeof bt === "string"
    ) as string[];
    const pBoardTypes = Object.values(PurpleBoardType).filter(
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
            boardDataSkel[i][BoardType[parseInt(cbin, 10)]].charas.push({
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
    const pBoardDataSkel = Array.from(Array(3).keys()).map(() =>
      Object.fromEntries(
        pBoardTypes.map((bt) => {
          return [bt, { charas: [] }] as [string, BoardDataPropsBoard];
        })
      )
    );
    sortedCharaList.forEach((c) => {
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
        pboard: pBoardDataSkel,
        user: userData,
        boardIndex: 0,
        visibleBoard: userData.v,
        isDirty: 0,
      },
    });
  }, []);
  useEffect(initFromUserData, [initFromUserData]);
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
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      if (isReady) {
        if (googleLinked && autoLoad && !loaded) {
          toast(t("ui.common.dataLoading"));
          await autoLoad();
          initFromUserData();
          toast(t("ui.common.dataLoaded"));
          setLoaded(true);
        }
        if (!googleLinked) initFromUserData();
      }
    })();
  }, [isReady, googleLinked, autoLoad, initFromUserData, t, loaded]);

  const timeoutRef = useRef<NodeJS.Timeout | undefined>();
  const autosaver = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      dispatchBoardData({ type: "clean" });
      if (isReady && googleLinked && autoSave) {
        autoSave();
      }
    }, 2000);
  }, [autoSave, googleLinked, isReady]);
  useEffect(() => {
    if (boardData && boardData.isDirty) autosaver();
  }, [autosaver, boardData]);

  return (
    <Layout>
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
                  <SubtitleBar>{t("ui.board.selectBoardType")}</SubtitleBar>
                  <div className="px-4 flex gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        dispatchBoardData({
                          type: "visible",
                          payload: (
                            Object.values(BoardType).filter(
                              (b) => typeof b === "string"
                            ) as string[]
                          ).map((b) => BoardType[b as keyof typeof BoardType]),
                        })
                      }
                    >
                      {t("ui.board.selectBoardTypeAll")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        dispatchBoardData({
                          type: "visible",
                          payload: [
                            BoardType.AttackBoth,
                            BoardType.CriticalRate,
                            BoardType.Hp,
                          ],
                        })
                      }
                    >
                      {t("ui.board.selectBoardTypeRecommended")}
                    </Button>
                  </div>
                  <div className="px-4">
                    <ToggleGroup
                      type="multiple"
                      className="flex-wrap"
                      value={
                        boardData?.visibleBoard.map((b) => BoardType[b]) ??
                        (Object.values(BoardType).filter(
                          (b) => typeof b === "string"
                        ) as string[])
                      }
                      onValueChange={(v) => {
                        dispatchBoardData({
                          type: "visible",
                          payload: v.map(
                            (b) => BoardType[b as keyof typeof BoardType]
                          ),
                        });
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
                          >
                            <img
                              src={`/boards/Tile_${bt}On.png`}
                              className="h-6 w-6 aspect-square"
                            />
                          </ToggleGroupItem>
                        );
                      })}
                    </ToggleGroup>
                  </div>
                </div> */}
                {/* <div className="flex flex-col gap-2">
                  <SubtitleBar>{t("ui.board.mainClassification")}</SubtitleBar>
                  <div></div>
                </div> */}
                {/* <div className="flex flex-col gap-2">
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
                </div> */}
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
          <AccordionItem value="item-3">
            <AccordionTrigger>
              {t("ui.board.allStatPercentTotal")}
            </AccordionTrigger>
            <AccordionContent className="text-base">
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
                      const includedBoards = board.s
                        .map((s, i) => [s, i] as [number[], number])
                        .filter(([s]) => s.includes(statNum))
                        .map(([, i]) => i);
                      const data = Object.fromEntries(
                        includedBoards.map((b) => [
                          BoardType[b],
                          boardData.board.map(
                            (nthboard) => nthboard[BoardType[b]]
                          ),
                        ])
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
                    rarity={4}
                    data={boardData.board.map((nthboard) => {
                      return {
                        charas: Object.values(nthboard).reduce(
                          (a, b) => a.concat(b.charas),
                          [] as BoardDataPropsBoard["charas"]
                        ),
                      };
                    })}
                    require={[2, 4, 6]}
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              {t("ui.board.allStatBaseTotal")}
            </AccordionTrigger>
            <AccordionContent className="text-base">
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
      {/* <div className="w-full font-onemobile">
        <Tabs value={viewMode} className="w-full">
          <TabsList className="w-full flex">
            <TabsTrigger
              value="target"
              className="flex-1"
              onClick={() => setViewMode("target")}
            >
              <div>{t("ui.board.viewTargetBoard")}</div>
            </TabsTrigger>
            <TabsTrigger
              value="full"
              className="flex-1"
              onClick={() => setViewMode("full")}
            >
              <div>{t("ui.board.viewFullBoard")}</div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div> */}
      {boardData && (
        <div className="font-onemobile max-w-[1920px] columns-1 md:columns-2 lg:columns-3 gap-4 py-4">
          {boardData.user.o.map((name) => {
            // const currentBoard = board.c[name].b;
            const currentPurpleBoard = purpleboard.c[name]; // b: 보크보드 종류, p: 해당 종류 위치 인덱스
            const charaPersonality = Number(chara[name].t[0]);
            const charaRace = Number(chara[name].t[5]);
            const personalityClassName = [
              "bg-personality-Cool",
              "bg-personality-Gloomy",
              "bg-personality-Jolly",
              "bg-personality-Mad",
              "bg-personality-Naive",
            ][charaPersonality];
            return (
              <Card
                key={name}
                className="p-4 object-cover max-w-full break-inside-avoid mt-0 mb-4"
              >
                {/* title bar */}
                <div className="flex gap-2 items-center">
                  <div
                    className="sm:min-w-10 sm:min-h-10 md:min-w-12 md:min-h-12 max-w-16 relative aspect-square"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <div
                      className={[
                        "min-w-10 min-h-10 sm:min-w-12 sm:min-h-12 max-w-14 aspect-square",
                        personalityClassName,
                      ].join(" ")}
                    >
                      <img
                        src={`/charas/${name}.png`}
                        className="aspect-square w-full"
                      />
                    </div>
                  </div>
                  <div className="flex-initial flex-shrink-0 flex flex-col items-start">
                    <div className="text-sm">
                      <span className="align-middle">
                        {t(`ui.board.viewTargetBoardShort`)}
                      </span>
                    </div>
                    <div className="text-2xl">{t(`chara.${name}`)}</div>
                  </div>
                  <div className="flex-1 w-18">
                    <div className="flex flex-col gap-1 items-end">
                      {/* <div className="mb-2 text-left flex items-center gap-2">
                        <Switch
                          id="view-all-stat-with-board"
                          checked={true}
                          onCheckedChange={(c) => {
                            // setWithBoardStat(c);
                            // if (c) getBoardStats();
                          }}
                        />
                        <Label htmlFor="view-all-stat-with-board">
                          {t("ui.board.nthBoardOpened", { 0: "2" })}
                        </Label>
                      </div>
                      <div className="mb-2 text-left flex items-center gap-2">
                        <Switch
                          id="view-all-stat-with-board"
                          checked={true}
                          onCheckedChange={(c) => {
                            // setWithBoardStat(c);
                            // if (c) getBoardStats();
                          }}
                        />
                        <Label htmlFor="view-all-stat-with-board">
                          {t("ui.board.nthBoardOpened", { 0: "3" })}
                        </Label>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-2">
                    <div className="flex-[1] -mx-2">
                      <SubtitleBar>{t("ui.board.board1")}</SubtitleBar>
                      <div className="flex flex-row flex-wrap py-1 px-2 w-full justify-center">
                        {currentPurpleBoard.b[0]
                          .toString(10)
                          .split("")
                          .map((pb, i) => {
                            const positionsIndex = Number(
                              currentPurpleBoard.p[0].split(".")[i]
                            );
                            const positionData =
                              purpleposition.r[Race[charaRace]][0];
                            const positions =
                              positionData.p[positionsIndex].split(".");
                            return [...positions].map((_, posIndex) => {
                              const target = boardData.pboard[0][
                                PurpleBoardType[parseInt(pb, 10)]
                              ].charas.find(
                                (c) =>
                                  c.name === name &&
                                  c.bdx === i &&
                                  c.ldx === posIndex
                              );
                              if (!target) return null;
                              const checked = target.checked;
                              return (
                                <div
                                  key={`${i}-${posIndex}`}
                                  className="w-1/2 aspect-square p-px"
                                >
                                  <img
                                    src={`/boards/Tile_${
                                      PurpleBoardType[parseInt(pb, 10)]
                                    }${checked ? "On" : "Off"}.png`}
                                    className="w-full aspect-square bg-cover"
                                    style={{
                                      backgroundImage: `url(/boards/Rect_0${
                                        checked ? 6 : 7
                                      }.png)`,
                                    }}
                                    onClick={() => {
                                      dispatchBoardData({
                                        type: "click",
                                        payload: {
                                          charaName: name,
                                          boardIndex: 0,
                                          bdx: i,
                                          ldx: posIndex,
                                          boardType: "p",
                                        },
                                      });
                                    }}
                                  />
                                </div>
                              );
                            });
                          })}
                      </div>
                    </div>
                    <div className="flex-[2] -mx-2">
                      <SubtitleBar>{t("ui.board.board2")}</SubtitleBar>
                      <div className="flex flex-row flex-wrap py-1 px-4 w-full justify-center">
                        {currentPurpleBoard.b[1]
                          .toString(10)
                          .split("")
                          .map((pb, i) => {
                            const positionsIndex = Number(
                              currentPurpleBoard.p[1].split(".")[i]
                            );
                            const positionData =
                              purpleposition.r[Race[charaRace]][1];
                            const positions =
                              positionData.p[positionsIndex].split(".");
                            return [...positions].map((_, posIndex) => {
                              const target = boardData.pboard[1][
                                PurpleBoardType[parseInt(pb, 10)]
                              ].charas.find(
                                (c) =>
                                  c.name === name &&
                                  c.bdx === i &&
                                  c.ldx === posIndex
                              );
                              if (!target) return null;
                              const checked = target.checked;
                              return (
                                <div
                                  key={`${i}-${posIndex}`}
                                  className="w-1/4 aspect-square p-px"
                                >
                                  <img
                                    src={`/boards/Tile_${
                                      PurpleBoardType[parseInt(pb, 10)]
                                    }${checked ? "On" : "Off"}.png`}
                                    className="w-full aspect-square bg-cover"
                                    style={{
                                      backgroundImage: `url(/boards/Rect_0${
                                        checked ? 6 : 7
                                      }.png)`,
                                    }}
                                    onClick={() => {
                                      dispatchBoardData({
                                        type: "click",
                                        payload: {
                                          charaName: name,
                                          boardIndex: 1,
                                          bdx: i,
                                          ldx: posIndex,
                                          boardType: "p",
                                        },
                                      });
                                    }}
                                  />
                                </div>
                              );
                            });
                          })}
                      </div>
                    </div>
                  </div>
                  <div>
                    <SubtitleBar>{t("ui.board.board3")}</SubtitleBar>
                    <div className="flex flex-row flex-wrap py-1 px-3 w-full justify-center">
                      {currentPurpleBoard.b[2]
                        .toString(10)
                        .split("")
                        .map((pb, i) => {
                          const positionsIndex = Number(
                            currentPurpleBoard.p[2].split(".")[i]
                          );
                          const positionData =
                            purpleposition.r[Race[charaRace]][2];
                          const positions =
                            positionData.p[positionsIndex].split(".");
                          return [...positions].map((_, posIndex) => {
                            const target = boardData.pboard[2][
                              PurpleBoardType[parseInt(pb, 10)]
                            ].charas.find(
                              (c) =>
                                c.name === name &&
                                c.bdx === i &&
                                c.ldx === posIndex
                            );
                            if (!target) return null;
                            const checked = target.checked;
                            return (
                              <div
                                key={`${i}-${posIndex}`}
                                className="w-1/6 aspect-square p-px"
                              >
                                <img
                                  src={`/boards/Tile_${
                                    PurpleBoardType[parseInt(pb, 10)]
                                  }${checked ? "On" : "Off"}.png`}
                                  className="w-full aspect-square bg-cover"
                                  style={{
                                    backgroundImage: `url(/boards/Rect_0${
                                      checked ? 6 : 7
                                    }.png)`,
                                  }}
                                  onClick={() => {
                                    dispatchBoardData({
                                      type: "click",
                                      payload: {
                                        charaName: name,
                                        boardIndex: 2,
                                        bdx: i,
                                        ldx: posIndex,
                                        boardType: "p",
                                      },
                                    });
                                  }}
                                />
                              </div>
                            );
                          });
                        })}
                    </div>
                  </div>
                </div>
                {/* <div className="mt-6 flex gap-1 sm:gap-2 lg:gap-3">
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
                    <div className="flex flex-col">
                      {board.s[BoardType[bt as keyof typeof BoardType]].map(
                        (statNum, statIndex) => {
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
                                {currentBoard.charas.filter((c) => c.checked)
                                  .length *
                                  board.b[
                                    BoardType[bt as keyof typeof BoardType]
                                  ][statIndex][boardData.boardIndex]}
                                %
                              </span>
                            </div>
                          );
                        }
                      )}
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
                </div> */}
              </Card>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default PurpleBoard;
