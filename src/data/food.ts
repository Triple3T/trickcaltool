import food from "./food.json";
export default food as {
  r: { s: string; b: string }[];
  p: number[][];
  f: {
    [key: string]: {
      m?: { [key: string]: number };
      t?: number;
      r: number;
      u?: number;
    };
  };
  c: { [key: string]: { "3": number[]; "1": number[]; "5": number[] } };
};
