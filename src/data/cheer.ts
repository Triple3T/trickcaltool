import cheer from "./cheer.json";
import { Aside3EffectCategory, StatType } from "@/types/enums";
export default cheer as {
  o: number[];
  c: Record<
    string,
    {
      firstPrice: number;
      purchaseLimit: number;
      purchaseMult: number;
      stat: StatType[];
      statValue: number[];
      aside3LikeCategory: Aside3EffectCategory[];
      aside3LikeValue: number[];
    }
  >;
};
