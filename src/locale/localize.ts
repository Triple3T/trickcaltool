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
            Bana: "바나",
            Belita: "벨리타",
            Beni: "베니",
            BigWood: "빅우드",
            Blanchet: "블랑셰",
            Butter: "버터",
            Canna: "칸나",
            Carren: "카렌",
            Chloe: "클로에",
            Chopi: "쵸피",
            Cuee: "큐이",
            Daya: "다야",
            Diana: "디아나",
            Ed: "이드",
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
            Kyarot: "캬롯",
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
            Rollett: "롤렛",
            Rude: "루드",
            Rufo: "루포",
            Sari: "사리",
            Selline: "셀리네",
            Shady: "셰이디",
            Shoupan: "슈팡",
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
          eldain: {
            1: "영원살이",
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
          myhome: {
            lab: "생산 랩",
            restaurant: "연회장",
            myhome: "본부",
            schedule: "모험회",
            archive: "기록소",
          },
          task: {
            Arbeit1: "코스프레 모델",
            Arbeit2: "엘드 마트 강탈",
            Arbeit3: "자판기 털기",
            Arbeit4: "김장숙 부띠끄 알바",
            Arbeit5: "모에모에빔 주문걸기",
            Arbeit6: "엘프 시청 창문닦이",
            Arbeit7: "도굴 망보기",
            Arbeit8: "닭틀링건 제작",
            Arbeit9: "대관절 양떼목장",
            Arbeit10: "AI 아트 트레이닝",
            Arbeit11: "포션 실험 알바",
            Arbeit12: "족제비와 토끼 사료 주기",
            Arbeit13: "수상한 대표 동상 제작",
            Arbeit14: "엘리베이터 버튼 장난",
            Arbeit15: "동인지 어시",
            Arbeit16: "마요 집 정리",
            Arbeit17: "포레스트 레인저",
            Arbeit18: "루드짐 트레이너",
            Arbeit19: "피규어 채색",
            Arbeit20: "윈스타 맛집 설거지",
            Arbeit21: "크고 길다란 광맥 찾기",
            Arbeit22: "세계수 앞에서 노래부르기",
            Arbeit23: "빼빼로에서 초코벗기기",
            Arbeit24: "가구조립 매뉴얼 읽어주기",
            Arbeit25: "일찍 일어나는 올빼미 조사",
            Arbeit26: "타로 카드 해석하기",
            Arbeit27: "어제 팔리지 않은 빵 판매",
            Arbeit28: "낚시성 뉴스 제목 짓기",
            Arbeit29: "에르핀 모험 준비",
            Arbeit30: "요정 왕국 마을 보수",
            Arbeit31: "수인 미용실",
            Arbeit32: "극장 세트 제작",
            Arbeit33: "인형 분해",
            Arbeit34: "수력발전소",
            Rest1: "누워서 엘플리스 보기",
            Rest2: "산책하기",
            Rest3: "펫 쓰다듬기",
            Rest4: "멜루나 스트리밍",
            Rest5: "술래숨바꼭질",
            Rest6: "때빼고 김내기",
            Rest7: "사도 코인 노래방",
            Rest8: "요술랭 식당 가기",
            Rest9: "이프리트멍",
            Rest10: "쉿은 아니고 쿨",
          },
          lifeskill: {
            1: "육체노동",
            2: "운동신경",
            3: "민첩",
            4: "미모",
            5: "꿀성대",
            6: "애교",
            7: "공대생",
            8: "암산",
            9: "문해력",
            10: "손기술",
            11: "정보력",
            12: "눈치",
            13: "사교",
            14: "카리스마",
            15: "오지랖",
            16: "말빨",
            17: "노예근성",
            18: "참을성",
            19: "집요함",
            20: "유유자적",
            21: "책임감",
            22: "멘탈",
            23: "잡지식",
            24: "하이텐션",
            25: "희생정신",
            26: "결벽증",
            27: "잔소리",
            28: "관종",
            29: "집중력",
            30: "뻔뻔함",
            31: "추진력",
            32: "직감",
            33: "혼자놀기",
            34: "허세작열",
          },
          material: {
            CollectMadeHigh1: "고퀄 일러스트",
            CollectMadeLow1: "혼모노의 증표",
            CollectMadeLow2: "커미션 사용권",
            FoodMadeLow1: "밀가루",
            FoodMadeLow2: "달걀",
            FoodMadeLow3: "새고기",
            FoodMadeLow4: "과일",
            FoodMadeLow5: "초콜릿",
            FoodMadeLow6: "설탕",
            FoodMadeLow7: "육고기",
            FoodMadeLow8: "물고기",
            FoodMadeLow9: "검고 딱딱한 열매",
            FoodMadeLow10: "모듬 곡식",
            FoodMadeLow11: "채소",
            FoodMadeLow12: "꿀",
            FoodMadeLow13: "팩 선생 만능 소스",
            FoodMadeLow14: "우유",
            FoodMadeLow15: "쌀",
            FoodMadeLow16: "치즈",
            FoodMadeLow17: "나뭇잎",
            FoodMadeLow18: "스프링클",
            FurnMadeHigh1: "김덕춘 명인 도안",
            FurnMadeLow1: "구부리",
            FurnMadeLow2: "포인트 장식",
            FurnMadeLow3: "EGO 블럭",
            MadeHigh1: "뾰족뾰족 태엽",
            MadeHigh2: "S전자 반도체",
            MadeHigh3: "배터리 팩",
            MadeHigh4: "LED 전구",
            MadeHigh5: "뾰족 못",
            MadeHigh6: "팅팅탱탱 스프링",
            MadeHigh7: "구비구비 철사",
            MadeHigh8: "MUSIM 칩",
            MadeHigh9: "3W 광택제",
            MadeHigh10: "쭈물럭 점토",
            MadeHigh11: "부들 천",
            MadeHigh12: "모카솜",
            MadeHigh13: "반질반질 종이",
            MadeLow1: "말랑한 나무",
            MadeLow2: "단단한 돌",
            MadeLow3: "스륵스륵 철가루",
            MadeLow4: "바삭바삭 금박",
            MadeLow5: "조각 보석",
            MadeLow6: "반짝 유리",
            MadeLow7: "쪼물딱 점토",
            MadeLow8: "지구에서 온 납",
            MadeLow9: "축축 종이죽",
            MadeLow10: "재활용 플라스틱",
            MadeLow11: "조각조각 기판",
            MadeLow12: "무지개 꽃즙",
            MadeLow13: "뻣뻣한 천조각",
            MadeLow14: "가죽나무 잎",
            MadeLow15: "보송 솜",
            MadeLow16: "고로쇠 수액",
          },
          collection: {
            DollM1: "티그 말랑이 인형",
            DollM2: "버터 말랑이 인형",
            DollM3: "마고 얼굴 인형",
            DollM4: "멜루나 인형",
            DollM5: "버터빵 인형",
            DollM6: "로네 루돌프 인형",
            DollM7: "한복 실피르 인형",
            DollM8: "매우큰절 코미 인형",
            DollS1: "루포 미니 인형",
            DollS2: "베니 미니 인형",
            DollS3: "라쿤아치 미니 인형",
            DollS4: "루파루 미니 인형",
            DollS5: "포셔 미니 인형",
            DollS6: "호박 스피키 인형",
            DollS7: "영춘이 미니 인형",
            DollS8: "골디 복주머니 인형",
            FigureL1: "고모구지 대형 피규어",
            FigureL2: "베니 대형 피규어",
            FigureL3: "셰이디 대형 피규어",
            // FigureL4: "",
            // FigureL5: "",
            FigureL6: "유유자적 티그 피규어",
            FigureL7: "흔들그네 버터 피규어",
            FigureL8: "상큼 나이아 피규어",
            FigureL9: "늘어진 코미 피규어",
            FigureL10: "티타임 비비 피규어",
            FigureL11: "신난 에르핀 피규어",
            FigureL12: "셀리네의 여유 피규어",
            FigureL13: "꾸벅꾸벅 힐데 피규어",
            FigureL14: "연주하는 에피카 피규어",
            FigureL15: "쓰다듬는 앨리스 피규어",
            FigureL16: "신중한 리츠 피규어",
            FigureL17: "틈새 여행족 피코라",
            FigureL19: "티타임 블랑셰 피규어",
            FigureL20: "따뜻한 손맞춤 피규어",
            FigureL21: "드라이버 슈팡 피규어",
            FigureL22: "자란다 캬롯 피규어",
            FigureL23: "공중부양 롤렛 피규어",
            FigureM1: "산사모 중형 피규어",
            FigureM2: "아멜리아 중형 피규어",
            FigureM3: "림 중형 피규어",
            FigureM4: "멜루나 중형 피규어",
            FigureM5: "에르핀 중형 피규어",
            FigureS1: "머스크 소형 피규어",
            FigureS2: "활발한 햇팽이 어릴적 피규어",
            FigureS3: "활발한 길어용 어릴적 피규어",
            FigureS4: "냉정한 드론 G형 어릴적 피규어",
            FigureS5: "코미 소형 피규어",
            FigureS6: "루포 소형 피규어",
            FigureS7: "네르 소형 피규어",
            FigureS8: "특별한 시간의 기억 트로피",
            FigureS9: "우울한 한입초 피규어",
            FigureS10: "순수한 라쿤아치 피규어",
            FigureS11: "순수한 목도룡 피규어",
            FigureS12: "냉정한 저혈당 요정 피규어",
            FigureS13: "우울한 햇팽이 피규어",
            FigureS14: "냉정한 이불령 피규어",
            FigureS15: "우울한 수인 광전사 피규어",
            FigureS16: "순수한 머곰 피규어",
            FigureS17: "광기의 드론 S형 피규어",
            FigureS18: "냉정한 길어용 피규어",
            FigureS19: "활발한 근육인데용 피규어",
            FigureS20: "순수한 루파루 피규어",
            FigureS21: "순수한 누루링 피규어",
            FigureS22: "광기의 고모구지 피규어",
            FigureS23: "활발한 호바깅 피규어",
            FigureS24: "광기에 찬 동석 피규어",
            FigureS25: "활발한 드론 G형 피규어",
            FigureS26: "냉정한 셰이디아 극성팬 피규어",
            FigureS27: "순수한 엘프 돌격병 피규어",
            FigureS28: "우울한 위스프 피규어",
            FigureS29: "광기에 찬 위스프 피규어",
            FigureS30: "활발한 퍼리 피규어",
            FigureS31: "냉정한 수인 궁수 피규어",
            FigureS32: "순수한 위스프 피규어",
            FigureS33: "우울한 길어용 피규어",
            FigureS34: "광기에 찬 셰이디아 열혈팬 피규어",
            FigureS102: "순수한 머곰 어릴적 피규어",
            FigureS103: "순수한 동석 어릴적 피규어",
            FigureS104: "광기의 고모구지 어릴적 피규어",
            FigureS105: "광기의 이불령 어릴적 피규어",
            FigureS106: "광기의 햇팽이 어릴적 피규어",
            FigureS107: "냉정한 길어용 어릴적 피규어",
            FigureS108: "냉정한 근육인데용 어릴적 피규어",
            FigureS110: "활발한 드론 G형 어릴적 피규어",
            FigureS111: "광기의 위스프 어릴적 피규어",
            FigureS113: "순수한 위스프 어릴적 피규어",
            FigureS114: "우울한 셰이디아 극성팬 어릴적 피규어",
            FigureS115: "우울한 한입초 어릴적 피규어",
            FigureS201: "헤롱헤롱 차원 피규어",
            FigureS202: "꾸물꾸물 차원 피규어",
            FigureS203: "흔들흔들 차원 피규어",
            FigureS204: "흐물흐물 차원 피규어",
            FigureS205: "일렁일렁 차원 피규어",
            FigureXL1: "요정족 출동 피규어",
            FigureXL2: "간식 타임 피규어",
            FigureXL3: "겨울의 수인들 피규어",
            FigureXL4: "크리스마스의 기쁨 피규어",
            FigureXL5: "함께 100일 피규어",
            FigureXL6: "용들의 새해 피규어",
            FigureXL7: "멜루나와 널뛰기 피규어",
            FigureXL8: "초롱놀이 유령들 피규어",
            FigureXL9: "균형잡힌 유령들 피규어",
            FigureXL10: "광란의 산책 피규어",
            FigureXL11: "꿈꾸는 밤하늘 피규어",
            FigureXL12: "엘프의 과거 피규어",
            FigureXL13: "어린 비비 피규어",
            KeyRingM1: "짹짹이 키링",
            KeyRingM2: "산사모 키링",
            KeyRingM3: "마요 키링",
            KeyRingM4: "실라 키링",
            KeyRingM5: "스피키 트릭 키링",
            KeyRingM6: "에르핀 드림 키링",
            KeyRingM7: "피코라 키링",
            KeyRingS1: "유령 키링",
            KeyRingS2: "이불령 키링",
            KeyRingS3: "디아나 키링",
            KeyRingS4: "레비 키링",
            // KeyRingS5: "",
            PillowL1: "울먹 대형 쿠션",
            PillowL2: "M.Musk 대형 쿠션",
            PillowL3: "로네 대형 쿠션",
            PillowL4: "마요 대형 쿠션",
            // PillowL5: "",
            PillowL6: "씨익 대형 쿠션",
            PillowL7: "마에스트로 2호 패턴 대형 쿠션",
            PillowL8: "시스트 대형 쿠션",
            PillowL9: "미니미니 패턴 대형 쿠션",
            PillowL10: "아야 대형 쿠션",
            PillowL11: "힐데 대형 쿠션",
            PillowM1: "뇨롱 쿠션",
            PillowM2: "코미 패턴 쿠션",
            PillowM3: "산사모 쿠션",
            PillowM4: "쥬비 쿠션",
            PillowM5: "나이아 쿠션",
            PillowM6: "제이드 쿠션",
            PillowM7: "루포 쿠션",
            PillowM8: "다야 패턴 쿠션",
            PillowM9: "마고 목장 쿠션",
            PillowM10: "빅우드 쿠션",
            // PillowM11: "",
            PillowM12: "마고 쿠션",
            PillowM13: "에슈르 쿠션",
            PillowM14: "실피르 설빔 쿠션",
            PosterL1: "석양이 진다 포스터",
            PosterL2: "모르는 풍경이다 포스터",
            PosterL3: "도시락멜루나 포스터",
            // PosterL4: "",
            PosterL5: "볼지창조 포스터",
            PosterL6: "일타강사 제이드 포스터",
            PosterL7: "이웃집 클로에 포스터",
            // PosterL8: "",
            PosterL9: "엘리아스의 제왕 포스터",
            PosterL10: "레이디 오브 더 레이크 포스터",
            PosterL11: "그대를 위한 찬사 포스터",
            PosterL12: "멘토를 만난 포스터",
            PosterL13: "떠도는 이드 포스터",
            PosterL14: "폭주족 슈팡 포스터",
            PosterL15: "새 친구 포스터",
            PosterL20: "감옥의 롤렛 포스터",
            PosterL16: "최후의 만찬 포스터",
            PosterL17: "클론팩토리 포스터",
            PosterL19: "꿈속의 산책 포스터",
            PosterL18: "버터의 분노 포스터",
            PosterM1: "토끼 구름 포스터",
            PosterM2: "에르핀 야망 포스터",
            PosterM3: "베니 둥둥 포스터",
            PosterM4: "루파루 수영 포스터",
            PosterM5: "코미즈 포스터",
            PosterM6: "메류겐 포스터",
            PosterM7: "불좀 꺼줘 포스터",
            PosterM8: "마탄의 사수 포스터",
            PosterM9: "잘 먹고 크렴 포스터",
            PosterM10: "퇴근욕구 포스터",
            PosterM11: "유독성 실버 타운 포스터",
            PosterM12: "발칙-전위적 엑스-마스 포스터",
            PosterM13: "춤추는 운명 포스터",
            PosterM14: "강철의 지옥 단련 포스터",
            PosterM15: "푸른 장미의 포스터",
            PosterM16: "GTA 포스터",
            PosterM17: "겟츄 크레용 포스터",
            PosterM18: "봄날 점프 포스터",
            PosterS1: "코미 미니 포스터",
            // PosterS2: "",
            PosterS3: "마요 미니 포스터",
            PosterS4: "로네 미니 포스터",
            PosterS5: "에슈르 미니 포스터",
            PosterS6: "마요 미니 포스터",
            PosterS7: "볼따구의 탄생 포스터",
            PosterS8: "볼따구의 지속 포스터",
            PosterS9: "민중을 이끄는 자유의 볼따구 포스터",
            PosterS10: "단짝친구 포스터",
            PosterS11: "근력도 마법 포스터",
            PosterS12: "업무 중 딴짓 포스터",
            PosterS13: "정령의 한때 포스터",
            PosterS14: "우주 엘레나 포스터",
            PosterS15: "인내심 훈련 포스터",
            PosterS16: "캔디 가득 포스터",
            PosterS17: "볼규 포스터",
            PosterS18: "비밀의 베이커리 포스터",
          },
          themeevent: {
            title: {
              1: "멜트다운 버터",
              2: "엘리아스 오디세이아",
              3: "레이디 오브 더 레이크",
              4: "유독성 실버타운",
              5: "발칙 전위적 엑스-마스",
              6: "그대를 위한 찬사",
              7: "카드첩 속 춤추는 운명",
              8: "강철의 지옥단련",
              9: "피코라의 멘토 콤플렉스",
              10: "다시 피어오르는 푸른 장미",
              11: "영원을 꿈꾸는 전기양",
              12: "질주! 분노의 딜리버리!",
              13: "달콤씁쓸 가든 라이프",
              14: "기기묘묘 롤렛 커넥션",
            },
            shop: {
              charaLicense: "{{0}}의 사도 증명서",
              crayon4: "최상급 크레파스",
              crayon3: "상급 크레파스",
              crayon2: "중급 크레파스",
              crayon1: "하급 크레파스",
              rankEquipSet: "{{0}} {{1}}랭크 장비 세트",
              currency0008: "골드",
              currency0047: "장비의정석",
              gachaTicketHero: "사도 모집 티켓",
              gachaTicketCard: "카드 뽑기 티켓",
              Item_Skill_DealerHigh: "딜러의 상급 마시멜로",
              Item_Skill_DealerMid: "딜러의 중급 마시멜로",
              Item_Skill_DealerLow: "딜러의 하급 마시멜로",
              Item_Skill_TankerHigh: "탱커의 상급 마시멜로",
              Item_Skill_TankerMid: "탱커의 중급 마시멜로",
              Item_Skill_TankerLow: "탱커의 하급 마시멜로",
              Item_Skill_SupporterHigh: "서포터의 상급 마시멜로",
              Item_Skill_SupporterMid: "서포터의 중급 마시멜로",
              Item_Skill_SupporterLow: "서포터의 하급 마시멜로",
              Equip_EnhanceStone1: "하급 제련석",
              Equip_EnhanceStone2: "중급 제련석",
              Equip_EnhanceStone3: "상급 제련석",
            },
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
              sync: {
                config: "동기화 설정",
                upload: "계정에 데이터 저장",
                download: "계정의 데이터 불러오기",
              },
              versionCheck: {
                title: "버전 확인",
                current: "현재 버전",
                latest: "최신 버전",
                loading: "버전 확인 중...",
                update: "업데이트",
                cleaning: "기존 파일 정리 중...",
                preparing: "업데이트 준비 중...",
                downloading: "업데이트 다운로드 중...",
                installing: "업데이트 설치 중...",
                updateCompleted: "업데이트 완료!",
                updateFailed: "새로고침 중...",
                enableHardReset: "하드 리셋",
                enableHardResetDescription:
                  "데이터 사용량이 크게 증가합니다",
              },
              personality: "성격",
              defaultstar: "초기 성급",
              attack: "공격 타입",
              position: "배치 열",
              class: "역할군",
              race: "종족",
              fileSync: {
                success: "성공적으로 데이터를 가져왔습니다.",
                uploading: "데이터 업로드 중...",
                uploadSuccess: "성공적으로 데이터를 저장했습니다.",
                uploadFailed: "데이터 저장에 실패했습니다.",
                notProperSignature: "파일 형식이 올바르지 않습니다.",
                incorrectPadding: "파일 패딩이 올바르지 않습니다.",
                noFileProvided: "파일이 제공되지 않았습니다.",
                invalidFileInput: "파일이 올바르지 않습니다.",
              },
              newCharacterAlert:
                "사도 목록 변경을 감지했습니다.\n미보유 캐릭터 설정을 다시 확인해 주세요.",
              repairedAlert:
                "데이터 변경이 감지되었습니다.\n데이터가 올바르게 복구되었는지 다시 확인해 주세요.",
              testMark: "[테스트]",
              privacyPolicy: "개인정보처리방침",
              setting: "설정",
              gameCopyright: "Trickcal copyrighted by EPIDGames",
              sitePoweredBy: "Trickcal Note powered by Triple",
              textPrivacy: "Privacy",
              textSetting: "Setting",
              suspenseLoading: "Loading...",
            },
            board: {
              title: "최상급 보드 노트",
              pboardTitle: "상급 보드 노트",
              description: "전체 스탯 % 보드 현황을 체크합니다.",
              subDescription: "나만 황크 안 나와",
              board1: "1차 보드",
              board2: "2차 보드",
              board3: "3차 보드",
              settings: "설정",
              // selectBoardIndex: "보드 차수 선택",
              selectBoardShort: "보드 차수",
              board1Short: "1차",
              board2Short: "2차",
              board3Short: "3차",
              purpleBoard: "상급 칸",
              goldBoard: "특수 칸",
              viewFullBoard: "차수별 보드 위치 보기",
              viewTargetBoard: "전체 적용 보드 종류 보기",
              viewTargetBoardShort: "전체 적용 보드",
              nthBoardOpened: "{{0}}차 보드 열림",
              selectBoardType: "보드 종류 선택",
              selectBoardTypeAll: "모두 표시",
              selectBoardTypeRecommended: "추천 설정",
              mainClassification: "대분류",
              subClassification: "소분류",
              allStatBaseTotal: "전체 적용 스탯 총합",
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
              listInCurrentBoard: "{{0}} {{1}}에 있는 특수 칸 목록",
            },
            equiprank: {
              title: "랭크 메모장",
              description: "사도들의 장비 랭크를 메모합니다.",
              subDescription: "메모 안 하면 헷갈려",
              rankText: "RANK {{0}}",
              levelText: "레벨 {{0}}",
              reqLevel: "RANK {{0}} 필요 레벨: {{1}}",
              rankReqLevelTitle: "랭크별 필요 사도 레벨",
              aboutReqLevelTitle: "필요 사도 레벨에 대하여",
              aboutReqLevelDescription:
                "사도가 랭크별 필요 레벨에 도달하지 못하면, 해당 랭크 장비를 착용할 수 없어요.",
              sortAndFilter: "정렬 및 필터",
              sortByName: "이름",
              sortByPersonality: "성격",
              sortByStarGrade: "성급",
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
              labStep: "{{0}}단계",
              cumulativeEffect: "누적 효과",
              remainMaterials: "남은 재료",
              showMyHomeUpgradeMaterials: "교단 건물 레벨업 재료 표시",
              showLabMaterials: "남은 연구에 필요한 재료 표시",
              showCollectionMaterials: "남은 수집품 제작에 필요한 재료 표시",
              showRemainAsSubMaterials: "하위 재료로 표시",
              remainMaterialsDepth1: "전체 단계",
              remainMaterialsDepth2: "현재 단계",
              myHomeCategory: "시설",
              myHomeCurrentLevel: "현재 레벨",
              myHomeGoalLevel: "목표 레벨",
              tabLevels: "교단 레벨",
              tabLabStep: "연구 현황",
              tabCollections: "수집품 제작",
              collectionFigure: "피규어",
              collectionKeyRing: "키링",
              collectionPoster: "포스터",
              collectionDoll: "인형",
              collectionPillow: "베개",
              aboutCollectionCriteria:
                "기록 시, 본부 - 창고 - 수집품 목록 화면에서\n정렬 순서를 크기로 변경한 후 시작하세요.",
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
            tasksearch: {
              title: "모험회 검색기",
              selectCharacter: "사도 선택...",
              searchCharacter: "사도 검색...",
              characterNotFound: "해당 사도를 찾을 수 없습니다.",
              selectLifeskill: "생활 스킬 선택...",
              searchLifeskill: "생활 스킬 검색...",
              lifeskillNotFound: "해당 생활 스킬을 찾을 수 없습니다.",
              selectTask: "일정 선택...",
              searchTask: "일정 검색...",
              taskNotFound: "해당 일정을 찾을 수 없습니다.",
              needToSelect: "사도, 생활 스킬, 또는 일정을 선택해주세요!",
              materialsEasyToGet: "쉽게 구할 수 있는 재료",
              skillSelectHelp:
                "생활 스킬을 눌러 온/오프 전환이 가능합니다.\n기본 스킬은 항상 활성화됩니다.",
              skillMatchCount: "{{0}}개 스킬 일치",
              includeThisSkill: "이 스킬 포함",
            },
            eventcalc: {
              title: "이벤트 계산기",
              selectEvent: "이벤트 선택",
              selectThemeEvent: "이벤트 선택...",
              searchThemeEvent: "이벤트 검색...",
              themeEventNotFound: "해당 이벤트를 찾을 수 없습니다.",
              eventChangeWarning: "이벤트 변경 시 상점 입력값이 초기화됩니다!",
              viewBonus: "보너스 보기",
              viewBonusTitle: "보너스 사도",
              easyLvBonus: "순한맛 스테이지 보너스",
              hardLvBonus: "매운맛 스테이지 보너스",
              veryHardLvBonus: "핵불맛 스테이지 보너스",
              challengeStage: "챌린지 스테이지 설정",
              useAutoCalculatedBonus: "자동 계산된 보너스: +{{0}}%",
              useCustomBonus: "보너스 직접 입력: +",
              allClearedEasy: "면제만 하면 돼요",
              allCleared: "다 깼어요",
              possibleChallengeStage: "/{{0}} 스테이지 클리어 가능",
              tabStage: "스테이지",
              tabShop: "상점",
              tabResult: "결과",
              nthDayBefore: "오늘은 이벤트",
              nthDayAfter: "일차",
              dailyAlreadyCompleted: "이미 오늘치 일일 퀘스트를 끝냈어요",
              purchaseLimit: "{{0}}회 구매 가능",
              purchasePrice: "가격: {{0}}",
              remainingItemCountBefore: "남은 재화 수:",
              remainingItemCountAfter: "개",
              purchaseCount: "구매할 수량",
              minimum: "MIN",
              maximum: "MAX",
              possibleItemAcquisition: "계산 결과",
              remainDate: "남은 이벤트 기간",
              rewardTotal: "일 20회 클리어 수급량",
              dailyQuestAcquire: "일일 퀘스트 수급량",
              actualReq: "상점 구매 재화 요구량",
              additionalItemReq: "추가 수급 재화 요구량",
              additionalClearReq: "필요한 추가 면제 횟수",
              additionalDailyClearReq: "필요한 일일 면제 횟수",
              dayCount: "{{0}}일",
              clearCount: "{{0}}회",
              itemCount: "{{0}}개",
            },
            common: {
              unownedCharacters: "미보유 캐릭터",
              backUpAndRestore: "백업 및 복원",
              backUp: "파일로 백업",
              restore: "파일에서 복원",
              authTitle: "Google 계정 연동",
              authLoading: "연동 확인 중...",
              authButtonText: "Google 계정으로 로그인...",
              authAlreadyCompleted: "Google 계정 연동이 완료되었습니다.",
              themeTitle: "테마",
              themeLight: "라이트",
              themeDark: "다크",
              themeSystem: "시스템",
              tokenFailed: "실패!",
              tokenFailedDescription: "다시 시도할까요?",
              tokenSuccess: "성공!",
              tokenSuccessDescription: "메인 화면으로 보내 드릴게요.",
              tokenProcessing: "토큰 받아오는 중...",
              dataLoading: "데이터 불러오는 중...",
              dataLoaded: "데이터를 불러왔습니다.",
              dialogEnableSwitchTitle: "정보 다이얼로그 활성화",
            },
          },
        },
      },
    },
  });

export default i18n;
