import { useQuery } from '@tanstack/react-query';
import { searchGestures } from '@/services/searchService';
import { getGesturesByCountry } from '@/services/dictionaryService';
import apiClient from '@/api/apiClient';

// 제스처 검색
export function useGestureSearch(gestureName: string, countryId?: number) {
  console.log('검색 쿼리 시작:', { gestureName, countryId, isEnabled: !!gestureName.trim() });
  return useQuery({
    queryKey: ['gestureName', gestureName, 'countryId', countryId],
    queryFn: () => searchGestures(gestureName, countryId), // 서비스 함수 호출
    enabled: !!gestureName.trim(),
    staleTime: 0,
  });
}

// 문화적 팁 가져오기(카멜케이스 변환 필요)
export function useTips() {
  return useQuery({
    queryKey: ['tips'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tips');
      return data;
    },
  });
}

/* 딕셔너리 */
// 국가별 제스처 목록 조회
export function useGesturesByCountry(countryId?: number) {
  return useQuery({
    queryKey: ['gesturesByCountry', countryId],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey;
      const response = await getGesturesByCountry(id as number);

      // API 응답을 Gesture 타입으로 변환
      return {
        ...response,
        gestures: response.gestures.map((g) => ({
          id: g.gestureId,
          title: g.gestureTitle,
          image_url: g.imageUrl,
          meaning_id: g.meaningId,
        })),
      };
    },
    enabled: !!countryId,
    staleTime: 0,
  });
}
