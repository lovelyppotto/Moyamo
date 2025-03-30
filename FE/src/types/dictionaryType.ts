// API 응답 형태
export type GestureResponse = {
  status: number;
  data: {
    country_id: number;
    country_name: string;
    image_url: string | null;
    gestures: {
      meaning_id: number;
      gesture_id: number;
      image_url: string | null;
      gesture_title: string;
    }[];
  };
};

// 비교 가이드 API 응답
export type GestureCompareResponse = {
  status: number;
  data: {
    gesture_id: number;
    gesture_title: string;
    meanings: {
      country_id: number;
      country_name: string;
      gesture_meaning: string;
      gesture_situation: string;
      is_positive: boolean;
    }[];
  };
};

// 국가 정보 타입
export type Country = {
  code: string;
  name: string;
  id: number;
};

// 제스처 타입 정의
export type Gesture = {
  id: number;
  title: string;
  image_url: string | null;
  meaning_id: number;
  // 상세 정보
  gesture_meaning?: string;
  gesture_situation?: string;
  gesture_others?: string;
  gesture_tmi?: string;
  is_positive?: boolean;
  multiple_gestures?: number;
};

// 국가별 제스쳐 데이터 관리하는 타입
export type CountryGestures = {
  [countryId: number]: {
    country_name: string;
    gestures: Gesture[];
  };
};

// 더미 데이터
export const countryGestures: CountryGestures = {
  // 한국 (ID: 1)
  1: {
    country_name: '한국',
    gestures: [
      {
        id: 1,
        title: '손하트',
        image_url: '/images/gestures/victory.png',
        meaning_id: 5,
        gesture_meaning: '사랑, 애정',
        gesture_situation: 'SNS에서 사진 찍을 때 자주 사용하는 제스처',
        gesture_others: '대부분의 나라: 비슷한 의미로 사용됨',
        gesture_tmi: '한류의 영향으로 전 세계적으로 퍼진 제스처입니다.',
        is_positive: true,
        multiple_gestures: 1,
      },
      {
        id: 2,
        title: '파이팅',
        image_url: '/images/gestures/victory.png',
        meaning_id: 6,
        gesture_meaning: '응원, 격려',
        gesture_situation: '스포츠 경기나 시험 전 응원할 때 사용하는 제스처',
        gesture_others: '일본: 가위/서양: 가위바위보의 가위',
        gesture_tmi: '한국에서는 응원의 의미로 주먹을 쥐고 팔을 올리는 동작을 자주 사용합니다.',
        is_positive: true,
        multiple_gestures: 1,
      },
      {
        id: 5,
        title: '손가락 하트',
        image_url: '/images/gestures/victory.png',
        meaning_id: 7,
        gesture_meaning: '사랑, 애정',
        gesture_situation: '아이돌이나 연예인들이 팬들에게 사랑을 표현할 때 많이 사용',
        gesture_others: '일부 서양국가: 생소할 수 있음',
        gesture_tmi: '2010년대부터 한국 연예인들 사이에서 유행하기 시작했습니다.',
        is_positive: true,
        multiple_gestures: 1,
      },
      {
        id: 6,
        title: '인사 예절',
        image_url: '/images/gestures/victory.png',
        meaning_id: 8,
        gesture_meaning: '존경, 예의',
        gesture_situation: '어른을 만났을 때나 공식적인 자리에서 인사할 때 사용',
        gesture_others: '일본: 오지기와 유사/중국: 공수례와 유사',
        gesture_tmi:
          '한국의 전통적인 인사법은 절(큰절)이지만, 현대에는 간단한 목례나 허리 숙여 인사하는 방식이 일상에서 많이 사용됩니다.',
        is_positive: true,
        multiple_gestures: 1,
      },
    ],
  },
  // 미국 (ID: 2)
  2: {
    country_name: '미국',
    gestures: [
      {
        id: 1,
        title: 'V 사인',
        image_url: '/images/gestures/victory.png',
        meaning_id: 1,
        gesture_meaning: '승리, 기념',
        gesture_situation: '미국에서 사진 찍을 때 사용하는 제스처',
        gesture_others:
          '영국, 호주, 뉴질랜드, 아일랜드: 손등이 보이는 브이는 모욕의 의미/터키, 그리스: 손바닥이 상대를 향하는 브이는 모욕의 의미/인도: 화장실 가고싶다는 의미',
        gesture_tmi:
          '제2차 세계대전 당시 영국 총리였던 윈스턴 처칠이 브이 포즈로 사진을 찍으면서 유명해졌습니다./백년전쟁 때 프랑스군이 영국군을 포로로 잡고 검지와 중지를 잘랐기 때문에 영국군들이 아직 자신들의 손가락이 멀쩡하다고 프랑스군을 조롱하는 의미로 쓴 것이 유래라고 알려져 있습니다.',
        is_positive: true,
        multiple_gestures: 2,
      },
      {
        id: 2,
        title: '엄지 척',
        image_url: '/images/gestures/victory.png',
        meaning_id: 2,
        gesture_meaning: '좋다, 승인',
        gesture_situation: '동의하거나 좋다는 의미를 표현할 때 사용',
        gesture_others: '중동과 서아시아 일부 지역: 모욕적인 표현/그리스, 러시아: 성적인 모욕',
        gesture_tmi:
          "고대 로마 시대에는 검투사의 목숨을 살릴지 죽일지를 결정할 때 엄지를 위로 또는 아래로 향하게 했다는 설이 있습니다. 하지만 역사학자들에 따르면 이는 오해이며, 실제로는 엄지를 숨기는 것이 '죽임'을, 엄지를 내미는 것이 '살림'을 의미했을 가능성이 높다고 합니다.",
        is_positive: true,
        multiple_gestures: 1,
      },
      {
        id: 3,
        title: 'OK 제스처',
        image_url: '/images/gestures/victory.png',
        meaning_id: 3,
        gesture_meaning: '괜찮다, 좋다',
        gesture_situation: '모든 것이 괜찮다는 의미로 사용',
        gesture_others: '프랑스, 벨기에: 무가치/일본: 돈/브라질, 터키: 성적 모욕',
        gesture_tmi:
          "OK 사인은 19세기 미국에서 시작되었으며, 'all correct'의 잘못된 철자인 'oll korrect'의 약자 'OK'에서 비롯되었다고 합니다.",
        is_positive: true,
        multiple_gestures: 1,
      },
      {
        id: 4,
        title: '주먹 인사',
        image_url: '/images/gestures/victory.png',
        meaning_id: 4,
        gesture_meaning: '인사, 우정',
        gesture_situation: '친구들 사이에서 캐주얼한 인사로 사용',
        gesture_others: '대부분의 서양 국가: 비슷한 의미로 사용',
        gesture_tmi:
          '주먹 인사(Fist bump)는 박싱 글러브를 낀 선수들이 경기 전에 서로 존중을 표시하는 데서 비롯되었다는 설이 있습니다. 2000년대에 스포츠 선수들과 힙합 문화를 통해 대중화되었습니다.',
        is_positive: true,
        multiple_gestures: 1,
      },
    ],
  },
  // 일본 (ID: 3)
  3: {
    country_name: '일본',
    gestures: [
      {
        id: 11,
        title: '오지기',
        image_url: '/images/gestures/victory.png',
        meaning_id: 13,
        gesture_meaning: '존경, 감사',
        gesture_situation: '인사할 때나 감사를 표현할 때 사용하는 제스처',
        gesture_others: '한국: 인사 예절과 유사/중국: 공수례와 유사',
        gesture_tmi:
          '일본에서는 상대방의 지위나 관계에 따라 허리를 숙이는 각도가 달라집니다. 가벼운 인사는 15도, 정중한 인사는 30도, 매우 정중한 인사는 45도 이상 숙입니다.',
        is_positive: true,
        multiple_gestures: 1,
      },
      {
        id: 12,
        title: '나마스테',
        image_url: '/images/gestures/victory.png',
        meaning_id: 14,
        gesture_meaning: '존중, 인사',
        gesture_situation: '정중한 인사를 할 때 사용',
        gesture_others: '인도: 유래한 제스처로 전 세계적으로 사용됨',
        gesture_tmi:
          "일본에서는 '가샤마이'라고 부르며, 주로 요가나 명상 수련시 사용합니다. '나마스테'는 산스크리트어로 '당신 안의 신성함에 경의를 표합니다'라는 의미가 있습니다.",
        is_positive: true,
        multiple_gestures: 1,
      },
      {
        id: 13,
        title: '피스 사인',
        image_url: '/images/gestures/victory.png',
        meaning_id: 15,
        gesture_meaning: '평화, 친근함',
        gesture_situation: '사진 찍을 때 자주 사용하는 제스처',
        gesture_others: '영국, 호주: 손등이 바깥을 향하면 모욕적인 의미',
        gesture_tmi:
          "일본에서는 1960년대부터 사진 포즈로 인기를 끌기 시작했으며, '피스 사인'이 아닌 'V 사인'으로 더 많이 알려져 있습니다. 이는 승리(Victory)의 의미보다는 단순히 귀여운 포즈로 인식됩니다.",
        is_positive: true,
        multiple_gestures: 1,
      },
      {
        id: 14,
        title: '건배',
        image_url: '/images/gestures/victory.png',
        meaning_id: 16,
        gesture_meaning: '축하, 사교',
        gesture_situation: '술자리에서 건배할 때 사용하는 제스처',
        gesture_others: '대부분의 문화권: 비슷한 의미로 사용',
        gesture_tmi:
          "일본의 건배 문화에는 여러 예절이 있습니다. 자신보다 지위가 높은 사람의 잔보다 자신의 잔을 낮게 들고, 건배 후 첫 모금을 마시기 전에 '간파이(건배)'라고 말하는 것이 일반적입니다.",
        is_positive: true,
        multiple_gestures: 1,
      },
    ],
  },
  // 중국 (ID: 4)
  4: {
    country_name: '중국',
    gestures: [
      {
        id: 7,
        title: '공시파차이',
        image_url: '/images/gestures/victory.png',
        meaning_id: 9,
        gesture_meaning: '행운, 번영',
        gesture_situation: '축하할 때나 새해를 맞이할 때 사용하는 제스처',
        gesture_others: '중국 문화권 외: 널리 사용되지 않음',
        gesture_tmi:
          "'공시파차이(恭喜發財)'는 '부자 되세요'라는 뜻으로, 중국 설날(춘절)에 자주 사용되는 인사말입니다. 이때 양손을 가슴 앞에서 모으는 제스처를 함께 사용하는 경우가 많습니다.",
        is_positive: true,
        multiple_gestures: 1,
      },
      {
        id: 8,
        title: '차 예절',
        image_url: '/images/gestures/victory.png',
        meaning_id: 10,
        gesture_meaning: '존경, 감사',
        gesture_situation: '차를 따를 때나 받을 때 사용하는 제스처',
        gesture_others: '한국, 일본, 대만: 동아시아 문화권에서 유사하게 사용',
        gesture_tmi:
          '중국 차 문화에서는 손님에게 차를 따를 때 두 손가락(검지와 중지)으로 테이블을 두드리는 것이 감사의 표시입니다. 이는 청나라 건륭제가 변장하고 여행할 때 신하가 황제에게 절하는 대신 손가락으로 테이블을 두드린 데서 유래했다고 합니다.',
        is_positive: true,
        multiple_gestures: 1,
      },
      {
        id: 9,
        title: '공수례',
        image_url: '/images/gestures/victory.png',
        meaning_id: 11,
        gesture_meaning: '존경, 인사',
        gesture_situation: '정중한 인사를 할 때 사용하는 제스처',
        gesture_others: '홍콩, 대만: 널리 사용됨',
        gesture_tmi:
          '공수례는 왼손이 오른손 위에 오도록 하여 양손을 가슴 앞에서 모으는 전통적인 중국식 인사입니다. 과거에는 남성과 여성의 수례 방식이 달랐는데, 남성은 왼손을 오른손 위에, 여성은 오른손을 왼손 위에 놓았습니다.',
        is_positive: true,
        multiple_gestures: 1,
      },
      {
        id: 10,
        title: '럭키 넘버 6',
        image_url: '/images/gestures/victory.png',
        meaning_id: 12,
        gesture_meaning: '행운, 성공',
        gesture_situation: '행운을 빌거나 축하할 때 사용하는 제스처',
        gesture_others: '중국 문화권 외: 특별한 의미가 없음',
        gesture_tmi:
          "중국어에서 '6(六, liù)'은 '순조롭다(流, liú)'와 발음이 비슷해 행운의 숫자로 여겨집니다. 엄지와 새끼손가락을 편 '6' 모양의 수신호는 '모든 일이 잘 되길 바란다'는 의미를 담고 있습니다.",
        is_positive: true,
        multiple_gestures: 1,
      },
    ],
  },
  // 이탈리아 (ID: 5)
  5: {
    country_name: '이탈리아',
    gestures: [
      {
        id: 15,
        title: '맘마미아',
        image_url: '/images/gestures/victory.png',
        meaning_id: 17,
        gesture_meaning: '좌절, 짜증',
        gesture_situation: '짜증나거나 당혹스러울 때 사용하는 제스처',
        gesture_others: '이탈리아, 지중해 국가들: 주로 사용됨',
        gesture_tmi:
          "'맘마미아'는 이탈리아어로 '어머나!' 또는 '이런!'이라는 감탄사입니다. 손가락을 모아 위로 향하게 한 다음 흔드는 제스처와 함께 사용되며, 이탈리아인들의 표현력 풍부한 바디 랭귀지를 대표합니다.",
        is_positive: false,
        multiple_gestures: 1,
      },
      {
        id: 16,
        title: '벨리시모',
        image_url: '/images/gestures/victory.png',
        meaning_id: 18,
        gesture_meaning: '완벽함, 아름다움',
        gesture_situation: '뭔가가 매우 좋거나 완벽할 때 사용하는 제스처',
        gesture_others: '전 세계: 비슷한 의미로 인식됨',
        gesture_tmi:
          "'벨리시모(Bellissimo)'는 이탈리아어로 '매우 아름다운' 또는 '완벽한'이라는 뜻입니다. 손가락을 입술에 모았다가 키스하듯 펼치는 제스처는 음식이나 예술 작품 등이 훌륭할 때 자주 사용됩니다.",
        is_positive: true,
        multiple_gestures: 1,
      },
      {
        id: 17,
        title: '케 부오이',
        image_url: '/images/gestures/victory.png',
        meaning_id: 19,
        gesture_meaning: '의문, 혼란',
        gesture_situation: '이해하지 못하거나 질문할 때 사용하는 제스처',
        gesture_others: '다른 국가: 다른 의미로 해석될 수 있음',
        gesture_tmi:
          "'케 부오이(Che vuoi?)'는 이탈리아어로 '뭘 원하니?'라는 뜻입니다. 손가락을 모아 위로 향하게 한 후 흔드는 이 제스처는 이탈리아에서 '무슨 일이야?' 또는 '왜 그래?'라는 의미로 사용됩니다.",
        is_positive: false,
        multiple_gestures: 1,
      },
      {
        id: 18,
        title: '카피쉬',
        image_url: '/images/gestures/victory.png',
        meaning_id: 20,
        gesture_meaning: '이해, 동의',
        gesture_situation: '상대방이 이해했는지 확인할 때 사용하는 제스처',
        gesture_others: '미국: 이탈리아계 미국인들의 영향으로 사용됨',
        gesture_tmi:
          "'카피쉬(Capisci?)'는 이탈리아어로 '이해하니?'라는 뜻입니다. 검지 손가락으로 귀 또는 뺨을 가리키는 제스처는 '잘 들어, 이해했어?'라는 의미를 담고 있습니다. 이탈리아계 미국인들의 영향으로 미국 영화나 TV에서도 종종 볼 수 있습니다.",
        is_positive: true,
        multiple_gestures: 1,
      },
    ],
  },
};
