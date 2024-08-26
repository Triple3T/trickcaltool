import { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown, CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";
import icSearch from "@/lib/initialConsonantSearch";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import LazyInput from "@/components/common/lazy-input";
import Select from "@/components/common/combobox-select";
import chara from "@/data/chara";
import { personalityBG, personalityBGMarked } from "@/utils/personalityBG";
import { Personality, Race, StatType } from "@/types/enums";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";

const inputClassName =
  "h-min px-2 py-1 bg-transparent text-right mx-1 rounded-none ring-0 border-x-0 border-t-0 border-b-2 focus-visible:border-b-greenicon focus-visible:ring-0 focus-visible:bg-greenicon/25 transition-colors";
const wrongInputClassName = "bg-red-500/25 border-b-red-500";
const statOrder = [8, 1, 0, 7, 6, 4, 2, 5, 3];
const loveStat = { 1: 15, 2: 10, 3: 8 };

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
                    const selected = v === t(`chara.${charaId}`);
                    const bg = (() => {
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
                        className="p-0 rounded-lg"
                        value={t(`chara.${charaId}`)}
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

interface BonusStatProps {
  boardStat: { [key: string]: number };
  pboardStat: { [key: string]: number };
  rankStat: { [key: string]: number };
  labStat: { [key: string]: { [key: string]: number } };
}

const BonusChecker = (props: BonusStatProps) => {
  const { t } = useTranslation();
  const [selectedChara, setSelectedChara] = useState<string>("");
  const [race, setRace] = useState<Race>(Race.Fairy);
  const [loveToggle, setLoveToggle] = useState<boolean>(false);
  const [loveLevel, setLoveLevel] = useState<number>(1);
  const searchChara = useCallback((charaId: string) => {
    setSelectedChara(charaId);
    setRace(Number(chara[charaId].t.charAt(5)));
  }, []);
  const [statType, setStatType] = useState<StatType>(StatType.AttackPhysic);
  const [startStat, setStartStat] = useState<number>(0);
  const [goalStat, setGoalStat] = useState<number>(0);
  const [additionalBoardPercent, setAdditionalBoardPercent] =
    useState<number>(0);
  const [artifactPercent, setArtifactPercent] = useState<number>(0);
  const [currentPercentValue, setCurrentPercentValue] = useState<number>(0);
  useEffect(() => {
    setCurrentPercentValue(
      (props.boardStat[StatType[statType]] || 0) +
        ((chara[selectedChara] && !chara[selectedChara].e && loveToggle
          ? loveStat[chara[selectedChara].t.charAt(1) as "1" | "2" | "3"]
          : 0) || 0)
    );
  }, [loveToggle, props.boardStat, selectedChara, statType]);
  const adjustStat = useCallback(
    (value: number, direction: "start" | "goal") => {
      const start = direction === "start" ? value : startStat;
      const goal = direction === "goal" ? value : goalStat;
      if (start < goal) {
        if (additionalBoardPercent === 0) {
          setArtifactPercent(
            Math.max(
              Math.ceil(
                (goal /
                  ((start / (1 + currentPercentValue / 100)) *
                    (1 + currentPercentValue / 100)) -
                  1) *
                  100
              ),
              0
            )
          );
        } else {
          setAdditionalBoardPercent(
            Math.max(
              Math.ceil(
                (goal /
                  ((start / (1 + currentPercentValue / 100)) *
                    (1 + artifactPercent / 100)) -
                  currentPercentValue / 100 -
                  1) *
                  100
              ),
              0
            )
          );
        }
      }
    },
    [
      additionalBoardPercent,
      artifactPercent,
      currentPercentValue,
      goalStat,
      startStat,
    ]
  );
  return (
    <>
      <Card className="mx-auto w-max max-w-full p-4 font-onemobile">
        <div className="flex flex-col p-2 gap-4">
          <div className="flex flex-col sm:flex-row p-2 gap-2">
            <CharacterCombobox value={selectedChara} onChange={searchChara} />
          </div>
          {selectedChara && (
            <div className="flex flex-row p-2 gap-4 items-stretch">
              <div className="flex flex-col gap-4 items-center w-max justify-between">
                <div>관심 사도</div>
                {!chara[selectedChara] || chara[selectedChara].e ? (
                  <div className="h-8 text-red-600 dark:text-red-400">
                    설정 불가
                  </div>
                ) : (
                  <img
                    className="w-8 h-8 mb-1"
                    src={`/icons/LoveHero${loveToggle ? "On" : "Off"}.png`}
                    onClick={() => setLoveToggle((v) => !v)}
                  />
                )}
              </div>
              <div className="flex flex-col gap-4 items-stretch w-max flex-1">
                <div>친밀 레벨</div>
                <div className="flex flex-row gap-2 items-center">
                  <Slider
                    value={[loveLevel]}
                    onValueChange={([v]) => setLoveLevel(v)}
                    min={1}
                    max={30}
                    step={1}
                  />
                  <LazyInput
                    className="w-12"
                    value={loveLevel.toString()}
                    onValueChange={(v) =>
                      setLoveLevel(Math.min(Math.max(Number(v) || 1, 1), 30))
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
      {selectedChara ? (
        <div className="flex flex-wrap gap-4 items-start justify-center mt-8">
          <Card
            className={cn(
              "p-2 bg-[#f5fde5] dark:bg-[#315c15]/75 w-full min-w-max max-w-md grid grid-cols-2 gap-1"
            )}
          >
            {statOrder.map((s) => {
              const stat = s as StatType;
              const statName = StatType[stat] as Exclude<
                keyof typeof StatType,
                number
              >;
              return (
                <Fragment key={`-${s}`}>
                  <div className="text-[#315c15] dark:text-[#f5fde5] text-left">
                    <img
                      src={`/icons/Icon_${statName}.png`}
                      className="w-5 h-5 inline-block align-middle mr-1.5"
                    />
                    {t(`stat.${statName}`)}
                  </div>
                  <div className="text-right">
                    +
                    {(
                      (props.boardStat[statName] || 0) +
                      ((chara[selectedChara] &&
                      !chara[selectedChara].e &&
                      loveToggle
                        ? loveStat[
                            chara[selectedChara].t.charAt(1) as "1" | "2" | "3"
                          ]
                        : 0) || 0)
                    ).toLocaleString()}
                    % +
                    {(
                      (props.pboardStat[statName] || 0) +
                      (props.rankStat[statName] || 0) +
                      (props.labStat[Race[race]]?.[statName] || 0) +
                      ([
                        StatType.CriticalRate,
                        StatType.CriticalMult,
                        StatType.CriticalResist,
                        StatType.CriticalMultResist,
                      ].includes(stat)
                        ? loveLevel * 40 || 0
                        : 0)
                    ).toLocaleString()}
                    <Popover>
                      <PopoverTrigger asChild>
                        <CircleHelp className="w-4 h-4 inline align-middle ml-2" />
                      </PopoverTrigger>
                      <PopoverContent className="font-onemobile w-48 min-w-max">
                        <div className="text-sm flex justify-between gap-4">
                          <div>특수 보드 효과</div>
                          <div>
                            +{(props.boardStat[statName] || 0).toLocaleString()}
                            %
                          </div>
                        </div>
                        {chara[selectedChara] &&
                          !chara[selectedChara].e &&
                          loveToggle && (
                            <div className="text-sm flex justify-between gap-4">
                              <div>관심 사도 효과</div>
                              <div>
                                +
                                {(
                                  loveStat[
                                    chara[selectedChara].t.charAt(1) as
                                      | "1"
                                      | "2"
                                      | "3"
                                  ] || 0
                                ).toLocaleString()}
                                %
                              </div>
                            </div>
                          )}
                        <Separator className="my-1" orientation="horizontal" />
                        <div className="text-sm flex justify-between gap-4">
                          <div>상급 보드 효과</div>
                          <div>
                            +
                            {(props.pboardStat[statName] || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-sm flex justify-between gap-4">
                          <div>랭크 전체 효과</div>
                          <div>
                            +{(props.rankStat[statName] || 0).toLocaleString()}
                          </div>
                        </div>
                        {[
                          StatType.AttackPhysic,
                          StatType.AttackMagic,
                          StatType.DefensePhysic,
                          StatType.DefenseMagic,
                          StatType.Hp,
                        ].includes(stat) && (
                          <div className="text-sm flex justify-between gap-4">
                            <div>스탯 연구 효과</div>
                            <div>
                              +
                              {(
                                props.labStat[Race[race]]?.[statName] || 0
                              ).toLocaleString()}
                            </div>
                          </div>
                        )}
                        {[
                          StatType.CriticalRate,
                          StatType.CriticalMult,
                          StatType.CriticalResist,
                          StatType.CriticalMultResist,
                        ].includes(stat) && (
                          <div className="text-sm flex justify-between gap-4">
                            <div>친밀 레벨 효과</div>
                            <div>+{(loveLevel * 40 || 0).toLocaleString()}</div>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                </Fragment>
              );
            })}
          </Card>
          <Card className="p-2 min-w-max">
            <div className="flex flex-col gap-1">
              <div className="text-lg pb-2">스탯 입력</div>
              <div className="flex justify-stretch">
                <Select
                  value={statType + 1}
                  setValue={(v) => setStatType(v - 1)}
                  items={[1, 0, 7, 6, 4, 2, 5, 3, 8].map((s) => ({
                    value: s + 1,
                    label: t(`stat.${StatType[s]}`),
                  }))}
                />
              </div>
              <div className="flex gap-1 items-baseline justify-between py-1 px-2 w-full">
                <div>현재 스탯</div>
                <div>
                  <LazyInput
                    value={`${startStat}`}
                    onValueChange={(v) => {
                      const val = Math.max(Number(v) || 0, 0);
                      setStartStat(val);
                      adjustStat(val, "start");
                    }}
                    placeholder="현재 스탯"
                    className={cn(
                      inputClassName,
                      "w-24",
                      startStat > goalStat ? wrongInputClassName : ""
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-1 items-baseline justify-between py-1 px-2 w-full">
                <div>목표 스탯</div>
                <div>
                  <LazyInput
                    value={`${goalStat}`}
                    onValueChange={(v) => {
                      const val = Math.max(Number(v) || 0, 0);
                      setGoalStat(Number(v));
                      adjustStat(val, "goal");
                    }}
                    placeholder="목표 스탯"
                    className={cn(
                      inputClassName,
                      "w-24",
                      startStat > goalStat ? wrongInputClassName : ""
                    )}
                  />
                </div>
              </div>
            </div>
            {startStat < goalStat && (
              <>
                <Separator className="my-2" />
                <div className="flex flex-col gap-1">
                  <div className="text-lg pb-2">목표 보기</div>
                  <div className="flex flex-col gap-2 items-stretch p-2 w-full">
                    <div className="flex flex-row gap-1 items-baseline justify-between">
                      <div>특수 칸 효과</div>
                      <div className="flex flex-row items-baseline">
                        <LazyInput
                          value={`${additionalBoardPercent}`}
                          onValueChange={(v) => {
                            const val = Math.max(Number(v) || 0, 0);
                            setAdditionalBoardPercent(val);
                            setArtifactPercent(
                              Math.max(
                                Math.ceil(
                                  (goalStat /
                                    ((startStat /
                                      (1 + currentPercentValue / 100)) *
                                      (1 +
                                        currentPercentValue / 100 +
                                        val / 100)) -
                                    1) *
                                    100
                                ),
                                0
                              )
                            );
                          }}
                          placeholder="특수 칸 효과"
                          className={cn(
                            inputClassName,
                            "w-12",
                            startStat > goalStat ? wrongInputClassName : ""
                          )}
                        />
                        %
                      </div>
                    </div>
                    <div>
                      <Slider
                        value={[additionalBoardPercent]}
                        min={0}
                        max={80}
                        onValueChange={([val]) => {
                          setAdditionalBoardPercent(val);
                          setArtifactPercent(
                            Math.max(
                              Math.ceil(
                                (goalStat /
                                  ((startStat /
                                    (1 + currentPercentValue / 100)) *
                                    (1 +
                                      currentPercentValue / 100 +
                                      val / 100)) -
                                  1) *
                                  100
                              ),
                              0
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-stretch p-2 w-full">
                    <div className="flex flex-row gap-1 items-baseline justify-between">
                      <div>아티팩트 효과</div>
                      <div className="flex flex-row items-baseline">
                        <LazyInput
                          value={`${artifactPercent}`}
                          onValueChange={(v) => {
                            const val = Math.max(Number(v) || 0, 0);
                            setArtifactPercent(Number(v));
                            setAdditionalBoardPercent(
                              Math.max(
                                Math.ceil(
                                  (goalStat /
                                    ((startStat /
                                      (1 + currentPercentValue / 100)) *
                                      (1 + val / 100)) -
                                    currentPercentValue / 100 -
                                    1) *
                                    100
                                ),
                                0
                              )
                            );
                          }}
                          placeholder="아티팩트 효과"
                          className={cn(
                            inputClassName,
                            "w-12",
                            startStat > goalStat ? wrongInputClassName : ""
                          )}
                        />
                        %
                      </div>
                    </div>
                    <div>
                      <Slider
                        value={[artifactPercent]}
                        min={0}
                        max={80}
                        onValueChange={([val]) => {
                          setArtifactPercent(val);
                          setAdditionalBoardPercent(
                            Math.max(
                              Math.ceil(
                                (goalStat /
                                  ((startStat /
                                    (1 + currentPercentValue / 100)) *
                                    (1 + val / 100)) -
                                  currentPercentValue / 100 -
                                  1) *
                                  100
                              ),
                              0
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                  {/* <div>
                <Button size="sm">보스별 요구 스탯에서 선택</Button>
              </div> */}
                </div>
              </>
            )}
          </Card>
        </div>
      ) : (
        <div className="text-muted-foreground mt-8">사도를 선택해주세요!</div>
      )}
    </>
  );
};

export default BonusChecker;
