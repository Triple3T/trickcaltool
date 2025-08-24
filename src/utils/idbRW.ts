import { openDB, DBSchema } from "idb";
interface INoteDataDB extends DBSchema {
  trickcalnotedata: {
    key: string;
    value: string;
  };
}
interface INoteDataIO {
  timestamp: number;
  data: string;
}

const idbNoteDataDBName = "notedataindex";
const idbNoteDataDBVer = 3;
export const openNoteDataDB = () =>
  openDB<INoteDataDB>(idbNoteDataDBName, idbNoteDataDBVer, {
    upgrade: (db) => {
      db.createObjectStore("trickcalnotedata");
    },
  });

export const loadData = async (): Promise<INoteDataIO> => {
  const noteDataDB = await openDB<INoteDataDB>(
    idbNoteDataDBName,
    idbNoteDataDBVer
  );
  const tx = noteDataDB.transaction("trickcalnotedata", "readonly");
  const store = tx.objectStore("trickcalnotedata");
  const timestampString = await store.get("timestamp");
  const dataProto = await store.get("data");
  await tx.done;
  const timestamp = Number(timestampString ?? "0");
  const data = dataProto ?? "";
  return { timestamp, data };
};
export const loadTimestamp = async (): Promise<number> => {
  const noteDataDB = await openDB<INoteDataDB>(
    idbNoteDataDBName,
    idbNoteDataDBVer
  );
  const tx = noteDataDB.transaction("trickcalnotedata", "readonly");
  const store = tx.objectStore("trickcalnotedata");
  const timestampString = await store.get("timestamp");
  await tx.done;
  return Number(timestampString ?? "0");
}
export const saveData = async (data: INoteDataIO): Promise<void> => {
  const noteDataDB = await openDB<INoteDataDB>(
    idbNoteDataDBName,
    idbNoteDataDBVer
  );
  const tx = noteDataDB.transaction("trickcalnotedata", "readwrite");
  const store = tx.objectStore("trickcalnotedata");
  await store.put(data.data, "data");
  await store.put(data.timestamp.toString(), "timestamp");
  // tx.objectStore("data").put(data.data, "data");
  // tx.objectStore("data").put(data.timestamp.toString(), "timestamp");
  await tx.done;
};
export const loadTeamData = async (): Promise<{ data: string; teamkey?: string }> => {
  const noteDataDB = await openDB<INoteDataDB>(
    idbNoteDataDBName,
    idbNoteDataDBVer
  );
  const tx = noteDataDB.transaction("trickcalnotedata", "readonly");
  const store = tx.objectStore("trickcalnotedata");
  const data = (await store.get("builderteam")) ?? "";
  const teamkey = (await store.get("teamkey")) || undefined;
  await tx.done;
  return { data, teamkey };
};
export const saveTeamData = async (d: { data: string; teamkey?: string }): Promise<void> => {
  const noteDataDB = await openDB<INoteDataDB>(
    idbNoteDataDBName,
    idbNoteDataDBVer
  );
  const tx = noteDataDB.transaction("trickcalnotedata", "readwrite");
  const store = tx.objectStore("trickcalnotedata");
  const { data, teamkey } = d;
  await store.put(data, "builderteam");
  await store.put(teamkey ?? "", "teamkey");
  await tx.done;
};
