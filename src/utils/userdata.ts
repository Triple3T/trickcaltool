import chara from "@/data/chara";
import deepEqual from "@/lib/deepEqual";
import {
  UserDataDialogEnable,
  UserDataBoard,
  UserDataCollection,
  UserDataEqRank,
  UserDataEventCalc,
  UserDataLab,
  UserDataMyHome,
  UserDataNthBoard,
  UserDataPurpleBoard,
  UserDataUnowned,
  UserDataSkin,
} from "@/types/types";

interface LoadDataAdditionalProps {
  autoRepaired: boolean;
}

type LoadData<T> = () => T & LoadDataAdditionalProps;
type SaveData<T> = (data: T) => void;
type LoadDataWithoutAutoRepaired<T> = () => T;

const DIALOG_KEY = "trn.dialog";

const BOARD_KEY = "trn.board";
const PBOARD_KEY = "trn.pb";
const NTHBOARD_KEY = "trn.nthboard";
const EQRANK_KEY = "trn.eqrank";
const UNOWNED_KEY = "trn.unown";
const LAB_KEY = "trn.lab";
const MYHOME_KEY = "trn.myhome";
const COLLECTION_KEY = "trn.collection";
const EVENTCALC_KEY = "trn.eventcalc";
const SKIN_KEY = "trn.skin";

const defaultDialogEnableData: UserDataDialogEnable = {
  board: true,
  eqrank: true,
};
const saveDialogEnableData: SaveData<UserDataDialogEnable> = (data) => {
  localStorage.setItem(
    DIALOG_KEY,
    JSON.stringify(data ?? defaultDialogEnableData)
  );
};
const loadDialogEnableData: LoadData<UserDataDialogEnable> = () => {
  const data = localStorage.getItem(DIALOG_KEY);
  if (!data) {
    saveDialogEnableData(defaultDialogEnableData);
    return { ...defaultDialogEnableData, autoRepaired: true };
  }
  const finalData = { ...defaultDialogEnableData, ...JSON.parse(data) };
  const autoRepaired = !deepEqual(finalData, JSON.parse(data));
  return { ...finalData, autoRepaired };
};

const defaultBoardData: UserDataBoard = {
  b: {},
  c: 0,
  v: [0, 2, 3, 4, 5, 6, 7, 9],
};
const saveBoardData: SaveData<UserDataBoard> = (data) => {
  localStorage.setItem(BOARD_KEY, JSON.stringify(data ?? defaultBoardData));
};
const loadBoardData: LoadData<UserDataBoard> = () => {
  const data = localStorage.getItem(BOARD_KEY);
  if (!data) {
    saveBoardData(defaultBoardData);
    return { ...defaultBoardData, autoRepaired: true };
  }
  const finalData = { ...defaultBoardData, ...JSON.parse(data) };
  const autoRepaired = !deepEqual(finalData, JSON.parse(data));
  return { ...finalData, autoRepaired };
};

const defaultPurpleBoardData = {
  p: {},
  d: [],
};
const savePurpleBoardData: SaveData<UserDataPurpleBoard> = (data) => {
  localStorage.setItem(
    PBOARD_KEY,
    JSON.stringify(data ?? defaultPurpleBoardData)
  );
};
const loadPurpleBoardData: LoadData<UserDataPurpleBoard> = () => {
  const data = localStorage.getItem(PBOARD_KEY);
  if (!data) {
    savePurpleBoardData(defaultPurpleBoardData);
    return { ...defaultPurpleBoardData, autoRepaired: true };
  }
  const finalData = { ...defaultPurpleBoardData, ...JSON.parse(data) };
  const autoRepaired = !deepEqual(finalData, JSON.parse(data));
  return { ...finalData, autoRepaired };
};

const defaultNthBoardData = {
  n: {},
};
const saveNthBoardData: SaveData<UserDataNthBoard> = (data) => {
  localStorage.setItem(
    NTHBOARD_KEY,
    JSON.stringify(data ?? defaultNthBoardData)
  );
};
const loadNthBoardData: LoadData<UserDataNthBoard> = () => {
  const data = localStorage.getItem(NTHBOARD_KEY);
  if (!data) {
    saveNthBoardData(defaultNthBoardData);
    return { ...defaultNthBoardData, autoRepaired: true };
  }
  const finalData = { ...defaultNthBoardData, ...JSON.parse(data) };
  const autoRepaired = !deepEqual(finalData, JSON.parse(data));
  return { ...finalData, autoRepaired };
};

const defaultEqRankData = {
  r: {},
  s: [0, 0, 0],
  v: [],
  f: [[0, 0, 0]],
};
const saveEqRankData: SaveData<UserDataEqRank> = (data) => {
  localStorage.setItem(EQRANK_KEY, JSON.stringify(data ?? defaultEqRankData));
};
const loadEqRankData: LoadData<UserDataEqRank> = () => {
  const data = localStorage.getItem(EQRANK_KEY);
  if (!data) {
    saveEqRankData(defaultEqRankData);
    return { ...defaultEqRankData, autoRepaired: true };
  }
  const finalData = { ...defaultEqRankData, ...JSON.parse(data) };
  const autoRepaired = !deepEqual(finalData, JSON.parse(data));
  return { ...finalData, autoRepaired };
};

const defaultUnownedData = { o: [], u: Object.keys(chara) };
const saveUnownedData: SaveData<UserDataUnowned> = (data) => {
  localStorage.setItem(UNOWNED_KEY, JSON.stringify(data ?? defaultUnownedData));
};
const loadUnownedData: LoadData<UserDataUnowned> = () => {
  const data = localStorage.getItem(UNOWNED_KEY);
  if (!data) {
    saveUnownedData(defaultUnownedData);
    return { ...defaultUnownedData, autoRepaired: true };
  }
  const parsed = JSON.parse(data) as UserDataUnowned;
  let autoRepaired = false;
  if (
    [...new Set(parsed.o)].length !== parsed.o.length ||
    [...new Set(parsed.u)].length !== parsed.u.length ||
    [...new Set([...parsed.o, ...parsed.u])].length !==
      Object.keys(chara).length
  ) {
    autoRepaired = true;
    // self-duplicate check
    parsed.o = [...new Set(parsed.o)];
    parsed.u = [...new Set(parsed.u)];
    // duplicate check
    const duplicated = Object.keys(chara).filter((v) => {
      return parsed.o.includes(v) && parsed.u.includes(v);
    });
    parsed.o = parsed.o.filter((v) => !duplicated.includes(v));
    // missing check
    const missing = Object.keys(chara).filter((v) => {
      return !parsed.o.includes(v) && !parsed.u.includes(v);
    });
    parsed.u = [...parsed.u, ...missing];
    saveUnownedData(parsed);
  }
  return { ...parsed, autoRepaired };
};

const defaultLabData = {
  1: 0,
  2: 0,
};
const saveLabData: SaveData<UserDataLab> = (data) => {
  localStorage.setItem(LAB_KEY, JSON.stringify(data ?? defaultLabData));
};
const loadLabData: LoadData<UserDataLab> = () => {
  const data = localStorage.getItem(LAB_KEY);
  if (!data) {
    saveLabData(defaultLabData);
    return { ...defaultLabData, autoRepaired: true };
  }
  const finalData = { ...defaultLabData, ...JSON.parse(data) };
  const autoRepaired = !deepEqual(finalData, JSON.parse(data));
  return { ...finalData, autoRepaired };
};

const defaultMyHomeData = {
  l: [0, 0],
  r: [0, 0],
  m: [0, 0],
  s: [0, 0],
  a: [0, 0],
};
const saveMyHomeData: SaveData<UserDataMyHome> = (data) => {
  localStorage.setItem(MYHOME_KEY, JSON.stringify(data ?? defaultMyHomeData));
};
const loadMyHomeData: LoadData<UserDataMyHome> = () => {
  const data = localStorage.getItem(MYHOME_KEY);
  if (!data) {
    saveMyHomeData(defaultMyHomeData);
    return { ...defaultMyHomeData, autoRepaired: true };
  }
  const finalData = { ...defaultMyHomeData, ...JSON.parse(data) };
  const autoRepaired = !deepEqual(finalData, JSON.parse(data));
  return { ...finalData, autoRepaired };
};

const defaultCollectionData = { c: [] };
const saveCollectionData: SaveData<UserDataCollection> = (data) => {
  localStorage.setItem(
    COLLECTION_KEY,
    JSON.stringify(data ?? defaultCollectionData)
  );
};
const loadCollectionData: LoadData<UserDataCollection> = () => {
  const data = localStorage.getItem(COLLECTION_KEY);
  if (!data) {
    saveCollectionData(defaultCollectionData);
    return { ...defaultCollectionData, autoRepaired: true };
  }
  const finalData = { ...defaultCollectionData, ...JSON.parse(data) };
  const autoRepaired = !deepEqual(finalData, JSON.parse(data));
  return { ...finalData, autoRepaired };
};

const defaultEventCalcData = {
  a: [false, false, false, false],
  b: [0, 0, 0],
  c: false,
  d: 1,
  h: 0,
  r: 0,
  e: "",
  s: [],
  u: [false, false, false],
  t: 0,
};
const saveEventCalcData: SaveData<UserDataEventCalc> = (dt) => {
  const data = { ...dt, t: Date.now() };
  localStorage.setItem(
    EVENTCALC_KEY,
    JSON.stringify(data ?? defaultEventCalcData)
  );
};
const loadEventCalcData: LoadData<UserDataEventCalc> = () => {
  const data = localStorage.getItem(EVENTCALC_KEY);
  if (!data) {
    saveEventCalcData(defaultEventCalcData);
    return { ...defaultEventCalcData, autoRepaired: true };
  }
  const finalData = { ...defaultEventCalcData, ...JSON.parse(data) };
  const autoRepaired = !deepEqual(finalData, JSON.parse(data));
  return { ...finalData, autoRepaired };
};

const saveSkinData: SaveData<UserDataSkin> = (data) => {
  localStorage.setItem(SKIN_KEY, JSON.stringify(data ?? {}));
};
const loadSkinData: LoadDataWithoutAutoRepaired<UserDataSkin> = () => {
  const data = localStorage.getItem(SKIN_KEY);
  if (!data) {
    saveSkinData({});
    return {};
  }
  const finalData = { ...JSON.parse(data) };
  return finalData;
};

const userdata = {
  dialog: {
    save: saveDialogEnableData,
    load: loadDialogEnableData,
  },
  board: {
    save: saveBoardData,
    load: loadBoardData,
  },
  pboard: {
    save: savePurpleBoardData,
    load: loadPurpleBoardData,
  },
  nthboard: {
    save: saveNthBoardData,
    load: loadNthBoardData,
  },
  eqrank: {
    save: saveEqRankData,
    load: loadEqRankData,
  },
  unowned: {
    save: saveUnownedData,
    load: loadUnownedData,
  },
  lab: {
    save: saveLabData,
    load: loadLabData,
  },
  myhome: {
    save: saveMyHomeData,
    load: loadMyHomeData,
  },
  collection: {
    save: saveCollectionData,
    load: loadCollectionData,
  },
  eventcalc: {
    save: saveEventCalcData,
    load: loadEventCalcData,
  },
  skin: {
    save: saveSkinData,
    load: loadSkinData,
  },
};

export default userdata;
