import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";

// 제스처 검색
export function useGestureSearch(gestureName: string, countryId?: number) {
  return useQuery({
    queryKey: [ 'gestureSearch', gestureName, 'countryId', countryId ],
    queryFn: async() => {
      const { data } = await apiClient.get('/search/gestures', {
        params: { 
          gesture_name: gestureName,
          country_id: countryId,
        }
      });
      return data;
    },
    enabled: !!gestureName.trim(),
    staleTime: 0,
  })
}

// 문화적 팁 가져오기
export function useTips() {
  return useQuery({
    queryKey: ['tips'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tips');
      return data;
    }
  })
}