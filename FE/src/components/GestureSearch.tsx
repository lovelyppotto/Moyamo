import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import BaseDropdown from '../pages/home/dropdowns/BaseDropdown';
import SearchCameraModal from './SearchCameraModal';
import { useSearchStore } from '../stores/useSearchStore';
import { useGestureSearch } from '@/hooks/apiHooks';
import { useQueryClient } from '@tanstack/react-query';

// 국가 이름을 ID로 변환하는 함수
const getCountryId = (country: string): number => {
  const countryMap: Record<string, number> = {
    전체: 0,
    한국: 1,
    미국: 2,
    일본: 3,
    중국: 4,
    이탈리아: 5,
  };

  return countryMap[country] || 0;
};

// ID를 국가 이름으로 변환하는 함수
const getCountryName = (id: number): string => {
  const idToCountry: Record<number, string> = {
    0: '전체',
    1: '한국',
    2: '미국',
    3: '일본',
    4: '중국',
    5: '이탈리아',
  };

  return idToCountry[id] || '전체';
};

function GestureSearchInput() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Zustand 스토어에서 가져온 UI 상태
  const { searchTerm, setSearchTerm, searchCountry, setSearchCountry, resetSearch } =
    useSearchStore();

  const { data: searchResults, refetch } = useGestureSearch(searchTerm, searchCountry);

  // 로컬 상태 (드롭다운 표시 여부)
  const [showResults, setShowResults] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState('전체');

  const countries = ['전체', '한국', '미국', '일본', '중국', '이탈리아'];

  // URL 변경 시 검색어 및 국가 필터 업데이트
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gestureName = params.get('gesture_name') || '';
    const countryParam = params.get('country_id');

    if (!params.has('gesture_name')) {
      resetSearch(); // 검색 상태 초기화
      setSelectedCountryName('전체');
      // React Query 캐시 초기화 (선택적)
      queryClient.invalidateQueries({ queryKey: ['gestureName'] });
      return;
    }

    // 숫자 ID로 변환 (문자열에서 숫자로)
    const countryId = countryParam ? parseInt(countryParam, 10) : 0;

    // 국가 이름 설정
    setSelectedCountryName(getCountryName(countryId));

    // 스토어 상태 업데이트
    setSearchTerm(gestureName);
    setSearchCountry(countryId); // 숫자로 설정
  }, [location.search, setSearchTerm, setSearchCountry]);

  // 검색 결과가 있을때 표시 여부
  useEffect(() => {
    setShowResults(searchTerm !== '' && !!searchResults && searchResults.length > 0);
  }, [searchResults, searchTerm]);

  // 검색 처리 함수
  const handleSearch = () => {
    // 검색어가 비어있는 경우 홈 페이지로 이동하거나 URL에서 검색어 파라미터 제거
    if (!searchTerm.trim()) {
      const params = new URLSearchParams();
      if (searchCountry !== 0) {
        params.set('country_id', searchCountry.toString());
      }
      navigate(params.toString() ? `/search?${params.toString()}` : '/search', { replace: true });
      return;
    }

    // 검색어가 있는 경우 기존 로직대로 처리
    refetch();
    navigate(
      `/search?gesture_name=${encodeURIComponent(searchTerm)}${searchCountry !== 0 ? `&country_id=${searchCountry}` : ''}`
    );
  };

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    // 검색어가 완전히 비어있을 때 URL 업데이트
    if (newValue === '') {
      setShowResults(false);

      // 검색어가 비어있을 때 URL 업데이트
      // 1. 현재 URL에서 gesture_name 파라미터 제거
      const params = new URLSearchParams(location.search);
      params.delete('gesture_name');

      // 2. 다른 파라미터(country_id 등)는 유지
      const newSearch = params.toString();

      // 3. 새 URL로 이동 (replace: true로 브라우저 히스토리에 추가되지 않게 함)
      if (location.pathname === '/search') {
        navigate(newSearch ? `/search?${newSearch}` : '/search', { replace: true });
      }
    }
  };

  // 입력 제출 핸들러
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 검색 국가 변경 핸들러
  const handleCountrySelect = (country: string) => {
    // 국가 이름을 ID로 변환하여 저장
    const countryId = getCountryId(country);
    setSearchCountry(countryId);
    setSelectedCountryName(country);
  };

  return (
    <div className="search-container relative">
      {/* 검색 카테고리 선택 */}
      <div className="flex items-center flex-1">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          size="lg"
          className="mr-3 cursor-pointer"
          onClick={handleSearch}
        />
        <BaseDropdown
          selected={selectedCountryName} // 국가 이름 사용
          options={countries}
          label="검색 국가"
          onSelect={handleCountrySelect}
        />

        {/* 검색창 */}
        <div className="flex items-center w-full ml-2 mr-2">
          <div className="relative flex-1 min-w-[70%]">
            <input
              className="w-full h-10 px-2 
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
          <div className="ml-3 flex items-center justify-center">
            <SearchCameraModal />
          </div>
        </div>
      </div>

      {/* 추후 엘라스틱서치 도입되면 ui적으로 사용할지 안사용할지 정하기 */}
      {/* {searchTerm !== '' && !isLoading && (!searchResults || searchResults.length === 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg search-results">
          <div className="py-8 text-center text-gray-500 dark:text-d-txt-50/70">
            검색 결과가 없습니다.
          </div>
        </div>
      )} */}
    </div>
  );
}

export default GestureSearchInput;
