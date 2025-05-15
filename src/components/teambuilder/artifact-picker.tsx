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
import card from "@/data/card";
import { StatType } from "@/types/enums";

interface ArtifactPickerProps {
  currentArtifact: number;
  artifactLevels: Record<string, number>;
  targetChara: string;
  onChange: (artifact: number) => void;
  onReset: () => void;
  disableAll?: boolean;
  disableList?: number[];
  disableMinCost?: number | false;
}

const ArtifactPicker = ({
  currentArtifact,
  artifactLevels,
  targetChara,
  onChange,
  onReset,
  disableAll,
  disableList,
  disableMinCost,
}: ArtifactPickerProps) => {
  const { t } = useTranslation();
  const [selectedArtifact, setSelectedArtifact] = useState<number>(0);
  const [statFilter, setStatFilter] = useState<StatType[]>([]);

  const filterResetHandler = useCallback(() => {
    setStatFilter([]);
  }, []);
  const cancelHandler = useCallback(() => {
    setSelectedArtifact(0);
    filterResetHandler();
  }, [filterResetHandler]);
  const resetHandler = useCallback(() => {
    setSelectedArtifact(0);
    onReset();
    filterResetHandler();
  }, [filterResetHandler, onReset]);
  const confirmHandler = useCallback(() => {
    setSelectedArtifact(0);
    onChange(selectedArtifact);
    filterResetHandler();
  }, [filterResetHandler, onChange, selectedArtifact]);

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
          <DialogTitle className="font-normal">
            {t(`chara.${targetChara}`)}{" "}
            {t("ui.teambuilder.selectArtifactTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-row gap-0.5 max-h-10">
          {[
            StatType.Hp,
            StatType.AttackPhysic,
            StatType.AttackMagic,
            StatType.DefensePhysic,
            StatType.DefenseMagic,
            StatType.CriticalRate,
            StatType.CriticalMult,
            StatType.CriticalResist,
            StatType.CriticalMultResist,
            StatType.AttackSpeed,
          ].map((stat) => {
            const statString = StatType[stat];
            return (
              <div
                key={stat}
                className={cn(
                  "rounded aspect-square cursor-pointer p-1 flex-auto max-h-10",
                  statFilter.includes(stat) && "bg-accent"
                )}
                onClick={() => {
                  setStatFilter((prev) => {
                    if (prev.includes(stat)) {
                      return prev.filter((s) => s !== stat);
                    } else {
                      return [...prev, stat];
                    }
                  });
                }}
              >
                <img
                  src={`/icons/Icon_${statString}.png`}
                  className="w-full aspect-square"
                />
              </div>
            );
          })}
        </div>
        <ScrollArea className="bg-accent/50 rounded-lg max-h-[300px]">
          <div className="grid px-2 py-4 gap-x-2 gap-y-4 grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(4.5rem,_1fr))] auto-rows-auto">
            {card.a.o.map((artifactId) => {
              const artifactInfo = card.a.l[artifactId];
              const artifactCostInfo = artifactInfo.p;
              const artifactCost = Array.isArray(artifactCostInfo)
                ? artifactCostInfo[artifactLevels[artifactId] - 1]
                : artifactCostInfo;
              const disabled =
                artifactInfo.l < 1 ||
                disableAll ||
                disableList?.includes(artifactId) ||
                (typeof disableMinCost === "number" &&
                  artifactCost > disableMinCost);
              const artifactRarity = artifactInfo.r;
              const isSignature = artifactInfo.a?.t === targetChara;
              const filterTrue =
                statFilter.length > 0
                  ? artifactInfo.s.some((s) => statFilter.includes(s))
                  : true;
              if (!filterTrue) return null;
              return (
                <div key={artifactId} className="w-fit relative">
                  <div
                    className={cn(
                      "aspect-square rounded cursor-pointer min-w-16 min-h-16 sm:min-w-18 sm:min-h-18 max-w-24 max-h-24 relative overflow-hidden",
                      isSignature
                        ? "border-2 border-accent"
                        : "border-2 border-transparent",
                      disabled
                        ? "opacity-50 brightness-75 cursor-not-allowed"
                        : "cursor-pointer",
                      {
                        "ring-2 ring-primary": selectedArtifact === artifactId,
                      }
                    )}
                    style={{
                      backgroundImage: `url(/ingameui/Ingame_CardBase_Artifact_${
                        card.r[isSignature ? 0 : artifactRarity].s
                      }.png)`,
                      backgroundColor:
                        card.r[isSignature ? 0 : artifactRarity].b,
                      backgroundSize: "cover",
                    }}
                    onClick={() => {
                      if (!disabled) setSelectedArtifact(artifactId);
                    }}
                  >
                    <div className="w-full h-full px-3 py-2">
                      <img
                        src={`/artifacts/ArtifactIcon_${artifactId}.png`}
                        alt={t(`card.artifact.${artifactId}.title`)}
                        className="max-w-full max-h-full mx-auto"
                      />
                    </div>
                    <div className="h-8 pb-px absolute bottom-0 w-full left-0 right-0 text-shadow-glow flex justify-center items-end leading-none break-keep text-xs text-center">
                      {t(`card.artifact.${artifactId}.title`)}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "bg-cover w-6 h-6 text-shadow-glow-2 flex justify-center items-center absolute left-1/2 -translate-x-1/2 -top-2",
                      disabled
                        ? "opacity-50 brightness-75 cursor-not-allowed"
                        : "cursor-pointer"
                    )}
                    style={{
                      backgroundImage: "url(/ingameui/Ingame_Cost_Small.png)",
                    }}
                  >
                    {artifactCost}
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
              disabled={!currentArtifact}
            >
              {t("ui.teambuilder.emptyThisSlot")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              size="sm"
              onClick={confirmHandler}
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
