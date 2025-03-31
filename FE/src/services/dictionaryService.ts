import { GestureResponse, GestureCompareResponse } from '../types/dictionaryType';
import apiClient from '@/api/apiClient';

//개발 환경 확인
const isDevelopment = import.meta.env.MODE === 'development';
// 목 데이터 사용 여부를 localStorage에서 가져오기 (개발 중 전환 가능하도록)
const useMockData = () => {
  try {
    const storedValue = localStorage.getItem('useMockData');
    // localStorage에 값이 명시적으로 있으면 그 값을 사용
    if (storedValue !== null) {
      return storedValue === 'true';
    }
    // 없으면 개발 환경 여부로 결정
    return isDevelopment;
  } catch {
    return isDevelopment;
  }
};

// API 응답에서 받는 제스처 아이템 원본 형태
type GestureApiItem = GestureResponse['data']['gestures'][0];

// 변환된 카멜케이스 제스처 아이템 형태
interface GestureItem {
  meaningId: number;
  gestureId: number;
  imageUrl: string | null;
  gestureTitle: string;
}

// 국가별 제스처 목록 반환 타입
interface GesturesByCountry {
  countryId: number;
  countryName: string;
  imageUrl: string | null;
  gestures: GestureItem[];
}

/**
 * 국가별 제스처 목록 조회
 * @param countryId
 * @returns 제스처 목록
 */
export const getGesturesByCountry = async (countryId: number): Promise<GesturesByCountry> => {
  const { data } = await apiClient.get<GestureResponse>('/api/gestures/', {
    params: {
      country_id: countryId,
    },
  });

  return {
    countryId: data.data.country_id,
    countryName: data.data.country_name,
    imageUrl: data.data.image_url,
    gestures: data.data.gestures.map((gesture: GestureApiItem) => ({
      meaningId: gesture.meaning_id,
      gestureId: gesture.gesture_id,
      imageUrl: gesture.image_url,
      gestureTitle: gesture.gesture_title,
    })),
  };
};

/**
 * 제스처 비교 가이드 조회
 */
