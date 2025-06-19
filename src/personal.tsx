import { useCallback, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubtitleBar from "@/components/parts/subtitlebar";
import CharaList from "@/components/personal/chara-list";
import BoardViewer from "@/components/personal/board-viewer";
import EquipViewer from "@/components/personal/equip-viewer";
import FoodTasteViewer from "@/components/personal/food-taste-viewer";
import board from "@/data/board";
import chara from "@/data/chara";
import clonefactory from "@/data/clonefactory";
import purpleboard from "@/data/purpleboard";
import purpleposition from "@/data/purpleposition";
import route from "@/data/route";
import skillcoefficient from "@/data/skillcoefficient";
import aside3stat from "@/data/aside3stat";
import { useUserDataCharaInfo } from "@/stores/useUserDataStore";
import {
  Attack,
  // BoardType,
  Class,
  Personality,
  Position,
  // PurpleBoardType,
  Race,
  StatType,
} from "@/types/enums";

// af
import { useIsAFActive } from "@/stores/useAFDataStore";
import { getCharaImageUrl } from "@/utils/getImageUrl";

const NAMEKEY = "chara";
// const TABKEY = "tab";

type CharaMetaType = [Personality, number, Attack, Position, Class, Race];

const Personal = () => {
  const { t } = useTranslation();
  const isAF = useIsAFActive();
  const userCharaInfo = useUserDataCharaInfo();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<string>("Board");
  const [lowLv, setLowLv] = useState<number>(1);
  const [highLv, setHighLv] = useState<number>(1);
  const [isPvP, setIsPvP] = useState<boolean>(false);
  const charaName = searchParams.get(NAMEKEY);
  const setTargetChara = useCallback(
    (name: string) => {
      setSearchParams((prev) => {
        prev.set(NAMEKEY, name);
        window.scrollTo({ top: 0, left: 0 });
        return prev;
      });
    },
    [setSearchParams]
  );
  if (!charaName) {
    return <CharaList setTargetChara={setTargetChara} />;
  }
  if (!Object.keys(chara).includes(charaName)) {
    return (
      <div className="font-onemobile">
        {t("ui.personal.noData")}{" "}
        <Link to=".">{t("ui.personal.gotoList")}</Link>
      </div>
    );
  }
  const [personality, initialStar, attackType, position, unitClass, race] =
    chara[charaName].t.split("").map((v) => Number(v)) as CharaMetaType;
  return (
    <div className="font-onemobile pt-6">
      <div className="text-xs text-left">
        <Link
          to="."
          onClick={() => {
            setSearchParams((prev) => {
              prev.delete(NAMEKEY);
              return prev;
            });
          }}
        >
          {t("ui.personal.gotoList")}
        </Link>
      </div>
      <div className="h-1" />
      <div className="flex flex-row gap-2">
        <div>
          <img
            src={getCharaImageUrl(
              userCharaInfo?.[charaName].skin
                ? `${charaName}Skin${userCharaInfo[charaName].skin}`
                : `${charaName}`,
              isAF && "af"
            )}
            className={cn("w-14 h-14", isAF && "scale-125 pointer-events-none")}
          />
        </div>
        <div className="flex flex-col justify-evenly text-left gap-1">
          <div className="text-sm opacity-75">
            {t(`charaIntro.${charaName}`)}
          </div>
          <div className="text-2xl">{t(`chara.${charaName}`)}</div>
        </div>
      </div>
      <Card className="grid grid-cols-3 md:grid-cols-6">
        <div className="p-2">
          <div>
            <img
              src={`/icons/Common_UnitPersonality_${Personality[personality]}.png`}
              alt=""
              className="w-8 h-8 inline"
            />
          </div>
          <div className="-mt-2 text-shadow-glow-1.5 text-shadow-glow-background">
            {t(`personality.${Personality[personality]}`)}
          </div>
        </div>
        <div className="p-2">
          <div>
            <img
              src={`/icons/Common_Unit${Class[unitClass]}.png`}
              alt=""
              className="w-8 h-8 inline"
            />
          </div>
          <div className="-mt-2 text-shadow-glow-1.5 text-shadow-glow-background">
            {t(`class.${Class[unitClass]}`)}
          </div>
        </div>
        <div className="p-2">
          <div>
            <img
              src={`/icons/Common_UnitAttack${Attack[attackType]}.png`}
              alt=""
              className="w-8 h-8 inline"
            />
          </div>
          <div className="-mt-2 text-shadow-glow-1.5 text-shadow-glow-background">
            {t(`attack.${Attack[attackType]}`)}
          </div>
        </div>
        <div className="p-2">
          <div>
            <img
              src={`/icons/Common_Position${Position[position]}.png`}
              alt=""
              className="w-8 h-8 inline"
            />
          </div>
          <div className="-mt-2 text-shadow-glow-1.5 text-shadow-glow-background">
            {t(`position.${Position[position]}`)}
          </div>
        </div>
        <div className="p-2">
          <div>
            <img
              src={`/album/Album_Icon_${Race[race]}.png`}
              alt=""
              className="w-8 h-8 inline"
            />
          </div>
          <div className="-mt-2 text-shadow-glow-1.5 text-shadow-glow-background">
            {t(`race.${Race[race]}`)}
          </div>
        </div>
        <div className="p-2">
          <div className="flex flex-row justify-center">
            {Array(initialStar)
              .fill(0)
              .map((_, i) => {
                return (
                  <img
                    key={i}
                    src={`/icons/HeroGrade_000${[0, 5, 3, 4][initialStar]}.png`}
                    alt=""
                    className="w-8 h-8 -mx-1"
                  />
                );
              })}
          </div>
          <div className="-mt-2 text-shadow-glow-1.5 text-shadow-glow-background">
            {chara[charaName].e
              ? t(`eldain.${chara[charaName].e}`)
              : t("ui.personal.starCount", { 0: initialStar })}
          </div>
        </div>
      </Card>
      {initialStar > 1 && (
        <Card className="p-2 mt-2 flex items-start gap-4">
          <img
            src="/clonefactoryicon/GradeDungeon_Logo.png"
            className="w-16 flex-initial"
          />
          <div className="flex items-center gap-4 flex-wrap flex-1">
            {Object.entries(clonefactory.l).map(([date, lineup]) => {
              const charaList = lineup.flat();
              if (charaList.includes(charaName)) {
                const [year, month, day] = date.split("-");
                return (
                  <div
                    key={date}
                    className={cn(
                      "rounded-md px-2 py-1",
                      date === clonefactory.f
                        ? "bg-yellow-500 text-shadow-glow relative"
                        : "bg-slate-400 dark:bg-slate-600 opacity-50"
                    )}
                  >
                    {date === clonefactory.f && (
                      <div className="absolute top-1/8 left-1/8 w-3/4 h-3/4 rounded-md bg-yellow-500/85 animate-ping" />
                    )}
                    <div className="text-xs relative z-10">{year}</div>
                    <div className="text-sm relative z-10">{`${month}/${day}`}</div>
                  </div>
                );
              }
              return null;
            })}
            {!Object.values(clonefactory.l)
              .flat()
              .flat()
              .includes(charaName) && (
              <div className="flex items-center flex-1 h-full mt-2">
                {t("ui.personal.noCloneFactoryHistory")}
              </div>
            )}
          </div>
        </Card>
      )}
      <Tabs className="mt-4" value={tab} onValueChange={setTab}>
        <TabsList className="flex">
          <TabsTrigger className="flex-1" value="Board">
            {t("ui.personal.tab.board")}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="Equip">
            {t("ui.personal.tab.equip")}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="Food">
            {t("ui.personal.tab.food")}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="Skill">
            {t("ui.personal.tab.skill")}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="Aside">
            {t("ui.personal.tab.aside")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Board">
          <BoardViewer
            charaName={charaName}
            boardActualPosition={route.r[Race[race]]}
            boardShape={route.s[Race[race]]}
            boardShapeIndex={board.c[charaName].s}
            boardCollection={board.c[charaName].b}
            routeCollection={board.c[charaName].r}
            pboardCollection={purpleboard.c[charaName].b}
            pbPositionIndexCollection={purpleboard.c[charaName].p}
            pbActualPositionCollection={purpleposition.r[Race[race]]}
            leftShift1={race === Race.Ghost && initialStar === 1}
          />
        </TabsContent>
        <TabsContent value="Equip">
          <EquipViewer charaName={charaName} />
        </TabsContent>
        <TabsContent value="Food">
          {initialStar > 1 ? (
            <FoodTasteViewer
              charaName={charaName}
              skin={userCharaInfo?.[charaName].skin}
            />
          ) : (
            <div>{t("ui.personal.cannotInviteToRestaurant")}</div>
          )}
        </TabsContent>
        <TabsContent
          value="Skill"
          className="grid grid-rows-1 md:grid-cols-3 gap-4 pt-2"
        >
          <Card className="text-left p-4">
            <div className="flex flex-row items-center gap-2">
              <div className="aspect-square w-12 h-12 relative">
                <img
                  src={`/skills/Icon_AdmissionSKill_${charaName}.png`}
                  className="w-12 h-12 rounded border-2 border-green-500 border-inset"
                />
                <img
                  src="/skills/HeroSkill_Icon_SkillSp.png"
                  className="absolute -top-1 -left-1 w-5"
                />
              </div>
              <div>
                <div className="text-sm mt-2 opacity-80">
                  {t("ui.common.admissionSkill")}
                </div>
                <div className="text-xl">
                  {t(`skill.${charaName}.low.title`)}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-baseline gap-4 my-2">
              <div className="w-8">
                Lv.{Math.min(lowLv, 10 + (chara[charaName].a ?? 0))}
              </div>
              <Slider
                className="w-full my-1"
                value={[Math.min(lowLv, 10 + (chara[charaName].a ?? 0))]}
                onValueChange={(v) => setLowLv(v[0])}
                min={1}
                max={10 + (chara[charaName].a ?? 0)}
              />
            </div>
            <div className="text-base break-keep">
              {t(`skill.${charaName}.low.description`)
                .split("\n")
                .map((t, i) => {
                  return (
                    <div key={i}>
                      {t.split("*").map((s, j) => {
                        return (
                          <span
                            key={j}
                            className={
                              j % 2 ? "text-red-600 dark:text-red-400" : ""
                            }
                          >
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              {skillcoefficient.c[charaName].k.l.map((keywordId) => {
                return (
                  <div
                    key={keywordId}
                    className="text-red-600 dark:text-red-400"
                  >
                    {t(`skill.commonKeyword.${keywordId}.name`)}:{" "}
                    {t(`skill.commonKeyword.${keywordId}.description`)}
                  </div>
                );
              })}
            </div>
            <div className="text-sm break-keep text-slate-600 dark:text-slate-400">
              {t(
                `skill.${charaName}.low.coefficient`,
                Object.fromEntries(
                  skillcoefficient.c[charaName].s.l.map((v, i) => {
                    if (typeof v === "number") return [i, v];
                    if (Array.isArray(v)) return [i, v[lowLv - 1]];
                    const [skillType, coefficientIndexString] = v.split(".");
                    const coefficientIndex = Number(coefficientIndexString);
                    if (Number.isNaN(coefficientIndex)) return [i, -1];
                    if (!["l", "h", "p", "n", "a"].includes(skillType))
                      return [i, -1];
                    const targetCoefficient =
                      skillcoefficient.c[charaName].s[
                        skillType as "l" | "h" | "p" | "n" | "a"
                      ]?.[coefficientIndex];
                    if (typeof targetCoefficient === "number")
                      return [i, targetCoefficient];
                    if (Array.isArray(targetCoefficient))
                      return [
                        i,
                        targetCoefficient[
                          (skillType === "l" ? lowLv : highLv) - 1
                        ],
                      ];
                    return [i, -1];
                  })
                )
              )
                .split("\n")
                .map((t, i) => {
                  return (
                    <div key={i}>
                      {t.split("*").map((s, j) => {
                        return (
                          <span
                            key={j}
                            className={j % 2 ? "text-emerald-500" : ""}
                          >
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          </Card>
          <Card className="text-left p-4">
            <div className="flex flex-row items-center gap-2">
              <div className="aspect-square w-12 h-12 relative">
                <img
                  src={`/skills/Icon_GraduateSKill_${charaName}.png`}
                  className="w-12 h-12 rounded border-2 border-green-600 border-inset"
                />
                <img
                  src="/skills/HeroSkill_Icon_SkillUltimate.png"
                  className="absolute -top-1 -left-1 w-5"
                />
              </div>
              <div>
                <div className="text-sm opacity-80">
                  {t("ui.common.graduateSkill")}
                </div>
                <div className="text-xl">
                  {isPvP && "[PVP]"}
                  {t(`skill.${charaName}.high.title`)}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-baseline gap-4 my-2">
              <div className="w-8">
                Lv.{Math.min(highLv, 10 + (chara[charaName].a ?? 0))}
              </div>
              <Slider
                className="w-full my-1"
                value={[Math.min(highLv, 10 + (chara[charaName].a ?? 0))]}
                onValueChange={(v) => setHighLv(v[0])}
                min={1}
                max={10 + (chara[charaName].a ?? 0)}
              />
            </div>
            <div className="flex flex-row items-center gap-1 my-1">
              <img
                src="/common/ClockIcon_002.png"
                className="w-6 h-6 -rotate-10"
              />
              <div className="flex-1">
                {t("ui.common.cooltime")}{" "}
                <span
                  className={
                    isPvP
                      ? "text-purple-800 dark:text-purple-200"
                      : "text-green-800 dark:text-lime-200"
                  }
                >
                  {skillcoefficient.c[charaName].c[isPvP ? "p" : "h"]}초
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "px-2 py-1 text-xs h-min",
                  isPvP
                    ? "bg-lime-300 dark:bg-green-700 hover:bg-lime-400 dark:hover:bg-green-600"
                    : "bg-purple-300 dark:bg-purple-700 hover:bg-purple-400 dark:hover:bg-purple-600"
                )}
                onClick={() => setIsPvP((v) => !v)}
              >
                <RefreshCw className="w-3 h-3 inline mr-1" strokeWidth={2.5} />
                {isPvP ? "PvE" : "PvP"}
              </Button>
            </div>
            <div className="text-base break-keep">
              {t(`skill.${charaName}.high.description`)
                .split("\n")
                .map((t, i) => {
                  return (
                    <div key={i}>
                      {t.split("*").map((s, j) => {
                        return (
                          <span
                            key={j}
                            className={
                              j % 2 ? "text-red-600 dark:text-red-400" : ""
                            }
                          >
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              {skillcoefficient.c[charaName].k.h.map((keywordId) => {
                return (
                  <div
                    key={keywordId}
                    className="text-red-600 dark:text-red-400"
                  >
                    {t(`skill.commonKeyword.${keywordId}.name`)}:{" "}
                    {t(`skill.commonKeyword.${keywordId}.description`)}
                  </div>
                );
              })}
            </div>
            <div className="text-sm break-keep text-slate-600 dark:text-slate-400">
              {t(
                `skill.${charaName}.high.coefficient`,
                Object.fromEntries(
                  skillcoefficient.c[charaName].s[isPvP ? "p" : "h"].map(
                    (v, i) => {
                      if (typeof v === "number") return [i, v];
                      if (Array.isArray(v)) return [i, v[highLv - 1]];
                      const [skillType, coefficientIndexString] = v.split(".");
                      const coefficientIndex = Number(coefficientIndexString);
                      if (Number.isNaN(coefficientIndex)) return [i, -1];
                      if (!["l", "h", "p", "n", "a"].includes(skillType))
                        return [i, -1];
                      const targetCoefficient =
                        skillcoefficient.c[charaName].s[
                          skillType as "l" | "h" | "p" | "n" | "a"
                        ]?.[coefficientIndex];
                      if (typeof targetCoefficient === "number")
                        return [i, targetCoefficient];
                      if (Array.isArray(targetCoefficient))
                        return [
                          i,
                          targetCoefficient[
                            (skillType === "l" ? lowLv : highLv) - 1
                          ],
                        ];
                      return [i, -1];
                    }
                  )
                )
              )
                .split("\n")
                .map((t, i) => {
                  return (
                    <div key={i}>
                      {t.split("*").map((s, j) => {
                        return (
                          <span
                            key={j}
                            className={
                              j % 2
                                ? isPvP
                                  ? "text-purple-500"
                                  : "text-emerald-500"
                                : ""
                            }
                          >
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          </Card>
          <Card className="text-left p-4">
            <div className="flex flex-row items-center gap-2">
              <img
                src={`/skills/${
                  chara[charaName].t.charAt(2) === "0" ? "Magic" : "Physic"
                }_NormalAttack.png`}
                className="w-12 h-12 rounded border-2 border-lime-200 border-inset"
              />
              <div>
                <div className="text-xl">{t("ui.common.normalAttack")}</div>
              </div>
            </div>
            {skillcoefficient.c[charaName].s.a && (
              <div className="text-sm my-1">
                <span className="px-8 py-1 bg-emerald-700 text-slate-50 dark:bg-lime-300 dark:text-slate-950 rounded-full">
                  {t("ui.common.normalAttackBase")}
                </span>
              </div>
            )}
            <div className="text-base break-keep">
              {t(`skill.${charaName}.normal.description`)
                .split("\n")
                .map((t, i) => {
                  return (
                    <div key={i}>
                      {t.split("*").map((s, j) => {
                        return (
                          <span
                            key={j}
                            className={
                              j % 2 ? "text-red-600 dark:text-red-400" : ""
                            }
                          >
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              {skillcoefficient.c[charaName].k.n.map((keywordId) => {
                return (
                  <div
                    key={keywordId}
                    className="text-red-600 dark:text-red-400"
                  >
                    {t(`skill.commonKeyword.${keywordId}.name`)}:{" "}
                    {t(`skill.commonKeyword.${keywordId}.description`)}
                  </div>
                );
              })}
            </div>
            <div className="text-sm break-keep text-slate-600 dark:text-slate-400">
              {t(
                `skill.${charaName}.normal.coefficient`,
                Object.fromEntries(
                  skillcoefficient.c[charaName].s.n.map((v, i) => {
                    if (typeof v === "number") return [i, v];
                    if (Array.isArray(v)) return [i, v[highLv - 1]];
                    const [skillType, coefficientIndexString] = v.split(".");
                    const coefficientIndex = Number(coefficientIndexString);
                    if (Number.isNaN(coefficientIndex)) return [i, -1];
                    if (!["l", "h", "p", "n", "a"].includes(skillType))
                      return [i, -1];
                    const targetCoefficient =
                      skillcoefficient.c[charaName].s[
                        skillType as "l" | "h" | "p" | "n" | "a"
                      ]?.[coefficientIndex];
                    if (typeof targetCoefficient === "number")
                      return [i, targetCoefficient];
                    if (Array.isArray(targetCoefficient))
                      return [
                        i,
                        targetCoefficient[
                          (skillType === "l" ? lowLv : highLv) - 1
                        ],
                      ];
                    return [i, -1];
                  })
                )
              )
                .split("\n")
                .map((t, i) => {
                  return (
                    <div key={i}>
                      {t.split("*").map((s, j) => {
                        return (
                          <span
                            key={j}
                            className={j % 2 ? "text-emerald-500" : ""}
                          >
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
            {skillcoefficient.c[charaName].s.a && (
              <>
                <div className="text-sm mt-2 mb-1">
                  <span className="px-8 py-1 bg-emerald-700 text-slate-50 dark:bg-lime-300 dark:text-slate-950 rounded-full">
                    {t("ui.common.normalAttackAdvanced")}
                  </span>
                </div>
                <div className="text-base break-keep">
                  {t(`skill.${charaName}.advanced.description`)
                    .split("\n")
                    .map((t, i) => {
                      return (
                        <div key={i}>
                          {t.split("*").map((s, j) => {
                            return (
                              <span
                                key={j}
                                className={
                                  j % 2 ? "text-red-600 dark:text-red-400" : ""
                                }
                              >
                                {s}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                  {skillcoefficient.c[charaName].k.a!.map((keywordId) => {
                    return (
                      <div
                        key={keywordId}
                        className="text-red-600 dark:text-red-400"
                      >
                        {t(`skill.commonKeyword.${keywordId}.name`)}:{" "}
                        {t(`skill.commonKeyword.${keywordId}.description`)}
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm break-keep text-slate-600 dark:text-slate-400">
                  {t(
                    `skill.${charaName}.advanced.coefficient`,
                    Object.fromEntries(
                      skillcoefficient.c[charaName].s.a.map((v, i) => {
                        if (typeof v === "number") return [i, v];
                        if (Array.isArray(v)) return [i, v[highLv - 1]];
                        const [skillType, coefficientIndexString] =
                          v.split(".");
                        const coefficientIndex = Number(coefficientIndexString);
                        if (Number.isNaN(coefficientIndex)) return [i, -1];
                        if (!["l", "h", "p", "n", "a"].includes(skillType))
                          return [i, -1];
                        const targetCoefficient =
                          skillcoefficient.c[charaName].s[
                            skillType as "l" | "h" | "p" | "n" | "a"
                          ]?.[coefficientIndex];
                        if (typeof targetCoefficient === "number")
                          return [i, targetCoefficient];
                        if (Array.isArray(targetCoefficient))
                          return [
                            i,
                            targetCoefficient[
                              (skillType === "l" ? lowLv : highLv) - 1
                            ],
                          ];
                        return [i, -1];
                      })
                    )
                  )
                    .split("\n")
                    .map((t, i) => {
                      return (
                        <div key={i}>
                          {t.split("*").map((s, j) => {
                            return (
                              <span
                                key={j}
                                className={j % 2 ? "text-emerald-500" : ""}
                              >
                                {s}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="Aside">
          {chara[charaName].a ? (
            <div className="grid grid-cols-1 gap-4 relative">
              <img
                src={`/asideicons/AsideIcon_${charaName}.png`}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 absolute top-0 right-0 animate-bounce"
              />
              <div className="text-2xl">{t(`aside.${charaName}.name`)}</div>
              <Card className="text-left p-4">
                <div className="flex flex-row items-center gap-2">
                  <div className="aspect-square w-12 h-12 relative">
                    <img
                      src={`/asideskills/Aside_Skill_${charaName}_1.png`}
                      className="w-12 h-12 rounded"
                    />
                  </div>
                  <div>
                    <div className="text-sm">
                      <div className="flex flex-row justify-start items-center">
                        {Array(1)
                          .fill(0)
                          .map((_, i) => {
                            return (
                              <img
                                key={i}
                                src={`/icons/HeroGrade_000${
                                  [0, 3, 3, 4][initialStar]
                                }.png`}
                                alt=""
                                className="w-5 h-5 inline -ml-1 first-of-type:ml-0"
                              />
                            );
                          })}
                        {Array(2)
                          .fill(0)
                          .map((_, i) => {
                            return (
                              <img
                                key={i}
                                src={`/icons/HeroGrade_0005.png`}
                                alt=""
                                className="w-5 h-5 inline -ml-1 first-of-type:ml-0"
                              />
                            );
                          })}
                      </div>
                    </div>
                    <div className="text-xl">
                      {t(`aside.${charaName}.skill1.title`)}
                    </div>
                  </div>
                </div>
                <div className="text-base break-keep">
                  {t(`aside.${charaName}.skill1.description`)
                    .split("\n")
                    .map((t, i) => {
                      return (
                        <div key={i}>
                          {t.split("*").map((s, j) => {
                            return (
                              <span
                                key={j}
                                className={
                                  j % 2 ? "text-red-600 dark:text-red-400" : ""
                                }
                              >
                                {s}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                  {skillcoefficient.c[charaName].k[1].map((keywordId) => {
                    return (
                      <div
                        key={keywordId}
                        className="text-red-600 dark:text-red-400"
                      >
                        {t(`skill.commonKeyword.${keywordId}.name`)}:{" "}
                        {t(`skill.commonKeyword.${keywordId}.description`)}
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm break-keep text-slate-600 dark:text-slate-400">
                  {t(
                    `aside.${charaName}.skill1.coefficient`,
                    Object.fromEntries(
                      skillcoefficient.c[charaName].a![1].map((v, i) => [i, v])
                    )
                  )
                    .split("\n")
                    .map((t, i) => {
                      return (
                        <div key={i}>
                          {t.split("*").map((s, j) => {
                            return (
                              <span
                                key={j}
                                className={j % 2 ? "text-emerald-500" : ""}
                              >
                                {s}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                </div>
              </Card>
              <Card className="text-left p-4">
                <div className="flex flex-row items-center gap-2">
                  <div className="aspect-square w-12 h-12 relative">
                    <img
                      src={`/asideskills/Aside_Skill_${charaName}_2.png`}
                      className="w-12 h-12 rounded"
                    />
                  </div>
                  <div>
                    <div className="text-sm">
                      <div className="flex flex-row justify-start items-center">
                        {Array(2)
                          .fill(0)
                          .map((_, i) => {
                            return (
                              <img
                                key={i}
                                src={`/icons/HeroGrade_000${
                                  [0, 3, 3, 4][initialStar]
                                }.png`}
                                alt=""
                                className="w-5 h-5 inline -ml-1 first-of-type:ml-0"
                              />
                            );
                          })}
                        {Array(1)
                          .fill(0)
                          .map((_, i) => {
                            return (
                              <img
                                key={i}
                                src={`/icons/HeroGrade_0005.png`}
                                alt=""
                                className="w-5 h-5 inline -ml-1 first-of-type:ml-0"
                              />
                            );
                          })}
                      </div>
                    </div>
                    <div className="text-xl">
                      {t(`aside.${charaName}.skill2.title`)}
                    </div>
                  </div>
                </div>
                <div className="text-base break-keep">
                  {t(`aside.${charaName}.skill2.description`)
                    .split("\n")
                    .map((t, i) => {
                      return (
                        <div key={i}>
                          {t.split("*").map((s, j) => {
                            return (
                              <span
                                key={j}
                                className={
                                  j % 2 ? "text-red-600 dark:text-red-400" : ""
                                }
                              >
                                {s}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                  {skillcoefficient.c[charaName].k[2].map((keywordId) => {
                    return (
                      <div
                        key={keywordId}
                        className="text-red-600 dark:text-red-400"
                      >
                        {t(`skill.commonKeyword.${keywordId}.name`)}:{" "}
                        {t(`skill.commonKeyword.${keywordId}.description`)}
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm break-keep text-slate-600 dark:text-slate-400">
                  {t(
                    `aside.${charaName}.skill2.coefficient`,
                    Object.fromEntries(
                      skillcoefficient.c[charaName].a![2].map((v, i) => {
                        if (typeof v === "number") return [i, v];
                        if (Array.isArray(v)) return [i, v[lowLv - 1]];
                        const [skillType, coefficientIndexString] =
                          v.split(".");
                        const coefficientIndex = Number(coefficientIndexString);
                        if (Number.isNaN(coefficientIndex)) return [i, -1];
                        if (!["l", "h", "p", "n", "a"].includes(skillType))
                          return [i, -1];
                        const targetCoefficient =
                          skillcoefficient.c[charaName].s[
                            skillType as "l" | "h" | "p" | "n" | "a"
                          ]?.[coefficientIndex];
                        if (typeof targetCoefficient === "number")
                          return [i, targetCoefficient];
                        if (Array.isArray(targetCoefficient))
                          return [
                            i,
                            targetCoefficient[
                              (skillType === "l" ? lowLv : highLv) - 1
                            ],
                          ];
                        return [i, -1];
                      })
                    )
                  )
                    .split("\n")
                    .map((t, i) => {
                      return (
                        <div key={i}>
                          {t.split("*").map((s, j) => {
                            return (
                              <span
                                key={j}
                                className={j % 2 ? "text-emerald-500" : ""}
                              >
                                {s}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                </div>
              </Card>
              <Card className="text-left p-4">
                <div className="flex flex-row items-center gap-2">
                  <div className="aspect-square w-12 h-12 relative">
                    <img
                      src={`/asideskills/Aside_Skill_${charaName}_3.png`}
                      className="w-12 h-12 rounded"
                    />
                  </div>
                  <div>
                    <div className="text-sm">
                      <div className="flex flex-row justify-start items-center">
                        {Array(3)
                          .fill(0)
                          .map((_, i) => {
                            return (
                              <img
                                key={i}
                                src={`/icons/HeroGrade_000${
                                  [0, 3, 3, 4][initialStar]
                                }.png`}
                                alt=""
                                className="w-5 h-5 inline -ml-1 first-of-type:ml-0"
                              />
                            );
                          })}
                        {Array(0)
                          .fill(0)
                          .map((_, i) => {
                            return (
                              <img
                                key={i}
                                src={`/icons/HeroGrade_0005.png`}
                                alt=""
                                className="w-5 h-5 inline -ml-1 first-of-type:ml-0"
                              />
                            );
                          })}
                      </div>
                    </div>
                    <div className="text-xl">
                      {t(`aside.${charaName}.skill3.title`)}
                    </div>
                  </div>
                </div>
                <div className="text-base break-keep">
                  {t(`aside.${charaName}.skill3.description`)
                    .split("\n")
                    .map((t, i) => {
                      return (
                        <div key={i}>
                          {t.split("*").map((s, j) => {
                            return (
                              <span
                                key={j}
                                className={
                                  j % 2 ? "text-red-600 dark:text-red-400" : ""
                                }
                              >
                                {s}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                  {skillcoefficient.c[charaName].k[3].map((keywordId) => {
                    return (
                      <div
                        key={keywordId}
                        className="text-red-600 dark:text-red-400"
                      >
                        {t(`skill.commonKeyword.${keywordId}.name`)}:{" "}
                        {t(`skill.commonKeyword.${keywordId}.description`)}
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm break-keep text-slate-600 dark:text-slate-400">
                  {t(
                    `aside.${charaName}.skill3.coefficient`,
                    Object.fromEntries(
                      skillcoefficient.c[charaName].a![3].map((v, i) => [i, v])
                    )
                  )
                    .split("\n")
                    .map((t, i) => {
                      return (
                        <div key={i}>
                          {t.split("*").map((s, j) => {
                            return (
                              <span
                                key={j}
                                className={j % 2 ? "text-emerald-500" : ""}
                              >
                                {s}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                </div>
                <SubtitleBar>{t("ui.personal.allApplyStat")}</SubtitleBar>
                <div className="text-base break-keep flex flex-col px-2 pt-1 gap-y-1.5">
                  {aside3stat.c[charaName].s.map(
                    ([target, value], i) => {
                      const isPercent = target > 9999;
                      const stat = isPercent ? target - 10000 : target;
                      const statStr = StatType[stat];
                      return (
                        <div
                          key={i}
                          className="flex flex-row justify-between gap-1 sm:flex-1"
                        >
                          <div className="text-left">
                            <img
                              src={`/icons/Icon_${statStr}.png`}
                              className="inline w-6 h-6 -my-1 mr-1"
                            />
                            {t("ui.common.entire")} {t(`stat.${statStr}`)}
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-500">
                              {isPercent ? value / 100 : value}
                            </span>
                            {isPercent && "%"}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <div>{t("ui.personal.noAside")}</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Personal;
