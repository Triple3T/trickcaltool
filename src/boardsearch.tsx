import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import Loading from "@/components/common/loading";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import BoardViewer from "@/components/parts/board-viewer";
import SubtitleBar from "@/components/parts/subtitlebar";
import SelectChara from "@/components/parts/select-chara";
import chara from "@/data/chara";
import board from "@/data/board";
import { BoardType } from "@/types/enums";
import { UserDataOwnedCharaInfo } from "@/types/types";
import {
  useUserDataStatus,
  useUserDataCharaInfo,
  useUserDataUnowned,
  useUserDataBoardFindOption,
  useUserDataActions,
} from "@/stores/useUserDataStore";

interface IFilteredBoardProp {
  name: string;
  index: number;
  board: string;
}

const BoardSearch = () => {
  const { t } = useTranslation();
  const {
    boardFinderToggleExcludeUnowned,
    boardFinderToggleExcludeOpened,
    boardFinderToggleIncludePrevious,
    boardFinderSetTargetNthBoard,
    boardFinderRotateBoardPriority,
    boardFinderSetMinimumMatchCount,
  } = useUserDataActions();
  const dataStatus = useUserDataStatus();
  const userDataCharaInfo = useUserDataCharaInfo();
  const userDataUnowned = useUserDataUnowned();
  const userDataBoardFindOption = useUserDataBoardFindOption();
  const [charaDrawerOpen, setCharaDrawerOpen] = useState(false);

  if (
    dataStatus !== "initialized" ||
    !userDataCharaInfo ||
    !userDataUnowned ||
    !userDataBoardFindOption
  )
    return <Loading />;
  const [excludeUnowned, excludeUnlocked] = userDataBoardFindOption.x;
  const [filterBoardIndex, includePreviousBoardIndex] =
    userDataBoardFindOption.n;
  const [, includeBoardType, mustBoardType] = Object.entries(
    userDataBoardFindOption.b
  ).reduce(
    (acc: number[][], [key, value]) => {
      acc[value].push(Number(key));
      return acc;
    },
    [[], [], []] as number[][]
  );
  const searchingFor = [...includeBoardType, ...mustBoardType];
  const boardTypePriorities = userDataBoardFindOption.b;
  const includeMinimumCount = userDataBoardFindOption.m;
  const filteredBoards = (() => {
    // exclude unowned, filter by board index
    const firstFiltered = (
      excludeUnowned ? userDataUnowned.o : Object.keys(chara)
    )
      .map((c) => {
        return board.c[c].b.map((b, i) => {
          if (
            i === filterBoardIndex ||
            (i < filterBoardIndex && includePreviousBoardIndex)
          ) {
            return {
              name: c,
              index: i + 1,
              board: b.map((bb) => bb.toString(10)).join(""),
            };
          }
          return null;
        });
      })
      .flat()
      .filter((b) => b !== null) as IFilteredBoardProp[];
    // filter by board type
    const secondFiltered = firstFiltered
      .filter((b) => {
        const targetBoards = b.board.split("").map((bb) => Number(bb));
        if (
          mustBoardType.length > 0 &&
          !mustBoardType.every((mb) => targetBoards.includes(mb))
        )
          return false;
        return (
          targetBoards.filter((bb) => searchingFor.includes(bb)).length >=
          includeMinimumCount
        );
      })
      .sort(
        (a, b) =>
          b.board.split("").filter((bb) => searchingFor.includes(Number(bb)))
            .length -
          a.board.split("").filter((bb) => searchingFor.includes(Number(bb)))
            .length
      );
    // exclude unlocked
    const thirdFiltered = secondFiltered
      .filter((b) => {
        if (!excludeUnlocked) return true;
        if (userDataCharaInfo[b.name].unowned) return false;
        return (
          (userDataCharaInfo[b.name] as UserDataOwnedCharaInfo).nthboard <
          b.index
        );
      })
      .sort((a, b) => a.index - b.index);
    return thirdFiltered;
  })();

  return (
    <>
      <Card className="p-4 object-cover max-w-xl mt-0 mb-4 gap-2 mx-auto font-onemobile">
        <Accordion type="single" defaultValue="item-1" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("ui.boardsearch.settings")}</AccordionTrigger>
            <AccordionContent className="text-base">
              <div className="w-full flex flex-col gap-2 px-2">
                <div className="flex flex-col gap-2">
                  <SubtitleBar>
                    {t("ui.boardsearch.characterSettings")}
                  </SubtitleBar>
                  <div className="w-full px-4 my-2 text-left flex items-center gap-2">
                    <Switch
                      id="exclude-unowned"
                      checked={excludeUnowned === 1}
                      onCheckedChange={boardFinderToggleExcludeUnowned}
                    />
                    <Label htmlFor="exclude-unowned">
                      {t("ui.boardsearch.excludeUnowned")}
                    </Label>
                  </div>
                  <div>
                    <SelectChara
                      isOpen={charaDrawerOpen}
                      onOpenChange={setCharaDrawerOpen}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <SubtitleBar>
                    {t("ui.boardsearch.boardIndexSetting")}
                  </SubtitleBar>
                  <div className="w-full px-4 my-2 text-left flex items-center gap-2">
                    <Switch
                      id="include-previous"
                      checked={includePreviousBoardIndex === 1}
                      onCheckedChange={boardFinderToggleIncludePrevious}
                    />
                    <Label htmlFor="include-previous">
                      {t("ui.boardsearch.includePrevious")}
                    </Label>
                  </div>
                  <div>
                    <ToggleGroup
                      type="single"
                      className="flex-wrap"
                      value={filterBoardIndex.toString()}
                      onValueChange={(v) =>
                        boardFinderSetTargetNthBoard(Number(v))
                      }
                    >
                      {["Easy", "Herd", "VeryHard"].map((bText, bIndex) => {
                        return (
                          <ToggleGroupItem
                            key={bIndex}
                            value={`${bIndex}`}
                            aria-label={`Toggle ${bIndex}`}
                          >
                            <img
                              src={`/icons/RecordReward_Tab_${bText}Lv.webp`}
                              className="h-5 w-5 aspect-square mr-1 bg-greenicon rounded-full inline-flex align-middle"
                            />
                            {t(`ui.board.board${bIndex + 1}Short`)}
                          </ToggleGroupItem>
                        );
                      })}
                    </ToggleGroup>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <SubtitleBar>
                    {t("ui.boardsearch.boardTypeSetting")}
                  </SubtitleBar>
                  <div className="flex flex-row flex-wrap px-4 my-1 justify-around text-sm rounded-sm bg-yellow-100/25 p-1">
                    <div className="flex flex-row gap-1 items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-background border border-foreground/30" />
                      {t("ui.boardsearch.boardNoMatter")}
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-accent border border-foreground/30" />
                      {t("ui.boardsearch.boardInclude")}
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-red-400 dark:bg-red-600 border border-foreground/30" />
                      {t("ui.boardsearch.boardMustInclude")}
                    </div>
                  </div>
                  <div className="flex flex-wrap flex-row gap-2 p-2 justify-center">
                    {(
                      Object.values(BoardType).filter(
                        (b) => typeof b === "string"
                      ) as string[]
                    ).map((bt) => {
                      const boardTypeText = bt as keyof typeof BoardType;
                      const boardTypeNum = BoardType[boardTypeText];
                      const boardPriority = boardTypePriorities[boardTypeNum];
                      return (
                        <Button
                          key={bt}
                          size="icon"
                          aria-label={`Set priority of ${bt}`}
                          className={cn(
                            "px-1 w-12",
                            [
                              "bg-transparent hover:bg-accent/40",
                              "bg-accent/70 hover:bg-accent/90",
                              "bg-red-400/70 hover:bg-red-400/90 dark:bg-red-600/70 dark:hover:bg-red-600/90",
                            ][boardPriority]
                          )}
                          onClick={() =>
                            boardFinderRotateBoardPriority(boardTypeNum)
                          }
                        >
                          <img
                            src={`/boards/Tile_${bt}On.webp`}
                            className="h-8 w-8 aspect-square"
                          />
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <SubtitleBar>
                    {t("ui.boardsearch.boardCountSetting")}
                  </SubtitleBar>
                  <div>
                    <ToggleGroup
                      type="single"
                      className="flex"
                      value={includeMinimumCount.toString()}
                      onValueChange={(v) =>
                        boardFinderSetMinimumMatchCount(Number(v))
                      }
                    >
                      {Array(5)
                        .fill(0)
                        .map((_, bc) => {
                          return (
                            <ToggleGroupItem
                              key={bc}
                              value={`${bc + 1}`}
                              aria-label={`Toggle ${bc}`}
                              className="flex-1"
                            >
                              {bc + 1}
                            </ToggleGroupItem>
                          );
                        })}
                    </ToggleGroup>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <SubtitleBar>
                    {t("ui.boardsearch.unlockedBoardSetting")}
                  </SubtitleBar>
                  <div className="w-full px-4 my-2 text-left flex items-center gap-2">
                    <Switch
                      id="exclude-unlocked"
                      checked={excludeUnlocked === 1}
                      onCheckedChange={boardFinderToggleExcludeOpened}
                    />
                    <Label htmlFor="exclude-unlocked">
                      {t("ui.boardsearch.excludeUnlocked")}
                    </Label>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <div className="w-full font-onemobile">
        {filteredBoards.length === 0 && (
          <div className="text-center text-lg font-bold text-gray-500 dark:text-gray-400">
            {t("ui.boardsearch.noMatchResult")}
          </div>
        )}
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBoards.map((fb) => {
            return (
              <BoardViewer
                key={`${fb.name}-${fb.index}`}
                name={fb.name}
                index={fb.index}
                board={board.c[fb.name].b[fb.index - 1]}
                blockedBy={board.c[fb.name].k[fb.index - 1]}
                search={searchingFor}
                unlocked={
                  userDataCharaInfo[fb.name].unowned
                    ? false
                    : fb.index <=
                      (userDataCharaInfo[fb.name] as UserDataOwnedCharaInfo)
                        .nthboard
                }
                skin={userDataCharaInfo[fb.name].skin || 0}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BoardSearch;
