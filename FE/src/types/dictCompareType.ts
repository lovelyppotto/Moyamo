// 비교 가이드 API 응답
export type CompareGuideResponse = {
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
  gestureTitle: string;
  meanings: MeaningItem[];
};
