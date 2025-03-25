// src/components/GestureSearch.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import BaseDropdown from '../pages/home/BaseDropdown';
import SearchCameraModal from './SearchCameraModal';
import { ResultMockData, searchResultMock } from '../pages/result/resultMock';

// 국가 ID 매핑
// const countryIdMap: Record<string, number> = {
//   '전체': 0,
//   '대한민국': 1,
//   '미국': 2,
//   '일본': 3,
//   '중국': 4,
//   '이탈리아': 5,
// };

interface GestureSearchInputProps {
  onSearch?: (results: ResultMockData[]) => void;
}

function GestureSearchInput({ onSearch }: GestureSearchInputProps) {
  const navigate = useNavigate();
  const [searchCountry, setSearchCountry] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ResultMockData[]>([]);
  const [showResults, setShowResults] = useState(false);

  const countries = ['전체', '한국', '미국', '일본', '중국', '이탈리아'];

  // 검색 처리 함수 - 두 가지 방식 중 하나만 선택
  // 검색 결과 페이지로 이동
  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    // 상위 컴포넌트에 결과 전달 (필요한 경우)
    if (onSearch) {
      const results = performSearch(searchTerm, searchCountry);
      onSearch(results);
    }

    // 검색 결과 페이지로 이동 (API 형식 맞춰둠)
    navigate(
      `/search?gesture_name=${encodeURIComponent(searchTerm)}&country=${encodeURIComponent(searchCountry)}`
    );
  };

  // 인라인 결과 표시할 경우 사용 (드롭다운)
  // const handleSearchInline = () => {
  //   if (!searchTerm.trim()) {
  //     setSearchResults([]);
  //     setShowResults(false);
  //     return;
  //   }

  //   const results = performSearch(searchTerm, searchCountry);

  //   setSearchResults(results);
  //   setShowResults(true);

  //   // 상위 컴포넌트에 결과 전달
  //   if (onSearch) {
  //     onSearch(results);
  //   }
  // };

  // 검색 로직 (재사용을 위한 별도 함수)
  const performSearch = (term: string, country: string): ResultMockData[] => {
    let results = searchResultMock.filter((item) => {
      // 제스처 이름으로 검색
      const nameMatch = item.gestureName.includes(term);

      // 국가별 필터링
      const countryMatch =
        country === '전체' ||
        item.meanings.some((meaning) => {
          // 한국 -> 대한민국 변환
          const searchCountryName = country === '한국' ? '대한민국' : country;
          return meaning.countryName.includes(searchCountryName);
        });

      return nameMatch && countryMatch;
    });

    return results;
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
      handleSearch(); // 또는 handleSearchInline() 사용
    }
  };

  // 검색 국가 변경 핸들러
  const handleCountrySelect = (country: string) => {
    setSearchCountry(country);
  };

  // 제스처 항목 클릭 핸들러
  const handleGestureClick = (gestureId: number) => {
    navigate(`/gesture/${gestureId}`);
    setShowResults(false);
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
          selected={searchCountry}
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

      {/* 검색 결과 표시 (드롭다운 방식 사용 시) */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg search-results max-h-96 overflow-auto">
          <ul className="py-2">
            {searchResults.map((result) => (
              <li
                key={result.gestureId}
                className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleGestureClick(result.gestureId)}
              >
                <div className="flex items-center">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={result.gestureImg}
                      alt={result.gestureName}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold dark:text-d-txt-50">{result.gestureName}</h3>
                    <p className="text-gray-600 dark:text-d-txt-50/70 text-sm line-clamp-2">
                      {result.meanings.map((m) => m.countryName).join(', ')}에서 사용
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showResults && searchResults.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg search-results">
          <div className="py-8 text-center text-gray-500 dark:text-d-txt-50/70">
            검색 결과가 없습니다.
          </div>
        </div>
      )}
    </div>
  );
}

export default GestureSearchInput;
