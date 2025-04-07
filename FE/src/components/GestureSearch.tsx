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

  // 컴포넌트 마운트시 및 창 크기 변경시 검색 결과 너비 업데이트
  useEffect(() => {
    const updateSearchResultsWidth = () => {
      if (searchInputRef.current) {
        setSearchResultsWidth(searchInputRef.current.offsetWidth);
      }
    };

    // 초기 너비 설정
    updateSearchResultsWidth();

    // 창 크기 변경 시 너비 업데이트
    window.addEventListener('resize', updateSearchResultsWidth);
    return () => {
      window.removeEventListener('resize', updateSearchResultsWidth);
    };
  }, []);

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

    if (newValue === '') {
      setShowResults(false);
      updateUrlOnInputChange(newValue);
    }
  };

  // 키 입력 핸들러
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 국가 선택 핸들러
  const handleCountrySelect = (country: string) => {
    const countryId = getCountryId(country);
    setSearchCountry(countryId);
    setSelectedCountryName(country);
    updateUrlOnCountrySelect(countryId);
  };

  // 검색 실행 핸들러
  const executeSearch = () => {
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
            <div className="py-4 text-center text-gray-500 dark:text-d-txt-50/70 
            font-[NanumSquareRound] text-sm">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GestureSearchInput;
