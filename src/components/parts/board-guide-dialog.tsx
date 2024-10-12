import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import chara from "@/data/chara";

const BoardGuideDialog = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const [randomCharas, setRandomCharas] = useState<string[]>([]);
  useEffect(() => {
    const charaList = Object.keys(chara);
    const random1 = charaList.splice(
      Math.floor(Math.random() * charaList.length),
      1
    )[0];
    const random2 = charaList.splice(
      Math.floor(Math.random() * charaList.length),
      1
    )[0];
    const random3 = charaList.splice(
      Math.floor(Math.random() * charaList.length),
      1
    )[0];
    setRandomCharas([random1, random2, random3]);
  }, []);
  return (
    <Dialog>
      <DialogTrigger onClick={onClick} asChild>
        <Button variant="outline" size="sm" className="flex-1">
          {t("ui.board.selectBoardTypeRecommended")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="font-normal">
              {t("ui.board.recommendBoardDialogTitle")}
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="p-2 flex flex-col gap-2 max-w-full overflow-hidden">
          <div className="text-sm">
            {t("ui.board.recommendBoardDesc1Front")}
            {t("ui.board.recommendBoardDescItemName")}
            <img src="/icons/Item_Crayon4.png" className="inline w-4 h-4" />
            {t("ui.board.recommendBoardDesc1Back")}
          </div>
          <div className="text-sm">{t("ui.board.recommendBoardDesc2")}</div>
          <div className="text-sm">{t("ui.board.recommendBoardDesc3")}</div>
          <div className="px-10 max-w-full">
            <Carousel>
              <CarouselContent>
                {/* Start of guide carousel */}
                <CarouselItem className="">
                  <div>
                    <div className="flex p-2 justify-center gap-2 h-40 items-center">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-12 h-12 flex rotate-10 bg-board-special-disabled bg-cover">
                            <img
                              src="/boards/Tile_NextBoard.png"
                              className="w-12 h-12 brightness-15"
                            />
                          </div>
                          <img
                            src="/icons/Item_Crayon4.png"
                            className="absolute w-6 h-6 -right-1 -bottom-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <img src="/common/Icon_Arrow.png" className="w-6" />
                      </div>
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="flex px-3">
                            <img
                              src={`/charas/${randomCharas[0]}.png`}
                              className="w-12 h-12 mt-4 -mx-3 z-[2]"
                            />
                            <img
                              src={`/charas/${randomCharas[1]}.png`}
                              className="w-12 h-12 mb-4 -mx-4 z-[1]"
                            />
                            <img
                              src={`/charas/${randomCharas[2]}.png`}
                              className="w-12 h-12 mt-4 -mx-3 z-[3]"
                            />
                          </div>
                          <img
                            src="/scenes/Icon_Levelup_Arrow.png"
                            className="w-5 h-5 absolute bottom-0 right-0 z-[5]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex p-2 justify-center text-sm break-keep">
                      {t("ui.board.boardGuide1")}
                    </div>
                    <div className="text-center text-xs">1/7</div>
                  </div>
                </CarouselItem>
                <CarouselItem className="">
                  <div>
                    <div className="flex p-2 justify-center gap-2 h-40 items-center">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-12 h-12 flex rotate-10 bg-board-special-disabled bg-cover">
                            <img
                              src="/boards/Tile_CriticalRateOff.png"
                              className="w-12 h-12 brightness-15"
                            />
                          </div>
                          <img
                            src="/icons/Item_Crayon4.png"
                            className="absolute w-6 h-6 -right-1 -bottom-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <img
                          src="/common/CommonLevelUpArrow.png"
                          className="w-6"
                        />
                      </div>
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src="/boards/Tile_CriticalRateOn.png"
                            className="w-12 h-12 rotate-10 bg-board-special bg-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex p-2 justify-center text-sm break-keep">
                      {t("ui.board.boardGuide2")}
                    </div>
                    <div className="text-center text-xs">2/7</div>
                  </div>
                </CarouselItem>
                <CarouselItem className="">
                  <div>
                    <div className="flex flex-col h-40 justify-center">
                      <div className="flex p-2 justify-center gap-2">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-12 h-12 flex rotate-10 bg-board-special-disabled bg-cover">
                              <img
                                src="/boards/Tile_AttackBothOff.png"
                                className="w-12 h-12 brightness-15"
                              />
                            </div>
                            <img
                              src="/icons/Item_Crayon4.png"
                              className="absolute w-6 h-6 -right-1 -bottom-1"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <img
                            src="/common/CommonLevelUpArrow.png"
                            className="w-6"
                          />
                        </div>
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              src="/boards/Tile_AttackBothOn.png"
                              className="w-12 h-12 rotate-10 bg-board-special bg-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex p-2 justify-center gap-2">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-12 h-12 flex rotate-10 bg-board-special-disabled bg-cover">
                              <img
                                src="/boards/Tile_HpOff.png"
                                className="w-12 h-12 brightness-15"
                              />
                            </div>
                            <img
                              src="/icons/Item_Crayon4.png"
                              className="absolute w-6 h-6 -right-1 -bottom-1"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <img
                            src="/common/CommonLevelUpArrow.png"
                            className="w-6"
                          />
                        </div>
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              src="/boards/Tile_HpOn.png"
                              className="w-12 h-12 rotate-10 bg-board-special bg-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex p-2 justify-center text-sm  break-keep">
                      {t("ui.board.boardGuide3")}
                    </div>
                    <div className="text-center text-xs">3/7</div>
                  </div>
                </CarouselItem>
                <CarouselItem className="">
                  <div>
                    <div className="flex flex-col h-40 justify-center">
                      <div className="flex p-2 justify-center gap-2">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-12 h-12 flex rotate-10 bg-board-special-disabled bg-cover">
                              <img
                                src="/boards/Tile_CriticalRateOff.png"
                                className="w-12 h-12 brightness-15"
                              />
                            </div>
                            <img
                              src="/icons/Item_Crayon4.png"
                              className="absolute w-6 h-6 -right-1 -bottom-1"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <img
                            src="/common/CommonLevelUpArrow.png"
                            className="w-6"
                          />
                        </div>
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              src="/boards/Tile_CriticalRateOn.png"
                              className="w-12 h-12 rotate-10 bg-board-special bg-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex p-2 justify-center gap-2">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-12 h-12 flex rotate-10 bg-board-special-disabled bg-cover">
                              <img
                                src="/boards/Tile_CriticalMultOff.png"
                                className="w-12 h-12 brightness-15"
                              />
                            </div>
                            <img
                              src="/icons/Item_Crayon4.png"
                              className="absolute w-6 h-6 -right-1 -bottom-1"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <img
                            src="/common/CommonLevelUpArrow.png"
                            className="w-6"
                          />
                        </div>
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              src="/boards/Tile_CriticalMultOn.png"
                              className="w-12 h-12 rotate-10 bg-board-special bg-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex p-2 justify-center text-sm break-keep">
                      {t("ui.board.boardGuide4")}
                    </div>
                    <div className="text-center text-xs">4/7</div>
                  </div>
                </CarouselItem>
                <CarouselItem className="">
                  <div>
                    <div className="flex flex-col h-40 justify-center">
                      <div className="flex p-2 justify-center gap-2">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-12 h-12 flex rotate-10 bg-board-special-disabled bg-cover">
                              <img
                                src="/boards/Tile_CriticalResistOff.png"
                                className="w-12 h-12 brightness-15"
                              />
                            </div>
                            <img
                              src="/icons/Item_Crayon4.png"
                              className="absolute w-6 h-6 -right-1 -bottom-1"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <img
                            src="/common/CommonLevelUpArrow.png"
                            className="w-6"
                          />
                        </div>
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              src="/boards/Tile_CriticalResistOn.png"
                              className="w-12 h-12 rotate-10 bg-board-special bg-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-2 px-2">
                        <Separator className="flex-1" />
                        <div className="flex-initial">OR</div>
                        <Separator className="flex-1" />
                      </div>
                      <div className="flex p-2 justify-center gap-2">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-12 h-12 flex rotate-10 bg-board-special-disabled bg-cover">
                              <img
                                src="/boards/Tile_CriticalMultResistOff.png"
                                className="w-12 h-12 brightness-15"
                              />
                            </div>
                            <img
                              src="/icons/Item_Crayon4.png"
                              className="absolute w-6 h-6 -right-1 -bottom-1"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <img
                            src="/common/CommonLevelUpArrow.png"
                            className="w-6"
                          />
                        </div>
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              src="/boards/Tile_CriticalMultResistOn.png"
                              className="w-12 h-12 rotate-10 bg-board-special bg-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex p-2 justify-center text-sm break-keep">
                      {t("ui.board.boardGuide5")}
                    </div>
                    <div className="text-center text-xs">5/7</div>
                  </div>
                </CarouselItem>
                <CarouselItem className="">
                  <div>
                    <div className="flex p-2 justify-center gap-2 h-40 items-center">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-16 h-16 flex rotate-10 bg-board-special-disabled bg-cover">
                            <img
                              src="/boards/Tile_DefensePhysicOff.png"
                              className="w-16 h-16 brightness-15"
                            />
                          </div>
                          <img
                            src="/icons/Banned_Icon.png"
                            className="absolute w-8 h-8 -right-1 -bottom-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-16 h-16 flex rotate-10 bg-board-special-disabled bg-cover">
                            <img
                              src="/boards/Tile_DefenseMagicOff.png"
                              className="w-16 h-16 brightness-15"
                            />
                          </div>
                          <img
                            src="/icons/Banned_Icon.png"
                            className="absolute w-8 h-8 -right-1 -bottom-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex p-2 justify-center text-sm break-keep">
                      {t("ui.board.boardGuide6")}
                    </div>
                    <div className="text-center text-xs">6/7</div>
                  </div>
                </CarouselItem>
                <CarouselItem className="">
                  <div>
                    <div className="flex p-2 justify-center gap-2 h-40 items-center">
                      <div className="flex items-center">
                        <div className="relative">
                          <img src="/boards/Gate.png" className="w-16 h-16" />
                          <img
                            src="/icons/Banned_Icon.png"
                            className="absolute w-8 h-8 -right-1 -bottom-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex p-2 justify-center text-sm break-keep">
                      {t("ui.board.boardGuide7")}
                    </div>
                    <div className="text-center text-xs">7/7</div>
                  </div>
                </CarouselItem>
                {/* End of guide carousel */}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
        <DialogFooter className="flex-row justify-end">
          <DialogClose asChild>
            <Button type="submit" variant="default" className="w-max">{t("ui.board.closeGuide")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BoardGuideDialog;
