import material from "./material.json";
export default material as {
  r: { s: string; b: string }[];
  m: {
    [key: string]: { r: number; m?: { [key: string]: number } };
  };
};
