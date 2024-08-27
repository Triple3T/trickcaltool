import { useState } from "react";
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
  const [stage, setStage] = useState("15");
  const [bossId, setBossId] = useState("");
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
              if (v !== stage) setBossId("");
              setStage(v);
            }}
            items={Object.keys(soloraidstat.s).map((v) => ({
              value: v,
              label: `${v}단계`,
            }))}
          />
          <Select
            value={bossId}
            setValue={(v) => setBossId(v)}
            items={Object.keys(soloraidstat.s[stage]).map((v) => ({
              value: v,
              label: t(`monster.${v}`),
            }))}
            placeholder="보스 선택..."
          />
        </div>
        {stage && bossId ? (
          <>
            <Separator />
            <div className="px-2 py-1">
              <div className="text-lg">요구 스탯</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 mt-2">
                <div className="flex flex-row justify-between px-4 py-1 sm:py-2">
                  <div>
                    <img
                      src="/icons/Icon_AttackPhysic.png"
                      className="w-5 h-5 inline mr-1"
                    />
                    물리 공격력
                  </div>
                  <div>{soloraidstat.s[stage][bossId].p.toLocaleString()}</div>
                </div>
                <div className="flex flex-row justify-between px-4 py-1 sm:py-2">
                  <div>
                    <img
                      src="/icons/Icon_AttackMagic.png"
                      className="w-5 h-5 inline mr-1"
                    />
                    마법 공격력
                  </div>
                  <div>{soloraidstat.s[stage][bossId].m.toLocaleString()}</div>
                </div>
                <div className="flex flex-row justify-between px-4 py-1 sm:py-2">
                  <div>
                    <img
                      src="/icons/Icon_CriticalRate.png"
                      className="w-5 h-5 inline -mr-1"
                    />
                    <img
                      src="/icons/Icon_CriticalMult.png"
                      className="w-5 h-5 inline mr-1"
                    />
                    치명 스탯
                  </div>
                  <div>{soloraidstat.s[stage][bossId].c.toLocaleString()}</div>
                </div>
                <div className="flex flex-row justify-between px-4 py-1 sm:py-2">
                  <div>
                    <img
                      src="/icons/Icon_CriticalResist.png"
                      className="w-5 h-5 inline -mr-1"
                    />
                    <img
                      src="/icons/Icon_CriticalMultResist.png"
                      className="w-5 h-5 inline mr-1"
                    />
                    저항 스탯
                  </div>
                  <div>{soloraidstat.s[stage][bossId].r.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <Separator />
            <div className="px-2 py-1">
              <div className="text-lg">체력</div>
              <div className="mt-2 p-1">
                <div>
                  <img
                    src="/icons/Icon_Hp.png"
                    className="w-5 h-5 inline mr-1"
                  />
                  {soloraidstat.s[stage][bossId].h.toLocaleString()}{" "}
                  {soloraidstat.s[stage][bossId].h !== 0 && (
                    <span className="text-red-600/90 dark:text-red-400/90">
                      (받는 피해 감소 {soloraidstat.s[stage][bossId].l / 100}%)
                    </span>
                  )}
                </div>
              </div>
              {soloraidstat.s[stage][bossId].h !== 0 && (
                <div className="text-right">
                  실질{" "}
                  <img
                    src="/icons/Icon_Hp.png"
                    className="w-5 h-5 inline mr-1"
                  />
                  {Math.round(
                    (soloraidstat.s[stage][bossId].h * 10000) /
                      (10000 - soloraidstat.s[stage][bossId].l)
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
                        soloraidstat.s[stage][bossId].m,
                        soloraidstat.s[stage][bossId].p,
                        soloraidstat.s[stage][bossId].c + 10120,
                        soloraidstat.s[stage][bossId].r - 1480,
                        soloraidstat.s[stage][bossId].c,
                        soloraidstat.s[stage][bossId].r,
                        0,
                        0,
                        0,
                      ][stat]
                    )
                  }
                >
                  <img
                    src={`/icons/Icon_${StatType[stat]}.png`}
                    className="w-5 h-5 inline mr-1"
                  />
                  {[
                    soloraidstat.s[stage][bossId].m,
                    soloraidstat.s[stage][bossId].p,
                    soloraidstat.s[stage][bossId].c + 10120,
                    soloraidstat.s[stage][bossId].r - 1480,
                    soloraidstat.s[stage][bossId].c,
                    soloraidstat.s[stage][bossId].r,
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
