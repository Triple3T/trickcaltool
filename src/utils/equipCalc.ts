import equip from "@/data/equip";

const MAX_RANK = 10;
type EquipType = "weapon" | "armor" | "accessory";
type EquipRequirePropType = [Record<string, number>, number];

const mergeObjectReducer = (
  acc: EquipRequirePropType,
  cur: EquipRequirePropType
): EquipRequirePropType => {
  if (!cur) return acc;
  const keys = [
    ...new Set([...Object.keys(acc[0] || {}), ...Object.keys(cur[0] || {})]),
  ];
  const requireItems = Object.fromEntries(
    keys.map((key) => [key, (acc[0][key] || 0) + (cur[0][key] || 0)])
  );
  const requireGold = (acc[1] || 0) + (cur[1] || 0);
  return [requireItems, requireGold];
};

const equipListToRequireResourceList = (list: string[]): EquipRequirePropType => {
  const resourceList: EquipRequirePropType[] = list.map((eq) => {
    const [equipIngredientType, equipType, equipNumber] = eq.split(".");
    if (equipIngredientType === "e") {
      const equipInfo = equip.e[equipType as EquipType]?.[equipNumber];
      if (!equipInfo) return [{}, 0];
      if ("i" in equipInfo) return [equipInfo.i, equipInfo.g];
    }
    return [{ [eq]: 1 }, 0];
  });
  return resourceList.reduce(mergeObjectReducer, [{}, 0]);
};

export const getSpecificRankResourceList = (
  chara: string,
  rank: number
): EquipRequirePropType => {
  if (rank < 1 || rank > MAX_RANK) return [{}, 0];
  const equipList = equip.c[chara][rank - 1];
  return equipListToRequireResourceList(equipList);
};

export const getSpecificRangeResourceList = (
  chara: string,
  from: { rank: number; equip: boolean[] },
  to: { rank: number; equip: boolean[] }
): EquipRequirePropType => {
  if (
    from.rank < 1 ||
    from.rank > MAX_RANK ||
    to.rank < 1 ||
    to.rank > MAX_RANK ||
    from.rank > to.rank
  )
    return [{}, 0];
  if (from.rank === to.rank) {
    if (from.equip.some((v, i) => v && !to.equip[i])) return [{}, 0];
    const sameRankEquipDiffList = equip.c[chara][from.rank - 1].filter(
      (_, i) => !from.equip[i] && to.equip[i]
    );
    return equipListToRequireResourceList(sameRankEquipDiffList);
  }
  const equipListPerRank = equip.c[chara].slice(from.rank - 1, to.rank);
  equipListPerRank[0] = equipListPerRank[0].filter((_, i) => !from.equip[i]);
  equipListPerRank[equipListPerRank.length - 1] = equipListPerRank[
    equipListPerRank.length - 1
  ].filter((_, i) => to.equip[i]);
  const equipList = equipListPerRank.flat();
  return equipListToRequireResourceList(equipList);
};
