import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
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
import Select from "@/components/common/combobox-select";
import LazyInput from "@/components/common/lazy-input";
import ArtifactPicker from "@/components/teambuilder/artifact-picker";
import CharaPicker from "@/components/teambuilder/chara-picker";
import CheerPicker from "@/components/teambuilder/cheer-picker";
import SpellPicker from "@/components/teambuilder/spell-picker";
import CardSpecDialog from "@/components/teambuilder/card-spec-dialog";
import chara from "@/data/chara";
import cheer from "@/data/cheer";
import card from "@/data/card";
import skillcoefficient from "@/data/skillcoefficient";
import {
  Aside3EffectCategory,
  Personality,
  Position,
  StatType,
} from "@/types/enums";
import { CharaWithArtifact } from "@/types/types";
import { personalityBG, personalityBGTranslucent } from "@/utils/personalityBG";
import {
  useUserDataCharaInfo,
  useUserDataUsingIDB,
} from "@/stores/useUserDataStore";
import {
  saveTeamData as saveTeamDataIdb,
  loadTeamData as loadTeamDataIdb,
} from "@/utils/idbRW";
import {
  saveTeamData as saveTeamDataLS,
  loadTeamData as loadTeamDataLS,
} from "@/utils/localStorageRW";
import {
  compressXorB64,
  decompressXorB64,
  numberIntoB64,
} from "@/utils/pakoB64Pack";

// af
// import { useIsAFActive } from "@/stores/useAFDataStore";
import { getCharaImageUrl } from "@/utils/getImageUrl";
import { Checkbox } from "./components/ui/checkbox";

const FRONT_COLOR = "#e35a5b";
const MID_COLOR = "#57bc3f";
const BACK_COLOR = "#5593f0";
const OPACITY_HEX = "57";
const FRONT_COLOR_OPACITY = `${FRONT_COLOR}${OPACITY_HEX}`;
const MID_COLOR_OPACITY = `${MID_COLOR}${OPACITY_HEX}`;
const BACK_COLOR_OPACITY = `${BACK_COLOR}${OPACITY_HEX}`;
const ASIDE3_CATEGORY_COUNT = Object.values(Aside3EffectCategory).filter(
  (v) => typeof v === "number"
).length;
const ASIDE3_CATEGORY_SORT = [
  [7, 8, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  [4, 9, 1],
  [5, 10, 2],
  [6, 11, 3],
];
const ASIDE3_CATEGORY_ALL_AFFECT_CATEGORY_EXISTS = [
  Aside3EffectCategory.AllDamageUp,
  Aside3EffectCategory.AllReceiveDamageDown,
];
const ASIDE3_CATEGORY_ALL_AFFECT: Record<string, Aside3EffectCategory> = {
  [Aside3EffectCategory.FrontDamageUp]: Aside3EffectCategory.AllDamageUp,
  [Aside3EffectCategory.MiddleDamageUp]: Aside3EffectCategory.AllDamageUp,
  [Aside3EffectCategory.BackDamageUp]: Aside3EffectCategory.AllDamageUp,
  [Aside3EffectCategory.FrontReceiveDamageDown]:
    Aside3EffectCategory.AllReceiveDamageDown,
  [Aside3EffectCategory.MiddleReceiveDamageDown]:
    Aside3EffectCategory.AllReceiveDamageDown,
  [Aside3EffectCategory.BackReceiveDamageDown]:
    Aside3EffectCategory.AllReceiveDamageDown,
};
const ASIDE3_CATEGORY_FIXED_VALUE = [
  Aside3EffectCategory.FrontSpUp,
  Aside3EffectCategory.MiddleSpUp,
  Aside3EffectCategory.BackSpUp,
];

const charaColCollection: Record<string, string[]> = {
  [Position.Front]: [],
  [Position.Middle]: [],
  [Position.Back]: [],
  [Position.Free]: [],
};
Object.entries(chara).forEach(([key, value]) => {
  const pos = value.t.charAt(3);
  switch (Number(pos)) {
    case 0:
      charaColCollection[Position.Front].push(key);
      break;
    case 1:
      charaColCollection[Position.Middle].push(key);
      break;
    case 2:
      charaColCollection[Position.Back].push(key);
      break;
    default:
      charaColCollection[Position.Free].push(key);
  }
});

const TeamBuilder = () => {
  const { t } = useTranslation();
  const userCharaInfo = useUserDataCharaInfo();
  const isUsingIdb = useUserDataUsingIDB();
  const [currentTeam, setCurrentTeam] = useState<CharaWithArtifact[]>([]);
  const [teamSpec, setTeamSpec] = useState<Record<string, number>>({});
  const [restrictType, setRestrictType] = useState<number>(0);
  const [soloRaidStep, setSoloRaidStep] = useState<number>(1);
  const [soloRaidResearchSlot, setSoloRaidResearchSlot] = useState<number>(0);
  const [separateAllApplyEffect, setSeparateAllApplyEffect] = useState(false);
  const [soloEndCoinLimit, setSoloEndCoinLimit] = useState<number>(0);
  const [buyAuthority, setBuyAuthority] = useState<boolean>(true);
  const [usingSpells, setUsingSpells] = useState<Record<string, number>>({});
  const [usingCheers, setUsingCheers] = useState<Record<string, number>>({});
  const [cardLevels, setCardLevels] = useState<
    Record<"a" | "s", Record<string, number>>
  >({
    a: Object.fromEntries(card.a.o.map((v) => [v, 1])),
    s: Object.fromEntries(card.s.o.map((v) => [v, 1])),
  });
  const [allIncludeFlag, setAllIncludeFlag] = useState<number>(1);

  // soloraid artifact count
  const artifactCount = useMemo(() => {
    return currentTeam.reduce(
      (acc, cur) => (cur?.artifacts.filter((v) => v).length ?? 0) + acc,
      0
    );
  }, [currentTeam]);

  // soloend card limit
  const frontierLimit = useMemo(() => {
    const usedArtifacts = currentTeam
      .map((e) => e?.artifacts ?? [])
      .flat()
      .filter((v) => v);
    const limits = Object.fromEntries(
      [...new Set(usedArtifacts)].map((v) => [
        v,
        {
          limit: card.a.l[v].l,
          count: usedArtifacts.filter((e) => e === v).length,
        },
      ])
    );
    const artifactCoinCost = usedArtifacts.reduce((acc, cur) => {
      const curCostData = card.a.l[cur].p;
      const actualCost = Array.isArray(curCostData)
        ? curCostData[cardLevels.a[cur] - 1]
        : curCostData;
      return acc + actualCost;
    }, 0);
    const disabledArtifact = Object.entries(limits)
      .filter(([, { limit, count }]) => count >= limit)
      .map(([k]) => Number(k));
    let spellCoinCost = 0;
    const spellStat = {
      [StatType.Hp]: 0,
      [StatType.AttackPhysic]: 0,
      [StatType.AttackMagic]: 0,
      [StatType.DefensePhysic]: 0,
      [StatType.DefenseMagic]: 0,
      [StatType.CriticalRate]: 0,
      [StatType.CriticalMult]: 0,
      [StatType.CriticalResist]: 0,
      [StatType.CriticalMultResist]: 0,
      [StatType.AttackSpeed]: 0,
    };
    const allAffectSpellLikeAside3CategoryProto: Record<string, number> = {
      [Aside3EffectCategory.AllDamageUp]: 0,
      [Aside3EffectCategory.AllReceiveDamageDown]: 0,
      [Aside3EffectCategory.FrontDamageUp]: 0,
      [Aside3EffectCategory.MiddleDamageUp]: 0,
      [Aside3EffectCategory.BackDamageUp]: 0,
      [Aside3EffectCategory.FrontReceiveDamageDown]: 0,
      [Aside3EffectCategory.MiddleReceiveDamageDown]: 0,
      [Aside3EffectCategory.BackReceiveDamageDown]: 0,
      [Aside3EffectCategory.AllAttackSpeedUp]: 0,
      [Aside3EffectCategory.AllSkillDamageUp]: 0,
    };
    let allNormalAttackDamage = 0;
    let allSkillAttackDamage = 0;
    Object.entries(usingSpells).forEach(([ss, count]) => {
      const s = Number(ss);
      const cardInfo = card.s.l[s];
      const cardLevel = cardLevels.s[s];
      const cardCostData = cardInfo.p;
      const cardCost = Array.isArray(cardCostData)
        ? cardCostData[cardLevel - 1]
        : cardCostData;
      spellCoinCost += cardCost * count;
      const cardStat: StatType[] = cardInfo.s;
      const cardStatValue = cardInfo.c.map((a) =>
        a === "p" ? (cardCostData as Array<number>) : a
      );
      cardStat.forEach((stat, index) => {
        spellStat[stat] += cardStatValue[index][cardLevel - 1] * count;
      });
      // allAffectLikeAside3
      if (s === 18) {
        // 안 아프게 맞는 법
        allAffectSpellLikeAside3CategoryProto[
          Aside3EffectCategory.AllReceiveDamageDown
        ] += cardStatValue[2][cardLevel - 1] * count;
      } else if (s === 15) {
        // 선봉대
        allAffectSpellLikeAside3CategoryProto[
          Aside3EffectCategory.FrontDamageUp
        ] += cardStatValue[2][cardLevel - 1] * count;
        allAffectSpellLikeAside3CategoryProto[
          Aside3EffectCategory.FrontReceiveDamageDown
        ] += cardStatValue[3][cardLevel - 1] * count;
      } else if (s === 27) {
        // 중앙굿
        allAffectSpellLikeAside3CategoryProto[
          Aside3EffectCategory.MiddleDamageUp
        ] += cardStatValue[1][cardLevel - 1] * count;
        allAffectSpellLikeAside3CategoryProto[
          Aside3EffectCategory.MiddleReceiveDamageDown
        ] += cardStatValue[2][cardLevel - 1] * count;
      } else if (s === 43) {
        // 후발대
        allAffectSpellLikeAside3CategoryProto[
          Aside3EffectCategory.BackDamageUp
        ] += cardStatValue[1][cardLevel - 1] * count;
        allAffectSpellLikeAside3CategoryProto[
          Aside3EffectCategory.BackReceiveDamageDown
        ] += cardStatValue[2][cardLevel - 1] * count;
      } else if (s === 7) {
        // 전투의달인 - 스킬피해
        allSkillAttackDamage += cardStatValue[2][cardLevel - 1] * count;
      } else if (s === 13) {
        // 사기진작 - 공속
        allAffectSpellLikeAside3CategoryProto[
          Aside3EffectCategory.AllAttackSpeedUp
        ] += cardStatValue[1][cardLevel - 1] * count;
      } else if (s === 19) {
        // 약자무시 - 평타피해
        allNormalAttackDamage += cardStatValue[2][cardLevel - 1] * count;
      } else if (s === 23) {
        // 저놈 잡아라 - 웨이브 피해량
        allAffectSpellLikeAside3CategoryProto[
          Aside3EffectCategory.AllDamageUp
        ] += cardStatValue[1][cardLevel - 1] * count;
      } else if (s === 24) {
        // 전술 교본 - 피해량
        allAffectSpellLikeAside3CategoryProto[
          Aside3EffectCategory.AllDamageUp
        ] += cardStatValue[2][cardLevel - 1] * count;
      } else if (s === 31) {
        // 치매 - 평타피해
        allNormalAttackDamage += cardStatValue[2][cardLevel - 1] * count;
      }
    });
    allAffectSpellLikeAside3CategoryProto[Aside3EffectCategory.AllDamageUp] +=
      allNormalAttackDamage;
    allAffectSpellLikeAside3CategoryProto[
      Aside3EffectCategory.AllSkillDamageUp
    ] += allSkillAttackDamage - allNormalAttackDamage;
    const authorityCoinCost = buyAuthority ? 30 : 0;
    const allAffectSpellLikeAside3Category = Object.fromEntries(
      Object.entries(allAffectSpellLikeAside3CategoryProto).map(([k, v]) => [
        k,
        v * 100,
      ])
    );
    let cheerCoinCost = 0;
    const cheerStat = {
      [StatType.Hp]: 0,
      [StatType.AttackPhysic]: 0,
      [StatType.AttackMagic]: 0,
      [StatType.DefensePhysic]: 0,
      [StatType.DefenseMagic]: 0,
      [StatType.CriticalRate]: 0,
      [StatType.CriticalMult]: 0,
      [StatType.CriticalResist]: 0,
      [StatType.CriticalMultResist]: 0,
      [StatType.AttackSpeed]: 0,
    };
    const cheerLikeAside3Category: Record<string, number> = {
      [Aside3EffectCategory.AllDamageUp]: 0,
      [Aside3EffectCategory.AllReceiveDamageDown]: 0,
      [Aside3EffectCategory.AllSkillDamageUp]: 0,
    };
    Object.entries(usingCheers).forEach(([ss, count]) => {
      const s = Number(ss);
      const cheerInfo = cheer.c[s];
      const cheerTotalCost =
        (cheerInfo.firstPrice * (cheerInfo.purchaseMult ** count - 1)) /
        (cheerInfo.purchaseMult - 1);
      cheerCoinCost += cheerTotalCost;
      cheerInfo.stat.forEach((stat, index) => {
        cheerStat[stat] += cheerInfo.statValue[index] * count;
      });
      cheerInfo.aside3LikeCategory.forEach((cate, index) => {
        cheerLikeAside3Category[cate] +=
          cheerInfo.aside3LikeValue[index] * count * 100;
      });
    });

    return {
      limits,
      disabledArtifact,
      usingCoin:
        artifactCoinCost + spellCoinCost + authorityCoinCost + cheerCoinCost,
      spellStat,
      allAffectSpellLikeAside3Category,
      cheerStat,
      cheerLikeAside3Category,
    };
  }, [
    buyAuthority,
    cardLevels.a,
    cardLevels.s,
    currentTeam,
    usingCheers,
    usingSpells,
  ]);

  // calculate synergy
  const synergyTotal = useMemo(() => {
    const personalities: Record<string, number> = {
      [Personality.Gloomy]: 0,
      [Personality.Jolly]: 0,
      [Personality.Mad]: 0,
      [Personality.Cool]: 0,
      [Personality.Naive]: 0,
    };
    if (teamSpec["Ui"] >= 7) {
      personalities[Personality.Jolly] += 1;
    }
    currentTeam.forEach((e) => {
      if (e?.charaName) personalities[chara[e.charaName].t.charAt(0)] += 1;
    });
    const synergyBorder = [11, 10, 9, 7, 6, 4, 2];
    const synergyPercent = [260, 230, 200, 140, 100, 55, 20];
    const synergyApplied: Array<{
      personality: Personality;
      count: number;
      percent: number;
    }> = [];
    const personalityNotAppliedToSynergy: Record<string, number> = {
      ...personalities,
    };
    Object.entries(personalities).forEach(([personalityString, count]) => {
      const index = synergyBorder.findIndex((v) => count >= v);
      if (index < 0) return;
      const personality = Number(personalityString);
      synergyApplied.push({
        personality,
        count: synergyBorder[index],
        percent: synergyPercent[index],
      });
      personalityNotAppliedToSynergy[personalityString] -= synergyBorder[index];
    });
    const notAppliedPersonalities: Personality[] = Object.entries(
      personalityNotAppliedToSynergy
    )
      .map(([personalityString, count]) =>
        Array(count).fill(Number(personalityString))
      )
      .flat();
    return {
      synergyApplied,
      notAppliedPersonalities,
    };
  }, [currentTeam, teamSpec]);

  // total aside3 effects
  const aside3Total = useMemo(() => {
    const aside3Values: number[] = Array(ASIDE3_CATEGORY_COUNT).fill(0);
    const currentTeamMembers = currentTeam
      .map((e) => e?.charaName)
      .filter((v) => v);
    Object.entries(teamSpec)
      .filter(([n, v]) => currentTeamMembers.includes(n) && v >= 8)
      .forEach(([charaName]) => {
        const charaAside3Types = skillcoefficient.c[charaName].a?.e3;
        const charaAside3Values = skillcoefficient.c[charaName].a?.[3];
        if (!charaAside3Types || !charaAside3Values) return;
        charaAside3Types.forEach((v, i) => {
          aside3Values[v] += charaAside3Values[i] * 100;
        });
      });
    return aside3Values;
  }, [currentTeam, teamSpec]);

  // save
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const restrictTypeB64 = numberIntoB64(restrictType, 4);
    const teamData = compressXorB64(
      JSON.stringify({
        restrictType,
        currentTeam,
        teamSpec,
        soloRaidStep,
        soloRaidResearchSlot,
        separateAllApplyEffect,
        soloEndCoinLimit,
        buyAuthority,
        usingSpells,
        usingCheers,
        cardLevels,
      })
    );
    const dataToSave = `b0${restrictTypeB64}${teamData}`;
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    saveTimeout.current = setTimeout(() => {
      if (typeof isUsingIdb === "boolean") {
        if (isUsingIdb) {
          saveTeamDataIdb(dataToSave);
        } else {
          saveTeamDataLS(dataToSave);
        }
      }
    }, 1000);
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [
    buyAuthority,
    cardLevels,
    currentTeam,
    isUsingIdb,
    restrictType,
    separateAllApplyEffect,
    soloEndCoinLimit,
    soloRaidResearchSlot,
    soloRaidStep,
    teamSpec,
    usingCheers,
    usingSpells,
  ]);
  // load
  useEffect(() => {
    if (typeof isUsingIdb === "boolean") {
      if (isUsingIdb) {
        loadTeamDataIdb().then((data) => {
          if (!data) return;
          if (!data.startsWith("b0")) return;
          const {
            restrictType,
            currentTeam,
            teamSpec,
            soloRaidStep,
            soloRaidResearchSlot,
            separateAllApplyEffect,
            soloEndCoinLimit,
            buyAuthority,
            usingSpells,
            usingCheers,
            cardLevels,
          } = JSON.parse(decompressXorB64(data.substring(6)));
          if (restrictType) setRestrictType(restrictType);
          if (currentTeam) setCurrentTeam(currentTeam);
          if (teamSpec) setTeamSpec(teamSpec);
          if (soloRaidStep) setSoloRaidStep(soloRaidStep);
          if (soloRaidResearchSlot)
            setSoloRaidResearchSlot(soloRaidResearchSlot);
          if (typeof separateAllApplyEffect === "boolean")
            setSeparateAllApplyEffect(separateAllApplyEffect);
          if (soloEndCoinLimit) setSoloEndCoinLimit(soloEndCoinLimit);
          if (typeof buyAuthority === "boolean") setBuyAuthority(buyAuthority);
          if (usingSpells) setUsingSpells(usingSpells);
          if (usingCheers) setUsingCheers(usingCheers);
          if (cardLevels)
            setCardLevels((prev) => ({
              a: { ...prev.a, ...cardLevels.a },
              s: { ...prev.s, ...cardLevels.s },
            }));
        });
      } else {
        loadTeamDataLS().then((data) => {
          if (!data) return;
          if (!data.startsWith("b0")) return;
          const {
            restrictType,
            currentTeam,
            teamSpec,
            soloRaidStep,
            soloRaidResearchSlot,
            separateAllApplyEffect,
            soloEndCoinLimit,
            buyAuthority,
            usingSpells,
            cardLevels,
          } = JSON.parse(decompressXorB64(data.substring(6)));
          if (restrictType) setRestrictType(restrictType);
          if (currentTeam) setCurrentTeam(currentTeam);
          if (teamSpec) setTeamSpec(teamSpec);
          if (soloRaidStep) setSoloRaidStep(soloRaidStep);
          if (soloRaidResearchSlot)
            setSoloRaidResearchSlot(soloRaidResearchSlot);
          if (typeof separateAllApplyEffect === "boolean")
            setSeparateAllApplyEffect(separateAllApplyEffect);
          if (soloEndCoinLimit) setSoloEndCoinLimit(soloEndCoinLimit);
          if (typeof buyAuthority === "boolean") setBuyAuthority(buyAuthority);
          if (usingSpells) setUsingSpells(usingSpells);
          if (cardLevels)
            setCardLevels((prev) => ({
              a: { ...prev.a, ...cardLevels.a },
              s: { ...prev.s, ...cardLevels.s },
            }));
        });
      }
    }
  }, [isUsingIdb]);

  return (
    <div className="font-onemobile max-w-xl mx-auto">
      <div className="text-xl text-center">{t("ui.teambuilder.title")}</div>
      <Card className="p-2">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              {t(
                `ui.teambuilder.${
                  ["no", "soloRaid", "soloEnd"][restrictType]
                }RestrictAccordion`
              )}
            </AccordionTrigger>
            <AccordionContent className="text-base">
              <Tabs
                value={`${restrictType}`}
                className="w-full"
                onValueChange={(v) => {
                  if (!v || restrictType.toString() === v) return;
                  setRestrictType(Number(v));
                }}
              >
                <TabsList className={cn("w-full flex")}>
                  <TabsTrigger value="0" className="flex-1">
                    <div>{t("ui.teambuilder.noRestrict")}</div>
                  </TabsTrigger>
                  <TabsTrigger value="1" className="flex-1">
                    <div>{t("ui.teambuilder.soloRaidRestrict")}</div>
                  </TabsTrigger>
                  <TabsTrigger value="2" className="flex-1">
                    <div>{t("ui.teambuilder.soloEndRestrict")}</div>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="0">
                  <div className="mb-2 break-keep">
                    {t("ui.teambuilder.noRestrictDescription")}
                  </div>
                </TabsContent>
                <TabsContent value="1">
                  <div className="mb-2 break-keep">
                    {t("ui.teambuilder.soloRaidRestrictDescription")}
                  </div>
                  <div className="flex p-1 gap-2 items-baseline">
                    <Select
                      value={soloRaidStep}
                      setValue={setSoloRaidStep}
                      placeholder={t("ui.teambuilder.raidStep", { 0: "+1" })}
                      items={Array(3)
                        .fill(0)
                        .map((_, step) => ({
                          value: step + 1,
                          label: t("ui.teambuilder.raidStep", {
                            0: step + 1 === 3 ? "" : `+${step + 1}`,
                          }),
                        }))}
                    />
                    <Select
                      value={soloRaidResearchSlot || -1}
                      setValue={(v) => setSoloRaidResearchSlot(Math.max(v, 0))}
                      placeholder={t("ui.teambuilder.raidExtraSlotNone")}
                      items={Array(4)
                        .fill(0)
                        .map((_, count) => ({
                          value: count || -1,
                          label: t(
                            count
                              ? "ui.teambuilder.raidExtraSlot"
                              : "ui.teambuilder.raidExtraSlotNone",
                            { 0: count }
                          ),
                        }))}
                    />
                  </div>
                  <div className="mt-2 text-base">
                    {t("ui.teambuilder.soloRaidArtifactCount")}
                    <span
                      className={cn(
                        "ml-2 text-lg text-shadow-glow",
                        artifactCount >
                          [13, 5, 8][soloRaidStep % 3] + soloRaidResearchSlot
                          ? "text-red-700 dark:text-red-400"
                          : "text-green-600 dark:text-green-300"
                      )}
                    >
                      <span className="text-2xl">{artifactCount}</span>/
                      {[13, 5, 9][soloRaidStep % 3] + soloRaidResearchSlot}
                    </span>
                  </div>
                </TabsContent>
                <TabsContent value="2">
                  <div className="mb-2 break-keep">
                    {t("ui.teambuilder.soloEndRestrictDescription")}
                  </div>
                  <div className="flex flex-row flex-wrap px-1 py-2 mb-2 gap-4 items-baseline">
                    <div>{t("ui.teambuilder.soloEndCoinLimit")}</div>
                    <LazyInput
                      value={`${soloEndCoinLimit || ""}`}
                      sanitize={(v) =>
                        `${Math.max(
                          0,
                          Math.min(
                            9999,
                            parseInt(v.replaceAll(/\D/g, "") || "0") || 0
                          )
                        )}`
                      }
                      onValueChange={(e) => setSoloEndCoinLimit(Number(e))}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{0,4}"
                      min={0}
                      max={9999}
                      placeholder={t("ui.teambuilder.coinLimitPlaceHolder")}
                      className="flex-1 text-right w-24"
                    />
                    <div className="text-sm opacity-75">
                      {t("ui.teambuilder.coinLimitIfEmpty")}
                    </div>
                  </div>
                  <div className="mt-2 mb-4 text-base flex gap-2 justify-around items-baseline">
                    <div
                      className={cn(
                        "w-10 h-10 bg-cover flex items-center justify-center text-shadow-glow-2",
                        soloEndCoinLimit > 0 ? "text-xl" : "text-2xl"
                      )}
                      style={{
                        backgroundImage:
                          "url(/ingameui/Icon_SoloEndInGameCoin.png)",
                      }}
                    >
                      {soloEndCoinLimit > 0
                        ? soloEndCoinLimit - frontierLimit.usingCoin
                        : "∞"}
                    </div>
                    <div>
                      {t("ui.teambuilder.soloEndCoinCost")}
                      <span
                        className={cn(
                          "ml-2 text-lg text-shadow-glow",
                          soloEndCoinLimit &&
                            soloEndCoinLimit < frontierLimit.usingCoin
                            ? "text-red-700 dark:text-red-400"
                            : "text-green-600 dark:text-green-300"
                        )}
                      >
                        <span className="text-2xl">
                          {frontierLimit.usingCoin}
                        </span>
                        /
                        {soloEndCoinLimit ||
                          t("ui.teambuilder.coinLimitPlaceHolder")}
                      </span>
                    </div>
                  </div>
                  <Tabs className="w-full" defaultValue="0">
                    <TabsList
                      className={cn("grid grid-cols-2 md:grid-cols-4 h-max")}
                    >
                      <TabsTrigger value="0">
                        <div>{t("ui.teambuilder.textAuthority")}</div>
                      </TabsTrigger>
                      <TabsTrigger value="1">
                        <div>{t("ui.teambuilder.textArtifact")}</div>
                      </TabsTrigger>
                      <TabsTrigger value="2">
                        <div>{t("ui.teambuilder.textSpell")}</div>
                      </TabsTrigger>
                      <TabsTrigger value="3">
                        <div>{t("ui.teambuilder.textCheer")}</div>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="0">
                      <div className="px-2 my-2">
                        <Checkbox
                          id="buy-authority"
                          checked={buyAuthority}
                          onCheckedChange={(v) => setBuyAuthority(!!v)}
                          disabled={
                            soloEndCoinLimit > 0 &&
                            !buyAuthority &&
                            frontierLimit.usingCoin + 30 > soloEndCoinLimit
                          }
                          className="inline align-middle mr-2"
                        />
                        <label
                          htmlFor="buy-authority"
                          className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t("ui.teambuilder.buyAuthority")}
                        </label>
                        <div
                          className={cn(
                            "ml-2 w-7 h-7 bg-cover items-center justify-center text-shadow-glow-2 inline-flex"
                          )}
                          style={{
                            backgroundImage:
                              "url(/ingameui/Icon_SoloEndInGameCoin.png)",
                          }}
                        >
                          30
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="1">
                      <div className="text-xs text-left ml-2">
                        {t("ui.teambuilder.usingArtifact")}
                      </div>
                      <div className="grid grid-cols-[repeat(auto-fill,_minmax(5rem,_1fr))] auto-rows-auto gap-2 min-h-10 rounded bg-accent/90 p-2">
                        {Object.entries(frontierLimit.limits)
                          .sort(
                            ([a], [b]) =>
                              card.a.o.indexOf(Number(a)) -
                              card.a.o.indexOf(Number(b))
                          )
                          .map(([v, { limit, count }]) => {
                            const targetArtifact = card.a.l[v];
                            return (
                              <div key={v} className="w-20 p-2 mx-auto">
                                <div
                                  className="w-16 h-16 bg-cover p-2 rounded-lg border-2 ring-foreground ring-2"
                                  style={{
                                    backgroundImage: `url(/ingameui/Ingame_CardBase_Artifact_${
                                      card.r[targetArtifact.r].s
                                    }.png)`,
                                    backgroundColor: card.r[targetArtifact.r].b,
                                    borderColor: card.r[targetArtifact.r].b,
                                  }}
                                >
                                  <img
                                    src={`/artifacts/ArtifactIcon_${v}.png`}
                                    alt={t(`card.artifact.${v}.title`)}
                                    className="max-w-full max-h-full mx-auto"
                                  />
                                </div>
                                <div
                                  className={cn(
                                    "mt-1",
                                    count > limit &&
                                      "text-red-700 dark:text-red-400"
                                  )}
                                >
                                  {count}/{limit}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </TabsContent>
                    <TabsContent value="2">
                      <div className="mt-4 text-right -mb-1">
                        <SpellPicker
                          currentUsingSpells={usingSpells}
                          spellLevels={cardLevels.s}
                          onChange={setUsingSpells}
                          onReset={() => setUsingSpells({})}
                          disableAll={restrictType === 1}
                          disableMinCost={
                            restrictType === 2 &&
                            soloEndCoinLimit > 0 &&
                            soloEndCoinLimit - frontierLimit.usingCoin
                          }
                        />
                      </div>
                      <div className="text-xs text-left ml-2">
                        {t("ui.teambuilder.usingSpell")}
                      </div>
                      <div className="grid grid-cols-[repeat(auto-fill,_minmax(5rem,_1fr))] auto-rows-auto gap-2 min-h-10 rounded bg-accent/90 p-2">
                        {card.s.o.map((s) => {
                          if (!usingSpells[s]) return null;
                          const targetSpell = card.s.l[s];
                          const count = usingSpells[s];
                          const limit = targetSpell.l;
                          return (
                            <div key={s} className="w-20 p-2 mx-auto">
                              <div
                                className="w-16 h-16 bg-cover rounded-lg border-2 ring-foreground ring-2 overflow-hidden"
                                style={{
                                  backgroundColor: card.r[targetSpell.r].b,
                                  borderColor: card.r[targetSpell.r].b,
                                }}
                              >
                                <img
                                  src={`/spells/SpellCardIcon_${s}.png`}
                                  alt={t(`card.spell.${s}.title`)}
                                  className="max-w-full max-h-full mx-auto"
                                />
                              </div>
                              <div
                                className={cn(
                                  "mt-1",
                                  count > limit &&
                                    "text-red-700 dark:text-red-400"
                                )}
                              >
                                {count}/{limit}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                    <TabsContent value="3">
                      <div className="mt-4 text-right -mb-1">
                        <CheerPicker
                          currentUsingCheers={usingCheers}
                          onChange={setUsingCheers}
                          onReset={() => setUsingCheers({})}
                          disableAll={restrictType === 1}
                          disableMinCost={
                            restrictType === 2 &&
                            soloEndCoinLimit > 0 &&
                            soloEndCoinLimit - frontierLimit.usingCoin
                          }
                        />
                      </div>
                      <div className="text-xs text-left ml-2">
                        {t("ui.teambuilder.usingCheer")}
                      </div>
                      <div className="grid grid-cols-[repeat(auto-fill,_minmax(5rem,_1fr))] auto-rows-auto gap-2 min-h-10 rounded bg-accent/90 p-2">
                        {cheer.o.map((s) => {
                          if (!usingCheers[s]) return null;
                          const targetCheer = cheer.c[s];
                          const count = usingCheers[s];
                          const limit = targetCheer.purchaseLimit;
                          return (
                            <div key={s} className="w-20 p-2 mx-auto">
                              <div
                                className="w-16 h-16 bg-cover rounded-lg border-2 ring-foreground ring-2 overflow-hidden"
                                style={{
                                  backgroundColor: "#b371f7",
                                  borderColor: "#b371f7",
                                }}
                              >
                                <img
                                  src={`/spells/CheerCardIcon_${s}.png`}
                                  alt={t(`card.cheer.${s}.title`)}
                                  className="max-w-full max-h-full mx-auto"
                                />
                              </div>
                              <div
                                className={cn(
                                  "mt-1",
                                  count > limit &&
                                    "text-red-700 dark:text-red-400"
                                )}
                              >
                                {count}/{limit}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              {t("ui.teambuilder.teamAsideSpecAccordion")}
            </AccordionTrigger>
            <AccordionContent className="text-base">
              <div className="flex flex-col gap-1 divide-y">
                {currentTeam
                  .filter((v) => v?.charaName)
                  .map(({ charaName }) => {
                    const thisCharaSpec = teamSpec[charaName];
                    const showAside2Setting = charaName === "Ui";
                    const hasAside = !!chara[charaName].a;
                    const charaPersonality: Personality = Number(
                      chara[charaName].t.charAt(0)
                    );
                    const bg = personalityBG[charaPersonality];
                    return (
                      <div
                        key={charaName}
                        className="flex flex-row gap-1 justify-between items-center"
                      >
                        <div className="flex flex-row gap-0.5 items-center">
                          <div
                            className={cn("w-7 aspect-square rounded-sm", bg)}
                          >
                            <img
                              src={getCharaImageUrl(
                                userCharaInfo?.[charaName].skin
                                  ? `${charaName}Skin${userCharaInfo[charaName].skin}`
                                  : `${charaName}`
                              )}
                              className={cn("w-full aspect-square")}
                            />
                          </div>
                          {t(`chara.${charaName}`)}
                        </div>
                        <div className="flex flex-row gap-1">
                          {hasAside && (
                            <Button
                              size="sm"
                              variant="outline"
                              className={cn(
                                "h-8 px-1 text-sm",
                                thisCharaSpec === 8 && "bg-accent"
                              )}
                              onClick={() => {
                                const newTeamSpec = { ...teamSpec };
                                newTeamSpec[charaName] = 8;
                                setTeamSpec(newTeamSpec);
                              }}
                            >
                              {t("ui.teambuilder.aside3Text")}
                            </Button>
                          )}
                          {showAside2Setting && (
                            <Button
                              size="sm"
                              variant="outline"
                              className={cn(
                                "h-8 px-1 text-sm",
                                thisCharaSpec === 7 && "bg-accent"
                              )}
                              onClick={() => {
                                const newTeamSpec = { ...teamSpec };
                                newTeamSpec[charaName] = 7;
                                setTeamSpec(newTeamSpec);
                              }}
                            >
                              {t("ui.teambuilder.aside2Text")}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className={cn(
                              "h-8 px-1 text-sm",
                              thisCharaSpec < 6 && "bg-accent"
                            )}
                            onClick={() => {
                              const newTeamSpec = { ...teamSpec };
                              newTeamSpec[charaName] = 5;
                              setTeamSpec(newTeamSpec);
                            }}
                          >
                            {t("ui.teambuilder.noAside")}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              {t("ui.teambuilder.cardSpecAccordion")}
            </AccordionTrigger>
            <AccordionContent className="text-base">
              <CardSpecDialog
                cardLevels={cardLevels}
                onChange={setCardLevels}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <div className="flex flex-row gap-2 mt-4">
        <div>{t("ui.teambuilder.personalitySynergy")}</div>
        <div className={cn("flex flex-row-reverse px-2 flex-1")}>
          {restrictType === 2
            ? t("ui.teambuilder.synergyNoApply")
            : [
                synergyTotal.notAppliedPersonalities,
                synergyTotal.synergyApplied
                  .map(({ personality, count }) =>
                    Array(count).fill(personality)
                  )
                  .flat(),
              ].map((personalities, index) => {
                return (
                  <Fragment key={index}>
                    {personalities.map((personality, i) => {
                      return (
                        <img
                          key={`${index}-${personality}-${i}`}
                          src={`/icons/Common_UnitPersonality_${Personality[personality]}.png`}
                          className={cn(
                            "w-6 h-6 -mx-2 z-0",
                            index ? "" : "brightness-50",
                            "[&:nth-last-of-type(even)]:translate-y-2 [&:nth-last-of-type(odd)]:-translate-y-2"
                          )}
                        />
                      );
                    })}
                  </Fragment>
                );
              })}
        </div>
      </div>
      <div>
        {restrictType === 2 ? (
          <div className="w-full text-center break-keep p-2">
            {t("ui.teambuilder.soloEndSynergyDescription")}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-1">
            <div className="flex flex-row max-w-lg w-full my-1.5 gap-1">
              {((percent: number) => {
                if (!percent) return null;
                return (
                  <>
                    <div className="pr-1 text-sm flex-0 min-w-max">
                      {t("ui.teambuilder.total")}
                    </div>
                    <div className="flex-1 text-sm bg-slate-300 dark:bg-slate-700 rounded-full px-1 py-px">
                      {t("ui.teambuilder.synergyEffectHp", {
                        0: percent,
                      })}
                    </div>
                    <div className="flex-1 text-sm bg-slate-300 dark:bg-slate-700 rounded-full px-1 py-px">
                      {t("ui.teambuilder.synergyEffectDamage", {
                        0: percent,
                      })}
                    </div>
                  </>
                );
              })(
                synergyTotal.synergyApplied.reduce((a, c) => c.percent + a, 0)
              )}
            </div>
            <div className="flex flex-row flex-wrap gap-2 justify-evenly">
              {synergyTotal.synergyApplied.map(
                ({ personality, count, percent }) => {
                  return (
                    <div key={personality} className="flex flex-col gap-1">
                      <div className="flex flex-row-reverse px-2 justify-center z-10 overflow-visible max-w-28">
                        {Array(count)
                          .fill(0)
                          .map((_, i) => {
                            return (
                              <img
                                key={i}
                                src={`/icons/Common_UnitPersonality_${Personality[personality]}.png`}
                                className="w-5 h-5 -mx-1"
                              />
                            );
                          })}
                      </div>
                      <div
                        className={cn(
                          "flex flex-col -mt-3 w-28 pt-3 pb-1 rounded text-sm",
                          personalityBGTranslucent[personality]
                        )}
                      >
                        <div>
                          {t("ui.teambuilder.synergyEffectHp", {
                            0: percent,
                          })}
                        </div>
                        <div>
                          {t("ui.teambuilder.synergyEffectDamage", {
                            0: percent,
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row gap-2 mt-4">
        <div>{t("ui.teambuilder.spellTotal")}</div>
        <div className={cn("flex flex-row-reverse px-2 flex-1")}>
          {restrictType === 1 && t("ui.teambuilder.spellNoApply")}
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-2 mt-1.5">
        {restrictType === 1 ? (
          <div className="w-full text-center break-keep">
            {t("ui.teambuilder.soloRaidNoSpell")}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 w-full">
            {[
              StatType.Hp,
              StatType.AttackPhysic,
              StatType.AttackMagic,
              StatType.DefensePhysic,
              StatType.DefenseMagic,
              StatType.CriticalRate,
              StatType.CriticalMult,
              StatType.CriticalResist,
              StatType.CriticalMultResist,
              StatType.AttackSpeed,
            ].map((stat) => {
              const value =
                frontierLimit.spellStat[stat] + frontierLimit.cheerStat[stat];
              if (!value) return null;
              const statString = StatType[stat];
              return (
                <div
                  key={stat}
                  className="flex flex-row gap-1 justify-between items-center text-sm bg-accent/50 pr-2 rounded-full"
                >
                  <img
                    src={`icons/Icon_${statString}.png`}
                    className="w-4 h-4 scale-125"
                  />
                  <div>+{value / 100}%</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex flex-row gap-2 justify-between flex-wrap">
          <div>{t("ui.teambuilder.allApplyTotal")}</div>
          <div className="text-sm flex items-center gap-1">
            <Label htmlFor="separate-all-apply-effect">
              {t("ui.teambuilder.separateAllApplyEffect")}
            </Label>
            <Switch
              id="separate-all-apply-effect"
              checked={separateAllApplyEffect}
              onCheckedChange={setSeparateAllApplyEffect}
            />
          </div>
        </div>
        <div className="flex flex-row gap-2 justify-between flex-wrap">
          <div className="text-sm flex items-center gap-1 flex-1 min-w-max justify-end">
            <Label htmlFor="include-aside3-all-apply-effect">
              {t("ui.teambuilder.includeAside3Effect")}
            </Label>
            <Switch
              id="include-aside3-all-apply-effect"
              checked={Boolean(allIncludeFlag & 1)}
              onCheckedChange={() => setAllIncludeFlag((v) => v ^ 1)}
            />
          </div>
          <div className="text-sm flex items-center gap-1 flex-1 min-w-max justify-end">
            <Label htmlFor="include-spell-all-apply-effect">
              {t("ui.teambuilder.includeSpellAllEffect")}
            </Label>
            <Switch
              id="include-spell-all-apply-effect"
              checked={Boolean(allIncludeFlag & 2) && restrictType !== 1}
              onCheckedChange={() => setAllIncludeFlag((v) => v ^ 2)}
              disabled={restrictType === 1}
            />
          </div>
          <div className="text-sm flex items-center gap-1 flex-1 min-w-max justify-end">
            <Label htmlFor="include-cheer-effect">
              {t("ui.teambuilder.includeCheerEffect")}
            </Label>
            <Switch
              id="include-cheer-effect"
              checked={Boolean(allIncludeFlag & 4) && restrictType !== 1}
              onCheckedChange={() => setAllIncludeFlag((v) => v ^ 4)}
              disabled={restrictType === 1}
            />
          </div>
        </div>
        <Card className="p-2 bg-accent/25 [&_>_div:has(>_div)_~_div:has(>_div)]:border-t [&_>_div:has(>_div)_~_div:has(>_div)]:pt-0.5 [&_>_div:has(>_div)_~_div:has(>_div)]:mt-0.5">
          {allIncludeFlag === 0 && (
            <div className="text-xs opacity-80">
              {t("ui.teambuilder.noEffectListToShow")}
            </div>
          )}
          {ASIDE3_CATEGORY_SORT.map((categories, index) => {
            return (
              <div key={index} className="">
                {categories.map((category) => {
                  const needHideToSeparate =
                    separateAllApplyEffect &&
                    ASIDE3_CATEGORY_ALL_AFFECT_CATEGORY_EXISTS.includes(
                      category
                    );
                  if (needHideToSeparate) return null;
                  const needIncludeCategory = separateAllApplyEffect
                    ? ASIDE3_CATEGORY_ALL_AFFECT[category]
                    : undefined;
                  const categoryValueAside3 =
                    (aside3Total[category] ?? 0) +
                    (needIncludeCategory
                      ? aside3Total[needIncludeCategory] ?? 0
                      : 0);
                  const spellValueLikeAside3 =
                    (frontierLimit.allAffectSpellLikeAside3Category[category] ??
                      0) +
                    (needIncludeCategory
                      ? frontierLimit.allAffectSpellLikeAside3Category[
                          needIncludeCategory
                        ] ?? 0
                      : 0);
                  const cheerValueLikeAside3 =
                    (frontierLimit.cheerLikeAside3Category[category] ?? 0) +
                    (needIncludeCategory
                      ? frontierLimit.cheerLikeAside3Category[
                          needIncludeCategory
                        ] ?? 0
                      : 0);
                  const categoryValue =
                    (allIncludeFlag & 1 ? categoryValueAside3 : 0) +
                    (restrictType !== 1 && allIncludeFlag & 2
                      ? spellValueLikeAside3
                      : 0) +
                    (restrictType !== 1 && allIncludeFlag & 4
                      ? cheerValueLikeAside3
                      : 0);
                  if (categoryValue === 0) return null;
                  return (
                    <div
                      key={`${index}-${category}`}
                      className="flex flex-row gap-1 justify-between items-center"
                    >
                      <div className="flex flex-row gap-1 items-center">
                        <span
                          className={cn(
                            "rounded-full w-2.5 h-2.5",
                            index === 0 && "bg-foreground/90"
                          )}
                          style={
                            index > 0
                              ? {
                                  backgroundColor: [
                                    "white",
                                    FRONT_COLOR,
                                    MID_COLOR,
                                    BACK_COLOR,
                                  ][index],
                                }
                              : undefined
                          }
                        />
                        {t(
                          `aside.aside3effect.${Aside3EffectCategory[category]}`
                        )}
                      </div>
                      <div className="text-blue-500 dark:text-blue-300">
                        {categoryValue > 0 ? "+" : ""}
                        {categoryValue / 100}
                        {!ASIDE3_CATEGORY_FIXED_VALUE.includes(category) && "%"}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </Card>
      </div>
      <div
        className="grid grid-cols-3 mt-8 auto-cols-auto px-0.5 py-1 gap-0.5"
        style={{
          backgroundSize: "cover",
          background: `linear-gradient(to right, transparent, ${BACK_COLOR_OPACITY} 1%, ${BACK_COLOR_OPACITY} 33%, transparent, ${MID_COLOR_OPACITY} 34%, ${MID_COLOR_OPACITY} 66%, transparent, ${FRONT_COLOR_OPACITY} 67%, ${FRONT_COLOR_OPACITY} 99%, transparent)`,
        }}
      >
        <div className="text-lg">{t("position.Back")}</div>
        <div className="text-lg">{t("position.Middle")}</div>
        <div className="text-lg">{t("position.Front")}</div>
        {Array(9)
          .fill(0)
          .map((_, i) => {
            const target = currentTeam[i];
            const pos = [Position.Back, Position.Middle, Position.Front][i % 3];
            const canPos = [
              ...charaColCollection[pos],
              ...charaColCollection[Position.Free],
            ];
            const targetChara = target?.charaName || "";
            return (
              <div key={i} className="px-2 py-4 md:px-4">
                <CharaPicker
                  currentChara={targetChara}
                  positionables={canPos}
                  alreadyUsings={currentTeam
                    .map((v) => v?.charaName)
                    .filter((v) => v)}
                  onChange={(c) => {
                    if (currentTeam[i]?.charaName === c) return;
                    const charaIndex = currentTeam.findIndex(
                      (v) => v?.charaName === c
                    );
                    if (charaIndex >= 0) {
                      const newTeam = [...currentTeam];
                      const hereWas = currentTeam[i];
                      const wasThere = currentTeam[charaIndex];
                      const therePosition = 2 - (charaIndex % 3);
                      const hereWasPosition =
                        hereWas && hereWas.charaName
                          ? Number(chara[hereWas.charaName]?.t.charAt(3))
                          : -1;
                      newTeam[i] = wasThere;
                      if (
                        [Position.Free, therePosition].includes(hereWasPosition)
                      ) {
                        newTeam[charaIndex] = hereWas;
                      } else {
                        newTeam[charaIndex] = {
                          charaName: "",
                          artifacts: [],
                        };
                      }
                      setCurrentTeam(newTeam);
                      return;
                    }
                    const newTeam = [...currentTeam];
                    const newTeamSpec = { ...teamSpec };
                    newTeam[i] = {
                      artifacts: [],
                      charaName: c,
                    };
                    newTeamSpec[c] = 5;
                    setCurrentTeam(newTeam);
                    setTeamSpec(newTeamSpec);
                  }}
                  onReset={() => {
                    const newTeam = [...currentTeam];
                    newTeam[i] = { charaName: "", artifacts: [] };
                    setCurrentTeam(newTeam);
                  }}
                  position={pos}
                />
                <div className="flex flex-row justify-around gap-x-0.5 gap-y-1 mt-2 flex-wrap">
                  {Array(3)
                    .fill(0)
                    .map((_, j) => {
                      const artifact = target?.artifacts[j] || 0;
                      return (
                        <ArtifactPicker
                          key={j}
                          currentArtifact={artifact}
                          artifactLevels={cardLevels.a}
                          targetChara={targetChara}
                          onChange={(a) =>
                            setCurrentTeam((prev) => {
                              const newTeam = [...prev];
                              newTeam[i] = {
                                charaName: newTeam[i].charaName,
                                artifacts: [...(newTeam[i].artifacts || [])],
                              };
                              newTeam[i].artifacts[j] = a;
                              return newTeam;
                            })
                          }
                          onReset={() =>
                            setCurrentTeam((prev) => {
                              const newTeam = [...prev];
                              newTeam[i] = {
                                charaName: newTeam[i].charaName,
                                artifacts: [...(newTeam[i].artifacts || [])],
                              };
                              newTeam[i].artifacts[j] = 0;
                              return newTeam;
                            })
                          }
                          disableAll={
                            restrictType === 1 &&
                            artifactCount >=
                              [13, 5, 8][soloRaidStep % 3] +
                                soloRaidResearchSlot
                          }
                          disableList={
                            restrictType === 2
                              ? frontierLimit.disabledArtifact
                              : undefined
                          }
                          disableMinCost={
                            restrictType === 2 &&
                            soloEndCoinLimit > 0 &&
                            soloEndCoinLimit - frontierLimit.usingCoin
                          }
                        />
                      );
                    })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TeamBuilder;
