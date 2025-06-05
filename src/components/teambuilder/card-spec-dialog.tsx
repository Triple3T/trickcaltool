import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import LazyInput from "@/components/common/lazy-input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import card from "@/data/card";
import { StatType } from "@/types/enums";

type DispatchArg<T> = T | ((prev: T) => T);
type DispatchType<T> = (arg: DispatchArg<T>) => void;
type CardSpecType = Record<"a" | "s", Record<string, number>>;

interface CardSpecDialogProps {
  cardLevels: CardSpecType;
  onChange: DispatchType<CardSpecType>;
}

const CardSpecDialog = ({ cardLevels, onChange }: CardSpecDialogProps) => {
  const { t } = useTranslation();
  const [cardType, setCardType] = useState<string>("artifact");
  const [gradeFilter, setGradeFilter] = useState<number>(0);

  return (
    <Dialog>
      <DialogTrigger>
        <Button>{t("ui.teambuilder.cardSpecAccordion")}</Button>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-normal">
            {t("ui.teambuilder.cardSpecAccordion")}
          </DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue={cardType}
          onValueChange={setCardType}
          className="w-full flex"
        >
          <TabsList className="flex-1 flex">
            <TabsTrigger value="artifact" className="flex-1">
              {t("ui.teambuilder.textArtifact")}
            </TabsTrigger>
            <TabsTrigger value="spell" className="flex-1">
              {t("ui.teambuilder.textSpell")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="artifact"></TabsContent>
          <TabsContent value="spell"></TabsContent>
        </Tabs>
        <div className="flex flex-row gap-2 max-h-10">
          {[1, 2, 3, 4, 0].map((grade) => {
            if (grade === 0) {
              return (
                <div
                  key={grade}
                  className={cn(
                    "rounded aspect-square cursor-pointer p-1 max-h-10 text-shadow-glow flex-1 flex justify-center items-center",
                    gradeFilter === 0 && "ring-2 ring-accent"
                  )}
                  onClick={() => {
                    setGradeFilter(0);
                  }}
                >
                  {t(`ui.teambuilder.cardGradeAll`)}
                </div>
              );
            }
            const backgroundColor = card.r[grade].b;
            return (
              <div
                key={grade}
                className={cn(
                  "rounded aspect-square cursor-pointer p-1 max-h-10 text-shadow-glow flex-1 flex justify-center items-center",
                  gradeFilter === grade && "ring-2 ring-accent"
                )}
                onClick={() => {
                  setGradeFilter(grade);
                }}
                style={{
                  backgroundColor,
                }}
              >
                {t(`ui.teambuilder.cardGrade${grade}`)}
              </div>
            );
          })}
        </div>
        <ScrollArea className="bg-accent/50 rounded-lg max-h-[300px]">
          <div className="flex flex-col p-2 gap-4">
            {card[cardType === "artifact" ? "a" : "s"].o.map((cardId) => {
              const cardInfo =
                card[cardType === "artifact" ? "a" : "s"].l[cardId];
              const cardLevel =
                cardLevels[cardType === "artifact" ? "a" : "s"][cardId];
              const cardCostInfo = cardInfo.p;
              const cardCost = Array.isArray(cardCostInfo)
                ? cardCostInfo[cardLevel - 1]
                : cardCostInfo;
              const cardMaxLevel = Array.isArray(cardInfo.c[0])
                ? cardInfo.c[0].filter((v) => v > 0).length
                : Array.isArray(cardInfo.p)
                ? cardInfo.p.filter((v) => v > 0).length
                : 1;
              const cardRarity = cardInfo.r;
              const isSignature = "a" in cardInfo;
              const filterTrue =
                gradeFilter > 0 ? gradeFilter === cardRarity : true;
              if (!filterTrue) return null;
              return (
                <div key={cardId} className="flex flex-row gap-2">
                  <div
                    className={cn(
                      "aspect-square rounded cursor-pointer min-w-16 min-h-16 sm:min-w-18 sm:min-h-18 max-w-24 max-h-24 relative overflow-hidden",
                      isSignature
                        ? "border-2 border-accent"
                        : "border-2 border-transparent"
                    )}
                    style={{
                      backgroundImage: `url(/ingameui/Ingame_CardBase_Artifact_${
                        card.r[isSignature ? 0 : cardRarity].s
                      }.webp)`,
                      backgroundColor: card.r[isSignature ? 0 : cardRarity].b,
                      backgroundSize: "cover",
                    }}
                  >
                    <div
                      className={cn(
                        "w-full h-full",
                        cardType === "artifact" && "px-3 py-2"
                      )}
                    >
                      <img
                        src={`/${cardType}s/${
                          cardType === "artifact" ? "Artifact" : "SpellCard"
                        }Icon_${cardId}.webp`}
                        alt={t(`card.${cardType}.${cardId}.title`)}
                        className="max-w-full max-h-full mx-auto"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-row gap-1">
                      <div
                        className="bg-cover w-6 h-6 text-shadow-glow-2 flex justify-center items-center"
                        style={{
                          backgroundImage:
                            "url(/ingameui/Ingame_Cost_Small.webp)",
                        }}
                      >
                        {cardCost}
                      </div>
                      <div>{t(`card.${cardType}.${cardId}.title`)}</div>
                    </div>
                    <div className="flex flex-row gap-2">
                      {cardInfo.s.length
                        ? cardInfo.s.map((s, i) => {
                            const stat = s as StatType;
                            const statString = StatType[stat];
                            const statValue = (cardInfo.c[i] as number[])[
                              cardLevel - 1
                            ];
                            return (
                              <div key={i}>
                                <img
                                  src={`/icons/Icon_${statString}.webp`}
                                  alt={statString}
                                  className="w-5 h-5 inline-block"
                                />
                                +{statValue / 100}%
                              </div>
                            );
                          })
                        : "　"}
                    </div>
                    <div className="flex flex-row gap-2 items-baseline">
                      <div>{t("ui.teambuilder.cardLevelBefore")}</div>
                      <LazyInput
                        value={`${cardLevel}`}
                        sanitize={(v) =>
                          `${Math.max(
                            1,
                            Math.min(
                              cardMaxLevel,
                              parseInt(v.replaceAll(/\D/g, "") || "0") || 0
                            )
                          )}`
                        }
                        onValueChange={(e) =>
                          onChange((prev) => {
                            const newLevels = {
                              a: { ...prev.a },
                              s: { ...prev.s },
                            };
                            newLevels[cardType === "artifact" ? "a" : "s"][
                              cardId
                            ] = parseInt(e);
                            return newLevels;
                          })
                        }
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{0,2}"
                        min={1}
                        max={cardMaxLevel}
                        className="text-left w-16"
                      />
                      <div className="flex-1" />
                      <div className="text-sm">
                        {t("ui.teambuilder.cardLevelMaxBefore")}
                        {cardMaxLevel}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <DialogFooter className="gap-0.5">
          <DialogClose asChild>
            <Button type="submit" size="sm">
              {t("ui.common.yes")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CardSpecDialog;
