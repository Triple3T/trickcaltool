import collection from "./collection.json";
export default collection as {
  c: {
    [key: string]: (
      | { m: { [key: string]: number }; s: number; f: number; r: number }
      | { f: number; r: number }
    );
  };
};
