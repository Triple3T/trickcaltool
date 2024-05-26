import userdata from "@/utils/userdata";
import sigConvert, {
  currentSignature,
  oldSignatures,
} from "@/utils/versionMigrate";

interface ExportTextFileProps {
  fileName?: string;
  data: string;
}
export const exportTextFile = ({ fileName, data }: ExportTextFileProps) => {
  const element = document.createElement("a");
  const file = new Blob([data], {
    type: "text/plain",
  });
  element.href = URL.createObjectURL(file);
  element.download = fileName || "file.txt";
  document.body.appendChild(element);
  element.click();
};
const b64t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_";

export const dataFileExport = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {autoRepaired: ar01, ...bdtp} = userdata.board.load();
  const {autoRepaired: ar02, ...pdtp} = userdata.pboard.load();
  const {autoRepaired: ar03, ...ndtp} = userdata.nthboard.load();
  const {autoRepaired: ar04, ...rdtp} = userdata.eqrank.load();
  const {autoRepaired: ar05, ...udtp} = userdata.unowned.load();
  const {autoRepaired: ar06, ...ldtp} = userdata.lab.load();
  const {autoRepaired: ar07, ...mdtp} = userdata.myhome.load();
  const {autoRepaired: ar08, ...cdtp} = userdata.collection.load();
  /* eslint-enable @typescript-eslint/no-unused-vars */
  if (!(bdtp && pdtp && ndtp && rdtp && udtp && ldtp && mdtp && cdtp)) {
    console.error("No user data found");
    throw Error();
  }
  const rdt = JSON.stringify({
    board: bdtp,
    pboard: pdtp,
    nthboard: ndtp,
    eqrank: rdtp,
    unowned: udtp,
    lab: ldtp,
    myhome: mdtp,
    collection: cdtp,
  });
  // input: 3 * 8(UTF-8), output: 4 * 6(A-Za-z0-9+/).
  const bdt = rdt.split("").map((c) => c.charCodeAt(0));
  const b64grplen = Math.ceil(bdt.length / 3);
  const b64d = Array.from(Array(b64grplen).keys())
    .map((i) => {
      const sdt = bdt
        .slice(i * 3, (i + 1) * 3)
        .map((v) => (v ^ 3).toString(2).padStart(8, "0"))
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
  return `${currentSignature}${b64d}`;
};
export const dataFileWrite = () => {
  const data = dataFileExport();
  exportTextFile({
    fileName: `trickcalboard-backup-${Date.now()}.txt`,
    data,
  });
};

interface DataReadSuccess {
  success: true;
}
interface DataReadFailed {
  success: false;
  reason: string;
}
type DataReadResult = DataReadSuccess | DataReadFailed;
export const dataFileImport = (data: string): DataReadResult => {
  const startSignature = data.substring(0, 2);
  if (
    !data.startsWith(currentSignature) &&
    !oldSignatures.includes(startSignature)
  ) {
    return {
      success: false,
      reason: "ui.index.fileSync.notProperSignature",
    };
  } else {
    const rdt = data.substring(2);
    const lrmd = rdt.length % 4;
    if (lrmd === 1) {
      return {
        success: false,
        reason: "ui.index.fileSync.incorrectPadding",
      };
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
          String.fromCharCode(
            parseInt(sdt.substring(j * 8, (j + 1) * 8), 2) ^ 3
          )
        )
        .join("");
    })();
    const fdt = sigConvert(`${dth}${dtt}`, startSignature);
    userdata.board.save(fdt.board);
    userdata.pboard.save(fdt.pboard);
    userdata.nthboard.save(fdt.nthboard);
    userdata.eqrank.save(fdt.eqrank);
    userdata.unowned.save(fdt.unowned);
    userdata.lab.save(fdt.lab);
    userdata.myhome.save(fdt.myhome);
    userdata.collection.save(fdt.collection);
    return { success: true };
  }
};
export const dataFileRead = async (
  files: FileList | null
): Promise<DataReadResult> => {
  try {
    if (files && files.length > 0) {
      const file = files[0];
      const dProto = await file.text();
      return dataFileImport(dProto);
    } else {
      return { success: false, reason: "ui.index.fileSync.noFileProvided" };
    }
  } catch (e) {
    return { success: false, reason: "ui.index.fileSync.invalidFileInput" };
  }
};
