import soloraidstat from "./soloraidstat.json";
interface StatType {
  p: number;
  m: number;
  c: number;
  r: number;
  h: number;
  l: number; // 10000x
}
export default soloraidstat as {
  s: { [key: string]: Record<string, StatType> };
};
