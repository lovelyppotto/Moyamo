// 비교 가이드 API 응답
export type CompareGuideResponse = {
  status: number;
  data: {
    gesture_id: number;
    image_url: string | null;
    meanings: {
      country_id: number;
      country_name: string;
      gesture_meaning: string;
      gesture_situation: string;
      is_positive: boolean;
    }[];
  };
};

// meanings API 응답 카멜 케이스로 변환
export interface MeaningItem {
  countryId: number;
  countryName: string;
  gestureMeaning: string;
  gestureSituation: string;
  isPositive: boolean;
}

// CompareGuideResponse 카멜케이스로 변환
export type CompareGuide = {
  gestureId: number;
  imageUrl: string | null;
  meanings: MeaningItem[];
};

// 국가 코드 관련 타입 정의
export type CountryCodeMap = {
  [key: string]: string;
};

// 국가 이름을 국가 코드로 변환
export const countryCodeMap: CountryCodeMap = {
  미국: 'us',
  영국: 'uk',
  호주: 'au',
  뉴질랜드: 'nz',
  그리스: 'gr',
  터키: 'tr',
  베트남: 'vn',
  중국: 'cn',
  일본: 'jp',
  한국: 'kr',
  브라질: 'br',
  스페인: 'es',
  프랑스: 'fr',
  태국: 'th',
  이스라엘: 'il',
  이탈리아: 'it',
};
