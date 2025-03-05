import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import SearchBox from "@/components/common/search-with-icon";
import card from "@/data/card";
import icSearch from "@/lib/initialConsonantSearch";
import { cn } from "@/lib/utils";
import { StatType } from "@/types/enums";

const colorClasses = [
  "bg-[#b0b0b0]",
  "bg-[#66dd82]",
  "bg-[#64a5e7]",
  "bg-[#b371f7]",
];

const Cards = () => {
  const { t } = useTranslation();
  const [cardLevel, setCardLevel] = useState<number>(0);
  const [statFilter, setStatFilter] = useState<StatType[]>([]);
  const [search, setSearch] = useState<string>("");
  return (
    <div className="font-onemobile">
      <Card className="mx-auto w-max max-w-full p-4 min-w-72">
        <div className="flex flex-col p-2 gap-4">
          <div className="grid grid-cols-1 p-2 gap-2">
            <div className="flex flex-row items-center">
              <Slider
                className="flex-1"
                value={[cardLevel]}
                min={0}
                max={11}
                onValueChange={(val) => setCardLevel(val[0])}
                disabled
              />
              <div className="w-16">Lv.{cardLevel + 1}</div>
            </div>
            <div>
              <ToggleGroup
                type="multiple"
                className="flex-wrap"
                value={statFilter.map((v) => `${v}`)}
                onValueChange={(v) => {
                  setStatFilter(v.map((v) => parseInt(v)));
                }}
              >
                {[8, 1, 0, 4, 2, 5, 3, 7, 6, 9].map((stat) => {
                  const statString = StatType[stat];
                  return (
                    <ToggleGroupItem
                      key={stat}
                      value={`${stat}`}
                      aria-label={`Toggle ${statString}`}
                    >
                      <img
                        src={`/icons/Icon_${statString}.png`}
                        className="h-5 w-5 aspect-square inline-flex align-middle"
                      />
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
            </div>
            <div>
              <SearchBox
                value={search}
                onValueChange={setSearch}
                placeholder={t("ui.cards.searchPlaceholder")}
              />
            </div>
          </div>
        </div>
      </Card>
      <div className="text-xl p-4">{t("ui.cards.artifact")}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {card.a.o.map((i) => {
          const targetCard = card.a.l[i];
          const rarity = targetCard.r;
          const borderColor = card.r[rarity].b;
          const background = card.r[targetCard.a ? 0 : rarity];
          const coefficient = targetCard.c;
          const stats: StatType[] = targetCard.s;
          const cardTitle = t(`card.artifact.${i}.title`);
          const cardDescription = t(
            [`card.artifact.${i}.description`, "card.common.noeffect"],
            Object.fromEntries(
              coefficient.map((v, k) => {
                if (v === "p") {
                  if (Array.isArray(targetCard.p))
                    return [k, targetCard.p[cardLevel]];
                  return [k, targetCard.p];
                }
                if (Array.isArray(v)) return [k, v[cardLevel]];
                return [k, v];
              })
            )
          );
          if (statFilter.length > 0) {
            const searchResult = stats.reduce((prev, stat) => {
              return prev || statFilter.includes(stat);
            }, false);
            if (!searchResult) return null;
          }
          if (search.trim() !== "") {
            const keywords = search.split(" ");
            const searchResult = keywords.reduce(
              (prev: boolean | null, keywordProto) => {
                if (prev === null) return null;
                const keywordTitle = keywordProto.replaceAll(/[{}%+-]/g, "");
                const keywordDesc = keywordProto.replaceAll(/[{}%+0-9-]/g, "");
                const shouldInclude = keywordProto.startsWith("+");
                const isNegative = keywordProto.startsWith("-");
                if (keywordTitle === "") return prev;
                const icSearchTitleResult = icSearch(cardTitle, keywordTitle);
                const icSearchDescResult =
                  keywordDesc !== "" && icSearch(cardDescription, keywordDesc);
                const searchTitleResult = cardTitle.includes(keywordTitle);
                const searchDescResult =
                  keywordDesc !== "" && cardDescription.includes(keywordDesc);
                const result =
                  icSearchTitleResult ||
                  icSearchDescResult ||
                  searchTitleResult ||
                  searchDescResult;
                if (shouldInclude && !result) return null;
                if (isNegative && result) return null;
                return prev || result !== isNegative;
              },
              false
            );
            if (!searchResult) return null;
          }
          return (
            <Card key={i} className="p-2 flex flex-col gap-2 bg-accent/75">
              <div className="flex flex-row gap-2 justify-start items-center">
                <div
                  className="aspect-square w-6 h-6 bg-cover flex justify-center items-center text-shadow-glow-foreground text-background text-shadow-glow-2 text-lg"
                  style={{
                    backgroundImage: "url(/ingameui/Ingame_Cost_Small.png)",
                  }}
                >
                  {Array.isArray(targetCard.p)
                    ? targetCard.p[cardLevel]
                    : targetCard.p}
                </div>
                <div className="flex justify-center items-center break-keep">
                  <div
                    className={cn("rounded px-1.5", colorClasses[rarity - 1])}
                  >
                    <div className="-mt-1.5 text-lg leading-tight">
                      <span className="text-shadow-glow text-lg leading-tight">
                        {cardTitle}
                      </span>
                      <span className="text-xs ml-2 mr-1 opacity-65">
                        {t(`card.common.rarity.${rarity}`)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative flex flex-row gap-2 justify-center items-start w-full">
                <div
                  className="aspect-square rounded-xl border-[3px] ring-2 ring-foreground w-20 relative overflow-hidden"
                  style={{
                    backgroundImage: `url(/ingameui/Ingame_CardBase_Artifact_${background.s}.png)`,
                    backgroundColor: background.b,
                    backgroundSize: "cover",
                    borderColor,
                  }}
                >
                  <div className="aspect-square w-full p-2">
                    <img
                      src={`/artifacts/ArtifactIcon_${i}.png`}
                      className="max-w-full max-h-full mx-auto my-auto"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-start items-stretch gap-1 p-0.5">
                  <div className="flex flex-row flex-wrap text-left break-keep text-sm gap-x-2">
                    {stats.map((stat, i) => {
                      const statString = StatType[stat];
                      const statCoefficient =
                        coefficient[i] === "p" ? targetCard.p : coefficient[i];
                      return (
                        <div key={stat}>
                          <img
                            src={`/icons/Icon_${statString}.png`}
                            className="w-4 h-4 inline-block mr-1"
                          />
                          {t(`stat.${statString}`)} +
                          {(Array.isArray(statCoefficient)
                            ? statCoefficient[cardLevel]
                            : statCoefficient) / 100}
                          %
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-col text-left break-keep text-sm">
                    {cardDescription.split("\n").map((l, i) => {
                      return (
                        <div key={i}>
                          {l.split("*").map((c, j) => {
                            return (
                              <span
                                key={j}
                                className={cn(
                                  "text-sm",
                                  j % 2 === 1 && "text-emerald-500"
                                )}
                              >
                                {c}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="h-8" />
      <div className="text-xl p-4">{t("ui.cards.spell")}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
        {card.s.o.map((i) => {
          const targetCard = card.s.l[i];
          const rarity = targetCard.r;
          const borderColor = card.r[rarity].b;
          const background = card.r[rarity];
          const coefficient = targetCard.c;
          const stats: StatType[] = targetCard.s;
          const cardTitle = t(`card.spell.${i}.title`);
          const cardDescription = t(
            [`card.spell.${i}.description`, "card.common.noeffect"],
            Object.fromEntries(
              coefficient.map((v, k) => {
                if (v === "p") {
                  if (Array.isArray(targetCard.p))
                    return [k, targetCard.p[cardLevel]];
                  return [k, targetCard.p];
                }
                if (Array.isArray(v)) return [k, v[cardLevel]];
                return [k, v];
              })
            )
          );
          if (statFilter.length > 0) {
            const searchResult = stats.reduce((prev, stat) => {
              return prev || statFilter.includes(stat);
            }, false);
            if (!searchResult) return null;
          }
          if (search.trim() !== "") {
            const keywords = search.split(" ");
            const searchResult = keywords.reduce(
              (prev: boolean | null, keywordProto) => {
                if (prev === null) return null;
                const keywordTitle = keywordProto.replaceAll(/[{}%+-]/g, "");
                const keywordDesc = keywordProto.replaceAll(/[{}%+0-9-]/g, "");
                const shouldInclude = keywordProto.startsWith("+");
                const isNegative = keywordProto.startsWith("-");
                if (keywordTitle === "") return prev;
                const icSearchTitleResult = icSearch(cardTitle, keywordTitle);
                const icSearchDescResult =
                  keywordDesc !== "" && icSearch(cardDescription, keywordDesc);
                const searchTitleResult = cardTitle.includes(keywordTitle);
                const searchDescResult =
                  keywordDesc !== "" && cardDescription.includes(keywordDesc);
                const result =
                  icSearchTitleResult ||
                  icSearchDescResult ||
                  searchTitleResult ||
                  searchDescResult;
                if (shouldInclude && !result) return null;
                if (isNegative && result) return null;
                return prev || result !== isNegative;
              },
              false
            );
            if (!searchResult) return null;
          }
          return (
            <Card key={i} className="p-2 flex flex-col gap-2 bg-accent/75">
              <div className="flex flex-row gap-2 justify-start items-center">
                <div
                  className="aspect-square w-6 h-6 bg-cover flex justify-center items-center text-shadow-glow-foreground text-background text-shadow-glow-2 text-lg"
                  style={{
                    backgroundImage: "url(/ingameui/Ingame_Cost_Small.png)",
                  }}
                >
                  {Array.isArray(targetCard.p)
                    ? targetCard.p[cardLevel]
                    : targetCard.p}
                </div>
                <div className="flex justify-center items-center break-keep">
                  <div
                    className={cn("rounded px-1.5", colorClasses[rarity - 1])}
                  >
                    <div className="-mt-1.5 text-lg leading-tight">
                      <span className="text-shadow-glow text-lg leading-tight">
                        {cardTitle}
                      </span>
                      <span className="text-xs ml-2 mr-1 opacity-65">
                        {t(`card.common.rarity.${rarity}`)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative flex flex-row gap-2 justify-center items-start w-full">
                <div
                  className="aspect-square rounded-xl border-[3px] ring-2 ring-foreground w-20 relative overflow-hidden"
                  style={{
                    backgroundColor: background.b,
                    borderColor,
                  }}
                >
                  <div className="aspect-square w-full p-0">
                    <img
                      src={`/spells/SpellCardIcon_${i}.png`}
                      className="max-w-full max-h-full"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-start items-stretch gap-1 p-0.5">
                  <div className="flex flex-row flex-wrap text-left break-keep text-sm gap-x-2">
                    {stats.map((stat, i) => {
                      const statString = StatType[stat];
                      const statCoefficient =
                        coefficient[i] === "p" ? targetCard.p : coefficient[i];
                      return (
                        <div key={stat}>
                          <img
                            src={`/icons/Icon_${statString}.png`}
                            className="w-4 h-4 inline-block mr-1"
                          />
                          {t(`stat.${statString}`)} +
                          {(Array.isArray(statCoefficient)
                            ? statCoefficient[cardLevel]
                            : statCoefficient) / 100}
                          %
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-col text-left break-keep text-sm">
                    {cardDescription.split("\n").map((l, i) => {
                      return (
                        <div key={i}>
                          {l.split("*").map((c, j) => {
                            return (
                              <span
                                key={j}
                                className={cn(
                                  "text-sm",
                                  j % 2 === 1 && "text-emerald-500"
                                )}
                              >
                                {c}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Cards;
