import { GestureSearchBar } from './GestureSearchBar';
import GestureSearchPreview from './GestureSearchPreview';
import { useSearchInputLogic } from '@/hooks/useSearchInputLogic';

function GestureSearchInput() {
  const {
    searchInputRef,
    showResults,
    isLoading,
    searchResults,
    isCameraSearch,
    isSmallScreen,
    handleResultClick,
  } = useSearchInputLogic();

  return (
    <div className="search-container relative">
      <GestureSearchBar searchInputRef={searchInputRef} isCameraSearch={isCameraSearch} />

      {showResults && (
        <GestureSearchPreview
          isLoading={isLoading}
          searchResults={searchResults}
          isSmallScreen={isSmallScreen}
          onResultClick={handleResultClick}
        />
      )}
    </div>
  );
}

export default GestureSearchInput;
