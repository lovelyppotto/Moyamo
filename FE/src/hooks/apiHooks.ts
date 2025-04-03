import { useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { searchGestures } from '@/services/searchService';

import { getQuizQuestions, detectGesture } from '@/services/quizService';
import { getGesturesByCountry } from '@/services/dictListService';
import { getGestureDetail } from '@/services/dictDetailService';
import { getCompareGuide } from '@/services/dictCompareService';

import { getTips } from '@/services/tipService';

// 제스처 검색
export function useGestureSearch(
  searchTerm: string,
  countryId?: number,
  options = { enabled: true }
) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // URL에서 카메라 검색 여부 확인
  const isGestureLabel = params.has('gesture_label');
  const gestureLabel = params.get('gesture_label') || '';

  // 최종 검색어 결정 (카메라 라벨 우선)
  const finalSearchTerm = isGestureLabel ? gestureLabel : searchTerm.trim();
  const isValidQuery = !!finalSearchTerm;

  return useQuery({
    // 쿼리 키에 검색 유형 포함 (일반 검색 또는 카메라 검색)
    queryKey: ['gestureName', finalSearchTerm, countryId, isGestureLabel ? 'camera' : 'text'],
    queryFn: () => searchGestures(finalSearchTerm, countryId),
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
      const [_, countryIdParam] = queryKey;
      const response = await getGesturesByCountry(countryIdParam as number);
      return response;
    },
    enabled: !!countryId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60,
    refetchOnMount: 'always',
    retry: false,
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

//퀴즈 문제 가져오기
export function useQuizQuestions(useCamera: boolean) {
  return useQuery({
    queryKey: ['quizQuestions', useCamera],
    queryFn: () => getQuizQuestions(useCamera),
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터 신선하게 유지
  });
}

//영상 퀴즈 ai 인식 결과 가져오기: 수정예정. (데이터 주고 받는 함수)
export function useGestureDetection() {
  return useMutation({
    mutationFn: (imageData: string) => detectGesture(imageData),
  });
}
