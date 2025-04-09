import { GestureSearchResult } from "@/types/searchGestureType";

interface SearchResultsProps {
  isLoading: boolean;
  searchResults: GestureSearchResult[] | undefined;
  isSmallScreen: boolean;
  onResultClick: (result: GestureSearchResult) => void;
}

function GestureSearchPreview(props: SearchResultsProps) {
  const { isLoading, searchResults, isSmallScreen, onResultClick } = props;

  return (
    <div
      className="absolute mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg search-results
      w-[66%] sm:w-[80%] md:w-[70%] lg:w-[78%] xl:w-[78%]
      left-20 md:left-30 lg:left-34 xl:left-35
      drop-shadow-basic overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {isLoading ? (
        <div className="py-4 text-center text-gray-500 dark:text-d-txt-50/70">검색 중...</div>
      ) : searchResults && searchResults.length > 0 ? (
        <div className="max-h-80 overflow-y-auto customScrollbar kr">
          {searchResults.map((result, index) => (
            <div
              key={result.gestureId || index}
              className="px-4 py-2 
              hover:bg-gray-100 dark:hover:bg-gray-700 
              cursor-pointer"
              onClick={() => onResultClick(result)}
            >
              <div className="text-sm md:text-base  font-[NanumSquareRound]">{result.gestureName}</div>
              {!isSmallScreen && result.meanings && result.meanings.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {result.meanings[0].meaning}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="py-4 text-center text-gray-500 dark:text-d-txt-50/70 
          font-[NanumSquareRound] text-sm"
        >
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}

export default GestureSearchPreview;
