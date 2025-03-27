// API 통신과 데이터 변환을 담당하는 서비스 레이어
import { SearchResponse, GestureSearchResult } from './../types/searchGestureType';
import apiClient from '@/api/apiClient';

// 검색 결과 api 호출
export const searchGestures = async (
  gestureName: string, 
  countryId?: number
): Promise<GestureSearchResult> => {
  const { data } = await apiClient.get<SearchResponse>('/search/gestures', {
    params: { 
      gesture_name: gestureName,
      country_id: countryId,
    }
  });
  
  // camelCase로 변환
  return {
    gestureId: data.data.gesture_id,
    gestureName: data.data.gesture_name,
    gestureImage: data.data.gesture_image,
    meanings: data.data.meanings.map(m => ({
      countryId: m.country_id,
      name: m.name,
      meaning: m.meaning
    }))
  };
};