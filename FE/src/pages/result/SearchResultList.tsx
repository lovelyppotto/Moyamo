import { ResultMockData } from './resultMock.ts';
import SearchResultItem from './SearchResultItem.tsx';


interface SearchResultsListProps {
  results: ResultMockData[];
  onResultClick: (gestureId: number) => void;
}

function SearchResultsList({ results, onResultClick }: SearchResultsListProps) {
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      {/* 결과 리스트 컨테이너 (스크롤) */}
      <div className="flex-1 overflow-y-auto" style={{ minHeight: '0' }}>
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-d-txt-50/70">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 pb-6 px-4">
            {results.map((result) => (
              <SearchResultItem key={result.gestureId} result={result} onClick={onResultClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsList;
