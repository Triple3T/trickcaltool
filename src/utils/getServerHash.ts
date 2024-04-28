const getServerHash = async (callback: (hash: string) => void) => {
  const res = await fetch("https://tr.triple-lab.com/api/hash", {
    cache: "no-store",
  });
  const text = await res.text();
  callback(text);
};

export default getServerHash;
