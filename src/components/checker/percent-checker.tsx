import { Fragment, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Check, Dot, SquareSlash, XOctagon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import LazyInput from "@/components/common/lazy-input";
import { StatType } from "@/types/enums";

const statOrder = [8, 1, 0, 7, 6, 4, 2, 5, 3];

const ResultIcon = ({ stat, diff }: { stat: number; diff: number }) => {
  if (stat === -1) {
    return (
      <SquareSlash
        className="w-5 h-5 inline-block align-middle"
        strokeWidth={3}
      />
    );
  }
  if (diff < 1) {
    return (
      <Check
        className="text-green-500 dark:text-green-300 w-5 h-5 inline-block align-middle"
        strokeWidth={3}
      />
    );
  }
  if (diff < 2) {
    return (
      <AlertTriangle
        className="text-amber-500 dark:text-amber-400 w-5 h-5 inline-block align-middle"
        strokeWidth={3}
      />
    );
  }
  return (
    <XOctagon
      className="text-red-600 dark:text-red-500 w-5 h-5 inline-block align-middle"
      strokeWidth={3}
    />
  );
};

const ResultAlert = ({
  stat,
  diff,
  off,
  on,
  result,
  actual,
}: {
  stat: number;
  diff: number;
  off: number;
  on: number;
  result: number;
  actual: number;
}) => {
  const { t } = useTranslation();
  if (stat === -1) {
    return (
      <Alert
        variant="default"
        className="text-left bg-slate-100 dark:bg-slate-800"
      >
        <SquareSlash
          className="w-4 h-4 inline-block align-middle"
          strokeWidth={3}
        />
        <AlertTitle>{t("ui.check.percent.resultIgnoredTitle")}</AlertTitle>
        <AlertDescription className="break-keep">
          {t("ui.check.percent.resultIgnoredDescription")}
        </AlertDescription>
        <div className="text-xs">
          {t("ui.check.percent.resultDisplayOffStat", {
            0: off.toLocaleString(),
          })}
          <Dot className="w-4 h-4 inline-block align-middle" strokeWidth={3} />
          {t("ui.check.percent.resultDisplayOnStat", {
            0: on.toLocaleString(),
          })}
        </div>
      </Alert>
    );
  }
  if (diff < 1) {
    return (
      <Alert
        variant="default"
        className="text-left bg-green-100 dark:bg-green-800"
      >
        <Check className="w-4 h-4 inline-block align-middle" strokeWidth={3} />
        <AlertTitle>{t("ui.check.percent.resultPassTitle")}</AlertTitle>
        <AlertDescription className="break-keep">
          {t("ui.check.percent.resultPassDescription")}
        </AlertDescription>
        <div className="text-xs">
          {t("ui.check.percent.resultDisplayResultPercent", {
            0: result.toLocaleString(),
          })}
          <Dot className="w-4 h-4 inline-block align-middle" strokeWidth={3} />
          {t("ui.check.percent.resultDisplayActualPercent", {
            0: actual.toLocaleString(),
          })}
        </div>
      </Alert>
    );
  }
  if (diff < 2) {
    return (
      <Alert
        variant="default"
        className="text-left bg-amber-100 dark:bg-amber-800"
      >
        <AlertTriangle
          className="w-4 h-4 inline-block align-middle"
          strokeWidth={3}
        />
        <AlertTitle>{t("ui.check.percent.resultWarnTitle")}</AlertTitle>
        <AlertDescription className="break-keep">
          <div>{t("ui.check.percent.resultWarnDescription1")}</div>
          <div>{t("ui.check.percent.resultWarnDescription2")}</div>
        </AlertDescription>
        <div className="text-xs">
          {t("ui.check.percent.resultDisplayResultPercent", {
            0: result.toLocaleString(),
          })}
          <Dot className="w-4 h-4 inline-block align-middle" strokeWidth={3} />
          {t("ui.check.percent.resultDisplayActualPercent", {
            0: actual.toLocaleString(),
          })}
        </div>
      </Alert>
    );
  }
  return (
    <Alert variant="default" className="text-left bg-red-100 dark:bg-red-800">
      <XOctagon className="w-4 h-4 inline-block align-middle" strokeWidth={3} />
      <AlertTitle>{t("ui.check.percent.resultFailTitle")}</AlertTitle>
      <AlertDescription className="break-keep">
        <div>{t("ui.check.percent.resultFailDescription1")}</div>
        <div>{t("ui.check.percent.resultFailDescription2")}</div>
      </AlertDescription>
      <div className="text-xs">
        {t("ui.check.percent.resultDisplayResultPercent", {
          0: result.toLocaleString(),
        })}
        <Dot className="w-4 h-4 inline-block align-middle" strokeWidth={3} />
        {t("ui.check.percent.resultDisplayActualPercent", {
          0: actual.toLocaleString(),
        })}
      </div>
    </Alert>
  );
};

interface IPercentStatProps {
  boardStat: { [key: string]: number };
}

type StatCollection = {
  [key in Exclude<keyof typeof StatType, number>]: number;
};

interface StatsProps {
  off: Partial<StatCollection>;
  on: Partial<StatCollection>;
}

interface StatsReduceAction {
  type: keyof StatsProps;
  payload: {
    key: keyof StatCollection;
    value: number;
  };
}

const statReducer = (
  state: StatsProps,
  action: StatsReduceAction
): StatsProps => {
  state[action.type][action.payload.key] = action.payload.value;
  return state;
};

const cardCommonStyle = "p-2 bg-[#f5fde5] dark:bg-[#315c15]/75 w-full max-w-md";
const PercentChecker = ({ boardStat }: IPercentStatProps) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"off" | "on" | "result">("off");
  const [lovePercent, setLovePercent] = useState(8);
  const [stats, dispatchStats] = useReducer(statReducer, { off: {}, on: {} });
  // const setStat = useCallback((key: keyof IStatCollectionProps, value: number) => {}, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 w-max max-w-full mx-auto"
      )}
    >
      <div className="text-sm opacity-75 mb-2 break-keep">
        {t("ui.check.percent.description")}
      </div>
      <ToggleGroup
        className="w-max"
        value={`${lovePercent}`}
        onValueChange={(v) => v && setLovePercent(Number(v))}
        type="single"
        size="sm"
      >
        <ToggleGroupItem value="15">
          {t("ui.check.percent.startStar1")}
        </ToggleGroupItem>
        <ToggleGroupItem value="10">
          {t("ui.check.percent.startStar2")}
        </ToggleGroupItem>
        <ToggleGroupItem value="8">
          {t("ui.check.percent.startStar3")}
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        className="w-max"
        value={tab}
        onValueChange={(v) => v && setTab(v as "off" | "on" | "result")}
        type="single"
      >
        <ToggleGroupItem value="off">
          <img
            src="/icons/LoveHeroOff.png"
            className="w-5 h-5 inline-block align-middle mr-1.5"
          />
          {t("ui.check.percent.loveOff")}
        </ToggleGroupItem>
        <ToggleGroupItem value="on">
          <img
            src="/icons/LoveHeroOn.png"
            className="w-5 h-5 inline-block align-middle mr-1.5"
          />
          {t("ui.check.percent.loveOn")}
        </ToggleGroupItem>
        <ToggleGroupItem value="result">
          {t("ui.check.percent.result")}
        </ToggleGroupItem>
      </ToggleGroup>
      {tab === "result" ? (
        <Card className={cn(cardCommonStyle)}>
          <Accordion type="multiple">
            {statOrder.map((s) => {
              const stat = s as StatType;
              const statName = StatType[stat] as Exclude<
                keyof typeof StatType,
                number
              >;
              const targetStatValue = boardStat[statName] || 0;
              const offStat = stats.off[statName] || 0;
              const onStat = stats.on[statName] || 0;
              const resultStat =
                onStat === offStat
                  ? -1
                  : offStat / ((onStat - offStat) / (lovePercent / 100)) - 1;
              const resultPercent =
                resultStat === -1
                  ? "---"
                  : `${Math.round(resultStat * 1000) / 10}%`;
              const resultDiff = Math.abs(targetStatValue - resultStat * 100);
              return (
                <AccordionItem
                  key={`${tab}-${s}`}
                  value={`${s}`}
                  className="-my-2"
                >
                  <AccordionTrigger>
                    <div className="w-full flex flex-row mr-2">
                      <div className="text-[#315c15] dark:text-[#f5fde5] text-left flex-auto">
                        <img
                          src={`/icons/Icon_${statName}.png`}
                          className="w-5 h-5 inline-block align-middle mr-1.5"
                        />
                        {t(`stat.${statName}`)}
                      </div>
                      <div className="text-right flex-auto">
                        {resultPercent}
                      </div>
                      <div className="pl-2">
                        <ResultIcon stat={resultStat} diff={resultDiff} />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base">
                    <ResultAlert
                      stat={resultStat}
                      diff={resultDiff}
                      off={offStat}
                      on={onStat}
                      result={Math.round(resultStat * 1000) / 10}
                      actual={targetStatValue}
                    />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Card>
      ) : (
        <Card className={cn(cardCommonStyle, "grid grid-cols-2 gap-1")}>
          {statOrder.map((s) => {
            const stat = s as StatType;
            const statName = StatType[stat] as Exclude<
              keyof typeof StatType,
              number
            >;
            return (
              <Fragment key={`${tab}-${s}`}>
                <div className="text-[#315c15] dark:text-[#f5fde5] text-left">
                  <img
                    src={`/icons/Icon_${statName}.png`}
                    className="w-5 h-5 inline-block align-middle mr-1.5"
                  />
                  {t(`stat.${statName}`)}
                </div>
                <div className="text-right">
                  <LazyInput
                    value={`${stats[tab][statName] || 0}`}
                    onValueChange={(v) =>
                      dispatchStats({
                        type: tab,
                        payload: {
                          key: statName,
                          value: Math.max(0, Number(v) || 0),
                        },
                      })
                    }
                    className="p-0.5 h-auto w-20 text-right inline-block bg-transparent rounded-none border-x-0 border-t-0 border-b border-slate-900 dark:border-slate-100"
                  />
                </div>
              </Fragment>
            );
          })}
        </Card>
      )}
    </div>
  );
};

export default PercentChecker;
