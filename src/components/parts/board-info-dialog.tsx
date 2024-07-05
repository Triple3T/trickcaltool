import { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { Dot, Info, Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import SubtitleBar from "./subtitlebar";
import {
  Attack,
  BoardType,
  Class,
  Personality,
  Position,
  Race,
} from "@/types/enums";

interface BoardInfoDialogTriggerProps extends HTMLAttributes<HTMLDivElement> {
  route: string;
}

export interface BoardInfoDialogProps {
  boardIndex: number;
  boardTypeString: string;
  chara: string;
  charaTypes: string;
  route: string;
  rstart: number;
  otherBoards: string;
  blocked?: string;
  checked?: boolean;
  unowned?: boolean;
  opened: boolean;
  onOpenChange: (open: boolean) => void;
  skin: number;
  unlockedBoard: number;
  eldain?: number;
}

const BoardInfoDialogTrigger = ({
  route,
  className,
  ...props
}: BoardInfoDialogTriggerProps) => {
  const crayon3Count = route.split("3").length - 1;
  const crayon4Count = route.split("4").length - 1;
  return (
    <div className={cn("w-full h-4 flex relative", className)} {...props}>
      <div className="flex-1">
        {Array(crayon3Count + crayon4Count)
          .fill(0)
          .map((_, i) => {
            const left = `${i / 2.25}rem`;
            if (i < crayon4Count)
              return (
                <img
                  key={i}
                  src="/icons/Item_Crayon4.png"
                  alt="crayon4"
                  className="h-4 w-4 absolute top-0"
                  style={{ left }}
                />
              );
            return (
              <img
                key={i}
                src="/icons/Item_Crayon3.png"
                alt="crayon3"
                className="h-4 w-4 absolute top-0"
                style={{ left }}
              />
            );
          })}
      </div>
      <div className="flex-0 aspect-square">
        <Info className="h-4 w-4 rounded-full" fill="#a0a0a0" />
      </div>
    </div>
  );
};

const BoardInfoDialog = ({
  boardIndex,
  boardTypeString,
  chara,
  charaTypes,
  route,
  rstart,
  otherBoards,
  blocked,
  checked,
  unowned,
  opened,
  onOpenChange,
  skin,
  unlockedBoard,
  eldain,
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
    <Dialog open={opened} onOpenChange={onOpenChange}>
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col gap-1 font-normal">
              <div className="text-sm text-left">
                <img
                  className="mr-1 w-[1.2rem] inline-flex bg-greenicon rounded-full align-middle"
                  src={`/icons/RecordReward_Tab_${
                    ["Easy", "Herd", "VeryHard"][boardIndex]
                  }Lv.png`}
                />
                <span className="align-middle">
                  {t(`ui.board.board${boardIndex + 1}`)}
                </span>
                <Dot className="inline-block w-4 h-4 mx-px align-middle" />
                <img
                  src={`/boards/Tile_${boardTypeString}On.png`}
                  className="mr-1 w-5 h-5 inline-block align-middle"
                />
                <span className="align-middle">
                  {t(`board.${boardTypeString}`)}
                </span>
                {eldain ? (
                  <>
                    <Dot className="inline-block w-4 h-4 mx-px align-middle" />
                    <span className="align-middle">
                      {t(`eldain.${eldain}`)}
                    </span>
                  </>
                ) : null}
              </div>
              <div className="flex flex-row gap-2">
                <img
                  src={
                    skin
                      ? `/charas/${chara}Skin${skin}.png`
                      : `/charas/${chara}.png`
                  }
                  className="w-14 h-14"
                />
                <div className="flex-initial flex-shrink-0 flex flex-col items-start gap-0.5 p-0.5">
                  <div className="flex flex-row gap-px">
                    <img
                      src={`/icons/Common_UnitPersonality_${
                        Personality[Number(charaTypes[0])]
                      }.png`}
                      className="w-5 h-5 inline-block align-middle"
                    />
                    <img
                      src={`/icons/Common_UnitAttack${
                        Attack[Number(charaTypes[2])]
                      }.png`}
                      className="w-5 h-5 inline-block align-middle"
                    />
                    <img
                      src={`/icons/Common_Position${
                        Position[Number(charaTypes[3])]
                      }.png`}
                      className="w-5 h-5 inline-block align-middle"
                    />
                    <img
                      src={`/icons/Common_Unit${
                        Class[Number(charaTypes[4])]
                      }.png`}
                      className="w-5 h-5 inline-block align-middle"
                    />
                    <img
                      src={`/icons/Common_UnitRace_${
                        Race[Number(charaTypes[5])]
                      }.png`}
                      className="w-5 h-5 inline-block align-middle"
                    />
                    {unlockedBoard > 0 && (
                      <>
                        <Dot className="inline-block w-5 h-5 mx-px align-middle" />
                        <div className="inline-block align-middle p-1 -ml-1 w-5 h-5">
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
                        <div
                          className={cn(
                            "inline-block align-middle text-sm",
                            unlockedBoard > boardIndex
                              ? ""
                              : "text-red-600 dark:text-red-400"
                          )}
                        >
                          {t("ui.board.nthBoardOpened", {
                            0: `${unlockedBoard}`,
                          })}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="text-2xl">
                    {t(`chara.${chara}`)}
                    {unowned && (
                      <Badge
                        variant="destructive"
                        className="ml-2 align-middle font-thin"
                      >
                        {t("ui.board.notOwned")}
                      </Badge>
                    )}
                    {checked && (
                      <img
                        src="/icons/Stage_RewardChack.png"
                        className="w-100 opacity-100 w-6 inline-block ml-2 align-middle"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <Alert variant="default">
          <Waypoints className="h-4 w-4" />
          <AlertTitle>{t("ui.board.aboutBestRouteTitle")}</AlertTitle>
          <AlertDescription className="break-keep">
            {t("ui.board.aboutBestRouteDescription")}
          </AlertDescription>
        </Alert>
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
                              src="/boards/Rect_03.png"
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
                            className={cn(
                              "w-full h-full",
                              br === "1" ? " opacity-70" : ""
                            )}
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
          <div className="flex-auto flex flex-col gap-2">
            <div>
              <SubtitleBar>{t("ui.board.numberOfImportantTiles")}</SubtitleBar>
              <div className="px-4 py-2">
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
                <div className="px-12 w-full max-w-44 mx-auto py-2">
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
                                      className="bg-board-special rotate-10 w-10 -m-1 flex-initial flex-shrink-0 bg-cover dark:brightness-80 dark:contrast-125"
                                      src={`/boards/Tile_${
                                        BoardType[Number(b)]
                                      }On.png`}
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
        <div>
          <SubtitleBar>
            {t("ui.board.listInCurrentBoard", {
              0: t(`chara.${chara}`),
              1: t(`ui.board.board${boardIndex + 1}`),
            })}
          </SubtitleBar>
          <div className="px-4 pt-6 pb-2 flex flex-row justify-center h-12">
            {otherBoards.split("").map((b, i) => {
              const bt = BoardType[Number(b)];
              return (
                <div className="w-1/6 max-w-12 relative" key={i}>
                  <div className="absolute w-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img
                      src={`/boards/Tile_${bt}On.png`}
                      className="bg-board-special w-12 h-12 rotate-10 inline-block align-middle aspect-square bg-cover dark:brightness-80 dark:contrast-125"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { BoardInfoDialog, BoardInfoDialogTrigger };
