import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import BaseDropdown from '@/pages/home/dropdowns/BaseDropdown';
import SearchCameraModal from './cameraModal/SearchCameraModal';
import { useSearchBarLogic } from '@/hooks/useSearchBarLogic';

interface SearchBarProps {
  searchInputRef: React.RefObject<HTMLDivElement | null>;
  isCameraSearch: boolean;
}

export function GestureSearchBar({ searchInputRef, isCameraSearch }: SearchBarProps) {
  const {
    isMobile,
    searchTerm,
    selectedCountryName,
    countries,
    handleInputChange,
    handleInputKeyDown,
    handleCountrySelect,
    executeSearch,
  } = useSearchBarLogic();

  return (
    <div className="flex items-center flex-1">
      {/* 모바일이 아닐 때만 검색 아이콘 표시 */}
      {!isMobile && (
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          size="lg"
          className="mr-3 cursor-pointer text-gray-600 dark:text-white"
          onClick={executeSearch}
        />
      )}

      <BaseDropdown
        selected={selectedCountryName}
        options={countries}
        label="검색 국가"
        onSelect={handleCountrySelect}
      />

      {/* 검색창 */}
      <div className="flex items-center w-full ml-2">
        <div className="relative flex-1 min-w-[70%]" ref={searchInputRef}>
          <input
            className="w-full h-10 px-2 
            text-xs sm:text-sm mb:text-base lg:text-md
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
        <div className="ml-1 flex items-center justify-center">
          <SearchCameraModal />
        </div>
      </div>
    </div>
  );
}
