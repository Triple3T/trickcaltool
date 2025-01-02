import task from "./task.json";
export default task as {
  t: {
    [key: string]: {
      s: number[];
      m: string[];
      c?: { a: string[] } | { d: string[] };
      f?: number;
    };
  };
};
