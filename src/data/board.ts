import board from "./board.json";
export default board as {
  b: number[][];
  c: {
    [key: string]: { b: number[][] };
  };
};
