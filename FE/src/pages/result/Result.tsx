// src/components/result/Result.tsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderBar from '../home/HeaderBar';
import { useTheme } from '@/components/theme-provider';
import { searchResultMock, ResultMockData } from './resultMock';
import SearchResultsList from './SearchResultList';
import '@/components/ui/scrollbar.css';

function Result() {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<ResultMockData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCountry, setSearchCountry] = useState('전체');

  // URL에서 검색어와 국가 파라미터 추출
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('gesture_name') || '';
    const country = queryParams.get('country') || '전체';

    setSearchTerm(query);
    setSearchCountry(country);

    // 검색 수행
    performSearch(query, country);

    // 나중에 API 호출 추가
  }, [location.search]);

  // 검색 로직 수행
  const performSearch = (query: string, country: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    // const countryId = countryIdMap[country];
    let results = searchResultMock.filter((item) => {
      // 제스처 이름으로 검색
      const nameMatch = item.gestureName.includes(query);

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

    setSearchResults(results);
  };

  // 제스처 상세 페이지로 이동
  const handleGestureClick = (gestureId: number) => {
    navigate(`/gesture/${gestureId}`);
  };

  // 추후 레이아웃으로 이동
  // const handleBack = () => {
  //   navigate(-1);
  // };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage:
          theme === 'dark' ? 'url(/images/background-dark.webp)' : 'url(/images/background.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 기존 HeaderBar는 유지 */}
      <HeaderBar />

      {/* 타이틀 영역 - 고정 부분 */}
      <div className="flex items-center justify-center mx-auto w-[30%] py-2 pb-5">
        <div className="flex-grow h-0 border-t-2 border-dashed border-gray-400 dark:border-d-txt-50/50 mx-4"></div>
        <h2 className="text-2xl font-[DNFBitBitv2] dark:text-d-txt-50 px-4">RESULTS</h2>
        <div className="flex-grow h-0 border-t-2 border-dashed border-gray-400 dark:border-d-txt-50/50 mx-4"></div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex justify-center">
        <div
          className="customScrollbar kr max-w-5xl w-full h-full mx-auto rounded-xl"
          style={{
            maxHeight: 'calc(100vh - 250px)', // height 대신 maxHeight 사용
            overflowY: 'auto',
          }}
        >
          <div>
            <SearchResultsList results={searchResults} onResultClick={handleGestureClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
