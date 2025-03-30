import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import BaseDropdown from '../pages/home/dropdowns/BaseDropdown';
import SearchCameraModal from './SearchCameraModal';
import { useSearchStore } from '../stores/useSearchStore';
import { useGestureSearch } from '@/hooks/apiHooks';

// 국가 이름을 ID로 변환하는 함수
const getCountryId = (country: string): number => {
  if (country === '전체') return 0;

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

  // Zustand 스토어에서 가져온 UI 상태
  const {
    searchTerm,
    setSearchTerm,
    searchCountry,
    setSearchCountry,
  } = useSearchStore();

  const { data: searchResults, isLoading, refetch } = useGestureSearch(
    searchTerm,
    searchCountry === 0 ? undefined : searchCountry // 0이면 전체 검색
  );

  // 로컬 상태 (드롭다운 표시 여부)
  const [showResults, setShowResults] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState('전체');

  const countries = ['전체', '한국', '미국', '일본', '중국', '이탈리아'];

  // URL 변경 시 검색어 및 국가 필터 업데이트
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gestureName = params.get('gesture_name') || '';
    const countryParam = params.get('country_id');

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
    if (!searchTerm.trim()) return;
  
    // 쿼리 리패치
    refetch();
  
    // 검색 결과 페이지로 이동
    navigate(`/search?gesture_name=${encodeURIComponent(searchTerm)}&country_id=${searchCountry}`);
  };

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setShowResults(false);
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
