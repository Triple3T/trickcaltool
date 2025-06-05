import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import chara from "@/data/chara";
import { personalityBG } from "@/utils/personalityBG";
import { Personality, Position } from "@/types/enums";
import { useUserDataCharaInfo } from "@/stores/useUserDataStore";

// af
import { useIsAFActive } from "@/stores/useAFDataStore";
import { getCharaImageUrl } from "@/utils/getImageUrl";

interface CharaPickerProps {
  currentChara: string;
  positionables: string[];
  alreadyUsings: string[];
  onChange: (chara: string) => void;
  onReset: () => void;
  position: Position;
}

const STAR_NUMBER = [5, 3, 4];
const AFTER_CONTENT_CLASS = [
  "after:content-['1']",
  "after:content-['2']",
  "after:content-['3']",
];

const CharaPicker = ({
  currentChara,
  positionables,
  alreadyUsings,
  onChange,
  onReset,
  position,
}: CharaPickerProps) => {
  const { t } = useTranslation();
  const isAF = useIsAFActive();
  const userCharaInfo = useUserDataCharaInfo();
  const charaPersonality: Personality = currentChara
    ? Number(chara[currentChara].t.charAt(0))
    : -1;
  const currentCharaSkin = userCharaInfo?.[currentChara]?.skin ?? 0;
  const [selectedChara, setSelectedChara] = useState<string>("");
  const [personalityFilter, setPersonalityFilter] = useState<Personality[]>([]);
  const [starFilter, setStarFilter] = useState<number[]>([]);

  const filterResetHandler = useCallback(() => {
    setPersonalityFilter([]);
    setStarFilter([]);
  }, []);
  const cancelHandler = useCallback(() => {
    setSelectedChara("");
    filterResetHandler();
  }, [filterResetHandler]);
  const resetHandler = useCallback(() => {
    setSelectedChara("");
    onReset();
    filterResetHandler();
  }, [filterResetHandler, onReset]);
  const confirmHandler = useCallback(() => {
    setSelectedChara("");
    onChange(selectedChara);
    filterResetHandler();
  }, [filterResetHandler, onChange, selectedChara]);

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className={cn(
            "w-full sm:w-7/8 md:w-3/4 sm:mx-auto aspect-square rounded-[27.5%] overflow-hidden",
            currentChara ? personalityBG[charaPersonality] : "",
            currentChara ? "ring-4 ring-background/25 ring-inset" : ""
          )}
        >
          <img
            src={
              currentChara
                ? getCharaImageUrl(
                    currentCharaSkin
                      ? `${currentChara}Skin${currentCharaSkin}`
                      : `${currentChara}`,
                    isAF && "af"
                  )
                : "/ingameui/Ingame_Artifact_HeroEmpty.webp"
            }
            alt={t(
              currentChara
                ? `chara.${currentChara}`
                : "ui.teambuilder.emptyCharaSlot"
            )}
            className={cn("w-full aspect-square", isAF && "scale-125")}
          />
        </div>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-normal">
            {t(`position.${Position[position]}`)}{" "}
            {t("ui.teambuilder.selectCharaTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-row gap-0.5 max-h-10">
          {[
            Personality.Naive,
            Personality.Cool,
            Personality.Mad,
            Personality.Jolly,
            Personality.Gloomy,
          ].map((personality) => {
            const personalityString = Personality[personality];
            return (
              <div
                key={personality}
                className={cn(
                  "rounded aspect-square cursor-pointer p-1 flex-auto max-w-10",
                  personalityFilter.includes(personality) && "bg-accent"
                )}
                onClick={() => {
                  setPersonalityFilter((prev) => {
                    if (prev.includes(personality)) {
                      return prev.filter((s) => s !== personality);
                    } else {
                      return [...prev, personality];
                    }
                  });
                }}
              >
                <img
                  src={`/icons/Common_UnitPersonality_${personalityString}.webp`}
                  className="w-full aspect-square"
                />
              </div>
            );
          })}
          <Separator orientation="vertical" className="mx-1 scale-y-75" />
          {[3, 2, 1].map((starGrade) => {
            const starImgNum = STAR_NUMBER[starGrade - 1];
            const afterClassName = AFTER_CONTENT_CLASS[starGrade - 1];
            return (
              <div
                key={starGrade}
                className={cn(
                  "rounded aspect-square cursor-pointer p-1 flex-auto max-w-10 relative",
                  afterClassName,
                  "after:text-shadow-glow after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-sm",
                  starFilter.includes(starGrade) && "bg-accent"
                )}
                onClick={() => {
                  setStarFilter((prev) => {
                    if (prev.includes(starGrade)) {
                      return prev.filter((s) => s !== starGrade);
                    } else {
                      return [...prev, starGrade];
                    }
                  });
                }}
              >
                <img
                  src={`/icons/HeroGrade_000${starImgNum}.webp`}
                  className={cn("w-full aspect-square")}
                />
              </div>
            );
          })}
        </div>
        <ScrollArea className="bg-accent/50 rounded-lg max-h-[300px]">
          <div className="grid p-2 gap-2 grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(4.5rem,_1fr))] auto-rows-auto">
            {positionables
              .sort((a, b) => t(`chara.${a}`).localeCompare(t(`chara.${b}`)))
              .map((charaName) => {
                const charaPersonality: Personality = Number(
                  chara[charaName].t.charAt(0)
                );
                const personalityFilterTrue =
                  personalityFilter.length > 0
                    ? personalityFilter.includes(charaPersonality)
                    : true;
                const starFilterTrue =
                  starFilter.length > 0
                    ? starFilter.includes(Number(chara[charaName].t.charAt(1)))
                    : true;
                const filterTrue = personalityFilterTrue && starFilterTrue;
                if (!filterTrue) return null;
                return (
                  <div
                    key={charaName}
                    className={cn(
                      "aspect-square rounded cursor-pointer min-w-16 min-h-16 sm:min-w-18 sm:min-h-18 max-w-24 max-h-24 relative overflow-hidden",
                      personalityBG[charaPersonality],
                      {
                        "opacity-50 brightness-75":
                          alreadyUsings.includes(charaName),
                        "ring-2 ring-primary": selectedChara === charaName,
                      }
                    )}
                    onClick={() => setSelectedChara(charaName)}
                  >
                    <div className="w-full h-full aspect-square object-cover overflow-hidden">
                      <img
                        src={getCharaImageUrl(
                          currentCharaSkin
                            ? `${charaName}Skin${currentCharaSkin}`
                            : `${charaName}`,
                          isAF && "af"
                        )}
                        alt={t(`chara.${charaName}`)}
                        className={cn(
                          "w-full aspect-square",
                          isAF && "scale-125"
                        )}
                      />
                    </div>
                    <div className="h-8 pb-px absolute bottom-0 w-full left-0 right-0 text-shadow-glow flex justify-center items-end leading-none break-keep text-xs text-center">
                      {t(`chara.${charaName}`)}
                    </div>
                  </div>
                );
              })}
          </div>
        </ScrollArea>
        <DialogFooter className="gap-0.5">
          <DialogClose asChild>
            <Button
              type="reset"
              variant="outline"
              size="sm"
              onClick={cancelHandler}
            >
              {t("ui.common.no")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="reset"
              variant="destructive"
              size="sm"
              onClick={resetHandler}
              disabled={!currentChara}
            >
              {t("ui.teambuilder.emptyThisSlot")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              size="sm"
              onClick={confirmHandler}
              disabled={!selectedChara}
            >
              {t("ui.common.yes")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CharaPicker;
