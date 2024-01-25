import eqrank from "./eqrank.json";
export default eqrank as {
  q: number[];
  s: number[][];
  r: number[][][];
  c: {
    [key: string]:  { r: number };
  };
};
