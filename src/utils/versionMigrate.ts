import { UserDataBoard, UserDataCollection, UserDataEqRank, UserDataLab, UserDataMyHome, UserDataNthBoard, UserDataPurpleBoard, UserDataUnowned } from "@/types/types";

export const currentSignature = "0v";
export const oldSignatures = ["3l"];
const sigConvert = (fdt: string, sig: string) => {
  if (sig === currentSignature) return JSON.parse(fdt);
  if (sig === oldSignatures[0]) {
    const d = JSON.parse(fdt);
    const board: UserDataBoard = { b: d.b ?? {}, c: d.c || 0, v: [0, 2, 3, 4, 5, 6, 7, 9] };
    const pboard: UserDataPurpleBoard = { p: {}, d: [] };
    const nthboard: UserDataNthBoard = { n: {} };
    const eqrank: UserDataEqRank = { r: {}, s: [0, 0, 0], v: [], f: [[0, 0, 0]] };
    const unowned: UserDataUnowned = { o: Object.keys(d.b ?? {}), u: d.u ?? [] };
    const lab: UserDataLab = { 1: 0, 2: 0 };
    const myhome: UserDataMyHome = { l: [0, 0], r: [0, 0], m: [0, 0], s: [0, 0], a: [0, 0] };
    const collection: UserDataCollection = { c: [] };
    return { board, pboard, nthboard, eqrank, unowned, lab, myhome, collection };
  }
};
export default sigConvert;
