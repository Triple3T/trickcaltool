import { Fragment, HTMLAttributes, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dot, Info, Pencil, Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubtitleBar from "./subtitlebar";
import {
  Attack,
  BoardType,
  Class,
  Personality,
  Position,
  Race,
} from "@/types/enums";
import { Checkbox } from "../ui/checkbox";

const boardButtonBgCommon =
  "bg-transparent hover:bg-transparent bg-gradient-to-b from-primary hover:from-primary/90 from-85% to-85%";
const boardButtonBgs = [
  "to-slate-400 hover:to-slate-400/90",
  "to-emerald-500 hover:to-emerald-500/90",
  "to-amber-400 hover:to-amber-400/90",
];

interface BoardInfoDialogTriggerProps extends HTMLAttributes<HTMLDivElement> {
  route: string;
}

export interface BoardInfoDialogProps {
  boardIndex: number;
  boardShape: string;
  boardTypeString: string;
  chara: string;
  charaTypes: string;
  route: string;
  rstart: number;
  otherBoards: string[];
  otherRoutes: string[];
  blocked?: string;
  checked?: boolean;
  unowned?: boolean;
  opened: boolean;
  onOpenChange: (open: boolean) => void;
  skin: number;
  unlockedBoard: number;
  changeBoardIndex?: (boardIndex: number) => void;
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
  boardShape,
  boardTypeString,
  chara,
  charaTypes,
  route,
  rstart,
  otherBoards,
  otherRoutes,
  blocked,
  checked,
  unowned,
  opened,
  onOpenChange,
  skin,
  unlockedBoard,
  changeBoardIndex,
  eldain,
}: BoardInfoDialogProps) => {
  const { t } = useTranslation();
  const [boardIndexSettingOpen, setBoardIndexSettingOpen] =
    useState<boolean>(false);
  const [currentUnlockedIndex, setCurrentUnlockedIndex] =
    useState<number>(unlockedBoard);
  const [noRouteOff, setNoRouteOff] = useState<boolean>(true);
  useEffect(() => {
    setCurrentUnlockedIndex(unlockedBoard);
  }, [unlockedBoard, chara]);
  const brLength = boardShape.length;
  const brRowCount = Math.floor(brLength / 7);
  const brRows = Array(brRowCount)
    .fill(0)
    .map((_, i) => boardShape.slice(i * 7, (i + 1) * 7));
  const crayon3Count = route.split("3").length - 1;
  const crayon4Count = route.split("4").length - 1;
  const blocking = blocked
    ? Array(blocked.length / crayon4Count)
        .fill(0)
        .map((_, i) => blocked.slice(i * crayon4Count, (i + 1) * crayon4Count))
    : [];
  const otherBoardInCurrent = Object.fromEntries(
    otherBoards[boardIndex]
      .split("")
      .map((b, i) => [otherRoutes[i].indexOf("X"), b])
  );
  console.log(otherBoardInCurrent);
  return (
    <Dialog
      open={opened}
      onOpenChange={(o) => {
        if (!o) setBoardIndexSettingOpen(false);
        onOpenChange(o);
      }}
    >
      <DialogContent
        className="font-onemobile max-h-[600px] overflow-y-auto"
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
                      src={`/album/Album_Icon_${
                        Race[Number(charaTypes[5])]
                      }.png`}
                      className="w-5 h-5 inline-block align-middle"
                    />
                    {currentUnlockedIndex > 0 && (
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
                              ][currentUnlockedIndex]
                            )}
                          />
                        </div>
                        <div
                          className={cn(
                            "inline-block align-middle text-sm",
                            currentUnlockedIndex > boardIndex
                              ? ""
                              : "text-red-600 dark:text-red-400"
                          )}
                        >
                          {t("ui.board.nthBoardOpened", {
                            0: `${currentUnlockedIndex}`,
                          })}
                        </div>
                      </>
                    )}
                    <span className="w-2 m-0 p-0" />
                    {changeBoardIndex && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="align-middle w-6 h-6 -m-1 p-1"
                        onClick={() => setBoardIndexSettingOpen((v) => !v)}
                      >
                        <Pencil />
                      </Button>
                    )}
                  </div>
                  {changeBoardIndex && (
                    <Accordion
                      type="multiple"
                      className="w-full"
                      value={boardIndexSettingOpen ? ["open"] : []}
                    >
                      <AccordionItem value="open" className="border-none">
                        <AccordionContent>
                          <div className="text-base">
                            {t("ui.board.maxBoardIndex")}
                          </div>
                          <div className="flex gap-2 justify-between items-center">
                            {Array(3)
                              .fill(0)
                              .map((_, i) => {
                                return (
                                  <Button
                                    key={i}
                                    size="sm"
                                    className={cn(
                                      "px-2 py-1 h-min flex-1",
                                      boardButtonBgCommon,
                                      boardButtonBgs[i]
                                    )}
                                    onClick={() => {
                                      changeBoardIndex(i + 1);
                                      setCurrentUnlockedIndex(i + 1);
                                      setBoardIndexSettingOpen(false);
                                    }}
                                  >
                                    {t(`ui.board.board${i + 1}`)}
                                  </Button>
                                );
                              })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
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
        <Tabs className="-mt-1" defaultValue="Route">
          <TabsList className="grid grid-cols-2 h-max">
            <TabsTrigger className="flex-1" value="Route">
              {t("ui.board.dialogTabRoute")}
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="Other">
              {t("ui.board.dialogTabOther")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Route">
            <Alert variant="default">
              <Waypoints className="h-4 w-4" />
              <AlertTitle>{t("ui.board.aboutBestRouteTitle")}</AlertTitle>
              <AlertDescription className="break-keep">
                {t("ui.board.aboutBestRouteDescription")}
              </AlertDescription>
            </Alert>
            <div className="flex gap-2 justify-evenly flex-col sm:flex-row">
              <div className="flex-auto">
                <SubtitleBar>{t("ui.board.bestRouteExample")}</SubtitleBar>
                <label className="flex gap-2 justify-center items-center mt-2">
                  <Checkbox
                    checked={noRouteOff}
                    onCheckedChange={(v) => setNoRouteOff(!!v)}
                  />
                  <span>{t("ui.board.noRouteOff")}</span>
                </label>
                <div className="grid grid-cols-7 max-w-40 mx-auto mt-2">
                  {brRows.map((row, i) => {
                    return (
                      <Fragment key={i}>
                        {row.split("").map((br, j) => {
                          const currentIndex = i * 7 + j;
                          const boardTypeIfExists = Number(
                            otherBoardInCurrent[currentIndex] ?? "-1"
                          );
                          if (br === "1")
                            return (
                              <div key={j} className="aspect-square w-full">
                                <img
                                  src="/boards/Rect_01.png"
                                  className={cn(
                                    "aspect-square w-full",
                                    noRouteOff &&
                                      route[currentIndex] === "1" &&
                                      "opacity-25"
                                  )}
                                />
                              </div>
                            );
                          if (br === "2")
                            return (
                              <div key={j} className="aspect-square w-full">
                                <img
                                  src="/boards/Rect_06.png"
                                  className={cn(
                                    "aspect-square w-full",
                                    noRouteOff &&
                                      route[currentIndex] === "1" &&
                                      "opacity-25"
                                  )}
                                />
                              </div>
                            );
                          if (br === "3")
                            return (
                              <div key={j} className="aspect-square w-full">
                                <img
                                  src={`/boards/Tile_${BoardType[boardTypeIfExists]}On.png`}
                                  className={cn(
                                    "aspect-square w-full bg-board-special bg-cover",
                                    noRouteOff &&
                                      route[currentIndex] === "1" &&
                                      "opacity-25"
                                  )}
                                />
                              </div>
                            );
                          return (
                            <div key={j} className="aspect-square w-full" />
                          );
                        })}
                      </Fragment>
                    );
                  })}
                  {Array(7)
                    .fill(0)
                    .map((_, i) => {
                      if (i === rstart)
                        return (
                          <div key={i} className="aspect-square w-full">
                            <img
                              src={`/boards/Tile_${
                                boardIndex ? "Gate" : "Start"
                              }.png`}
                              className="aspect-square w-full scale-150"
                            />
                          </div>
                        );
                      return <div key={i} className="aspect-square w-full" />;
                    })}
                </div>
              </div>
              <div className="flex-auto flex flex-col gap-2">
                <div>
                  <SubtitleBar>
                    {t("ui.board.numberOfImportantTiles")}
                  </SubtitleBar>
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
                              <CarouselItem className="w-full max-w-24" key={i}>
                                <div>
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
                                  <div className="text-center w-max mx-auto text-sm">
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
          </TabsContent>
          <TabsContent value="Other">
            <div className="">
              <SubtitleBar>
                {t("ui.board.listInCurrentBoard", {
                  0: t(`chara.${chara}`),
                })}
              </SubtitleBar>
              <div className="p-4 flex flex-col justify-center -mb-2">
                {otherBoards.map((bs, i) => {
                  return (
                    <div className="w-full py-2" key={i}>
                      <div className="flex flex-row justify-center items-end gap-2">
                        <div className="bg-accent/75 rounded px-2">
                          <div className="-mt-2.5">
                            {t(`ui.board.board${i + 1}`)}
                          </div>
                        </div>
                      </div>
                      <div className="flex -mt-1 justify-center h-20">
                        {bs.split("").map((b, i) => {
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
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export { BoardInfoDialog, BoardInfoDialogTrigger };
