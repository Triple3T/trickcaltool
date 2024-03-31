import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/contexts/AuthContext";
import Layout from "@/components/layout";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ItemSlot from "@/components/parts/item-slot";
import SubtitleBar from "@/components/parts/subtitlebar";
import lab from "@/data/lab";
import myhomeupgrade from "@/data/myhomeupgrade";
import collection from "@/data/collection";
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

interface MyHomeLevels {
  lab: number[];
  restaurant: number[];
  myhome: number[];
  schedule: number[];
  archive: number[];
}

interface CollectionProducible {
  id: string;
  material: { [key: string]: number };
  fame: number;
  rarity: number;
  collected: boolean;
  seconds: number;
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
  myHomeLevels: MyHomeLevels;
  myHomeMaterialRemain: MaterialRemain;
  collectionProducible: CollectionProducible[];
  collectionMaterialRemain: MaterialRemain;
  producibleFame: number;
  producedFame: number;
  isDirty: number;
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

interface LabDataRestoreAction {
  type: "restore";
  payload: LabDataPropsCore;
}

interface LabDataChangeIndexAction {
  type: "index";
  payload: {
    indexDepth1: number;
    indexDepth2: number;
  };
}

const labDataChangeIndexActionHandler = (
  state: NonNullable<LabDataProps>,
  action: LabDataChangeIndexAction
): LabDataProps => {
  const { indexDepth1, indexDepth2 } = action.payload;
  userdata.lab.save({ 1: indexDepth1, 2: indexDepth2 });
  const currentLab = { indexDepth1, indexDepth2 };
  const effectTotal = reduceEffectTotal(currentLab);
  const materialRemain = reduceMaterialRemain(currentLab);
  return {
    ...state,
    currentLab,
    effectTotal,
    materialRemain,
    isDirty: state ? (((state.isDirty ?? 0) + 1) % 32768) + 65536 : 0,
  };
};

const materialObjectMerge = (
  target: Record<string, number | undefined>,
  source: Record<string, number | undefined>
): Record<string, number> => {
  const output = { ...target } as Record<string, number>;
  Object.entries(source).forEach(([key, value]) => {
    if (value) output[key] = (output[key] ?? 0) + value;
  });
  return output;
};

interface LabDataChangeMyHomeLevelAction {
  type: "myhomelevel";
  payload: {
    target: keyof MyHomeLevels;
    index: number;
    value: number;
  };
}

const labDataChangeMyHomeLevelActionHandler = (
  state: NonNullable<LabDataProps>,
  action: LabDataChangeMyHomeLevelAction
): LabDataProps => {
  const { target, index, value } = action.payload;
  const targetLevel = state.myHomeLevels[target];
  targetLevel[index] = value;
  const myHomeLevelsAfter = {
    ...state.myHomeLevels,
    [target]: [...targetLevel],
  };
  userdata.myhome.save({
    l: myHomeLevelsAfter.lab,
    r: myHomeLevelsAfter.restaurant,
    m: myHomeLevelsAfter.myhome,
    s: myHomeLevelsAfter.schedule,
    a: myHomeLevelsAfter.archive,
  });
  const labMaterialRemain = myhomeupgrade.l
    .slice(myHomeLevelsAfter.lab[0], myHomeLevelsAfter.lab[1])
    .reduce(materialObjectMerge, { g: 0 });
  const restaurantMaterialRemain = myhomeupgrade.r
    .slice(myHomeLevelsAfter.restaurant[0], myHomeLevelsAfter.restaurant[1])
    .reduce(materialObjectMerge, { g: 0 });
  const myhomeMaterialRemain = myhomeupgrade.m
    .slice(myHomeLevelsAfter.myhome[0], myHomeLevelsAfter.myhome[1])
    .reduce(materialObjectMerge, { g: 0 });
  const scheduleMaterialRemain = myhomeupgrade.s
    .slice(myHomeLevelsAfter.schedule[0], myHomeLevelsAfter.schedule[1])
    .reduce(materialObjectMerge, { g: 0 });
  // const archiveMaterialRemain = myhomeupgrade.a
  //   .slice(myHomeLevelsAfter.archive[0], myHomeLevelsAfter.archive[1])
  //   .reduce(materialObjectMerge, { g: 0 });
  const myHomeMaterialRemain = [
    labMaterialRemain,
    restaurantMaterialRemain,
    myhomeMaterialRemain,
    scheduleMaterialRemain,
    // archiveMaterialRemain,
  ].reduce(materialObjectMerge, { g: 0 }) as Record<string, number>;
  const { g, ...m } = myHomeMaterialRemain;
  return {
    ...state,
    myHomeLevels: myHomeLevelsAfter,
    myHomeMaterialRemain: { m, g },
    isDirty: state ? (((state.isDirty ?? 0) + 1) % 32768) + 65536 : 0,
  };
};

interface LabDataChangeCollectionAction {
  type: "collection";
  payload: {
    id: string;
    collected: boolean;
  };
}

const labDataChangeCollectionActionHandler = (
  state: NonNullable<LabDataProps>,
  action: LabDataChangeCollectionAction
): LabDataProps => {
  const { id, collected } = action.payload;
  const collectionProducible = state.collectionProducible.map((v) =>
    v.id === id ? { ...v, collected } : v
  );
  userdata.collection.save({
    c: collectionProducible.filter((v) => v.collected).map((v) => v.id),
  });
  const remainingCollectionProducible = collectionProducible.filter(
    (v) => !v.collected
  );
  const collectionMaterialRemain = remainingCollectionProducible
    .map((v) => v.material)
    .reduce(materialObjectMerge, { g: 0 });
  const { g, ...m } = collectionMaterialRemain;
  const producibleFame = remainingCollectionProducible
    .map((v) => v.fame)
    .reduce((a, b) => a + b, 0);
  const producedFame = collectionProducible
    .filter((v) => v.collected)
    .map((v) => v.fame)
    .reduce((a, b) => a + b, 0);
  return {
    ...state,
    collectionProducible,
    collectionMaterialRemain: { m, g },
    producibleFame,
    producedFame,
    isDirty: state ? (((state.isDirty ?? 0) + 1) % 32768) + 65536 : 0,
  };
};

interface LabDataClean {
  type: "clean";
}

const labDataCleanActionHandler = (
  state: NonNullable<LabDataProps>
): LabDataProps => {
  return { ...state, isDirty: 0 };
};

type LabDataReduceAction =
  | LabDataRestoreAction
  | LabDataChangeIndexAction
  | LabDataChangeMyHomeLevelAction
  | LabDataChangeCollectionAction
  | LabDataClean;

const labDataReducer = (
  state: LabDataProps,
  action: LabDataReduceAction
): LabDataProps => {
  if (action.type === "restore") return action.payload;
  if (!state) return state;
  switch (action.type) {
    case "index":
      return labDataChangeIndexActionHandler(state, action);
    case "myhomelevel":
      return labDataChangeMyHomeLevelActionHandler(state, action);
    case "collection":
      return labDataChangeCollectionActionHandler(state, action);
    case "clean":
      // return labDataCleanActionHandler(state);
      if (state) return labDataCleanActionHandler(state);
      break;
    default:
      throw new Error();
  }
};

const mergeDecomp = (
  prev: { [key: string]: number },
  curr: { [key: string]: number }
): { [key: string]: number } => {
  Object.entries(curr).forEach(([k, v]) => {
    if (prev[k]) prev[k] += v;
    else prev[k] = v;
  });
  return prev;
};

const decompOnlyProd = (
  key: string,
  value: number,
  depth: number
): { [key: string]: number } => {
  const smt = material.m[key].m;
  const isOnlyProd = !material.m[key].g;
  if (smt && (!depth || isOnlyProd)) {
    return Object.entries(smt)
      .map(([k, v]) => decompOnlyProd(k, v * value, depth + 1))
      .reduce(mergeDecomp, {} as { [key: string]: number });
  }
  return { [key]: value };
};

const decomp = (key: string, value: number): { [key: string]: number } => {
  const smt = material.m[key].m;
  if (smt) {
    return Object.entries(smt)
      .map(([k, v]) => decomp(k, v * value))
      .reduce(mergeDecomp, {} as { [key: string]: number });
  }
  return { [key]: value };
};

const decompAll = (
  m: { [key: string]: number },
  f?: boolean
): { [key: string]: number } => {
  return Object.entries(m)
    .map(([k, v]) => (f ? decomp(k, v) : decompOnlyProd(k, v, 0)))
    .reduce(mergeDecomp, {} as { [key: string]: number });
};

const Lab = () => {
  const { t } = useTranslation();
  const { googleLinked, isReady, autoLoad, autoSave } = useContext(AuthContext);
  const [labData, dispatchLabData] = useReducer(labDataReducer, undefined);
  const [materialDepth, setMaterialDepth] = useState<
    "indexDepth1" | "indexDepth2"
  >("indexDepth2");
  const [showMaterialRemainCategory, setShowMaterialRemainCategory] = useState<
    boolean[]
  >([true, true, false]);
  const [showAsSubMaterial, setShowAsSubMaterial] = useState(false);
  const [collectionCategory, setCollectionCategory] =
    useState<string>("Figure");
  const [page, setPage] = useState(0);
  const [repairedAlert, setRepairedAlert] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const initFromUserData = useCallback(() => {
    const { autoRepaired: ar1, ...userDataLabProto } = userdata.lab.load();
    const { autoRepaired: ar2, ...userDataMyHomeProto } =
      userdata.myhome.load();
    const { autoRepaired: ar3, ...userDataCollectionProto } =
      userdata.collection.load();
    if (ar1 || ar2 || ar3) setRepairedAlert(true);
    const currentLab = {
      indexDepth1: userDataLabProto[1],
      indexDepth2: userDataLabProto[2],
    };
    const collectionProducible = (
      Object.entries(collection.c).filter(([, c]) =>
        Object.keys(c).includes("m")
      ) as unknown as [
        string,
        { m: { [key: string]: number }; s: number; f: number; r: number }
      ][]
    ).map(([id, c]) => ({
      id,
      material: c.m,
      fame: c.f,
      rarity: c.r,
      collected: userDataCollectionProto.c.includes(id),
      seconds: c.s,
    }));
    const producedCollection = collectionProducible.filter(({ id }) =>
      userDataCollectionProto.c.includes(id)
    );
    const remainCollectionProducible = collectionProducible.filter(
      ({ id }) => !userDataCollectionProto.c.includes(id)
    );
    dispatchLabData({
      type: "restore",
      payload: {
        currentLab,
        materialRemain: reduceMaterialRemain(currentLab),
        effectTotal: reduceEffectTotal(currentLab),
        myHomeLevels: {
          lab: userDataMyHomeProto.l,
          restaurant: userDataMyHomeProto.r,
          myhome: userDataMyHomeProto.m,
          schedule: userDataMyHomeProto.s,
          archive: userDataMyHomeProto.a,
        },
        myHomeMaterialRemain: (() => {
          const { g, ...m } = [
            myhomeupgrade.l
              .slice(userDataMyHomeProto.l[0], userDataMyHomeProto.l[1])
              .reduce(materialObjectMerge, { g: 0 }),
            myhomeupgrade.r
              .slice(userDataMyHomeProto.r[0], userDataMyHomeProto.r[1])
              .reduce(materialObjectMerge, { g: 0 }),
            myhomeupgrade.m
              .slice(userDataMyHomeProto.m[0], userDataMyHomeProto.m[1])
              .reduce(materialObjectMerge, { g: 0 }),
            myhomeupgrade.s
              .slice(userDataMyHomeProto.s[0], userDataMyHomeProto.s[1])
              .reduce(materialObjectMerge, { g: 0 }),
            // myhomeupgrade.a
            //   .slice(userDataMyHomeProto.a[0], userDataMyHomeProto.a[1])
            //   .reduce(materialObjectMerge, { g: 0 }),
          ].reduce(materialObjectMerge, { g: 0 }) as Record<string, number>;
          return { m, g };
        })(),
        collectionProducible,
        collectionMaterialRemain: (() => {
          const { g, ...m } = remainCollectionProducible
            .map(({ material }) => material)
            .reduce(materialObjectMerge, { g: 0 });
          return { m, g };
        })(),
        producibleFame: remainCollectionProducible
          .map(({ fame }) => fame)
          .reduce((a, b) => a + b, 0),
        producedFame: producedCollection
          .map(({ fame }) => fame)
          .reduce((a, b) => a + b, 0),
        isDirty: 0,
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

  useEffect(() => {
    (async () => {
      if (isReady) {
        if (googleLinked && autoLoad && !loaded) {
          toast(t("ui.common.dataLoading"));
          await autoLoad();
          initFromUserData();
          toast(t("ui.common.dataLoaded"));
          setLoaded(true);
        }
        if (!googleLinked) initFromUserData();
      }
    })();
  }, [isReady, googleLinked, autoLoad, initFromUserData, t, loaded]);

  const timeoutRef = useRef<NodeJS.Timeout | undefined>();
  const autosaver = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      dispatchLabData({ type: "clean" });
      if (isReady && googleLinked && autoSave) {
        autoSave();
      }
    }, 500);
  }, [autoSave, googleLinked, isReady]);
  useEffect(() => {
    if (labData && labData.isDirty) autosaver();
  }, [autosaver, labData]);

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
              <div className="my-2 text-left flex items-center gap-2">
                <Switch
                  id="show-my-home-upgrade-materials"
                  checked={showMaterialRemainCategory[0]}
                  onCheckedChange={(a) => {
                    setShowMaterialRemainCategory(([, b, c]) => [a, b, c]);
                  }}
                />
                <Label htmlFor="show-my-home-upgrade-materials">
                  {t("ui.lab.showMyHomeUpgradeMaterials")}
                </Label>
              </div>
              <div className="my-2 text-left flex items-center gap-2">
                <Switch
                  id="show-lab-materials"
                  checked={showMaterialRemainCategory[1]}
                  onCheckedChange={(b) => {
                    setShowMaterialRemainCategory(([a, , c]) => [a, b, c]);
                  }}
                />
                <Label htmlFor="show-lab-materials">
                  {t("ui.lab.showLabMaterials")}
                </Label>
              </div>
              <div className="my-2 text-left flex items-center gap-2">
                <Switch
                  id="show-collection-materials"
                  checked={showMaterialRemainCategory[2]}
                  onCheckedChange={(c) => {
                    setShowMaterialRemainCategory(([a, b]) => [a, b, c]);
                  }}
                />
                <Label htmlFor="show-collection-materials">
                  {t("ui.lab.showCollectionMaterials")}
                </Label>
              </div>
              <div className="my-2 text-left flex items-center gap-2">
                <Switch
                  id="show-as-sub-materials"
                  checked={showAsSubMaterial}
                  onCheckedChange={(c) => {
                    setShowAsSubMaterial(c);
                  }}
                />
                <Label htmlFor="show-as-sub-materials">
                  {t("ui.lab.showRemainAsSubMaterials")}
                </Label>
              </div>
              {labData && (
                <div className="flex flex-row flex-wrap gap-2 p-2 mt-2 justify-evenly">
                  {Object.entries(
                    [
                      showMaterialRemainCategory[0]
                        ? showAsSubMaterial
                          ? decompAll(labData.myHomeMaterialRemain.m)
                          : labData.myHomeMaterialRemain.m
                        : {},
                      showMaterialRemainCategory[1]
                        ? showAsSubMaterial
                          ? decompAll(labData.materialRemain[materialDepth].m)
                          : labData.materialRemain[materialDepth].m
                        : {},
                      showMaterialRemainCategory[2]
                        ? showAsSubMaterial
                          ? decompAll(labData.collectionMaterialRemain.m)
                          : labData.collectionMaterialRemain.m
                        : {},
                    ].reduce(materialObjectMerge, {})
                  ).map(([item, amount]) => {
                    const rarityInfo = material.r[material.m[item].r];
                    return (
                      <ItemSlot
                        rarityInfo={rarityInfo}
                        item={item}
                        amount={amount}
                        key={item}
                      />
                    );
                  })}
                  {(showMaterialRemainCategory[0] ||
                    showMaterialRemainCategory[1]) && (
                    <ItemSlot
                      rarityInfo={{ s: "Gold" }}
                      item="/icons/CurrencyIcon_0008"
                      amount={
                        (showMaterialRemainCategory[0]
                          ? labData.myHomeMaterialRemain.g
                          : 0) +
                        (showMaterialRemainCategory[1]
                          ? labData.materialRemain[materialDepth].g
                          : 0)
                      }
                      fullItemPath
                    />
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <div className="w-full font-onemobile">
        <Tabs defaultValue="labStep" className="w-full">
          <TabsList className="w-full flex">
            <TabsTrigger value="levels" className="flex-1">
              <div>{t("ui.lab.tabLevels")}</div>
            </TabsTrigger>
            <TabsTrigger value="labStep" className="flex-1">
              <div>{t("ui.lab.tabLabStep")}</div>
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex-1">
              <div>{t("ui.lab.tabCollections")}</div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="levels">
            <div className="grid grid-cols-3 max-w-80 mx-auto gap-x-2 gap-y-4">
              <div>
                <SubtitleBar>{t("ui.lab.myHomeCategory")}</SubtitleBar>
              </div>
              <div>
                <SubtitleBar>{t("ui.lab.myHomeCurrentLevel")}</SubtitleBar>
              </div>
              <div>
                <SubtitleBar>{t("ui.lab.myHomeGoalLevel")}</SubtitleBar>
              </div>
              <div className="flex flex-col">
                <img
                  className="w-18 mx-auto"
                  src="/myhomeicons/MyHome_Button_001.png"
                />
                {t("myhome.lab")}
              </div>
              <div>
                <div>{labData ? labData.myHomeLevels.lab[0] + 1 : "-"}</div>
                {labData && (
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "lab",
                            index: 0,
                            value: Math.min(
                              labData.myHomeLevels.lab[1],
                              Math.max(labData.myHomeLevels.lab[0] - 1, 0)
                            ),
                          },
                        })
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "lab",
                            index: 0,
                            value: Math.min(
                              labData.myHomeLevels.lab[1],
                              Math.min(
                                labData.myHomeLevels.lab[0] + 1,
                                myhomeupgrade.l.length
                              )
                            ),
                          },
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <div>{labData ? labData.myHomeLevels.lab[1] + 1 : "-"}</div>
                {labData && (
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "lab",
                            index: 1,
                            value: Math.max(
                              labData.myHomeLevels.lab[0],
                              Math.max(labData.myHomeLevels.lab[1] - 1, 0)
                            ),
                          },
                        })
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "lab",
                            index: 1,
                            value: Math.max(
                              labData.myHomeLevels.lab[0],
                              Math.min(
                                labData.myHomeLevels.lab[1] + 1,
                                myhomeupgrade.l.length
                              )
                            ),
                          },
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <img
                  className="w-18 mx-auto"
                  src="/myhomeicons/MyHome_Button_002.png"
                />
                {t("myhome.restaurant")}
              </div>
              <div>
                <div>
                  {labData ? labData.myHomeLevels.restaurant[0] + 1 : "-"}
                </div>
                {labData && (
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "restaurant",
                            index: 0,
                            value: Math.min(
                              labData.myHomeLevels.restaurant[1],
                              Math.max(
                                labData.myHomeLevels.restaurant[0] - 1,
                                0
                              )
                            ),
                          },
                        })
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "restaurant",
                            index: 0,
                            value: Math.min(
                              labData.myHomeLevels.restaurant[1],
                              Math.min(
                                labData.myHomeLevels.restaurant[0] + 1,
                                myhomeupgrade.r.length
                              )
                            ),
                          },
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <div>
                  {labData ? labData.myHomeLevels.restaurant[1] + 1 : "-"}
                </div>
                {labData && (
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "restaurant",
                            index: 1,
                            value: Math.max(
                              labData.myHomeLevels.restaurant[0],
                              Math.max(
                                labData.myHomeLevels.restaurant[1] - 1,
                                0
                              )
                            ),
                          },
                        })
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "restaurant",
                            index: 1,
                            value: Math.max(
                              labData.myHomeLevels.restaurant[0],
                              Math.min(
                                labData.myHomeLevels.restaurant[1] + 1,
                                myhomeupgrade.r.length
                              )
                            ),
                          },
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <img
                  className="w-18 mx-auto"
                  src="/myhomeicons/MyHome_Button_003.png"
                />
                {t("myhome.myhome")}
              </div>
              <div>
                <div>{labData ? labData.myHomeLevels.myhome[0] + 1 : "-"}</div>
                {labData && (
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "myhome",
                            index: 0,
                            value: Math.min(
                              labData.myHomeLevels.myhome[1],
                              Math.max(labData.myHomeLevels.myhome[0] - 1, 0)
                            ),
                          },
                        })
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "myhome",
                            index: 0,
                            value: Math.min(
                              labData.myHomeLevels.myhome[1],
                              Math.min(
                                labData.myHomeLevels.myhome[0] + 1,
                                myhomeupgrade.m.length
                              )
                            ),
                          },
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <div>{labData ? labData.myHomeLevels.myhome[1] + 1 : "-"}</div>
                {labData && (
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "myhome",
                            index: 1,
                            value: Math.max(
                              labData.myHomeLevels.myhome[0],
                              Math.max(labData.myHomeLevels.myhome[1] - 1, 0)
                            ),
                          },
                        })
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "myhome",
                            index: 1,
                            value: Math.max(
                              labData.myHomeLevels.myhome[0],
                              Math.min(
                                labData.myHomeLevels.myhome[1] + 1,
                                myhomeupgrade.m.length
                              )
                            ),
                          },
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <img
                  className="w-18 mx-auto"
                  src="/myhomeicons/MyHome_Button_004.png"
                />
                {t("myhome.schedule")}
              </div>
              <div>
                <div>
                  {labData ? labData.myHomeLevels.schedule[0] + 1 : "-"}
                </div>
                {labData && (
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "schedule",
                            index: 0,
                            value: Math.min(
                              labData.myHomeLevels.schedule[1],
                              Math.max(labData.myHomeLevels.schedule[0] - 1, 0)
                            ),
                          },
                        })
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "schedule",
                            index: 0,
                            value: Math.min(
                              labData.myHomeLevels.schedule[1],
                              Math.min(
                                labData.myHomeLevels.schedule[0] + 1,
                                myhomeupgrade.s.length
                              )
                            ),
                          },
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <div>
                  {labData ? labData.myHomeLevels.schedule[1] + 1 : "-"}
                </div>
                {labData && (
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "schedule",
                            index: 1,
                            value: Math.max(
                              labData.myHomeLevels.schedule[0],
                              Math.max(labData.myHomeLevels.schedule[1] - 1, 0)
                            ),
                          },
                        })
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        dispatchLabData({
                          type: "myhomelevel",
                          payload: {
                            target: "schedule",
                            index: 1,
                            value: Math.max(
                              labData.myHomeLevels.schedule[0],
                              Math.min(
                                labData.myHomeLevels.schedule[1] + 1,
                                myhomeupgrade.s.length
                              )
                            ),
                          },
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <img
                  className="w-18 mx-auto"
                  src="/myhomeicons/MyHome_Button_005.png"
                />
                {t("myhome.archive")}
              </div>
              <div>1</div>
              <div>1</div>
            </div>
          </TabsContent>
          <TabsContent value="labStep">
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
                      onClick={() =>
                        setPage(labData?.currentLab.indexDepth1 ?? 0)
                      }
                    >
                      {t("ui.lab.labStep", { 0: `${page + 1}` })}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setPage((v) => Math.min(v + 1, lab.l.length - 1))
                    }
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
                            (labData?.currentLab.indexDepth1.toString() ??
                              "0") +
                              (
                                labData?.currentLab.indexDepth2.toString() ??
                                "0"
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
                                      `stat.${
                                        StatType[lab.e[labeffect.e].s![0]]
                                      }`
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
                              (labData?.currentLab.indexDepth1.toString() ??
                                "0") +
                                (
                                  labData?.currentLab.indexDepth2.toString() ??
                                  "0"
                                ).padStart(4, "0")
                                ? ""
                                : " opacity-50"
                            }`}
                          >
                            {Object.entries(labeffect.m).map(
                              ([item, amount], index) => {
                                const rarityInfo =
                                  material.r[material.m[item].r];
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
          </TabsContent>
          <TabsContent value="collections">
            <div>
              <div className="break-keep text-sm text-right opacity-50">
                {t("ui.lab.aboutCollectionCriteria")
                  .split("\n")
                  .map((l, i) => {
                    return <div key={i}>{l}</div>;
                  })}
              </div>
              <div className="flex flex-col md:flex-row justify-center md:justify-between py-2 gap-2">
                <div className="flex flex-row justify-end items-center">
                  <div className="w-max rounded-full relative text-right pl-8 pr-3 bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-950">
                    <div className="w-10 h-full flex justify-center items-center absolute -left-2">
                      <img
                        className="w-full"
                        src="/myhomeicons/IconFamous_1.png"
                      />
                    </div>
                    {labData
                      ? `${labData.producedFame}/${
                          labData.producedFame + labData.producibleFame
                        } (${(
                          Math.round(
                            (labData.producedFame * 1000) /
                              (labData.producedFame + labData.producibleFame)
                          ) / 10
                        ).toFixed(1)}%)`
                      : "---"}
                  </div>
                </div>
                <ToggleGroup
                  className="w-max"
                  value={collectionCategory}
                  onValueChange={(v) => v && setCollectionCategory(v)}
                  type="single"
                >
                  <ToggleGroupItem value="Figure">
                    {t("ui.lab.collectionFigure")}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="KeyRing">
                    {t("ui.lab.collectionKeyRing")}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Poster">
                    {t("ui.lab.collectionPoster")}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Doll">
                    {t("ui.lab.collectionDoll")}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Pillow">
                    {t("ui.lab.collectionPillow")}
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,_minmax(16rem,_1fr))] gap-2">
                {labData &&
                  labData.collectionProducible
                    .filter(({ id }) => id.startsWith(collectionCategory))
                    .sort(({ id: xi }, { id: yi }) => {
                      let x = 0;
                      let y = 0;
                      const xn = xi.substring(collectionCategory.length);
                      const yn = yi.substring(collectionCategory.length);
                      const sz = (s: string) => {
                        if (s === "S") return 0;
                        if (s === "M") return 1;
                        if (s === "L") return 2;
                        return 3;
                      };
                      x += sz(xn[0]) * 1000;
                      y += sz(yn[0]) * 1000;
                      x += parseInt(xn.substring(1));
                      y += parseInt(yn.substring(1));
                      return x - y;
                    })
                    .map(
                      ({
                        id,
                        material: mats,
                        rarity,
                        seconds,
                        fame,
                        collected,
                      }) => {
                        const s =
                          (seconds *
                            (100 -
                              (
                                (labData.effectTotal.find((e) => e.e === 10)
                                  ?.v ?? [0]) as number[]
                              )[0])) /
                          100;
                        return (
                          <Card
                            key={id}
                            className={cn(
                              "p-2 flex flex-col gap-2",
                              collected ? "bg-[#f2f9e7] dark:bg-[#36a52d]" : ""
                            )}
                          >
                            <div>{t(`collection.${id}`)}</div>
                            <div className="flex flex-row gap-4">
                              <div
                                className="w-20 h-20 relative flex-initial"
                                onClick={() => {
                                  dispatchLabData({
                                    type: "collection",
                                    payload: {
                                      id,
                                      collected: !collected,
                                    },
                                  });
                                }}
                              >
                                <ItemSlot
                                  rarityInfo={
                                    material.r[rarity] ?? {
                                      s: "Yellow",
                                    }
                                  }
                                  item={`/collections/${id}`}
                                  fullItemPath
                                />
                                {collected && (
                                  <div className="absolute w-8/12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100">
                                    <img
                                      src="/icons/Stage_RewardChack.png"
                                      className="w-100 opacity-100"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col flex-1 gap-2">
                                <div className="flex flex-row gap-2">
                                  {Object.entries(mats).map(([mat, amount]) => {
                                    return (
                                      <ItemSlot
                                        key={mat}
                                        rarityInfo={
                                          material.r[material.m[mat].r]
                                        }
                                        amount={amount}
                                        item={mat}
                                        size={3}
                                      />
                                    );
                                  })}
                                </div>
                                <div className="flex flex-row gap-2 text-sm">
                                  <div className="flex-auto rounded-full relative text-right pl-5 pr-2 bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-950">
                                    <div className="w-7 h-full flex justify-center items-center absolute -left-2">
                                      <img
                                        className="w-full"
                                        src="/common/ClockIcon_002.png"
                                      />
                                    </div>
                                    {Math.floor(s / 3600)
                                      .toString()
                                      .padStart(2, "0")}
                                    :
                                    {Math.floor((s % 3600) / 60)
                                      .toString()
                                      .padStart(2, "0")}
                                    :
                                    {Math.floor(s % 60)
                                      .toString()
                                      .padStart(2, "0")}
                                  </div>
                                  <div className="flex-auto rounded-full relative text-right pl-6 pr-2 bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-950">
                                    <div className="w-8 h-full flex justify-center items-center absolute -left-2">
                                      <img
                                        className="w-full"
                                        src="/myhomeicons/IconFamous_1.png"
                                      />
                                    </div>
                                    {fame}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      }
                    )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Lab;
