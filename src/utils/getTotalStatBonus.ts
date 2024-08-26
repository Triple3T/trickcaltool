import { StatType, Race } from "@/types/enums";

import board from "@/data/board";
// import chara from "@/data/chara";
import eqrank from "@/data/eqrank";
import lab from "@/data/lab";
import purpleboard from "@/data/purpleboard";
import userdata from "@/utils/userdata";

export const getTotalBoardStat = () => {
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
                boardStats[statType] = (boardStats[statType] ?? 0) + statValue;
              });
            }
          });
      });
    });
  });
  return boardStats;
};

export const getTotalPboardStat = () => {
  const pboardStats: { [key: string]: number } = {};
  const pboardData = userdata.pboard.load().p;
  Object.entries(pboardData).forEach(([c, b]) => {
    const charaPboard = purpleboard.c[c].b;
    charaPboard.forEach((nthboard, i) => {
      nthboard
        .toString(10)
        .split("")
        .forEach((targetBoardString, j) => {
          const targetBoard = Number(targetBoardString);
          const checkedCount = b[i][j].toString(2).split("1").length - 1;
          if (checkedCount > 0) {
            const statList = purpleboard.s[targetBoard];
            statList.forEach((stat, statIndex) => {
              const statType = StatType[stat];
              const statValue = purpleboard.b[targetBoard][statIndex][i];
              pboardStats[statType] =
                (pboardStats[statType] ?? 0) + statValue * checkedCount;
            });
          }
        });
    });
  });
  return pboardStats;
};

export const getTotalRankStat = () => {
  const rankStats: { [key: string]: number } = {};
  const rankStatCollection = Array(eqrank.s.length).fill(0);
  const rankData = userdata.eqrank.load().r;
  Object.entries(rankData).forEach(([c, r]) => {
    const charaRank = eqrank.r[eqrank.c[c].r];
    if (r > 1) {
      const collectedStats = charaRank.slice(0, r - 1);
      collectedStats.forEach((stats) => {
        stats.forEach((statCollection) => {
          rankStatCollection[statCollection] += 1;
        });
      });
    }
  });
  rankStatCollection.forEach((count, i) => {
    const [statType, statAmount] = eqrank.s[i];
    rankStats[StatType[statType]] = count * statAmount;
  });
  return rankStats;
};

export const getTotalLabStat = () => {
  const labStats: { [key: string]: { [key: string]: number } } = {};
  const labData = userdata.lab.load();
  lab.l.slice(0, labData[1]).forEach((effectCollection) => {
    effectCollection.forEach((effectEntry) => {
      const effect = lab.e[effectEntry.e];
      if (effect.e === 40) {
        effectEntry.t!.forEach((raceNumber) => {
          const targetRace = Race[raceNumber];
          effect.v.forEach((statValue, i) => {
            const statType = StatType[effect.s![i]];
            if (typeof labStats[targetRace] === "undefined")
              labStats[targetRace] = {};
            labStats[targetRace][statType] =
              (labStats[targetRace][statType] ?? 0) + statValue;
          });
        });
      }
    });
  });
  return labStats;
};
