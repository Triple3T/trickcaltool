import { BoardType, StatType } from "./enums";

export interface UserDataDialogEnable {
  board: boolean;
  eqrank: boolean;
}

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
  f: number[][]; // 정렬 및 필터 (sort: 0, sortby, ascordesc; filter: 1, filterby, bitmask)
}
export interface UserDataUnowned {
  o: string[]; // 보유 캐릭터 목록
  u: string[]; // 미보유 캐릭터 목록
}
export interface UserDataLab {
  1: number;
  2: number;
}
export interface UserDataMyHome {
  l: number[]; // 생산 랩 현재 레벨, 목표 레벨
  r: number[]; // 연회장 현재 레벨, 목표 레벨
  m: number[]; // 본부 현재 레벨, 목표 레벨
  s: number[]; // 모험회 현재 레벨, 목표 레벨
  a: number[]; // 기록소 현재 레벨, 목표 레벨
}
export interface UserDataCollection {
  c: string[]; // 제작한 수집품 목록
}
export interface UserDataEventCalc {
  a: boolean[]; // allCleared
  b: number[]; // customBonus
  c: boolean; // dailyCompleted
  d: number; // dayCount
  h: number; // possibleChallenge
  r: number; // remainItem
  e: string; // selectedThemeEvent
  s: number[]; // shopPurchaseCounts
  u: boolean[]; // useCustom
  t: number; // timestamp
}
export interface UserDataSkin {
  [key: string]: number; // 스킨 적용 데이터
}
export type UserDataVersion = string;
