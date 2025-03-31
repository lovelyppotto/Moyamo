import { GestureListResponse, GesturesByCountry } from '../types/dictionaryType';
import { GestureDetailResponse, GestureDetail } from '../types/dictDetailType';
import apiClient from '@/api/apiClient';

// API 응답에서 받는 제스처 아이템 원본 형태
type GestureApiItem = GestureListResponse['data']['gestures'][0];

/**
 * 국가별 제스처 목록 조회
 * @param countryId
 * @returns 제스처 목록
 */
export const getGesturesByCountry = async (countryId: number): Promise<GesturesByCountry> => {
  const { data } = await apiClient.get<GestureListResponse>('/api/gestures', {
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
 * 제스처 디테일 조회
 * @param gestureId
 * @param countryId
 * @return 제스처 디테일
 */
export const getGestureDetail = async (
  gestureId: number,
  countryId: number
): Promise<GestureDetail> => {
  const { data } = await apiClient.get<GestureDetailResponse>('/api/gestures/detail', {
    params: {
      gesture_id: gestureId,
      country_id: countryId,
    },
  });
  return {
    countryId: data.data.country_id,
    countryName: data.data.country_name,
    imageUrl: data.data.image_url,
    meaningId: data.data.meaning_id,
    gestureId: data.data.gesture_id,
    gestureImage: data.data.gesture_image,
    gestureTitle: data.data.gesture_title,
    gestureMeaning: data.data.gesture_meaning,
    gestureSituation: data.data.gesture_situation,
    gestureOthers: data.data.gesture_others,
    gestureTmi: data.data.gesture_tmi,
    isPositive: data.data.is_positive,
    multipleGestures: data.data.multiple_gestures,
  };
};

/**
 * 제스처 비교 가이드 조회
 */
