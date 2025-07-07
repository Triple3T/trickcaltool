import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import SubtitleBar from "./subtitlebar";
import purpleposition from "@/data/purpleposition";
import asideSelectorClassNames from "@/utils/asideSelectorClassNames";
import { BoardType, PurpleBoardType, Race, StatType } from "@/types/enums";

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
  charaDefaultStar: number;
  maxAside: number;
  charaRace: number;
  personalityClassName: string;
  skin?: number;
  openBoardIndex: number;
  gradeData: number[];
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
  dispatchStarGradeData: (charaName: string, grade: number) => void;
  dispatchAsideGradeData: (charaName: string, grade: number) => void;
  board: number[][];
  pboard: number[][];
  aside3stat: number[][];
}

const PurpleBoardCard = ({
  name,
  currentBoard,
  currentPurpleBoard,
  // charaPersonality,
  charaDefaultStar,
  maxAside,
  charaRace,
  personalityClassName,
  skin,
  openBoardIndex,
  gradeData,
  dispatchClickBoardData,
  dispatchClickPurpleBoardData,
  dispatchNthBoardData,
  dispatchStarGradeData,
  dispatchAsideGradeData,
  board,
  pboard,
  aside3stat,
}: PurpleBoardCardProps) => {
  const isAF = useIsAFActive();
  const { t } = useTranslation();
  return (
    <Card className="p-4 object-cover max-w-full break-inside-avoid">
      {/* title bar */}
      <div className="flex gap-4 items-center flex-wrap">
        <div
          className="sm:min-w-10 sm:min-h-10 md:min-w-12 md:min-h-12 max-w-16 relative aspect-square"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className={cn(
              "min-w-10 min-h-10 sm:min-w-12 sm:min-h-12 max-w-14 aspect-square overflow-hidden rounded",
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
          {maxAside > 0 && gradeData[2] > 0 && (
            <img
              src={`/asideicons/AsideIcon_${name}.png`}
              className="absolute top-[40%] -translate-y-1/2 right-0 translate-x-[36%] w-[80%] drop-shadow-[0_0_4px_white]"
            />
          )}
        </div>
        <div className="flex-initial flex-shrink-0 flex flex-col items-start">
          <div className="text-sm">
            <span className="align-middle">
              {t(`ui.board.viewTargetBoardShort`)}
            </span>
          </div>
          <div className="text-2xl">{t(`chara.${name}`)}</div>
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-2">
        <div className="w-max">{t("ui.common.board")}</div>
        <div className="flex flex-row rounded overflow-hidden text-xs flex-1 gap-px">
          <div
            className={cn(
              openBoardIndex > 0
                ? "bg-slate-300 dark:bg-slate-500 text-foreground"
                : "bg-slate-300/50 dark:bg-slate-500/50 text-foreground/40",
              "flex-1 flex justify-center items-center cursor-pointer"
            )}
            onClick={() => dispatchNthBoardData(name, 1)}
          >
            {t("ui.board.nthBoardOpened", { 0: "1" })}
          </div>
          <div
            className={cn(
              openBoardIndex > 1
                ? "bg-emerald-400 dark:bg-emerald-700 text-foreground"
                : "bg-emerald-400/50 dark:bg-emerald-700/50 text-foreground/40",
              "flex-1 flex justify-center items-center cursor-pointer"
            )}
            onClick={() => dispatchNthBoardData(name, 2)}
          >
            {t("ui.board.nthBoardOpened", { 0: "2" })}
          </div>
          <div
            className={cn(
              openBoardIndex > 2
                ? "bg-amber-300 dark:bg-amber-700 text-foreground"
                : "bg-amber-300/50 dark:bg-amber-800/50 text-foreground/40",
              "flex-1 flex justify-center items-center cursor-pointer"
            )}
            onClick={() => dispatchNthBoardData(name, 3)}
          >
            {t("ui.board.nthBoardOpened", { 0: "3" })}
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-2 items-center">
        <div className="w-max">{t("ui.common.grade")}</div>
        <div className="flex flex-col rounded overflow-hidden text-xs flex-1 gap-px h-[41px] items-stretch">
          <div className="flex flex-row gap-px flex-1">
            <div
              className={cn(
                asideSelectorClassNames[charaDefaultStar][0][
                  gradeData[1] > 0 ? 0 : 1
                ],
                charaDefaultStar > 1 ? "cursor-not-allowed" : "cursor-pointer",
                "flex-1 flex justify-center items-center"
              )}
              onClick={() => dispatchStarGradeData(name, 1)}
            >
              {t("ui.common.starGradeN", { 0: "1" })}
            </div>
            <div
              className={cn(
                asideSelectorClassNames[charaDefaultStar][1][
                  gradeData[1] > 1 ? 0 : 1
                ],
                charaDefaultStar > 2 ? "cursor-not-allowed" : "cursor-pointer",
                "flex-1 flex justify-center items-center"
              )}
              onClick={() => dispatchStarGradeData(name, 2)}
            >
              {t("ui.common.starGradeN", { 0: "2" })}
            </div>
            <div
              className={cn(
                asideSelectorClassNames[charaDefaultStar][2][
                  gradeData[1] > 2 ? 0 : 1
                ],
                charaDefaultStar > 3 ? "cursor-not-allowed" : "cursor-pointer",
                "flex-1 flex justify-center items-center"
              )}
              onClick={() => dispatchStarGradeData(name, 3)}
            >
              {t("ui.common.starGradeN", { 0: "3" })}
            </div>
            <div
              className={cn(
                asideSelectorClassNames[charaDefaultStar][3][
                  gradeData[1] > 3 ? 0 : 1
                ],
                charaDefaultStar > 4 ? "cursor-not-allowed" : "cursor-pointer",
                "flex-1 flex justify-center items-center"
              )}
              onClick={() => dispatchStarGradeData(name, 4)}
            >
              {t("ui.common.starGradeN", { 0: "4" })}
            </div>
            <div
              className={cn(
                asideSelectorClassNames[charaDefaultStar][4][
                  gradeData[1] > 4 ? 0 : 1
                ],
                charaDefaultStar > 5 ? "cursor-not-allowed" : "cursor-pointer",
                "flex-1 flex justify-center items-center"
              )}
              onClick={() => {
                dispatchStarGradeData(name, 5);
                dispatchAsideGradeData(name, 0);
              }}
            >
              {t("ui.common.starGradeN", { 0: "5" })}
            </div>
          </div>
          <div className="flex flex-row gap-px flex-1">
            <div
              className={cn(
                asideSelectorClassNames[charaDefaultStar][5][
                  gradeData[2] > 0 ? 0 : 1
                ],
                maxAside < 1
                  ? "cursor-not-allowed brightness-50"
                  : "cursor-pointer",
                "flex-1 flex justify-center items-center"
              )}
              onClick={() => {
                dispatchStarGradeData(name, 5);
                dispatchAsideGradeData(name, 1);
              }}
            >
              {t("ui.common.asideGradeN", { 0: "1" })}
            </div>
            <div
              className={cn(
                asideSelectorClassNames[charaDefaultStar][6][
                  gradeData[2] > 1 ? 0 : 1
                ],
                maxAside < 2
                  ? "cursor-not-allowed brightness-50"
                  : "cursor-pointer",
                "flex-1 flex justify-center items-center"
              )}
              onClick={() => dispatchAsideGradeData(name, 2)}
            >
              {t("ui.common.asideGradeN", { 0: "2" })}
            </div>
            <div
              className={cn(
                asideSelectorClassNames[charaDefaultStar][7][
                  gradeData[2] > 2 ? 0 : 1
                ],
                maxAside < 3
                  ? "cursor-not-allowed brightness-50"
                  : "cursor-pointer",
                "flex-1 flex justify-center items-center"
              )}
              onClick={() => dispatchAsideGradeData(name, 3)}
            >
              {t("ui.common.asideGradeN", { 0: "3" })}
            </div>
          </div>
        </div>
      </div>
      <div className={cn("flex flex-row gap-2 mt-2 justify-between text-sm")}>
        <div className="w-max">{t("ui.common.allApplyStat")}</div>
        <div
          className={cn(
            "flex flex-row gap-2",
            gradeData[2] < 3 && "brightness-75 opacity-75"
          )}
        >
          {aside3stat.map(([stat, value]) => {
            if (!value) return null;
            const targetStat = stat % 10000;
            const targetStatString = StatType[targetStat];
            const isPercent = stat > 9999;
            return (
              <div key={stat}>
                <img
                  src={`/icons/Icon_${targetStatString}.png`}
                  className="inline-block w-4 h-4 mr-1"
                />
                +{isPercent ? `${value / 100}%` : `${value}`}
              </div>
            );
          })}
          {aside3stat.length === 0 && "-"}
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
