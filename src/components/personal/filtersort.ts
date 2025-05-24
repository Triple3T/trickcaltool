import { Personality, Attack, Position, Class, Race } from "@/types/enums";
export enum ListableProperty {
  Personality = 0,
  InitialStar = 1,
  AttackType = 2,
  Position = 3,
  Class = 4,
  Race = 5,
}
export enum FilterProperty {
  Personality = 0,
  InitialStar = 1,
  AttackType = 2,
  Position = 3,
  Class = 4,
  Race = 5,
  Keyword = 6,
  Aside = 7,
  Aside3Effect = 8,
  Aside3Stat = 9,
}
export enum SortProperty {
  Name = -1,
  Personality = 0,
  InitialStar = 1,
  AttackType = 2,
  Position = 3,
  Class = 4,
  Race = 5,
}
export const sortArray: { [key: string]: number[] } = {
  [SortProperty.Personality]: [
    Personality.Naive,
    Personality.Cool,
    Personality.Mad,
    Personality.Jolly,
    Personality.Gloomy,
  ],
  [SortProperty.InitialStar]: [3, 2, 1],
  [SortProperty.AttackType]: [Attack.Physic, Attack.Magic],
  [SortProperty.Position]: [
    Position.Free,
    Position.Front,
    Position.Middle,
    Position.Back,
  ],
  [SortProperty.Class]: [Class.Class_0002, Class.Class_0001, Class.Class_0003],
  [SortProperty.Race]: [
    Race.Fairy,
    Race.Furry,
    Race.Elf,
    Race.Spirit,
    Race.Ghost,
    Race.Dragon,
    Race.Witch,
  ],
};
export const FILTER_COUNT = Object.values(FilterProperty).filter(
  (v) => typeof v === "number"
).length;
export const KEYWORD_COUNT = 33;
export const ASIDE3EFFECT_COUNT = 20;
