import soloraidstat from "./soloraidstat.json";
interface StatType {
  s: number; //stage
  b: string; //boss
  p: number;
  m: number;
  c: number;
  r: number;
  h: number;
  l: number; // 10000x
}
export default soloraidstat as {
  s: { [key: string]: StatType[] };
};
