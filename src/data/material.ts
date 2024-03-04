import material from "./material.json";
export default material as {
  r: { s: string; b: string }[];
  m: {
    [key: string]: { r: number; g?: true; m?: { [key: string]: number } };
  };
};
