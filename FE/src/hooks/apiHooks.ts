import { useQuery } from "@tanstack/react-query";
import { searchGestures } from "@/services/searchService";
import apiClient from "@/api/apiClient";

// 제스처 검색
export function useGestureSearch(gestureName: string, countryId?: number) {
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
    }
  })
}