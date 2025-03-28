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
  // 미국 (ID: 1)
  1: {
    country_name: '미국',
    gestures: [
      { id: 1, title: 'V 사인', image_url: '/images/gestures/victory.png', meaning_id: 1 },
      { id: 2, title: '엄지 척', image_url: '/images/gestures/victory.png', meaning_id: 2 },
      { id: 3, title: 'OK 제스처', image_url: '/images/gestures/victory.png', meaning_id: 3 },
      { id: 4, title: '주먹 인사', image_url: '/images/gestures/victory.png', meaning_id: 4 },
    ],
  },
  // 한국 (ID: 2)
  2: {
    country_name: '한국',
    gestures: [
      { id: 1, title: '손하트', image_url: '/images/gestures/victory.png', meaning_id: 5 },
      { id: 2, title: '파이팅', image_url: '/images/gestures/victory.png', meaning_id: 6 },
      {
        id: 5,
        title: '손가락 하트',
        image_url: '/images/gestures/victory.png',
        meaning_id: 7,
      },
      { id: 6, title: '인사 예절', image_url: '/images/gestures/victory.png', meaning_id: 8 },
    ],
  },
  // 중국 (ID: 3)
  3: {
    country_name: '중국',
    gestures: [
      { id: 7, title: '공시파차이', image_url: '/images/gestures/victory.png', meaning_id: 9 },
      { id: 8, title: '차 예절', image_url: '/images/gestures/victory.png', meaning_id: 10 },
      { id: 9, title: '공수례', image_url: '/images/gestures/victory.png', meaning_id: 11 },
      { id: 10, title: '럭키 넘버 6', image_url: '/images/gestures/victory.png', meaning_id: 12 },
    ],
  },
  // 일본 (ID: 4)
  4: {
    country_name: '일본',
    gestures: [
      { id: 11, title: '오지기', image_url: '/images/gestures/victory.png', meaning_id: 13 },
      { id: 12, title: '나마스테', image_url: '/images/gestures/victory.png', meaning_id: 14 },
      { id: 13, title: '피스 사인', image_url: '/images/gestures/victory.png', meaning_id: 15 },
      { id: 14, title: '건배', image_url: '/images/gestures/victory.png', meaning_id: 16 },
    ],
  },
  // 이탈리아 (ID: 5)
  5: {
    country_name: '이탈리아',
    gestures: [
      { id: 15, title: '맘마미아', image_url: '/images/gestures/victory.png', meaning_id: 17 },
      { id: 16, title: '벨리시모', image_url: '/images/gestures/victory.png', meaning_id: 18 },
      { id: 17, title: '케 부오이', image_url: '/images/gestures/victory.png', meaning_id: 19 },
      { id: 18, title: '카피쉬', image_url: '/images/gestures/victory.png', meaning_id: 20 },
    ],
  },
};
