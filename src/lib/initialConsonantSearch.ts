const icSearch = (value: string, search: string) =>
  search.split("").every((c: string) => c >= "ㄱ" && c <= "ㅎ")
    ? value
        .replaceAll(/[\d\s()]/g, "")
        .split("")
        .map(
          (c) =>
            [
              "ㄱ",
              "ㄲ",
              "ㄴ",
              "ㄷ",
              "ㄸ",
              "ㄹ",
              "ㅁ",
              "ㅂ",
              "ㅃ",
              "ㅅ",
              "ㅆ",
              "ㅇ",
              "ㅈ",
              "ㅉ",
              "ㅊ",
              "ㅋ",
              "ㅌ",
              "ㅍ",
              "ㅎ",
            ][Math.floor((c.charCodeAt(0) - 44032) / 588)] || ""
        )
        .join("")
        .includes(search)
    : false;

export default icSearch;
