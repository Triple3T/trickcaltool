import skillcoefficient from "./skillcoefficient.json";
type CoefficientType = number | number[] | string;
export default skillcoefficient as {
  c: {
    [key: string]: {
      s: {
        l: CoefficientType[];
        h: CoefficientType[];
        p: CoefficientType[];
        n: CoefficientType[];
        a?: CoefficientType[];
      };
      c: {
        h: number;
        p: number;
      };
      a?: {
        1: CoefficientType[];
        2: CoefficientType[];
        3: CoefficientType[];
      };
      k: {
        l: number[];
        h: number[];
        n: number[];
        a?: number[];
        1: number[];
        2: number[];
        3: number[];
      }
    }
  };
};
