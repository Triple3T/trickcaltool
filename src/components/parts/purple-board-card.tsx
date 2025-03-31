import { Fragment } from "react";
import { t } from "i18next";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import SubtitleBar from "./subtitlebar";
import purpleposition from "@/data/purpleposition";
import { Race, PurpleBoardType, BoardType } from "@/types/enums";

// af
import { useIsAFActive } from "@/stores/useAFDataStore";
import { getCharaImageUrl } from "@/utils/getImageUrl";

const purpleBoardDefaultLength = [4, 8, 12];

interface PurpleBoardCardProps {
  name: string;
  currentBoard: number[][];
  currentPurpleBoard: {
    b: number[];
    p: string[];
  };
  // charaPersonality: number;
  charaRace: number;
  personalityClassName: string;
  skin?: number;
  openBoardIndex: number;
  dispatchClickBoardData: (
    charaName: string,
    boardIndex: number,
    ldx: number,
    bdx: number
  ) => void;
  dispatchClickPurpleBoardData: (
    charaName: string,
    boardIndex: number,
    ldx: number,
    bdx: number
  ) => void;
  dispatchNthBoardData: (charaName: string, index: number) => void;
  board: number[][];
  pboard: number[][];
}

const PurpleBoardCard = ({
  name,
  currentBoard,
  currentPurpleBoard,
  // charaPersonality,
  charaRace,
  personalityClassName,
  skin,
  openBoardIndex,
  dispatchClickBoardData,
  dispatchClickPurpleBoardData,
  dispatchNthBoardData,
  board,
  pboard,
}: PurpleBoardCardProps) => {
  const isAF = useIsAFActive();
  return (
    <Card className="p-4 object-cover max-w-full break-inside-avoid">
      {/* title bar */}
      <div className="flex gap-2 items-center flex-wrap">
        <div
          className="sm:min-w-10 sm:min-h-10 md:min-w-12 md:min-h-12 max-w-16 relative aspect-square"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className={cn(
              "min-w-10 min-h-10 sm:min-w-12 sm:min-h-12 max-w-14 aspect-square overflow-hidden",
              personalityClassName
            )}
          >
            <img
              src={getCharaImageUrl(
                skin ? `${name}Skin${skin}` : `${name}`,
                isAF && "af"
              )}
              className={cn("aspect-square w-full", isAF && "scale-125")}
            />
          </div>
          <div className="absolute right-0.5 bottom-0.5 flex flex-row p-px w-3 h-3">
            <div
              className={cn(
                "flex-1 rounded-full aspect-square border border-slate-900 ring-1 ring-slate-100",
                [
                  "bg-transparent",
                  "bg-slate-400",
                  "bg-emerald-500",
                  "bg-amber-400",
                ][openBoardIndex]
              )}
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
        <div className="flex-[1_0_4.5rem] w-18">
          <div className="flex flex-wrap justify-end gap-x-4 gap-y-2 p-1">
            <div className="text-left flex items-center gap-2">
              <Checkbox
                id={`2ndboard-${name}`}
                checked={openBoardIndex > 1}
                onCheckedChange={(c) => {
                  dispatchNthBoardData(name, c ? 2 : 1);
                }}
              />
              <Label htmlFor={`2ndboard-${name}`}>
                {t("ui.board.nthBoardOpened", { 0: "2" })}
              </Label>
            </div>
            <div className="text-left flex items-center gap-2">
              <Checkbox
                id={`3rdboard-${name}`}
                checked={openBoardIndex > 2}
                onCheckedChange={(c) => {
                  dispatchNthBoardData(name, c ? 3 : 2);
                }}
              />
              <Label htmlFor={`3rdboard-${name}`}>
                {t("ui.board.nthBoardOpened", { 0: "3" })}
              </Label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2">
          <div className="flex-[1] -mx-2">
            <SubtitleBar>
              <div>{t("ui.board.board1")}</div>
            </SubtitleBar>
            <div className="flex flex-row flex-wrap py-1 px-2 w-full justify-center">
              {currentBoard[0].map((boardLockCollection, ldx) => {
                return (
                  <Fragment key={ldx}>
                    {boardLockCollection
                      .toString(10)
                      .split("")
                      .map((boardString, bdx) => {
                        const boardType = BoardType[Number(boardString)];
                        const checked = board[0][ldx] & (1 << bdx);
                        return (
                          <div
                            key={`${ldx}-${bdx}`}
                            className="w-1/2 aspect-square p-px"
                          >
                            <div
                              className={cn(
                                "flex aspect-square bg-cover",
                                checked
                                  ? "bg-board-special"
                                  : "bg-board-special-disabled"
                              )}
                            >
                              <img
                                src={`/boards/Tile_${boardType}${
                                  checked ? "On" : "Off"
                                }.png`}
                                className={cn(
                                  "w-full aspect-square bg-cover",
                                  checked ? "" : "brightness-[.15]"
                                )}
                                onClick={() => {
                                  dispatchClickBoardData(name, 0, ldx, bdx);
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </Fragment>
                );
              })}
            </div>
            <div className="flex flex-row flex-wrap py-1 px-2 w-full justify-center">
              {currentPurpleBoard.b[0]
                .toString(10)
                .split("")
                .map((pb, i) => {
                  const positionsIndex = Number(
                    currentPurpleBoard.p[0].split(".")[i]
                  );
                  const positionData = purpleposition.r[Race[charaRace]][0];
                  const positions = positionData.p[positionsIndex].split(".");
                  return [...positions].map((/*actualPos*/ _, posIndex) => {
                    const checked = pboard[0][i] & (1 << posIndex);
                    return (
                      <div
                        key={`${i}-${posIndex}`}
                        className="w-1/2 aspect-square p-px"
                      >
                        <img
                          src={`/boards/Tile_${
                            PurpleBoardType[parseInt(pb, 10)]
                          }${checked ? "On" : "Off"}.png`}
                          className={cn(
                            "w-full aspect-square bg-cover",
                            checked ? "bg-board-high" : "bg-board-high-disabled"
                          )}
                          onClick={() => {
                            dispatchClickPurpleBoardData(name, 0, posIndex, i);
                          }}
                        />
                      </div>
                    );
                  });
                })}
              {Array(
                purpleBoardDefaultLength[0] -
                  currentPurpleBoard.b[0]
                    .toString(10)
                    .split("")
                    .map(
                      (_, i) =>
                        purpleposition.r[Race[charaRace]][0].p[
                          Number(currentPurpleBoard.p[0].split(".")[i])
                        ].split(".").length
                    )
                    .reduce((a, b) => a + b, 0)
              )
                .fill(0)
                .map((_, i) => {
                  return (
                    <div
                      key={`empty-${i}`}
                      className="w-1/2 aspect-square p-px"
                    />
                  );
                })}
            </div>
          </div>
          <div className="flex-[2] -mx-2">
            <SubtitleBar>
              <div
                className={cn(
                  openBoardIndex < 2 ? "text-red-600 dark:text-red-400" : ""
                )}
              >
                {t("ui.board.board2")}
              </div>
            </SubtitleBar>
            <div className="flex flex-row flex-wrap py-1 px-4 w-full justify-center">
              {currentBoard[1].map((boardLockCollection, ldx) => {
                return (
                  <Fragment key={ldx}>
                    {boardLockCollection
                      .toString(10)
                      .split("")
                      .map((boardString, bdx) => {
                        const boardType = BoardType[Number(boardString)];
                        const checked = board[1][ldx] & (1 << bdx);
                        return (
                          <div
                            key={`${ldx}-${bdx}`}
                            className="w-1/4 aspect-square p-px"
                          >
                            <div
                              className={cn(
                                "flex aspect-square bg-cover",
                                checked
                                  ? "bg-board-special"
                                  : "bg-board-special-disabled"
                              )}
                            >
                              <img
                                src={`/boards/Tile_${boardType}${
                                  checked ? "On" : "Off"
                                }.png`}
                                className={cn(
                                  "w-full aspect-square bg-cover",
                                  checked ? "" : "brightness-[.15]"
                                )}
                                onClick={() => {
                                  dispatchClickBoardData(name, 1, ldx, bdx);
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </Fragment>
                );
              })}
            </div>
            <div className="flex flex-row flex-wrap py-1 px-4 w-full justify-center">
              {currentPurpleBoard.b[1]
                .toString(10)
                .split("")
                .map((pb, i) => {
                  const positionsIndex = Number(
                    currentPurpleBoard.p[1].split(".")[i]
                  );
                  const positionData = purpleposition.r[Race[charaRace]][1];
                  const positions = positionData.p[positionsIndex].split(".");
                  return [...positions].map((/*actualPos*/ _, posIndex) => {
                    const checked = pboard[1][i] & (1 << posIndex);
                    return (
                      <div
                        key={`${i}-${posIndex}`}
                        className="w-1/4 aspect-square p-px"
                      >
                        <img
                          src={`/boards/Tile_${
                            PurpleBoardType[parseInt(pb, 10)]
                          }${checked ? "On" : "Off"}.png`}
                          className={cn(
                            "w-full aspect-square bg-cover",
                            checked ? "bg-board-high" : "bg-board-high-disabled"
                          )}
                          onClick={() => {
                            dispatchClickPurpleBoardData(name, 1, posIndex, i);
                          }}
                        />
                      </div>
                    );
                  });
                })}
              {Array(
                purpleBoardDefaultLength[1] -
                  currentPurpleBoard.b[1]
                    .toString(10)
                    .split("")
                    .map(
                      (_, i) =>
                        purpleposition.r[Race[charaRace]][1].p[
                          Number(currentPurpleBoard.p[1].split(".")[i])
                        ].split(".").length
                    )
                    .reduce((a, b) => a + b, 0)
              )
                .fill(0)
                .map((_, i) => {
                  return (
                    <div
                      key={`empty-${i}`}
                      className="w-1/4 aspect-square p-px"
                    />
                  );
                })}
            </div>
          </div>
        </div>
        <div>
          <SubtitleBar>
            <div
              className={cn(
                openBoardIndex < 3 ? "text-red-600 dark:text-red-400" : ""
              )}
            >
              {t("ui.board.board3")}
            </div>
          </SubtitleBar>
          <div className="flex flex-row flex-wrap py-1 px-3 w-full justify-center">
            {currentBoard[2].map((boardLockCollection, ldx) => {
              return (
                <Fragment key={ldx}>
                  {boardLockCollection
                    .toString(10)
                    .split("")
                    .map((boardString, bdx) => {
                      const boardType = BoardType[Number(boardString)];
                      const checked = board[2][ldx] & (1 << bdx);
                      return (
                        <div
                          key={`${ldx}-${bdx}`}
                          className="w-1/6 aspect-square p-px"
                        >
                          <div
                            className={cn(
                              "flex aspect-square bg-cover",
                              checked
                                ? "bg-board-special"
                                : "bg-board-special-disabled"
                            )}
                          >
                            <img
                              src={`/boards/Tile_${boardType}${
                                checked ? "On" : "Off"
                              }.png`}
                              className={cn(
                                "w-full aspect-square bg-cover",
                                checked ? "" : "brightness-[.15]"
                              )}
                              onClick={() => {
                                dispatchClickBoardData(name, 2, ldx, bdx);
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </Fragment>
              );
            })}
          </div>
          <div className="flex flex-row flex-wrap py-1 px-3 w-full justify-center">
            {currentPurpleBoard.b[2]
              .toString(10)
              .split("")
              .map((pb, i) => {
                const positionsIndex = Number(
                  currentPurpleBoard.p[2].split(".")[i]
                );
                const positionData = purpleposition.r[Race[charaRace]][2];
                const positions = positionData.p[positionsIndex].split(".");
                return [...positions].map((/*actualPos*/ _, posIndex) => {
                  const checked = pboard[2][i] & (1 << posIndex);
                  return (
                    <div
                      key={`${i}-${posIndex}`}
                      className="w-1/6 aspect-square p-px"
                    >
                      <img
                        src={`/boards/Tile_${
                          PurpleBoardType[parseInt(pb, 10)]
                        }${checked ? "On" : "Off"}.png`}
                        className={cn(
                          "w-full aspect-square bg-cover",
                          checked ? "bg-board-high" : "bg-board-high-disabled"
                        )}
                        onClick={() => {
                          dispatchClickPurpleBoardData(name, 2, posIndex, i);
                        }}
                      />
                    </div>
                  );
                });
              })}
            {Array(
              purpleBoardDefaultLength[2] -
                currentPurpleBoard.b[2]
                  .toString(10)
                  .split("")
                  .map(
                    (_, i) =>
                      purpleposition.r[Race[charaRace]][2].p[
                        Number(currentPurpleBoard.p[2].split(".")[i])
                      ].split(".").length
                  )
                  .reduce((a, b) => a + b, 0)
            )
              .fill(0)
              .map((_, i) => {
                return (
                  <div
                    key={`empty-${i}`}
                    className="w-1/6 aspect-square p-px"
                  />
                );
              })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PurpleBoardCard;
