import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchStore } from '@/stores/useSearchStore';
import { getCountryName } from '@/utils/countryUtils';

export const useSearchNavigation = (
  setSelectedCountryName: (name: string) => void
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  const {
    searchTerm,
    setSearchTerm,
    searchCountry,
    setSearchCountry,
    resetSearchTerm,
  } = useSearchStore();

  // URL에서 검색 파라미터 업데이트
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gestureName = params.get('gesture_name') || '';
    const countryParam = params.get('country_id');

    if (!params.has('gesture_name')) {
      resetSearchTerm();
      queryClient.invalidateQueries({ queryKey: ['gestureName'] });
      return;
    }

    const countryId = countryParam ? parseInt(countryParam, 10) : 0;
    setSelectedCountryName(getCountryName(countryId));
    setSearchTerm(gestureName);
    setSearchCountry(countryId);
  }, [location.search, setSearchTerm, setSearchCountry, resetSearchTerm, queryClient, setSelectedCountryName]);

  // 검색 처리
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      const params = new URLSearchParams();
      if (searchCountry !== 0) {
        params.set('country_id', searchCountry.toString());
      }
      navigate(params.toString() ? `/search?${params.toString()}` : '/search', { replace: true });
      return;
    }

    navigate(
      `/search?gesture_name=${encodeURIComponent(searchTerm)}${searchCountry !== 0 ? `&country_id=${searchCountry}` : ''}`
    );
  };

  // 입력 변경 시 URL 업데이트
  const updateUrlOnInputChange = (newValue: string) => {
    if (newValue === '') {
      const params = new URLSearchParams(location.search);
      params.delete('gesture_name');
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

      if (searchTerm.trim()) {
        params.set('gesture_name', searchTerm);
      }

      navigate(`/search?${params.toString()}`, { replace: true });
    }
  };

  return {
    handleSearch,
    updateUrlOnInputChange,
    updateUrlOnCountrySelect
  };
};