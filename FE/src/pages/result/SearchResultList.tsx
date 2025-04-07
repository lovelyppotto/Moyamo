
import { GestureSearchResult } from '@/types/searchGestureType';
import SearchResultItem from './SearchResultItem';

interface SearchResultsListProps {
  results: GestureSearchResult[];
  onFlagClick?: (countryId: number, gestureName: string) => void;
  searchType?: 'text' | 'camera'; // 검색 유형
}

function SearchResultsList({ 
  results, 
  onFlagClick,
  searchType = 'text' // 기본값은 텍스트 검색
}: SearchResultsListProps) {
  // URL을 확인하여 카메라 검색 페이지인지 자동으로 감지
  const isCameraSearch = searchType === 'camera' || window.location.pathname.includes('/search/camera');
  const finalSearchType = isCameraSearch ? 'camera' : 'text';
  
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      {/* 결과 리스트 컨테이너 (스크롤) */}
      <div className="flex-1 overflow-y-auto">
        {results.length === 0 ? (
          <div className="text-center">
            <p className="text-base md:text-lg font-[NanumSquareRound]
            text-gray-600 dark:text-d-txt-50/70">
              검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 pb-4 px-4">
            {results.map((result, index) => (
              <SearchResultItem 
                key={`${result.gestureId}-${index}`}
                result={result} 
                onFlagClick={onFlagClick} 
                index={index}
                searchType={finalSearchType}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultsList;