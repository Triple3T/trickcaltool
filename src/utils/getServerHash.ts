const getServerHash = async (callback: (hash: string) => void) => {
  const res = await fetch("/api/hash", {
    cache: "no-store",
  });
  const text = await res.text();
  callback(text);
};

export default getServerHash;
