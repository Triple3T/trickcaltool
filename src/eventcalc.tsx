import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown, Dot, Lock } from "lucide-react";
// import { AuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import Layout from "@/components/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import LazyInput from "@/components/common/lazy-input";
import SelectChara from "@/components/parts/select-chara";
import SubtitleBar from "@/components/parts/subtitlebar";
import ThemeEventBonusDialog from "@/components/parts/theme-event-bonus-dialog";
import themeevent from "@/data/themeevent";

import userdata from "@/utils/userdata";

interface IComboboxOuterProp {
  value: string;
  onChange: (value: string) => void;
}

const ThemeEventCombobox = ({ value, onChange }: IComboboxOuterProp) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value ? t(`themeevent.title.${value}`) : "");
  useEffect(() => {
    setV(value ? t(`themeevent.title.${value}`) : "");
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
          {v ? v : t("ui.eventcalc.selectThemeEvent")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0 font-onemobile">
        <Command>
          <CommandInput
            placeholder={t("ui.eventcalc.searchThemeEvent")}
            className="h-9"
          />
          <CommandEmpty>{t("ui.eventcalc.themeEventNotFound")}</CommandEmpty>
          <CommandGroup>
            {themeevent.i.map((eventId) => (
              <CommandItem
                key={eventId}
                value={t(`themeevent.title.${eventId}`)}
                onSelect={(currentValue) => {
                  setV(currentValue === v ? "" : currentValue);
                  onChange(currentValue === v ? "" : eventId);
                  setOpen(false);
                }}
              >
                {t(`themeevent.title.${eventId}`)}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    v === t(`themeevent.title.${eventId}`)
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

interface EventCalcProps {
  allCleared: boolean[];
  customBonus: number[];
  dailyCompleted: boolean;
  dayCount: number;
  possibleChallenge: number;
  remainItem: number;
  selectedThemeEvent: string;
  shopPurchaseCounts: number[];
  useCustom: boolean[];
  timestamp: number;
  isDirty: number;
}

interface EventCalcFullAction {
  type: "full";
  payload: EventCalcProps;
}

interface EventCalcAllClearedAction {
  type: "allCleared";
  payload: {
    index: number;
    value: boolean;
  };
}

interface EventCalcCustomBonusAction {
  type: "customBonus";
  payload: {
    index: number;
    value: number;
  };
}

interface EventCalcDailyCompletedAction {
  type: "dailyCompleted";
  payload: boolean;
}

interface EventCalcDayCountAction {
  type: "dayCount";
  payload: number;
}

interface EventCalcPossibleChallengeAction {
  type: "possibleChallenge";
  payload: number;
}

interface EventCalcRemainItemAction {
  type: "remainItem";
  payload: number;
}

interface EventCalcSelectedThemeEventAction {
  type: "selectedThemeEvent";
  payload: string;
}

interface EventCalcShopPurchaseCountsAction {
  type: "shopPurchaseCounts";
  payload: {
    index: number;
    value: number;
  };
}

interface EventCalcResetShopPurchaseCountsAction {
  type: "resetShopPurchaseCounts";
  payload: number;
}

interface EventCalcUseCustomAction {
  type: "useCustom";
  payload: {
    index: number;
    value: boolean;
  };
}

interface EventCalcCleanAction {
  type: "clean";
}

type EventCalcReduceAction =
  | EventCalcFullAction
  | EventCalcAllClearedAction
  | EventCalcCustomBonusAction
  | EventCalcDailyCompletedAction
  | EventCalcDayCountAction
  | EventCalcPossibleChallengeAction
  | EventCalcRemainItemAction
  | EventCalcSelectedThemeEventAction
  | EventCalcShopPurchaseCountsAction
  | EventCalcResetShopPurchaseCountsAction
  | EventCalcUseCustomAction
  | EventCalcCleanAction;

const eventCalcReducer = (
  state: EventCalcProps,
  action: EventCalcReduceAction
) => {
  switch (action.type) {
    case "full":
      return action.payload;
    case "allCleared":
      return {
        ...state,
        timestamp: Date.now(),
        isDirty: ((state.isDirty + 1) % 32768) + 65536,
        allCleared: state.allCleared.map((v, i) =>
          i === action.payload.index ? action.payload.value : v
        ),
      };
    case "customBonus":
      return {
        ...state,
        timestamp: Date.now(),
        isDirty: ((state.isDirty + 1) % 32768) + 65536,
        customBonus: state.customBonus.map((v, i) =>
          i === action.payload.index ? action.payload.value : v
        ),
      };
    case "dailyCompleted":
      return {
        ...state,
        timestamp: Date.now(),
        isDirty: ((state.isDirty + 1) % 32768) + 65536,
        dailyCompleted: action.payload,
      };
    case "dayCount":
      return {
        ...state,
        timestamp: Date.now(),
        isDirty: ((state.isDirty + 1) % 32768) + 65536,
        dayCount: action.payload,
      };
    case "possibleChallenge":
      return {
        ...state,
        timestamp: Date.now(),
        isDirty: ((state.isDirty + 1) % 32768) + 65536,
        possibleChallenge: action.payload,
      };
    case "remainItem":
      return {
        ...state,
        timestamp: Date.now(),
        isDirty: ((state.isDirty + 1) % 32768) + 65536,
        remainItem: action.payload,
      };
    case "selectedThemeEvent":
      return {
        ...state,
        timestamp: Date.now(),
        isDirty: ((state.isDirty + 1) % 32768) + 65536,
        selectedThemeEvent: action.payload,
      };
    case "shopPurchaseCounts":
      return {
        ...state,
        timestamp: Date.now(),
        isDirty: ((state.isDirty + 1) % 32768) + 65536,
        shopPurchaseCounts: state.shopPurchaseCounts.map((v, i) =>
          i === action.payload.index ? action.payload.value : v
        ),
      };
    case "resetShopPurchaseCounts":
      return {
        ...state,
        timestamp: Date.now(),
        isDirty: ((state.isDirty + 1) % 32768) + 65536,
        shopPurchaseCounts: new Array(action.payload).fill(0),
      };
    case "useCustom":
      return {
        ...state,
        timestamp: Date.now(),
        isDirty: ((state.isDirty + 1) % 32768) + 65536,
        useCustom: state.useCustom.map((v, i) =>
          i === action.payload.index ? action.payload.value : v
        ),
      };
    case "clean":
      return {
        ...state,
        isDirty: 0,
      };
    default:
      return state;
  }
};

const EventCalc = () => {
  const { t } = useTranslation();
  // const { googleLinked, isReady, autoLoad, autoSave } = useContext(AuthContext);
  const [eventCalcData, dispatchEventCalcData] = useReducer(eventCalcReducer, {
    allCleared: [false, false, false, false],
    customBonus: [0, 0, 0],
    dailyCompleted: false,
    dayCount: 1,
    possibleChallenge: 0,
    remainItem: 0,
    selectedThemeEvent: "",
    shopPurchaseCounts: [],
    useCustom: [false, false, false],
    timestamp: 0,
    isDirty: 0,
  });
  const setAllCleared = useCallback((index: number, value: boolean) => {
    dispatchEventCalcData({
      type: "allCleared",
      payload: { index, value },
    });
  }, []);
  const setCustomBonus = useCallback((index: number, value: number) => {
    dispatchEventCalcData({
      type: "customBonus",
      payload: { index, value },
    });
  }, []);
  const setDailyCompleted = useCallback((v: boolean) => {
    dispatchEventCalcData({
      type: "dailyCompleted",
      payload: v,
    });
  }, []);
  const setDayCount = useCallback((v: number) => {
    dispatchEventCalcData({
      type: "dayCount",
      payload: v,
    });
  }, []);
  const setPossibleChallenge = useCallback((v: number) => {
    dispatchEventCalcData({
      type: "possibleChallenge",
      payload: v,
    });
  }, []);
  const setRemainItem = useCallback((v: number) => {
    dispatchEventCalcData({
      type: "remainItem",
      payload: v,
    });
  }, []);
  const setSelectedThemeEvent = useCallback((v: string) => {
    dispatchEventCalcData({
      type: "selectedThemeEvent",
      payload: v,
    });
  }, []);
  const setShopPurchaseCounts = useCallback((index: number, value: number) => {
    dispatchEventCalcData({
      type: "shopPurchaseCounts",
      payload: { index, value },
    });
  }, []);
  const resetShopPurchaseCounts = useCallback((length: number) => {
    dispatchEventCalcData({
      type: "resetShopPurchaseCounts",
      payload: length,
    });
  }, []);
  const setUseCustom = useCallback((index: number, value: boolean) => {
    dispatchEventCalcData({
      type: "useCustom",
      payload: { index, value },
    });
  }, []);
  const [charaDrawerOpen, setCharaDrawerOpen] = useState(false);
  const [newCharaAlert, setNewCharaAlert] = useState(false);
  const [ownedList, setOwnedList] = useState<string[]>([]);
  const initFromUserData = useCallback(() => {
    const { autoRepaired: ar1, ...userDataEventCalcProto } =
      userdata.eventcalc.load();
    const { autoRepaired: ar2, ...userDataUnownedProto } =
      userdata.unowned.load();
    if (ar1 || ar2) setNewCharaAlert(true);
    dispatchEventCalcData({
      type: "full",
      payload: {
        allCleared: userDataEventCalcProto.a,
        customBonus: userDataEventCalcProto.b,
        dailyCompleted: userDataEventCalcProto.c,
        dayCount: userDataEventCalcProto.d,
        possibleChallenge: userDataEventCalcProto.h,
        remainItem: userDataEventCalcProto.r,
        selectedThemeEvent: userDataEventCalcProto.e,
        shopPurchaseCounts: userDataEventCalcProto.s,
        useCustom: userDataEventCalcProto.u,
        timestamp: userDataEventCalcProto.t,
        isDirty: 0,
      },
    });
    setOwnedList(userDataUnownedProto.o);
  }, []);
  useEffect(initFromUserData, [initFromUserData]);
  const saveSelectChara = useCallback(() => {
    setCharaDrawerOpen(false);
    initFromUserData();
  }, [initFromUserData]);
  useEffect(() => {
    if (newCharaAlert) {
      toast.info(t("ui.index.newCharacterAlert"));
      setNewCharaAlert(false);
    }
  }, [newCharaAlert, t]);
  const autoCalculatedBonus = useMemo(() => {
    if (eventCalcData.selectedThemeEvent) {
      const bonus = themeevent.e[eventCalcData.selectedThemeEvent].b;
      const bonusOwned = bonus.filter((b) => ownedList.includes(b.c));
      const totalBonus = bonusOwned
        .sort((a, b) => b.b - a.b)
        .slice(0, 6)
        .reduce((acc, cur) => acc + cur.b, 0);
      return Math.min(totalBonus, 150);
    }
    return 0;
  }, [eventCalcData.selectedThemeEvent, ownedList]);
  const result = useMemo(() => {
    const {
      allCleared,
      customBonus,
      dailyCompleted,
      dayCount,
      possibleChallenge,
      remainItem,
      selectedThemeEvent,
      shopPurchaseCounts,
      useCustom,
    } = eventCalcData;
    if (!selectedThemeEvent) return {};
    const remainDate = 15 - dayCount + 1;
    const dailyQuestRemainCount = remainDate - (dailyCompleted ? 1 : 0);
    const dailyQuestAcquire = dailyQuestRemainCount * 450;
    let requiredEasy10 = dailyQuestRemainCount * 20;
    let rewardTotal = 0;
    const bonusMultEasy =
      100 + (useCustom[0] ? customBonus[0] : autoCalculatedBonus);
    if (!allCleared[0]) {
      [22, 24, 26, 28, 30, 32, 34, 36, 38].forEach((basicMax) => {
        const basicMin = Math.floor((basicMax * 9) / 10);
        const rewardMax = Math.floor((basicMax * bonusMultEasy) / 100);
        const rewardMin = Math.floor((basicMin * bonusMultEasy) / 100);
        rewardTotal += (rewardMax + rewardMin) / 2;
        requiredEasy10 -= 1;
      });
    }
    if (dayCount < 3 || !allCleared[1]) {
      const bonusMult =
        100 + (useCustom[1] ? customBonus[1] : autoCalculatedBonus);
      [40, 44, 48, 52, 56, 60, 64, 68, 72, 76].forEach((basic) => {
        const reward = Math.floor((basic * bonusMult) / 100);
        rewardTotal += reward;
        requiredEasy10 -= 1;
      });
    }
    if (dayCount < 5 || !allCleared[2]) {
      const bonusMult =
        100 + (useCustom[2] ? customBonus[2] : autoCalculatedBonus);
      [55, 60, 65, 70, 75, 80, 85, 90, 95, 100].forEach((basic) => {
        const reward = Math.floor((basic * bonusMult) / 100);
        rewardTotal += reward;
        requiredEasy10 -= 1;
      });
    }
    if (
      themeevent.e[selectedThemeEvent].c &&
      (dayCount < 8 || !allCleared[3])
    ) {
      requiredEasy10 -= possibleChallenge;
    }
    const easy10 =
      (Math.floor((40 * bonusMultEasy) / 100) +
        Math.floor((36 * bonusMultEasy) / 100)) /
      2;
    rewardTotal += requiredEasy10 * easy10;
    const shopRequired = themeevent.e[selectedThemeEvent].s.reduce(
      (acc, cur, index) => {
        return acc + cur.p * shopPurchaseCounts[index];
      },
      0
    );
    const actualReq = shopRequired - remainItem;
    const additionalItemReq = Math.max(
      0,
      actualReq - rewardTotal - dailyQuestAcquire
    );
    const additionalClearReq =
      Math.max(0, Math.ceil((additionalItemReq * 100) / easy10)) / 100;
    const additionalDailyClearReq =
      Math.max(0, Math.ceil((additionalItemReq * 100) / easy10 / remainDate)) /
      100;
    return {
      remainDate,
      rewardTotal,
      dailyQuestAcquire,
      actualReq,
      additionalItemReq,
      additionalClearReq,
      additionalDailyClearReq,
    };
  }, [autoCalculatedBonus, eventCalcData]);

  const timeoutRef = useRef<NodeJS.Timeout | undefined>();
  const autosaver = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const {
        allCleared,
        customBonus,
        dailyCompleted,
        dayCount,
        possibleChallenge,
        remainItem,
        selectedThemeEvent,
        shopPurchaseCounts,
        useCustom,
        timestamp,
      } = eventCalcData;
      userdata.eventcalc.save({
        a: allCleared,
        b: customBonus,
        c: dailyCompleted,
        d: dayCount,
        h: possibleChallenge,
        r: remainItem,
        e: selectedThemeEvent,
        s: shopPurchaseCounts,
        u: useCustom,
        t: timestamp,
      });
      dispatchEventCalcData({ type: "clean" });
    }, 2000);
  }, [eventCalcData]);
  useEffect(() => {
    if (eventCalcData && eventCalcData.isDirty) autosaver();
  }, [autosaver, eventCalcData]);

  return (
    <Layout>
      <Card className="p-4 object-cover max-w-xl mt-0 mb-4 gap-2 mx-auto font-onemobile">
        {/* Settings */}
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("ui.board.settings")}</AccordionTrigger>
            <AccordionContent className="text-base">
              <div className="w-full flex flex-col gap-2 px-2">
                <div className="flex flex-col gap-2">
                  <SubtitleBar>{t("ui.common.unownedCharacters")}</SubtitleBar>
                  <div>
                    <SelectChara
                      isOpen={charaDrawerOpen}
                      onOpenChange={setCharaDrawerOpen}
                      saveAndClose={saveSelectChara}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <SubtitleBar>{t("ui.eventcalc.selectEvent")}</SubtitleBar>
                  <div className="px-4 text-red-600 dark:text-red-400 text-right text-sm break-keep">
                    {t("ui.eventcalc.eventChangeWarning")}
                  </div>
                  <div className="px-4 flex sm:gap-4 justify-center">
                    <ThemeEventCombobox
                      value={eventCalcData.selectedThemeEvent}
                      onChange={(v) => {
                        if (v !== eventCalcData.selectedThemeEvent)
                          resetShopPurchaseCounts(themeevent.e[v].s.length);
                        setSelectedThemeEvent(v);
                      }}
                    />
                    {eventCalcData.selectedThemeEvent && (
                      <div className="hidden sm:flex sm:items-center sm:justify-center">
                        <ThemeEventBonusDialog
                          bonus={
                            themeevent.e[eventCalcData.selectedThemeEvent].b
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      {eventCalcData.selectedThemeEvent && (
        <div className="w-full font-onemobile">
          <Tabs className="w-full" defaultValue="stage">
            <TabsList className="w-full flex">
              <TabsTrigger value="stage" className="flex-1">
                {t("ui.eventcalc.tabStage")}
              </TabsTrigger>
              <TabsTrigger value="shop" className="flex-1">
                {t("ui.eventcalc.tabShop")}
              </TabsTrigger>
              <TabsTrigger value="result" className="flex-1">
                {t("ui.eventcalc.tabResult")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="stage">
              <div className="mt-4 text-lg">
                {t("ui.eventcalc.nthDayBefore")}
                <LazyInput
                  value={eventCalcData.dayCount.toString()}
                  onValueChange={(v) =>
                    setDayCount(Math.min(15, Math.max(1, parseInt(v, 10) || 0)))
                  }
                  className="p-1 h-auto w-12 text-center inline-block mx-4 my-2 bg-slate-400/80 dark:bg-slate-600/80"
                />
                {t("ui.eventcalc.nthDayAfter")}
              </div>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="daily-already-completed"
                    checked={eventCalcData.dailyCompleted}
                    onCheckedChange={(v) =>
                      setDailyCompleted(v === "indeterminate" ? false : v)
                    }
                  />
                  <label
                    htmlFor="daily-already-completed"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t("ui.eventcalc.dailyAlreadyCompleted")}
                  </label>
                </div>
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap gap-4">
                <div className="flex flex-col flex-auto gap-2">
                  <SubtitleBar>{t("ui.eventcalc.easyLvBonus")}</SubtitleBar>
                  <div className="px-4 flex flex-col gap-2 justify-center">
                    <div className="mb-2 text-left flex items-center gap-2">
                      <Switch
                        id="all-cleared-easy"
                        checked={eventCalcData.allCleared[0]}
                        onCheckedChange={(v) => {
                          setAllCleared(0, v);
                        }}
                      />
                      <Label htmlFor="all-cleared-easy">
                        {t("ui.eventcalc.allClearedEasy")}
                      </Label>
                    </div>
                    <RadioGroup
                      className="mx-auto"
                      value={eventCalcData.useCustom[0] ? "custom" : "auto"}
                      onValueChange={(v) => setUseCustom(0, v !== "auto")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auto" id="r11" />
                        <Label htmlFor="r11">
                          {t("ui.eventcalc.useAutoCalculatedBonus", {
                            0: autoCalculatedBonus,
                          })}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="r12" />
                        <Label htmlFor="r12">
                          {t("ui.eventcalc.useCustomBonus")}
                          <LazyInput
                            value={eventCalcData.customBonus[0].toString()}
                            onValueChange={(v) =>
                              setCustomBonus(
                                0,
                                Math.min(150, Math.max(0, parseInt(v, 10) || 0))
                              )
                            }
                            onClick={() => setUseCustom(0, true)}
                            className="p-0.5 h-auto w-10 text-right inline-block focus:mx-2 bg-slate-400/80 dark:bg-slate-600/80"
                          />
                          %
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div className="flex flex-col flex-auto gap-2">
                  <SubtitleBar>{t("ui.eventcalc.hardLvBonus")}</SubtitleBar>
                  <div className="px-4 flex flex-col gap-2 justify-center">
                    <div className="mb-2 text-left flex items-center gap-2">
                      {eventCalcData.dayCount < 3 ? (
                        <Lock className="inline-block w-6 h-6 ml-3 mr-2 my-auto" />
                      ) : (
                        <Switch
                          id="all-cleared-hard"
                          checked={eventCalcData.allCleared[1]}
                          onCheckedChange={(v) => {
                            setAllCleared(1, v);
                          }}
                        />
                      )}
                      <Label htmlFor="all-cleared-hard">
                        {t("ui.eventcalc.allCleared")}
                      </Label>
                    </div>
                    {(eventCalcData.dayCount < 3 ||
                      !eventCalcData.allCleared[1]) && (
                      <RadioGroup
                        className="mx-auto"
                        value={eventCalcData.useCustom[1] ? "custom" : "auto"}
                        onValueChange={(v) => setUseCustom(1, v !== "auto")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="auto" id="r21" />
                          <Label htmlFor="r21">
                            {t("ui.eventcalc.useAutoCalculatedBonus", {
                              0: autoCalculatedBonus,
                            })}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="custom" id="r22" />
                          <Label htmlFor="r22">
                            {t("ui.eventcalc.useCustomBonus")}
                            <LazyInput
                              value={eventCalcData.customBonus[1].toString()}
                              onValueChange={(v) =>
                                setCustomBonus(
                                  1,
                                  Math.min(
                                    150,
                                    Math.max(0, parseInt(v, 10) || 0)
                                  )
                                )
                              }
                              onClick={() => setUseCustom(1, true)}
                              className="p-0.5 h-auto w-10 text-right inline-block focus:mx-2 bg-slate-400/80 dark:bg-slate-600/80"
                            />
                            %
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  </div>
                </div>
                <div className="flex flex-col flex-auto gap-2">
                  <SubtitleBar>{t("ui.eventcalc.veryHardLvBonus")}</SubtitleBar>
                  <div className="px-4 flex flex-col gap-2 justify-center">
                    <div className="mb-2 text-left flex items-center gap-2">
                      {eventCalcData.dayCount < 5 ? (
                        <Lock className="inline-block w-6 h-6 ml-3 mr-2 my-auto" />
                      ) : (
                        <Switch
                          id="all-cleared-veryhard"
                          checked={eventCalcData.allCleared[2]}
                          onCheckedChange={(v) => {
                            setAllCleared(2, v);
                          }}
                        />
                      )}
                      <Label htmlFor="all-cleared-veryhard">
                        {t("ui.eventcalc.allCleared")}
                      </Label>
                    </div>
                    {(eventCalcData.dayCount < 5 ||
                      !eventCalcData.allCleared[2]) && (
                      <RadioGroup
                        className="mx-auto"
                        value={eventCalcData.useCustom[2] ? "custom" : "auto"}
                        onValueChange={(v) => setUseCustom(2, v !== "auto")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="auto" id="r31" />
                          <Label htmlFor="r31">
                            {t("ui.eventcalc.useAutoCalculatedBonus", {
                              0: autoCalculatedBonus,
                            })}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="custom" id="r32" />
                          <Label htmlFor="r32">
                            {t("ui.eventcalc.useCustomBonus")}
                            <LazyInput
                              value={eventCalcData.customBonus[2].toString()}
                              onValueChange={(v) =>
                                setCustomBonus(
                                  2,
                                  Math.min(
                                    150,
                                    Math.max(0, parseInt(v, 10) || 0)
                                  )
                                )
                              }
                              onClick={() => setUseCustom(2, true)}
                              className="p-0.5 h-auto w-10 text-right inline-block focus:mx-2 bg-slate-400/80 dark:bg-slate-600/80"
                            />
                            %
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  </div>
                </div>
                {themeevent.e[eventCalcData.selectedThemeEvent].c > 0 && (
                  <div className="flex flex-col flex-auto gap-2">
                    <SubtitleBar>
                      {t("ui.eventcalc.challengeStage")}
                    </SubtitleBar>
                    <div className="px-4 flex flex-col gap-2 justify-center">
                      <div className="mb-2 text-left flex items-center gap-2">
                        {eventCalcData.dayCount < 8 ? (
                          <Lock className="inline-block w-6 h-6 ml-3 mr-2 my-auto" />
                        ) : (
                          <Switch
                            id="all-cleared-challenge"
                            checked={eventCalcData.allCleared[3]}
                            onCheckedChange={(v) => {
                              setAllCleared(3, v);
                            }}
                          />
                        )}
                        <Label htmlFor="all-cleared-challenge">
                          {t("ui.eventcalc.allCleared")}
                        </Label>
                      </div>
                      {(eventCalcData.dayCount < 8 ||
                        !eventCalcData.allCleared[3]) && (
                        <div>
                          <LazyInput
                            value={eventCalcData.possibleChallenge.toString()}
                            onValueChange={(v) =>
                              setPossibleChallenge(
                                Math.min(
                                  themeevent.e[eventCalcData.selectedThemeEvent]
                                    .c,
                                  Math.max(0, parseInt(v, 10) || 0)
                                )
                              )
                            }
                            onClick={() => setUseCustom(2, true)}
                            className="p-0.5 h-auto w-10 text-right inline-block focus:mx-2 bg-slate-400/80 dark:bg-slate-600/80"
                          />
                          {t("ui.eventcalc.possibleChallengeStage", {
                            0: `${
                              themeevent.e[eventCalcData.selectedThemeEvent].c
                            }`,
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="shop">
              <div className="mt-4 text-lg">
                {t("ui.eventcalc.remainingItemCountBefore")}
                <LazyInput
                  value={eventCalcData.remainItem.toString()}
                  onValueChange={(v) =>
                    setRemainItem(
                      Math.min(99999, Math.max(0, parseInt(v, 10) || 0))
                    )
                  }
                  className="p-1 h-auto w-16 text-center inline-block mx-4 my-2 bg-slate-400/80 dark:bg-slate-600/80"
                />
                {t("ui.eventcalc.remainingItemCountAfter")}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {themeevent.e[eventCalcData.selectedThemeEvent].s.map(
                  (item, index) => {
                    return (
                      <Card
                        key={index}
                        className="p-4 flex-1 bg-green-100/75 dark:bg-green-900/75"
                      >
                        <div className="min-w-max">
                          {item.a
                            ? t(
                                `${item.c}.${item.i}`,
                                Object.fromEntries(
                                  Object.entries(item.a).map(([k, v]) =>
                                    Number(v).toString() === v
                                      ? [k, v]
                                      : [k, t(`chara.${v}`)]
                                  )
                                )
                              )
                            : t(`${item.c}.${item.i}`)}{" "}
                          {item.n > 9999
                            ? `x${Math.floor(item.n / 1000)}K`
                            : item.n === 1
                            ? ""
                            : `x${item.n}`}
                        </div>
                        <div className="flex min-w-max justify-center text-sm text-slate-700/85 dark:text-slate-300/85">
                          {item.l > 0 && (
                            <>
                              <div>
                                {t("ui.eventcalc.purchaseLimit", { 0: item.l })}
                              </div>
                              <Dot className="w-4 h-4 my-auto" />
                            </>
                          )}
                          <div>
                            {t("ui.eventcalc.purchasePrice", { 0: item.p })}
                          </div>
                        </div>
                        <div className="min-w-max flex flex-col">
                          <div className="text-sm text-right text-green-600/85 dark:text-green-400/85">
                            {t("ui.eventcalc.purchaseCount")}
                          </div>
                          <div className="flex flex-row gap-1 justify-end">
                            <Button
                              className="p-1 h-auto w-12"
                              onClick={() => setShopPurchaseCounts(index, 0)}
                            >
                              {t("ui.eventcalc.minimum")}
                            </Button>
                            <LazyInput
                              value={(
                                eventCalcData.shopPurchaseCounts[index] ?? 0
                              ).toString()}
                              onValueChange={(v) =>
                                setShopPurchaseCounts(
                                  index,
                                  Math.min(
                                    item.l > 0 ? item.l : 9999,
                                    Math.max(0, parseInt(v, 10) || 0)
                                  )
                                )
                              }
                              className={`p-1 h-auto ${
                                item.l > 0 ? "w-14" : "w-28"
                              } text-center inline-block mx-1 bg-slate-400/80 dark:bg-slate-600/80`}
                            />
                            {item.l > 0 && (
                              <Button
                                className="p-1 h-auto w-12"
                                onClick={() =>
                                  setShopPurchaseCounts(index, item.l)
                                }
                              >
                                {t("ui.eventcalc.maximum")}
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  }
                )}
              </div>
            </TabsContent>
            <TabsContent value="result">
              <div className="flex flex-col flex-auto gap-2 max-w-96 mx-auto">
                <SubtitleBar>
                  {t("ui.eventcalc.possibleItemAcquisition")}
                </SubtitleBar>
                <div className="px-4 flex flex-col gap-2 justify-center">
                  {Object.entries(result).map(([k, v]) => {
                    return (
                      <div className="flex" key={k}>
                        <div className="text-left flex-auto">
                          {t(`ui.eventcalc.${k}`)}
                        </div>
                        <div className="text-right flex-auto">
                          {t(
                            k.includes("Date")
                              ? "ui.eventcalc.dayCount"
                              : k.includes("Clear")
                              ? "ui.eventcalc.clearCount"
                              : "ui.eventcalc.itemCount",
                            { 0: v > 999 ? v.toLocaleString() : `${v}` }
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </Layout>
  );
};

export default EventCalc;
