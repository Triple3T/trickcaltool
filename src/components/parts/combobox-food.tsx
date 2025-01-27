import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronsUpDown, Check } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import icSearch from "@/lib/initialConsonantSearch";
import food from "@/data/food";

interface IComboboxOuterProp {
  value: string;
  onChange: (value: string) => void;
}
const ComboboxFood = ({ value, onChange }: IComboboxOuterProp) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [v, setV] = useState<string>(value ? t(`food.${value}`) : "");
  const [searchValue, setSearchValue] = useState<string>("");
  const [tab, setTab] = useState<string>("Normal");
  useEffect(() => {
    setV(value ? t(`food.${value}`) : "");
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
          {v ? v : t("ui.restaurant.selectFood")}
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
            placeholder={t("ui.restaurant.searchFood")}
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>{t("ui.restaurant.foodNotFound")}</CommandEmpty>
          <div className="p-2 flex flex-row gap-1.5 items-center">
            {!searchValue && (
              <Tabs value={tab} onValueChange={setTab} className="flex-1">
                <TabsList className="flex">
                  <TabsTrigger value="Normal" className="flex-1">
                    {t("ui.restaurant.normalFood")}
                  </TabsTrigger>
                  <TabsTrigger value="Upgrade" className="flex-1">
                    {t("ui.restaurant.upgradeFood")}
                  </TabsTrigger>
                  <TabsTrigger value="Event" className="flex-1">
                    {t("ui.restaurant.eventFood")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
          <ScrollArea className="max-h-[70vh] [&_[data-radix-scroll-area-viewport]]:max-h-[70vh]">
            <CommandList>
              {(tab === "Normal" || searchValue) && (
                <CommandGroup
                  heading={t("ui.restaurant.normalFood")}
                  className="[&_[cmdk-group-items]]:grid [&_[cmdk-group-items]]:grid-cols-2 md:[&_[cmdk-group-items]]:grid-cols-3 [&_[cmdk-group-items]]:gap-1 p-2"
                >
                  {Object.entries(food.f)
                    .filter(([, foodInfo]) => foodInfo.u)
                    .sort(
                      ([a, aInfo], [b, bInfo]) =>
                        bInfo.r - aInfo.r ||
                        t(`food.${a}`).localeCompare(t(`food.${b}`))
                    )
                    .map(([foodId, foodInfo]) => {
                      const selected = v === t(`food.${foodId}`);
                      return (
                        <CommandItem
                          key={foodId}
                          value={t(`food.${foodId}`)}
                          onSelect={(currentValue) => {
                            setV(currentValue === v ? "" : currentValue);
                            onChange(currentValue === v ? "" : foodId);
                            setOpen(false);
                          }}
                          style={{
                            backgroundColor: `${food.r[foodInfo.r].b}7F`,
                          }}
                        >
                          <div className="w-full relative flex flex-col items-center py-0.5 hover:scale-110 hover:z-10 transition-transform duration-100">
                            <div
                              className="text-sm text-center break-keep absolute h-12 -top-1 flex items-center"
                              // style={{
                              // textShadow: Array(20)
                              //   .fill(`0 0 1.2px ${food.r[food.f[foodId].r].b}`)
                              //   .join(", "),
                              // }}
                            >
                              {t(`food.${foodId}`)}
                            </div>
                            <div className="flex w-[5.8125rem] h-[5.8125rem] md:w-[calc(19.375rem_/_3)] md:h-[calc(19.375rem_/_3)] px-4 pt-6 pb-3 mt-4 justify-center items-end bg-dish bg-cover bg-no-repeat">
                              <img
                                src={`/foods/Icon_Food_${foodId}.png`}
                                className="max-w-full max-h-full"
                              />
                            </div>
                            {selected && (
                              <div className="h-6 w-6 p-1 absolute -top-0.5 -right-1 rounded-full bg-slate-100/80 dark:bg-slate-900/80">
                                <Check className="w-full h-full" />
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      );
                    })}
                </CommandGroup>
              )}
              {(tab === "Upgrade" || searchValue) && (
                <CommandGroup
                  heading={t("ui.restaurant.upgradeFood")}
                  className="[&_[cmdk-group-items]]:grid [&_[cmdk-group-items]]:grid-cols-2 md:[&_[cmdk-group-items]]:grid-cols-3 [&_[cmdk-group-items]]:gap-1 p-2"
                >
                  {Object.entries(food.f)
                    .filter(([, foodInfo]) => foodInfo.d)
                    .sort(
                      ([a, aInfo], [b, bInfo]) =>
                        bInfo.r - aInfo.r ||
                        t(`food.${a}`).localeCompare(t(`food.${b}`))
                    )
                    .map(([foodId, foodInfo]) => {
                      const selected = v === t(`food.${foodId}`);
                      return (
                        <CommandItem
                          key={foodId}
                          value={t(`food.${foodId}`)}
                          onSelect={(currentValue) => {
                            setV(currentValue === v ? "" : currentValue);
                            onChange(currentValue === v ? "" : foodId);
                            setOpen(false);
                          }}
                          style={{
                            backgroundColor: `${food.r[foodInfo.r].b}7F`,
                          }}
                        >
                          <div className="w-full relative flex flex-col items-center py-0.5 hover:scale-110 hover:z-10 transition-transform duration-100">
                            <div
                              className="text-sm text-center break-keep absolute h-12 -top-1 flex items-center"
                              // style={{
                              // textShadow: Array(20)
                              //   .fill(`0 0 1.2px ${food.r[food.f[foodId].r].b}`)
                              //   .join(", "),
                              // }}
                            >
                              {t(`food.${foodId}`)}
                            </div>
                            <div className="flex w-[5.8125rem] h-[5.8125rem] md:w-[calc(19.375rem_/_3)] md:h-[calc(19.375rem_/_3)] px-4 pt-6 pb-3 mt-4 justify-center items-end bg-dish bg-cover bg-no-repeat">
                              <img
                                src={`/foods/Icon_Food_${foodId}.png`}
                                className="max-w-full max-h-full"
                              />
                            </div>
                            {selected && (
                              <div className="h-6 w-6 p-1 absolute -top-0.5 -right-1 rounded-full bg-slate-100/80 dark:bg-slate-900/80">
                                <Check className="w-full h-full" />
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      );
                    })}
                </CommandGroup>
              )}
              {(tab === "Event" || searchValue) && (
                <CommandGroup
                  heading={t("ui.restaurant.eventFood")}
                  className="[&_[cmdk-group-items]]:grid [&_[cmdk-group-items]]:grid-cols-2 md:[&_[cmdk-group-items]]:grid-cols-3 [&_[cmdk-group-items]]:gap-1 p-2"
                >
                  {Object.entries(food.f)
                    .filter(([, foodInfo]) => !foodInfo.t)
                    .sort(
                      ([a, aInfo], [b, bInfo]) =>
                        bInfo.r - aInfo.r ||
                        t(`food.${a}`).localeCompare(t(`food.${b}`))
                    )
                    .map(([foodId, foodInfo]) => {
                      const selected = v === t(`food.${foodId}`);
                      return (
                        <CommandItem
                          key={foodId}
                          value={t(`food.${foodId}`)}
                          onSelect={(currentValue) => {
                            setV(currentValue === v ? "" : currentValue);
                            onChange(currentValue === v ? "" : foodId);
                            setOpen(false);
                          }}
                          style={{
                            backgroundColor: `${food.r[foodInfo.r].b}7F`,
                          }}
                        >
                          <div className="w-full relative flex flex-col items-center py-0.5 hover:scale-110 hover:z-10 transition-transform duration-100">
                            <div
                              className="text-sm text-center break-keep absolute h-12 -top-1 flex items-center"
                              // style={{
                              // textShadow: Array(20)
                              //   .fill(`0 0 1.2px ${food.r[food.f[foodId].r].b}`)
                              //   .join(", "),
                              // }}
                            >
                              {t(`food.${foodId}`)}
                            </div>
                            <div className="flex w-[5.8125rem] h-[5.8125rem] md:w-[calc(19.375rem_/_3)] md:h-[calc(19.375rem_/_3)] px-4 pt-6 pb-3 mt-4 justify-center items-end bg-dish bg-cover bg-no-repeat">
                              <img
                                src={`/foods/Icon_Food_${foodId}.png`}
                                className="max-w-full max-h-full"
                              />
                            </div>
                            {selected && (
                              <div className="h-6 w-6 p-1 absolute -top-0.5 -right-1 rounded-full bg-slate-100/80 dark:bg-slate-900/80">
                                <Check className="w-full h-full" />
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      );
                    })}
                </CommandGroup>
              )}
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxFood;
