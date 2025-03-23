export interface Meanings {
  countryId: number;
  countryName: string;
  meaning: string;
}

export interface ResultMockData {
  gestureId: number;
  gestureName: string;
  meanings: Meanings[];
  gestureImg: string;
}

export const searchResultMock: ResultMockData[] =[
  {
    gestureId: 1,
    gestureName: "승리",
    meanings: [
      {
        countryId: 1,
        countryName: "대한민국", 
        meaning: "손가락으로 만드는 V자 모양의 제스처. '승리'를 뜻하며 사진을 찍을 때 많이 사용한다."
      },
      {
        countryId: 2,
        countryName: "미국", 
        meaning: "손가락으로 만드는 V자 모양의 제스처. '승리'를 뜻하며 사진을 찍을 때 많이 사용한다."
      },
    ],
    gestureImg:  '/images/gestures/victory.png',
  },
  {
    gestureId: 2,
    gestureName: "행운을 빌다",
    meanings: [
      {
        countryId: 2,
        countryName: "미국",
        meaning: "중지와 검지를 꼬는 제스처. 악과 불운이 사라진다는 미신에서 시작되었으며 'Good Luck'의 의미를 가진다."
      },
    ],
    gestureImg:  '/images/gestures/cross-finger.png',
  },
  {
    gestureId: 3,
    gestureName: "나",
    meanings: [
      {
        countryId: 3,
        countryName: "일본",
        meaning: "검지로 자신의 얼굴(보통 코)을 가리키며 제스처를 취한 '본인'을 뜻한다."
      },
    ],
    gestureImg:  '/images/gestures/me.png',
  },
  {
    gestureId: 4,
    gestureName: "하트",
    meanings: [
      {
        countryId: 1,
        countryName: "대한민국",
        meaning: "엄지와 검지를 이용해 하트를 만든다."
      },
    ],
    gestureImg:  '/images/gestures/finger-heart.png',
  },
]
  