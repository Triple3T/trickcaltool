import sigConvert, { currentSignature } from "@/utils/versionMigrate";
import userdataOld from "@/utils/userdataOld";
import { UserDataFile, UserDataMemory } from "@/types/types";
import {
  openNoteDataDB,
  loadData as idbLoadData,
  loadTimestamp as idbLoadTimestamp,
  saveData as idbSaveData,
} from "@/utils/idbRW";
import {
  loadData as lsLoadData,
  loadTimestamp as lsLoadTimestamp,
  saveData as lsSaveData,
} from "@/utils/localStorageRW";
import chara from "@/data/chara";
import board from "@/data/board";
import pboard from "@/data/purpleboard";
import int1BitCount from "./int1bitCount";
import { compressXorB64, numberIntoB64 } from "./pakoB64Pack";

const MAX_RANK = 11;

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

export const dataFileExport = async (fromIDB: boolean) => {
  const loadData = fromIDB ? idbLoadData : lsLoadData;
  if (fromIDB) await openNoteDataDB();
  const loaded = await loadData();
  if (loaded.timestamp && loaded.data) {
    return loaded;
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
  const reloaded = await loadData();
  if (reloaded.timestamp && reloaded.data) {
    return reloaded;
  }
  throw new Error("Data read failed");
};
export const dataFileWrite = () => {
  let isIDBAvailable = localStorage.getItem("idbAvailable");
  if (isIDBAvailable === null) {
    try {
      openNoteDataDB();
      isIDBAvailable = "true";
    } catch (e) {
      isIDBAvailable = "false";
    }
  }
  dataFileExport(isIDBAvailable === "true").then(({ timestamp, data }) => {
    if (!data) return;
    exportTextFile({
      fileName: `trickcalboard-backup-${timestamp}.txt`,
      data,
    });
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
export const dataFileImport = async (
  data: string,
  setNow: boolean = false
): Promise<DataReadResult> => {
  let isIDBAvailable = localStorage.getItem("idbAvailable");
  if (isIDBAvailable === null) {
    try {
      openNoteDataDB();
      isIDBAvailable = "true";
    } catch (e) {
      isIDBAvailable = "false";
    }
  }
  const saveData = isIDBAvailable === "true" ? idbSaveData : lsSaveData;
  const startSignature = data.substring(0, 2);
  const fileData = data.substring(2);
  const readResult = sigConvert(fileData, startSignature);
  if (readResult.success) {
    const dataFile = readResult.data as UserDataFile;
    const crayonStatistic = dataFile.board.b
      .map((b) => {
        return b
          .map((nthboard, i) => {
            const checkedCount = nthboard
              .map((v) => int1BitCount(v))
              .reduce((a, b) => a + b, 0);
            return [2, 4, 6][i] * checkedCount;
          })
          .reduce((a, b) => a + b, 0);
      })
      .reduce((a, b) => a + b, 0);
    const purpleCrayonStatistic = dataFile.pboard.p
      .map((b) => {
        if (!b) return 0;
        return b
          .map((nthboard, i) => {
            const checkedCount = nthboard
              .map((v) => int1BitCount(v))
              .reduce((a, b) => a + b, 0);
            return [3, 6, 9][i] * checkedCount;
          })
          .reduce((a, b) => a + b, 0);
      })
      .reduce((a, b) => a + b, 0);
    const totalRankStatistic = dataFile.eqrank.r.reduce(
      (acc, rank) => acc + rank,
      0
    );
    const timestamp = setNow ? Date.now() : readResult.timestamp ?? Date.now();
    const timestampInB64 = numberIntoB64(Number(timestamp), 8);
    const crayonStatisticInB64 = numberIntoB64(crayonStatistic, 4);
    const purpleCrayonStatisticInB64 = numberIntoB64(purpleCrayonStatistic, 4);
    const totalRankStatisticInB64 = numberIntoB64(totalRankStatistic, 4);
    const compressedInB64 = compressXorB64(JSON.stringify(dataFile));
    await saveData({
      timestamp,
      data: `${currentSignature}${timestampInB64}${crayonStatisticInB64}${totalRankStatisticInB64}${purpleCrayonStatisticInB64}${compressedInB64}`,
    });
    return { success: true };
  } else {
    return readResult;
  }
};
export const dataFileRead = async (
  files: FileList | null
): Promise<DataReadResult> => {
  try {
    if (files && files.length > 0) {
      const file = files[0];
      const dProto = await file.text();
      return dataFileImport(dProto, true);
    } else {
      return { success: false, reason: "ui.index.fileSync.noFileProvided" };
    }
  } catch (e) {
    return { success: false, reason: "ui.index.fileSync.invalidFileInput" };
  }
};

export const migrateIntoIdbFile = async () => {
  const timestamp = localStorage.getItem("timestamp") || "0";
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { autoRepaired: ar01, ...bdtp } = userdataOld.board.load();
  const { autoRepaired: ar02, ...pdtp } = userdataOld.pboard.load();
  const { autoRepaired: ar03, ...ndtp } = userdataOld.nthboard.load();
  const { autoRepaired: ar04, ...rdtp } = userdataOld.eqrank.load();
  const { autoRepaired: ar05, ...udtp } = userdataOld.unowned.load();
  const { autoRepaired: ar06, ...ldtp } = userdataOld.lab.load();
  const { autoRepaired: ar07, ...mdtp } = userdataOld.myhome.load();
  const { autoRepaired: ar08, ...cdtp } = userdataOld.collection.load();
  const { autoRepaired: ar09, ...sdtp } = userdataOld.skin.load();
  /* eslint-enable @typescript-eslint/no-unused-vars */
  if (!(bdtp && pdtp && ndtp && rdtp && udtp && ldtp && mdtp && cdtp && sdtp)) {
    console.error("No user data found");
    throw Error("No user data found");
  }
  const userData = {
    board: { b: [] as number[][][], c: bdtp.c, v: bdtp.v, i: 1 },
    pboard: { p: [] as number[][][], d: pdtp.d },
    nthboard: { n: [] as number[] },
    eqrank: { r: [] as number[], s: [1, MAX_RANK], v: rdtp.v, f: rdtp.f },
    unowned: udtp,
    lab: ldtp,
    myhome: mdtp,
    collection: cdtp,
    skin: sdtp,
    memo: { o: [], u: [] },
    boardFindOption: {
      x: [1, 1],
      n: [0, 1],
      b: Object.fromEntries([0, 2, 3, 4, 5, 6, 7, 9].map((v) => [v, 0])),
      m: 1,
    },
    dispatchablePets: { o: [], b: {} },
  } as UserDataFile;
  const fullCharaNames = Object.keys(chara);
  if (
    Object.keys(bdtp.b).includes("Shoupan") &&
    bdtp.b.Shoupan[1] &&
    bdtp.b.Shoupan[1].length === 1
  ) {
    bdtp.b.Shoupan[1] = [
      ((bdtp.b.Shoupan[1][0] ?? 0) & 1 && 1) +
        ((bdtp.b.Shoupan[1][0] ?? 0) & 8 && 2),
      ((bdtp.b.Shoupan[1][0] ?? 0) & 2 && 1) +
        ((bdtp.b.Shoupan[1][0] ?? 0) & 4 && 2),
    ];
  }
  if (Object.keys(bdtp.b).includes("Elena") && bdtp.b.Elena[2]) {
    bdtp.b.Elena[2][0] =
      (bdtp.b.Elena[2][0] & 3) +
      (bdtp.b.Elena[2][0] & 4) * 2 +
      (bdtp.b.Elena[2][0] & 8) / 2;
  }
  const ownedCharas = [
    ...new Set([
      ...(udtp?.o ?? []),
      ...(Object.keys(bdtp.b) ?? []),
      ...(Object.keys(pdtp.p) ?? []),
      ...(Object.keys(ndtp.n) ?? []),
      ...(Object.keys(rdtp.r) ?? []),
    ]),
  ];
  ownedCharas.forEach((charaName) => {
    userData.board.b.push(
      bdtp.b[charaName] ?? board.c[charaName].b.map((a) => a.map(() => 0))
    );
    userData.pboard.p.push(
      pdtp.p[charaName] ??
        pboard.c[charaName].b.map((a) => Array(a.toString(10).length).fill(0))
    );
    userData.nthboard.n.push(ndtp.n[charaName] || 1);
    userData.eqrank.r.push(
      Math.min(MAX_RANK, Math.max(Number(rdtp.r[charaName]) || 1, 1))
    );
    userData.memo.o.push([0, ""]);
    fullCharaNames.splice(fullCharaNames.indexOf(charaName), 1);
  });
  userData.unowned.u = fullCharaNames;
  userData.memo.u = fullCharaNames.map(() => [0, ""]);
  const crayonStatistic = Object.values(bdtp.b)
    .map((b) => {
      return b
        .map((nthboard, i) => {
          const checkedCount = nthboard
            .map((v) => int1BitCount(v))
            .reduce((a, b) => a + b, 0);
          return [2, 4, 6][i] * checkedCount;
        })
        .reduce((a, b) => a + b, 0);
    })
    .reduce((a, b) => a + b, 0);
  const purpleCrayonStatistic = Object.values(pdtp.p)
    .map((b) => {
      return b
        .map((nthboard, i) => {
          const checkedCount = nthboard
            .map((v) => int1BitCount(v))
            .reduce((a, b) => a + b, 0);
          return [3, 6, 9][i] * checkedCount;
        })
        .reduce((a, b) => a + b, 0);
    })
    .reduce((a, b) => a + b, 0);
  const totalRankStatistic = Object.values(rdtp.r).reduce(
    (acc, rank) => acc + rank,
    0
  );
  const timestampInB64 = numberIntoB64(Number(timestamp), 8);
  const crayonStatisticInB64 = numberIntoB64(crayonStatistic, 4);
  const purpleCrayonStatisticInB64 = numberIntoB64(purpleCrayonStatistic, 4);
  const totalRankStatisticInB64 = numberIntoB64(totalRankStatistic, 4);
  const compressedInB64 = compressXorB64(JSON.stringify(userData));
  const data = `${currentSignature}${timestampInB64}${crayonStatisticInB64}${totalRankStatisticInB64}${purpleCrayonStatisticInB64}${compressedInB64}`;
  return data;
};

export const readIntoMemory = async (
  isIDBAvailable: boolean
): Promise<UserDataMemory> => {
  const loadData = isIDBAvailable ? idbLoadData : lsLoadData;
  const loaded = await loadData();
  const timestamp = loaded.timestamp;
  const dtp = loaded.data;
  const dt = sigConvert(dtp.substring(2), dtp.substring(0, 2));
  if (!dt.success) {
    console.error("Data read failed");
    throw new Error("Data read failed");
  }
  const data = dt.data as UserDataFile;
  const dataChara = [
    ...new Set([...(data.unowned?.o ?? []), ...(data.unowned?.u ?? [])]),
  ];
  const noDataChara = Object.keys(chara);
  dataChara.forEach((c) => {
    const idx = noDataChara.indexOf(c);
    if (idx >= 0) {
      noDataChara.splice(idx, 1);
    }
  });
  const memoryData = {
    board: {
      c: data.board.c,
      v: data.board.v.length === 0 ? [0, 2, 3, 4, 5, 6, 7, 9] : data.board.v,
      i: data.board.i,
    },
    pboard: { d: data.pboard.d },
    eqrank: {
      s: [1, MAX_RANK],
      v: data.eqrank.v.length === 0 ? [0, 1, 9] : data.eqrank.v,
      f: data.eqrank.f,
    },
    unowned: {
      o: data.unowned.o,
      u: [...data.unowned.u, ...noDataChara],
    },
    lab: data.lab,
    myhome: data.myhome,
    collection: data.collection,
    charaInfo: Object.fromEntries([
      ...data.unowned.o.map((c, i) => [
        c,
        {
          board: data.board.b[i] ?? board.c[c].b.map((a) => a.map(() => 0)),
          pboard:
            data.pboard.p[i] ??
            pboard.c[c].b.map((a) => Array(a.toString(10).length).fill(0)),
          nthboard: data.nthboard.n[i] || 1,
          eqrank: Math.min(
            MAX_RANK,
            Math.max(Number(data.eqrank.r[i]) || 1, 1)
          ),
          skin: data.skin[c],
          unowned: false,
          memo: data.memo.o[i] ?? [0, ""],
        },
      ]),
      ...data.unowned.u.map((c, i) => [
        c,
        {
          skin: data.skin[c],
          unowned: true,
          memo: data.memo.u[i] ?? [0, ""],
        },
      ]),
      ...noDataChara.map((c) => [c, { unowned: true, memo: [0, ""] }]),
    ]),
    boardFindOption: data.boardFindOption ?? {
      x: [1, 1],
      n: [0, 1],
      b: Object.fromEntries([0, 2, 3, 4, 5, 6, 7, 9].map((v) => [v, 0])),
      m: 1,
    },
    dispatchablePets: data.dispatchablePets ?? { o: [], b: {} },
    dirty: 0,
    timestamp,
  };
  // tutorial charas - always owned
  ["Rohne", "Mayo", "Mago", "Allet", "Maison", "Yumimi", "Ifrit"].forEach(
    (c) => {
      if (memoryData.unowned.u.includes(c)) {
        memoryData.unowned.u.splice(memoryData.unowned.u.indexOf(c), 1);
      }
      if (!memoryData.unowned.o.includes(c)) {
        memoryData.unowned.o.push(c);
      }
      if (memoryData.charaInfo[c].unowned) {
        memoryData.charaInfo[c] = {
          board: board.c[c].b.map((a) => a.map(() => 0)),
          pboard: pboard.c[c].b.map((a) =>
            Array(a.toString(10).length).fill(0)
          ),
          nthboard: 1,
          eqrank: 1,
          unowned: false,
          memo: [0, ""],
        };
      }
    }
  );
  return memoryData;
};
export const firstReadIntoMemory = async (): Promise<
  [boolean, UserDataMemory]
> => {
  let isIDBAvailable = localStorage.getItem("idbAvailable");
  let loadData:
    | (() => Promise<{ timestamp: number; data: string }>)
    | undefined = undefined;
  let saveData:
    | ((data: { timestamp: number; data: string }) => Promise<void>)
    | undefined = undefined;
  if (isIDBAvailable === null) {
    try {
      await openNoteDataDB();
      isIDBAvailable = "true";
      localStorage.setItem("idbAvailable", "true");
      loadData = idbLoadData;
      saveData = idbSaveData;
    } catch (e) {
      isIDBAvailable = "false";
      localStorage.setItem("idbAvailable", "false");
      loadData = lsLoadData;
      saveData = lsSaveData;
    }
  } else if (isIDBAvailable === "true") {
    await openNoteDataDB();
    loadData = idbLoadData;
    saveData = idbSaveData;
  } else {
    loadData = lsLoadData;
    saveData = lsSaveData;
  }
  const firstLoadData = await loadData();
  const legacyStored =
    !firstLoadData.data &&
    Array(localStorage.length)
      .fill(0)
      .map((_, i) => localStorage.key(i))
      .find((s) => s?.startsWith("trn."));
  if (legacyStored) {
    let idbFile = "";
    idbFile = await migrateIntoIdbFile();
    const timestamp = Number(localStorage.getItem("timestamp") ?? "0");
    await saveData({ timestamp, data: idbFile });
    const savedData = await loadData();
    if (savedData.data !== idbFile) {
      localStorage.setItem("trn-migration", idbFile);
      console.error("Data migration failed");
      throw Error("Data migration failed");
    }
  }
  const memoryData = await readIntoMemory(isIDBAvailable === "true");
  return [isIDBAvailable === "true", memoryData];
};
export const writeFromMemory = async (
  data: UserDataMemory,
  isIDBAvailable: boolean,
  updateTimestamp: boolean | number
): Promise<void> => {
  const loadTimestamp =
    isIDBAvailable === true ? idbLoadTimestamp : lsLoadTimestamp;
  const saveData = isIDBAvailable === true ? idbSaveData : lsSaveData;
  const timestamp =
    updateTimestamp === true
      ? Date.now()
      : typeof updateTimestamp === "number"
      ? updateTimestamp
      : await loadTimestamp();
  const dataChara = Object.keys(data.charaInfo);
  const dataFile: UserDataFile = {
    board: { b: [], c: data.board.c, v: data.board.v, i: data.board.i },
    pboard: { p: [], d: data.pboard.d },
    nthboard: { n: [] },
    eqrank: { r: [], s: [1, MAX_RANK], v: data.eqrank.v, f: data.eqrank.f },
    unowned: { o: [], u: [] },
    lab: data.lab,
    myhome: data.myhome,
    collection: data.collection,
    skin: {},
    memo: { o: [], u: [] },
    boardFindOption: data.boardFindOption,
    dispatchablePets: data.dispatchablePets,
  };
  dataChara.forEach((c) => {
    if (data.charaInfo[c].unowned) {
      dataFile.unowned.u.push(c);
      if (data.charaInfo[c].skin) dataFile.skin[c] = data.charaInfo[c].skin;
      dataFile.memo.u.push(data.charaInfo[c].memo);
    } else {
      dataFile.unowned.o.push(c);
      dataFile.board.b.push(data.charaInfo[c].board);
      dataFile.pboard.p.push(data.charaInfo[c].pboard);
      dataFile.nthboard.n.push(data.charaInfo[c].nthboard);
      dataFile.eqrank.r.push(data.charaInfo[c].eqrank);
      if (data.charaInfo[c].skin) dataFile.skin[c] = data.charaInfo[c].skin;
      dataFile.memo.o.push(data.charaInfo[c].memo);
    }
  });
  const crayonStatistic = dataFile.board.b
    .map((b) => {
      return b
        .map((nthboard, i) => {
          const checkedCount = nthboard
            .map((v) => int1BitCount(v))
            .reduce((a, b) => a + b, 0);
          return [2, 4, 6][i] * checkedCount;
        })
        .reduce((a, b) => a + b, 0);
    })
    .reduce((a, b) => a + b, 0);
  const purpleCrayonStatistic = dataFile.pboard.p
    .map((b) => {
      return b
        .map((nthboard, i) => {
          const checkedCount = nthboard
            .map((v) => int1BitCount(v))
            .reduce((a, b) => a + b, 0);
          return [3, 6, 9][i] * checkedCount;
        })
        .reduce((a, b) => a + b, 0);
    })
    .reduce((a, b) => a + b, 0);
  const totalRankStatistic = dataFile.eqrank.r.reduce(
    (acc, rank) => acc + rank,
    0
  );
  const timestampInB64 = numberIntoB64(Number(timestamp), 8);
  const crayonStatisticInB64 = numberIntoB64(crayonStatistic, 4);
  const purpleCrayonStatisticInB64 = numberIntoB64(purpleCrayonStatistic, 4);
  const totalRankStatisticInB64 = numberIntoB64(totalRankStatistic, 4);
  const compressedInB64 = compressXorB64(JSON.stringify(dataFile));
  await saveData({
    timestamp,
    data: `${currentSignature}${timestampInB64}${crayonStatisticInB64}${totalRankStatisticInB64}${purpleCrayonStatisticInB64}${compressedInB64}`,
  });
};
