import { useQuery } from '@tanstack/react-query';
import { searchGestures } from '@/services/searchService';
import { getGesturesByCountry, getGestureDetail } from '@/services/dictionaryService';
import { getTips } from '@/services/tipService';

// 제스처 검색
export function useGestureSearch(
  gestureName: string,
  countryId?: number,
  options = { enabled: true }
) {
  const trimmedName = gestureName.trim();
  const isValidQuery = !!trimmedName;

  // // 개발용 로그
  // if (process.env.NODE_ENV === 'development') {
  //   console.log('검색 쿼리 파라미터:', {
  //     gestureName: trimmedName,
  //     countryId,
  //     isEnabled: isValidQuery && options.enabled,
  //   });
  // }

  return useQuery({
    queryKey: ['gestureName', trimmedName, countryId],
    queryFn: () => searchGestures(trimmedName, countryId),
    // 검색어가 있고 enabled 옵션이 true일 때만 API 호출
    enabled: isValidQuery && options.enabled,
    staleTime: 5 * 60 * 1000,
    initialData: isValidQuery ? undefined : [],
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
      const [_, id] = queryKey;
      const response = await getGesturesByCountry(id as number);
      return response;
    },
    enabled: !!countryId,
    staleTime: 0,
  });
}

// 제스처 상세정보 가져오기
export function useGestureDetail(gestureId?: number, countryId?: number) {
  return useQuery({
    queryKey: ['gestureDetail', gestureId, countryId],
    queryFn: async ({ queryKey }) => {
      const [_, gestureIdParam, countryIdParam] = queryKey;
      const response = await getGestureDetail(gestureIdParam as number, countryIdParam as number);
      return response;
    },
    enabled: !!gestureId && !!countryId,
    staleTime: 0,
  });
}
