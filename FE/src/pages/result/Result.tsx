// src/components/result/Result.tsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderBar from "../home/HeaderBar";
import { useTheme } from '@/components/theme-provider';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    const countryId = countryIdMap[country];
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
        <div className="rounded-xl p-6 backdrop-blur-sm">
          {searchCountry !== '전체' && (
            <div className="mb-6">
              <p className="text-lg dark:text-d-txt-50/80">
                "{searchCountry}" 국가로 필터링됨
              </p>
            </div>
          )}
          
          {/* result 문구 양옆에 점선 넣는걸로 변경 */}
          <h2 
            className="mb-6 text-center border-b border-dashed pb-4 
              text-2xl font-[DNFBitBitv2]
              dark:text-d-txt-50
              "
            >
            RESULTS
          </h2>
          
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
                  className="bg-white dark:bg-white/15 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleGestureClick(result.gestureId)}
                >
                  <div className="flex items-center">
                    <div className="w-32 h-32 mr-6 flex-shrink-0">
                      <img 
                        src={result.gestureImg} 
                        alt={result.gestureName}
                        className="w-full h-full object-cover rounded-md" 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2 dark:text-d-txt-50">
                        {result.gestureName}
                      </h3>
                      <p className="text-gray-600 dark:text-d-txt-50/70 mb-4">
                        {result.meanings[0]?.meaning.substring(0, 100)}
                        {result.meanings[0]?.meaning.length > 100 ? '...' : ''}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.meanings.map((meaning) => (
                          <div key={meaning.countryId} className="flex items-center">
                            <img 
                              src={countryFlags[meaning.countryName] || '/images/flags/default.png'} 
                              alt={meaning.countryName}
                              className="w-8 h-8 rounded-full object-cover mr-1" 
                            />
                          </div>
                        ))}
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