import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import BaseDropdown from '../pages/home/dropdowns/BaseDropdown';
import SearchCameraModal from './cameraModal/SearchCameraModal';
import { useSearchStore } from '../stores/useSearchStore';
import { useGestureSearch } from '@/hooks/apiHooks';
import { useLocation, useNavigate } from 'react-router-dom';

import { getCountryId } from '@/utils/countryUtils';
import { useSearchNavigation } from '@/hooks/useSearchNavigation';

function GestureSearchInput() {
  // 현재 경로 확인을 위한 location 사용
  const location = useLocation();
  const navigate = useNavigate();

  // 홈 페이지 여부 확인
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  // Zustand 스토어에서 가져온 UI 상태
  const { searchTerm, setSearchTerm, searchCountry, setSearchCountry } = useSearchStore();

  // 검색 결과 표시 영역의 ref
  const searchInputRef = useRef<HTMLDivElement>(null);
  const [searchResultsWidth, setSearchResultsWidth] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // 카메라 검색 여부를 확인하는 상태
  const [isCameraSearch, setIsCameraSearch] = useState(false);

  const {
    data: searchResults,
    refetch,
    isLoading,
  } = useGestureSearch(searchTerm, searchCountry, {
    // 홈 페이지이고 검색어가 있을 때만 자동으로 요청하도록 설정
    enabled: isHomePage && searchTerm !== '',
  });

  // 로컬 상태 (드롭다운 표시 여부)
  const [showResults, setShowResults] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState('전체');
  const [isMobile, setIsMobile] = useState(false);

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

  // 화면 크기에 따라 모바일 여부 및 작은 화면 여부 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallScreen(window.innerWidth <= 500);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // 검색 결과 표시 여부 결정
  useEffect(() => {
    // 홈 페이지에서만 검색 결과를 표시
    setShowResults(isHomePage && searchTerm !== '');

    // 검색어가 변경될 때마다 검색 결과 너비 업데이트
    if (searchInputRef.current) {
      setSearchResultsWidth(searchInputRef.current.offsetWidth);
    }
  }, [searchTerm, isHomePage]);

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
    if (newValue === '') {
      setShowResults(false);
      updateUrlOnInputChange(newValue);
    } else {
      // 새 입력값이 있으면 일반 검색으로 URL 업데이트
      updateUrlOnInputChange(newValue);
    }
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

  return (
    <div className="search-container relative">
      {/* 검색 카테고리 선택 */}
      <div className="flex items-center flex-1">
        {/* 모바일이 아닐 때만 검색 아이콘 표시 */}
        {!isMobile && (
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="lg"
            className="mr-3 cursor-pointer text-gray-600 dark:text-white"
            onClick={executeSearch}
          />
        )}

        <BaseDropdown
          selected={selectedCountryName}
          options={countries}
          label="검색 국가"
          onSelect={handleCountrySelect}
        />

        {/* 검색창 */}
        <div className="flex items-center w-full ml-2">
          <div className="relative flex-1 min-w-[70%]" ref={searchInputRef}>
            <input
              className="w-full h-10 px-2 
              text-xs sm:text-sm mb:text-base lg:text-md
              border-b border-gray-400 focus:outline-none
              dark:border-d-txt-50/80
              dark:text-d-txt-50/90
              font-[NanumSquareRound]"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            />
            {/* {isCameraSearch && (
              <div className="absolute right-2 top-2 text-xs text-blue-500 dark:text-blue-300">
                카메라 검색
              </div>
            )} */}
          </div>
          <div className="ml-1 flex items-center justify-center">
            <SearchCameraModal />
          </div>
        </div>
      </div>

      {/* 실시간 검색 결과 표시 영역 - 간소화된 버전 */}
      {showResults && (
        <div
          className="absolute mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg search-results
        w-[66%] sm:w-[80%] md:w-[60%] lg:w-[73%] xl:w-[80%]
        left-20 md:left-35 lg:left-42 xl:left-40
        drop-shadow-basic"
          style={{ zIndex: 9999 }}
        >
          {isLoading ? (
            <div className="py-4 text-center text-gray-500 dark:text-d-txt-50/70">검색 중...</div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={result.gestureId || index}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(result.gestureName);
                    setShowResults(false);
                    navigate(`/search?gesture_name=${encodeURIComponent(result.gestureName)}`);
                  }}
                >
                  <div className="font-[NanumSquareRound]">{result.gestureName}</div>
                  {!isSmallScreen && result.meanings && result.meanings.length > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {result.meanings[0].meaning}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="py-4 text-center text-gray-500 dark:text-d-txt-50/70 
            font-[NanumSquareRound] text-sm"
            >
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GestureSearchInput;
