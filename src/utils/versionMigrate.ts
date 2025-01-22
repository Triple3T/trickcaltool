import pako from "pako";

interface IFileReadDataFail {
  success: false;
  reason: string;
}
interface IFileReadDataSuccess {
  success: true;
  data: unknown;
  timestamp?: number;
  crayon?: number;
  rank?: number;
  pcrayon?: number;
}
type FileReadDataType = IFileReadDataFail | IFileReadDataSuccess;

export const currentSignature = "3t";
const oldSignatures = ["3l", "0v"];

const b64t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_";
const b64IntoNumber = (b64: string) => {
  return b64
    .split("")
    .map((v) => b64t.indexOf(v))
    .reduce((acc, v) => acc * 64 + v, 0);
};

const fileRead0 = (rdt: string) => {
  const lrmd = rdt.length % 4;
  if (lrmd === 1) {
    return {
      success: false,
      reason: "ui.index.fileSync.incorrectPadding",
    } as IFileReadDataFail;
  }
  const dth = Array(Math.floor(rdt.length / 4))
    .fill(0)
    .map((_, i) => {
      const sdt = rdt
        .substring(i * 4, (i + 1) * 4)
        .split("")
        .map((v) => b64t.indexOf(v).toString(2).padStart(6, "0"))
        .join("");
      return Array(3)
        .fill(0)
        .map((_, j) =>
          String.fromCharCode(
            parseInt(sdt.substring(j * 8, (j + 1) * 8), 2) ^ 3
          )
        )
        .join("");
    })
    .join("");
  const dtt = (() => {
    if (lrmd === 0) return "";
    const sdt = rdt
      .substring(rdt.length - lrmd)
      .split("")
      .map((v) => b64t.indexOf(v).toString(2).padStart(6, "0"))
      .join("");
    return Array(lrmd - 1)
      .fill(0)
      .map((_, j) =>
        String.fromCharCode(parseInt(sdt.substring(j * 8, (j + 1) * 8), 2) ^ 3)
      )
      .join("");
  })();
  const data = JSON.parse(`${dth}${dtt}`);
  return {
    success: true,
    data,
    timestamp: data.timestamp,
  } as IFileReadDataSuccess;
};

const fileRead2 = (fdt: string) => {
  const timeStampB64 = fdt.substring(0, 8);
  const crayonB64 = fdt.substring(8, 12);
  const rankB64 = fdt.substring(12, 16);
  const pcrayonB64 = fdt.substring(16, 20);
  const rdt = fdt.substring(20);
  const lrmd = rdt.length % 4;
  if (lrmd === 1) {
    return {
      success: false,
      reason: "ui.index.fileSync.incorrectPadding",
    } as IFileReadDataFail;
  }
  const dth = Array(Math.floor(rdt.length / 4))
    .fill(0)
    .map((_, i) => {
      const sdt = rdt
        .substring(i * 4, (i + 1) * 4)
        .split("")
        .map((v) => b64t.indexOf(v).toString(2).padStart(6, "0"))
        .join("");
      return Array(3)
        .fill(0)
        .map((_, j) => parseInt(sdt.substring(j * 8, (j + 1) * 8), 2) ^ 3);
    })
    .flat();
  const dtt = (() => {
    if (lrmd === 0) return [];
    const sdt = rdt
      .substring(rdt.length - lrmd)
      .split("")
      .map((v) => b64t.indexOf(v).toString(2).padStart(6, "0"))
      .join("");
    return Array(lrmd - 1)
      .fill(0)
      .map((_, j) => parseInt(sdt.substring(j * 8, (j + 1) * 8), 2) ^ 3);
  })();
  const compressedBuffer = new Uint8Array([...dth, ...dtt]);
  const data = JSON.parse(pako.inflate(compressedBuffer, { to: "string" }));
  return {
    success: true,
    data,
    timestamp: b64IntoNumber(timeStampB64),
    crayon: b64IntoNumber(crayonB64),
    rank: b64IntoNumber(rankB64),
    pcrayon: b64IntoNumber(pcrayonB64),
  } as IFileReadDataSuccess;
};

const fileRead = (fdt: string, sig: string): FileReadDataType => {
  if (sig === oldSignatures[0]) return fileRead0(fdt);
  else if (sig === oldSignatures[1]) return fileRead0(fdt);
  else if (sig === currentSignature) return fileRead2(fdt);
  else {
    return {
      success: false,
      reason: "ui.index.fileSync.notProperSignature",
    };
  }
};

/**
 * Read file content and convert it to current version if needed.
 * @param fdt File data. put substring(2).
 * @param sig File signature. put substring(0, 2).
 * @returns Read result with converted data.
 */
const sigConvert = (fdt: string, sig: string): FileReadDataType => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dataProto: any = undefined;
  const fileDataResult = sig
    ? fileRead(fdt, sig)
    : { success: true as const, data: {} };
  if (!fileDataResult.success) return fileDataResult;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fileData: any = fileDataResult.data;
  switch (sig) {
    case "":
    case oldSignatures[0]:
      dataProto = {
        board: {
          b: fileData.b ?? {},
          c: fileData.c || 0,
          v: [0, 2, 3, 4, 5, 6, 7, 9],
        },
        pboard: { p: {}, d: [] },
        nthboard: { n: {} },
        eqrank: {
          r: {},
          s: [0, 0, 0],
          v: [],
          f: [[0, 0, 0]],
        },
        unowned: {
          o: Object.keys(fileData.b ?? {}),
          u: fileData.u ?? [],
        },
        lab: { 1: 0, 2: 0 },
        myhome: {
          l: [0, 0],
          r: [0, 0],
          m: [0, 0],
          s: [0, 0],
          a: [0, 0],
        },
        collection: { c: [] },
        timestamp: 0,
      };
    // falls through
    case oldSignatures[1]:
      dataProto = dataProto ?? fileData;
      dataProto = {
        board: {
          b: dataProto.unowned.o.map((c: string) => dataProto.board.b[c]),
          c:
            typeof dataProto.board.c === "number"
              ? [dataProto.board.c]
              : dataProto.board.c || [0],
          v: dataProto.board.v,
          i: 0,
        },
        pboard: {
          p: dataProto.unowned.o.map((c: string) => dataProto.pboard.p[c]),
          d: dataProto.pboard.d,
        },
        nthboard: {
          n: dataProto.unowned.o.map((c: string) => dataProto.nthboard.n[c]),
        },
        eqrank: {
          r: dataProto.unowned.o.map((c: string) => dataProto.eqrank.r[c] ?? 1),
          s: dataProto.eqrank.s,
          v: dataProto.eqrank.v,
          f: dataProto.eqrank.f,
        },
        unowned: dataProto.unowned,
        lab: dataProto.lab,
        myhome: dataProto.myhome,
        collection: dataProto.collection,
        skin: {},
        memo: { o: [], u: [] },
      };
      // fix board data
      if (dataProto.board.b.Shoupan) {
        dataProto.board.b.Shoupan[2] = [
          (dataProto.board.b.Shoupan[2][0] & 1 && 1) +
            (dataProto.board.b.Shoupan[2][0] & 8 && 2),
          (dataProto.board.b.Shoupan[2][0] & 2 && 1) +
            (dataProto.board.b.Shoupan[2][0] & 4 && 2),
        ];
      }
      if (dataProto.board.b.Elena) {
        dataProto.board.b.Elena[3][0] =
          (dataProto.board.b.Elena[3][0] & 3) +
          (dataProto.board.b.Elena[3][0] & 4) * 2 +
          (dataProto.board.b.Elena[3][0] & 8) / 2;
      }
    // falls through
    case currentSignature:
      dataProto = dataProto ?? fileData;
      return { ...fileDataResult, data: dataProto };
    default:
      return {
        success: false,
        reason: "ui.index.fileSync.notProperSignature",
      };
  }
};
export default sigConvert;
