import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguaeDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguaeDetector)
  .use(initReactI18next)
  .init({
    debug: true,
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
              personality: '성격',
              defaultstar: '초기 성급',
              attack: '공격 타입',
              position: '배치 열',
              class: '역할군',
              race: '종족',
            },
            board: {
              title: "크레용 노트",
              board1: "1차 보드",
              board2: "2차 보드",
              board3: "3차 보드",
              settings: "설정",
              unownedCharacters: "미보유 캐릭터",
              selectCharacter: "캐릭터 선택",
              selectBoard: "보드 차수 선택",
              mainClassification: "대분류",
              subClassification: "소분류",
              allStatPercentTotal: "전체 % 스탯 총합",
              backUpAndRestore: "백업 및 복원",
              backUp: "파일로 백업",
              restore: "파일에서 복원",
              usedCount: "{{0}}개 사용",
              usedCountLabel: "사용 개수",
              crayonCountUnit: "개",
              usedMax: "MAX",
              remainToMax: "MAX-{{0}}개",
              dataIncompleteStatus: "(데이터 미완성 {{0}}/{{1}})",
            },
            rank: {
              title: '랭크 노트',
            },
          },
        },
      },
    },
  });

export default i18n;
