import { useState } from "react";
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
import chara from "@/data/chara";
import { personalityBG } from "@/utils/personalityBG";
import { Personality, Position } from "@/types/enums";
import { ScrollArea } from "../ui/scroll-area";

interface CharaPickerProps {
  currentChara: string;
  positionables: string[];
  alreadyUsings: string[];
  onChange: (chara: string) => void;
  onReset: () => void;
  position: Position;
}

const CharaPicker = ({
  currentChara,
  positionables,
  alreadyUsings,
  onChange,
  onReset,
  position,
}: CharaPickerProps) => {
  const { t } = useTranslation();
  const charaPersonality: Personality = currentChara
    ? Number(chara[currentChara].t.charAt(0))
    : -1;
  const [selectedChara, setSelectedChara] = useState<string>("");

  return (
    <Dialog>
      <DialogTrigger>
        <img
          src={
            currentChara
              ? `/charas/${currentChara}.png`
              : "/ingameui/Ingame_Artifact_HeroEmpty.png"
          }
          alt={t(
            currentChara
              ? `chara.${currentChara}`
              : "ui.teambuilder.emptyCharaSlot"
          )}
          className={cn(
            "w-full sm:w-7/8 md:w-3/4 sm:mx-auto aspect-square rounded-[27.5%]",
            currentChara ? personalityBG[charaPersonality] : "",
            currentChara ? "ring-4 ring-background/25 ring-inset" : ""
          )}
        />
      </DialogTrigger>
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {t(`position.${Position[position]}`)}{" "}
            {t("ui.teambuilder.selectCharaTitle")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="bg-accent/50 rounded-lg max-h-[300px]">
          <div className="grid p-2 gap-2 grid-cols-[repeat(auto-fill,_minmax(3rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] auto-rows-auto">
            {positionables
              .sort((a, b) => t(`chara.${a}`).localeCompare(t(`chara.${b}`)))
              .map((charaName) => {
                const charaPersonality: Personality = Number(
                  chara[charaName].t.charAt(0)
                );
                return (
                  <div
                    key={charaName}
                    className={cn(
                      "aspect-square rounded cursor-pointer min-w-12 min-h-12 sm:min-w-14 sm:min-h-14 max-w-24 max-h-24 relative overflow-hidden",
                      personalityBG[charaPersonality],
                      {
                        "opacity-50 brightness-75":
                          alreadyUsings.includes(charaName),
                        "ring-2 ring-primary": selectedChara === charaName,
                      }
                    )}
                    onClick={() => setSelectedChara(charaName)}
                  >
                    <img
                      src={`/charas/${charaName}.png`}
                      alt={t(`chara.${charaName}`)}
                      className="w-full h-full aspect-square object-cover"
                    />
                    <div className="h-8 pb-px absolute bottom-0 w-full left-0 right-0 text-shadow-glow flex justify-center items-end leading-none break-keep text-xs text-center">
                      {t(`chara.${charaName}`)}
                    </div>
                  </div>
                );
              })}
          </div>
        </ScrollArea>
        <div className=""></div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="reset"
              variant="outline"
              onClick={() => setSelectedChara("")}
            >
              {t("ui.common.no")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="reset"
              variant="destructive"
              onClick={onReset}
              disabled={!currentChara}
            >
              {t("ui.teambuilder.emptyThisSlot")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              onClick={() => onChange(selectedChara)}
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
