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
      }
    }
  };
};
