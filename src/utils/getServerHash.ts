const getServerHash = async () => {
  const res = await fetch("/api/hash", {
    cache: "no-store",
  });
  if (!res.ok) {
    res.body?.cancel();
    return Promise.reject(res.statusText);
  }
  const text = await res.text();
  return text;
};

export default getServerHash;
