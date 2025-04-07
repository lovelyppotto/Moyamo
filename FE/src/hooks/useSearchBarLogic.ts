import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchStore } from '@/stores/useSearchStore';
import { getCountryId } from '@/utils/countryUtils';
import { useSearchNavigation } from '@/hooks/useSearchNavigation';
import { useGestureSearch } from '@/hooks/apiHooks';

export const useSearchBarLogic = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, searchCountry, setSearchCountry } = useSearchStore();

  const [selectedCountryName, setSelectedCountryName] = useState('전체');
  const [isMobile, setIsMobile] = useState(false);
  const [isCameraSearch, setIsCameraSearch] = useState(false);

  const { refetch } = useGestureSearch(searchTerm, searchCountry, {
    enabled: false, // 수동으로 refetch 호출할 때만 요청
  });

  const countries = ['전체', '한국', '미국', '일본', '중국', '이탈리아'];

  const { handleSearch, updateUrlOnInputChange, updateUrlOnCountrySelect } =
    useSearchNavigation(setSelectedCountryName);

  // URL에서 gesture_label 파라미터 확인 및 검색어 설정
  useEffect(() => {
    const url = new URL(window.location.href);
    const gestureLabel = url.searchParams.get('gesture_label');

    if (gestureLabel) {
      setSearchTerm(gestureLabel);
      setIsCameraSearch(true);
    } else {
      setIsCameraSearch(false);
    }
  }, [location.search, setSearchTerm]);

  // 화면 크기에 따라 모바일 여부 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    // 사용자가 입력을 시작하면 카메라 검색 모드 확인
    const url = new URL(window.location.href);
    const hasCameraParam = url.searchParams.has('gesture_label');

    // 카메라 검색 모드에서 첫 입력 시에만 파라미터 제거
    if (hasCameraParam && location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      params.delete('gesture_label');

      // 이전 검색어 파라미터는 유지 (실시간 검색을 위해)
      // 새로운 URL로 이동
      window.history.replaceState({}, '', `/search?${params.toString()}`);

      // 카메라 검색 모드 해제 (상태만 변경)
      setIsCameraSearch(false);
    }

    // 기존 입력 처리 로직은 그대로 유지 (실시간 검색 위해)
    updateUrlOnInputChange(newValue);
  };

  // 키 입력 핸들러
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 카메라 검색 모드였다면 해제
      if (isCameraSearch) {
        const url = new URL(window.location.href);
        url.searchParams.delete('gesture_label');
        url.searchParams.set('gesture_name', searchTerm);
        navigate(url.pathname + url.search, { replace: true });
        setIsCameraSearch(false);
      }
      handleSearch();
    }
  };

  // 국가 선택 핸들러
  const handleCountrySelect = (country: string) => {
    const countryId = getCountryId(country);
    setSearchCountry(countryId);
    setSelectedCountryName(country);

    // 카메라 검색 모드였다면 해제하고 일반 검색으로 전환
    if (isCameraSearch) {
      const url = new URL(window.location.href);
      if (url.searchParams.has('gesture_label')) {
        const currentTerm = searchTerm;
        url.searchParams.delete('gesture_label');
        if (currentTerm) {
          url.searchParams.set('gesture_name', currentTerm);
        }
        // URL 업데이트 (브라우저 히스토리 변경)
        navigate(url.pathname + url.search, { replace: true });
        setIsCameraSearch(false);
      }
    }

    updateUrlOnCountrySelect(countryId);
  };

  // 검색 실행 핸들러
  const executeSearch = () => {
    // 카메라 검색 모드였다면 해제
    if (isCameraSearch) {
      const url = new URL(window.location.href);
      url.searchParams.delete('gesture_label');
      if (searchTerm) {
        url.searchParams.set('gesture_name', searchTerm);
      }
      navigate(url.pathname + url.search, { replace: true });
      setIsCameraSearch(false);
    }

    refetch();
    handleSearch();
  };

  return {
    isMobile,
    searchTerm,
    selectedCountryName,
    countries,
    handleInputChange,
    handleInputKeyDown,
    handleCountrySelect,
    executeSearch,
  };
};
