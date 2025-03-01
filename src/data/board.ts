import board from "./board.json";
export default board as {
  b: number[][][];
  s: number[][];
  c: {
    [key: string]: { s: number; b: number[][]; r: string[][]; k: string[][] };
  };
};
