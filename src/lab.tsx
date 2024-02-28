import { useCallback, useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Layout from "@/components/layout";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ItemSlot from "@/components/parts/item-slot";
import lab from "@/data/lab";
import material from "@/data/material";
import { StatType, Race, LabEffectCategory } from "@/types/enums";

import userdata from "@/utils/userdata";
// import { UserDataLab } from "@/types/types";
// import { dataFileRead, dataFileWrite } from "@/utils/dataRW";

interface LabDataCurrent {
  indexDepth1: number;
  indexDepth2: number;
}

interface MaterialRemain {
  m: { [key: string]: number };
  g: number;
}

interface LabMaterialRemain {
  indexDepth1: MaterialRemain;
  indexDepth2: MaterialRemain;
}

interface EffectByRace {
  e: 40; // effect id
  v: { [key: string]: number[] }; // value: race[]
  s: number; // stat type
}
interface EffectUniversal {
  e: number; // effect id
  v: number[]; // values
}

interface LabDataPropsCore {
  currentLab: LabDataCurrent;
  materialRemain: LabMaterialRemain;
  effectTotal: (EffectByRace | EffectUniversal)[];
}

type LabDataProps = LabDataPropsCore | undefined;

const reduceEffectTotal = (index: LabDataCurrent) => {
  const labListDepth1 = lab.l.slice(0, index.indexDepth1).flat();
  const labListDepth2 = lab.l[index.indexDepth1].slice(
    0,
    index.indexDepth2 + 1
  );
  const effectTotal = [...labListDepth1, ...labListDepth2]
    .reduce((prev: LabDataPropsCore["effectTotal"], curr) => {
      const currentEffect = lab.e[curr.e];
      if (currentEffect.e === 40) {
        const targetStat = currentEffect.s!;
        const targetRace = curr.t!;
        const targetValue = currentEffect.v;
        targetValue.forEach((value, index) => {
          const stat = targetStat[index];
          const race = targetRace[index];
          const prevIndex = prev.findIndex(
            (prevEffect) =>
              prevEffect.e === 40 && (prevEffect as EffectByRace).s === stat
          );
          if (prevIndex < 0) {
            prev.push({
              e: 40,
              v: { [value]: [race] },
              s: stat,
            });
          } else {
            const prevValueKV = Object.entries(
              (prev[prevIndex] as EffectByRace).v
            ).find(([, races]) => races.includes(race));
            if (prevValueKV) {
              const [prevValueString, prevRaces] = prevValueKV;
              (prev[prevIndex] as EffectByRace).v[prevValueString] =
                prevRaces.filter((prevRace) => prevRace !== race);
              const currValue = Number(prevValueString) + value;
              if ((prev[prevIndex] as EffectByRace).v[currValue])
                (prev[prevIndex] as EffectByRace).v[currValue].push(race);
              else (prev[prevIndex] as EffectByRace).v[currValue] = [race];
            } else {
              const currValue = value;
              if ((prev[prevIndex] as EffectByRace).v[currValue])
                (prev[prevIndex] as EffectByRace).v[currValue].push(race);
              else (prev[prevIndex] as EffectByRace).v[currValue] = [race];
            }
            (prev[prevIndex] as EffectByRace).v = Object.fromEntries(
              Object.entries((prev[prevIndex] as EffectByRace).v).filter(
                ([, races]) => races.length
              )
            );
          }
        });
      } else {
        const targetValue = currentEffect.v;
        const prevIndex = prev.findIndex(
          (prevEffect) => prevEffect.e === currentEffect.e
        );
        if (prevIndex < 0) {
          prev.push({
            e: currentEffect.e,
            v: targetValue,
          });
        } else {
          (prev[prevIndex] as EffectUniversal).v = (
            prev[prevIndex] as EffectUniversal
          ).v.map((prevValue, index) => prevValue + targetValue[index]);
        }
      }
      return prev;
    }, [] as (EffectByRace | EffectUniversal)[])
    .sort((a, b) => a.e - b.e);
  return effectTotal;
};

const reduceMaterialRemain = (index: LabDataCurrent) => {
  const labListDepth1 = lab.l.slice(index.indexDepth1 + 1).flat();
  const labListDepth2 = lab.l[index.indexDepth1].slice(index.indexDepth2 + 1);
  const indexDepth2 = labListDepth2.reduce(
    (prev: MaterialRemain, curr) => {
      const currentMaterial = curr.m;
      Object.entries(currentMaterial).forEach(([item, amount]) => {
        if (amount) {
          if (prev.m[item]) prev.m[item] += amount;
          else prev.m[item] = amount;
        }
      });
      prev.g += curr.g;
      return prev;
    },
    { m: {}, g: 0 }
  );
  const indexDepth1 = labListDepth1.reduce(
    (prev: MaterialRemain, curr) => {
      const currentMaterial = curr.m;
      Object.entries(currentMaterial).forEach(([item, amount]) => {
        if (amount) {
          if (prev.m[item]) prev.m[item] += amount;
          else prev.m[item] = amount;
        }
      });
      prev.g += curr.g;
      return prev;
    },
    { m: { ...indexDepth2.m }, g: indexDepth2.g }
  );
  return { indexDepth1, indexDepth2 };
};

interface LabDataChangeIndexAction {
  type: "index";
  payload: {
    indexDepth1: number;
    indexDepth2: number;
  };
}

const labDataChangeIndexActionHandler = (
  _state: LabDataProps,
  action: LabDataChangeIndexAction
): LabDataPropsCore => {
  const { indexDepth1, indexDepth2 } = action.payload;
  userdata.lab.save({ 1: indexDepth1, 2: indexDepth2 });
  const currentLab = { indexDepth1, indexDepth2 };
  const effectTotal = reduceEffectTotal(currentLab);
  const materialRemain = reduceMaterialRemain(currentLab);
  return { currentLab, effectTotal, materialRemain };
};

// type LabDataReduceAction = LabDataRestoreAction | LabDataChangeIndexAction;

const labDataReducer = (
  state: LabDataProps,
  action: LabDataChangeIndexAction
): LabDataProps => {
  // if (action.type === "restore") {
  //   return LabDataRestoreActionHandler(action);
  // }
  // if (!state) return state;
  switch (action.type) {
    case "index":
      return labDataChangeIndexActionHandler(state, action);
    default:
      throw new Error();
  }
};

const Lab = () => {
  const { t } = useTranslation();
  const [labData, dispatchLabData] = useReducer(labDataReducer, undefined);
  const [materialDepth, setMaterialDepth] = useState<
    "indexDepth1" | "indexDepth2"
  >("indexDepth2");
  const [page, setPage] = useState(0);
  const [repairedAlert, setRepairedAlert] = useState(false);

  const initFromUserData = useCallback(() => {
    const { autoRepaired: ar1, ...userDataLabProto } = userdata.lab.load();
    if (ar1) setRepairedAlert(true);
    dispatchLabData({
      type: "index",
      payload: {
        indexDepth1: userDataLabProto[1],
        indexDepth2: userDataLabProto[2],
      },
    });
    setPage(userDataLabProto[1]);
  }, []);
  useEffect(initFromUserData, [initFromUserData]);
  useEffect(() => {
    if (repairedAlert) {
      toast.info(t("ui.index.repairedAlert"));
      setRepairedAlert(false);
    }
  }, [repairedAlert, t]);

  return (
    <Layout>
      <Card className="p-4 object-cover max-w-xl mt-0 mb-4 gap-2 mx-auto font-onemobile">
        {/* Settings */}
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("ui.lab.cumulativeEffect")}</AccordionTrigger>
            <AccordionContent className="text-base">
              <div className="flex flex-col gap-1">
                {labData &&
                  labData.effectTotal.map((v) => {
                    if (v.e !== 40) {
                      return (
                        <div
                          key={v.e}
                          className="flex gap-1 bg-[#e9f5cf] dark:bg-[#169a2d] p-1 rounded-xl"
                        >
                          <div className="w-6 h-6 p-1 inline-flex bg-greenicon rounded-full align-middle">
                            <img
                              className="w-full aspect-square"
                              src={`/lab/Icon_${
                                LabEffectCategory[Math.floor(v.e / 10)]
                              }.png`}
                            />
                          </div>
                          <div className="flex-1">
                            {t(
                              `lab.effect.${v.e}`,
                              Object.fromEntries(Object.entries(v.v)) as {
                                [key: string]: number;
                              }
                            )}
                          </div>
                        </div>
                      );
                    }
                    if (v.e === 40 && Object.keys(v.v).length === 1) {
                      const vt = v as EffectByRace;
                      return (
                        <div
                          key={`${vt.e}-${vt.s}`}
                          className="flex gap-1 bg-[#e9f5cf] dark:bg-[#169a2d] p-1 rounded-xl"
                        >
                          <div className="w-6 h-6 p-1 inline-flex bg-greenicon rounded-full align-middle">
                            <img
                              className="w-full aspect-square"
                              src={`/lab/Icon_${
                                LabEffectCategory[Math.floor(vt.e / 10)]
                              }.png`}
                            />
                          </div>
                          <div className="w-6 h-6 inline-flex align-middle">
                            <img
                              className="w-full aspect-square"
                              src={`/icons/Icon_${StatType[vt.s]}.png`}
                            />
                          </div>
                          <div className="flex-1">
                            {t(`lab.effect.${vt.e}`, {
                              0: Object.keys(vt.v)[0],
                              1: "",
                              2: t(`stat.${StatType[vt.s]}`),
                            }).trim()}
                          </div>
                        </div>
                      );
                    }
                    const vt = v as EffectByRace;
                    return (
                      <div
                        key={`${vt.e}-${vt.s}`}
                        className="flex gap-1 bg-[#e9f5cf] dark:bg-[#169a2d] p-1 rounded-xl"
                      >
                        <div className="w-6 h-6 p-1 inline-flex bg-greenicon rounded-full align-middle">
                          <img
                            className="w-full aspect-square"
                            src={`/lab/Icon_${
                              LabEffectCategory[Math.floor(vt.e / 10)]
                            }.png`}
                          />
                        </div>
                        <div className="w-6 h-6 inline-flex align-middle">
                          <img
                            className="w-full aspect-square"
                            src={`/icons/Icon_${StatType[vt.s]}.png`}
                          />
                        </div>
                        <div className="flex-1">
                          <div>
                            {t(`lab.effect.${vt.e}`, {
                              0: "",
                              1: "",
                              2: t(`stat.${StatType[vt.s]}`),
                            })
                              .trim()
                              .replace("  ", " ")}
                          </div>
                          <div className="flex flex-row gap-1">
                            {Object.entries(vt.v).map(([value, races]) => {
                              return (
                                <div
                                  key={value}
                                  className="flex flex-auto flex-col gap-1"
                                >
                                  <div>
                                    {races.map((race) => {
                                      return (
                                        <img
                                          key={race}
                                          className="w-6 h-6 inline-block align-middle"
                                          src={`/icons/Common_UnitRace_${Race[race]}.png`}
                                          alt={t(`race.${Race[race]}`)}
                                        />
                                      );
                                    })}
                                  </div>
                                  <div>{value}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{t("ui.lab.remainMaterials")}</AccordionTrigger>
            <AccordionContent className="text-base">
              <Tabs value={materialDepth} className="w-full">
                <TabsList className="w-full flex">
                  <TabsTrigger
                    value="indexDepth2"
                    className="flex-1"
                    onClick={() => setMaterialDepth("indexDepth2")}
                  >
                    <div>{t("ui.lab.remainMaterialsDepth2")}</div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="indexDepth1"
                    className="flex-1"
                    onClick={() => setMaterialDepth("indexDepth1")}
                  >
                    <div>{t("ui.lab.remainMaterialsDepth1")}</div>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {labData && (
                <div className="flex flex-row flex-wrap gap-2 p-2 mt-2 justify-evenly">
                  {Object.entries(labData.materialRemain[materialDepth].m).map(
                    ([item, amount], index) => {
                      const rarityInfo = material.r[material.m[item].r];
                      return (
                        <ItemSlot
                          rarityInfo={rarityInfo}
                          item={item}
                          amount={amount}
                          key={index}
                        />
                      );
                    }
                  )}
                  <ItemSlot
                    rarityInfo={{ s: "Gold" }}
                    item="/icons/CurrencyIcon_0008"
                    amount={labData.materialRemain[materialDepth].g}
                    fullItemPath
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <div className="max-w-full w-80 mx-auto">
        <div className="relative w-full">
          <div className="font-onemobile text-xl p-2 mb-2 flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage((v) => Math.max(v - 1, 0))}
              disabled={page === 0}
              className="flex-1"
            >
              <ArrowLeft />
            </Button>
            <div className="flex flex-col items-center justify-center flex-auto min-w-max px-2 text-center">
              <span
                onClick={() => setPage(labData?.currentLab.indexDepth1 ?? 0)}
              >
                {page + 1}단계
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage((v) => Math.min(v + 1, lab.l.length - 1))}
              disabled={page === lab.l.length - 1}
              className="flex-1"
            >
              <ArrowRight />
            </Button>
          </div>
          <div className="top-16 z-10 flex flex-col gap-2">
            {lab.l[page].map((labeffect, indexDepth2) => {
              const indexDepth1 = page;
              return (
                <Card
                  key={indexDepth2}
                  className={`text-center font-onemobile p-1 flex flex-row gap-2${
                    indexDepth1.toString() +
                      indexDepth2.toString().padStart(4, "0") >
                    (labData?.currentLab.indexDepth1.toString() ?? "0") +
                      (
                        labData?.currentLab.indexDepth2.toString() ?? "0"
                      ).padStart(4, "0")
                      ? ""
                      : " bg-[#f2f9e7] dark:bg-[#36a52d]"
                  }`}
                  onClick={() =>
                    dispatchLabData({
                      type: "index",
                      payload: { indexDepth1, indexDepth2 },
                    })
                  }
                >
                  <div
                    className={`flex flex-col gap-1 flex-1${
                      indexDepth1.toString() +
                        indexDepth2.toString().padStart(4, "0") >
                      (labData?.currentLab.indexDepth1.toString() ?? "0") +
                        (
                          labData?.currentLab.indexDepth2.toString() ?? "0"
                        ).padStart(4, "0")
                        ? ""
                        : " opacity-50"
                    }`}
                  >
                    <div className="flex flex-row gap-1">
                      <div className="w-6 h-6 p-1 inline-flex bg-greenicon rounded-full align-middle">
                        <img
                          className="w-full aspect-square"
                          src={`/lab/Icon_${
                            LabEffectCategory[
                              Math.floor(lab.e[labeffect.e].e / 10)
                            ]
                          }.png`}
                        />
                      </div>
                      <div>
                        {labeffect.t && lab.e[labeffect.e].s !== undefined
                          ? t(`lab.effect.${lab.e[labeffect.e].e}`, {
                              0: lab.e[labeffect.e].v,
                              1: t(`race.${Race[labeffect.t[0]]}`),
                              2: t(
                                `stat.${StatType[lab.e[labeffect.e].s![0]]}`
                              ),
                            })
                          : t(`lab.effect.${lab.e[labeffect.e].e}`, {
                              0: lab.e[labeffect.e].v,
                            })}
                      </div>
                    </div>
                    <div className="text-right">
                      <img
                        className="w-6 h-6 mr-1 inline align-middle"
                        src="/icons/CurrencyIcon_0008.png"
                      />
                      {labeffect.g}
                    </div>
                  </div>
                  <div className="relative">
                    <div
                      className={`flex justify-center${
                        indexDepth1.toString() +
                          indexDepth2.toString().padStart(4, "0") >
                        (labData?.currentLab.indexDepth1.toString() ?? "0") +
                          (
                            labData?.currentLab.indexDepth2.toString() ?? "0"
                          ).padStart(4, "0")
                          ? ""
                          : " opacity-50"
                      }`}
                    >
                      {Object.entries(labeffect.m).map(
                        ([item, amount], index) => {
                          const rarityInfo = material.r[material.m[item].r];
                          return (
                            <ItemSlot
                              rarityInfo={rarityInfo}
                              item={item}
                              amount={amount}
                              size={3.5}
                              key={index}
                            />
                          );
                        }
                      )}
                    </div>
                    {indexDepth1.toString() +
                      indexDepth2.toString().padStart(4, "0") >
                    (labData?.currentLab.indexDepth1.toString() ?? "0") +
                      (
                        labData?.currentLab.indexDepth2.toString() ?? "0"
                      ).padStart(4, "0") ? null : (
                      <div className="absolute w-8/12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 z-10">
                        <img
                          src="/icons/Stage_RewardChack.png"
                          className="w-100 opacity-100"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Lab;
