type AnyObject = Record<string, unknown>;
const deepEqual = <T>(x: T, y: T): boolean => {
  return x && y && typeof x === "object" && typeof x === typeof y
    ? Object.keys(x).length === Object.keys(y).length &&
        Object.keys(x).every((key) =>
          deepEqual((x as AnyObject)[key], (y as AnyObject)[key])
        )
    : x === y;
};
export default deepEqual;
