import { useRef, useState, useEffect } from 'react';
import GestureSearchBar from './GestureSearchBar';
import GestureSearchPreview from './GestureSearchPreview';
import { useLocation } from 'react-router-dom';
import { useGestureSearch } from '@/hooks/apiHooks';

function GestureSearchInput() {
  const location = useLocation();
  const searchInputRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 로컬 상태 관리
  const [showResults, setShowResults] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isCameraSearch, setIsCameraSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // searchTerm을 상태로 관리

  // URL에서 검색어와 카메라 검색 여부 확인
  const params = new URLSearchParams(location.search);
  const gestureName = params.get('gesture_name') || '';
  const gestureLabel = params.get('gesture_label') || '';
  const countryId = params.get('country_id') ? parseInt(params.get('country_id')!, 10) : 0;

  // 홈 페이지 여부 확인
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  // 검색 쿼리 실행
  const { data: searchResults, isLoading } = useGestureSearch(
    searchTerm || gestureLabel || gestureName,
    countryId,
    {
      enabled: isHomePage && (searchTerm || gestureLabel || gestureName) !== '',
    }
  );

  // 화면 크기에 따라 작은 화면 여부 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 500);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // URL에서 카메라 검색 여부 확인
  useEffect(() => {
    const isInCameraPath = location.pathname === '/search/camera';
    const hasCameraLabel = params.has('gesture_label');
    setIsCameraSearch(isInCameraPath || hasCameraLabel);
  }, [location.pathname, location.search]);

  // 검색 결과 표시 여부 결정
  useEffect(() => {
    console.log('useEffect triggered:', { isHomePage, searchTerm });
    setShowResults(isHomePage && searchTerm !== '');
  }, [searchTerm, isHomePage]);

  // 검색 결과 바깥 영역 클릭 이벤트 핸들링
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    // 검색 결과가 표시되고 있을 때만 이벤트 리스너 추가
    if (showResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showResults]);

  // 검색 결과 클릭 핸들러
  const handleResultClick = (result: any) => {
    window.location.href = `/search?gesture_name=${encodeURIComponent(result.gestureName)}`;
  };

  // 검색어 변경 핸들러
  const handleSearchTermChange = (newTerm: string) => {
    setSearchTerm(newTerm);
  };

  return (
    <div className="search-container relative" ref={searchContainerRef}>
      <GestureSearchBar
        searchInputRef={searchInputRef}
        isCameraSearch={isCameraSearch}
        onSearchTermChange={handleSearchTermChange}
      />

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
