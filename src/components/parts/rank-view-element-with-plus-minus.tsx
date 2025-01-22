import { Info, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import chara from "@/data/chara";
import eqrank from "@/data/eqrank";
import { Personality } from "@/types/enums";
import { personalityBG } from "@/utils/personalityBG";
import { useCallback, useMemo } from "react";

interface IRankDialogProp {
  chara: string;
  charaTypes: string;
  rank: number;
  rankStats: number[][][];
  sameRankBonus: string[];
  maxRank: number;
  changeRank: (chara: string, rank: number) => void;
  skin?: number;
}

interface IRankViewElementWithPlusMinusProps {
  enableDialog: boolean;
  rank: number;
  skin?: number;
  maxRank: number;
  charaName:string;
  setRankDialogProp: (prop: IRankDialogProp) => void;
  setRankDialogOpened: (opened: boolean) => void;
  rankModify: (chara: string, rank: number) => void;
}

const RankViewElementWithPlusMinus = ({
  enableDialog,
  rank,
  skin,
  maxRank,
  charaName: c,
  setRankDialogProp,
  setRankDialogOpened,
  rankModify,
}:IRankViewElementWithPlusMinusProps) => {
  const rankDialogProp = useMemo(() => ({
    chara: c,
    charaTypes: chara[c].t,
    rank,
    rankStats: eqrank.r[eqrank.c[c].r].map((rs) =>
      rs.map((r) => eqrank.s[r])
    ),
    sameRankBonus: Object.entries(eqrank.c)
      .filter(([k, v]) => k !== c && v.r === eqrank.c[c].r)
      .map(([k]) => k),
    maxRank,
    changeRank: rankModify,
    skin,
  }), [c, maxRank, rank, rankModify, skin]);
  const rankPlus = useCallback(() => {
    rankModify(c, rank + 1);
  }, [c, rank, rankModify]);
  const rankMinus = useCallback(() => {
    rankModify(c, rank - 1);
  }, [c, rank, rankModify]);
  return (
    <div key={c} className="min-w-20 sm:min-w-22 shadow-sm relative pr-5">
      <img
        src={skin ? `/charas/${c}Skin${skin}.png` : `/charas/${c}.png`}
        className={cn(
          personalityBG[Number(chara[c].t[0]) as Personality],
          "aspect-square w-full border-slate-200 dark:border-slate-800 border-2 overflow-hidden rounded relative z-10"
        )}
      />
      {enableDialog && (
        <div className="absolute right-5 top-0 p-1 z-10">
          <Info
            className="h-4 w-4 rounded-full"
            fill="#a0a0a0"
            onClick={() => {
              setRankDialogProp(rankDialogProp);
              setRankDialogOpened(true);
            }}
          />
        </div>
      )}
      <div className="absolute right-0 bottom-0 w-8 break-keep h-max pl-3.5 pr-0.5 py-0.5 flex flex-col items-stretch justify-evenly gap-1 bg-slate-200 dark:bg-slate-800 rounded">
        {rank >= maxRank ? (
          <Plus className="w-4 h-4 opacity-50" />
        ) : (
          <Plus
            className="w-4 h-4"
            onClick={rankPlus}
          />
        )}
        {rank <= 1 ? (
          <Minus className="w-4 h-4 opacity-50" />
        ) : (
          <Minus
            className="w-4 h-4"
            onClick={rankMinus}
          />
        )}
      </div>
    </div>
  );
};

export default RankViewElementWithPlusMinus;
