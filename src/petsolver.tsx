import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle,
  ChevronRight,
  Loader,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Stepper from "@/components/common/stepper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import ItemSlot from "@/components/parts/item-slot";
import GoldSlot from "@/components/parts/gold-slot";
import SubtitleBar from "@/components/parts/subtitlebar";

import pet from "@/data/pet";
import solveDispatch from "@/utils/solveDispatch";
import {
  useUserDataActions,
  useUserDataDispatchablePets,
} from "@/stores/useUserDataStore";

const sumSquare = (n: number) => (n * (n + 1) * (2 * n + 1)) / 6;
// const sumCube = (n: number) => Math.pow((n * (n + 1)) / 2, 2);

const PetSolver = () => {
  const { t } = useTranslation();
  const {
    petOwnClick,
    petOwnAll,
    petOwnNone,
    petBorrowableValueUp,
    petBorrowableValueDown,
  } = useUserDataActions();
  const userDataDispatchablePets = useUserDataDispatchablePets();
  const [step, setStep] = useState<number>(0);
  const [includedDispatch, setIncludedDispatch] = useState<number[]>(
    pet.a.map((e) => e.i)
  );
  const [dispatchTime, setDispatchTime] = useState<number>(pet.d.t[3]);
  const [borrowLimit, setBorrowLimit] = useState<number[]>([3]);
  const [calcStatus, setCalcStatus] = useState<"idle" | "running" | "done">(
    "idle"
  );
  const [calcResult, setCalcResult] = useState<
    ReturnType<typeof solveDispatch> | undefined
  >();
  const [solveTime, setSolveTime] = useState<number>(0);
  const [calcProgress, setCalcProgress] = useState<number>(0);
  const startTime = useRef<number>(0);
  const workerRef = useRef<Worker | null>(null);
  const progressRef = useRef<number[][]>([
    [0, 4],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ]);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/workers/solveDispatchWorker", import.meta.url),
      { type: "module" }
    );
    // workerRef.current.onmessage = (e: MessageEvent<string>) => {
    //   if (typeof e.data === 'number') {
    //     setWorkingProgress(e.data);
    //   } else if (typeof e.data === 'string') {
    //     setResult(JSON.parse(e.data));
    //   }
    // };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (!userDataDispatchablePets) return;
    if (step === 3 && calcStatus === "idle") {
      setCalcStatus("running");
      setTimeout(() => {
        startTime.current = Date.now();
        if (workerRef.current) {
          // worker initialized
          workerRef.current.onmessage = (
            e: MessageEvent<
              | string
              | {
                  type: "progress";
                  depth: number;
                  data: number | number[];
                }
            >
          ) => {
            if (typeof e.data === "string") {
              setCalcResult(JSON.parse(e.data));
            } else {
              // progress message
              const progressMessage = e.data;
              if (typeof progressMessage.data === "number") {
                const prev = progressRef.current;
                progressRef.current = prev.map(([a, b], i) => {
                  return i === progressMessage.depth
                    ? [progressMessage.data as number, b]
                    : [a, b];
                });
              } else {
                // array
                const prev = progressRef.current;
                progressRef.current = prev.map(([a, b], i) => {
                  return i === progressMessage.depth
                    ? (progressMessage.data as number[])
                    : [a, b];
                });
              }
            }
          };
          workerRef.current.postMessage({
            dispatchTime,
            ownedPets: userDataDispatchablePets.o,
            borrowablePets: Object.entries(userDataDispatchablePets.b)
              .map(([k, v]) => Array(v).fill(k))
              .flat(),
            dispatchList: pet.a.filter((e) => includedDispatch.includes(e.i)),
            borrowLimit,
          });
        } else {
          // cannot find worker
          const result = solveDispatch(
            {
              dispatchTime,
              ownedPets: userDataDispatchablePets.o,
              borrowablePets: Object.entries(userDataDispatchablePets.b)
                .map(([k, v]) => Array(v).fill(k))
                .flat(),
              dispatchList: pet.a.filter((e) => includedDispatch.includes(e.i)),
              borrowLimit,
            },
            false
          );
          setCalcResult(result);
        }
      }, 100);
    }
  }, [
    borrowLimit,
    calcStatus,
    dispatchTime,
    includedDispatch,
    step,
    userDataDispatchablePets,
  ]);
  useEffect(() => {
    if (step === 3 && calcStatus === "running" && calcResult) {
      setSolveTime(Date.now() - startTime.current);
      setCalcProgress(10000);
      setCalcStatus("done");
    }
  }, [calcResult, calcStatus, step]);
  useEffect(() => {
    if (workerRef.current) {
      if (step === 3 && calcStatus === "running") {
        if (progressTimerRef.current === null) {
          progressTimerRef.current = setInterval(() => {
            const [borrowProgress, ...progressArr] = progressRef.current;
            const total = sumSquare(borrowProgress[1] + 1);
            const value =
              borrowProgress[0] === 0
                ? 0
                : (sumSquare(borrowProgress[0]) * 10000) / total;
            const currentRange =
              (Math.pow(borrowProgress[0] + 1, 2) * 10000) / total;
            const progress = progressArr.reduce(
              (acc, [a, b]) => {
                const thisValue = b === 0 ? 0 : (acc.currentRange * a) / b;
                const nextRange = b === 0 ? 0 : acc.currentRange / b;
                return {
                  value: acc.value + thisValue,
                  currentRange: nextRange,
                };
              },
              { value, currentRange }
            );
            setCalcProgress(Math.round(progress.value));
          }, 128);
        }
      } else if (progressTimerRef.current !== null) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }
  }, [calcStatus, step]);

  if (!userDataDispatchablePets) return null;

  return (
    <div className="font-onemobile">
      <div className="text-lg">
        {step < 3
          ? t(`ui.dispatchcalc.title${step + 1}`)
          : t("ui.dispatchcalc.resulttitle")}
      </div>
      <Stepper
        step={step}
        setStep={setStep}
        stepTexts={[
          "ui.dispatchcalc.step1",
          "ui.dispatchcalc.step2",
          "ui.dispatchcalc.step3",
        ]}
        disabled={calcStatus !== "idle"}
      />
      {step === 0 && (
        <div className="flex px-1 py-2 gap-1 justify-stretch">
          <Button className="flex-1" variant="outline" onClick={petOwnAll}>
            {t("ui.dispatchcalc.checkAll")}
          </Button>
          <Button className="flex-1" variant="outline" onClick={petOwnNone}>
            {t("ui.dispatchcalc.uncheckAll")}
          </Button>
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col md:flex-row px-1 pt-2 pb-1 gap-1 md:gap-4">
          <div className="flex-1">
            <SubtitleBar>{t("ui.dispatchcalc.setDispatchTime")}</SubtitleBar>
            <div className="grid gap-1 grid-cols-2 sm:grid-cols-4">
              {pet.d.t.map((time) => {
                return (
                  <Button
                    key={time}
                    className="flex-1 w-full"
                    variant={dispatchTime === time ? "default" : "outline"}
                    onClick={() => setDispatchTime(time)}
                  >
                    {t("ui.dispatchcalc.dispatchTime", { 0: time / 3600 })}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="flex-1">
            <SubtitleBar>{t("ui.dispatchcalc.setBorrowCount")}</SubtitleBar>
            <div className="flex flex-row gap-2">
              <Slider
                min={0}
                max={3}
                defaultValue={[3]}
                value={borrowLimit}
                onValueChange={setBorrowLimit}
                className="flex-1"
              />
              <div className="w-10">{borrowLimit[0]}</div>
            </div>
          </div>
        </div>
      )}
      <div className="pt-2 relative">
        {step === 0 &&
          t("ui.dispatchcalc.owningPetCount", {
            0: userDataDispatchablePets.o.length,
          })}
        {step === 1 &&
          t("ui.dispatchcalc.borrowablePetCount", {
            0: Object.values(userDataDispatchablePets.b).reduce(
              (a, b) => a + b,
              0
            ),
          })}
        {step === 2 &&
          t("ui.dispatchcalc.dispatchCount", { 0: includedDispatch.length })}
        {calcStatus === "running" &&
          t("ui.dispatchcalc.calculating", { 0: calcProgress / 100 })}
        {calcStatus === "done" &&
          t("ui.dispatchcalc.calculated", {
            0: solveTime < 10000 ? `${solveTime}ms` : `${solveTime / 1000}s`,
          })}
        <Button
          className="absolute top-0 bottom-0 right-0 h-full"
          size="sm"
          onClick={() => {
            if (step === 3 && calcStatus === "done") {
              setStep(0);
              setIncludedDispatch(pet.a.map((e) => e.i));
              setCalcStatus("idle");
              setCalcResult(undefined);
              setCalcProgress(0);
            } else setStep((s) => s + 1);
          }}
          disabled={calcStatus === "running"}
        >
          {t(
            step < 2
              ? "ui.dispatchcalc.toNext"
              : calcStatus !== "done"
              ? "ui.dispatchcalc.calculate"
              : "ui.dispatchcalc.retry"
          )}
          {calcStatus === "running" ? (
            <Loader className="w-4 h-4 inline-block -mr-1 animate-spin" />
          ) : calcStatus === "done" ? (
            <RotateCcw className="w-4 h-4 inline-block -mr-1" strokeWidth={3} />
          ) : (
            <ChevronRight
              className="w-4 h-4 inline-block -mr-1"
              strokeWidth={3}
            />
          )}
        </Button>
      </div>
      <div className="h-1 bg-muted flex flex-row items-start justify-start">
        <div
          className="bg-accent h-full"
          style={{ width: `${calcProgress / 100}%` }}
        />
      </div>
      <div className="h-1" />
      {step < 2 && (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(6rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(8rem,_1fr))] gap-2 p-1">
          {Object.entries(pet.p)
            .sort(([, a], [, b]) => b.r - a.r)
            .map(([id, petInfo]) => {
              return (
                <Card
                  key={id}
                  className={cn(
                    "sm:min-w-24 md:min-w-28 max-w-40 relative overflow-hidden bg-accent",
                    step === 0 &&
                      (userDataDispatchablePets.o.includes(id)
                        ? "ring-1 ring-accent"
                        : "opacity-80 grayscale-[.8]")
                  )}
                  onClick={() => step === 0 && petOwnClick(id)}
                >
                  <div
                    className="flex-1 py-1 text-shadow-glow"
                    style={{ backgroundColor: `${pet.r[petInfo.r].b}` }}
                  >
                    {t(`pet.name.${id}`)}
                  </div>
                  <div className="relative">
                    <div className="flex flex-col gap-px absolute top-0.5 left-0.5">
                      {Object.entries(petInfo.s)
                        .sort(([, a], [, b]) => b - a)
                        .map(([skill, grade]) => {
                          return (
                            <div
                              key={skill}
                              className="flex flex-row gap-0.5 bg-background rounded-full p-0.5"
                            >
                              <img
                                src={`/pets/Pet_Characteristic_${skill}.png`}
                                className="w-4 h-4 inline-block align-middle"
                              />
                              <div className="text-xs">
                                {t(`pet.skill.${skill}`)}
                              </div>
                              <div className="text-xs pr-0.5">
                                {t(`pet.grade.${grade}`)}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {step === 0 && userDataDispatchablePets.o.includes(id) && (
                      <div className="absolute top-4 right-0.5 flex flex-col items-center">
                        <CheckCircle className="w-6 h-6" />
                        <div className="-mt-2 text-shadow-glow-0.75 text-sm">
                          {t("ui.dispatchcalc.owned")}
                        </div>
                      </div>
                    )}
                    {step === 1 && (
                      <div className="absolute top-4 right-0.5 flex flex-col items-center">
                        <div className="text-shadow-glow-1.5 text-xl">
                          {userDataDispatchablePets.b[id] || 0}
                        </div>
                        <div className="-mt-2 text-shadow-glow-0.75 text-sm">
                          {t("ui.dispatchcalc.specificBorrowableCount")}
                        </div>
                      </div>
                    )}
                    <div
                      className="text-xs text-right pr-0.5"
                      style={{ color: `${pet.r[petInfo.r].b}` }}
                    >
                      {t(`pet.petgrade.${petInfo.r}`)}
                    </div>
                  </div>
                  <div className="pt-7 pb-1 px-2 relative">
                    <img src={`/pets/Icon_${id}.png`} className="w-full" />
                  </div>
                  {step === 1 && (
                    <div className="flex flex-row gap-1 p-1">
                      <Button
                        className="bg-red-500 flex-1 h-8 p-1"
                        disabled={(userDataDispatchablePets.b[id] || 0) < 1}
                        onClick={() => petBorrowableValueDown(id)}
                      >
                        <Minus
                          className="h-full aspect-square"
                          strokeWidth={3}
                        />
                      </Button>
                      <Button
                        className="bg-blue-500 flex-1 h-8 p-1"
                        disabled={
                          Object.values(userDataDispatchablePets.b).reduce(
                            (a, b) => a + b,
                            0
                          ) > 18
                        }
                        onClick={() => petBorrowableValueUp(id)}
                      >
                        <Plus
                          className="h-full aspect-square"
                          strokeWidth={3}
                        />
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
        </div>
      )}
      {step > 1 && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 p-1 gap-2">
            {pet.a.map(({ i, b }) => {
              return (
                <Card
                  key={i}
                  className="relative bg-accent/25 p-2 flex flex-col"
                >
                  <div className="flex">
                    <div className="flex-initial text-center">
                      <div
                        style={{
                          backgroundImage: `url(/pets/GuildPetDispatch_ResultTimeIcon_${i
                            .toString()
                            .padStart(2, "0")}.png)`,
                        }}
                        className="w-24 aspect-[3/2] flex-initial bg-cover flex justify-center items-center text-sm text-shadow-glow"
                      >
                        {t("ui.dispatchcalc.dispatchTime", {
                          0: dispatchTime / 3600,
                        })}
                      </div>
                      <div className="flex flex-col gap-0.5 w-max justify-center items-center mx-auto">
                        <div className="text-center">
                          {t("ui.dispatchcalc.bonusSkill")}
                        </div>
                        {b.map((skill) => {
                          return (
                            <div
                              key={skill}
                              className="flex flex-row gap-0.5 bg-background rounded-full p-0.5 flex-initial w-max"
                            >
                              <img
                                src={`/pets/Pet_Characteristic_${skill}.png`}
                                className="w-4 h-4 inline-block align-middle"
                              />
                              <div className="text-xs pr-0.5">
                                {t(`pet.skill.${skill}`)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm bg-yellow-900 text-slate-50 rounded-xl">
                        {t(`pet.dispatch.area.${i}`)}
                      </div>
                      <div className="mt-2 p-1 bg-amber-400 text-yellow-900 rounded-lg break-keep">
                        {t(`pet.dispatch.task.${i}`)}
                      </div>
                      <div className="mt-2 flex flex-row gap-2 justify-center items-center">
                        <label htmlFor={`dispatch-${i}`}>
                          {t("ui.dispatchcalc.dispatch")}
                        </label>
                        <Switch
                          id={`dispatch-${i}`}
                          checked={includedDispatch.includes(i)}
                          onCheckedChange={(checked) =>
                            setIncludedDispatch((prev) =>
                              checked
                                ? [...prev, i].sort((a, b) => a - b)
                                : prev.filter((e) => e !== i)
                            )
                          }
                          disabled={calcStatus !== "idle"}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1" />
                  {calcResult &&
                    calcStatus === "done" &&
                    calcResult.assignments[`e${i}`] &&
                    calcResult.assignments[`e${i}`].rank >= 0 && (
                      <div className="mt-2 px-1 pb-2 rounded-md bg-background/85 shadow-md">
                        <SubtitleBar>
                          {t("ui.dispatchcalc.petAssigned")}
                        </SubtitleBar>
                        <div className="flex flex-row gap-1 justify-center h-12">
                          {calcResult.assignments[`e${i}`].pets.map((p) => {
                            if (p.isBorrowed) {
                              return (
                                <ItemSlot
                                  key={p.id}
                                  rarityInfo={pet.r[p.grade]}
                                  item={`/pets/${
                                    pet.n + pet.p[p.id.split("-")[0]].n
                                  }`}
                                  fullItemPath
                                  size={3}
                                  amount={t("ui.dispatchcalc.borrowed")}
                                  innerSize={100}
                                />
                              );
                            }
                            return (
                              <ItemSlot
                                key={p.id}
                                rarityInfo={pet.r[p.grade]}
                                item={`/pets/${pet.n + pet.p[p.id].n}`}
                                fullItemPath
                                size={3}
                                innerSize={100}
                              />
                            );
                          })}
                          {calcResult.assignments[`e${i}`].rank < 0 &&
                            t("ui.dispatchcalc.noPetAssigned")}
                        </div>
                        <SubtitleBar>
                          {t("ui.dispatchcalc.rewardAmount")}
                        </SubtitleBar>
                        <div className="flex flex-row gap-1 justify-center h-12">
                          {calcResult.assignments[`e${i}`].rank < 0 ? (
                            t("ui.dispatchcalc.noReward")
                          ) : (
                            <>
                              <img
                                src={`/pets/DispatchRank_${"DCBAS".charAt(
                                  calcResult.assignments[`e${i}`].rank
                                )}.png`}
                                className="w-12 h-12"
                              />
                              <GoldSlot
                                amount={
                                  pet.d.g[calcResult.assignments[`e${i}`].rank][
                                    pet.d.t.indexOf(dispatchTime)
                                  ]
                                }
                                size={3}
                              />
                              <ItemSlot
                                rarityInfo={{ s: "Orange" }}
                                item="/icons/CurrencyIcon_0048"
                                fullItemPath
                                amount={pet.d.c[
                                  calcResult.assignments[`e${i}`].rank
                                ][pet.d.t.indexOf(dispatchTime)].join("~")}
                                size={3}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetSolver;
