import card from "./card.json";
export default card as {
  r: { s: string; b: string }[];
  a: {
    o: number[];
    l: {
      [key: string]: {
        r: number;
        p: number | number[];
        s: number[];
        c: (number | number[] | "p")[];
        a?: {t: string; l: number[]; c: number[][]};
      };
    };
  };
  s: {
    o: number[];
    l: {
      [key: string]: {
        r: number;
        p: number | number[];
        s: number[];
        c: (number | number[] | "p")[];
      };
    };
  };
};
