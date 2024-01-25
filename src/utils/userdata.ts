import chara from "@/data/chara";
import { UserDataBoard, UserDataUnowned } from "@/types/types";

const BOARD_KEY = "trn.board";
const UNOWNED_KEY = "trn.unown";
const saveBoardData = (data: UserDataBoard) => {
  localStorage.setItem(BOARD_KEY, JSON.stringify(data));
};
const loadBoardData = (): UserDataBoard => {
  const data = localStorage.getItem(BOARD_KEY);
  const defaultData = {
    b: {},
    c: 0,
  };
  if (!data) {
    saveBoardData(defaultData);
    return defaultData;
  }
  return { ...defaultData, ...JSON.parse(data) };
};
const saveUnownedData = (data: UserDataUnowned) => {
  localStorage.setItem(UNOWNED_KEY, JSON.stringify(data));
};
const loadUnownedData = (): UserDataUnowned => {
  const data = localStorage.getItem(UNOWNED_KEY);
  if (!data) {
    const defaultData = { o: [], u: Object.keys(chara) };
    saveUnownedData(defaultData);
    return defaultData;
  }
  const parsed = JSON.parse(data) as UserDataUnowned;
  if (
    [...new Set(parsed.o)].length !== parsed.o.length ||
    [...new Set(parsed.u)].length !== parsed.u.length ||
    [...new Set([...parsed.o, ...parsed.u])].length !==
      Object.keys(chara).length
  ) {
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
  return parsed;
};

const userdata = {
  board: {
    save: saveBoardData,
    load: loadBoardData,
  },
  unowned: {
    save: saveUnownedData,
    load: loadUnownedData,
  },
};

export default userdata;
