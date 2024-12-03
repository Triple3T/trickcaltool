import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import AtkDefGraph from "./atkdefgraph";
import CritDmgGraph from "./critdmggraph";

const DealDesc = () => {
  return (
    <div className="mx-auto max-w-xl">
      <Card className="max-w-xl px-2 py-4">
        <div className="text-2xl">피해량 계산식</div>
        <div className="mt-4 flex flex-wrap items-baseline gap-y-1 justify-center">
          {/* 기본 피해량 */}
          <div className="inline-flex text-lg rounded-full ring-1 ring-red-900 h-8 items-center">
            <div className="bg-red-300/75 w-7 h-7 m-0.5 rounded-full overflow-hidden flex justify-center items-center">
              <img
                src="/icons/Icon_AttackPhysic.png"
                alt="물리 공격력"
                className="w-5 h-5 inline-block -ml-1.5 -mr-0.5"
              />
              <img
                src="/icons/Icon_AttackMagic.png"
                alt="마법 공격력"
                className="w-5 h-5 inline-block -ml-1.5 -mr-0.5"
              />
            </div>
            <div className="text-red-600 pl-1 pr-3">기본 피해량</div>
          </div>
          <X className="w-6 h-6 m-1" />
          {/* 성격 상성 */}
          <div className="inline-flex text-lg rounded-full ring-1 ring-yellow-900 h-8 items-center">
            <div className="bg-yellow-300/90 w-7 h-7 m-0.5 rounded-full overflow-hidden flex justify-center items-center">
              <img
                src="/icons/Common_UnitPersonality_None.png"
                alt="성격"
                className="w-5 h-5 inline-block -ml-0.5"
              />
            </div>
            <div className="text-yellow-700 pl-1 pr-3">성격 상성</div>
          </div>
          <X className="w-6 h-6 m-1" />
          {/* 공컷 계수 */}
          <div className="inline-flex text-lg rounded-full ring-1 ring-green-900 h-8 items-center">
            <div className="bg-green-300/75 w-7 h-7 m-0.5 rounded-full overflow-hidden flex justify-center items-center">
              <img
                src="/icons/Icon_DefensePhysic.png"
                alt="물리 방어력"
                className="w-5 h-5 inline-block -ml-1.5 -mr-0.5"
              />
              <img
                src="/icons/Icon_DefenseMagic.png"
                alt="마법 방어력"
                className="w-5 h-5 inline-block -ml-1.5 -mr-0.5"
              />
            </div>
            <div className="text-green-600 pl-1 pr-3">공컷 계수</div>
          </div>
          <X className="w-6 h-6 m-1" />
          {/* 치명 피해 계수 */}
          <div className="inline-flex text-lg rounded-full ring-1 ring-blue-900 h-8 items-center">
            <div className="bg-blue-300/75 w-7 h-7 m-0.5 rounded-full overflow-hidden flex justify-center items-center">
              <img
                src="/icons/Icon_CriticalMult.png"
                alt="물리 방어력"
                className="w-5 h-5 inline-block -ml-1.5 -mr-0.5"
              />
              <img
                src="/icons/Icon_CriticalMultResist.png"
                alt="마법 방어력"
                className="w-5 h-5 inline-block -ml-1.5 -mr-0.5"
              />
            </div>
            <div className="text-blue-600 pl-1 pr-3">치명 피해 계수</div>
          </div>
          <X className="w-6 h-6 m-1" />
          {/* 피해량 */}
          <div className="inline-flex text-lg rounded-full ring-1 ring-purple-900 h-8 items-center">
            <div className="bg-purple-300/75 w-7 h-7 m-0.5 rounded-full overflow-hidden flex justify-center items-center">
              <img
                src="/icons/Icon_Status_Up.png"
                alt="상승"
                className="w-5 h-5 inline-block -ml-0.5"
              />
            </div>
            <div className="text-purple-600 pl-1 pr-3">피해량</div>
          </div>
          <X className="w-6 h-6 m-1" />
          {/* 피해 감소 */}
          <div className="inline-flex text-lg rounded-full ring-1 ring-slate-900 h-8 items-center">
            <div className="bg-slate-300/75 w-7 h-7 m-0.5 rounded-full overflow-hidden flex justify-center items-center">
              <img
                src="/icons/Icon_Status_Down.png"
                alt="하락"
                className="w-5 h-5 inline-block -ml-0.5"
              />
            </div>
            <div className="text-slate-600 pl-1 pr-3">받는 최종 피해 감소</div>
          </div>
        </div>
      </Card>
      {/* 기본 피해량 */}
      <div className="h-4" />
      <Card className="bg-red-300/50 p-4 max-w-xl">
        <div className="flex flex-row flex-wrap sm:flex-nowrap items-baseline justify-between px-1">
          <div className="text-xl text-red-600 text-left flex-shrink-0">
            기본 피해량
          </div>
          <div className="text-right break-keep flex-auto">
            공격력&nbsp;×&nbsp;계수 (또는&nbsp;별도&nbsp;수식)
          </div>
        </div>
        <div className="mt-4 text-sm break-keep">
          기본 피해량은 <u>공격자의 공격력과 계수</u>를 곱해 산출됩니다.
          공격자의 공격 타입이 물리인 경우 물리 공격력이, 마법인 경우 마법
          공격력이 적용됩니다. 다른 스탯을 기반으로 하는 경우 별도 표시된 설명을
          따릅니다.
        </div>
      </Card>
      {/* 성격 상성 */}
      <div className="h-4" />
      <Card className="bg-yellow-300/60 p-4 max-w-xl">
        <div className="flex flex-row flex-wrap sm:flex-nowrap items-baseline justify-between px-1">
          <div className="text-xl text-yellow-700 text-left flex-shrink-0">
            성격 상성
          </div>
          <div className="text-right break-keep flex-auto">
            75% 또는&nbsp;100% 또는&nbsp;150%
          </div>
        </div>
        <div className="mt-4 text-sm break-keep">
          성격 상성은 <u>공격자와 피격자의 성격</u>에 따라, 강한 성격이 약한
          성격에게 150%, 약한 성격이 강한 성격에게 75%, 이외의 경우 100%가
          부여됩니다.
        </div>
      </Card>
      {/* 공컷 계수 */}
      <div className="h-4" />
      <Card className="bg-green-300/50 p-4 max-w-xl">
        <div className="flex flex-row flex-wrap sm:flex-nowrap items-baseline justify-between px-1">
          <div className="text-xl text-green-600 text-left flex-shrink-0">
            공컷 계수
          </div>
          <div className="text-right break-keep flex-auto">
            0.05&nbsp;~&nbsp;0.80 (또는&nbsp;1.00)
          </div>
        </div>
        <div className="mt-4 text-sm break-keep">
          공컷 계수는 <u>공격자의 공격력</u>과 <u>피격자의 방어력의 절반</u>을
          연산해 주어집니다. 최소 0.05, 최대 0.80의 계수가 부여됩니다. 단,
          광기의 가면 피해와 같이 공격력 비례 피해가 아닌 경우 건너뜁니다(1.00
          부여).
        </div>
        <div className="mt-4">
          <div className="text-xs opacity-75 text-right">
            공컷 계수 연산 그래프
          </div>
          <AtkDefGraph className="w-full rounded-lg" />
        </div>
      </Card>
      {/* 치명 피해 계수 */}
      <div className="h-4" />
      <Card className="bg-blue-300/50 p-4 max-w-xl">
        <div className="flex flex-row flex-wrap sm:flex-nowrap items-baseline justify-between px-1">
          <div className="text-xl text-blue-600 text-left flex-shrink-0">
            치명 피해 계수
          </div>
          <div className="text-right break-keep flex-auto">
            치명타인&nbsp;경우 1.15&nbsp;~&nbsp;4.00 (아닌&nbsp;경우&nbsp;1.00)
          </div>
        </div>
        <div className="mt-4 text-sm break-keep">
          치명 피해 계수는 치명타일 경우에만 곱해지며,{" "}
          <u>공격자의 치명 피해 스탯</u>과 <u>피격자의 치명 피해 저항 스탯</u>을
          연산해 주어집니다. 최소 1.15, 최대 4.00의 계수가 부여됩니다. 치명타가
          아닌 경우 건너뜁니다(1.00 부여).
        </div>
        <div className="mt-4">
          <div className="text-xs opacity-75 text-right">
            치피 계수 연산 그래프
          </div>
          <CritDmgGraph className="w-full rounded-lg" />
        </div>
      </Card>
      {/* 피해량 */}
      <div className="h-4" />
      <Card className="bg-purple-300/50 p-4 max-w-xl">
        <div className="flex flex-row flex-wrap sm:flex-nowrap items-baseline justify-between px-1">
          <div className="text-xl text-purple-600 text-left flex-shrink-0">
            피해량
          </div>
          <div className="text-right break-keep flex-auto">
            100% +&nbsp;피해량&nbsp;증가 -&nbsp;피해량&nbsp;감소
            +&nbsp;받는&nbsp;피해량&nbsp;증가 -&nbsp;받는&nbsp;피해량&nbsp;감소
          </div>
        </div>
        <div className="mt-4 text-sm break-keep">
          피해량은 <u>공격자의 피해량 증가/감소 효과</u>와{" "}
          <u>피격자의 받는 피해량 증가/감소 효과</u>를 합해 산출됩니다. 시너지,
          스킬, 아티팩트 및 스펠, 배틀 아이템, 어사이드 효과 등이 포함되며, 최소
          25%의 값을 가집니다.
        </div>
      </Card>
      {/* 피해 감소 */}
      <div className="h-4" />
      <Card className="bg-slate-300/50 p-4 max-w-xl">
        <div className="flex flex-row flex-wrap sm:flex-nowrap items-baseline justify-between px-1">
          <div className="text-xl text-slate-600 text-left flex-shrink-0">
            받는 최종 피해 감소
          </div>
          <div className="text-right break-keep flex-auto">
            일부 컨텐츠만 적용
          </div>
        </div>
        <div className="mt-4 text-sm break-keep">
          숨겨진 별도 보정 값이 있는 경우 적용합니다. 줘팸터의 경우 20%, 일부
          대충돌/프론티어 보스의 경우 25%~82.5%만큼 받는 최종 피해가 감소합니다.
        </div>
      </Card>
    </div>
  );
};

export default DealDesc;
