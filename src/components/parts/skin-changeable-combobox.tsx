import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import icSearch from "@/lib/initialConsonantSearch";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import chara from "@/data/chara";

interface IComboboxOuterProp {
  value: string;
  onChange: (value: string) => void;
}

const SkinChangeableCombobox = ({ value, onChange }: IComboboxOuterProp) => {
  const { t } = useTranslation();
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
          className="w-40 sm:w-64 justify-between font-onemobile"
        >
          {v ? v : t("ui.tasksearch.selectCharacter")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 sm:w-64 p-0 font-onemobile">
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
          <CommandGroup>
            {Object.keys(chara)
              .filter((c) => chara[c].s)
              .sort((a, b) => t(`chara.${a}`).localeCompare(t(`chara.${b}`)))
              .map((charaId) => (
                <CommandItem
                  key={charaId}
                  value={t(`chara.${charaId}`)}
                  onSelect={(currentValue) => {
                    setV(currentValue === v ? "" : currentValue);
                    onChange(currentValue === v ? "" : charaId);
                    setOpen(false);
                  }}
                >
                  {t(`chara.${charaId}`)}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      v === t(`chara.${charaId}`) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SkinChangeableCombobox;
