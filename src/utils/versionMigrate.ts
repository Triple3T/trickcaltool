export const currentSignature = "0v";
export const oldSignatures = ["3l"];
const sigConvert = (fdt: string, sig: string) => {
  if (sig === currentSignature) return JSON.parse(fdt);
  if (sig === oldSignatures[0]) {
    const d = JSON.parse(fdt);
    const board = { b: d.b ?? {}, c: d.c || 0 };
    const pboard = { p: {}, d: [] };
    const nthboard = { n: {} };
    const eqrank = { r: {}, s: [0, 0, 0] };
    const unowned = { o: Object.keys(d.b ?? {}), u: d.u ?? [] };
    const lab = { 1: 0, 2: 0 };
    return { board, pboard, nthboard, eqrank, unowned, lab };
  }
};
export default sigConvert;
