import { useTranslation } from "react-i18next";
import { Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { BoardType } from "@/types/enums";

interface IBoardViewerProps {
  name: string;
  index: number;
  board: string;
  search: number[];
  unlocked: boolean;
  skin: number;
}

const BoardViewer = ({
  name,
  index,
  board,
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
      <div className="px-4 pt-6 pb-2 flex flex-row justify-center h-12 my-2">
        {board.split("").map((b, i) => {
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
        })}
      </div>
    </Card>
  );
};

export default BoardViewer;
