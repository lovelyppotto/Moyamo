import { useQuery } from '@tanstack/react-query';
import { searchGestures } from '@/services/searchService';
import { getGesturesByCountry } from '@/services/dictListService';
import { getGestureDetail } from '@/services/dictDetailService';
import { getCompareGuide } from '@/services/dictCompareService';
import { getTips } from '@/services/tipService';

// 제스처 검색
export function useGestureSearch(gestureName: string, countryId?: number) {
  console.log('검색 쿼리 시작:', { gestureName, countryId, isEnabled: !!gestureName.trim() });
  return useQuery({
    queryKey: ['gestureName', gestureName, countryId],
    queryFn: () => searchGestures(gestureName, countryId), // 서비스 함수 호출
    enabled: !!gestureName.trim(),
    staleTime: 5 * 60 * 1000,
  });
}

// 문화적 팁 가져오기
export function useTips() {
  return useQuery({
    queryKey: ['tips'],
    queryFn: getTips,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

/* 딕셔너리 */
// 국가별 제스처 목록 조회
export function useGesturesByCountry(countryId?: number) {
  return useQuery({
    queryKey: ['gesturesByCountry', countryId],
    queryFn: async ({ queryKey }) => {
      const [_, countryIdParam] = queryKey;
      const response = await getGesturesByCountry(countryIdParam as number);
      return response;
    },
    enabled: !!countryId,
    staleTime: 1000 * 60 * 5,
  });
}

// 제스처 상세정보 조회
export function useGestureDetail(gestureId?: number, countryId?: number) {
  return useQuery({
    queryKey: ['gestureDetail', gestureId, countryId],
    queryFn: async ({ queryKey }) => {
      const [_, gestureIdParam, countryIdParam] = queryKey;
      const response = await getGestureDetail(gestureIdParam as number, countryIdParam as number);
      return response;
    },
    enabled: !!gestureId && !!countryId,
    staleTime: 1000 * 60 * 5,
  });
}

// 비교 가이드 조회
export function useCompareGuide(gestureId?: number) {
  return useQuery({
    queryKey: ['compareGuide', gestureId],
    queryFn: async ({ queryKey }) => {
      const [_, gestureIdParam] = queryKey;
      const response = await getCompareGuide(gestureIdParam as number);
      return response;
    },
    enabled: !!gestureId,
    staleTime: 1000 * 60 * 5,
  });
}
