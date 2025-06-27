import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
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

type DispatchArg<T> = T | ((prev: T) => T);
type DispatchType<T> = (arg: DispatchArg<T>) => void;

interface SpellPickerProps {
  currentUsingSpells: Record<string, number>;
  spellLevels: Record<string, number>;
  onChange: DispatchType<Record<string, number>>;
  onReset: () => void;
  disableAll?: boolean;
  disableList?: number[];
  disableMinCost?: number | false;
}

const SpellPicker = ({
  currentUsingSpells,
  spellLevels,
  onChange,
  onReset,
  disableAll,
  disableList,
  disableMinCost,
}: SpellPickerProps) => {
  const { t } = useTranslation();
  const [statFilter, setStatFilter] = useState<StatType[]>([]);

  const filterResetHandler = useCallback(() => {
    setStatFilter([]);
  }, []);
  const resetHandler = useCallback(() => {
    onReset();
    filterResetHandler();
  }, [filterResetHandler, onReset]);
  const confirmHandler = useCallback(() => {
    filterResetHandler();
  }, [filterResetHandler]);

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm">{t("ui.teambuilder.spellToUse")}</Button>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-normal">
            {t("ui.teambuilder.spellToUse")}
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
            {card.s.o.map((spellId) => {
              const spellInfo = card.s.l[spellId];
              const spellUsingCount = currentUsingSpells[spellId] || 0;
              const spellCostInfo = spellInfo.p;
              const spellCost = Array.isArray(spellCostInfo)
                ? spellCostInfo[spellLevels[spellId] - 1]
                : spellCostInfo;
              const disabled =
                spellInfo.l < 1 ||
                spellUsingCount >= spellInfo.l ||
                disableAll ||
                disableList?.includes(spellId) ||
                (typeof disableMinCost === "number" &&
                  spellCost > disableMinCost);
              const spellRarity = spellInfo.r;
              const filterTrue =
                statFilter.length > 0
                  ? spellInfo.s.some((s) => statFilter.includes(s))
                  : true;
              if (!filterTrue) return null;
              return (
                <div key={spellId} className="w-fit relative">
                  <div
                    className={cn(
                      "aspect-square rounded cursor-pointer min-w-16 min-h-16 sm:min-w-18 sm:min-h-18 max-w-24 max-h-24 relative overflow-hidden",
                      "border-2 border-transparent",
                      disabled
                        ? "opacity-50 brightness-75 cursor-not-allowed"
                        : "cursor-pointer"
                    )}
                    style={{
                      backgroundImage: `url(/ingameui/Ingame_CardBase_Spell_${card.r[spellRarity].s}.png)`,
                      backgroundColor: card.r[spellRarity].b,
                      backgroundSize: "cover",
                    }}
                    onClick={() => {
                      if (!disabled)
                        onChange((prv) => {
                          const prev = { ...prv };
                          prev[spellId] = Math.min(
                            (prev[spellId] || 0) + 1,
                            spellInfo.l
                          );
                          return prev;
                        });
                    }}
                  >
                    <div className="w-full h-full">
                      <img
                        src={`/spells/SpellCardIcon_${spellId}.png`}
                        alt={t(`card.spell.${spellId}.title`)}
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                    <div className="h-8 pb-px absolute bottom-0 w-full left-0 right-0 text-shadow-glow flex justify-center items-end leading-none break-keep text-xs text-center">
                      {t(`card.spell.${spellId}.title`)}
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
                    {spellCost}
                  </div>
                  <div
                    className={cn(
                      "flex flex-row justify-between items-center p-1"
                    )}
                  >
                    <div>
                      {spellUsingCount}/{spellInfo.l}
                    </div>
                    <div>
                      <X
                        className={cn("cursor-pointer w-5 h-5 text-red-500", !currentUsingSpells[spellId] && "opacity-50")}
                        strokeWidth={3}
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange((prv) => {
                            const prev = { ...prv };
                            prev[spellId] = 0;
                            return prev;
                          });
                        }}
                      />
                    </div>
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
              variant="destructive"
              size="sm"
              onClick={resetHandler}
            >
              {t("ui.teambuilder.emptyAll")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" size="sm" onClick={confirmHandler}>
              {t("ui.common.yes")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpellPicker;
