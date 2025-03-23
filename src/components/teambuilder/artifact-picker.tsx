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
import { ScrollArea } from "../ui/scroll-area";
import card from "@/data/card";

interface CharaPickerProps {
  currentArtifact: number;
  targetChara: string;
  onChange: (artifact: number) => void;
  onReset: () => void;
  disableAll?: boolean;
  disableList?: number[];
}

const ArtifactPicker = ({
  currentArtifact,
  targetChara,
  onChange,
  onReset,
  disableAll,
  disableList,
}: CharaPickerProps) => {
  const { t } = useTranslation();
  const [selectedArtifact, setSelectedArtifact] = useState<number>(0);

  if (!targetChara)
    return (
      <img
        src="/ingameui/Ingame_ArtifactBase_Empty.png"
        alt="empty"
        className="w-8 h-8 min-[342px]:w-9 min-[342px]:h-9 sm:w-12 sm:h-12"
      />
    );

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="w-8 h-8 min-[342px]:w-9 min-[342px]:h-9 sm:w-12 sm:h-12 flex items-center justify-center"
          style={
            currentArtifact
              ? {
                  backgroundImage: `url(/ingameui/Ingame_ArtifactBase_Rarity_${
                    card.a.l[currentArtifact]?.a?.t === targetChara
                      ? "SignatureCard"
                      : card.a.l[currentArtifact].r
                  }.png)`,
                  backgroundSize: "cover",
                }
              : undefined
          }
        >
          <img
            src={
              currentArtifact
                ? `/artifacts/ArtifactIcon_${currentArtifact}.png`
                : "/ingameui/Ingame_ArtifactBase_Empty.png"
            }
            alt={t(
              currentArtifact
                ? `card.artifact.${currentArtifact}.title`
                : "ui.teambuilder.emptyArtifactSlot"
            )}
            className="max-w-full max-h-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {t(`chara.${targetChara}`)}{" "}
            {t("ui.teambuilder.selectArtifactTitle")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="bg-accent/50 rounded-lg max-h-[300px]">
          <div className="grid p-2 gap-2 grid-cols-[repeat(auto-fill,_minmax(3rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] auto-rows-auto">
            {card.a.o.map((artifactId) => {
              const disabled = disableAll || disableList?.includes(artifactId);
              const artifactRarity = card.a.l[artifactId].r;
              const isSignature = card.a.l[artifactId].a?.t === targetChara;
              return (
                <div
                  key={artifactId}
                  className={cn(
                    "aspect-square rounded cursor-pointer min-w-12 min-h-12 sm:min-w-14 sm:min-h-14 max-w-24 max-h-24 relative overflow-hidden",
                    isSignature
                      ? "border-2 border-accent"
                      : "border-2 border-transparent",
                    disabled
                      ? "opacity-50 brightness-75 cursor-not-allowed"
                      : "cursor-pointer"
                  )}
                  style={{
                    backgroundImage: `url(/ingameui/Ingame_CardBase_Artifact_${
                      card.r[isSignature ? 0 : artifactRarity].s
                    }.png)`,
                    backgroundColor: card.r[isSignature ? 0 : artifactRarity].b,
                    backgroundSize: "cover",
                  }}
                  onClick={() => {
                    if (!disabled) setSelectedArtifact(artifactId);
                  }}
                >
                  <div className="w-full h-full px-3 py-1">
                    <img
                      src={`/artifacts/ArtifactIcon_${artifactId}.png`}
                      alt={t(`card.artifact.${artifactId}.title`)}
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                  <div className="h-8 pb-px absolute bottom-0 w-full left-0 right-0 text-shadow-glow flex justify-center items-end leading-none break-keep text-xs text-center">
                    {t(`card.artifact.${artifactId}.title`)}
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
              onClick={() => setSelectedArtifact(0)}
            >
              {t("ui.common.no")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="reset"
              variant="destructive"
              onClick={onReset}
              disabled={!currentArtifact}
            >
              {t("ui.teambuilder.emptyThisSlot")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              onClick={() => onChange(selectedArtifact)}
              disabled={!selectedArtifact}
            >
              {t("ui.common.yes")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArtifactPicker;
