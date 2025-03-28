import { GestureResponse } from '../types/dictionaryType';
import apiClient from '@/api/apiClient';

/**
 * 국가별 제스처 목록 조회
 * @param countryId
 * @returns 제스처 목록
 */
export const getGesturesByCountry = async (countryId: number) => {
  const { data } = await apiClient.get<GestureResponse>('/api/gestures/', {
    params: {
      country_id: countryId,
    },
  });

  // 카멜케이스로 변환
  return {
    countryId: data.data.country_id,
    countryName: data.data.country_name,
    imageUrl: data.data.image_url,
    gestures: data.data.gestures.map((gesture) => ({
      meaningId: gesture.meaning_id,
      gestureId: gesture.gesture_id,
      imageUrl: gesture.image_url,
      gestureTitle: gesture.gesture_title,
    })),
  };
};
