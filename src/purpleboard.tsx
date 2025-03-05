import { use, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { VirtuosoGrid } from "react-virtuoso";
import { AuthContext } from "@/contexts/AuthContext";
import icSearch from "@/lib/initialConsonantSearch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Loading from "@/components/common/loading";
import SearchBox from "@/components/common/search-with-icon";
import PurpleBoardCard from "@/components/parts/purple-board-card";
import SelectChara from "@/components/parts/select-chara";
import SubtitleBar from "@/components/parts/subtitlebar";
import board from "@/data/board";
import chara from "@/data/chara";
import purpleboard from "@/data/purpleboard";
import purpleposition from "@/data/purpleposition";
import clonefactory from "@/data/clonefactory";
import {
  BoardType,
  Personality,
  PurpleBoardType,
  Race,
  StatType,
} from "@/types/enums";
import { personalityBG } from "@/utils/personalityBG";

import {
  UserDataOwnedCharaInfo,
} from "@/types/types";
import { BoardCrayonStatistic, BoardStatStatistic } from "./trickcalboard";
// import { dataFileRead, dataFileWrite } from "@/utils/dataRW";

interface BoardDataCharaProps {
  name: string;
  ldx: number; // 황크: 자물쇠 개수, 0~2; 보크: 해당 스탯 보드 중 몇 번째인지, 0~2
  bdx: number; // 몇 번째 자릿수인지, 0~6?
  checked: boolean; // 색칠했는지 여부
  unowned: boolean; // 보유 여부
  clf: false | number;
}

const PurpleBoardStatStatistic = ({
  stat,
  percentStat,
  data,
}: {
  stat: string;
  percentStat: number;
  data: { [key: string]: BoardDataCharaProps[][] };
}) => {
  const { t } = useTranslation();
  const statType = StatType[stat as keyof typeof StatType];
  const statStatistic = Object.entries(data).map(([b, d]) => {
    const boardType = PurpleBoardType[b as keyof typeof PurpleBoardType];
    const statMult =
      purpleboard.b[boardType][purpleboard.s[boardType].indexOf(statType)];
    const cur = d.map((nth) => nth.filter((c) => c.checked).length);
    const stat = d.map(
      (nth, n) => nth.filter((c) => c.checked).length * statMult[n]
    );
    const max = d.map((nth) => nth.length);
    return { cur, max, stat };
  });
  const statCheckedTotal = statStatistic.reduce(
    (a, b) => ({
      cur: Array.from(Array(Math.max(a.cur.length, b.cur.length)).keys()).map(
        (i) => (a.cur[i] ?? 0) + (b.cur[i] ?? 0)
      ),
      max: Array.from(Array(Math.max(a.max.length, b.max.length)).keys()).map(
        (i) => (a.max[i] ?? 0) + (b.max[i] ?? 0)
      ),
    }),
    {
      cur: [] as number[],
      max: [] as number[],
    }
  );
  return (
    <div className="flex">
      <div className="relative z-10">
        <img
          className="h-10 mr-2 aspect-square inline-block align-middle"
          src={`/icons/Icon_${stat}.png`}
        />
      </div>
      <div className="flex flex-col flex-1 gap-1 -ml-8">
        <div className="bg-gradient-to-r from-transparent via-[#f2f9e7] dark:via-[#36a52d] via-[28px] to-[#f2f9e7] dark:to-[#36a52d] py-0.5 pr-2.5 pl-8 rounded-r-[14px] flex flex-row dark:contrast-125 dark:brightness-80">
          <div className="text-left flex-auto">{t(`stat.${stat}`)}</div>
          <div className="text-right flex-auto">
            {Math.round(
              (statStatistic.reduce(
                (a, b) => a + b.stat.reduce((a, b) => a + b, 0),
                0
              ) *
                (100 + percentStat)) /
                100
            ).toLocaleString()}
          </div>
        </div>
        <div className="bg-gradient-to-r from-transparent via-[#e9f5cf] dark:via-[#169a2d] via-[28px] to-[#e9f5cf] dark:to-[#169a2d] py-px pr-2.5 pl-8 rounded-r-[11px] flex flex-row gap-1 text-sm dark:contrast-125 dark:brightness-80">
          {statCheckedTotal.max.map((m, i) => {
            const max = m;
            const cur = statCheckedTotal.cur[i];
            return (
              <div key={i} className="flex-1 text-center">
                <img
                  src={`/icons/RecordReward_Tab_${
                    ["Easy", "Herd", "VeryHard"][i]
                  }Lv.png`}
                  className="bg-greenicon rounded-full align-middle h-4 aspect-square mr-1 inline-block dark:border dark:border-white"
                />
                <span
                  className={
                    cur === max ? "text-red-600 dark:text-red-400" : ""
                  }
                >
                  {cur}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// const BoardCrayonStatistic = ({
//   data,
//   rarity,
//   require,
// }: {
//   data: BoardDataPropsBoard[];
//   rarity: number;
//   require: number[];
// }) => {
//   const { t } = useTranslation();
//   const statStatistic = data.map((d) => {
//     return d.charas.filter((c) => c.checked).length;
//   });
//   return (
//     <div className="flex">
//       <div className="relative z-10">
//         <img
//           className="h-10 mr-2 aspect-square inline-block align-middle"
//           src={`/icons/Item_Crayon${rarity}.png`}
//         />
//       </div>
//       <div className="flex flex-col flex-1 gap-1 -ml-8">
//         <div className="bg-gradient-to-r from-transparent via-[#f2f9e7] dark:via-[#36a52d] via-[28px] to-[#f2f9e7] dark:to-[#36a52d] py-0.5 pr-2.5 pl-8 rounded-r-[14px] flex flex-row dark:contrast-125 dark:brightness-80">
//           <div className="text-left flex-auto">
//             {t(`ui.board.usedCountLabel`)}
//           </div>
//           <div className="text-right flex-auto">
//             {statStatistic
//               .reduce((a, b, i) => a + b * require[i], 0)
//               .toLocaleString()}
//             {t("ui.board.crayonCountUnit")}
//           </div>
//         </div>
//         <div className="bg-gradient-to-r from-transparent via-[#e9f5cf] dark:via-[#169a2d] via-[28px] to-[#e9f5cf] dark:to-[#169a2d] py-px pr-2.5 pl-8 rounded-r-[11px] flex flex-row gap-1 text-sm dark:contrast-125 dark:brightness-80">
//           {statStatistic.map((count, i) => (
//             <div key={i} className="flex-1 text-center">
//               <img
//                 src={`/icons/RecordReward_Tab_${
//                   ["Easy", "Herd", "VeryHard"][i]
//                 }Lv.png`}
//                 className="bg-greenicon rounded-full align-middle h-4 aspect-square mr-1 inline-block dark:border dark:border-white"
//               />
//               <span>{count.toLocaleString()}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

const PurpleBoard = () => {
  const { t } = useTranslation();
  const { userData, userDataDispatch } = use(AuthContext);
  const [charaDrawerOpen, setCharaDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [boardStatMultiplied, setBoardStatMultiplied] = useState(false);
  const [boardStatPercent, setBoardStatPercent] = useState<{
    [key: string]: number;
  }>({});
  const [newCharaAlert, setNewCharaAlert] = useState(false);
  // const [viewMode, setViewMode] = useState<"target" | "full">("target");

  useEffect(() => {
    if (newCharaAlert) {
      toast.info(t("ui.index.newCharacterAlert"));
      setNewCharaAlert(false);
    }
  }, [newCharaAlert, t]);
  // const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userDataDispatch) {
      setBoardStatPercent(userDataDispatch.getStatPercents());
    }
  }, [userDataDispatch]);
  // useEffect(() => {
  //   const boardStats: { [key: string]: number } = {};
  //   const boardData = userdata.board.load().b;
  //   Object.entries(boardData).forEach(([c, b]) => {
  //     const charaBoard = board.c[c].b;
  //     charaBoard.forEach((nthboard, i) => {
  //       nthboard.forEach((boardList, j) => {
  //         boardList
  //           .toString(10)
  //           .split("")
  //           .forEach((targetBoardString, k) => {
  //             const targetBoard = Number(targetBoardString);
  //             const isChecked = b[i][j] & (1 << k);
  //             if (isChecked) {
  //               const statList = board.s[targetBoard];
  //               statList.forEach((stat, statIndex) => {
  //                 const statType = StatType[stat];
  //                 const statValue = board.b[targetBoard][statIndex][i];
  //                 boardStats[statType] =
  //                   (boardStats[statType] ?? 0) + statValue;
  //               });
  //             }
  //           });
  //       });
  //     });
  //   });
  //   setBoardStatPercent(boardStats);
  // }, []);

  if (!userData || !userDataDispatch) return <Loading />;

  return (
    <>
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
                    />
                  </div>
                </div>
                {/* <div className="flex flex-col gap-2">
                  <SubtitleBar>{t("ui.common.backUpAndRestore")}</SubtitleBar>
                  <div className="flex flex-row gap-2 max-w-xl w-full px-4">
                    <div className="flex-1">
                      <Button
                        className="w-full"
                        onClick={() => dataFileWrite()}
                      >
                        {t("ui.common.backUp")}
                      </Button>
                    </div>
                    <div className="flex-1">
                      <Button
                        className="w-full"
                        onClick={() => fileInput.current?.click()}
                      >
                        {t("ui.common.restore")}
                      </Button>
                      <input
                        type="file"
                        accept=".txt"
                        className="hidden"
                        ref={fileInput}
                        onChange={(e) =>
                          dataFileRead(e.target.files).then((v) => {
                            if (v.success) {
                              toast.success(t("ui.index.fileSync.success"));
                              initFromUserData();
                              if (isReady && googleLinked && autoSave) {
                                autoSave();
                              }
                            } else {
                              toast.error(t(v.reason));
                            }
                          })
                        }
                      />
                    </div>
                  </div>
                </div> */}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              {t("ui.board.allStatBaseTotal")}
            </AccordionTrigger>
            <AccordionContent className="text-base">
              <div className="mb-2 text-left flex items-center gap-2">
                <Switch
                  id="view-all-stat-with-board"
                  checked={boardStatMultiplied}
                  onCheckedChange={(c) => {
                    setBoardStatMultiplied(c);
                  }}
                />
                <Label htmlFor="view-all-stat-with-board">
                  {t("ui.equiprank.viewAllStatWithBoard")}
                </Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-auto gap-2.5">
                {[1, 0, 7, 6, 4, 2, 5, 3, 8].map((statNum) => {
                  const stat = StatType[statNum];
                  const includedBoards = purpleboard.s
                    .map((s, i) => [s, i] as [number[], number])
                    .filter(([s]) => s.includes(statNum))
                    .map(([, i]) => i);
                  const data = Object.fromEntries(
                    includedBoards.map((b) => [
                      PurpleBoardType[b],
                      Array(3)
                        .fill(0)
                        .map((_, nthboard) => {
                          return Object.entries(purpleboard.c)
                            .filter(([, pboardData]) => {
                              return pboardData.b[nthboard]
                                .toString(10)
                                .includes(`${b}`);
                            })
                            .map(([charaName, pboardData]) => {
                              const boardIndex = pboardData.b[nthboard]
                                .toString(10)
                                .indexOf(`${b}`);
                              const boardPositions =
                                purpleposition.r[
                                  Race[Number(chara[charaName].t.charAt(5))]
                                ][nthboard].p[
                                  Number(
                                    pboardData.p[nthboard].split(".")[
                                      boardIndex
                                    ]
                                  )
                                ].split(".");
                              const returnArray = [] as BoardDataCharaProps[];
                              boardPositions.forEach((_, j) => {
                                const unowned =
                                  userData.charaInfo[charaName].unowned;
                                returnArray.push({
                                  name: charaName,
                                  ldx: j,
                                  bdx: boardIndex,
                                  checked: unowned
                                    ? false
                                    : (userData.charaInfo[charaName].pboard[
                                        nthboard
                                      ][boardIndex] &
                                        (1 << j)) >
                                      0,
                                  unowned,
                                  clf: clonefactory.l[clonefactory.f]
                                    .flat()
                                    .includes(charaName)
                                    ? clonefactory.l[clonefactory.f].findIndex(
                                        (a) => a.includes(charaName)
                                      )
                                    : false,
                                });
                              });
                              return returnArray;
                            })
                            .flat();
                        }),
                    ])
                  );
                  return (
                    <PurpleBoardStatStatistic
                      key={stat}
                      stat={stat}
                      percentStat={
                        boardStatMultiplied ? boardStatPercent[stat] || 0 : 0
                      }
                      data={data}
                    />
                  );
                })}
                <BoardCrayonStatistic
                  rarity={3}
                  data={Object.values(userData.charaInfo).map((c) =>
                    c.unowned ? [[0], [0], [0]] : c.pboard
                  )}
                  require={[3, 6, 9]}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              {t("ui.board.allStatPercentTotal")}
            </AccordionTrigger>
            <AccordionContent className="text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-auto gap-2.5">
                {[1, 0, 7, 6, 4, 2, 5, 3, 8].map((statNum) => {
                  const stat = StatType[statNum];
                  const includedBoards = board.s
                    .map((s, i) => [s, i] as [number[], number])
                    .filter(([s]) => s.includes(statNum))
                    .map(([, i]) => i);
                  const data = Object.fromEntries(
                    includedBoards.map((b) => [
                      BoardType[b],
                      Array(3)
                        .fill(0)
                        .map((_, nthboard) => {
                          return {
                            charas: Object.entries(board.c)
                              .filter(([, boardData]) => {
                                return boardData.b[nthboard]
                                  .map((cb) => cb.toString())
                                  .join("")
                                  .includes(`${b}`);
                              })
                              .map(([charaName, boardData]) => {
                                return boardData.b[nthboard]
                                  .map((cb, j) => {
                                    const returnArray =
                                      [] as BoardDataCharaProps[];
                                    cb.toString(10)
                                      .split("")
                                      .forEach((cbi, k) => {
                                        if (cbi === `${b}`) {
                                          const unowned =
                                            userData.charaInfo[charaName]
                                              .unowned;
                                          returnArray.push({
                                            name: charaName,
                                            ldx: j,
                                            bdx: k,
                                            checked: unowned
                                              ? false
                                              : (userData.charaInfo[charaName]
                                                  .board[nthboard][j] &
                                                  (1 << k)) >
                                                0,
                                            unowned,
                                            clf: clonefactory.l[clonefactory.f]
                                              .flat()
                                              .includes(charaName)
                                              ? clonefactory.l[
                                                  clonefactory.f
                                                ].findIndex((a) =>
                                                  a.includes(charaName)
                                                )
                                              : false,
                                          });
                                        }
                                      });
                                    return returnArray;
                                  })
                                  .flat();
                              })
                              .flat(),
                          };
                        }),
                    ])
                  );
                  return (
                    <BoardStatStatistic
                      key={stat}
                      stat={stat}
                      data={data}
                      withoutScrollButton
                    />
                  );
                })}
                {
                  <BoardCrayonStatistic
                    rarity={4}
                    data={Object.values(userData.charaInfo).map((c) =>
                      c.unowned ? [[0], [0], [0]] : c.board
                    )}
                    require={[2, 4, 6]}
                  />
                }
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <SearchBox
        className="font-onemobile flex-auto"
        value={search}
        onValueChange={setSearch}
        placeholder={t("ui.charaSelect.searchByName")}
      />
      <VirtuosoGrid
        useWindowScroll
        className="font-onemobile mt-4"
        listClassName="gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-80 md:max-w-3xl lg:max-w-full mx-auto"
        data={userData.unowned.o
          .filter((c) =>
            search
              ? t(`chara.${c}`).includes(search) ||
                icSearch(t(`chara.${c}`), search)
              : true
          )
          .sort((a, b) => t(`chara.${a}`).localeCompare(t(`chara.${b}`)))}
        itemContent={(_, name) => {
          // const currentBoard = board.c[name].b;
          const currentCharaInfo = userData.charaInfo[
            name
          ] as UserDataOwnedCharaInfo;
          const charaPersonality = Number(chara[name].t[0]);
          const charaRace = Number(chara[name].t[5]);
          const personalityClassName =
            personalityBG[Number(charaPersonality) as Personality];
          const openBoardIndex = currentCharaInfo.nthboard;
          return (
            <PurpleBoardCard
              key={name}
              name={name}
              currentBoard={board.c[name].b}
              currentPurpleBoard={purpleboard.c[name]}
              // charaPersonality,
              charaRace={charaRace}
              personalityClassName={personalityClassName}
              skin={currentCharaInfo.skin}
              openBoardIndex={openBoardIndex}
              dispatchClickBoardData={userDataDispatch.boardClick}
              dispatchClickPurpleBoardData={userDataDispatch.pboardClick}
              dispatchNthBoardData={userDataDispatch.boardIndex}
              board={currentCharaInfo.board}
              pboard={currentCharaInfo.pboard}
            />
          );
        }}
      />
    </>
  );
};

export default PurpleBoard;
