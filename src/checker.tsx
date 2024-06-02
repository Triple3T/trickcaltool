import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  StatType,
  // Race,
} from "@/types/enums";

import board from "@/data/board";
// import chara from "@/data/chara";
// import eqrank from "@/data/eqrank";
// import lab from "@/data/lab";
// import purpleboard from "@/data/purpleboard";

import userdata from "@/utils/userdata";
import PercentChecker from "./components/checker/percent-checker";
// import { dataFileRead, dataFileWrite } from "@/utils/dataRW";

const Checker = () => {
  const { t } = useTranslation();
  const boardStat = useMemo(() => {
    const boardStats: { [key: string]: number } = {};
    const boardData = userdata.board.load().b;
    Object.entries(boardData).forEach(([c, b]) => {
      const charaBoard = board.c[c].b;
      charaBoard.forEach((nthboard, i) => {
        nthboard.forEach((boardList, j) => {
          boardList
            .toString(10)
            .split("")
            .forEach((targetBoardString, k) => {
              const targetBoard = Number(targetBoardString);
              const isChecked = b[i][j] & (1 << k);
              if (isChecked) {
                const statList = board.s[targetBoard];
                statList.forEach((stat, statIndex) => {
                  const statType = StatType[stat];
                  const statValue = board.b[targetBoard][statIndex][i];
                  boardStats[statType] =
                    (boardStats[statType] ?? 0) + statValue;
                });
              }
            });
        });
      });
    });
    // console.log("boardStats", boardStats);
    return boardStats;
  }, []);
  // const pboardStat = useMemo(() => {
  //   const pboardStats: { [key: string]: number } = {};
  //   const pboardData = userdata.pboard.load().p;
  //   Object.entries(pboardData).forEach(([c, b]) => {
  //     const charaPboard = purpleboard.c[c].b;
  //     charaPboard.forEach((nthboard, i) => {
  //       nthboard
  //         .toString(10)
  //         .split("")
  //         .forEach((targetBoardString, j) => {
  //           const targetBoard = Number(targetBoardString);
  //           const checkedCount = b[i][j].toString(2).split("1").length - 1;
  //           if (checkedCount > 0) {
  //             const statList = purpleboard.s[targetBoard];
  //             statList.forEach((stat, statIndex) => {
  //               const statType = StatType[stat];
  //               const statValue = purpleboard.b[targetBoard][statIndex][i];
  //               pboardStats[statType] =
  //                 (pboardStats[statType] ?? 0) + statValue * checkedCount;
  //             });
  //           }
  //         });
  //     });
  //   });
  //   console.log("pboardStats", pboardStats);
  //   return pboardStats;
  // }, []);
  // const rankStat = useMemo(() => {
  //   const rankStats: { [key: string]: number } = {};
  //   const rankStatCollection = Array(eqrank.s.length).fill(0);
  //   const rankData = userdata.eqrank.load().r;
  //   Object.entries(rankData).forEach(([c, r]) => {
  //     const charaRank = eqrank.r[eqrank.c[c].r];
  //     if (r > 1) {
  //       const collectedStats = charaRank.slice(0, r - 1);
  //       collectedStats.forEach((stats) => {
  //         stats.forEach((statCollection) => {
  //           rankStatCollection[statCollection] += 1;
  //         });
  //       });
  //     }
  //   });
  //   rankStatCollection.forEach((count, i) => {
  //     const [statType, statAmount] = eqrank.s[i];
  //     rankStats[StatType[statType]] = count * statAmount;
  //   });
  //   console.log("rankStats", rankStats);
  //   return rankStats;
  // }, []);
  // const labStat = useMemo(() => {
  //   const labStats: { [key: string]: { [key: string]: number } } = {};
  //   const labData = userdata.lab.load();
  //   lab.l.slice(0, labData[1]).forEach((effectCollection) => {
  //     effectCollection.forEach((effectEntry) => {
  //       const effect = lab.e[effectEntry.e];
  //       if (effect.e === 40) {
  //         effectEntry.t!.forEach((raceNumber) => {
  //           const targetRace = Race[raceNumber];
  //           effect.v.forEach((statValue, i) => {
  //             const statType = StatType[effect.s![i]];
  //             if (typeof labStats[targetRace] === "undefined")
  //               labStats[targetRace] = {};
  //             labStats[targetRace][statType] =
  //               (labStats[targetRace][statType] ?? 0) + statValue;
  //           });
  //         });
  //       }
  //     });
  //   });
  //   console.log("labStats", labStats);
  //   return labStats;
  // }, []);
  return (
    <>
      <Tabs className="font-onemobile w-full mt-4" defaultValue="percent">
        <TabsList className="flex mb-4">
          <TabsTrigger className="flex-1" value="percent">
            {t("ui.check.percent.index")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="percent">
          <PercentChecker boardStat={boardStat} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Checker;
