import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronsUpDown, Check } from "lucide-react";
import icSearch from "@/lib/initialConsonantSearch";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandItem,
  Command,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  personalityBGDisabled,
  personalityBG,
  personalityBGMarked,
} from "@/utils/personalityBG";
import chara from "@/data/chara";
import { Personality } from "@/types/enums";
import { useUserDataCharaInfo } from "@/stores/useUserDataStore";

// af
import { useIsAFActive } from "@/stores/useAFDataStore";
import { getCharaImageUrl } from "@/utils/getImageUrl";

interface IComboboxOuterProp {
  value: string;
  onChange: (value: string) => void;
}

const ComboboxCharacterOnestarDisabled = ({
  value,
  onChange,
}: IComboboxOuterProp) => {
  const { t } = useTranslation();
  const isAF = useIsAFActive();
  const userCharaInfo = useUserDataCharaInfo();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value ? t(`chara.${value}`) : "");
  useEffect(() => {
    setV(value ? t(`chara.${value}`) : "");
  }, [t, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-60 justify-between font-onemobile"
        >
          {v ? v : t("ui.tasksearch.selectCharacter")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 md:w-96 p-0 font-onemobile">
        <Command
          filter={(value, search) =>
            value.includes(search) || icSearch(value, search) ? 1 : 0
          }
        >
          <CommandInput
            placeholder={t("ui.tasksearch.searchCharacter")}
            className="h-9"
          />
          <CommandEmpty>{t("ui.tasksearch.characterNotFound")}</CommandEmpty>
          <ScrollArea className="max-h-[70vh] [&_[data-radix-scroll-area-viewport]]:max-h-[70vh]">
            <CommandList>
              <CommandGroup className="[&_[cmdk-group-items]]:grid [&_[cmdk-group-items]]:grid-cols-2 md:[&_[cmdk-group-items]]:grid-cols-3 [&_[cmdk-group-items]]:gap-1 p-2">
                {Object.keys(chara)
                  .sort((a, b) =>
                    t(`chara.${a}`).localeCompare(t(`chara.${b}`))
                  )
                  .map((charaId) => {
                    const disabled = chara[charaId].t[1] === "1";
                    const selected = v === t(`chara.${charaId}`);
                    const bg = (() => {
                      if (disabled)
                        return personalityBGDisabled[
                          Number(chara[charaId].t[0]) as Personality
                        ];
                      if (selected)
                        return personalityBG[
                          Number(chara[charaId].t[0]) as Personality
                        ];
                      return personalityBGMarked[
                        Number(chara[charaId].t[0]) as Personality
                      ];
                    })();
                    return (
                      <CommandItem
                        key={charaId}
                        className={cn(
                          "p-0 rounded-lg",
                          disabled && "data-disabled"
                        )}
                        value={t(`chara.${charaId}`)}
                        disabled={disabled}
                        onSelect={(currentValue) => {
                          setV(currentValue === v ? "" : currentValue);
                          onChange(currentValue === v ? "" : charaId);
                          setOpen(false);
                        }}
                      >
                        <div
                          className={cn(
                            "w-full aspect-square relative rounded-lg overflow-hidden border border-background flex",
                            "hover:scale-110 hover:z-10 transition-transform duration-100",
                            bg
                          )}
                        >
                          <img
                            src={getCharaImageUrl(
                              userCharaInfo?.[charaId].skin
                                ? `${charaId}Skin${userCharaInfo?.[charaId].skin}`
                                : `${charaId}`,
                              isAF && "af-i"
                            )}
                            className={cn(
                              "w-full aspect-square",
                              isAF && "scale-125"
                            )}
                          />
                          <div className="w-full absolute text-center text-sm py-0.5 bottom-0 left-0 bg-slate-100/90 dark:bg-slate-900/90">
                            {t(`chara.${charaId}`)}
                          </div>
                          {selected && (
                            <div className="h-6 w-6 p-1 absolute top-1 right-1 rounded-full bg-slate-100/80 dark:bg-slate-900/80">
                              <Check className="w-full h-full" />
                            </div>
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxCharacterOnestarDisabled;
