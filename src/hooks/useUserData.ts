import { useCallback, useMemo, useReducer } from "react";
import board from "@/data/board";
import pboard from "@/data/purpleboard";
import { UserDataMemory, UserDataOwnedCharaInfo } from "@/types/types";
import { BoardType, FilterBy, SortBy, StatType } from "@/types/enums";
import sortChange from "@/utils/sortChange";
import filterChange from "@/utils/filterChange";
import int1BitCount from "@/utils/int1bitCount";

type ActionPayload<T> = T extends { payload: infer P } ? P : never;
type ActionHandler<T, U> = (state: T, payload: ActionPayload<U>) => T;
type NoNeverParam<T extends (...args: Parameters<T>) => ReturnType<T>> =
  Parameters<T> extends [infer U, never] ? (state: U) => ReturnType<T> : T;
type Handler<T> = NoNeverParam<ActionHandler<UserDataMemory, T>>;

interface DataRestoreAction {
  type: "dataRestore";
  payload: UserDataMemory;
}

interface DataSetTimeStampAction {
  type: "dataTimeStamp";
  payload: number;
}
const dataTimeStampActionHandler: Handler<DataSetTimeStampAction> = (
  state,
  payload
) => {
  return {
    ...state,
    timestamp: payload,
  };
};

interface DataCleanAction {
  type: "clean";
}
const dataCleanActionHandler: Handler<DataCleanAction> = (state) => {
  return {
    ...state,
    dirty: 0,
  };
};

interface BoardDataClickAction {
  type: "boardDataClick";
  payload: {
    charaName: string;
    boardIndex: number;
    ldx: number;
    bdx: number;
  };
}
const boardDataClickActionHandler: Handler<BoardDataClickAction> = (
  state,
  payload
) => {
  const { boardIndex, charaName, ldx, bdx } = payload;
  const charaInfo = state.charaInfo[charaName];
  if (charaInfo.unowned) {
    const newCharaInfo = {
      skin: charaInfo.skin,
      unowned: false,
      memo: charaInfo.memo,
      board: board.c[charaName].b.map((d) => Array(d.length).fill(0)),
      pboard: pboard.c[charaName].b.map((d) =>
        Array(d.toString(10).length).fill(0)
      ),
      nthboard: 1,
      eqrank: 1,
    };
    return {
      ...state,
      dirty: ((state.dirty + 1) % 32768) + 65536,
      charaInfo: {
        ...state.charaInfo,
        [charaName]: newCharaInfo,
      },
      timestamp: Date.now(),
    };
  }
  const targetMutated = (charaInfo.board[boardIndex][ldx] || 0) ^ (1 << bdx);
  const targetBoardIndexMutated = charaInfo.board[boardIndex].map((v, i) =>
    i === ldx ? targetMutated : v
  );
  const targetBoardMutated = charaInfo.board.map((d, i) =>
    i === boardIndex ? targetBoardIndexMutated : d
  );
  const newCharaInfo = {
    ...charaInfo,
    nthboard: Math.max(charaInfo.nthboard, boardIndex + 1),
    board: targetBoardMutated,
  };
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    charaInfo: {
      ...state.charaInfo,
      [charaName]: newCharaInfo,
    },
    timeestamp: Date.now(),
  };
};

interface BoardDataChangeClassificationAction {
  type: "boardClassification";
  payload: number[];
}
const boardDataChangeClassificationActionHandler: Handler<
  BoardDataChangeClassificationAction
> = (state, payload) => {
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    board: { ...state.board, c: [...payload] },
    timeestamp: Date.now(),
  };
};

interface BoardDataChangeVisibleBoardAction {
  type: "boardVisible";
  payload: BoardType[];
}
const boardDataChangeVisibleBoardActionHandler: Handler<
  BoardDataChangeVisibleBoardAction
> = (state, payload) => {
  if (payload.length === 0) return state;
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    board: { ...state.board, v: [...payload] },
    timeestamp: Date.now(),
  };
};

interface BoardDataChangeViewNthBoardAction {
  type: "boardViewNthBoard";
  payload: number;
}
const boardDataChangeViewNthBoardActionHandler: Handler<
  BoardDataChangeViewNthBoardAction
> = (state, payload) => {
  return {
    ...state,
    board: { ...state.board, i: payload },
    timeestamp: Date.now(),
  };
};

interface PboardDataClickAction {
  type: "pboardClick";
  payload: {
    boardIndex: number;
    charaName: string;
    ldx: number;
    bdx: number;
  };
}
const pboardDataClickActionHandler: Handler<PboardDataClickAction> = (
  state,
  payload
) => {
  const { boardIndex, charaName, ldx, bdx } = payload;
  const charaInfo = state.charaInfo[charaName];
  if (charaInfo.unowned) return state;
  const targetMutated = charaInfo.pboard.map((a, i) =>
    i === boardIndex ? a.map((b, j) => (j === bdx ? b ^ (1 << ldx) : b)) : a
  );
  const newCharaInfo = {
    ...charaInfo,
    nthboard: Math.max(charaInfo.nthboard, boardIndex + 1),
    pboard: targetMutated,
  };
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    charaInfo: {
      ...state.charaInfo,
      [charaName]: newCharaInfo,
    },
    timeestamp: Date.now(),
  };
};

interface NthBoardDataChangeBoardIndexAction {
  type: "boardIndex";
  payload: {
    charaName: string;
    boardIndex: number;
  };
}
const nthBoardDataChangeBoardIndexActionHandler: Handler<
  NthBoardDataChangeBoardIndexAction
> = (state, payload) => {
  const { charaName, boardIndex } = payload;
  const charaInfo = state.charaInfo[charaName];
  if (charaInfo.unowned) return state;
  const newCharaInfo = {
    ...charaInfo,
    nthboard: boardIndex,
  };
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    charaInfo: {
      ...state.charaInfo,
      [charaName]: newCharaInfo,
    },
    timeestamp: Date.now(),
  };
};

interface RankDataCharaRankModifyAction {
  type: "rankModify";
  payload: {
    charaName: string;
    rank: number;
  };
}
const rankDataCharaRankModifyActionHandler: Handler<
  RankDataCharaRankModifyAction
> = (state, payload) => {
  const { charaName, rank } = payload;
  const charaInfo = state.charaInfo[charaName];
  if (charaInfo.unowned) return state;
  const newCharaInfo = {
    ...charaInfo,
    eqrank: rank,
  };
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    charaInfo: {
      ...state.charaInfo,
      [charaName]: newCharaInfo,
    },
    timeestamp: Date.now(),
  };
};

interface RankDataChangeTargetStatAction {
  type: "rankTargetStat";
  payload: StatType[];
}
const rankDataChangeTargetStatActionHandler: Handler<
  RankDataChangeTargetStatAction
> = (state, payload) => {
  if (payload.length === 0) return state;
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    eqrank: { ...state.eqrank, v: [...payload] },
    timeestamp: Date.now(),
  };
};

interface RankDataChangeMinRankAction {
  type: "rankMinRank";
  payload: number;
}
const rankDataChangeMinRankActionHandler: Handler<
  RankDataChangeMinRankAction
> = (state, payload) => {
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    eqrank: {
      ...state.eqrank,
      s: [payload, state.eqrank.s[1]].sort((a, b) => a - b),
    },
    timeestamp: Date.now(),
  };
};

interface RankDataChangeMaxRankAction {
  type: "rankMaxRank";
  payload: number;
}
const rankDataChangeMaxRankActionHandler: Handler<
  RankDataChangeMaxRankAction
> = (state, payload) => {
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    eqrank: {
      ...state.eqrank,
      s: [state.eqrank.s[0], payload].sort((a, b) => a - b),
    },
    timeestamp: Date.now(),
  };
};

interface RankDataApplyMinMaxAction {
  type: "rankApplyMinMax";
}
const rankDataApplyMinMaxActionHandler: Handler<RankDataApplyMinMaxAction> = (
  state
) => {
  const minRank = state.eqrank.s[0];
  const maxRank = state.eqrank.s[1];
  const userCharaDatas = Object.fromEntries(
    Object.entries(state.charaInfo).map(([name, value]) => {
      if (value.unowned) return [name, value];
      const newValue = {
        ...value,
        eqrank: Math.min(maxRank, Math.max(minRank, value.eqrank)),
      };
      return [name, newValue];
    })
  );
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    charaInfo: userCharaDatas,
    timeestamp: Date.now(),
  };
};

interface RankDataChangeSortAction {
  type: "rankSort";
  payload: SortBy;
}
const rankDataChangeSortActionHandler: Handler<RankDataChangeSortAction> = (
  state,
  payload
) => {
  const sortAndFilterData = sortChange(state.eqrank.f, payload);
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    eqrank: { ...state.eqrank, f: sortAndFilterData },
    timeestamp: Date.now(),
  };
};

interface RankDataChangeFilterAction {
  type: "rankFilter";
  payload: {
    filterBy: FilterBy;
    filter: number;
  };
}
const rankDataChangeFilterActionHandler: Handler<RankDataChangeFilterAction> = (
  state,
  payload
) => {
  const sortAndFilterData = filterChange(
    state.eqrank.f,
    payload.filterBy,
    payload.filter
  );
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    eqrank: { ...state.eqrank, f: sortAndFilterData },
    timeestamp: Date.now(),
  };
};

interface LabDataChangeIndexAction {
  type: "labIndex";
  payload: {
    indexDepth1: number;
    indexDepth2: number;
  };
}
const labDataChangeIndexActionHandler: Handler<LabDataChangeIndexAction> = (
  state,
  payload
) => {
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    lab: { 1: payload.indexDepth1, 2: payload.indexDepth2 },
    timeestamp: Date.now(),
  };
};

interface MyHomeLevels {
  lab: number[];
  restaurant: number[];
  myhome: number[];
  schedule: number[];
  archive: number[];
}
interface LabDataChangeMyHomeLevelAction {
  type: "labMyHomeLevel";
  payload: {
    target: keyof MyHomeLevels;
    index: number;
    value: number;
  };
}
const labDataChangeMyHomeLevelActionHandler: Handler<
  LabDataChangeMyHomeLevelAction
> = (state, payload) => {
  const { target, index, value } = payload;
  const targetKey = target.charAt(0) as "l" | "r" | "m" | "s" | "a";
  const targetLevel = [...state.myhome[targetKey]];
  targetLevel[index] = value;
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    myhome: { ...state.myhome, [targetKey]: targetLevel },
    timeestamp: Date.now(),
  };
};

interface LabDataChangeCollectionAction {
  type: "labCollection";
  payload: {
    id: string;
    collected: boolean;
  };
}
const labDataChangeCollectionActionHandler: Handler<
  LabDataChangeCollectionAction
> = (state, payload) => {
  const { id, collected } = payload;
  const newCollection = collected
    ? [...state.collection.c, id]
    : state.collection.c.filter((v) => v !== id);
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    collection: { ...state.collection, c: newCollection },
    timeestamp: Date.now(),
  };
};

interface UnownedDataAddOwnAction {
  type: "unownedAddOwn";
  payload: string;
}
const unownedDataAddOwnActionHandler: Handler<UnownedDataAddOwnAction> = (
  state,
  payload
) => {
  const charaInfo = state.charaInfo[payload];
  if (!charaInfo.unowned) return state;
  const newUnowned = state.unowned.u.filter((v) => v !== payload);
  const newOwned = [...state.unowned.o, payload];
  const newCharaInfo = {
    skin: charaInfo.skin,
    unowned: false,
    memo: charaInfo.memo,
    board: board.c[payload].b.map((d) => Array(d.length).fill(0)),
    pboard: pboard.c[payload].b.map((d) =>
      Array(d.toString(10).length).fill(0)
    ),
    nthboard: 1,
    eqrank: 1,
  };
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    charaInfo: {
      ...state.charaInfo,
      [payload]: newCharaInfo,
    },
    unowned: { o: newOwned, u: newUnowned },
    timeestamp: Date.now(),
  };
};

const tutorialCharacters = [
  "Rohne",
  "Mayo",
  "Mago",
  "Allet",
  "Maison",
  "Yumimi",
  "Ifrit",
];
const isTutorialCharacter = (name: string) => tutorialCharacters.includes(name);

interface UnownedDataRemoveOwnAction {
  type: "unownedRemoveOwn";
  payload: string;
}
const unownedDataRemoveOwnActionHandler: Handler<UnownedDataRemoveOwnAction> = (
  state,
  payload
) => {
  if (isTutorialCharacter(payload)) return state;
  const charaInfo = state.charaInfo[payload];
  if (charaInfo.unowned) return state;
  const newUnowned = [...state.unowned.u, payload];
  const newOwned = state.unowned.o.filter((v) => v !== payload);
  const newCharaInfo = {
    skin: charaInfo.skin,
    unowned: true as const,
    memo: charaInfo.memo,
  };
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    charaInfo: {
      ...state.charaInfo,
      [payload]: newCharaInfo,
    },
    unowned: { o: newOwned, u: newUnowned },
    timeestamp: Date.now(),
  };
};

interface UnownedDataOwnAllAction {
  type: "unownedOwnAll";
}
const unownedDataOwnAllActionHandler: Handler<UnownedDataOwnAllAction> = (
  state
) => {
  const newCharaInfo = Object.fromEntries(
    Object.entries(state.charaInfo).map(([name, value]) => {
      if (!value.unowned) return [name, value];
      return [
        name,
        {
          skin: value.skin,
          unowned: false,
          memo: value.memo,
          board: board.c[name].b.map((d) => Array(d.length).fill(0)),
          pboard: pboard.c[name].b.map((d) =>
            Array(d.toString(10).length).fill(0)
          ),
          nthboard: 1,
          eqrank: 1,
        },
      ];
    })
  );
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    charaInfo: newCharaInfo,
    unowned: { o: Object.keys(newCharaInfo), u: [] },
    timeestamp: Date.now(),
  };
};

interface UnownedDataOwnNoneAction {
  type: "unownedOwnNone";
}
const unownedDataOwnNoneActionHandler: Handler<UnownedDataOwnNoneAction> = (
  state
) => {
  const newCharaInfo = Object.fromEntries(
    Object.entries(state.charaInfo).map(([name, value]) => {
      if (value.unowned) return [name, value];
      if (isTutorialCharacter(name)) return [name, value];
      return [
        name,
        {
          skin: value.skin,
          unowned: true as const,
          memo: value.memo,
        },
      ];
    })
  );
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    charaInfo: newCharaInfo,
    unowned: {
      o: tutorialCharacters,
      u: Object.keys(newCharaInfo).map((c) => !isTutorialCharacter(c)),
    },
    timeestamp: Date.now(),
  };
};

interface UnownedDataImportAction {
  type: "unownedImport";
  payload: {
    o: string[];
    u: string[];
  };
}
const unownedDataImportActionHandler: Handler<UnownedDataImportAction> = (
  state,
  payload
) => {
  const o = [...state.unowned.o];
  const u = [...state.unowned.u];
  tutorialCharacters.forEach((c) => {
    if (!o.includes(c)) o.push(c);
    if (u.includes(c)) u.splice(u.indexOf(c), 1);
  })
  const newCharaInfo = Object.fromEntries(
    Object.entries(state.charaInfo).map(([name, value]) => {
      if (isTutorialCharacter(name)) return [name, value];
      if (value.unowned && payload.o.includes(name)) {
        o.push(name);
        u.splice(u.indexOf(name), 1);
        return [
          name,
          {
            skin: value.skin,
            unowned: false,
            memo: value.memo,
            board: board.c[name].b.map((d) => Array(d.length).fill(0)),
            pboard: pboard.c[name].b.map((d) =>
              Array(d.toString(10).length).fill(0)
            ),
            nthboard: 1,
            eqrank: 1,
          },
        ];
      }
      if (!value.unowned && payload.u.includes(name)) {
        u.push(name);
        o.splice(o.indexOf(name), 1);
        return [
          name,
          {
            skin: value.skin,
            unowned: true as const,
            memo: value.memo,
          },
        ];
      }
      return [name, value];
    })
  );
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    charaInfo: newCharaInfo,
    unowned: { o, u },
    timeestamp: Date.now(),
  };
};

interface CharaDataChangeSkinAction {
  type: "charaSkin";
  payload: {
    charaName: string;
    skin: number;
  };
}
const charaDataChangeSkinActionHandler: Handler<CharaDataChangeSkinAction> = (
  state,
  payload
) => {
  const { charaName, skin } = payload;
  const charaInfo = state.charaInfo[charaName];
  const newCharaInfo = {
    ...charaInfo,
    skin,
  };
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    charaInfo: {
      ...state.charaInfo,
      [charaName]: newCharaInfo,
    },
    timeestamp: Date.now(),
  };
};

interface CharaDataChangeFavAction {
  type: "charaFav";
  payload: {
    charaName: string;
    fav: boolean;
  };
}
const charaDataChangeFavActionHandler: Handler<CharaDataChangeFavAction> = (
  state,
  payload
) => {
  const { charaName, fav } = payload;
  const charaInfo = state.charaInfo[charaName];
  const newCharaInfo = {
    ...charaInfo,
    memo: [fav ? 1 : 0, charaInfo.memo[1]] as [number, string],
  };
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    charaInfo: {
      ...state.charaInfo,
      [charaName]: newCharaInfo,
    },
    timeestamp: Date.now(),
  };
};

interface CharaDataChangeMemoAction {
  type: "charaMemo";
  payload: {
    charaName: string;
    memo: string;
  };
}
const charaDataChangeMemoActionHandler: Handler<CharaDataChangeMemoAction> = (
  state,
  payload
) => {
  const { charaName, memo } = payload;
  const charaInfo = state.charaInfo[charaName];
  const newCharaInfo = {
    ...charaInfo,
    memo: [charaInfo.memo[0], memo] as [number, string],
  };
  return {
    ...state,
    dirty: ((state.dirty + 1) % 32768) + 65536,
    charaInfo: {
      ...state.charaInfo,
      [charaName]: newCharaInfo,
    },
    timeestamp: Date.now(),
  };
};

type ActionType =
  // data restore from idb or file
  | DataRestoreAction
  | DataSetTimeStampAction
  // dirty data clean(save)
  | DataCleanAction
  // board data mutation
  | BoardDataClickAction
  | BoardDataChangeClassificationAction
  | BoardDataChangeVisibleBoardAction
  | BoardDataChangeViewNthBoardAction
  // pboard data mutation
  | PboardDataClickAction
  // nthboard data mutation
  | NthBoardDataChangeBoardIndexAction
  // equip rank data mutation
  | RankDataCharaRankModifyAction
  | RankDataChangeTargetStatAction
  | RankDataChangeMinRankAction
  | RankDataChangeMaxRankAction
  | RankDataApplyMinMaxAction
  | RankDataChangeSortAction
  | RankDataChangeFilterAction
  // lab data mutation
  | LabDataChangeIndexAction
  | LabDataChangeMyHomeLevelAction
  | LabDataChangeCollectionAction
  // unowned data mutation
  | UnownedDataAddOwnAction
  | UnownedDataRemoveOwnAction
  | UnownedDataOwnAllAction
  | UnownedDataOwnNoneAction
  | UnownedDataImportAction
  // chara data mutation
  | CharaDataChangeSkinAction
  | CharaDataChangeFavAction
  | CharaDataChangeMemoAction;

const memoryDataReducer = (
  state: UserDataMemory | undefined,
  action: ActionType
): UserDataMemory | undefined => {
  if (action.type === "dataRestore") return action.payload;
  if (!state) return state;
  switch (action.type) {
    case "dataTimeStamp":
      return dataTimeStampActionHandler(state, action.payload);
    case "clean":
      return dataCleanActionHandler(state);
    case "boardDataClick":
      return boardDataClickActionHandler(state, action.payload);
    case "boardClassification":
      return boardDataChangeClassificationActionHandler(state, action.payload);
    case "boardVisible":
      return boardDataChangeVisibleBoardActionHandler(state, action.payload);
    case "boardViewNthBoard":
      return boardDataChangeViewNthBoardActionHandler(state, action.payload);
    case "pboardClick":
      return pboardDataClickActionHandler(state, action.payload);
    case "boardIndex":
      return nthBoardDataChangeBoardIndexActionHandler(state, action.payload);
    case "rankModify":
      return rankDataCharaRankModifyActionHandler(state, action.payload);
    case "rankTargetStat":
      return rankDataChangeTargetStatActionHandler(state, action.payload);
    case "rankMinRank":
      return rankDataChangeMinRankActionHandler(state, action.payload);
    case "rankMaxRank":
      return rankDataChangeMaxRankActionHandler(state, action.payload);
    case "rankApplyMinMax":
      return rankDataApplyMinMaxActionHandler(state);
    case "rankSort":
      return rankDataChangeSortActionHandler(state, action.payload);
    case "rankFilter":
      return rankDataChangeFilterActionHandler(state, action.payload);
    case "labIndex":
      return labDataChangeIndexActionHandler(state, action.payload);
    case "labMyHomeLevel":
      return labDataChangeMyHomeLevelActionHandler(state, action.payload);
    case "labCollection":
      return labDataChangeCollectionActionHandler(state, action.payload);
    case "unownedAddOwn":
      return unownedDataAddOwnActionHandler(state, action.payload);
    case "unownedRemoveOwn":
      return unownedDataRemoveOwnActionHandler(state, action.payload);
    case "unownedOwnAll":
      return unownedDataOwnAllActionHandler(state);
    case "unownedOwnNone":
      return unownedDataOwnNoneActionHandler(state);
    case "unownedImport":
      return unownedDataImportActionHandler(state, action.payload);
    case "charaSkin":
      return charaDataChangeSkinActionHandler(state, action.payload);
    case "charaFav":
      return charaDataChangeFavActionHandler(state, action.payload);
    case "charaMemo":
      return charaDataChangeMemoActionHandler(state, action.payload);
    default:
      return state;
  }
};

export function useUserData(data?: UserDataMemory) {
  const [state, dispatch] = useReducer(memoryDataReducer, data);

  const restore = useCallback((data: UserDataMemory) => {
    dispatch({ type: "dataRestore", payload: data });
  }, []);

  const setTimestamp = useCallback((timestamp: number) => {
    dispatch({ type: "dataTimeStamp", payload: timestamp });
  }, []);

  const clean = useCallback(() => {
    dispatch({ type: "clean" });
  }, []);

  const boardClick = useCallback(
    (charaName: string, boardIndex: number, ldx: number, bdx: number) => {
      dispatch({
        type: "boardDataClick",
        payload: { charaName, boardIndex, ldx, bdx },
      });
    },
    []
  );

  const boardClassification = useCallback((payload: number[]) => {
    dispatch({ type: "boardClassification", payload });
  }, []);

  const boardVisible = useCallback((payload: BoardType[]) => {
    dispatch({ type: "boardVisible", payload });
  }, []);

  const boardViewNthBoard = useCallback((payload: number) => {
    dispatch({ type: "boardViewNthBoard", payload });
  }, []);

  const pboardClick = useCallback(
    (charaName: string, boardIndex: number, ldx: number, bdx: number) => {
      dispatch({
        type: "pboardClick",
        payload: { charaName, boardIndex, ldx, bdx },
      });
    },
    []
  );

  const boardIndex = useCallback((charaName: string, boardIndex: number) => {
    dispatch({ type: "boardIndex", payload: { charaName, boardIndex } });
  }, []);

  const rankModify = useCallback((charaName: string, rank: number) => {
    dispatch({ type: "rankModify", payload: { charaName, rank } });
  }, []);

  const rankTargetStat = useCallback((payload: StatType[]) => {
    dispatch({ type: "rankTargetStat", payload });
  }, []);

  const rankMinRank = useCallback((payload: number) => {
    dispatch({ type: "rankMinRank", payload });
  }, []);

  const rankMaxRank = useCallback((payload: number) => {
    dispatch({ type: "rankMaxRank", payload });
  }, []);

  const rankApplyMinMax = useCallback(() => {
    dispatch({ type: "rankApplyMinMax" });
  }, []);

  const rankSort = useCallback((payload: SortBy) => {
    dispatch({ type: "rankSort", payload });
  }, []);

  const rankFilter = useCallback((filterBy: FilterBy, filter: number) => {
    dispatch({ type: "rankFilter", payload: { filterBy, filter } });
  }, []);

  const labIndex = useCallback((indexDepth1: number, indexDepth2: number) => {
    dispatch({ type: "labIndex", payload: { indexDepth1, indexDepth2 } });
  }, []);

  const labMyHomeLevel = useCallback(
    (target: keyof MyHomeLevels, index: number, value: number) => {
      dispatch({ type: "labMyHomeLevel", payload: { target, index, value } });
    },
    []
  );

  const labCollection = useCallback((id: string, collected: boolean) => {
    dispatch({ type: "labCollection", payload: { id, collected } });
  }, []);

  const unownedAddOwn = useCallback((charaName: string) => {
    dispatch({ type: "unownedAddOwn", payload: charaName });
  }, []);

  const unownedRemoveOwn = useCallback((charaName: string) => {
    dispatch({ type: "unownedRemoveOwn", payload: charaName });
  }, []);

  const unownedOwnAll = useCallback(() => {
    dispatch({ type: "unownedOwnAll" });
  }, []);

  const unownedOwnNone = useCallback(() => {
    dispatch({ type: "unownedOwnNone" });
  }, []);

  const unownedImport = useCallback((o: string[], u: string[]) => {
    dispatch({ type: "unownedImport", payload: { o, u } });
  }, []);

  const charaSkin = useCallback((charaName: string, skin: number) => {
    dispatch({ type: "charaSkin", payload: { charaName, skin } });
  }, []);

  const charaFav = useCallback((charaName: string, fav: boolean) => {
    dispatch({ type: "charaFav", payload: { charaName, fav } });
  }, []);

  const charaMemo = useCallback((charaName: string, memo: string) => {
    dispatch({ type: "charaMemo", payload: { charaName, memo } });
  }, []);

  const getStatisticsCore = useCallback((s: UserDataMemory) => {
    const crayon = Object.values(s.charaInfo)
      .map((value) => {
        if (value.unowned) return 0;
        // only count 1-bit
        const crayon1 = value.board[0]
          .map((v) => int1BitCount(v))
          .reduce((a, b) => a + b, 0);
        const crayon2 = value.board[1]
          .map((v) => int1BitCount(v))
          .reduce((a, b) => a + b, 0);
        const crayon3 = value.board[2]
          .map((v) => int1BitCount(v))
          .reduce((a, b) => a + b, 0);
        return crayon1 * 2 + crayon2 * 4 + crayon3 * 6;
      })
      .reduce((a, b) => a + b, 0);
    const rank = Object.values(s.charaInfo)
      .map((value) => (value.unowned ? 0 : value.eqrank))
      .reduce((a, b) => a + b, 0);
    const pcrayon = Object.values(s.charaInfo)
      .map((value) => {
        if (value.unowned) return 0;
        // only count 1-bit
        const crayon1 = value.pboard[0]
          .map((v) => v.toString(2).split("1").length - 1)
          .reduce((a, b) => a + b, 0);
        const crayon2 = value.pboard[1]
          .map((v) => v.toString(2).split("1").length - 1)
          .reduce((a, b) => a + b, 0);
        const crayon3 = value.pboard[2]
          .map((v) => v.toString(2).split("1").length - 1)
          .reduce((a, b) => a + b, 0);
        return crayon1 * 3 + crayon2 * 6 + crayon3 * 9;
      })
      .reduce((a, b) => a + b, 0);
    return { crayon, rank, pcrayon };
  }, []);

  const getStatistics = useCallback(() => {
    if (!state) return { crayon: -1, rank: -1, pcrayon: -1 };
    return getStatisticsCore(state);
  }, [state, getStatisticsCore]);

  const getStatPercents = useCallback(() => {
    if (!state) return {};
    const boardStats: { [key: string]: number } = {};
    const boardData = Object.fromEntries(
      (
        Object.entries(state.charaInfo).filter(([, v]) => !v.unowned) as [
          string,
          UserDataOwnedCharaInfo,
        ][]
      ).map(([c, v]) => [c, v.board])
    );
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
    return boardStats;
  }, [state]);

  const dispatchers = useMemo(
    () => ({
      dispatch,
      restore,
      setTimestamp,
      clean,
      boardClick,
      boardClassification,
      boardVisible,
      boardViewNthBoard,
      pboardClick,
      boardIndex,
      rankModify,
      rankTargetStat,
      rankMinRank,
      rankMaxRank,
      rankApplyMinMax,
      rankSort,
      rankFilter,
      labIndex,
      labMyHomeLevel,
      labCollection,
      unownedAddOwn,
      unownedRemoveOwn,
      unownedOwnAll,
      unownedOwnNone,
      unownedImport,
      charaSkin,
      charaFav,
      charaMemo,
      getStatistics,
      getStatPercents,
    }),
    [
      dispatch,
      restore,
      setTimestamp,
      clean,
      boardClick,
      boardClassification,
      boardVisible,
      boardViewNthBoard,
      pboardClick,
      boardIndex,
      rankModify,
      rankTargetStat,
      rankMinRank,
      rankMaxRank,
      rankApplyMinMax,
      rankSort,
      rankFilter,
      labIndex,
      labMyHomeLevel,
      labCollection,
      unownedAddOwn,
      unownedRemoveOwn,
      unownedOwnAll,
      unownedOwnNone,
      unownedImport,
      charaSkin,
      charaFav,
      charaMemo,
      getStatistics,
      getStatPercents,
    ]
  );

  return [state, dispatchers] as const;
}
