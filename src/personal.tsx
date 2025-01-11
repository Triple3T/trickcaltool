import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemSlot from "@/components/parts/item-slot";
import { personalityBG } from "@/utils/personalityBG";
import rankClassNames from "@/utils/rankClassNames";
import board from "@/data/board";
import chara from "@/data/chara";
import clonefactory from "@/data/clonefactory";
import equip from "@/data/equip";
import food from "@/data/food";
import purpleboard from "@/data/purpleboard";
import purpleposition from "@/data/purpleposition";
import route from "@/data/route";
import skillcoefficient from "@/data/skillcoefficient";
import {
  Attack,
  BoardType,
  Class,
  Personality,
  Position,
  PurpleBoardType,
  Race,
} from "@/types/enums";
import { RefreshCw } from "lucide-react";

const NAMEKEY = "chara";
// const TABKEY = "tab";

type CharaMetaType = [Personality, number, Attack, Position, Class, Race];

const Personal = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<string>("Board");
  const [lowLv, setLowLv] = useState<number>(1);
  const [highLv, setHighLv] = useState<number>(1);
  const [isPvP, setIsPvP] = useState<boolean>(false);
  const charaName = searchParams.get(NAMEKEY);
  if (!charaName) {
    return (
      <div className="font-onemobile">
        <div className="text-lg">사도 목록</div>
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(6rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(7rem,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(8rem,_1fr))] gap-1">
          {Object.entries(chara)
            .sort(([a], [b]) => {
              return t(`chara.${a}`).localeCompare(t(`chara.${b}`));
            })
            .map(([name, meta]) => {
              const [
                personality, // initialStar,
                ,
                attackType,
                position,
                unitClass,
                // race,
              ] = meta.t.split("").map((v) => Number(v)) as CharaMetaType;
              return (
                <div
                  key={name}
                  className="flex justify-between sm:min-w-16 md:min-w-20 max-w-32 rounded overflow-hidden border-slate-200 dark:border-slate-800 border-2 bg-slate-200 dark:bg-slate-800"
                  onClick={() =>
                    setSearchParams((prev) => {
                      prev.set(NAMEKEY, name);
                      return prev;
                    })
                  }
                >
                  <div className="flex flex-col items-center p-0 sm:min-w-16 sm:min-h-16 md:min-w-20 md:min-h-20 max-w-32 relative">
                    <img
                      src={`/charas/${name}.png`}
                      className={cn(
                        "w-full aspect-square",
                        personalityBG[Number(chara[name].t[0]) as Personality]
                      )}
                    />
                    <div className="w-full -mt-7 md:-mt-8 break-keep flex-1 flex flex-col items-stretch justify-center gap-0.5">
                      <div className="h-5 md:h-6">
                        <div className="flex justify-center gap-0.5 p-0.5 w-max mx-auto rounded-full bg-slate-200/50 dark:bg-slate-800/50">
                          <img
                            src={`/icons/Common_UnitPersonality_${Personality[personality]}.png`}
                            className="w-4 h-4 md:w-5 md:h-5"
                          />
                          <img
                            src={`/icons/Common_Unit${Class[unitClass]}.png`}
                            className="w-4 h-4 md:w-5 md:h-5"
                          />
                          <img
                            src={`/icons/Common_UnitAttack${Attack[attackType]}.png`}
                            className="w-4 h-4 md:w-5 md:h-5"
                          />
                          <img
                            src={`/icons/Common_Position${Position[position]}.png`}
                            className="w-4 h-4 md:w-5 md:h-5"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-800 py-0.5 text-sm sm:text-base">
                        {t(`chara.${name}`)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
  if (!Object.keys(chara).includes(charaName)) {
    return (
      <div className="font-onemobile">
        데이터가 없어요! <Link to=".">목록으로 가기</Link>
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
          목록으로
        </Link>
      </div>
      <div className="flex flex-row gap-2">
        <div>
          <img src={`/charas/${charaName}.png`} className="w-14 h-14" />
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
          <div className="-mt-2">
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
          <div className="-mt-2">{t(`class.${Class[unitClass]}`)}</div>
        </div>
        <div className="p-2">
          <div>
            <img
              src={`/icons/Common_UnitAttack${Attack[attackType]}.png`}
              alt=""
              className="w-8 h-8 inline"
            />
          </div>
          <div className="-mt-2">{t(`attack.${Attack[attackType]}`)}</div>
        </div>
        <div className="p-2">
          <div>
            <img
              src={`/icons/Common_Position${Position[position]}.png`}
              alt=""
              className="w-8 h-8 inline"
            />
          </div>
          <div className="-mt-2">{t(`position.${Position[position]}`)}</div>
        </div>
        <div className="p-2">
          <div>
            <img
              src={`/album/Album_Icon_${Race[race]}.png`}
              alt=""
              className="w-8 h-8 inline"
            />
          </div>
          <div className="-mt-2">{t(`race.${Race[race]}`)}</div>
        </div>
        <div className="p-2">
          <div>
            {Array(initialStar)
              .fill(0)
              .map((_, i) => {
                return (
                  <img
                    key={i}
                    src={`/icons/HeroGrade_000${[0, 5, 3, 4][initialStar]}.png`}
                    alt=""
                    className="w-8 h-8 inline -ml-2 first-of-type:ml-0"
                  />
                );
              })}
          </div>
          <div className="-mt-2">
            {chara[charaName].e
              ? t(`eldain.${chara[charaName].e}`)
              : `${initialStar}성`}
          </div>
        </div>
      </Card>
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
                <div key={date} className="ring rounded-md px-2 py-1">
                  <div className="text-xs">{year}</div>
                  <div className="text-sm">{`${month}/${day}`}</div>
                </div>
              );
            }
            return null;
          })}
          {!Object.values(clonefactory.l).flat().flat().includes(charaName) && (
            <div className="flex items-center flex-1 h-full mt-2">
              편성된 적이 없어요
            </div>
          )}
        </div>
      </Card>
      <Tabs className="mt-4" value={tab} onValueChange={setTab}>
        <TabsList className="flex">
          <TabsTrigger className="flex-1" value="Board">
            보드
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="Equip">
            장비
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="Food">
            연회장
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="Skill">
            스킬
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="Aside">
            어사이드
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Board">
          {Array(3)
            .fill(0)
            .map((_, i) => {
              const boardIndex = 2 - i;
              const { s: startPoint, b: boardRoute } =
                route.r[Race[race]][boardIndex];
              const boardStats = board.c[charaName].b[boardIndex]
                .map((statCollection) => statCollection.toString())
                .join("");
              const allRoutes = board.c[charaName].r[boardIndex]
                .join(".")
                .split(".")
                .map((routeIndex) => boardRoute[Number(routeIndex)]);
              const baseRoute: { boardType: number; stat: number }[] =
                allRoutes[0]
                  .split("")
                  .map((c) =>
                    c === "0"
                      ? { boardType: -1, stat: -1 }
                      : { boardType: 0, stat: -1 }
                  );
              allRoutes.forEach((r, j) => {
                baseRoute[r.indexOf("X")] = {
                  boardType: 2,
                  stat: Number(boardStats.charAt(j)),
                };
              });
              const purpleBoardStats = purpleboard.c[charaName].b[boardIndex];
              const purplePositions = purpleboard.c[charaName].p[boardIndex];
              purplePositions.split(".").forEach((p, j) => {
                const stat = Number(purpleBoardStats.toString().charAt(j));
                const position =
                  purpleposition.r[Race[race]][boardIndex].p[Number(p)];
                position.split(".").forEach((pos) => {
                  const [posRow, posCol] = pos
                    .split("")
                    .map((rc) => parseInt(rc, 36));
                  const cellIndex = posRow * 7 + posCol;
                  baseRoute[cellIndex] = {
                    boardType: 1,
                    stat,
                  };
                });
              });
              const routeRows = baseRoute.length / 7;
              return (
                <div key={i}>
                  {Array(routeRows)
                    .fill(0)
                    .map((_, rowNum) => {
                      return (
                        <div
                          key={rowNum}
                          className="flex flex-row justify-center items-center"
                        >
                          {Array(7)
                            .fill(0)
                            .map((_, colNum) => {
                              const cellIndex = rowNum * 7 + colNum;
                              const cell = baseRoute[cellIndex];
                              if (cell.boardType === 0) {
                                return (
                                  <div
                                    key={colNum}
                                    className="w-6 h-6 bg-board-normal bg-cover"
                                  />
                                );
                              }
                              if (cell.boardType === 1) {
                                return (
                                  <div
                                    key={colNum}
                                    className="w-6 h-6 bg-board-high bg-cover"
                                  >
                                    <img
                                      src={`/boards/Tile_${
                                        PurpleBoardType[cell.stat]
                                      }On.png`}
                                      className="w-full h-full aspect-square"
                                    />
                                  </div>
                                );
                              }
                              if (cell.boardType === 2) {
                                return (
                                  <div
                                    key={colNum}
                                    className="w-6 h-6 bg-board-special bg-cover"
                                  >
                                    <img
                                      src={`/boards/Tile_${
                                        BoardType[cell.stat]
                                      }On.png`}
                                      className="w-full h-full aspect-square"
                                    />
                                  </div>
                                );
                              }
                              return <div key={colNum} className="w-6 h-6" />;
                            })}
                        </div>
                      );
                    })}
                  <div className="flex flex-row justify-center items-center">
                    {Array(7)
                      .fill(0)
                      .map((_, colNum) => {
                        if (colNum === startPoint) {
                          if (boardIndex === 0) {
                            return (
                              <div
                                key={colNum}
                                className="w-6 h-6 bg-board-normal bg-cover"
                              >
                                <img
                                  src="/boards/Tile_Start.png"
                                  className="w-full h-full aspect-square"
                                />
                              </div>
                            );
                          }
                          return (
                            <div
                              key={colNum}
                              className="w-6 h-6 bg-board-gate bg-cover"
                            >
                              <img
                                src="/boards/Tile_Gate.png"
                                className="w-full h-full aspect-square"
                              />
                            </div>
                          );
                        }
                        return <div key={colNum} className="w-6 h-6" />;
                      })}
                  </div>
                </div>
              );
            })}
        </TabsContent>
        <TabsContent value="Equip">
          <ScrollArea className="max-w-full whitespace-nowrap rounded-md">
            <div className="flex w-max min-w-full space-x-2 p-2 justify-center items-stretch">
              {equip.c[charaName].map((equipset, i) => {
                const rank = i + 1;
                return (
                  <div key={i} className="flex flex-col">
                    <div
                      className={cn(
                        "text-lg flex-initial",
                        rankClassNames[i][1]
                      )}
                    >
                      {t("ui.equiprank.rankText", { 0: rank })}
                    </div>
                    <div
                      className={cn(
                        "grid grid-cols-2 p-2 w-48 flex-1 rounded",
                        rankClassNames[i][0]
                      )}
                    >
                      {equipset.map((e, si) => {
                        const [iType, iPart, iNum] = e.split(".");
                        const fileName = `/equips/Equip_${
                          { e: "", p: "Piece_", r: "Recipe_" }[iType]
                        }Icon_${iPart.charAt(0).toUpperCase()}${iPart.slice(
                          1
                        )}${iNum}`;
                        const iRank = Math.floor(Number(iNum) / 100);
                        return (
                          <div key={si} className="flex flex-col items-center">
                            <ItemSlot
                              item={fileName}
                              size={3}
                              fullItemPath
                              rarityInfo={(() => {
                                if ([9, 10].includes(iRank))
                                  return { s: "Yellow" };
                                if ([7, 8].includes(iRank))
                                  return { s: "Purple", b: "#B371F5" };
                                if ([5, 6].includes(iRank))
                                  return { s: "Blue", b: "#65A7E9" };
                                if ([3, 4].includes(iRank))
                                  return { s: "Green", b: "#65DD82" };
                                return { s: "Gray", b: "#B0B0B0" };
                              })()}
                            />
                            <div className="text-sm w-full whitespace-break-spaces">
                              {t(
                                `equip.equip.${e.split(".")[1]}.${
                                  e.split(".")[2]
                                }`
                              ) || t("ui.equip.unknownEquip")}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="Food">
          {Object.keys(food.c).includes(charaName) ? (
            <div className="flex flex-row flex-wrap gap-4 justify-center">
              <Card className="w-max p-4">
                <div className="text-xl mb-2">좋아하는 음식</div>
                <div className="flex flex-row flex-wrap gap-2">
                  {food.c[charaName][5].map((fid) => {
                    if (!food.f[fid].t) return null;
                    return (
                      <div key={fid} className="relative">
                        <ItemSlot
                          rarityInfo={food.r[food.f[fid].r]}
                          item={`/foods/Icon_Food_${fid}`}
                          fullItemPath
                          size={3.5}
                          innerSize={60}
                        />
                        <img
                          src="/foods/MyHomeRestaurant_FeelingStatus_5.png"
                          className="absolute w-5 aspect-[28/25] -top-1 -right-1"
                        />
                        <div className="text-sm">
                          +{food.p[food.f[fid].r][4] + 1}~
                          {food.p[food.f[fid].r][4] + 3}
                        </div>
                      </div>
                    );
                  })}
                  {food.c[charaName][1].map((fid) => {
                    if (!food.f[fid].t) return null;
                    return (
                      <div key={fid} className="relative">
                        <ItemSlot
                          rarityInfo={food.r[food.f[fid].r]}
                          item={`/foods/Icon_Food_${fid}`}
                          fullItemPath
                          size={3.5}
                          innerSize={60}
                        />
                        <img
                          src="/foods/MyHomeRestaurant_FeelingStatus_1.png"
                          className="absolute w-5 aspect-[28/25] -top-1 -right-1"
                        />
                        <div className="text-sm">
                          +{food.p[food.f[fid].r][0] + 1}~
                          {food.p[food.f[fid].r][0] + 3}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
              <Card className="w-max p-4">
                <div className="text-xl mb-2">싫어하는 음식</div>
                <div className="flex flex-row flex-wrap gap-2">
                  {food.c[charaName][3].map((fid) => {
                    if (!food.f[fid].t) return null;
                    return (
                      <div key={fid} className="relative">
                        <ItemSlot
                          rarityInfo={food.r[food.f[fid].r]}
                          item={`/foods/Icon_Food_${fid}`}
                          fullItemPath
                          size={3.5}
                          innerSize={60}
                        />
                        <img
                          src="/foods/MyHomeRestaurant_FeelingStatus_3.png"
                          className="absolute w-5 aspect-[28/25] -top-1 -right-1"
                        />
                        <div className="text-sm">
                          +{food.p[food.f[fid].r][2] + 1}~
                          {food.p[food.f[fid].r][2] + 3}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          ) : (
            <div>연회장 정보가 존재하지 않아요!</div>
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
                <div className="text-sm mt-2 opacity-80">저학년 스킬</div>
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
                <div className="text-sm opacity-80">고학년 스킬</div>
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
                재사용 대기시간{" "}
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
                <div className="text-xl">일반 공격</div>
              </div>
            </div>
            {skillcoefficient.c[charaName].s.a && (
              <div className="text-sm my-1">
                <span className="px-8 py-1 bg-emerald-700 text-slate-50 dark:bg-lime-300 dark:text-slate-950 rounded-full">
                  기본
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
                    강화
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
                </div>
                <div className="text-sm break-keep text-slate-600 dark:text-slate-400">
                  {t(
                    `aside.${charaName}.skill1.coefficient`,
                    Object.fromEntries(
                      skillcoefficient.c[charaName].a![1].map((v, i) => {
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
                </div>
                <div className="text-sm break-keep text-slate-600 dark:text-slate-400">
                  {t(
                    `aside.${charaName}.skill3.coefficient`,
                    Object.fromEntries(
                      skillcoefficient.c[charaName].a![3].map((v, i) => {
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
            </div>
          ) : (
            <div>아직 사념이 깊지 않은 것 같다</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Personal;
