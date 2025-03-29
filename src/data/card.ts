import card from "./card.json";
export interface ICardProperty {
  r: number;
  p: number | number[];
  s: number[];
  c: (number | number[] | "p")[];
  l: number;
}
export type ISpellData = ICardProperty;
export interface IArtifactData extends ICardProperty {
  a?: { t: string; l: number[]; c: number[][] };
}
export interface CardTypeAllData<T extends ISpellData> {
  o: number[];
  l: {
    [key: string]: T;
  };
}
export default card as {
  r: { s: string; b: string }[];
  a: CardTypeAllData<IArtifactData>;
  s: CardTypeAllData<ISpellData>;
};
