import { cn } from "./lib/utils";
import { Personality } from "./types/enums";
import chara from "./data/chara";
import { personalityBG } from "./utils/personalityBG";

const timeZero = new Date("2023-09-27");
const timeOne = new Date("2023-10-05");
const timeEnd = new Date("2025-08-21");
const timesFromOne = Array(
  Math.ceil(
    (timeEnd.getTime() - timeOne.getTime()) / (1000 * 60 * 60 * 24 * 7)
  ) + 1
)
  .fill(0)
  .map((_, i) => new Date(timeOne.getTime() + i * 1000 * 60 * 60 * 24 * 7));
const times = [timeZero, ...timesFromOne];
// 순번, 기간, 열, New여부, ...캐릭터
const lineups = [
  [0, 1, 0, 0, "Erpin"],
  [1, 2, 0, 0, "Butter"],
  [1, 2, 1, 0, "Kommy"],
  [3, 2, 0, 1, "Tig"],
  [3, 2, 1, 0, "Velvet"],
  [5, 1, 0, 0, "Rufo"],
  [6, 2, 0, 1, "Naia", "Silphir"],
  [8, 1, 0, 0, "Daya"],
  [9, 2, 0, 1, "Vivi"],
  [11, 1, 0, 1, "Hilde"],
  [12, 2, 0, 1, "Selline"],
  [14, 2, 0, 1, "Epica"],
  [16, 1, 0, 0, "Jade"],
  [16, 1, 1, 0, "Belita"],
  [17, 2, 0, 1, "Alice"],
  [18, 1, 1, 0, "Sist"],
  [19, 2, 0, 1, "Leets"],
  [21, 2, 0, 1, "Picora"],
  [22, 1, 1, 0, "Amelia"],
  [23, 1, 0, 0, "Fricle"],
  [24, 2, 0, 1, "Blanchet"],
  [25, 1, 1, 0, "Elena"],
  [26, 2, 0, 1, "Ed"],
  [27, 1, 1, 0, "Shady"],
  [28, 2, 0, 1, "Shoupan"],
  [29, 1, 1, 0, "Ashur"],
  [30, 2, 0, 1, "Kyarot"],
  [31, 1, 1, 0, "Diana"],
  [32, 2, 0, 1, "Rollett", "Bana"],
  [33, 1, 1, 0, "Sylla"],
  [34, 2, 0, 1, "Risty"],
  [35, 1, 1, 0, "Canna"],
  [36, 2, 0, 1, "KommySwim"],
  [37, 1, 1, 0, "Hilde"],
  [37, 1, 2, 0, "Erpin", "Amelia", "Ashur", "Diana", "Butter"],
  [38, 2, 0, 1, "RenewaAwaken"],
  [40, 2, 0, 1, "Haley", "Lethe"],
  [41, 1, 1, 0, "Rude"],
  [42, 2, 0, 1, "Momo"],
  [43, 1, 1, 0, "xXionx"],
  [44, 2, 0, 1, "Barong", "Barie"],
  [45, 1, 1, 0, "Kyarot", "Meluna", "Rude", "Hilde", "Sist"],
  [46, 2, 0, 1, "Snorky"],
  [47, 1, 1, 0, "Ui"],
  [48, 2, 0, 1, "Pira"],
  [49, 1, 1, 0, "Naia", "Velvet", "Canna", "Rim", "Ner"],
  [50, 2, 0, 1, "Sherum", "Canta"],
  [52, 4, 0, 1, "Joanne"],
  [53, 1, 1, 0, "Epica"],
  [54, 2, 1, 0, "Kyarot"],
  [55, 1, 2, 0, "Haley", "Elena", "Tig", "Posher", "Shady"],
  [56, 2, 0, 1, "Guin"],
  [57, 1, 1, 0, "Chloe"],
  [58, 2, 0, 1, "Polan"],
  [59, 1, 1, 0, "Daya", "Sylla", "Selline", "Blanchet", "Leets"],
  [60, 2, 0, 1, "SpeakiMaid"],
  [61, 1, 1, 0, "Aya"],
  [62, 2, 0, 1, "Lion"],
  [63, 1, 1, 0, "Sherum", "Fricle", "Rufo", "Risty", "Alice"],
  [64, 2, 0, 1, "Opal"],
  [65, 1, 1, 0, "Erpin", "Elena", "Sist"],
  [66, 2, 0, 1, "Ran"],
  [67, 1, 1, 0, "Vivi"],
  [68, 2, 0, 1, "RimChaos"],
  [69, 1, 1, 0, "Shoupan", "Kidian"],
  [70, 2, 0, 1, "Eisia"],
  [70, 1, 1, 0, "Ed"],
  [71, 1, 1, 0, "Opal", "Picora", "Belita"],
  [72, 2, 0, 1, "Shasha"],
  [73, 1, 1, 0, "RenewaAwaken"],
  [74, 2, 0, 1, "Suro"],
  [75, 1, 1, 0, "Kommy", "SpeakiMaid"],
  [76, 2, 0, 1, "Laika"],
  [77, 1, 1, 0, "Erpin", "Leets", "Sylla"],
  [78, 4, 0, 1, "Vela"],
  [79, 1, 1, 0, "Joanne"],
  [80, 2, 1, 1, "Neti"],
  [81, 1, 2, 0, "Sherum", "Momo", "Guin", "Lion", "Polan"],
  [82, 2, 0, 1, "Ricota"],
  [82, 1, 1, 0, "Aya"],
  [83, 1, 1, 0, "Opal", "Butter", "Picora", "Lion", "Diana"],
  [84, 2, 0, 1, "MayoCool"],
  [85, 1, 1, 0, "Haley", "Tig", "Barong", "Hilde", "Ner"],
  [86, 2, 0, 1, "Orr"],
  [87, 1, 1, 0, "xXionx"],
  [87, 1, 2, 0, "Naia", "Selline", "Amelia", "Blanchet", "Alice"],
  [88, 4, 0, 1, "DianaYester"],
  [89, 2, 2, 0, "Ran"],
  [90, 2, 1, 1, "Arco"],
  [91, 1, 2, 0, "Kyarot", "Shoupan", "KommySwim", "Posher", "Shady"],
  [92, 2, 0, 1, "Kathy"],
  [93, 1, 1, 0, "Eisia", "Neti", "MayoCool", "Suro", "Kidian", "Barong", "Alice", "Laika", "SpeakiMaid", "Blanchet"],
  [94, 2, 0, 1, "Arnet"],
  [95, 1, 1, 0, "Daya", "Canna", "Sylla", "Shasha", "RimChaos"],
  [96, 2, 0, 1, "RohneMayor"],
  [96, 1, 1, 0, "Aya", "xXionx", "Epica", "Vivi", "Chloe", "Ed", "Ui"],
  [97, 1, 1, 0, "Snorky"],
  [97, 1, 2, 0, "Haley", "Ricota", "Polan", "Momo", "Orr", "Opal", "Picora", "Sist", "Tig", "Lion"],
  [98, 2, 0, 1, "Makasha"],
];
const widthcount = Math.max(...lineups.map((l) => l[2] as number)) + 1;
const personalityFrom = {
  [Personality.Cool]: "from-personality-Cool",
  [Personality.Gloomy]: "from-personality-Gloomy",
  [Personality.Jolly]: "from-personality-Jolly",
  [Personality.Mad]: "from-personality-Mad",
  [Personality.Naive]: "from-personality-Naive",
};
const personalityTo = {
  [Personality.Cool]: "to-personality-Cool",
  [Personality.Gloomy]: "to-personality-Gloomy",
  [Personality.Jolly]: "to-personality-Jolly",
  [Personality.Mad]: "to-personality-Mad",
  [Personality.Naive]: "to-personality-Naive",
};
const personalityVia = {
  [Personality.Cool]: "via-personality-Cool",
  [Personality.Gloomy]: "via-personality-Gloomy",
  [Personality.Jolly]: "via-personality-Jolly",
  [Personality.Mad]: "via-personality-Mad",
  [Personality.Naive]: "via-personality-Naive",
};
const PickupLog = () => {
  return (
    <div className="w-max mx-auto">
      <div className="max-w-full font-onemobile text-center text-2xl mb-2">
        픽업 목록
      </div>
      <div className="table font-onemobile">
        <div className="table-row h-18"></div>
        {times.map((time, index) => {
          const year = time.getFullYear();
          const mmdd = `${time.getMonth() + 1}/${time.getDate()}`;
          return (
            <div key={time.toUTCString()} className="table-row relative h-24">
              <div className="table-cell w-16 h-24 relative">
                <div className="absolute top-0 -translate-y-1/2 w-full text-center bg-slate-700 text-slate-50 rounded-sm">
                  <div>{year}</div>
                  <div className="h-0.5 w-16 scale-x-[450%] -translate-y-px translate-x-[275%] z-10 absolute bg-slate-400"></div>
                  <div>{mmdd}</div>
                </div>
              </div>
              {Array(widthcount)
                .fill(0)
                .map((_, i) => {
                  const lineup = lineups.find(
                    (v) => v[0] === index && v[2] === i
                  );
                  if (!lineup) {
                    return <div key={i} className="table-cell w-24 h-24"></div>;
                  }
                  const charas = lineup.slice(4) as string[];
                  const bg = (() => {
                    if (charas.length > 3) return "bg-slate-300";
                    if (charas.length > 2)
                      return [
                        personalityFrom[
                          Number(
                            chara[charas[0]].t[0]
                          ) as keyof typeof personalityFrom
                        ],
                        personalityVia[
                          Number(
                            chara[charas[1]].t[0]
                          ) as keyof typeof personalityFrom
                        ],
                        personalityTo[
                          Number(
                            chara[charas[2]].t[0]
                          ) as keyof typeof personalityFrom
                        ],
                        "bg-gradient-to-r from-10% via-50% to-90%",
                      ].join(" ");
                    if (charas.length > 1)
                      return [
                        personalityFrom[
                          Number(
                            chara[charas[0]].t[0]
                          ) as keyof typeof personalityFrom
                        ],
                        personalityTo[
                          Number(
                            chara[charas[1]].t[0]
                          ) as keyof typeof personalityTo
                        ],
                        "bg-gradient-to-r from-35% to-65%",
                      ].join(" ");
                    return personalityBG[
                      Number(
                        chara[charas[0]].t[0]
                      ) as keyof typeof personalityBG
                    ];
                  })();
                  const height = ["h-24", "h-48", "h-72", "h-96"][
                    (lineup[1] as number) - 1
                  ];
                  const imageSize = [
                    "w-16 h-16",
                    "w-10 h-10",
                    "w-6 h-6",
                    "w-10 h-10",
                    "w-6 h-6",
                  ][Math.min(4, charas.length - 1)];
                  const imageContainerWidth = [
                    "w-16",
                    "w-20",
                    "w-18",
                    "w-20",
                    "w-18",
                  ][Math.min(4, charas.length - 1)];
                  return (
                    <div key={i} className="table-cell w-24 h-24 relative">
                      <div
                        className={cn(
                          "absolute top-0 left-1 p-0.5 w-[5.5rem]",
                          height
                        )}
                      >
                        <div
                          className={cn(
                            "w-full h-full py-1 rounded-sm overflow-hidden relative",
                            bg
                          )}
                        >
                          {lineup[3] !== 0 && (
                            <img
                              src="/itemslot/Common_New_2.png"
                              className="absolute top-px left-px w-10"
                            />
                          )}
                          {charas.some((charaId) => chara[charaId].e) && (
                            <img
                              src="/gacha/PickPerconalityIcon_EldainHero.png"
                              className="absolute top-px right-px w-10 drop-shadow-[0_0_2px_white]"
                            />
                          )}
                          <div
                            className={cn(
                              "flex flex-wrap flex-row mx-auto justify-center mt-2",
                              imageContainerWidth
                            )}
                          >
                            {charas.map((charaId) => {
                              return (
                                <img
                                  key={charaId}
                                  src={`/charas/${charaId}.png`}
                                  className={cn("rounded-sm", imageSize)}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PickupLog;
