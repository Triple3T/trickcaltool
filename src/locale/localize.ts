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
          board: {
            AttackMagic: "마법 공격력",
            AttackPhysic: "물리 공격력",
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
              title: '트릭컬 툴',
              description: '트릭컬 잡동사니 툴 모음집',
              theme: {
                title: '테마',
                light: '라이트',
                dark: '다크',
                system: '시스템',
              },
              personality: '성격',
              defaultstar: '초기 성급',
              attack: '공격 타입',
              position: '배치 열',
              class: '역할군',
              race: '종족',
              fileSync: {
                success: '성공적으로 데이터를 가져왔습니다.',
                notProperSignature: '파일 형식이 올바르지 않습니다.',
                incorrectPadding: '파일 패딩이 올바르지 않습니다.',
                noFileProvided: '파일이 제공되지 않았습니다.',
                invalidFileInput: '파일이 올바르지 않습니다.',
              },
            },
            board: {
              title: "크레용 노트",
              board1: "1차 보드",
              board2: "2차 보드",
              board3: "3차 보드",
              settings: "설정",
              selectBoard: "보드 차수 선택",
              mainClassification: "대분류",
              subClassification: "소분류",
              allStatPercentTotal: "전체 % 스탯 총합",
              usedCount: "{{0}}개 사용",
              usedCountLabel: "사용 개수",
              crayonCountUnit: "개",
              usedMax: "MAX",
              remainToMax: "MAX-{{0}}개",
              dataIncompleteStatus: "(데이터 미완성 {{0}}/{{1}})",
            },
            equiprank: {
              title: "랭크 메모장",
              rankText: "RANK {{0}}",
              reqLevel: "RANK {{0}} 필요 레벨: {{1}}",
              settings: "설정",
              allStatTotal: "전체 적용 스탯 총합",
              targetStat: "목표 스탯",
              input: "랭크 입력",
              rankView: "랭크 보기",
              targetView: "목표 보기",
              rankMinMax: "최소/최대 랭크",
              applyMinMax: "최소/최대 랭크 적용",
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
