import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchStore } from '@/stores/useSearchStore';
import { getCountryName } from '@/utils/countryUtils';

export const useSearchNavigation = (setSelectedCountryName: (name: string) => void) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { searchTerm, setSearchTerm, searchCountry, setSearchCountry, resetSearchTerm } =
    useSearchStore();

  // URL에서 검색 파라미터 업데이트
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const gestureName = params.get('gesture_name') || '';
    const gestureLabel = params.get('gesture_label') || '';
    const countryParam = params.get('country_id');

    // URL에 아무 검색어도 없는 경우 초기화
    if (!params.has('gesture_name') && !params.has('gesture_label')) {
      resetSearchTerm();
      queryClient.invalidateQueries({ queryKey: ['gestureName'] });
      return;
    }

    // 국가 ID 설정
    const countryId = countryParam ? parseInt(countryParam, 10) : 0;
    setSelectedCountryName(getCountryName(countryId));
    setSearchCountry(countryId);

    // 검색어 설정 (카메라 라벨이 있으면 우선 사용)
    const finalSearchTerm = gestureLabel || gestureName;
    setSearchTerm(finalSearchTerm);

    // 디버깅용: 로그 출력
    console.log(
      `[🔍 검색 파라미터] 이름: ${gestureName}, 라벨: ${gestureLabel}, 국가: ${countryId}`
    );
    console.log(`[🔍 최종 검색어] ${finalSearchTerm}`);
  }, [
    location.search,
    setSearchTerm,
    setSearchCountry,
    resetSearchTerm,
    queryClient,
    setSelectedCountryName,
  ]);

  // 검색 처리 (일반 검색 버튼 클릭 시)
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      const params = new URLSearchParams();
      if (searchCountry !== 0) {
        params.set('country_id', searchCountry.toString());
      }
      navigate(params.toString() ? `/search?${params.toString()}` : '/search', { replace: true });
      return;
    }

    // 일반 검색은 항상 gesture_name 사용
    navigate(
      `/search?gesture_name=${encodeURIComponent(searchTerm)}${
        searchCountry !== 0 ? `&country_id=${searchCountry}` : ''
      }`
    );
  };

  // 입력 변경 시 URL 업데이트
  const updateUrlOnInputChange = (newValue: string) => {
    if (newValue === '') {
      const params = new URLSearchParams(location.search);
      params.delete('gesture_name');
      params.delete('gesture_label'); // 카메라 라벨도 함께 삭제
      const newSearch = params.toString();

      if (location.pathname === '/search') {
        navigate(newSearch ? `/search?${newSearch}` : '/search', { replace: true });
      }
    }
  };

  // 국가 선택 시 URL 업데이트
  const updateUrlOnCountrySelect = (countryId: number) => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);

      if (countryId === 0) {
        params.delete('country_id');
      } else {
        params.set('country_id', countryId.toString());
      }

      // 검색어 유지 (기존 파라미터 형식 그대로 유지)
      const hasGestureLabel = params.has('gesture_label');
      const hasGestureName = params.has('gesture_name');

      if (searchTerm.trim() && !hasGestureLabel && !hasGestureName) {
        // 기존에 검색 파라미터가 없으면 일반 검색으로 추가
        params.set('gesture_name', searchTerm);
      }

      navigate(`/search?${params.toString()}`, { replace: true });
    }
  };

  return {
    handleSearch,
    updateUrlOnInputChange,
    updateUrlOnCountrySelect,
  };
};
