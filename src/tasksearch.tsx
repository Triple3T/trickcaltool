import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown } from "lucide-react";
// import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import Layout from "@/components/layout";
import ItemSlot from "@/components/parts/item-slot";

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
      <PopoverContent className="w-60 p-0 font-onemobile">
        <Command>
          <CommandInput
            placeholder={t("ui.tasksearch.searchCharacter")}
            className="h-9"
          />
          <CommandEmpty>{t("ui.tasksearch.characterNotFound")}</CommandEmpty>
          <CommandGroup>
            {Object.keys(chara)
              .sort((a, b) => t(`chara.${a}`).localeCompare(t(`chara.${b}`)))
              .map((charaId) => (
                <CommandItem
                  key={charaId}
                  value={t(`chara.${charaId}`)}
                  disabled={chara[charaId].t[1] === "1"}
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
const LifeskillCombobox = ({ value, onChange }: IComboboxOuterProp) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value);
  useEffect(() => {
    onChange(v);
  }, [onChange, v]);

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
        <Command>
          <CommandInput
            placeholder={t("ui.tasksearch.searchTask")}
            className="h-9"
          />
          <CommandEmpty>{t("ui.tasksearch.taskNotFound")}</CommandEmpty>
          <CommandGroup>
            {Array(lifeskill.n)
              .fill(0)
              .map((_, lifeskillIndex) => (
                <CommandItem
                  key={lifeskillIndex}
                  value={t(`lifeskill.${lifeskillIndex + 1}`)}
                  onSelect={(currentValue) => {
                    setV(currentValue === v ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {t(`lifeskill.${lifeskillIndex + 1}`)}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      v === t(`lifeskill.${lifeskillIndex + 1}`)
                        ? "opacity-100"
                        : "opacity-0"
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
const TaskCombobox = ({ value, onChange }: IComboboxOuterProp) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value);
  useEffect(() => {
    onChange(v);
  }, [onChange, v]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-60 justify-between"
        >
          {v ? v : t("ui.tasksearch.selectTask")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <Command>
          <CommandInput
            placeholder={t("ui.tasksearch.searchTask")}
            className="h-9"
          />
          <CommandEmpty>{t("ui.tasksearch.taskNotFound")}</CommandEmpty>
          <CommandGroup>
            {Object.keys(task.t).map((taskId) => (
              <CommandItem
                key={taskId}
                value={t(`task.${taskId}`)}
                onSelect={(currentValue) => {
                  setV(currentValue === v ? "" : currentValue);
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
  const [bannedIndex, setBannedIndex] = useState<number[]>([]);
  useEffect(() => {
    setBannedIndex([]);
  }, [selectedChara]);
  return (
    <Layout>
      <div className="w-full h-4" />
      <Card className="mx-auto w-max max-w-full p-4 font-onemobile">
        <div className="flex flex-col p-2 gap-4">
          <div className="flex flex-row p-2 gap-2">
            <CharacterCombobox
              value={selectedChara}
              onChange={setSelectedChara}
            />
            {/* <LifeskillCombobox
              value={selectedLifeskill}
              onChange={setSelectedLifeskill}
            /> */}
            {/* <TaskCombobox value={selectedTask} onChange={setSelectedTask} /> */}
          </div>
          {selectedChara ? (
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
                <div className="flex flex-row flex-wrap gap-2">
                  {lifeskill.c[selectedChara].s.map((lifeskillId, index) => {
                    return (
                      <div
                        key={index}
                        className={
                          bannedIndex.includes(index)
                            ? "grayscale-[0.75] opacity-50"
                            : ""
                        }
                        onClick={() => {
                          if (index)
                            setBannedIndex((prev) =>
                              prev.includes(index)
                                ? prev.filter((i) => i !== index)
                                : [...prev, index]
                            );
                        }}
                      >
                        <div className="w-16 h-16 relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img
                              src={`/schedule/LifeSkill${lifeskillId}.png`}
                              className="w-full h-full aspect-square"
                              alt=""
                            />
                          </div>
                          <img
                            className="w-16 h-16 absolute top-0 left-0 aspect-square"
                            src={`/schedule/IconSkillBorder.png`}
                          />
                        </div>
                        <div>{t(`lifeskill.${lifeskillId}`)}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm text-left text-slate-700 dark:text-slate-300">
                  {t("ui.tasksearch.skillSelectHelp")
                    .split("\n")
                    .map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            t("ui.tasksearch.needToSelectCharacter")
          )}
        </div>
      </Card>
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
          return (
            <div
              key={taskId}
              className="w-72 rounded-xl p-4 ring-4 bg-[#f7faef] text-[#5d3d30] ring-[#e2dbc8]"
            >
              <div className="pl-4 mb-1">
                <div
                  className="pr-4 pb-1.5 pt-0.5 bg-contain bg-no-repeat"
                  style={{
                    backgroundImage: "url(/schedule/Deco_Task_Colored.png)",
                  }}
                >
                  <div className="text-xl">{t(`task.${taskId}`)}</div>
                </div>
              </div>
              <div className="w-full relative aspect-[254/176]">
                <img
                  className="w-full aspect-[254/176]"
                  src={`/tasks/Img_${taskId}_Back.png`}
                />
                {currentTask.f && (
                  <img
                    className="absolute bottom-0 left-0"
                    src={`/tasks/Img_${taskId}_Front.png`}
                    style={{ width: `${currentTask.f}%` }}
                  />
                )}
                <div className="absolute bottom-0 left-0 flex items-end">
                  <div className="w-16 h-16 relative scale-125">
                    <div className="p-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          className="w-full h-full"
                          src={`/schedule/LifeSkill${currentTask.s[0]}.png`}
                        />
                      </div>
                    </div>
                    {(selectedChara
                      ? lifeskill.c[selectedChara].s.filter(
                          (_, i) => !bannedIndex.includes(i)
                        )
                      : []
                    ).includes(currentTask.s[0]) ? (
                      <div className="w-16 absolute left-0 top-0.5">
                        <img
                          className="h-full mx-auto aspect-[160/148]"
                          src={`/schedule/Skill_EffectOn.png`}
                        />
                      </div>
                    ) : (
                      <div className="w-10 absolute left-3 top-3">
                        <img
                          className="w-full h-full aspect-square"
                          src={`/schedule/IconSkillBorder.png`}
                        />
                      </div>
                    )}
                  </div>
                  {currentTask.s.slice(1).map((lifeskillId, index) => {
                    return (
                      <div className="w-12 h-12 relative -mx-1" key={index}>
                        <div className="p-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img
                              className="w-full h-full"
                              src={`/schedule/LifeSkill${lifeskillId}.png`}
                            />
                          </div>
                        </div>
                        {(selectedChara
                          ? lifeskill.c[selectedChara].s.filter(
                              (_, i) => !bannedIndex.includes(i)
                            )
                          : []
                        ).includes(lifeskillId) ? (
                          <div className="w-12 absolute left-0 top-0.5">
                            <img
                              className="h-full mx-auto aspect-[160/148]"
                              src={`/schedule/Skill_EffectOn.png`}
                            />
                          </div>
                        ) : (
                          <div className="w-8 absolute left-2 top-2">
                            <img
                              className="w-full h-full aspect-square"
                              src={`/schedule/IconSkillBorder.png`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-row flex-wrap gap-2 p-2 mt-2 justify-center">
                {currentTask.m.map((materialId, index) => {
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
    </Layout>
  );
};

export default TaskSearch;
