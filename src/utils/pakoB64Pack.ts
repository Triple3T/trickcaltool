import pako from "pako";

const b64t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_";

export const numberIntoB64 = (num: number, length: number) => {
  return Array(length)
    .fill(0)
    .map((_, i) => {
      return b64t.charAt(
        Math.floor(num / Math.pow(2, (length - i - 1) * 6)) & 0x3f
      );
    })
    .join("");
};
export const b64IntoNumber = (b64: string) => {
  return b64
    .split("")
    .map((v) => b64t.indexOf(v))
    .reduce((acc, v) => acc * 64 + v, 0);
};

export const compressXorB64 = (str: string): string => {
  const compressed = pako.deflate(str).map((v) => v ^ 3);
  const compressedInB64 = Array(Math.ceil(compressed.length / 3))
    .fill(0)
    .map((_, i) => {
      const sdt = [...compressed.slice(i * 3, (i + 1) * 3)]
        .map((v) => v.toString(2).padStart(8, "0"))
        .join("");
      switch (sdt.length) {
        case 8:
          return Array(2)
            .fill(0)
            .map((_, j) => {
              return b64t.charAt(
                parseInt(`${sdt}0000`.substring(j * 6, (j + 1) * 6), 2)
              );
            })
            .join("");
        case 16:
          return Array(3)
            .fill(0)
            .map((_, j) => {
              return b64t.charAt(
                parseInt(`${sdt}00`.substring(j * 6, (j + 1) * 6), 2)
              );
            })
            .join("");
        case 24:
        default:
          return Array(4)
            .fill(0)
            .map((_, j) => {
              return b64t.charAt(
                parseInt(sdt.substring(j * 6, (j + 1) * 6), 2)
              );
            })
            .join("");
      }
    })
    .join("");
  return compressedInB64;
};
export const decompressXorB64 = (rdt: string) => {
  const lrmd = rdt.length % 4;
  if (lrmd === 1) {
    throw new Error("ui.index.fileSync.incorrectPadding");
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
  const decompressedString = pako.inflate(compressedBuffer, { to: "string" });
  return decompressedString;
};
