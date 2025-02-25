import pet from "@/data/pet";
// -------------------- 데이터 타입 정의 --------------------
type SkillGrade = 1 | 2 | 3 | 4;
type SkillType = "1" | "2" | "3" | "4" | "5" | "6";
type PetGrade = 0 | 1 | 2 | 3;

interface Pet {
  id: string;
  grade: PetGrade;
  skills: Record<SkillType, SkillGrade>;
  // 사용자의 펫이면 false, 다른 사용자의 대여펫이면 true
  isBorrowed: boolean;
}

interface Dispatch {
  id: string;
  // bonusSkills: 해당 심부름에서 보너스 대상으로 지정된 스킬 종류 (1개 또는 2개)
  bonusSkills: SkillType[];
}

// 최종 결과에 대한 인터페이스 (tie-break용 추가 메트릭 포함)
interface BestResult {
  totalReward: number;
  assignments: { [dispatchId: string]: Pet[] };
  borrowedCount: number; // 전체 할당된 대여 펫 수 (중복 없이)
  totalCount: number; // 모든 심부름에 할당된 펫 수의 합
}

export interface DispatchProp {
  dispatchTime: number;
  ownedPets: string[];
  borrowablePets: string[];
  dispatchList: { i: number; b: number[] }[];
  borrowLimit: number[];
}
const solveDispatch = (prop: DispatchProp, messageProgress: boolean) => {
  const overallBorrowLimit = prop.borrowLimit[0];
  // -------------------- 점수 및 보상 계산 함수 --------------------
  function getPetScore(p: Pet, dispatch: Dispatch): number {
    return (
      Object.entries(p.skills)
        .map(([skill, grade]) =>
          dispatch.bonusSkills.includes(skill as SkillType)
            ? pet.s.s[grade as number]
            : 0
        )
        .reduce((a, b) => a + b, 0) || pet.s.r[p.grade]
    );
  }

  const getRewardObject = (time: number) => {
    const idx = pet.d.t.indexOf(time);
    if (idx < 0) return [-1, -1, -1, -1, -1];
    const carrot = pet.d.c.map((e) =>
      Math.round((e[idx][0] + e[idx][1]) * 1000)
    );
    const gold = pet.d.g.map((e) => e[idx]);
    return carrot.map((e, i) => e + gold[i]);
  };

  const getRank = (total: number): number =>
    [...pet.s.b, Infinity].findIndex((e) => e > total) - 1;
  // 총 펫 점수에 따라 고정 보상(정수)을 반환함
  const getMultiplier = (total: number, time: number): number =>
    getRewardObject(time)[getRank(total)] ?? -1;

  function getDispatchReward(
    pets: Pet[],
    dispatch: Dispatch,
    time: number
  ): number {
    const petScoreSum = pets.reduce(
      (sum, pet) => sum + getPetScore(pet, dispatch),
      0
    );
    return getMultiplier(petScoreSum, time);
  }
  function getDispatchRank(pets: Pet[], dispatch: Dispatch): number {
    const petScoreSum = pets.reduce(
      (sum, pet) => sum + getPetScore(pet, dispatch),
      0
    );
    return getRank(petScoreSum);
  }

  // -------------------- 조합 생성 함수 --------------------
  function combinations<T>(arr: T[], k: number): T[][] {
    const result: T[][] = [];
    function backtrack(start: number, comb: T[]) {
      if (comb.length === k) {
        result.push([...comb]);
        return;
      }
      for (let i = start; i < arr.length; i++) {
        comb.push(arr[i]);
        backtrack(i + 1, comb);
        comb.pop();
      }
    }
    backtrack(0, []);
    return result;
  }

  // 한 심부름에 대해, 자체 펫과 대여 펫에서 (최대 3마리, 단 대여펫은 개별적으로 최대 1마리씩) 가능한 모든 유효한 펫 조합 생성
  function getValidCombinations(
    ownAvailable: Pet[],
    borrowedAvailable: Pet[],
    borrowLimit: number
  ): Pet[][] {
    const combos: Pet[][] = [];
    // 자체 펫만 사용하는 경우 (1~3마리)
    for (let cnt = 1; cnt <= 3; cnt++) {
      combos.push(...combinations(ownAvailable, cnt));
    }
    if (borrowLimit > 0) {
      // 대여펫 1마리 + 자체 펫 (자체 펫 0~2마리)
      for (const borrowed of borrowedAvailable) {
        for (let cnt = 0; cnt <= 2; cnt++) {
          const ownCombos = combinations(
            ownAvailable.filter((p) => p.id !== borrowed.id.split("-")[0]),
            cnt
          );
          for (const ownCombo of ownCombos) {
            combos.push([borrowed, ...ownCombo]);
          }
        }
      }
    }
    // 아무 펫도 할당하지 않는 경우
    combos.push([]);
    return combos;
  }

  // -------------------- Tie-break 비교 함수 --------------------
  function betterResult(a: BestResult, b: BestResult): BestResult {
    // 총 보상이 큰 것이 우선
    if (a.totalReward !== b.totalReward) {
      return a.totalReward > b.totalReward ? a : b;
    }
    // 보상이 같다면, 대여 펫 사용 수가 적은 쪽 우선
    if (a.borrowedCount !== b.borrowedCount) {
      return a.borrowedCount < b.borrowedCount ? a : b;
    }
    // 대여 펫 수도 같다면, 전체 펫 수가 적은 쪽 우선
    return a.totalCount <= b.totalCount ? a : b;
  }

  // 할당 결과에서 tie-break 메트릭(대여펫 수, 전체 펫 수) 계산
  function getAssignmentMetrics(assignments: { [dispatchId: string]: Pet[] }): {
    borrowed: number;
    total: number;
  } {
    const usedBorrowed = new Set<string>();
    let total = 0;
    for (const dispatchId in assignments) {
      for (const pet of assignments[dispatchId]) {
        total++;
        if (pet.isBorrowed) usedBorrowed.add(pet.id);
      }
    }
    return { borrowed: usedBorrowed.size, total };
  }

  // -------------------- 상수 --------------------
  // 심부름당 최대 보상 (정수)
  const MAX_DISPATCH_REWARD = (time: number) => getRewardObject(time)[4];
  // 심부름 전체 최대 보상 (예: 5개 심부름이면 5*270)
  let TOTAL_MAX: number;
  let globalBaseline: BestResult = {
    totalReward: -Infinity,
    assignments: {},
    borrowedCount: Infinity,
    totalCount: Infinity,
  };

  // -------------------- 재귀 백트래킹 (대여펫 사용 수 제한 적용) --------------------
  /**
   * @param dispatchIndex 현재 할당할 심부름의 인덱스
   * @param usedOwn 이미 다른 심부름에 할당된 자체 펫 id Set
   * @param usedBorrowed 이미 다른 심부름에 할당된 대여 펫 id Set
   * @param borrowedUsed 현재까지 사용된 대여 펫 수
   * @param borrowedLimit 대여 펫 사용 상한 (0, 1, 2, 3 중 하나)
   * @param ownPets 전체 자체 펫 목록
   * @param borrowedPets 전체 대여 펫 목록
   * @param dispatchList 심부름 목록
   * @param currentSum 현재까지의 총 보상
   * @param currentAssignments 지금까지의 심부름별 편성 결과
   * @param baseline 이전 단계(더 낮은 대여 제한)에서 얻은 최고 보상
   * @param time 심부름 시간
   * @returns 현재 상태에서 얻을 수 있는 최적 결과
   */
  function searchAssignment(
    dispatchIndex: number,
    usedOwn: Set<string>,
    usedBorrowed: Set<string>,
    borrowedUsed: number,
    borrowedLimit: number,
    ownPets: Pet[],
    borrowedPets: Pet[],
    dispatchList: Dispatch[],
    currentSum: number,
    currentAssignments: { [dispatchId: string]: Pet[] },
    time: number
  ): BestResult {
    if (dispatchIndex === dispatchList.length) {
      const metrics = getAssignmentMetrics(currentAssignments);
      const currentResult = {
        totalReward: currentSum,
        assignments: { ...currentAssignments },
        borrowedCount: metrics.borrowed,
        totalCount: metrics.total,
      };
      globalBaseline = betterResult(globalBaseline, currentResult);
      return currentResult;
    }

    const remaining = dispatchList.length - dispatchIndex;
    const potentialBest = currentSum + remaining * MAX_DISPATCH_REWARD(time);
    const potentialBorrowedCount = borrowedUsed;
    const potentialTotalCount = usedOwn.size + remaining;
    // 가지치기: 잠재 가치가 baseline보다 낮으면 탐색 중단
    if (
      potentialBest < globalBaseline.totalReward ||
      (potentialBest === globalBaseline.totalReward &&
        potentialBorrowedCount >= globalBaseline.borrowedCount) ||
      (potentialBest === globalBaseline.totalReward &&
        potentialBorrowedCount === globalBaseline.borrowedCount &&
        potentialTotalCount >= globalBaseline.totalCount)
    ) {
      return {
        totalReward: -Infinity,
        assignments: {},
        borrowedCount: Infinity,
        totalCount: Infinity,
      };
    }

    const currentDispatch = dispatchList[dispatchIndex];
    const ownAvailable = ownPets
      .filter((pet) => !usedOwn.has(pet.id))
      .sort((a, b) => b.grade - a.grade);
    const borrowedAvailable = borrowedPets
      .filter((pet) => !usedBorrowed.has(pet.id))
      .sort((a, b) => b.grade - a.grade);

    const validCombos = getValidCombinations(
      ownAvailable,
      borrowedAvailable,
      borrowedLimit - borrowedUsed
    );

    // 안될 건 미리 필터링
    // 정렬 기준: 1) 보상 내림, 2) 대여펫 수 오름, 3) 전체 펫 수 오름
    validCombos
      .map((c) => {
        const cObj = { c, reward: 0, borrowed: 0, count: 0, can: true };
        const reward = getDispatchReward(c, currentDispatch, time);
        const borrowed = c.filter((p) => p.isBorrowed).length;
        const count = c.length;
        if (
          globalBaseline.totalReward >
          currentSum + reward + (remaining - 1) * MAX_DISPATCH_REWARD(time)
        )
          cObj.can = false;
        if (globalBaseline.totalCount <= usedOwn.size + count + remaining - 1)
          cObj.can = false;
        if (globalBaseline.borrowedCount <= borrowedUsed + borrowed)
          cObj.can = false;
        return cObj;
      })
      .filter((c) => c.can)
      .sort((a, b) => {
        if (a.reward !== b.reward) return b.reward - a.reward;
        if (a.borrowed !== b.borrowed) return a.borrowed - b.borrowed;
        return a.count - b.count;
      })
      .map((c) => c.c);

    let best: BestResult = {
      totalReward: -Infinity,
      assignments: {},
      borrowedCount: Infinity,
      totalCount: Infinity,
    };

    const validComboCount = validCombos.length;
    for (let i = 0; i < validComboCount; i++) {
      if (messageProgress) {
        postMessage({
          type: "progress",
          depth: dispatchIndex + 1,
          data: [i, validComboCount],
        });
      }
      const combo = validCombos[i];
      const reward = getDispatchReward(combo, currentDispatch, time);
      const newSum = currentSum + reward;
      const newAssignments = {
        ...currentAssignments,
        [currentDispatch.id]: combo,
      };

      const newUsedOwn = new Set(usedOwn);
      const newUsedBorrowed = new Set(usedBorrowed);
      let additionalBorrowed = 0;
      for (const pet of combo) {
        if (pet.isBorrowed) {
          newUsedBorrowed.add(pet.id);
          additionalBorrowed++;
        } else {
          newUsedOwn.add(pet.id);
        }
      }
      const newBorrowedUsed = borrowedUsed + additionalBorrowed;
      if (newBorrowedUsed > borrowedLimit) continue;

      const result = searchAssignment(
        dispatchIndex + 1,
        newUsedOwn,
        newUsedBorrowed,
        newBorrowedUsed,
        borrowedLimit,
        ownPets,
        borrowedPets,
        dispatchList,
        newSum,
        newAssignments,
        time
      );
      best = betterResult(best, result);
    }
    return best;
  }

  // -------------------- 외부 탐색 함수 (대여펫 제한 별로 순차 탐색) --------------------
  function findOptimalAssignment(
    ownPets: Pet[],
    borrowedPets: Pet[],
    dispatchList: Dispatch[],
    time: number
  ): BestResult {
    TOTAL_MAX = dispatchList.length * MAX_DISPATCH_REWARD(time);
    let overallBest: BestResult = {
      totalReward: -Infinity,
      assignments: {},
      borrowedCount: Infinity,
      totalCount: Infinity,
    };
    // 대여펫 사용 제한을 0, 1, 2, 3마리 순으로 시도
    for (let limit = 0; limit <= overallBorrowLimit; limit++) {
      if (messageProgress) {
        postMessage({
          type: "progress",
          depth: 0,
          data: [limit, overallBorrowLimit],
        });
      }
      const result = searchAssignment(
        0,
        new Set(),
        new Set(),
        0,
        limit,
        ownPets,
        borrowedPets,
        dispatchList,
        0,
        {},
        time
      );
      overallBest = betterResult(overallBest, result);
      // TOTAL_MAX에 도달하면 종료
      if (overallBest.totalReward === TOTAL_MAX) break;
    }
    return overallBest;
  }

  const solve = (prop: DispatchProp) => {
    const ownedPets = [...new Set(prop.ownedPets)]
      .map((id) => {
        const targetPet = pet.p[id];
        return {
          id,
          grade: targetPet.r as PetGrade,
          skills: targetPet.s as Record<SkillType, SkillGrade>,
          isBorrowed: false,
        };
      })
      .sort((a, b) => b.grade - a.grade);
    const borrowablePets = prop.borrowablePets
      .map((id, i) => {
        const targetPet = pet.p[id];
        return {
          id: `${id}-${i}`,
          grade: targetPet.r as PetGrade,
          skills: targetPet.s as Record<SkillType, SkillGrade>,
          isBorrowed: true,
        };
      })
      .sort((a, b) => b.grade - a.grade);
    const dispatchList = prop.dispatchList.map((e) => ({
      id: `e${e.i}`,
      bonusSkills: e.b.map((b) => `${b}` as SkillType),
    }));
    const dispatchTime = prop.dispatchTime;
    const result = findOptimalAssignment(
      ownedPets,
      borrowablePets,
      dispatchList,
      dispatchTime
    );
    const assigns = Object.fromEntries(
      Object.entries(result.assignments).map(([dispatchId, pets]) => {
        const dispatchRank = getDispatchRank(
          pets,
          dispatchList.find((e) => e.id === dispatchId)!
        );
        return [dispatchId, { pets: [...pets], rank: dispatchRank }];
      })
    );
    return { totalReward: result.totalReward, assignments: assigns };
  };
  return solve(prop);
};
export default solveDispatch;
