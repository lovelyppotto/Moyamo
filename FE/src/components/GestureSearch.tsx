import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import BaseDropdown from '../pages/home/dropdowns/BaseDropdown';
import SearchCameraModal from './SearchCameraModal';
import { useSearchStore } from '../stores/useSearchStore';
import { useGestureSearch } from '@/hooks/apiHooks';

import { getCountryId } from '@/utils/countryUtils';
import { useSearchNavigation } from '@/hooks/useSearchNavigation';

function GestureSearchInput() {
  // Zustand 스토어에서 가져온 UI 상태
  const { searchTerm, setSearchTerm, searchCountry, setSearchCountry } = useSearchStore();

  const { data: searchResults, refetch } = useGestureSearch(searchTerm, searchCountry, {
    enabled: false,
  });

  // 로컬 상태 (드롭다운 표시 여부)
  const [showResults, setShowResults] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState('전체');

  const countries = ['전체', '한국', '미국', '일본', '중국', '이탈리아'];

  const { handleSearch, updateUrlOnInputChange, updateUrlOnCountrySelect } =
    useSearchNavigation(setSelectedCountryName);

  // 검색 결과 표시 여부 결정
  useEffect(() => {
    setShowResults(searchTerm !== '' && !!searchResults && searchResults.length > 0);
  }, [searchResults, searchTerm]);

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
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          size="lg"
          className="mr-3 cursor-pointer text-gray-600 dark:text-white"
          onClick={executeSearch}
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
