import purpleboard from "./purpleboard.json";
export default purpleboard as {
  b: number[][][];
  s: number[][];
  c: {
    [key: string]: { b: number[]; p: string[] };
  };
};
