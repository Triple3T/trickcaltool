import { Aside3EffectCategory } from "@/types/enums";
import skillcoefficient from "./skillcoefficient.json";
type CoefficientType = number | number[] | string;
type FixedCoefficientType = number;
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
        1: FixedCoefficientType[];
        2: CoefficientType[];
        3: FixedCoefficientType[];
        e3: Aside3EffectCategory[];
        s3: number[][];
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
