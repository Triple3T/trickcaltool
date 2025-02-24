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
import { Switch } from "@/components/ui/switch";

import pet from "@/data/pet";
import solveDispatch from "@/utils/solveDispatch";
import ItemSlot from "./components/parts/item-slot";
import GoldSlot from "./components/parts/gold-slot";
import SubtitleBar from "./components/parts/subtitlebar";

const PetSolver = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState<number>(0);
  const [ownedPets, setOwnedPets] = useState<string[]>([]);
  const [borrowablePets, setBorrowablePets] = useState<string[]>([]);
  const [includedDispatch, setIncludedDispatch] = useState<number[]>(
    pet.a.map((e) => e.i)
  );
  const [dispatchTime, setDispatchTime] = useState<number>(pet.d.t[3]);
  const [calcStatus, setCalcStatus] = useState<"idle" | "running" | "done">(
    "idle"
  );
  const [calcResult, setCalcResult] = useState<
    ReturnType<typeof solveDispatch> | undefined
  >();
  const [solveTime, setSolveTime] = useState<number>(0);
  const startTime = useRef<number>(0);

  useEffect(() => {
    if (step === 3) {
      setCalcStatus("running");
      setTimeout(() => {
        startTime.current = Date.now();
        const result = solveDispatch({
          dispatchTime,
          ownedPets,
          borrowablePets,
          dispatchList: pet.a.filter((e) => includedDispatch.includes(e.i)),
        });
        setCalcResult(result);
      }, 100);
    }
  }, [borrowablePets, dispatchTime, includedDispatch, ownedPets, step]);
  useEffect(() => {
    if (step === 3 && calcStatus === "running" && calcResult) {
      setSolveTime(Date.now() - startTime.current);
      setCalcStatus("done");
    }
  }, [calcResult, calcStatus, step]);

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
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => setOwnedPets(Object.keys(pet.p))}
          >
            {t("ui.dispatchcalc.checkAll")}
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => setOwnedPets([])}
          >
            {t("ui.dispatchcalc.uncheckAll")}
          </Button>
        </div>
      )}
      {step === 2 && (
        <div className="flex px-1 py-2 gap-1 justify-stretch">
          {pet.d.t.map((time) => {
            return (
              <Button
                key={time}
                className="flex-1"
                variant={dispatchTime === time ? "default" : "outline"}
                onClick={() => setDispatchTime(time)}
              >
                {t("ui.dispatchcalc.dispatchTime", { 0: time / 3600 })}
              </Button>
            );
          })}
        </div>
      )}
      <div className="p-1 relative">
        {step === 0 &&
          t("ui.dispatchcalc.owningPetCount", { 0: ownedPets.length })}
        {step === 1 &&
          t("ui.dispatchcalc.borrowablePetCount", {
            0: borrowablePets.length,
          })}
        {step === 2 &&
          t("ui.dispatchcalc.dispatchCount", { 0: includedDispatch.length })}
        {calcStatus === "running" && t("ui.dispatchcalc.calculating")}
        {calcStatus === "done" &&
          t("ui.dispatchcalc.calculated", { 0: solveTime < 1000 ? `${solveTime}ms` : `${solveTime / 1000}s` })}
        <Button
          className="absolute top-0 bottom-0 right-0 h-full"
          onClick={() => {
            if (step === 3 && calcStatus === "done") {
              setStep(0);
              setIncludedDispatch(pet.a.map((e) => e.i));
              setCalcStatus("idle");
              setCalcResult(undefined);
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
                      (ownedPets.includes(id)
                        ? "ring-1 ring-accent"
                        : "opacity-80 grayscale-[.8]")
                  )}
                  onClick={() =>
                    step === 0 &&
                    setOwnedPets((prev) =>
                      prev.includes(id)
                        ? prev.filter((e) => e !== id)
                        : [...prev, id]
                    )
                  }
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
                    {step === 0 && ownedPets.includes(id) && (
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
                          {borrowablePets.filter((v) => v === id).length}
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
                        disabled={
                          borrowablePets.length < 1 ||
                          !borrowablePets.includes(id)
                        }
                        onClick={() =>
                          setBorrowablePets((prev) => {
                            const arr = [...prev];
                            arr.splice(prev.indexOf(id), 1);
                            return [...arr];
                          })
                        }
                      >
                        <Minus
                          className="h-full aspect-square"
                          strokeWidth={3}
                        />
                      </Button>
                      <Button
                        className="bg-blue-500 flex-1 h-8 p-1"
                        disabled={borrowablePets.length > 18}
                        onClick={() =>
                          setBorrowablePets((prev) => [...prev, id])
                        }
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
                      <img
                        src={`/pets/GuildPetDispatch_ResultTimeIcon_${i
                          .toString()
                          .padStart(2, "0")}.png`}
                        className="w-24 aspect-[3/2] flex-initial"
                      />
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
                                amount={
                                  pet.d.c[calcResult.assignments[`e${i}`].rank][
                                    pet.d.t.indexOf(dispatchTime)
                                  ]
                                }
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
