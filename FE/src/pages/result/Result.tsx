// src/components/result/Result.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderBar from "../home/HeaderBar";
import { useTheme } from '@/components/theme-provider';
import { searchResultMock, ResultMockData } from './resultMock';

// 국가 ID 매핑
const countryIdMap: Record<string, number> = {
  '전체': 0,
  '한국': 1,
  '미국': 2,
  '일본': 3,
  '중국': 4,
  '이탈리아': 5,
};

// 국가별 국기 이미지 매핑
const countryFlags: Record<string, string> = {
  '대한민국': '/images/flags/kr.png',
  '미국': '/images/flags/us.png',
  '일본': '/images/flags/jp.png',
  '중국': '/images/flags/cn.png',
  '이탈리아': '/images/flags/it.png',
  '뉴질랜드': '/images/flags/nz.png', // 예시 추가
};

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
      const countryMatch = country === '전체' || 
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
      
      {/* 검색 결과 컨텐츠 */}
      <div className="container mx-auto px-4 overflow-auto flex-1">
        <div className="max-w-5xl mx-auto rounded-xlbackdrop-blur-sm">
          {/* {searchCountry !== '전체' && (
            <div className="mb-6">
              <p className="text-lg dark:text-d-txt-50/80">
                "{searchCountry}" 국가로 필터링됨
              </p>
            </div>
          )}
           */}
          {/* result 문구 양옆 점선 */}
          <div className="flex items-center justify-center mx-auto w-[40%] mb-6">
            <div className="flex-grow h-0 border-t-2 border-dashed border-gray-400 dark:border-d-txt-50/50 mx-4"></div>
            <h2 className="text-2xl font-[DNFBitBitv2] dark:text-d-txt-50 px-4">
              RESULTS
            </h2>
            <div className="flex-grow h-0 border-t-2 border-dashed border-gray-400 dark:border-d-txt-50/50 mx-4"></div>
          </div>
          
          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-d-txt-50/70">
                검색 결과가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {searchResults.map((result) => (
                <div 
                  key={result.gestureId}
                  className="cursor-pointer"
                  onClick={() => handleGestureClick(result.gestureId)}
                >
                  <div className="flex items-center">
                    {/* 이미지 컨테이너 */}
                    <div className="flex w-28 h-28 justify-center item-center flex-shrink-0">
                      <img 
                        src={result.gestureImg} 
                        alt={result.gestureName}
                        className="h-full object-cover rounded-md" 
                      />
                    </div>
                    {/* 제스처 설명 - 말풍선 스타일 */}
                    <div className="flex-1 ml-4 relative">
                      <div className="relative bg-white rounded-lg shadow-md p-6 dark:bg-gray-100 drop-shadow-basic">
                        {/* 말풍선 꼬리 */}
                        <div className="absolute left-0 top-2/3 transform -translate-x-full -translate-y-1/2">
                          <svg width="15" height="30" viewBox="0 0 15 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 5 L0 15 L15 25 Z" fill="white" className="dark:fill-gray-100"/>
                          </svg>
                        </div>
                        
                        {/* 제목 */}
                        <div className="flex justify-between items-start mb-1 relative z-10">
                          <h3 className="text-3xl font-bold font-[NanumSquareRoundEB] text-gray-900">
                            {result.gestureName}
                          </h3>
                          
                          {/* 국가 플래그 영역 */}
                          <div className="flex items-center space-x-2">
                            {result.meanings.map((meaning) => (
                              <React.Fragment key={meaning.countryId}>
                                <div className="relative group">
                                <img 
                                  src={countryFlags[meaning.countryName] || '/images/placeholder/400/320'} 
                                  alt={meaning.countryName}
                                  className="w-10 h-6 object-cover drop-shadow-nation" 
                                />
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                        
                        {/* 설명 텍스트 */}
                        <p className="text-lg text-gray-700 relative z-10 font-[NanumSquareRound]">
                          {result.meanings[0]?.meaning}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Result;