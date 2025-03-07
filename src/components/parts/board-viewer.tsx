import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { BoardType } from "@/types/enums";

interface IBoardViewerProps {
  name: string;
  index: number;
  board: number[];
  blockedBy: string[];
  search: number[];
  unlocked: boolean;
  skin: number;
}

const BoardViewer = ({
  name,
  index,
  board,
  blockedBy,
  search,
  unlocked,
  skin,
}: IBoardViewerProps) => {
  const { t } = useTranslation();
  return (
    <Card className="p-4">
      <div className="flex flex-row gap-2.5 items-center">
        <img
          className="w-12 h-12 aspect-square"
          src={skin ? `/charas/${name}Skin${skin}.png` : `/charas/${name}.png`}
        />
        <div>
          <div className="text-left text-sm">
            <img
              src={`/icons/RecordReward_Tab_${
                ["Easy", "Herd", "VeryHard"][index - 1]
              }Lv.png`}
              className="mr-1 w-[1.2rem] inline-flex bg-greenicon rounded-full align-middle"
            />
            {t(`ui.board.board${index}`)}
            <Dot className="w-4 h-4 inline-block align-middle" />
            {t(`ui.boardsearch.matchCount`, {
              0: `${
                board
                  .map((b) => b.toString())
                  .join("")
                  .split("")
                  .map((b) => Number(b))
                  .filter((b) => search.includes(b)).length
              }`,
            })}
            <Dot className="w-4 h-4 inline-block align-middle" />
            {unlocked ? (
              <span className="text-green-600 dark:text-green-400">
                {t("ui.boardsearch.unlocked")}
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                {t("ui.boardsearch.locked")}
              </span>
            )}
          </div>
          <div className="text-left text-2xl flex items-center">
            {t(`chara.${name}`)}
          </div>
        </div>
      </div>
      <div className="px-4 pt-8 pb-4 flex flex-row justify-center h-16">
        {board.map((lb) => {
          return lb
            .toString()
            .split("")
            .map((b, i) => {
              const bt = BoardType[Number(b)];
              return (
                <div className="w-1/6 max-w-12 relative" key={i}>
                  <div className="absolute w-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img
                      src={`/boards/Tile_${bt}On.png`}
                      className={cn(
                        "bg-board-special w-12 h-12 rotate-10 inline-block align-middle aspect-square bg-cover dark:brightness-80 dark:contrast-125",
                        search.includes(Number(b))
                          ? "drop-shadow-[0px_0_8px_#d97706] dark:drop-shadow-[0px_0_8px_#fbbf24]"
                          : "brightness-90"
                      )}
                    />
                  </div>
                </div>
              );
            });
        })}
      </div>
      <div>
        {board.length > 1 &&
          board[1]
            .toString()
            .split("")
            .map((v, i) => {
              const thisBoard = Number(v);
              if (!search.includes(thisBoard)) return null;
              const currentBlockedBy = blockedBy?.[0]?.split(".")?.[i];
              if (!currentBlockedBy) return null;
              return (
                <div key={i} className="py-1.5 flex first-of-type:mt-4 border-t">
                  <img
                    src="/icons/TutorialPopupLock01.png"
                    className="w-7 h-7 my-0.5 mr-1.5"
                  />
                  <img
                    src={`/boards/Tile_${BoardType[thisBoard]}On.png`}
                    className={cn(
                      "bg-board-special w-8 h-8 rotate-10 align-middle aspect-square bg-cover dark:brightness-80 dark:contrast-125"
                    )}
                  />
                  <img
                    src="/common/Icon_Arrow.png"
                    className="h-5 aspect-[8/7] mx-2.5 my-1"
                  />
                  <div className="flex flex-wrap">
                    {currentBlockedBy.split("").map((bb, k) => {
                      const thisBlock = Number(bb);
                      return (
                        <Fragment key={`${bb}-${k}`}>
                          <img
                            src={`/boards/Tile_${BoardType[thisBlock]}On.png`}
                            className={cn(
                              "bg-board-special w-8 h-8 rotate-10 align-middle aspect-square bg-cover dark:brightness-80 dark:contrast-125"
                            )}
                          />
                          {currentBlockedBy.length - 1 > k && (
                            <Dot strokeWidth={2.5} className="w-6 h-6 -mx-1 my-1" />
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        {board.length > 2 &&
          board[2]
            .toString()
            .split("")
            .map((v, i) => {
              const thisBoard = Number(v);
              if (!search.includes(thisBoard)) return null;
              const currentBlockedBy = blockedBy?.[1]?.split(".")?.[i];
              if (!currentBlockedBy) return null;
              const currentBlockedByArray = Array(currentBlockedBy.length / 2)
                .fill(0)
                .map((_, k) => currentBlockedBy.slice(k * 2, k * 2 + 2));
              return (
                <div key={i} className="py-1.5 flex first-of-type:mt-4 border-t">
                  <img
                    src="/icons/TutorialPopupLock01.png"
                    className="w-7 h-7 my-0.5 mr-1.5"
                  />
                  <img
                    src={`/boards/Tile_${BoardType[thisBoard]}On.png`}
                    className={cn(
                      "bg-board-special w-8 h-8 rotate-10 align-middle aspect-square bg-cover dark:brightness-80 dark:contrast-125"
                    )}
                  />
                  <img
                    src="/common/Icon_Arrow.png"
                    className="h-5 aspect-[8/7] mx-2.5 my-1"
                  />
                  <div className="flex flex-wrap">
                    {currentBlockedByArray.map((bb, k) => {
                      const thisBlock1 = Number(bb.charAt(0));
                      const thisBlock2 = Number(bb.charAt(1));
                      return (
                        <Fragment key={`${bb}-${k}`}>
                          <div className="flex">
                            <img
                              src={`/boards/Tile_${BoardType[thisBlock1]}On.png`}
                              className={cn(
                                "bg-board-special w-8 h-8 rotate-10 align-middle aspect-square bg-cover dark:brightness-80 dark:contrast-125"
                              )}
                            />
                            <img
                              src={`/boards/Tile_${BoardType[thisBlock2]}On.png`}
                              className={cn(
                                "bg-board-special w-8 h-8 rotate-10 align-middle aspect-square bg-cover dark:brightness-80 dark:contrast-125 -ml-2"
                              )}
                            />
                          </div>
                          {currentBlockedByArray.length - 1 > k && (
                            <Dot strokeWidth={2.5} className="w-6 h-6 -mx-1 my-1" />
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
      </div>
    </Card>
  );
};

export default BoardViewer;
