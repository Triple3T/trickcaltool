import pet from "./pet.json";
export default pet as {
  r: { s: string; b: string }[];
  s: { r: number[]; s: number[]; b: number[] };
  d: { t: number[]; c: number[][][]; g: number[][] };
  a: { i: number; b: number[] }[];
  n: number;
  p: { [key: string]: { r: number; s: { [key: string]: number }; n: number; } };
};
