import { memo, Suspense, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { BoardInfoDialogTrigger } from "./board-info-dialog";
import type { BoardInfoDialogProps } from "./board-info-dialog";
import { Race } from "@/types/enums";

// af
import { useIsAFActive } from "@/stores/useAFDataStore";
import { getCharaImageUrl } from "@/utils/getImageUrl";

interface BoardCharaSlotProps {
  name: string;
  charaTypes: string;
  eldainFlag?: number;
  boardTypeString: string;
  boardIndex: number;
  boardShape: number;
  ldx: number;
  bdx: number;
  blocked?: string;
  boardPosition: number;
  bgClassName: string;
  imgClassName: string;
  enableDialog: boolean;
  boardClick: (arg: {
    charaName: string;
    boardIndex: number;
    ldx: number;
    bdx: number;
  }) => void;
  skin?: number;
  unlockedBoard: number;
  changeBoardIndex: (payload: {
    charaName: string;
    boardIndex: number;
  }) => void;
  setBoardDialogProp: (
    prop: Omit<BoardInfoDialogProps, "onOpenChange" | "opened"> | undefined
  ) => void;
  setBoardDialogOpened: (arg: boolean) => void;
  checked: boolean;
  unowned: boolean;
  getFromRouteMap: (key: string) => string | number | string[] | undefined;
  getFromBoardMap: (key: string) => string[] | undefined;
  clf?: number | false;
}
const BoardCharaSlot = ({
  name,
  charaTypes, // chara[name].t
  eldainFlag, // chara[name].e
  boardTypeString,
  boardIndex,
  boardShape,
  ldx,
  bdx,
  blocked,
  boardPosition, // Number(board.c[name].r[boardIndex][ldx].split(".")[bdx])
  bgClassName,
  imgClassName,
  enableDialog,
  boardClick,
  skin,
  unlockedBoard,
  changeBoardIndex,
  setBoardDialogProp,
  setBoardDialogOpened,
  checked,
  unowned,
  getFromRouteMap,
  getFromBoardMap,
  clf,
}: BoardCharaSlotProps) => {
  const isAF = useIsAFActive();
  const boardClickArg = useMemo(
    () => ({
      charaName: name,
      boardIndex,
      ldx,
      bdx,
    }),
    [bdx, boardIndex, ldx, name]
  );
  const boardClickAction = useCallback(
    () => boardClick(boardClickArg),
    [boardClick, boardClickArg]
  );
  const changeBoardIndexInner = useCallback(
    (i: number) => {
      if (!unowned)
        changeBoardIndex({
          charaName: name,
          boardIndex: i,
        });
    },
    [changeBoardIndex, name, unowned]
  );
  const charaRace = useMemo(
    () => Race[Number(charaTypes.charAt(5))],
    [charaTypes]
  );
  const triggerRoute = useMemo(
    () =>
      getFromRouteMap(
        `r.${charaRace}.${boardIndex}.b.${boardPosition}`
      ) as string,
    [boardIndex, boardPosition, charaRace, getFromRouteMap]
  );
  const dialogBoardShape = useMemo(
    () =>
      getFromRouteMap(`s.${charaRace}.${boardIndex}.b.${boardShape}`) as string,
    [boardIndex, boardShape, charaRace, getFromRouteMap]
  );
  const dialogRouteStart = useMemo(
    () => getFromRouteMap(`r.${charaRace}.${boardIndex}.s`) as number,
    [boardIndex, charaRace, getFromRouteMap]
  );
  const otherBoards = useMemo(
    () => getFromBoardMap(`${name}.otherBoards`) as string[],
    [getFromBoardMap, name]
  );
  const otherRoutes = useMemo(
    () => getFromBoardMap(`${name}.otherRoutes.${boardIndex}`) as string[],
    [boardIndex, getFromBoardMap, name]
  );
  const boardDialogProp = useMemo(
    () => ({
      boardIndex,
      boardShape: dialogBoardShape,
      boardTypeString,
      chara: name,
      charaTypes,
      route: triggerRoute,
      rstart: dialogRouteStart,
      otherBoards,
      otherRoutes,
      blocked,
      checked,
      unowned,
      eldain: eldainFlag,
      skin: skin || 0,
      unlockedBoard,
      changeBoardIndex: changeBoardIndexInner,
    }),
    [
      blocked,
      boardIndex,
      boardTypeString,
      changeBoardIndexInner,
      charaTypes,
      checked,
      dialogBoardShape,
      dialogRouteStart,
      eldainFlag,
      name,
      otherBoards,
      otherRoutes,
      skin,
      triggerRoute,
      unlockedBoard,
      unowned,
    ]
  );
  return (
    <div
      key={`${name}${ldx}${bdx}`}
      className="sm:min-w-14 sm:min-h-14 md:min-w-16 md:min-h-16 max-w-24 relative aspect-square"
    >
      <div
        className={cn(
          "min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 max-w-24 aspect-square overflow-hidden",
          bgClassName
        )}
      >
        <img
          src={getCharaImageUrl(skin ? `${name}Skin${skin}` : `${name}`,isAF&&'af')}
          className={cn("aspect-square w-full", imgClassName, isAF&&'scale-125')}
          onClick={boardClickAction}
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
              route={triggerRoute}
              onClick={() => {
                setBoardDialogProp(boardDialogProp);
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
            boardClick({
              charaName: name,
              boardIndex: boardIndex,
              ldx,
              bdx,
            })
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
            boardClick({
              charaName: name,
              boardIndex: boardIndex,
              ldx,
              bdx,
            })
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
      {!unowned && !checked && unlockedBoard > boardIndex && (
        <div className="absolute right-0.5 bottom-0.5 flex flex-row p-px w-3 h-3">
          <div
            className={cn(
              "flex-1 rounded-full aspect-square border border-slate-100 ring-1 ring-slate-900",
              [
                "bg-transparent",
                "bg-slate-400",
                "bg-emerald-500",
                "bg-amber-400",
              ][unlockedBoard]
            )}
          />
        </div>
      )}
    </div>
  );
};

export default memo(BoardCharaSlot);
