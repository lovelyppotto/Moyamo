import { useRef, useState, useEffect } from 'react';
import GestureSearchBar from './GestureSearchBar';
import GestureSearchPreview from './GestureSearchPreview';
import { useLocation } from 'react-router-dom';
import { useGestureSearch } from '@/hooks/apiHooks';

function GestureSearchInput() {
  const location = useLocation();
  const searchInputRef = useRef<HTMLDivElement>(null);

  // 로컬 상태 관리
  const [showResults, setShowResults] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isCameraSearch, setIsCameraSearch] = useState(false);

  // URL에서 검색어와 카메라 검색 여부 확인
  const params = new URLSearchParams(location.search);
  const gestureName = params.get('gesture_name') || '';
  const gestureLabel = params.get('gesture_label') || '';
  const countryId = params.get('country_id') ? parseInt(params.get('country_id')!, 10) : 0;
  const searchTerm = gestureLabel || gestureName;

  // 홈 페이지 여부 확인
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  // 검색 쿼리 실행
  const { data: searchResults, isLoading } = useGestureSearch(searchTerm, countryId, {
    // 홈 페이지이고 검색어가 있을 때만 자동으로 요청
    enabled: isHomePage && searchTerm !== '',
  });

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
    // 홈 페이지에서만 검색 결과를 표시
    setShowResults(isHomePage && searchTerm !== '');
  }, [searchTerm, isHomePage]);

  // 검색 결과 클릭 핸들러
  const handleResultClick = (result: any) => {
    // 검색 결과 페이지로 이동
    window.location.href = `/search?gesture_name=${encodeURIComponent(result.gestureName)}`;
  };

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
