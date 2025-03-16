import { BoardType, StatType } from "./enums";

export interface UserDataDialogEnable {
  board: boolean;
  eqrank: boolean;
}

export interface UserDataBoardMemory {
  b: { [key: string]: number[][] }; // 보드 차수별 데이터 (bitmask)
  c: number[]; // subClassification
  v: BoardType[]; // 보일 보드 종류
  i: number; // 보드 인덱스
}
export interface UserDataPurpleBoardMemory {
  p: { [key: string]: number[][] }; // 보드 차수별 데이터 (bitmask)
  d: number[]; // 조회 세팅
}
export interface UserDataNthBoardMemory {
  n: { [key: string]: number }; // 보드 개방 수준
}
export interface UserDataEqRankMemory {
  r: { [key: string]: number }; // 랭크 데이터
  s: number[]; // 최소 랭크, 최대 랭크
  v: StatType[]; // 보일 스탯 종류
  f: number[][]; // 정렬 및 필터 (sort: 0, sortby, ascordesc; filter: 1, filterby, bitmask)
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

// new types

export interface UserDataBoardFile {
  b: number[][][]; // 보드 차수별 데이터 (bitmask), 순서는 owned.o를 따름
  c: number[]; // subClassification
  v: BoardType[]; // 보일 보드 종류
  i: number; // 보드 인덱스
}
export interface UserDataPurpleBoardFile {
  p: number[][][]; // 보드 차수별 데이터 (bitmask), 순서는 owned.o를 따름
  d: number[]; // 조회 세팅
}
export interface UserDataNthBoardFile {
  n: number[]; // 보드 개방 수준, 순서는 owned.o를 따름
}
export interface UserDataEqRankFile {
  r: number[]; // 랭크 데이터, 순서는 owned.o를 따름
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
export interface UserDataMemoMemory {
  [key: string]: [number, string]; // 즐겨찾기(1이 on), 메모 데이터
}
export interface UserDataMemoFile {
  o: [number, string][]; // 즐겨찾기(1이 on), 메모 데이터
  u: [number, string][]; // 즐겨찾기(1이 on), 메모 데이터
}
export interface UserDataDispatchablePets {
  o: string[];
  b: Record<string, number>;
}
export interface UserDataFileOld {
  board: UserDataBoardMemory;
  pboard: UserDataPurpleBoardMemory;
  nthboard: UserDataNthBoardMemory;
  eqrank: UserDataEqRankMemory;
  unowned: UserDataUnowned;
  lab: UserDataLab;
  myhome: UserDataMyHome;
  collection: UserDataCollection;
  timestamp: number;
  version: UserDataVersion;
}
export interface UserDataFile {
  board: UserDataBoardFile;
  pboard: UserDataPurpleBoardFile;
  nthboard: UserDataNthBoardFile;
  eqrank: UserDataEqRankFile;
  unowned: UserDataUnowned;
  lab: UserDataLab;
  myhome: UserDataMyHome;
  collection: UserDataCollection;
  skin: UserDataSkin;
  memo: UserDataMemoFile;
  dispatchablePets: UserDataDispatchablePets;
}
export interface UserDataOwnedCharaInfo {
  board: number[][]; // 보드 차수별 데이터 (bitmask)
  pboard: number[][]; // 보드 차수별 데이터 (bitmask)
  nthboard: number; // 보드 개방 수준
  eqrank: number; // 랭크 데이터
  skin?: number; // 스킨 적용 데이터
  unowned: false; // 보유 여부
  memo: [number, string]; // 즐겨찾기(1이 on), 메모 데이터
}
export interface UserDataUnownedCharaInfo {
  skin?: number; // 스킨 적용 데이터
  unowned: true; // 보유 여부
  memo: [number, string]; // 즐겨찾기(1이 on), 메모 데이터
}
export type UserDataCharaInfo = UserDataOwnedCharaInfo | UserDataUnownedCharaInfo;
export interface UserDataMemory {
  board: Omit<UserDataBoardMemory,'b'>;
  pboard: Omit<UserDataPurpleBoardMemory,'p'>;
  // nthboard: Omit<UserDataNthBoardMemory,'n'>;
  eqrank: Omit<UserDataEqRankMemory,'r'>;
  unowned: UserDataUnowned;
  lab: UserDataLab;
  myhome: UserDataMyHome;
  collection: UserDataCollection;
  // skin: UserDataSkin;
  // memo: UserDataMemoMemory;
  charaInfo: { [key: string]: UserDataCharaInfo };
  dispatchablePets: UserDataDispatchablePets;
  dirty: number;
  timestamp: number;
}
