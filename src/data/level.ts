import level from "./level.json";
export default level as {
  m: number[];
  s: number[];
  a: number[];
  k: Record<"l" | "h", { l: number; m: number; h: number; g: number }[]>;
  c: number[];
};
