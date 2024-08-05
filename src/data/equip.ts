import equip from "./equip.json";
interface EquipTypeRecord<T> {
  weapon: T;
  armor: T;
  accessory: T;
}
interface LowTierEquipProp {
  s: Record<string, number>;
}
interface HighTierEquipProp extends LowTierEquipProp {
  i: Record<string, number>;
  g: number;
}
export default equip as {
  v: {
    enhancePoint: number[];
    enhanceEquip: number[];
    enhanceRequire: number[][];
    enhanceRate: number[][];
    enhanceCost: number[];
    partsRequire: number[];
  };
  e: EquipTypeRecord<Record<string, LowTierEquipProp | HighTierEquipProp | null>>;
  p: EquipTypeRecord<string[]>;
  r: EquipTypeRecord<string[]>;
  d: Record<string, string[][]>;
  c: Record<string, string[][]>;
};
