export interface UserDataBoard {
  b: { [key: string]: number[][] }; // 보드 차수별 데이터 (bitmask)
  c: number; // subClassification
}
export interface UserDataEqRank {
  r: { [key: string]: number }; // 랭크 데이터
  s: number[]; // 최소 랭크, 최대 랭크, 목표 스탯
}
export interface UserDataUnowned {
  o: string[]; // 보유 캐릭터 목록
  u: string[]; // 미보유 캐릭터 목록
}
export type UserDataVersion = string;
