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
