import { useMemo } from "react";
import { create } from "zustand";
import board from "@/data/board";
import pboard from "@/data/purpleboard";
import pet from "@/data/pet";
import {
  UserDataMemory,
  UserDataOwnedCharaInfo,
  UserDataUnowned,
} from "@/types/types";
import {
  BoardType,
  FilterBy,
  SortBy,
  StatType,
  SyncStatus,
} from "@/types/enums";
import { firstReadIntoMemory, writeFromMemory } from "@/utils/dataRW";
import sortChange from "@/utils/sortChange";
import filterChange from "@/utils/filterChange";
import int1BitCount from "@/utils/int1bitCount";

interface BoardDataClickPayload {
  charaName: string;
  boardIndex: number;
  ldx: number;
  bdx: number;
}

interface NthBoardCharaPayload {
  charaName: string;
  boardIndex: number;
}

interface RankDataCharaPayload {
  charaName: string;
  rank: number;
}

interface RankDataFilterPayload {
  filterBy: FilterBy;
  filter: number;
}

interface LabIndexPayload {
  indexDepth1: number;
  indexDepth2: number;
}

interface MyHomeLevels {
  lab: number[];
  restaurant: number[];
  myhome: number[];
  schedule: number[];
  archive: number[];
}
interface ChangeMyHomeLevelPayload {
  target: keyof MyHomeLevels;
  index: number;
  value: number;
}

interface ChangeCollectionPayload {
  id: string;
  collected: boolean;
}

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

interface CharaSkinPayload {
  charaName: string;
  skin: number;
}

interface CharaFavPayload {
  charaName: string;
  fav: boolean;
}

interface CharaMemoPayload {
  charaName: string;
  memo: string;
}

interface UserDataMemoryState extends Partial<UserDataMemory> {
  status: "waiting" | "initialized";
  token: string | undefined;
  googleLinked: boolean | undefined;
  syncStatus: SyncStatus;
  error: string | undefined;
  apiErrorLocalize: string | undefined;
  usingIDB: boolean | undefined;
  actions: {
    restore: (data: UserDataMemory) => void;
    readIntoUserData: () => Promise<void>;
    setTimestamp: (timestamp: number) => void;
    clean: () => void;
    boardClick: (payload: BoardDataClickPayload) => void;
    boardClassification: (payload: number[]) => void;
    boardVisible: (payload: BoardType[]) => void;
    boardViewNthBoard: (payload: number) => void;
    pboardClick: (payload: BoardDataClickPayload) => void;
    boardIndex: (payload: NthBoardCharaPayload) => void;
    rankModify: (payload: RankDataCharaPayload) => void;
    rankTargetStat: (payload: StatType[]) => void;
    rankMinRank: (payload: number) => void;
    rankMaxRank: (payload: number) => void;
    rankApplyMinMax: () => void;
    rankSort: (payload: SortBy) => void;
    rankFilter: (payload: RankDataFilterPayload) => void;
    labIndex: (payload: LabIndexPayload) => void;
    labMyHomeLevel: (payload: ChangeMyHomeLevelPayload) => void;
    labCollection: (payload: ChangeCollectionPayload) => void;
    unownedAddOwn: (payload: string) => void;
    unownedRemoveOwn: (payload: string) => void;
    unownedOwnAll: () => void;
    unownedOwnNone: () => void;
    unownedImport: (payload: UserDataUnowned) => void;
    charaSkin: (payload: CharaSkinPayload) => void;
    charaFav: (payload: CharaFavPayload) => void;
    charaMemo: (payload: CharaMemoPayload) => void;
    boardFinderToggleExcludeUnowned: () => void;
    boardFinderToggleExcludeOpened: () => void;
    boardFinderToggleIncludePrevious: () => void;
    boardFinderSetTargetNthBoard: (payload: number) => void;
    boardFinderRotateBoardPriority: (payload: number) => void;
    boardFinderSetMinimumMatchCount: (payload: number) => void;
    petOwnClick: (payload: string) => void;
    petOwnAll: () => void;
    petOwnNone: () => void;
    petBorrowableValueUp: (payload: string) => void;
    petBorrowableValueDown: (payload: string) => void;
    setToken: (payload: string) => void;
    clearToken: () => void;
    setSyncStatus: (payload: SyncStatus) => void;
    setStatusToIdleIfSuccess: () => void;
    setApiErrorLocalize: (payload: string) => void;
    clearApiErrorLocalize: () => void;
  };
}

export const useUserDataMemoryStore = create<UserDataMemoryState>()((set) => ({
  status: "waiting" as const,
  token: undefined,
  googleLinked: undefined,
  syncStatus: SyncStatus.NotLinked,
  error: undefined,
  apiErrorLocalize: undefined,
  usingIDB: undefined,
  actions: {
    restore: (data: UserDataMemory) => set({ ...data, status: "initialized" }),
    readIntoUserData: async () => {
      firstReadIntoMemory()
        .then(([idbAvailable, memoryData]) => {
          if (memoryData) {
            set({
              usingIDB: idbAvailable,
              ...memoryData,
              status: "initialized",
            });
          }
        })
        .catch((reason) => {
          set({ error: reason });
        });
    },
    setTimestamp: (timestamp: number) => set({ timestamp }),
    clean: () => set({ dirty: 0 }),
    boardClick: ({ charaName, boardIndex, ldx, bdx }: BoardDataClickPayload) =>
      set((state) => {
        if (
          !state ||
          !state.charaInfo ||
          !state.charaInfo[charaName] ||
          typeof state.dirty === "undefined"
        )
          return {};
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
          const oldUnowned = state.unowned;
          if (oldUnowned) {
            const newUnowned = oldUnowned.u.filter((v) => v !== charaName);
            const newOwned = [...oldUnowned.o, charaName];
            return {
              dirty: ((state.dirty + 1) % 32768) + 65536,
              charaInfo: {
                ...state.charaInfo,
                [charaName]: newCharaInfo,
              },
              unowned: { o: newOwned, u: newUnowned },
              timeestamp: Date.now(),
            };
          }
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
        const targetMutated =
          (charaInfo.board[boardIndex][ldx] || 0) ^ (1 << bdx);
        const targetBoardIndexMutated = charaInfo.board[boardIndex].map(
          (v, i) => (i === ldx ? targetMutated : v)
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
          dirty: ((state.dirty + 1) % 32768) + 65536,
          charaInfo: {
            ...state.charaInfo,
            [charaName]: newCharaInfo,
          },
          timeestamp: Date.now(),
        };
      }),
    boardClassification: (payload: number[]) =>
      set((state) => {
        if (!state || !state.board || typeof state.dirty === "undefined")
          return {};
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          board: { ...state.board, c: [...payload] },
          timeestamp: Date.now(),
        };
      }),
    boardVisible: (payload: BoardType[]) =>
      set((state) => {
        if (!state || !state.board || typeof state.dirty === "undefined")
          return {};
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          board: { ...state.board, v: [...payload] },
          timeestamp: Date.now(),
        };
      }),
    boardViewNthBoard: (payload: number) =>
      set((state) => {
        if (!state || !state.board || typeof state.dirty === "undefined")
          return {};
        return {
          board: { ...state.board, i: payload },
          timeestamp: Date.now(),
        };
      }),
    pboardClick: (payload: BoardDataClickPayload) =>
      set((state) => {
        if (!state || !state.charaInfo || typeof state.dirty === "undefined")
          return {};
        const { boardIndex, charaName, ldx, bdx } = payload;
        const charaInfo = state.charaInfo[charaName];
        if (charaInfo.unowned) return {};
        const targetMutated = charaInfo.pboard.map((a, i) =>
          i === boardIndex
            ? a.map((b, j) => (j === bdx ? b ^ (1 << ldx) : b))
            : a
        );
        const newCharaInfo = {
          ...charaInfo,
          nthboard: Math.max(charaInfo.nthboard, boardIndex + 1),
          pboard: targetMutated,
        };
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          charaInfo: {
            ...state.charaInfo,
            [charaName]: newCharaInfo,
          },
          timeestamp: Date.now(),
        };
      }),
    boardIndex: (payload: NthBoardCharaPayload) =>
      set((state) => {
        if (!state || !state.charaInfo || typeof state.dirty === "undefined")
          return {};
        const { charaName, boardIndex } = payload;
        const charaInfo = state.charaInfo[charaName];
        if (charaInfo.unowned) return {};
        const newCharaInfo = {
          ...charaInfo,
          nthboard: boardIndex,
        };
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          charaInfo: {
            ...state.charaInfo,
            [charaName]: newCharaInfo,
          },
          timeestamp: Date.now(),
        };
      }),
    rankModify: (payload: RankDataCharaPayload) =>
      set((state) => {
        if (!state || !state.charaInfo || typeof state.dirty === "undefined")
          return {};
        const { charaName, rank } = payload;
        const charaInfo = state.charaInfo[charaName];
        if (charaInfo.unowned) return {};
        const newCharaInfo = {
          ...charaInfo,
          eqrank: rank,
        };
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          charaInfo: {
            ...state.charaInfo,
            [charaName]: newCharaInfo,
          },
          timeestamp: Date.now(),
        };
      }),
    rankTargetStat: (payload: StatType[]) =>
      set((state) => {
        if (!state || !state.eqrank || typeof state.dirty === "undefined")
          return {};
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          eqrank: { ...state.eqrank, v: [...payload] },
          timeestamp: Date.now(),
        };
      }),
    rankMinRank: (payload: number) =>
      set((state) => {
        if (!state || !state.eqrank || typeof state.dirty === "undefined")
          return {};
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          eqrank: {
            ...state.eqrank,
            s: [payload, state.eqrank.s[1]].sort((a, b) => a - b),
          },
          timeestamp: Date.now(),
        };
      }),
    rankMaxRank: (payload: number) =>
      set((state) => {
        if (!state || !state.eqrank || typeof state.dirty === "undefined")
          return {};
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          eqrank: {
            ...state.eqrank,
            s: [state.eqrank.s[0], payload].sort((a, b) => a - b),
          },
          timeestamp: Date.now(),
        };
      }),
    rankApplyMinMax: () =>
      set((state) => {
        if (
          !state ||
          !state.charaInfo ||
          !state.eqrank ||
          typeof state.dirty === "undefined"
        )
          return {};
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
          dirty: ((state.dirty + 1) % 32768) + 65536,
          charaInfo: userCharaDatas,
          timeestamp: Date.now(),
        };
      }),
    rankSort: (payload: SortBy) =>
      set((state) => {
        if (!state || !state.eqrank || typeof state.dirty === "undefined")
          return {};
        const sortAndFilterData = sortChange(state.eqrank.f, payload);
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          eqrank: { ...state.eqrank, f: sortAndFilterData },
          timeestamp: Date.now(),
        };
      }),
    rankFilter: (payload: RankDataFilterPayload) =>
      set((state) => {
        if (!state || !state.eqrank || typeof state.dirty === "undefined")
          return {};
        const sortAndFilterData = filterChange(
          state.eqrank.f,
          payload.filterBy,
          payload.filter
        );
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          eqrank: { ...state.eqrank, f: sortAndFilterData },
          timeestamp: Date.now(),
        };
      }),
    labIndex: (payload: LabIndexPayload) =>
      set((state) => {
        if (!state || !state.lab || typeof state.dirty === "undefined")
          return {};
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          lab: { 1: payload.indexDepth1, 2: payload.indexDepth2 },
          timeestamp: Date.now(),
        };
      }),
    labMyHomeLevel: (payload: ChangeMyHomeLevelPayload) =>
      set((state) => {
        if (!state || !state.myhome || typeof state.dirty === "undefined")
          return {};
        const { target, index, value } = payload;
        const targetKey = target.charAt(0) as "l" | "r" | "m" | "s" | "a";
        const targetLevel = [...state.myhome[targetKey]];
        targetLevel[index] = value;
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          myhome: { ...state.myhome, [targetKey]: targetLevel },
          timeestamp: Date.now(),
        };
      }),
    labCollection: (payload: ChangeCollectionPayload) =>
      set((state) => {
        if (!state || !state.collection || typeof state.dirty === "undefined")
          return {};
        const { id, collected } = payload;
        const newCollection = collected
          ? [...state.collection.c, id]
          : state.collection.c.filter((v) => v !== id);
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          collection: { ...state.collection, c: newCollection },
          timeestamp: Date.now(),
        };
      }),
    unownedAddOwn: (payload: string) =>
      set((state) => {
        if (
          !state ||
          !state.charaInfo ||
          !state.unowned ||
          typeof state.dirty === "undefined"
        )
          return {};
        const charaInfo = state.charaInfo[payload];
        if (!charaInfo.unowned) return {};
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
          dirty: ((state.dirty + 1) % 32768) + 65536,
          charaInfo: {
            ...state.charaInfo,
            [payload]: newCharaInfo,
          },
          unowned: { o: newOwned, u: newUnowned },
          timeestamp: Date.now(),
        };
      }),
    unownedRemoveOwn: (payload: string) =>
      set((state) => {
        if (
          !state ||
          !state.charaInfo ||
          !state.unowned ||
          typeof state.dirty === "undefined"
        )
          return {};
        const charaInfo = state.charaInfo[payload];
        if (charaInfo.unowned) return {};
        const newUnowned = [...state.unowned.u, payload];
        const newOwned = state.unowned.o.filter((v) => v !== payload);
        const newCharaInfo = {
          skin: charaInfo.skin,
          unowned: true as const,
          memo: charaInfo.memo,
        };
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          charaInfo: {
            ...state.charaInfo,
            [payload]: newCharaInfo,
          },
          unowned: { o: newOwned, u: newUnowned },
          timeestamp: Date.now(),
        };
      }),
    unownedOwnAll: () =>
      set((state) => {
        if (!state || !state.charaInfo || typeof state.dirty === "undefined")
          return {};
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
          dirty: ((state.dirty + 1) % 32768) + 65536,
          charaInfo: newCharaInfo,
          unowned: { o: Object.keys(newCharaInfo), u: [] },
          timeestamp: Date.now(),
        };
      }),
    unownedOwnNone: () =>
      set((state) => {
        if (!state || !state.charaInfo || typeof state.dirty === "undefined")
          return {};
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
          dirty: ((state.dirty + 1) % 32768) + 65536,
          charaInfo: newCharaInfo,
          unowned: {
            o: tutorialCharacters,
            u: Object.keys(newCharaInfo).filter((c) => !isTutorialCharacter(c)),
          },
          timeestamp: Date.now(),
        };
      }),
    unownedImport: (payload: UserDataUnowned) =>
      set((state) => {
        if (
          !state ||
          !state.charaInfo ||
          !state.unowned ||
          typeof state.dirty === "undefined"
        )
          return {};
        const o = [...state.unowned.o];
        const u = [...state.unowned.u];
        tutorialCharacters.forEach((c) => {
          if (!o.includes(c)) o.push(c);
          if (u.includes(c)) u.splice(u.indexOf(c), 1);
        });
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
          dirty: ((state.dirty + 1) % 32768) + 65536,
          charaInfo: newCharaInfo,
          unowned: { o, u },
          timeestamp: Date.now(),
        };
      }),
    charaSkin: (payload: CharaSkinPayload) =>
      set((state) => {
        if (!state || !state.charaInfo || typeof state.dirty === "undefined")
          return {};
        const { charaName, skin } = payload;
        const charaInfo = state.charaInfo[charaName];
        const newCharaInfo = {
          ...charaInfo,
          skin,
        };
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          charaInfo: {
            ...state.charaInfo,
            [charaName]: newCharaInfo,
          },
          timeestamp: Date.now(),
        };
      }),
    charaFav: (payload: CharaFavPayload) =>
      set((state) => {
        if (!state || !state.charaInfo || typeof state.dirty === "undefined")
          return {};
        const { charaName, fav } = payload;
        const charaInfo = state.charaInfo[charaName];
        const newCharaInfo = {
          ...charaInfo,
          memo: [fav ? 1 : 0, charaInfo.memo[1]] as [number, string],
        };
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          charaInfo: {
            ...state.charaInfo,
            [charaName]: newCharaInfo,
          },
          timeestamp: Date.now(),
        };
      }),
    charaMemo: (payload: CharaMemoPayload) =>
      set((state) => {
        if (!state || !state.charaInfo || typeof state.dirty === "undefined")
          return {};
        const { charaName, memo } = payload;
        const charaInfo = state.charaInfo[charaName];
        const newCharaInfo = {
          ...charaInfo,
          memo: [charaInfo.memo[0], memo] as [number, string],
        };
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          charaInfo: {
            ...state.charaInfo,
            [charaName]: newCharaInfo,
          },
          timeestamp: Date.now(),
        };
      }),
    boardFinderToggleExcludeUnowned: () =>
      set((state) => {
        if (
          !state ||
          !state.boardFindOption ||
          typeof state.dirty === "undefined"
        )
          return {};
        const excludeUnowned = 1 - state.boardFindOption.x[0];
        return {
          boardFindOption: {
            ...state.boardFindOption,
            x: [excludeUnowned, state.boardFindOption.x[1]],
          },
          dirty: ((state.dirty + 1) % 32768) + 65536,
          timeestamp: Date.now(),
        };
      }),
    boardFinderToggleExcludeOpened: () =>
      set((state) => {
        if (
          !state ||
          !state.boardFindOption ||
          typeof state.dirty === "undefined"
        )
          return {};
        const excludeOpened = 1 - state.boardFindOption.x[1];
        return {
          boardFindOption: {
            ...state.boardFindOption,
            x: [state.boardFindOption.x[0], excludeOpened],
          },
          dirty: ((state.dirty + 1) % 32768) + 65536,
          timeestamp: Date.now(),
        };
      }),
    boardFinderToggleIncludePrevious: () =>
      set((state) => {
        if (
          !state ||
          !state.boardFindOption ||
          typeof state.dirty === "undefined"
        )
          return {};
        const includePrevious = 1 - state.boardFindOption.n[1];
        return {
          boardFindOption: {
            ...state.boardFindOption,
            n: [state.boardFindOption.n[0], includePrevious],
          },
          dirty: ((state.dirty + 1) % 32768) + 65536,
          timeestamp: Date.now(),
        };
      }),
    boardFinderSetTargetNthBoard: (payload: number) => set((state)=>{
      if (
        !state ||
        !state.boardFindOption ||
        typeof state.dirty === "undefined"
      )
        return {};
      return {
        boardFindOption: {
          ...state.boardFindOption,
          n: [payload, state.boardFindOption.n[1]],
        },
        dirty: ((state.dirty + 1) % 32768) + 65536,
        timeestamp: Date.now(),
      };
    }),
    boardFinderRotateBoardPriority: (payload: number) =>
      set((state) => {
        if (
          !state ||
          !state.boardFindOption ||
          typeof state.dirty === "undefined"
        )
          return {};
        return {
          boardFindOption: {
            ...state.boardFindOption,
            b: {
              ...state.boardFindOption.b,
              [payload]: (state.boardFindOption.b[payload] + 1) % 3,
            },
          },
          dirty: ((state.dirty + 1) % 32768) + 65536,
          timeestamp: Date.now(),
        };
      }),
    boardFinderSetMinimumMatchCount: (payload: number) =>
      set((state) => {
        if (
          !state ||
          !state.boardFindOption ||
          typeof state.dirty === "undefined"
        )
          return {};
        if (payload < 1) return {};
        return {
          boardFindOption: {
            ...state.boardFindOption,
            m: payload,
          },
          dirty: ((state.dirty + 1) % 32768) + 65536,
          timeestamp: Date.now(),
        };
      }),
    petOwnClick: (payload: string) =>
      set((state) => {
        if (
          !state ||
          !state.dispatchablePets ||
          typeof state.dirty === "undefined"
        )
          return {};
        const newDispatchablePets = state.dispatchablePets.o.includes(payload)
          ? state.dispatchablePets.o.filter((v) => v !== payload)
          : [...state.dispatchablePets.o, payload];
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          dispatchablePets: {
            ...state.dispatchablePets,
            o: newDispatchablePets,
          },
          timeestamp: Date.now(),
        };
      }),
    petOwnAll: () =>
      set((state) => {
        if (
          !state ||
          !state.dispatchablePets ||
          typeof state.dirty === "undefined"
        )
          return {};
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          dispatchablePets: {
            ...state.dispatchablePets,
            o: Object.keys(pet.p),
          },
          timeestamp: Date.now(),
        };
      }),
    petOwnNone: () =>
      set((state) => {
        if (
          !state ||
          !state.dispatchablePets ||
          typeof state.dirty === "undefined"
        )
          return {};
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          dispatchablePets: { ...state.dispatchablePets, o: [] },
          timeestamp: Date.now(),
        };
      }),
    petBorrowableValueUp: (payload: string) =>
      set((state) => {
        if (
          !state ||
          !state.dispatchablePets ||
          typeof state.dirty === "undefined"
        )
          return {};
        const prevBorrowable = state.dispatchablePets.b[payload] || 0;
        const borrowableTotal = Object.values(state.dispatchablePets.b).reduce(
          (a, b) => a + b,
          0
        );
        if (borrowableTotal > 18) return {};
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          dispatchablePets: {
            ...state.dispatchablePets,
            b: { ...state.dispatchablePets.b, [payload]: prevBorrowable + 1 },
          },
          timeestamp: Date.now(),
        };
      }),
    petBorrowableValueDown: (payload: string) =>
      set((state) => {
        if (
          !state ||
          !state.dispatchablePets ||
          typeof state.dirty === "undefined"
        )
          return {};
        const prevBorrowable = state.dispatchablePets.b[payload];
        if (prevBorrowable < 1) return {};
        const borrowableTotal = Object.values(state.dispatchablePets.b).reduce(
          (a, b) => a + b,
          0
        );
        if (borrowableTotal < 1) return {};
        return {
          dirty: ((state.dirty + 1) % 32768) + 65536,
          dispatchablePets: {
            ...state.dispatchablePets,
            b: { ...state.dispatchablePets.b, [payload]: prevBorrowable - 1 },
          },
          timeestamp: Date.now(),
        };
      }),
    setToken: (payload: string) =>
      set({ token: payload, googleLinked: true, syncStatus: SyncStatus.Idle }),
    clearToken: () =>
      set({
        token: undefined,
        googleLinked: false,
        syncStatus: SyncStatus.NotLinked,
      }),
    setSyncStatus: (payload: SyncStatus) => set({ syncStatus: payload }),
    setStatusToIdleIfSuccess: () =>
      set((state) =>
        state.syncStatus === SyncStatus.Success
          ? { syncStatus: SyncStatus.Idle }
          : {}
      ),
    setApiErrorLocalize: (payload: string) =>
      set({ apiErrorLocalize: payload }),
    clearApiErrorLocalize: () => set({ apiErrorLocalize: undefined }),
  },
}));

export const useUserDataStatus = () => useUserDataMemoryStore((s) => s.status);
export const useUserToken = () => useUserDataMemoryStore((s) => s.token);
export const useUserGoogleLinked = () =>
  useUserDataMemoryStore((s) => s.googleLinked);
export const useUserSyncStatus = () =>
  useUserDataMemoryStore((s) => s.syncStatus);
export const useUserDataError = () => useUserDataMemoryStore((s) => s.error);
export const useUserDataUsingIDB = () =>
  useUserDataMemoryStore((s) => s.usingIDB);
export const useUserDataActions = () =>
  useUserDataMemoryStore((s) => s.actions);
export const useUserDataBoard = () => useUserDataMemoryStore((s) => s.board);
export const useUserDataPboard = () => useUserDataMemoryStore((s) => s.pboard);
export const useUserDataEqrank = () => useUserDataMemoryStore((s) => s.eqrank);
export const useUserDataUnowned = () =>
  useUserDataMemoryStore((s) => s.unowned);
export const useUserDataLab = () => useUserDataMemoryStore((s) => s.lab);
export const useUserDataMyhome = () => useUserDataMemoryStore((s) => s.myhome);
export const useUserDataCollection = () =>
  useUserDataMemoryStore((s) => s.collection);
export const useUserDataCharaInfo = () =>
  useUserDataMemoryStore((s) => s.charaInfo);
export const useUserDataBoardFindOption = () =>
  useUserDataMemoryStore((s) => s.boardFindOption);
export const useUserDataDispatchablePets = () =>
  useUserDataMemoryStore((s) => s.dispatchablePets);
export const useUserDataTimestamp = () =>
  useUserDataMemoryStore((s) => s.timestamp);
export const useUserDataDirty = () => useUserDataMemoryStore((s) => s.dirty);
export const useUserDataSyncApiError = () =>
  useUserDataMemoryStore((s) => s.apiErrorLocalize);

const getStatisticsCore = (s: Partial<Pick<UserDataMemory, "charaInfo">>) => {
  if (!s.charaInfo) return { crayon: -1, rank: -1, pcrayon: -1 };
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
};
export const useUserDataStatistics = () => {
  const charaInfo = useUserDataMemoryStore((s) => s.charaInfo);
  return useMemo(() => getStatisticsCore({ charaInfo }), [charaInfo]);
};
const getStatPercentsCore = (s: Partial<Pick<UserDataMemory, "charaInfo">>) => {
  if (!s.charaInfo) return {};
  const boardStats: Record<string, number> = {};
  const boardData = Object.fromEntries(
    (
      Object.entries(s.charaInfo).filter(([, v]) => !v.unowned) as [
        string,
        UserDataOwnedCharaInfo
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
                boardStats[statType] = (boardStats[statType] ?? 0) + statValue;
              });
            }
          });
      });
    });
  });
  return boardStats;
};
export const useUserDataStatPercents = () => {
  const charaInfo = useUserDataMemoryStore((s) => s.charaInfo);
  return useMemo(() => getStatPercentsCore({ charaInfo }), [charaInfo]);
};

export const useSaveUserData = () => {
  const status = useUserDataMemoryStore((s) => s.status);
  const board = useUserDataMemoryStore((s) => s.board);
  const pboard = useUserDataMemoryStore((s) => s.pboard);
  const eqrank = useUserDataMemoryStore((s) => s.eqrank);
  const unowned = useUserDataMemoryStore((s) => s.unowned);
  const lab = useUserDataMemoryStore((s) => s.lab);
  const myhome = useUserDataMemoryStore((s) => s.myhome);
  const collection = useUserDataMemoryStore((s) => s.collection);
  const charaInfo = useUserDataMemoryStore((s) => s.charaInfo);
  const boardFindOption = useUserDataMemoryStore((s) => s.boardFindOption);
  const dispatchablePets = useUserDataMemoryStore((s) => s.dispatchablePets);
  const usingIDB = useUserDataMemoryStore((s) => s.usingIDB);
  const clean = useUserDataMemoryStore((s) => s.actions.clean);
  const setTimestamp = useUserDataMemoryStore((s) => s.actions.setTimestamp);
  const timestamp = Date.now();
  if (
    status !== "initialized" ||
    !board ||
    !pboard ||
    !eqrank ||
    !unowned ||
    !lab ||
    !myhome ||
    !collection ||
    !charaInfo ||
    !boardFindOption ||
    !dispatchablePets ||
    !usingIDB
  )
    return;
  const savableData = {
    board,
    pboard,
    eqrank,
    unowned,
    lab,
    myhome,
    collection,
    charaInfo,
    boardFindOption,
    dispatchablePets,
    dirty: 0,
    timestamp,
  };
  return async () => {
    await writeFromMemory(savableData, usingIDB, timestamp);
    setTimestamp(timestamp);
    clean();
  };
};
