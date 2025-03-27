import React from 'react';
import { GestureSearchResult } from '@/types/searchGestureType';

// 국가별 국기 이미지 매핑
const countryFlags: Record<string, string> = {
  '대한민국': '/images/flags/kr.webp',
  '미국': '/images/flags/us.webp',
  '일본': '/images/flags/jp.webp',
  '중국': '/images/flags/cn.webp',
  '이탈리아': '/images/flags/it.webp',
  '뉴질랜드': '/images/flags/nz.webp',
};

interface SearchResultItemProps {
  result: GestureSearchResult;
  onClick: (gestureId: number) => void;
}

function SearchResultItem({ result, onClick }: SearchResultItemProps) {
  return (
    <div 
      className="cursor-pointer my-2"
      onClick={() => onClick(result.gestureId)}
    >
      <div className="flex items-center">
        {/* 이미지 컨테이너 */}
        <div className="flex w-28 h-28 justify-center items-center mr-2 flex-shrink-0">
          <img 
            src={result.gestureImage} 
            alt={result.gestureName}
            className="h-full object-cover rounded-md" 
          />
        </div>
        {/* 제스처 설명 - 말풍선 스타일 */}
        <div className="flex-1 ml-4 relative">
          <div 
            className="relative rounded-lg shadow-md p-6
            bg-white
            dark:bg-gray-700 drop-shadow-basic
            ">
            {/* 말풍선 꼬리 */}
            <div className="absolute left-0 top-2/3 transform -translate-x-full -translate-y-1/2">
              <svg width="15" height="30" viewBox="0 0 15 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5 L0 15 L15 25 Z" fill="white" className="dark:fill-gray-700"/>
              </svg>
            </div>
            
            {/* 제목 */}
            <div className="flex justify-between items-start mb-1 relative z-10">
              <h3 
                className="text-3xl font-bold font-[NanumSquareRoundEB] text-gray-900
                dark:text-d-txt-50"
              >
                {result.gestureName}
              </h3>
              
              {/* 국가 플래그 영역 */}
              <div className="flex items-center space-x-2">
                {result.meanings.map((meaning) => (
                  <React.Fragment key={meaning.countryId}>
                    <div className="relative group">
                      <img 
                        src={countryFlags[meaning.name] || '/images/placeholder/400/320'} 
                        alt={meaning.name}
                        className="w-10 h-6 object-cover drop-shadow-nation" 
                      />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* 설명 텍스트 */}
            <p className="relative z-10 
            text-lg text-gray-700 font-[NanumSquareRound]
            dark:text-d-txt-50">
              {result.meanings[0]?.meaning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultItem;