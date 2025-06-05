import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import Select from "@/components/common/combobox-select";
import soloraidstat from "@/data/soloraidstat";
import { StatType } from "@/types/enums";
import { Separator } from "@/components/ui/separator";

const RaidBossStatDialog = ({
  stat,
  apply,
}: {
  stat: StatType;
  apply: (value: number) => void;
}) => {
  const { t } = useTranslation();
  const [stage, setStage] = useState(15);
  const [bossSeason, setBossSeason] = useState("");
  const [currentBoss, setCurrentBoss] = useState<
    null | (typeof soloraidstat)["s"][string][number]
  >(null);
  useEffect(() => {
    if (!stage || !bossSeason) setCurrentBoss(null);
    else {
      const searchedBoss = soloraidstat.s[bossSeason].find(
        (s) => s.s === stage
      );
      if (searchedBoss) setCurrentBoss(searchedBoss);
      else setCurrentBoss(null);
    }
  }, [bossSeason, stage]);
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm">
          <Search className="w-4 h-4 mr-2 inline" />
          보스별 요구 스탯 검색
        </Button>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="text-lg">보스 선택</div>
        <div className="flex flex-row gap-2">
          <Select
            value={stage}
            setValue={(v) => {
              if (v !== stage) setBossSeason("");
              setStage(v);
            }}
            items={Array(10)
              .fill(0)
              .map((_, v) => ({
                value: v + 15,
                label: `${v + 15}단계`,
              }))}
          />
          <Select
            value={bossSeason}
            setValue={(v) => setBossSeason(v)}
            items={
              Object.entries(soloraidstat.s)
                .map(([season, bossEntries]) => {
                  const boss = bossEntries.find((v) => v.s === stage);
                  if (!boss) return null;
                  return {
                    value: season,
                    label: `${season}시즌 - ${t(`monster.${boss.b}`)}`,
                  };
                })
                .filter((e) => e !== null) as { value: string; label: string }[]
            }
            placeholder="보스 선택..."
          />
        </div>
        {currentBoss ? (
          <>
            <Separator />
            <div className="px-2 py-1">
              <div className="text-lg">요구 스탯</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 mt-2">
                <div className="flex flex-row justify-between px-4 py-1 sm:py-2">
                  <div>
                    <img
                      src="/icons/Icon_AttackPhysic.webp"
                      className="w-5 h-5 inline mr-1"
                    />
                    물리 공격력
                  </div>
                  <div>{currentBoss.p.toLocaleString()}</div>
                </div>
                <div className="flex flex-row justify-between px-4 py-1 sm:py-2">
                  <div>
                    <img
                      src="/icons/Icon_AttackMagic.webp"
                      className="w-5 h-5 inline mr-1"
                    />
                    마법 공격력
                  </div>
                  <div>{currentBoss.m.toLocaleString()}</div>
                </div>
                <div className="flex flex-row justify-between px-4 py-1 sm:py-2">
                  <div>
                    <img
                      src="/icons/Icon_CriticalRate.webp"
                      className="w-5 h-5 inline -mr-1"
                    />
                    <img
                      src="/icons/Icon_CriticalMult.webp"
                      className="w-5 h-5 inline mr-1"
                    />
                    치명 스탯
                  </div>
                  <div>{currentBoss.c.toLocaleString()}</div>
                </div>
                <div className="flex flex-row justify-between px-4 py-1 sm:py-2">
                  <div>
                    <img
                      src="/icons/Icon_CriticalResist.webp"
                      className="w-5 h-5 inline -mr-1"
                    />
                    <img
                      src="/icons/Icon_CriticalMultResist.webp"
                      className="w-5 h-5 inline mr-1"
                    />
                    저항 스탯
                  </div>
                  <div>{currentBoss.r.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <Separator />
            <div className="px-2 py-1">
              <div className="text-lg">체력</div>
              <div className="mt-2 p-1">
                <div>
                  <img
                    src="/icons/Icon_Hp.webp"
                    className="w-5 h-5 inline mr-1"
                  />
                  {currentBoss.h.toLocaleString()}{" "}
                  {currentBoss.h !== 0 && (
                    <span className="text-red-600/90 dark:text-red-400/90">
                      (받는 최종 피해 감소 {currentBoss.l / 100}%)
                    </span>
                  )}
                </div>
              </div>
              {currentBoss.h !== 0 && (
                <div className="text-right">
                  실질{" "}
                  <img
                    src="/icons/Icon_Hp.webp"
                    className="w-5 h-5 inline mr-1"
                  />
                  {Math.round(
                    (currentBoss.h * 10000) / (10000 - currentBoss.l)
                  ).toLocaleString()}
                </div>
              )}
            </div>
            <div className="opacity-75 text-xs text-center">
              보스별 요구 스탯은 추정치이며 정확하지 않을 수 있습니다.
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="submit"
                  onClick={() =>
                    apply(
                      [
                        currentBoss.m,
                        currentBoss.p,
                        currentBoss.c + 10120,
                        currentBoss.r + 1480,
                        currentBoss.c + 2000,
                        currentBoss.r + 500,
                        0,
                        0,
                        0,
                      ][stat]
                    )
                  }
                >
                  <img
                    src={`/icons/Icon_${StatType[stat]}.webp`}
                    className="w-5 h-5 inline mr-1"
                  />
                  {[
                    currentBoss.m,
                    currentBoss.p,
                    currentBoss.c + 10120,
                    currentBoss.r + 1480,
                    currentBoss.c + 2000,
                    currentBoss.r + 500,
                    0,
                    0,
                    0,
                  ][stat].toLocaleString()}
                  &nbsp; 적용
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <div className="opacity-75 text-center py-6">
            보스를 선택해주세요!
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RaidBossStatDialog;
