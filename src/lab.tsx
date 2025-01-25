import { use, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/contexts/AuthContext";
import Loading from "@/components/common/loading";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Select from "@/components/common/combobox-select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ItemSlot from "@/components/parts/item-slot";
import SubtitleBar from "@/components/parts/subtitlebar";
import lab from "@/data/lab";
import myhomeupgrade from "@/data/myhomeupgrade";
import collection from "@/data/collection";
import material from "@/data/material";
import { StatType, Race, LabEffectCategory } from "@/types/enums";

import ItemSlotWithRecipe from "./components/parts/item-slot-with-recipe";
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

const reduceEffectTotal = (index: LabDataCurrent) => {
  const labListDepth1 = lab.l.slice(0, index.indexDepth1).flat();
  const labListDepth2 = lab.l[index.indexDepth1].slice(
    0,
    index.indexDepth2 + 1
  );
  const effectTotal = [...labListDepth1, ...labListDepth2]
    .reduce((prev: (EffectByRace | EffectUniversal)[], curr) => {
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

const labRemainMaterialReducer = (index: LabDataCurrent): LabMaterialRemain => {
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
  const indexDepth1: MaterialRemain = labListDepth1.reduce(
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

const myHomeRemainMaterialReducer = (
  myHomeLevels: MyHomeLevels
): MaterialRemain => {
  const labMaterialRemain = myhomeupgrade.l
    .slice(myHomeLevels.lab[0], myHomeLevels.lab[1])
    .reduce(materialObjectMerge, { g: 0 });
  const restaurantMaterialRemain = myhomeupgrade.r
    .slice(myHomeLevels.restaurant[0], myHomeLevels.restaurant[1])
    .reduce(materialObjectMerge, { g: 0 });
  const myhomeMaterialRemain = myhomeupgrade.m
    .slice(myHomeLevels.myhome[0], myHomeLevels.myhome[1])
    .reduce(materialObjectMerge, { g: 0 });
  const scheduleMaterialRemain = myhomeupgrade.s
    .slice(myHomeLevels.schedule[0], myHomeLevels.schedule[1])
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
  return { m, g };
};

interface CollectionFilteredType {
  m: { [key: string]: number };
  s: number;
  f: number;
  r: number;
}

type CollectionFilteredEntry = [string, CollectionFilteredType];

interface CollectionRemainReturnType {
  collectionProducible: CollectionProducible[];
  collectionMaterialRemain: MaterialRemain;
  producibleFame: number;
  producedFame: number;
}

const collectionRemainMaterialReducer = (
  collected: string[]
): CollectionRemainReturnType => {
  const collectionProducible = (
    Object.entries(collection.c).filter(
      ([, cdata]) => "m" in cdata
    ) as CollectionFilteredEntry[]
  ).map(([cid, cdata]) => ({
    id: cid,
    material: cdata.m,
    fame: cdata.f,
    rarity: cdata.r,
    collected: collected.includes(cid),
    seconds: cdata.s,
  }));
  const remainingCollectionProducible = collectionProducible.filter(
    ({ collected }) => !collected
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
    collectionProducible,
    collectionMaterialRemain: { m, g },
    producibleFame,
    producedFame,
  };
};

enum DecompMode {
  NoDecomp = 0,
  DecompOneStep = 1,
  DecompTwoStep = 2,
  DecompProdOnly = 3,
}

const decompOnlyProd = (
  key: string,
  value: number,
  depth: number
): { [key: string]: number } => {
  if (material.m[key].g) return { [key]: value };
  const smt = material.m[key].m;
  const isOnlyProd = !material.m[key].g;
  if (smt && (!depth || isOnlyProd)) {
    return Object.entries(smt)
      .map(([k, v]) => decompOnlyProd(k, v * value, depth + 1))
      .reduce(materialObjectMerge, {} as { [key: string]: number });
  }
  return { [key]: value };
};

const decompAll = (materials: { [key: string]: number }, mode: DecompMode) => {
  if (mode === DecompMode.DecompProdOnly)
    return Object.entries(materials)
      .map(([k, v]) => decompOnlyProd(k, v, 0))
      .reduce(materialObjectMerge, {} as { [key: string]: number });
  const decompList = Object.entries(materials)
    .map(([k, v]) => {
      const recipe = material.m[k].m;
      const canDecomp = recipe && Object.keys(recipe).length !== 0;
      if (canDecomp)
        return Object.fromEntries(
          Object.entries(recipe).map(([mat, val]) => [mat, val * v])
        );
      return { [k]: v };
    })
    .reduce(materialObjectMerge, {} as { [key: string]: number });
  if (mode === DecompMode.DecompOneStep) return decompList;
  if (mode === DecompMode.DecompTwoStep)
    return decompAll(decompList, DecompMode.DecompOneStep);
  return materials;
};

const Lab = () => {
  const { t } = useTranslation();
  const { userData, userDataDispatch } = use(AuthContext);
  const effectTotal = useMemo(() => {
    if (!userData) return [];
    return reduceEffectTotal({
      indexDepth1: userData.lab[1],
      indexDepth2: userData.lab[2],
    });
  }, [userData]);
  const [materialDepth, setMaterialDepth] = useState<
    "indexDepth1" | "indexDepth2"
  >("indexDepth2");
  const materialRemainMyHome = useMemo(() => {
    if (!userData) return { m: {}, g: 0 };
    const { l, r, m, s, a } = userData.myhome;
    return myHomeRemainMaterialReducer({
      lab: l,
      restaurant: r,
      myhome: m,
      schedule: s,
      archive: a,
    });
  }, [userData]);
  const materialRemainLab = useMemo(() => {
    if (!userData)
      return { indexDepth1: { m: {}, g: 0 }, indexDepth2: { m: {}, g: 0 } };
    return labRemainMaterialReducer({
      indexDepth1: userData.lab[1],
      indexDepth2: userData.lab[2],
    });
  }, [userData]);
  const materialRemainCollection = useMemo(() => {
    if (!userData)
      return {
        collectionProducible: [],
        collectionMaterialRemain: { m: {}, g: 0 },
        producibleFame: -1,
        producedFame: -1,
      };
    return collectionRemainMaterialReducer(userData.collection.c);
  }, [userData]);
  const [showMaterialRemainCategory, setShowMaterialRemainCategory] = useState<
    boolean[]
  >([true, true, false]);
  const [showAsSubMaterial, setShowAsSubMaterial] = useState<DecompMode>(
    DecompMode.NoDecomp
  );
  const [collectionCategory, setCollectionCategory] =
    useState<string>("Figure");
  const [page, setPage] = useState(0);

  if (!userData || !userDataDispatch) return <Loading />;

  return (
    <>
      <Card className="p-4 object-cover max-w-xl mt-0 mb-4 gap-2 mx-auto font-onemobile">
        {/* Settings */}
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("ui.lab.cumulativeEffect")}</AccordionTrigger>
            <AccordionContent className="text-base">
              <div className="flex flex-col gap-1">
                {effectTotal.map((v) => {
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
                            Object.fromEntries(
                              Object.entries(v.v as number[]).map(([k, v]) => [
                                k,
                                v.toLocaleString(),
                              ])
                            )
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
                            0: Number(Object.keys(vt.v)[0]).toLocaleString(),
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
                                        src={`/album/Album_Icon_${Race[race]}.png`}
                                        alt={t(`race.${Race[race]}`)}
                                      />
                                    );
                                  })}
                                </div>
                                <div>{Number(value).toLocaleString()}</div>
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
                <div className="w-max text-sm">
                  {t("ui.lab.showLabRemainMode.label")}
                </div>
                <div className="flex-1">
                  <Select
                    value={materialDepth}
                    setValue={setMaterialDepth}
                    items={[
                      {
                        value: "indexDepth2",
                        label: t("ui.lab.showLabRemainMode.current"),
                      },
                      {
                        value: "indexDepth1",
                        label: t("ui.lab.showLabRemainMode.complete"),
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="my-2 text-left flex items-center gap-2">
                <div className="w-max text-sm">
                  {t("ui.lab.showMaterialRemainMode.label")}
                </div>
                <div className="flex-1">
                  <Select
                    value={showAsSubMaterial + 1}
                    setValue={(c) => setShowAsSubMaterial(c - 1)}
                    items={Object.values(DecompMode)
                      .filter((v) => typeof v !== "number")
                      .map((v) => ({
                        value: DecompMode[v as keyof typeof DecompMode] + 1,
                        label: t(`ui.lab.showMaterialRemainMode.${v}`),
                      }))}
                  />
                </div>
              </div>
              <div className="flex flex-row flex-wrap gap-2 p-2 mt-2 justify-evenly">
                {Object.entries(
                  [
                    showMaterialRemainCategory[0]
                      ? decompAll(materialRemainMyHome.m, showAsSubMaterial)
                      : {},
                    showMaterialRemainCategory[1]
                      ? decompAll(
                          materialRemainLab[materialDepth].m,
                          showAsSubMaterial
                        )
                      : {},
                    showMaterialRemainCategory[2]
                      ? decompAll(
                          materialRemainCollection.collectionMaterialRemain.m,
                          showAsSubMaterial
                        )
                      : {},
                  ].reduce(materialObjectMerge, {})
                ).map(([item, amount]) => {
                  const itemObject = material.m[item];
                  const rarityInfo = material.r[itemObject.r];
                  return (
                    <ItemSlotWithRecipe
                      nameKey={`material.${item}`}
                      rarityInfo={rarityInfo}
                      item={item}
                      amount={amount}
                      key={item}
                      recipe={
                        itemObject.m &&
                        Object.entries(itemObject.m).map(([v, c]) => {
                          return {
                            rarityInfo: material.r[material.m[v].r],
                            item: v,
                            amount: c,
                          };
                        })
                      }
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
                        ? materialRemainMyHome.g
                        : 0) +
                      (showMaterialRemainCategory[1]
                        ? materialRemainLab[materialDepth].g
                        : 0)
                    }
                    fullItemPath
                  />
                )}
              </div>
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
                <div>{userData.myhome.l[0] + 1}</div>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={userData.myhome.l[0] === 0}
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "lab",
                        0,
                        Math.min(
                          userData.myhome.l[1],
                          Math.max(userData.myhome.l[0] - 1, 0)
                        )
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      userData.myhome.l[0] === myhomeupgrade.l.length ||
                      userData.myhome.l[0] === userData.myhome.l[1]
                    }
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "lab",
                        0,
                        Math.min(
                          userData.myhome.l[1],
                          Math.min(
                            userData.myhome.l[0] + 1,
                            myhomeupgrade.l.length
                          )
                        )
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div>{userData.myhome.l[1] + 1}</div>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      userData.myhome.l[1] === 0 ||
                      userData.myhome.l[1] === userData.myhome.l[0]
                    }
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "lab",
                        1,
                        Math.max(
                          userData.myhome.l[0],
                          Math.max(userData.myhome.l[1] - 1, 0)
                        )
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={userData.myhome.l[1] === myhomeupgrade.l.length}
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "lab",
                        1,
                        Math.max(
                          userData.myhome.l[0],
                          Math.min(
                            userData.myhome.l[1] + 1,
                            myhomeupgrade.l.length
                          )
                        )
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col">
                <img
                  className="w-18 mx-auto"
                  src="/myhomeicons/MyHome_Button_002.png"
                />
                {t("myhome.restaurant")}
              </div>
              <div>
                <div>{userData.myhome.r[0] + 1}</div>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={userData.myhome.r[0] === 0}
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "restaurant",
                        0,
                        Math.min(
                          userData.myhome.r[1],
                          Math.max(userData.myhome.r[0] - 1, 0)
                        )
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      userData.myhome.r[0] === myhomeupgrade.r.length ||
                      userData.myhome.r[0] === userData.myhome.r[1]
                    }
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "restaurant",
                        0,
                        Math.min(
                          userData.myhome.r[1],
                          Math.min(
                            userData.myhome.r[0] + 1,
                            myhomeupgrade.r.length
                          )
                        )
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div>{userData.myhome.r[1] + 1}</div>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      userData.myhome.r[1] === 0 ||
                      userData.myhome.r[1] === userData.myhome.r[0]
                    }
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "restaurant",
                        1,
                        Math.max(
                          userData.myhome.r[0],
                          Math.max(userData.myhome.r[1] - 1, 0)
                        )
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={userData.myhome.r[1] === myhomeupgrade.r.length}
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "restaurant",
                        1,
                        Math.max(
                          userData.myhome.r[0],
                          Math.min(
                            userData.myhome.r[1] + 1,
                            myhomeupgrade.r.length
                          )
                        )
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col">
                <img
                  className="w-18 mx-auto"
                  src="/myhomeicons/MyHome_Button_003.png"
                />
                {t("myhome.myhome")}
              </div>
              <div>
                <div>{userData.myhome.m[0] + 1}</div>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={userData.myhome.m[0] === 0}
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "myhome",
                        0,
                        Math.min(
                          userData.myhome.m[1],
                          Math.max(userData.myhome.m[0] - 1, 0)
                        )
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      userData.myhome.m[0] === myhomeupgrade.m.length ||
                      userData.myhome.m[0] === userData.myhome.m[1]
                    }
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "myhome",
                        0,
                        Math.min(
                          userData.myhome.m[1],
                          Math.min(
                            userData.myhome.m[0] + 1,
                            myhomeupgrade.m.length
                          )
                        )
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div>{userData.myhome.m[1] + 1}</div>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      userData.myhome.m[1] === 0 ||
                      userData.myhome.m[1] === userData.myhome.m[0]
                    }
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "myhome",
                        1,
                        Math.max(
                          userData.myhome.m[0],
                          Math.max(userData.myhome.m[1] - 1, 0)
                        )
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={userData.myhome.m[1] === myhomeupgrade.m.length}
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "myhome",
                        1,
                        Math.max(
                          userData.myhome.m[0],
                          Math.min(
                            userData.myhome.m[1] + 1,
                            myhomeupgrade.m.length
                          )
                        )
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col">
                <img
                  className="w-18 mx-auto"
                  src="/myhomeicons/MyHome_Button_004.png"
                />
                {t("myhome.schedule")}
              </div>
              <div>
                <div>{userData.myhome.s[0] + 1}</div>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={userData.myhome.s[0] === 0}
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "schedule",
                        0,
                        Math.min(
                          userData.myhome.s[1],
                          Math.max(userData.myhome.s[0] - 1, 0)
                        )
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      userData.myhome.s[0] === myhomeupgrade.s.length ||
                      userData.myhome.s[0] === userData.myhome.s[1]
                    }
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "schedule",
                        0,
                        Math.min(
                          userData.myhome.s[1],
                          Math.min(
                            userData.myhome.s[0] + 1,
                            myhomeupgrade.s.length
                          )
                        )
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div>{userData.myhome.s[1] + 1}</div>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      userData.myhome.s[1] === 0 ||
                      userData.myhome.s[1] === userData.myhome.s[0]
                    }
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "schedule",
                        1,
                        Math.max(
                          userData.myhome.s[0],
                          Math.max(userData.myhome.s[1] - 1, 0)
                        )
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={userData.myhome.s[1] === myhomeupgrade.s.length}
                    onClick={() =>
                      userDataDispatch.labMyHomeLevel(
                        "schedule",
                        1,
                        Math.max(
                          userData.myhome.s[0],
                          Math.min(
                            userData.myhome.s[1] + 1,
                            myhomeupgrade.s.length
                          )
                        )
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
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
                    <span onClick={() => setPage(userData.lab[1] ?? 0)}>
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
                    const incompleted =
                      indexDepth1 * 10000 + indexDepth2 >
                      (userData.lab[1] ?? 0) * 10000 + (userData.lab[2] ?? 0);
                    return (
                      <Card
                        key={indexDepth2}
                        className={cn(
                          "text-center font-onemobile p-1 flex flex-row gap-2",
                          incompleted ? "" : "bg-[#f2f9e7] dark:bg-[#36a52d]"
                        )}
                        onClick={() =>
                          userDataDispatch.labIndex(indexDepth1, indexDepth2)
                        }
                      >
                        <div
                          className={cn(
                            "flex flex-col gap-1 flex-1",
                            incompleted ? "" : "opacity-50"
                          )}
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
                            <div className="break-keep">
                              {labeffect.t && lab.e[labeffect.e].s !== undefined
                                ? t(`lab.effect.${lab.e[labeffect.e].e}`, {
                                    0: lab.e[labeffect.e].v[0].toLocaleString(),
                                    1: t(`race.${Race[labeffect.t[0]]}`),
                                    2: t(
                                      `stat.${
                                        StatType[lab.e[labeffect.e].s![0]]
                                      }`
                                    ),
                                  })
                                : t(`lab.effect.${lab.e[labeffect.e].e}`, {
                                    0: lab.e[labeffect.e].v[0].toLocaleString(),
                                  })}
                            </div>
                          </div>
                          <div className="text-right">
                            <img
                              className="w-6 h-6 mr-1 inline align-middle"
                              src="/icons/CurrencyIcon_0008.png"
                            />
                            {labeffect.g.toLocaleString()}
                          </div>
                        </div>
                        <div className="relative">
                          <div
                            className={cn(
                              "flex justify-center",
                              incompleted ? "" : "opacity-50"
                            )}
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
                          {!incompleted && (
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
                    {materialRemainCollection
                      ? `${materialRemainCollection.producedFame}/${
                          materialRemainCollection.producedFame +
                          materialRemainCollection.producibleFame
                        } (${(
                          Math.round(
                            (materialRemainCollection.producedFame * 1000) /
                              (materialRemainCollection.producedFame +
                                materialRemainCollection.producibleFame)
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
                {materialRemainCollection.collectionProducible
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
                              (effectTotal.find((e) => e.e === 10)?.v ?? [
                                0,
                              ]) as number[]
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
                              onClick={() =>
                                userDataDispatch.labCollection(id, !collected)
                              }
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
                                      rarityInfo={material.r[material.m[mat].r]}
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
    </>
  );
};

export default Lab;
