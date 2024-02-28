import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguaeDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguaeDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.DEV,
    fallbackLng: "ko",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ko: {
        translation: {
          chara: {
            Alice: "앨리스",
            Allet: "알레트",
            Amelia: "아멜리아",
            Ashur: "에슈르",
            Aya: "아야",
            Belita: "벨리타",
            Beni: "베니",
            BigWood: "빅우드",
            Butter: "버터",
            Canna: "칸나",
            Carren: "카렌",
            Chloe: "클로에",
            Chopi: "쵸피",
            Cuee: "큐이",
            Daya: "다야",
            Diana: "디아나",
            Elena: "엘레나",
            Epica: "에피카",
            Erpin: "에르핀",
            Espi: "에스피",
            Festa: "페스타",
            Fricle: "프리클",
            Gabia: "가비아",
            Hilde: "힐데",
            Ifrit: "이프리트",
            Jade: "제이드",
            Jubee: "쥬비",
            Kidian: "키디언",
            Kommy: "코미",
            Lazy: "레이지",
            Leets: "리츠",
            Levi: "레비",
            MaestroMK2: "마에스트로 2호",
            Mago: "마고",
            Maison: "메죵",
            Marie: "마리",
            Mayo: "마요",
            Meluna: "멜루나",
            Mynx: "밍스",
            Naia: "나이아",
            Ner: "네르",
            Patula: "파트라",
            Picora: "피코라",
            Posher: "포셔",
            Rim: "림",
            Rohne: "로네",
            Rude: "루드",
            Rufo: "루포",
            Sari: "사리",
            Selline: "셀리네",
            Shady: "셰이디",
            Silphir: "실피르",
            Sist: "시스트",
            Speaki: "스피키",
            Sylla: "실라",
            Taida: "타이다",
            Tig: "티그",
            Ui: "우이",
            Velvet: "벨벳",
            Veroo: "베루",
            Vivi: "비비",
            xXionx: "시온 더 다크불릿",
            Yumimi: "유미미",
          },
          board: {
            AttackBoth: "공격력",
            // AttackPhysic: "물리 공격력",
            CriticalMult: "치명 피해",
            CriticalMultResist: "치명 피해 저항",
            CriticalRate: "치명타",
            CriticalResist: "치명타 저항",
            DefenseMagic: "마법 방어력",
            DefensePhysic: "물리 방어력",
            // Healing: "",
            Hp: "HP",
          },
          stat: {
            AttackMagic: "마법 공격력",
            AttackPhysic: "물리 공격력",
            CriticalMult: "치명 피해",
            CriticalMultResist: "치명 피해 저항",
            CriticalRate: "치명타",
            CriticalResist: "치명타 저항",
            DefenseMagic: "마법 방어력",
            DefensePhysic: "물리 방어력",
            Hp: "HP",
          },
          lab: {
            effect: {
              0: "공물량 {{0}}% 증가",
              1: "공물 최대 누적 시간 {{0}}분 증가",
              10: "개당 생산 시간 {{0}}% 감소",
              11: "생산 슬롯 {{0}}개 증가",
              20: "모험회 일일 최대 횟수 {{0}} 증가",
              21: "표시되는 태스크 {{0}}개 추가",
              22: "모험회 성공 확률 {{0}}% 증가",
              30: "연회장 주방 화구 {{0}}개 증가",
              40: "{{1}} {{2}} {{0}} 증가",
              41: "침략 시작 코인 {{0}} 증가",
            },
          },
          personality: {
            Cool: "냉정",
            Gloomy: "우울",
            Jolly: "활발",
            Mad: "광기",
            Naive: "순수",
          },
          attack: {
            Magic: "마법",
            Physic: "물리",
          },
          position: {
            Front: "전열",
            Middle: "중열",
            Back: "후열",
          },
          class: {
            Class_0001: "딜러",
            Class_0002: "탱커",
            Class_0003: "서포터",
          },
          race: {
            Dragon: "용족",
            Elf: "엘프",
            Fairy: "요정",
            Furry: "수인",
            Ghost: "유령",
            Spirit: "정령",
            Witch: "마녀",
          },
          ui: {
            index: {
              title: "트릭컬 노트",
              description: "내 성장 현황 메모하기",
              reportBoard: "보드판 스크린샷을 제보해 주세요",
              theme: {
                title: "테마",
                light: "라이트",
                dark: "다크",
                system: "시스템",
              },
              personality: "성격",
              defaultstar: "초기 성급",
              attack: "공격 타입",
              position: "배치 열",
              class: "역할군",
              race: "종족",
              fileSync: {
                success: "성공적으로 데이터를 가져왔습니다.",
                notProperSignature: "파일 형식이 올바르지 않습니다.",
                incorrectPadding: "파일 패딩이 올바르지 않습니다.",
                noFileProvided: "파일이 제공되지 않았습니다.",
                invalidFileInput: "파일이 올바르지 않습니다.",
              },
              newCharacterAlert: "사도 목록 변경을 감지했습니다.\n미보유 캐릭터 설정을 다시 확인해 주세요.",
              repairedAlert: "데이터 변경이 감지되었습니다.\n데이터가 올바르게 복구되었는지 다시 확인해 주세요.",
              gameCopyright: "Trickcal copyrighted by EPIDGames",
              sitePoweredBy: "Trickcal Note powered by Triple",
            },
            board: {
              title: "최상급 보드 노트",
              description: "전체 스탯 % 보드 현황을 체크합니다.",
              subDescription: "나만 황크 안 나와",
              board1: "1차 보드",
              board2: "2차 보드",
              board3: "3차 보드",
              settings: "설정",
              // selectBoardIndex: "보드 차수 선택",
              selectBoardType: "보드 종류 선택",
              selectBoardTypeAll: "모두 표시",
              selectBoardTypeRecommended: "추천 설정",
              mainClassification: "대분류",
              subClassification: "소분류",
              allStatPercentTotal: "전체 % 스탯 총합",
              usedCount: "{{0}}개 사용",
              usedCountLabel: "사용 개수",
              crayonCountUnit: "개",
              usedMax: "MAX",
              remainToMax: "MAX-{{0}}개",
              dataIncompleteStatus: "(데이터 미완성 {{0}}/{{1}})",
              notOwned: "미보유",
              bestRouteExample: "최적 경로 예시",
              aboutBestRouteTitle: "최적 경로에 대하여",
              aboutBestRouteDescription:
                "최적 경로 예시에서는 최상급 크레파스를 가장 적게 사용하는 경로, 같다면 상급 크레파스를 가장 적게 사용하는 경로, 같다면 그 중 가장 짧은 경로를 보여드립니다.",
              numberOfImportantTiles: "경로상의 중요 칸 수",
              importantBoardTilesBefore: "경로상의 ",
              importantBoardTilesAfter: "",
              importantBoardTilesMultiple: "x",
              importantBoardCombination: "가능한 특수 칸 조합",
            },
            equiprank: {
              title: "랭크 메모장",
              description: "사도들의 장비 랭크를 메모합니다.",
              subDescription: "메모 안 하면 헷갈려",
              rankText: "RANK {{0}}",
              reqLevel: "RANK {{0}} 필요 레벨: {{1}}",
              settings: "설정",
              allStatTotal: "전체 적용 스탯 총합",
              targetStat: "목표 스탯",
              selectTargetStatAll: "모두 표시",
              selectTargetStatRecommended: "추천 설정",
              viewAllStatWithBoard: "특수 보드 스탯 포함",
              shouldSetTargetStat: "목표 스탯을 먼저 설정해주세요!",
              input: "랭크 입력",
              rankView: "랭크 보기",
              targetView: "목표 보기",
              rankMinMax: "최소/최대 랭크",
              applyMinMax: "최소/최대 랭크 적용",
              rankProgressTitle: "진행 현황",
              aboutApplyMinMax:
                "붉은 색으로 표시된 랭크가 모두 맞는지 확인 후,\n최소/최대 랭크 적용 버튼을 눌러주세요.",
              aboutSortingCriteria:
                "사도 정렬 순서는 가나다순입니다.\n사도 정렬 기준을 가나다순으로 변경한 후 시작하세요.",
              allRankBonusesTitle: "랭크 전체 효과",
              rankSingleText: "RANK",
              hasSameRankBonusTitle: "같은 랭크 효과를 가진 다른 사도",
              noSameRankBonus: "같은 랭크 효과를 가진 다른 사도가 없습니다.",
            },
            lab: {
              title: "교단 연구 노트",
              description: "교단의 연구 현황을 체크합니다.",
              subDescription: "루포야 일하자",
              cumulativeEffect: "누적 효과",
              remainMaterials: "남은 재료",
              remainMaterialsDepth1: "전체 단계",
              remainMaterialsDepth2: "현재 단계",
            },
            charaSelect: {
              title: "캐릭터 선택",
              owned: "보유중",
              unowned: "미보유",
              allOwned: "모두 보유",
              allUnowned: "모두 미보유",
              searchByName: "이름으로 검색",
              reset: "초기화",
              select: "선택",
              apply: "적용",
              cancel: "취소",
            },
            common: {
              unownedCharacters: "미보유 캐릭터",
              backUpAndRestore: "백업 및 복원",
              backUp: "파일로 백업",
              restore: "파일에서 복원",
            },
          },
        },
      },
    },
  });

export default i18n;
