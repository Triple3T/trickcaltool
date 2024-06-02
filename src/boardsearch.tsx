import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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

import userdata from "@/utils/userdata";

interface IFilteredBoardProp {
  name: string;
  index: number;
  board: string;
}

const BoardSearch = () => {
  const { t } = useTranslation();
  const [charaDrawerOpen, setCharaDrawerOpen] = useState(false);
  const [ownedCharas, setOwnedCharas] = useState<{ [key: string]: number }>({});
  const [excludeUnowned, setExcludeUnowned] = useState<boolean>(false);
  const [filterBoardIndex, setFilterBoardIndex] = useState<number>(0);
  const [includePreviousBoardIndex, setIncludePreviousBoardIndex] =
    useState<boolean>(true);
  const [includeBoardType, setIncludeBoardType] = useState<BoardType[]>([]);
  const [includeMinimumCount, setIncludeMinimumCount] = useState<number>(1);
  const [excludeUnlocked, setExcludeUnlocked] = useState<boolean>(false);
  const initFromUserData = useCallback(() => {
    const userDataUnownedProto = userdata.unowned.load();
    const userDataNthBoardProto = userdata.nthboard.load();
    const userDataNthBoard = Object.fromEntries(
      Object.entries(userDataNthBoardProto.n).filter(([c]) =>
        userDataUnownedProto.o.includes(c)
      )
    );
    userdata.nthboard.save({ n: userDataNthBoard });
    setOwnedCharas(userDataNthBoard);
  }, []);
  useEffect(initFromUserData, [initFromUserData]);
  const saveSelectChara = useCallback(() => {
    setCharaDrawerOpen(false);
    initFromUserData();
  }, [initFromUserData]);
  const filteredBoards = useMemo(() => {
    const firstFiltered = (
      excludeUnowned ? Object.keys(ownedCharas || {}) : Object.keys(chara)
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
    const secondFiltered = firstFiltered
      .filter((b) => {
        return (
          b.board
            .split("")
            .filter((bb) => includeBoardType.includes(Number(bb))).length >=
          includeMinimumCount
        );
      })
      .sort(
        (a, b) =>
          b.board
            .split("")
            .filter((bb) => includeBoardType.includes(Number(bb))).length -
          a.board
            .split("")
            .filter((bb) => includeBoardType.includes(Number(bb))).length
      );
    const thirdFiltered = secondFiltered
      .filter((b) => {
        return (
          !excludeUnlocked ||
          !ownedCharas[b.name] ||
          ownedCharas[b.name] < b.index
        );
      })
      .sort((a, b) => a.index - b.index);
    return thirdFiltered;
  }, [
    excludeUnlocked,
    excludeUnowned,
    filterBoardIndex,
    includeBoardType,
    includeMinimumCount,
    includePreviousBoardIndex,
    ownedCharas,
  ]);

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
                      checked={excludeUnowned}
                      onCheckedChange={(c) => {
                        setExcludeUnowned(c);
                      }}
                    />
                    <Label htmlFor="exclude-unowned">
                      {t("ui.boardsearch.excludeUnowned")}
                    </Label>
                  </div>
                  <div>
                    <SelectChara
                      isOpen={charaDrawerOpen}
                      onOpenChange={setCharaDrawerOpen}
                      saveAndClose={saveSelectChara}
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
                      checked={includePreviousBoardIndex}
                      onCheckedChange={(c) => {
                        setIncludePreviousBoardIndex(c);
                      }}
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
                      onValueChange={(v) => {
                        setFilterBoardIndex(Number(v));
                      }}
                    >
                      {["Easy", "Herd", "VeryHard"].map((bText, bIndex) => {
                        return (
                          <ToggleGroupItem
                            key={bIndex}
                            value={`${bIndex}`}
                            aria-label={`Toggle ${bIndex}`}
                          >
                            <img
                              src={`/icons/RecordReward_Tab_${bText}Lv.png`}
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
                  <div>
                    <ToggleGroup
                      type="multiple"
                      className="flex-wrap"
                      value={includeBoardType.map((b) => BoardType[b])}
                      onValueChange={(v) => {
                        setIncludeBoardType(
                          v.map((b) => BoardType[b as keyof typeof BoardType])
                        );
                      }}
                    >
                      {(
                        Object.values(BoardType).filter(
                          (b) => typeof b === "string"
                        ) as string[]
                      ).map((bt) => {
                        return (
                          <ToggleGroupItem
                            key={bt}
                            value={bt}
                            aria-label={`Toggle ${bt}`}
                            className="px-2"
                          >
                            <img
                              src={`/boards/Tile_${bt}On.png`}
                              className="h-8 w-8 aspect-square"
                            />
                          </ToggleGroupItem>
                        );
                      })}
                    </ToggleGroup>
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
                      onValueChange={(v) => {
                        setIncludeMinimumCount(Number(v));
                      }}
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
                      checked={excludeUnlocked}
                      onCheckedChange={(c) => {
                        setExcludeUnlocked(c);
                      }}
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
                board={board.c[fb.name].b[fb.index - 1]
                  .map((b) => b.toString())
                  .join("")}
                search={includeBoardType}
                unlocked={fb.index <= ownedCharas[fb.name]}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BoardSearch;
