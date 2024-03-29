import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown } from "lucide-react";
// import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
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
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import Layout from "@/components/layout";
import ItemSlot from "@/components/parts/item-slot";
import LifeskillIcon from "@/components/parts/lifeskill-icon";

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
      <PopoverContent className="w-60 p-0 font-onemobile">
        <Command>
          <CommandInput
            placeholder={t("ui.tasksearch.searchLifeskill")}
            className="h-9"
          />
          <CommandEmpty>{t("ui.tasksearch.lifeskillNotFound")}</CommandEmpty>
          <CommandGroup>
            {Array(lifeskill.n)
              .fill(0)
              .map((_, lifeskillIndex) => (
                <CommandItem
                  key={lifeskillIndex + 1}
                  value={t(`lifeskill.${lifeskillIndex + 1}`)}
                  onSelect={(currentValue) => {
                    setV(currentValue === v ? "" : currentValue);
                    onChange(currentValue === v ? "" : `${lifeskillIndex + 1}`);
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

  return (
    <Layout>
      <div className="w-full h-4" />
      <Card className="mx-auto w-max max-w-full p-4 font-onemobile">
        <div className="flex flex-col p-2 gap-4">
          <div className="flex flex-col sm:flex-row p-2 gap-2">
            <CharacterCombobox
              value={selectedChara}
              onChange={(v) => {
                setSelectedChara(v);
                setSelectedLifeskill("");
                setSelectedTask("");
                setBannedIndex([]);
              }}
            />
            <LifeskillCombobox
              value={selectedLifeskill}
              onChange={(v) => {
                setSelectedChara("");
                setSelectedLifeskill(v);
                setSelectedTask("");
                setBannedIndex([]);
              }}
            />
            <TaskCombobox
              value={selectedTask}
              onChange={(v) => {
                setSelectedChara("");
                setSelectedLifeskill("");
                setSelectedTask(v);
                setBannedIndex([]);
              }}
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
                <div className="flex flex-row flex-wrap gap-2">
                  {lifeskill.c[selectedChara].s.map((lifeskillId, index) => {
                    return (
                      <LifeskillIcon
                        id={lifeskillId}
                        size="large"
                        additionalClassName={
                          bannedIndex.includes(index)
                            ? "grayscale-[0.75] opacity-50"
                            : ""
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
                </div>
                <div className="text-sm text-left text-slate-700 dark:text-slate-300 mt-3">
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
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-evenly">
              <div className="w-64 rounded-xl p-4 ring-4 bg-[#f7faef] text-[#5d3d30] ring-[#e2dbc8]">
                <div className="pl-4 mb-1">
                  <div
                    className="pr-4 pb-1.5 pt-0.5 bg-contain bg-no-repeat"
                    style={{
                      backgroundImage: "url(/schedule/Deco_Task_Colored.png)",
                    }}
                  >
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
          {!selectedChara &&
            !selectedLifeskill &&
            !selectedTask &&
            t("ui.tasksearch.needToSelect")}
        </div>
      </Card>
      <div className="font-onemobile flex flex-wrap gap-6 p-4 justify-center">
        {!selectedLifeskill &&
          !selectedTask &&
          Object.keys(task.t).map((taskId) => {
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
        {selectedLifeskill &&
          Object.entries(chara)
            .filter(
              ([charaId, v]) =>
                v.t[1] !== "1" &&
                lifeskill.c[charaId].s.includes(Number(selectedLifeskill))
            )
            .sort(([a], [b]) => {
              return (
                (lifeskill.c[a].s.indexOf(Number(selectedLifeskill)) && 1) -
                  (lifeskill.c[b].s.indexOf(Number(selectedLifeskill)) && 1) ||
                t(`chara.${a}`).localeCompare(t(`chara.${b}`))
              );
            })
            .map(([charaId]) => {
              const cls = lifeskill.c[charaId].s;
              return (
                <div
                  key={charaId}
                  className="w-72 rounded-xl px-2 py-4 ring-4 bg-[#f7faef] text-[#5d3d30] ring-[#e2dbc8]"
                >
                  <div className="flex flex-row gap-2.5 items-center">
                    <img
                      className="w-12 h-12 aspect-square"
                      src={`/charas/${charaId}.png`}
                    />
                    <div className="text-2xl">{t(`chara.${charaId}`)}</div>
                  </div>
                  <div className="flex flex-row gap-0.5 my-2">
                    <LifeskillIcon
                      id={cls[0]}
                      active={cls[0].toString() === selectedLifeskill}
                      additionalClassName="-mx-1 flex-[4]"
                      showName
                    />
                    {cls.slice(1).map((lifeskillId, index) => {
                      return (
                        <LifeskillIcon
                          key={index}
                          id={lifeskillId}
                          active={lifeskillId.toString() === selectedLifeskill}
                          size="small"
                          additionalClassName="mx-auto flex-[3]"
                          showName
                          nameClassName="-mt-1"
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
        {selectedTask &&
          Object.entries(chara)
            .filter(
              ([charaId, v]) =>
                v.t[1] !== "1" &&
                task.t[selectedTask].s
                  .filter((lfs) => !bannedIndex.includes(lfs))
                  .some((lfs) => lifeskill.c[charaId].s.includes(lfs))
            )
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
                <div
                  key={charaId}
                  className="w-72 rounded-xl px-2 py-4 ring-4 bg-[#f7faef] text-[#5d3d30] ring-[#e2dbc8]"
                >
                  <div className="flex flex-row gap-2.5 items-center">
                    <img
                      className="w-12 h-12 aspect-square"
                      src={`/charas/${charaId}.png`}
                    />
                    <div>
                      <div className="text-left text-2xl">
                        {t(`chara.${charaId}`)}
                      </div>
                      <div className="text-left text-sm">
                        {t(`ui.tasksearch.skillMatchCount`, {
                          0: `${
                            lifeskill.c[charaId].s.filter((lfs) =>
                              task.t[selectedTask].s.includes(lfs)
                            ).length
                          }`,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-0.5 my-2">
                    <LifeskillIcon
                      id={cls[0]}
                      active={task.t[selectedTask].s.includes(cls[0])}
                      additionalClassName="-mx-1 flex-[4]"
                      showName
                    />
                    {cls.slice(1).map((lifeskillId, index) => {
                      return (
                        <LifeskillIcon
                          key={index}
                          id={lifeskillId}
                          active={task.t[selectedTask].s.includes(lifeskillId)}
                          size="small"
                          additionalClassName="mx-auto flex-[3]"
                          showName
                          nameClassName="-mt-1"
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
