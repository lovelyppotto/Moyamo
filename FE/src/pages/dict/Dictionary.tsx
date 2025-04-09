import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { faHands, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { DictListCarousel } from './DictListCarousel';
import DictMainImage from './MainGestureImage';
import IconButton from '@/components/IconButton';
import { useLocation, useNavigate } from 'react-router-dom';
import DictHeader from './header/DictHeader';
import { Country } from '@/types/dictionaryType';
import { useGesturesByCountry } from '@/hooks/apiHooks';
import LoadingPage from '@/components/LoadingPage';

function Dictionary() {
  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 country_id 파라미터 가져오기
  const queryParams = new URLSearchParams(location.search);
  const countryIdParam = queryParams.get('country_id');

  // 국가 목록
  const countryOptions: Country[] = [
    { code: 'kr', name: '한국', id: 1 },
    { code: 'us', name: '미국', id: 2 },
    { code: 'jp', name: '일본', id: 3 },
    { code: 'cn', name: '중국', id: 4 },
    { code: 'it', name: '이탈리아', id: 5 },
  ];

  // URL 파라미터에서 국가 ID 가져오기
  const initialCountry = countryIdParam
    ? countryOptions.find((country) => country.id === parseInt(countryIdParam)) || countryOptions[0]
    : countryOptions[0];

  const [selectedGesture, setSelectedGesture] = useState<number>(0); // 제스처 선택 상태
  const [selectedCountry, setSelectedCountry] = useState<Country>(initialCountry); // 국가 선택 상태

  // 리액트 쿼리를 사용하여 제스처 데이터 가져오기
  const { data: gestureData, isLoading, isError } = useGesturesByCountry(selectedCountry.id);

  // 유효성 검사
  useEffect(() => {
    // country_id가 있지만 유효하지 않은 경우 홈으로 리다이렉트
    if (countryIdParam !== null) {
      const parsedId = parseInt(countryIdParam);
      if (isNaN(parsedId) || parsedId < 1 || parsedId > 5) {
        navigate('/');
      }
    }
  }, [countryIdParam, navigate]); // 의존성 배열에 navigate 추가

  // 제스처 데이터 초기 선택 설정
  useEffect(() => {
    if (gestureData?.gestures && gestureData.gestures.length > 0) {
      // 세션 스토리지에서 이전에 선택된 제스처를 확인
      const selectedGestureKey = `selectedGesture_${selectedCountry.id}`;
      const storedSelectedGesture = sessionStorage.getItem(selectedGestureKey);

      if (storedSelectedGesture) {
        const parsedGestureId = parseInt(storedSelectedGesture);
        // 해당 제스처가 현재 배열에 존재하는지 확인
        const gestureExists = gestureData.gestures.some(
          (g) => g && typeof g === 'object' && 'gestureId' in g && g.gestureId === parsedGestureId
        );

        if (gestureExists) {
          setSelectedGesture(parsedGestureId);
        } else {
          // 존재하지 않으면 첫 번째 제스처 선택
          setSelectedGesture(gestureData.gestures[0].gestureId);
        }
      } else {
        // 저장된 선택 제스처가 없으면 첫 번째 제스처 선택
        setSelectedGesture(gestureData.gestures[0].gestureId);
      }
    }
  }, [gestureData, selectedCountry.id]);

  useEffect(() => {
    // 현재 페이지 경로 감지
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      // 딕셔너리 관련 경로가 아닌 경우에만 초기화
      if (!currentPath.includes('/dictionary')) {
        const key = `selectedGesture_${selectedCountry.id}`;
        sessionStorage.removeItem(key);
      }
    };

    // 페이지를 떠날 때 이벤트 발생
    window.addEventListener('beforeunload', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleRouteChange);
    };
  }, [selectedCountry.id]);

  // 현재 제스처 목록
  const currentGestures = gestureData?.gestures || [];

  // 현재 선택된 제스처
  const currentGesture =
    currentGestures.find((gesture) => gesture.gestureId === selectedGesture) ||
    (currentGestures.length > 0 ? currentGestures[0] : null);

  // 제스처 선택 핸들러
  const handleSelectGesture = (gestureId: number) => {
    setSelectedGesture(gestureId);
    // 선택한 제스처를 세션 스토리지에 저장
    const selectedGestureKey = `selectedGesture_${selectedCountry.id}`;
    sessionStorage.setItem(selectedGestureKey, gestureId.toString());
  };

  // 국가 선택 핸들러
  const handleSelectCountry = (country: Country) => {
    // ID 유효성 검사 (1~5 사이의 숫자인지 확인)
    if (
      !country ||
      !country.id ||
      isNaN(Number(country.id)) ||
      Number(country.id) < 1 ||
      Number(country.id) > 5
    ) {
      navigate('/');
      return;
    }

    setSelectedCountry(country);
    // 국가 변경 시 선택된 제스처는 초기화하지 않음
    // 로컬 스토리지에서 해당 국가의 선택된 제스처가 있으면 자동으로 로드됨
    navigate(`/dictionary?country_id=${country.id}`);
  };

  // 제스처 연습으로 이동
  const handlePracticeButtonClick = () => {
    if (!currentGesture) return; // 제스처가 없으면 이동 안함

    navigate('/dictionary/practice', {
      state: {
        gesture: currentGesture,
      },
    });
  };

  // 제스처 디테일로 이동
  const handleDetailButtonClick = () => {
    if (!currentGesture || !currentGesture.gestureId) return; // 제스처가 없으면 이동 안함

    // gesture_id 유효성 검사 (예: 숫자이고 특정 범위 내인지)
    const gestureId = currentGesture.gestureId;
    if (isNaN(Number(gestureId)) || Number(gestureId) < 1) {
      navigate('/');
      return;
    }

    // country_id 유효성 검사 (1~5 사이의 값인지)
    if (
      !selectedCountry ||
      !selectedCountry.id ||
      isNaN(Number(selectedCountry.id)) ||
      Number(selectedCountry.id) < 1 ||
      Number(selectedCountry.id) > 5
    ) {
      navigate('/');
      return;
    }

    navigate(`/dictionary/detail?gesture_id=${gestureId}&country_id=${selectedCountry.id}`);
  };

  // 비교 가이드로 이동
  const handleGuideButtonClick = () => {
    if (!currentGesture || !currentGesture.gestureId) return;

    // gesture_id 유효성 검사
    const gestureId = currentGesture.gestureId;
    if (isNaN(Number(gestureId)) || Number(gestureId) < 1) {
      navigate('/');
      return;
    }

    navigate(`/dictionary/compare?gesture_id=${gestureId}`);
  };

  // 에러 상태 확인
  if (isError || !gestureData) {
    navigate('/error');
  }

  return (
    <div className="flex flex-col h-screen w-full dark:bg-gray-900 dark:text-d-txt-50">
      {/* 헤더 영역 */}
      <div className="h-[1/10]">
        <DictHeader
          showCountrySelector={true}
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
          countryOptions={countryOptions}
          showCompareGuide={false}
        />
      </div>

      {/* 메인 컨텐츠 컨테이너 */}
      <div className="flex flex-col justify-evenly font-[NanumSquareRound] container mx-auto px-2 md:px-8 lg:px-16 xl:px-24 2xl:px-4 pb-4 w-full max-w-6xl h-full">
        {/* 메인 컨텐츠 영역 */}
        <div className="flex flex-col sm:flex-row items-center justify-center py-2">
          {/* 제스처 이미지 컨테이너 */}
          <div className="w-full sm:w-[85%] lg:w-[60%] h-[80%] sm:h-full flex items-center justify-center">
            {currentGesture && (
              <DictMainImage gesture={currentGesture} countryCode={selectedCountry.code} />
            )}
          </div>

          {/* 아이콘 버튼 영역 */}
          <div className="flex flex-row sm:flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-0">
            <IconButton
              icon={faHands}
              tooltipText="제스처 연습"
              onClick={handlePracticeButtonClick}
              selectedCountry={selectedCountry.code}
            />
            <IconButton
              icon={faMagnifyingGlassPlus}
              tooltipText="자세히 보기"
              onClick={handleDetailButtonClick}
              selectedCountry={selectedCountry.code}
            />
            <IconButton
              icon={faRectangleList}
              tooltipText="나라별 비교 가이드"
              onClick={handleGuideButtonClick}
              selectedCountry={selectedCountry.code}
              disabled={!currentGesture?.multipleGestures}
            />
          </div>
        </div>

        {/* 캐러셀 영역 */}
        <div className="h-[25vh] sm:h-[30vh] w-full mx-auto">
          <DictListCarousel
            gestures={currentGestures}
            onSelectGesture={handleSelectGesture}
            selectedCountry={selectedCountry.code}
            selectedGestureId={selectedGesture}
          />
        </div>
      </div>
    </div>
  );
}

export default Dictionary;
