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
export const loadTeamData = async (): Promise<{ data: string; teamkey?: string }> => {
  const data = localStorage.getItem("builderteam") ?? "";
  const teamkey = localStorage.getItem("teamkey") || undefined;
  return { data, teamkey };
}
export const saveTeamData = async (d: { data: string; teamkey?: string }): Promise<void> => {
  const { data, teamkey } = d;
  localStorage.setItem("builderteam", data);
  localStorage.setItem("teamkey", teamkey ?? "");
}