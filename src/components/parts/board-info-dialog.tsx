import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BoardType } from "@/types/enums";
import SubtitleBar from "./subtitlebar";

interface BoardInfoDialogProps {
  boardIndex: number;
  boardTypeString: string;
  chara: string;
  route: string;
  rstart: number;
  blocked?: string;
}

const BoardInfoDialog = ({
  boardIndex,
  boardTypeString,
  chara,
  route,
  rstart,
  blocked,
}: BoardInfoDialogProps) => {
  const { t } = useTranslation();
  const brLength = route.length;
  const brRowCount = Math.floor(brLength / 7);
  const brRows = Array(brRowCount)
    .fill(0)
    .map((_, i) => route.slice(i * 7, (i + 1) * 7));
  const crayon3Count = route.split("3").length - 1;
  const crayon4Count = route.split("4").length - 1;
  const blocking = blocked
    ? Array(blocked.length / crayon4Count)
        .fill(0)
        .map((_, i) => blocked.slice(i * crayon4Count, (i + 1) * crayon4Count))
    : [];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-4 flex relative">
          <div className="flex-1">
            {Array(crayon3Count + crayon4Count)
              .fill(0)
              .map((_, i) => {
                if (i < crayon4Count)
                  return (
                    <img
                      key={i}
                      src="/icons/Item_Crayon4.png"
                      alt="crayon4"
                      className="h-4 w-4 absolute"
                      style={{ top: "0", left: `${i / 2.15}rem` }}
                    />
                  );
                return (
                  <img
                    key={i}
                    src="/icons/Item_Crayon3.png"
                    alt="crayon3"
                    className="h-4 w-4 absolute"
                    style={{ top: "0", left: `${i / 2.15}rem` }}
                  />
                );
              })}
          </div>
          <div className="flex-0 aspect-square">
            <Info className="h-4 w-4" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="font-onemobile">
        <DialogHeader>
          <DialogTitle>
            <div className="flex gap-2 font-normal">
              <img src={`/charas/${chara}.png`} className="w-12 h-12" />
              <div className="flex-initial flex-shrink-0 flex flex-col items-start">
                <div className="text-sm">
                  <img
                    className="mr-1 w-[1.2rem] inline-flex bg-greenicon rounded-full align-middle"
                    src={`/icons/RecordReward_Tab_${
                      ["Easy", "Herd", "VeryHard"][boardIndex]
                    }Lv.png`}
                  />
                  <span className="align-middle">
                    {t(`ui.board.board${boardIndex + 1}`)}
                  </span>
                </div>
                <div className="text-2xl">{t(`board.${boardTypeString}`)}</div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 justify-evenly">
          <div className="flex-auto">
            <SubtitleBar>{t("ui.board.bestRouteExample")}</SubtitleBar>
            <div className="w-32 p-2 mx-auto">
              {brRows.map((row, i) => {
                return (
                  <div key={i} className="flex flex-row items-stretch w-full">
                    {row.split("").map((br, j) => {
                      if (br === "0")
                        return <div key={j} className="w-4 h-4" />;
                      if (br === "X")
                        return (
                          <div key={j} className="w-4 h-4 scale-150 z-10">
                            <img
                              src={`/boards/Rect_03.png`}
                              className="w-full h-full drop-shadow-[0px_0_3px_#dc2626] dark:drop-shadow-[0px_0_3px_#fca5a5]"
                            />
                          </div>
                        );
                      return (
                        <div key={j} className="w-4 h-4">
                          <img
                            src={`/boards/Rect_0${
                              [2, 1, 6, 3][Number(br) - 1]
                            }.png`}
                            className={`w-full h-full${
                              br === "1" ? " opacity-70" : ""
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <div className="flex flex-row items-stretch w-full">
                {Array(7)
                  .fill(0)
                  .map((_, i) => {
                    if (i === rstart)
                      return (
                        <div key={i} className="w-4 h-4">
                          <img
                            src={`/boards/Tile_${
                              boardIndex ? "Gate" : "Start"
                            }.png`}
                            className="w-full h-full scale-150"
                          />
                        </div>
                      );
                    return <div key={i} className="w-4 h-4" />;
                  })}
              </div>
            </div>
          </div>
          <div className="flex-auto flex flex-col gap-4">
            <div>
              <SubtitleBar>{t("ui.board.numberOfImportantTiles")}</SubtitleBar>
              <div className="px-4">
                <div>
                  {t("ui.board.importantBoardTilesBefore")}
                  <img
                    src="/icons/Common_Node_Special.png"
                    className="w-5 h-5 inline-block"
                  />
                  {t("ui.board.importantBoardTilesAfter")}
                  {t("ui.board.importantBoardTilesMultiple")}
                  {crayon4Count}
                </div>
                <div>
                  {t("ui.board.importantBoardTilesBefore")}
                  <img
                    src="/icons/Common_Node_Premium.png"
                    className="w-5 h-5 inline-block"
                  />
                  {t("ui.board.importantBoardTilesAfter")}
                  {t("ui.board.importantBoardTilesMultiple")}
                  {crayon3Count}
                </div>
              </div>
            </div>
            {blocked && (
              <div>
                <SubtitleBar>
                  {t("ui.board.importantBoardCombination")}
                </SubtitleBar>
                <div className="px-12 w-full max-w-44 mx-auto">
                  <Carousel>
                    <CarouselContent>
                      {blocking.map((bc, i) => {
                        return (
                          <CarouselItem key={i}>
                            <div className="w-full max-w-20">
                              <div className="flex p-2 justify-center">
                                {bc.split("").map((b, j) => {
                                  return (
                                    <img
                                      key={j}
                                      className="rotate-10 w-10 -m-1 flex-initial flex-shrink-0 bg-cover dark:brightness-80 dark:contrast-125"
                                      src={`/boards/Tile_${
                                        BoardType[Number(b)]
                                      }On.png`}
                                      style={{
                                        backgroundImage:
                                          "url(/boards/Rect_03.png)",
                                      }}
                                    />
                                  );
                                })}
                              </div>
                              <div className="text-center w-min mx-auto text-sm">
                                {i + 1}/{blocking.length}
                              </div>
                            </div>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoardInfoDialog;
