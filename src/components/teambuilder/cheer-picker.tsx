import { useCallback } from "react";
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
import cheer from "@/data/cheer";

type DispatchArg<T> = T | ((prev: T) => T);
type DispatchType<T> = (arg: DispatchArg<T>) => void;

interface CheerPickerProps {
  currentUsingCheers: Record<string, number>;
  onChange: DispatchType<Record<string, number>>;
  onReset: () => void;
  disableAll?: boolean;
  disableList?: number[];
  disableMinCost?: number | false;
}

const CheerPicker = ({
  currentUsingCheers,
  onChange,
  onReset,
  disableAll,
  disableList,
  disableMinCost,
}: CheerPickerProps) => {
  const { t } = useTranslation();

  const resetHandler = useCallback(() => {
    onReset();
  }, [onReset]);
  const confirmHandler = useCallback(() => {}, []);

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm">{t("ui.teambuilder.cheerToUse")}</Button>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-normal">
            {t("ui.teambuilder.cheerToUse")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="bg-accent/50 rounded-lg max-h-[300px]">
          <div className="grid px-2 py-4 gap-x-2 gap-y-4 grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(4.5rem,_1fr))] auto-rows-auto">
            {cheer.o.map((cheerId) => {
              const cheerInfo = cheer.c[cheerId];
              const cheerUsingCount = currentUsingCheers[cheerId] || 0;
              const cheerCost =
                cheerInfo.firstPrice *
                cheerInfo.purchaseMult **
                  Math.min(cheerUsingCount, cheerInfo.purchaseLimit - 1);
              const disabled =
                cheerInfo.purchaseLimit < 1 ||
                cheerUsingCount >= cheerInfo.purchaseLimit ||
                disableAll ||
                disableList?.includes(cheerId) ||
                (typeof disableMinCost === "number" &&
                  cheerCost > disableMinCost);
              return (
                <div key={cheerId} className="w-fit relative">
                  <div
                    className={cn(
                      "aspect-square rounded cursor-pointer min-w-16 min-h-16 sm:min-w-18 sm:min-h-18 max-w-24 max-h-24 relative overflow-hidden",
                      "border-2 border-transparent",
                      disabled
                        ? "opacity-50 brightness-75 cursor-not-allowed"
                        : "cursor-pointer"
                    )}
                    style={{
                      backgroundImage: `url(/ingameui/Ingame_CardBase_Spell_Grade_4.png)`,
                      backgroundColor: "#b371f7",
                      backgroundSize: "cover",
                    }}
                    onClick={() => {
                      if (!disabled)
                        onChange((prv) => {
                          const prev = { ...prv };
                          prev[cheerId] = Math.min(
                            (prev[cheerId] || 0) + 1,
                            cheerInfo.purchaseLimit
                          );
                          return prev;
                        });
                    }}
                  >
                    <div className="w-full h-full">
                      <img
                        src={`/spells/CheerCardIcon_${cheerId}.png`}
                        alt={t(`card.cheer.${cheerId}.title`)}
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                    <div className="h-8 pb-px absolute bottom-0 w-full left-0 right-0 text-shadow-glow flex justify-center items-end leading-none break-keep text-xs text-center">
                      {t(`card.cheer.${cheerId}.title`)}
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
                    {cheerCost}
                  </div>
                  <div
                    className={cn(
                      "flex flex-row justify-between items-center p-1"
                    )}
                  >
                    <div>
                      {cheerUsingCount}/{cheerInfo.purchaseLimit}
                    </div>
                    <div>
                      <X
                        className={cn(
                          "cursor-pointer w-5 h-5 text-red-500",
                          !currentUsingCheers[cheerId] && "opacity-50"
                        )}
                        strokeWidth={3}
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange((prv) => {
                            const prev = { ...prv };
                            prev[cheerId] = 0;
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

export default CheerPicker;
