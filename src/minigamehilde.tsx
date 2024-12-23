import { Fragment, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RotateCcw } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import minigamedataproto from "@/data/minigamehilde.json";
interface MinigameData {
  dialog: string;
  name: string;
  judge: string;
}

const minigameData: Record<string, Omit<MinigameData, "name">[]> = {};
(minigamedataproto as MinigameData[]).forEach(
  ({ name, ...rest }) =>
    (minigameData[name] = [...(minigameData[name] || []), rest])
);

const MiniGameHilde = () => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resetInput = useCallback(() => {
    setKeyword("");
    inputRef.current?.focus();
  }, []);

  return (
    <div className="font-onemobile max-w-96 mx-auto">
      <div className="flex flex-row">
        <Input
          ref={inputRef}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="이름이나 대사로 검색..."
        />
        <button
          onClick={resetInput}
          className="ml-2 px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded aspect-square"
        >
          <RotateCcw className="w-full aspect-square" />
        </button>
      </div>

      <Virtuoso
        useWindowScroll
        overscan={128}
        className="mt-4"
        data={Object.entries(minigameData).filter(([chara, datas]) =>
          keyword
            ? (t(`chara.${chara}`).includes(keyword) ? 1 : 0) +
              datas.filter((data) => data.dialog.includes(keyword)).length
            : true
        )}
        itemContent={(_, [chara, datas]) => {
          const filtered =
            !keyword || t(`chara.${chara}`).includes(keyword)
              ? datas
              : datas.filter((data) => data.dialog.includes(keyword));
          return (
            <div className="py-2">
              <Card className="p-4 object-cover max-w-full">
                <div className="flex flex-row gap-4 items-stretch">
                  <img
                    src={`/charas/${chara}.png`}
                    className="aspect-square w-12 h-12"
                  />
                  <div className="flex flex-col justify-between text-left">
                    <div className="text-xl">{t(`chara.${chara}`)}</div>
                    <div className="text-sm opacity-80">
                      {keyword
                        ? `${filtered.length}건 일치`
                        : `전체 ${datas.length}건`}
                    </div>
                  </div>
                </div>
                <div className="grid mt-4 group grid-cols-[1fr_5rem] rounded border-slate-500/75 border overflow-hidden">
                  {filtered
                    .sort((a, b) => a.judge.localeCompare(b.judge))
                    .map((data, i) => {
                      return (
                        <Fragment key={data.dialog}>
                          <div
                            className={cn(
                              i % 2 ? "bg-slate-200 dark:bg-slate-800" : "",
                              "px-2 py-1 break-keep border-r border-slate-500/75 flex justify-center items-center"
                            )}
                          >
                            {data.dialog}
                          </div>
                          <div
                            className={cn(
                              i % 2 ? "bg-slate-200 dark:bg-slate-800" : "",
                              "text-sm opacity-95 px-2 py-1 flex justify-center items-center"
                            )}
                          >
                            {data.judge}
                          </div>
                        </Fragment>
                      );
                    })}
                </div>
              </Card>
            </div>
          );
        }}
      />
    </div>
  );
};

export default MiniGameHilde;
