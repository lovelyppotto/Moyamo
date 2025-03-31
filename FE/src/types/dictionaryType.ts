// API 응답 형태
export type GestureListResponse = {
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

// 변환된 카멜케이스 제스처 아이템 형태
export interface GestureItem {
  meaningId: number;
  gestureId: number;
  imageUrl: string | null;
  gestureTitle: string;
}

// 국가별 제스처 목록 반환 타입
export interface GesturesByCountry {
  countryId: number;
  countryName: string;
  imageUrl: string | null;
  gestures: GestureItem[];
}

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

