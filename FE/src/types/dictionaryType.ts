// API 응답 형태
export type GestureResponse = {
  status: number;
  data: {
    meaning_id: number;
    gesture_id: number;
    image_url: string;
    gesture_name: string;
  }[];
};

// 국가 정보 타입
export type Country = {
  code: string;
  name: string;
  id: number;
};

// 제스처 타입 정의
export type Gesture = {
  id: string;
  title: string;
  image: string;
};

// 국가별 제스쳐 데이터 관리하는 타입
export type CountryGestures = {
  [countryCode: string]: Gesture[];
};

// 더미 데이터
export const countryGestures: CountryGestures = {
  us: [
    { id: 'victory', title: 'V 사인', image: 'pages/dict/gesture_example.png' },
    { id: 'thumbs-up', title: '엄지 척', image: 'pages/dict/gesture_example.png' },
    { id: 'ok', title: 'OK 제스처', image: 'pages/dict/gesture_example.png' },
    { id: 'fist-bump', title: '주먹 인사', image: 'pages/dict/gesture_example.png' },
  ],
  kr: [
    { id: 'heart', title: '손하트', image: 'pages/dict/gesture_example.png' },
    { id: 'fighting', title: '파이팅', image: 'pages/dict/gesture_example.png' },
    { id: 'aegyo', title: '손가락 하트', image: 'pages/dict/gesture_example.png' },
    { id: 'bow', title: '인사 예절', image: 'pages/dict/gesture_example.png' },
  ],
  cn: [
    { id: 'gong-xi', title: '공시파차이', image: 'pages/dict/gesture_example.png' },
    { id: 'tea-ceremony', title: '차 예절', image: 'pages/dict/gesture_example.png' },
    { id: 'greeting-bow', title: '공수례', image: 'pages/dict/gesture_example.png' },
    { id: 'lucky-six', title: '럭키 넘버 6', image: 'pages/dict/gesture_example.png' },
  ],
  jp: [
    { id: 'ojigi', title: '오지기', image: 'pages/dict/gesture_example.png' },
    { id: 'namaste', title: '나마스테', image: 'pages/dict/gesture_example.png' },
    { id: 'peace', title: '피스 사인', image: 'pages/dict/gesture_example.png' },
    { id: 'kanpai', title: '건배', image: 'pages/dict/gesture_example.png' },
  ],
  it: [
    { id: 'mamma-mia', title: '맘마미아', image: 'pages/dict/gesture_example.png' },
    { id: 'bellissimo', title: '벨리시모', image: 'pages/dict/gesture_example.png' },
    { id: 'che-vuoi', title: '케 부오이', image: 'pages/dict/gesture_example.png' },
    { id: 'capisci', title: '카피쉬', image: 'pages/dict/gesture_example.png' },
  ],
};
