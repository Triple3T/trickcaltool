import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
// import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import icSearch from "@/lib/initialConsonantSearch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import CharaWithLifeskill from "@/components/parts/chara-with-lifeskill";
const CharaWithLifeskill = lazy(
  () => import("@/components/parts/chara-with-lifeskill")
);
import ItemSlot from "@/components/parts/item-slot";
import LifeskillIcon from "@/components/parts/lifeskill-icon";
import {
  personalityBG,
  personalityBGDisabled,
  personalityBGMarked,
} from "@/utils/personalityBG";
import { Personality } from "@/types/enums";

import chara from "@/data/chara";
import lifeskill from "@/data/lifeskill";
import material from "@/data/material";
import task from "@/data/task";

interface IComboboxOuterProp {
  value: string;
  onChange: (value: string) => void;
}

const CharacterCombobox = ({ value, onChange }: IComboboxOuterProp) => {
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
                            src={`/charas/${charaId}.png`}
                            className="w-full aspect-square"
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
const LifeskillCombobox = ({ value, onChange }: IComboboxOuterProp) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value);
  useEffect(() => {
    setV(value ? t(`lifeskill.${value}`) : "");
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
          {v ? v : t("ui.tasksearch.selectLifeskill")}
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
            placeholder={t("ui.tasksearch.searchLifeskill")}
            className="h-9"
          />
          <CommandEmpty>{t("ui.tasksearch.lifeskillNotFound")}</CommandEmpty>
          <ScrollArea className="max-h-[70vh] [&_[data-radix-scroll-area-viewport]]:max-h-[70vh]">
            <CommandList>
              <CommandGroup className="[&_[cmdk-group-items]]:grid [&_[cmdk-group-items]]:grid-cols-3 md:[&_[cmdk-group-items]]:grid-cols-5 [&_[cmdk-group-items]]:gap-1 p-2">
                {Array(lifeskill.n)
                  .fill(0)
                  .map((_, lifeskillIndex) => {
                    const selected = v === t(`lifeskill.${lifeskillIndex + 1}`);
                    return (
                      <CommandItem
                        key={lifeskillIndex + 1}
                        value={t(`lifeskill.${lifeskillIndex + 1}`)}
                        onSelect={(currentValue) => {
                          setV(currentValue === v ? "" : currentValue);
                          onChange(
                            currentValue === v ? "" : `${lifeskillIndex + 1}`
                          );
                          setOpen(false);
                        }}
                      >
                        <div className="w-full relative flex flex-col items-center">
                          <LifeskillIcon
                            id={lifeskillIndex + 1}
                            size="default"
                            additionalClassName="-mx-3 -my-2"
                          />
                          <div className="text-sm text-center">
                            {t(`lifeskill.${lifeskillIndex + 1}`)}
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
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
const TaskCombobox = ({ value, onChange }: IComboboxOuterProp) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value);
  useEffect(() => {
    setV(value ? t(`task.${value}`) : "");
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
          {v ? v : t("ui.tasksearch.selectTask")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0 font-onemobile">
        <Command
          filter={(value, search) =>
            value.includes(search) || icSearch(value, search) ? 1 : 0
          }
        >
          <CommandInput
            placeholder={t("ui.tasksearch.searchTask")}
            className="h-9"
          />
          <CommandEmpty>{t("ui.tasksearch.taskNotFound")}</CommandEmpty>
          <ScrollArea className="max-h-[70vh] [&_[data-radix-scroll-area-viewport]]:max-h-[70vh]">
            <CommandList>
              <CommandGroup>
                {Object.keys(task.t).map((taskId) => (
                  <CommandItem
                    key={taskId}
                    value={t(`task.${taskId}`)}
                    onSelect={(currentValue) => {
                      setV(currentValue === v ? "" : currentValue);
                      onChange(currentValue === v ? "" : taskId);
                      setOpen(false);
                    }}
                  >
                    {t(`task.${taskId}`)}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        v === t(`task.${taskId}`) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
const MaterialCombobox = ({ value, onChange }: IComboboxOuterProp) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value);
  useEffect(() => {
    setV(value ? t(`material.${value}`) : "");
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
          {v ? v : t("ui.tasksearch.selectMaterial")}
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
            placeholder={t("ui.tasksearch.searchMaterial")}
            className="h-9"
          />
          <CommandEmpty>{t("ui.tasksearch.materialNotFound")}</CommandEmpty>
          <ScrollArea className="max-h-[70vh] [&_[data-radix-scroll-area-viewport]]:max-h-[70vh]">
            <CommandList>
              <CommandGroup className="[&_[cmdk-group-items]]:grid [&_[cmdk-group-items]]:grid-cols-3 md:[&_[cmdk-group-items]]:grid-cols-5 [&_[cmdk-group-items]]:gap-1 p-2">
                {Object.entries(material.m)
                  .filter(([, materialInfo]) => materialInfo.g)
                  .map(([materialId, materialInfo]) => {
                    const selected = v === t(`material.${materialId}`);
                    return (
                      <CommandItem
                        key={materialId}
                        value={t(`material.${materialId}`)}
                        onSelect={(currentValue) => {
                          setV(currentValue === v ? "" : currentValue);
                          onChange(currentValue === v ? "" : materialId);
                          setOpen(false);
                        }}
                      >
                        <div className="w-full h-full relative flex flex-col items-center justify-start">
                          <ItemSlot
                            rarityInfo={material.r[materialInfo.r]}
                            item={materialId}
                            size={3}
                          />
                          <div className="text-sm text-center">
                            {t(`material.${materialId}`)}
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
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const TaskSearch = () => {
  const { t } = useTranslation();
  const [selectedChara, setSelectedChara] = useState("");
  const [selectedLifeskill, setSelectedLifeskill] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [bannedIndex, setBannedIndex] = useState<number[]>([]);
  const searchChara = useCallback((charaId: string) => {
    setSelectedChara(charaId);
    setSelectedLifeskill("");
    setSelectedTask("");
    setSelectedMaterial("");
    setBannedIndex([]);
  }, []);
  const searchLifeskill = useCallback((lifeskillId: string) => {
    setSelectedChara("");
    setSelectedLifeskill(lifeskillId);
    setSelectedTask("");
    setSelectedMaterial("");
    setBannedIndex([]);
  }, []);
  const searchTask = useCallback((taskId: string) => {
    setSelectedChara("");
    setSelectedLifeskill("");
    setSelectedTask(taskId);
    setSelectedMaterial("");
    setBannedIndex([]);
  }, []);
  const searchMaterial = useCallback((materialId: string) => {
    setSelectedChara("");
    setSelectedLifeskill("");
    setSelectedTask("");
    setSelectedMaterial(materialId);
    setBannedIndex([]);
  }, []);

  return (
    <>
      <div className="w-full h-4" />
      <Card className="mx-auto w-max max-w-full p-4 font-onemobile">
        <div className="flex flex-col p-2 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 p-2 gap-2">
            <CharacterCombobox value={selectedChara} onChange={searchChara} />
            <LifeskillCombobox
              value={selectedLifeskill}
              onChange={searchLifeskill}
            />
            <TaskCombobox value={selectedTask} onChange={searchTask} />
            <MaterialCombobox
              value={selectedMaterial}
              onChange={searchMaterial}
            />
          </div>
          {selectedChara && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-32 flex-initial flex flex-row gap-4">
                <div className="w-24 sm:w-full aspect-square">
                  <img
                    src={`/charas/${selectedChara}.png`}
                    alt=""
                    className="w-full aspect-square"
                  />
                </div>
                <div className="text-left text-2xl sm:hidden min-w-max">
                  {t(`chara.${selectedChara}`)}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="text-left text-2xl hidden sm:block">
                  {t(`chara.${selectedChara}`)}
                </div>
                <div className="flex flex-row flex-wrap gap-2 sm:gap-3 md:gap-4 justify-evenly sm:justify-start max-w-[279px] sm:max-w-full">
                  {lifeskill.c[selectedChara].s.map((lifeskillId, index) => {
                    return (
                      <LifeskillIcon
                        id={lifeskillId}
                        size="large"
                        additionalClassName={
                          bannedIndex.includes(index)
                            ? "grayscale-[0.75] opacity-50 mb-8 sm:mb-0"
                            : "mb-8"
                        }
                        key={index}
                        onClick={() => {
                          if (index)
                            setBannedIndex((prev) =>
                              prev.includes(index)
                                ? prev.filter((i) => i !== index)
                                : [...prev, index]
                            );
                        }}
                        showName
                        nameClassName="mt-1.5"
                      />
                    );
                  })}
                  <div className="w-16 h-16 sm:hidden" />
                </div>
                <div className="text-sm text-left text-slate-700 dark:text-slate-300 break-keep">
                  {t("ui.tasksearch.skillSelectHelp")
                    .split("\n")
                    .map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                </div>
              </div>
            </div>
          )}
          {selectedLifeskill && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <LifeskillIcon
                  id={selectedLifeskill}
                  active
                  size="small"
                  additionalClassName="-mx-1"
                />
                <div className="text-2xl text-right py-2">
                  {t(`lifeskill.${selectedLifeskill}`)}
                </div>
              </div>
              <div>
                <div className="text-left p-1">
                  {t("ui.tasksearch.materialsEasyToGet")}
                </div>
                <div className="flex flex-row gap-1 flex-wrap py-1">
                  {[
                    ...new Set(
                      Object.values(task.t)
                        .filter((t) => t.s.includes(Number(selectedLifeskill)))
                        .map(({ m }) => m)
                        .flat()
                    ),
                  ].map((materialId) => {
                    if (materialId.startsWith("_scheduleBox")) {
                      return (
                        <ItemSlot
                          key={materialId}
                          rarityInfo={material.r[2]}
                          item={`/icons/Schedule_Box${
                            materialId.split(".")[1]
                          }`}
                          fullItemPath
                          size={3}
                        />
                      );
                    }
                    return (
                      <ItemSlot
                        key={materialId}
                        rarityInfo={material.r[material.m[materialId].r]}
                        item={materialId}
                        size={3}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {selectedTask && (
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-evenly p-4 gap-4">
              <div className="w-64 rounded-xl p-4 ring-4 bg-taskcard text-taskcard-foreground ring-taskcard-border">
                <div className="pl-2 mb-1">
                  <div className="pr-2 pb-2 pt-px bg-contain bg-no-repeat bg-center bg-task-title">
                    <div className="text-xl">{t(`task.${selectedTask}`)}</div>
                  </div>
                </div>
                <div className="w-full relative aspect-[254/176]">
                  <img
                    className="w-full aspect-[254/176] dark:contrast-125 dark:brightness-80"
                    src={`/tasks/Img_${selectedTask}_Back.png`}
                  />
                  {task.t[selectedTask].f && (
                    <img
                      className="absolute bottom-0 left-0 dark:contrast-125 dark:brightness-80"
                      src={`/tasks/Img_${selectedTask}_Front.png`}
                      style={{ width: `${task.t[selectedTask].f}%` }}
                    />
                  )}
                  <div className="absolute bottom-0 left-0 flex items-end">
                    <LifeskillIcon
                      id={task.t[selectedTask].s[0]}
                      active={!bannedIndex.includes(task.t[selectedTask].s[0])}
                      additionalClassName="scale-125"
                    />
                    {task.t[selectedTask].s
                      .slice(1)
                      .map((lifeskillId, index) => {
                        return (
                          <LifeskillIcon
                            id={lifeskillId}
                            active={!bannedIndex.includes(lifeskillId)}
                            size="small"
                            key={index}
                            additionalClassName="-mx-1"
                          />
                        );
                      })}
                  </div>
                </div>
                <div className="flex flex-row flex-wrap gap-2 p-2 mt-2 justify-center">
                  {task.t[selectedTask].m.map((materialId, index) => {
                    if (materialId.startsWith("_scheduleBox")) {
                      return (
                        <ItemSlot
                          key={index}
                          rarityInfo={material.r[2]}
                          item={`/icons/Schedule_Box${
                            materialId.split(".")[1]
                          }`}
                          fullItemPath
                          size={3.5}
                        />
                      );
                    }
                    const currrentMaterial = material.m[materialId];
                    return (
                      <ItemSlot
                        key={index}
                        rarityInfo={material.r[currrentMaterial.r]}
                        item={materialId}
                        size={3.5}
                      />
                    );
                  })}
                </div>
              </div>
              <Accordion type="single" collapsible className="w-64">
                {task.t[selectedTask].s.map((lifeskillId, index) => {
                  return (
                    <AccordionItem
                      value={`item-${index}-task-${selectedTask}`}
                      key={index}
                    >
                      <AccordionTrigger className="text-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden inline-block">
                          <img
                            className="w-full h-full"
                            src={`/schedule/LifeSkill${lifeskillId}.png`}
                          />
                        </div>
                        {t(`lifeskill.${lifeskillId}`)}
                      </AccordionTrigger>
                      <AccordionContent className="text-base">
                        <div className="my-2 text-left flex items-center gap-2">
                          <Switch
                            id={`include-this-skill-${index}-task-${selectedTask}`}
                            checked={!bannedIndex.includes(lifeskillId)}
                            onCheckedChange={(c) => {
                              if (c) {
                                setBannedIndex((prev) =>
                                  prev.filter((i) => i !== lifeskillId)
                                );
                              } else {
                                setBannedIndex((prev) => [
                                  ...prev,
                                  lifeskillId,
                                ]);
                              }
                            }}
                          />
                          <Label
                            htmlFor={`include-this-skill-${index}-task-${selectedTask}`}
                          >
                            {t("ui.tasksearch.includeThisSkill")}
                          </Label>
                        </div>
                        <div className="flex flex-col gap-1">
                          {Object.entries(task.t)
                            .filter(
                              ([t, { s }]) =>
                                s.includes(lifeskillId) && t !== selectedTask
                            )
                            .map(([taskId, { m }]) => {
                              return (
                                <div
                                  key={taskId}
                                  className="flex flex-row gap-2.5 items-center"
                                >
                                  <div className="text-sm">
                                    {t(`task.${taskId}`)}
                                  </div>
                                  <div className="flex flex-row gap-1 h-8">
                                    {m.map((materialId, index) => {
                                      if (
                                        materialId.startsWith("_scheduleBox")
                                      ) {
                                        return (
                                          <ItemSlot
                                            key={index}
                                            rarityInfo={material.r[2]}
                                            item={`/icons/Schedule_Box${
                                              materialId.split(".")[1]
                                            }`}
                                            fullItemPath
                                            size={2}
                                          />
                                        );
                                      }
                                      const currrentMaterial =
                                        material.m[materialId];
                                      return (
                                        <ItemSlot
                                          key={index}
                                          rarityInfo={
                                            material.r[currrentMaterial.r]
                                          }
                                          item={materialId}
                                          size={2}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          )}
          {selectedMaterial && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <ItemSlot
                  rarityInfo={material.r[material.m[selectedMaterial].r]}
                  item={selectedMaterial}
                  size={3}
                />
                <div className="text-2xl text-right py-2">
                  {t(`material.${selectedMaterial}`)}
                </div>
              </div>
              <div>
                <div className="text-left p-1">
                  {t("ui.tasksearch.materialUsage")}
                </div>
                <div className="flex flex-row gap-1 flex-wrap py-1">
                  {Object.entries(material.m)
                    .filter(([, materialInfo]) =>
                      materialInfo.m
                        ? Object.keys(materialInfo.m).includes(selectedMaterial)
                        : false
                    )
                    .map(([materialId]) => {
                      return (
                        <ItemSlot
                          key={materialId}
                          rarityInfo={material.r[material.m[materialId].r]}
                          item={materialId}
                          size={3}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          )}
          {!selectedChara &&
            !selectedLifeskill &&
            !selectedTask &&
            !selectedMaterial &&
            t("ui.tasksearch.needToSelect")}
        </div>
      </Card>
      {!selectedLifeskill && !selectedTask && !selectedMaterial && (
        <div className="font-onemobile flex flex-wrap gap-6 p-4 justify-center">
          {Object.keys(task.t).map((taskId) => {
            const currentTask = task.t[taskId];
            if (
              selectedChara &&
              currentTask.s.every(
                (lsid) =>
                  !lifeskill.c[selectedChara].s
                    .filter((_, i) => !bannedIndex.includes(i))
                    .includes(lsid)
              )
            )
              return null;
            const { c } = task.t[taskId];
            if (c && selectedChara) {
              if ("a" in c && !c.a.includes(selectedChara)) return null;
              if ("d" in c && c.d.includes(selectedChara)) return null;
            }
            return (
              <div
                key={taskId}
                className="w-72 rounded-xl p-4 ring-4 bg-taskcard text-taskcard-foreground ring-taskcard-border"
              >
                <div className="pl-2 mb-1">
                  <div className="pr-2 pb-2.5 pt-0.5 bg-contain bg-no-repeat bg-center bg-task-title">
                    <div className="text-xl">{t(`task.${taskId}`)}</div>
                  </div>
                </div>
                <div className="w-full relative aspect-[254/176]">
                  <img
                    className="w-full aspect-[254/176] dark:contrast-125 dark:brightness-80"
                    src={`/tasks/Img_${taskId}_Back.png`}
                  />
                  {currentTask.f && (
                    <img
                      className="absolute bottom-0 left-0 dark:contrast-125 dark:brightness-80"
                      src={`/tasks/Img_${taskId}_Front.png`}
                      style={{ width: `${currentTask.f}%` }}
                    />
                  )}
                  <div className="absolute bottom-0 left-0 flex items-end">
                    <LifeskillIcon
                      id={currentTask.s[0]}
                      active={(selectedChara
                        ? lifeskill.c[selectedChara].s.filter(
                            (_, i) => !bannedIndex.includes(i)
                          )
                        : []
                      ).includes(currentTask.s[0])}
                      additionalClassName="scale-125"
                    />
                    {currentTask.s.slice(1).map((lifeskillId, index) => {
                      return (
                        <LifeskillIcon
                          key={index}
                          id={lifeskillId}
                          active={(selectedChara
                            ? lifeskill.c[selectedChara].s.filter(
                                (_, i) => !bannedIndex.includes(i)
                              )
                            : []
                          ).includes(lifeskillId)}
                          size="small"
                          additionalClassName="-mx-1"
                        />
                      );
                    })}
                  </div>
                  <div className="absolute right-0 top-0 p-1 m-1.5 ring-2 ring-taskcard-border rounded-sm bg-taskcard">
                    <Search
                      className="w-3 h-3"
                      strokeWidth={3}
                      onClick={() => searchTask(taskId)}
                    />
                  </div>
                </div>
                <div className="flex flex-row flex-wrap gap-2 p-2 mt-2 justify-center">
                  {currentTask.m.map((materialId, index) => {
                    if (materialId.startsWith("_scheduleBox")) {
                      return (
                        <ItemSlot
                          key={index}
                          rarityInfo={material.r[2]}
                          item={`/icons/Schedule_Box${
                            materialId.split(".")[1]
                          }`}
                          fullItemPath
                          size={3.5}
                        />
                      );
                    }
                    const currrentMaterial = material.m[materialId];
                    return (
                      <ItemSlot
                        key={index}
                        rarityInfo={material.r[currrentMaterial.r]}
                        item={materialId}
                        size={3.5}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {selectedLifeskill && (
        <div className="font-onemobile flex flex-col p-4">
          <Tabs defaultValue="Chara">
            <TabsList className="flex">
              <TabsTrigger value="Chara" className="flex-1">
                {t("ui.tasksearch.matchCharacter")}
              </TabsTrigger>
              <TabsTrigger value="Task" className="flex-1">
                {t("ui.tasksearch.matchTask")}
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="Chara"
              className="flex flex-wrap mt-6 gap-6 justify-center"
            >
              {Object.entries(chara)
                .filter(
                  ([charaId, v]) =>
                    v.t[1] !== "1" &&
                    lifeskill.c[charaId].s.includes(Number(selectedLifeskill))
                )
                .sort(([a], [b]) => {
                  return (
                    (lifeskill.c[a].s.indexOf(Number(selectedLifeskill)) && 1) -
                      (lifeskill.c[b].s.indexOf(Number(selectedLifeskill)) &&
                        1) || t(`chara.${a}`).localeCompare(t(`chara.${b}`))
                  );
                })
                .map(([charaId]) => {
                  const cls = lifeskill.c[charaId].s;
                  return (
                    <Suspense
                      key={charaId}
                      fallback={
                        <Loader2
                          className="w-4 h-4 animate-spin absolute right-0"
                          strokeWidth={3}
                        />
                      }
                    >
                      <CharaWithLifeskill
                        charaId={charaId}
                        lifeskills={cls}
                        selectedLifeskills={[Number(selectedLifeskill)]}
                        searchChara={searchChara}
                      />
                    </Suspense>
                  );
                })}
            </TabsContent>
            <TabsContent
              value="Task"
              className="flex flex-wrap mt-6 gap-6 justify-center"
            >
              {Object.entries(task.t)
                .filter(([, taskInfo]) =>
                  taskInfo.s.includes(Number(selectedLifeskill))
                )
                .map(([taskId, taskInfo]) => {
                  return (
                    <div
                      key={taskId}
                      className="w-72 rounded-xl p-4 ring-4 bg-taskcard text-taskcard-foreground ring-taskcard-border"
                    >
                      <div className="pl-2 mb-1">
                        <div className="pr-2 pb-2.5 pt-0.5 bg-contain bg-no-repeat bg-center bg-task-title">
                          <div className="text-xl">{t(`task.${taskId}`)}</div>
                        </div>
                      </div>
                      <div className="w-full relative aspect-[254/176]">
                        <img
                          className="w-full aspect-[254/176] dark:contrast-125 dark:brightness-80"
                          src={`/tasks/Img_${taskId}_Back.png`}
                        />
                        {taskInfo.f && (
                          <img
                            className="absolute bottom-0 left-0 dark:contrast-125 dark:brightness-80"
                            src={`/tasks/Img_${taskId}_Front.png`}
                            style={{ width: `${taskInfo.f}%` }}
                          />
                        )}
                        <div className="absolute bottom-0 left-0 flex items-end">
                          <LifeskillIcon
                            id={taskInfo.s[0]}
                            active={taskInfo.s[0] === Number(selectedLifeskill)}
                            additionalClassName="scale-125"
                          />
                          {taskInfo.s.slice(1).map((lifeskillId, index) => {
                            return (
                              <LifeskillIcon
                                key={index}
                                id={lifeskillId}
                                active={
                                  lifeskillId === Number(selectedLifeskill)
                                }
                                size="small"
                                additionalClassName="-mx-1"
                              />
                            );
                          })}
                        </div>
                        <div className="absolute right-0 top-0 p-1 m-1.5 ring-2 ring-taskcard-border rounded-sm bg-taskcard">
                          <Search
                            className="w-3 h-3"
                            strokeWidth={3}
                            onClick={() => searchTask(taskId)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-row flex-wrap gap-2 p-2 mt-2 justify-center">
                        {taskInfo.m.map((materialId, index) => {
                          if (materialId.startsWith("_scheduleBox")) {
                            return (
                              <ItemSlot
                                key={index}
                                rarityInfo={material.r[2]}
                                item={`/icons/Schedule_Box${
                                  materialId.split(".")[1]
                                }`}
                                fullItemPath
                                size={3.5}
                              />
                            );
                          }
                          const currrentMaterial = material.m[materialId];
                          return (
                            <ItemSlot
                              key={index}
                              rarityInfo={material.r[currrentMaterial.r]}
                              item={materialId}
                              size={3.5}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </TabsContent>
          </Tabs>
        </div>
      )}
      {selectedTask && (
        <div className="font-onemobile flex flex-wrap gap-6 p-4 justify-center">
          {Object.entries(chara)
            .filter(([charaId, v]) => {
              const firstFilter =
                v.t[1] !== "1" &&
                task.t[selectedTask].s
                  .filter((lfs) => !bannedIndex.includes(lfs))
                  .some((lfs) => lifeskill.c[charaId].s.includes(lfs));
              if (!firstFilter) return false;
              const { c } = task.t[selectedTask];
              if (!c) return true;
              if ("a" in c) return c.a.includes(charaId);
              if ("d" in c) return !c.d.includes(charaId);
            })
            .sort(([a], [b]) => {
              return (
                lifeskill.c[b].s.filter((lfs) =>
                  task.t[selectedTask].s.includes(lfs)
                ).length -
                  lifeskill.c[a].s.filter((lfs) =>
                    task.t[selectedTask].s.includes(lfs)
                  ).length || t(`chara.${a}`).localeCompare(t(`chara.${b}`))
              );
            })
            .map(([charaId]) => {
              const cls = lifeskill.c[charaId].s;
              return (
                <Suspense
                  key={charaId}
                  fallback={
                    <Loader2
                      className="w-4 h-4 animate-spin absolute right-0"
                      strokeWidth={3}
                    />
                  }
                >
                  <CharaWithLifeskill
                    charaId={charaId}
                    lifeskills={cls}
                    selectedLifeskills={task.t[selectedTask].s}
                    searchChara={searchChara}
                  />
                </Suspense>
              );
            })}
        </div>
      )}
      {selectedMaterial && (
        <div className="font-onemobile flex flex-col p-4">
          <Tabs defaultValue="Chara">
            <TabsList className="flex">
              <TabsTrigger value="Chara" className="flex-1">
                {t("ui.tasksearch.matchCharacter")}
              </TabsTrigger>
              <TabsTrigger value="Task" className="flex-1">
                {t("ui.tasksearch.matchTask")}
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="Chara"
              className="flex flex-wrap mt-6 gap-6 justify-center"
            >
              {(() => {
                const taskLineup: Array<
                  [
                    string,
                    {
                      score: number;
                      skillset: number[];
                      charaLimit?: { a: string[] } | { d: string[] };
                    },
                  ]
                > = Object.entries(task.t)
                  .filter(([, taskInfo]) =>
                    taskInfo.m.includes(selectedMaterial)
                  )
                  .map(([taskId, taskInfo]) => [
                    taskId,
                    {
                      score: [4, 2, 1][taskInfo.m.indexOf(selectedMaterial)],
                      skillset: taskInfo.s,
                      charaLimit: taskInfo.c,
                    },
                  ]);
                const skillLineup = [
                  ...new Set(
                    taskLineup.map(([, { skillset }]) => skillset).flat()
                  ),
                ];
                return Object.entries(chara)
                  .filter(
                    ([charaId, v]) =>
                      v.t[1] !== "1" &&
                      lifeskill.c[charaId].s.some((charaSkillEntry) =>
                        skillLineup.includes(charaSkillEntry)
                      )
                  )
                  .map(([a]) => {
                    const getFinalScore = (charaId: string) => {
                      const [charaMainSkill, ...charaSubSkills] =
                        lifeskill.c[charaId].s;
                      return taskLineup
                        .map(([, { score, skillset, charaLimit }]) => {
                          if (charaLimit) {
                            if (
                              "a" in charaLimit &&
                              !charaLimit.a.includes(charaId)
                            )
                              return 0;
                            else if (
                              "d" in charaLimit &&
                              charaLimit.d.includes(charaId)
                            )
                              return 0;
                          }
                          const [taskMainSkill, ...taskSubSkills] = skillset;
                          const bothMainSkillScore =
                            skillset[0] === charaMainSkill ? 7 : 0;
                          const charaMainSkillScore = taskSubSkills.includes(
                            charaMainSkill
                          )
                            ? 6
                            : 0;
                          const taskMainSkillScore = charaSubSkills.includes(
                            taskMainSkill
                          )
                            ? 4
                            : 0;
                          const bothSubSkillScore =
                            taskSubSkills.filter((s) =>
                              charaSubSkills.includes(s)
                            ).length * 3;
                          return (
                            score *
                            (bothMainSkillScore +
                              charaMainSkillScore +
                              taskMainSkillScore +
                              bothSubSkillScore)
                          );
                        })
                        .reduce((p, c) => p + c, 0);
                    };
                    return { charaId: a, score: getFinalScore(a) };
                  })
                  .filter((c) => c.score)
                  .sort((a, b) => {
                    return (
                      b.score - a.score ||
                      t(`chara.${a.charaId}`).localeCompare(
                        t(`chara.${b.charaId}`)
                      )
                    );
                  })
                  .map(({ charaId }) => {
                    const cls = lifeskill.c[charaId].s;
                    return (
                      <Suspense
                        key={charaId}
                        fallback={
                          <Loader2
                            className="w-4 h-4 animate-spin absolute right-0"
                            strokeWidth={3}
                          />
                        }
                      >
                        <CharaWithLifeskill
                          charaId={charaId}
                          lifeskills={cls}
                          selectedLifeskills={skillLineup}
                          searchChara={searchChara}
                        />
                      </Suspense>
                    );
                  });
              })()}
            </TabsContent>
            <TabsContent
              value="Task"
              className="flex flex-wrap mt-6 gap-6 justify-center"
            >
              {Object.entries(task.t)
                .filter(([, taskInfo]) => taskInfo.m.includes(selectedMaterial))
                .map(([taskId, taskInfo]) => {
                  return (
                    <div
                      key={taskId}
                      className="w-72 rounded-xl p-4 ring-4 bg-taskcard text-taskcard-foreground ring-taskcard-border"
                    >
                      <div className="pl-2 mb-1">
                        <div className="pr-2 pb-2.5 pt-0.5 bg-contain bg-no-repeat bg-center bg-task-title">
                          <div className="text-xl">{t(`task.${taskId}`)}</div>
                        </div>
                      </div>
                      <div className="w-full relative aspect-[254/176]">
                        <img
                          className="w-full aspect-[254/176] dark:contrast-125 dark:brightness-80"
                          src={`/tasks/Img_${taskId}_Back.png`}
                        />
                        {taskInfo.f && (
                          <img
                            className="absolute bottom-0 left-0 dark:contrast-125 dark:brightness-80"
                            src={`/tasks/Img_${taskId}_Front.png`}
                            style={{ width: `${taskInfo.f}%` }}
                          />
                        )}
                        <div className="absolute bottom-0 left-0 flex items-end">
                          <LifeskillIcon
                            id={taskInfo.s[0]}
                            additionalClassName="scale-125"
                          />
                          {taskInfo.s.slice(1).map((lifeskillId, index) => {
                            return (
                              <LifeskillIcon
                                key={index}
                                id={lifeskillId}
                                size="small"
                                additionalClassName="-mx-1"
                              />
                            );
                          })}
                        </div>
                        <div className="absolute right-0 top-0 p-1 m-1.5 ring-2 ring-taskcard-border rounded-sm bg-taskcard">
                          <Search
                            className="w-3 h-3"
                            strokeWidth={3}
                            onClick={() => searchTask(taskId)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-row flex-wrap gap-2 p-2 mt-2 justify-center">
                        {taskInfo.m.map((materialId, index) => {
                          if (materialId.startsWith("_scheduleBox")) {
                            return (
                              <ItemSlot
                                key={index}
                                rarityInfo={material.r[2]}
                                item={`/icons/Schedule_Box${
                                  materialId.split(".")[1]
                                }`}
                                fullItemPath
                                size={3.5}
                              />
                            );
                          }
                          const currrentMaterial = material.m[materialId];
                          return (
                            <ItemSlot
                              key={index}
                              rarityInfo={material.r[currrentMaterial.r]}
                              item={materialId}
                              size={3.5}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default TaskSearch;
