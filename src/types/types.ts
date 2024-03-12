import { BoardType, StatType } from "./enums";

export interface UserDataBoard {
  b: { [key: string]: number[][] }; // 보드 차수별 데이터 (bitmask)
  c: number; // subClassification
  v: BoardType[]; // 보일 보드 종류
}
export interface UserDataPurpleBoard {
  p: { [key: string]: number[][] }; // 보드 차수별 데이터 (bitmask)
  d: number[]; // 조회 세팅
}
export interface UserDataNthBoard {
  n: { [key: string]: number }; // 보드 개방 수준
}
export interface UserDataEqRank {
  r: { [key: string]: number }; // 랭크 데이터
  s: number[]; // 최소 랭크, 최대 랭크
  v: StatType[]; // 보일 스탯 종류
}
export interface UserDataUnowned {
  o: string[]; // 보유 캐릭터 목록
  u: string[]; // 미보유 캐릭터 목록
}
export interface UserDataLab {
  1: number;
  2: number;
}
export type UserDataVersion = string;
