export interface UserDataBoard {
  b: { [key: string]: number[][] }; // 보드 차수별 데이터 (bitmask)
  c: number; // subClassification
}
export interface UserDataUnowned {
  o: string[]; // 보유 캐릭터 목록
  u: string[]; // 미보유 캐릭터 목록
}
export type UserDataVersion = string;
