interface INoteDataIO {
  timestamp: number;
  data: string;
}
export const openNoteDataStorage = () => {
  const test = "trickcal-note-test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export const loadData = async (): Promise<INoteDataIO> => {
  const timestamp = Number(localStorage.getItem("timestamp") ?? "0");
  const data = localStorage.getItem("trn-migration") ?? "";
  return { timestamp, data };
};
export const loadTimestamp = async (): Promise<number> => {
  return Number(localStorage.getItem("timestamp") ?? "0");
}
export const saveData = async (data: INoteDataIO): Promise<void> => {
  localStorage.setItem("timestamp", data.timestamp.toString());
  localStorage.setItem("trn-migration", data.data);
};
export const loadTeamData = async (): Promise<string> => {
  return localStorage.getItem("builderteam") ?? "";
}
export const saveTeamData = async (data: string): Promise<void> => {
  localStorage.setItem("builderteam", data);
}