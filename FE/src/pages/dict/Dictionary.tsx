import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { faHands, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { DictListCarousel } from './DictListCarousel';
import DictMainImage from './MainGestureImage';
import IconButton from '@/pages/dict/IconButton';
import { useLocation, useNavigate } from 'react-router-dom';
import DictHeader from './header/DictHeader';
import { Country } from '@/types/dictionaryType';
import { useGesturesByCountry } from '@/hooks/apiHooks';

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
  const { data: gestureData, isLoading, isError, error } = useGesturesByCountry(selectedCountry.id);

  // API에서 제스처 데이터 가져오기
  useEffect(() => {
    // gestureData가 존재하고 gestures 배열이 있을 때만 처리
    if (gestureData?.gestures && gestureData.gestures.length > 0) {
      // 국가 변경되면 첫번째 제스처를 선택
      setSelectedGesture(gestureData.gestures[0].gestureId);
    }
  }, [gestureData]);

  // 현재 선택한 국가에 해당하는 제스처 목록
  const currentGestures = gestureData?.gestures || [];

  // 현재 선택된 제스처
  const currentGesture =
    currentGestures.find((gesture) => gesture.gestureId === selectedGesture) ||
    (currentGestures.length > 0 ? currentGestures[0] : null);

  // 제스처 선택 핸들러
  const handleSelectGesture = (gestureId: number) => {
    setSelectedGesture(gestureId);
  };

  // 국가 선택 핸들러
  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    // 다른 국가 선택 시 URL 파라미터 업데이트
    navigate(`/dictionary?country_id=${country.id}`, { replace: true });
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
    if (!currentGesture) return; // 제스처가 없으면 이동 안함

    navigate(
      `/dictionary/detail?gesture_id=${currentGesture.gestureId}&country_id=${selectedCountry.id}`,
      {
        replace: true,
      }
    );
  };

  // 비교 가이드로 이동
  const handleGuideButtonClick = () => {
    if (!currentGesture) return;

    navigate(`/dictionary/compare?gesture_id=${currentGesture.gestureId}`, {
      replace: true,
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-full dark:bg-gray-900 dark:text-d-txt-50">
      {/* 헤더 영역 */}
      <div className="flex-none">
        <DictHeader
          showCountrySelector={true}
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
          countryOptions={countryOptions}
          showCompareGuide={false}
        />
      </div>

      {/* 메인 컨텐츠 컨테이너 */}
      <div className="flex-1 flex flex-col font-[NanumSquareRound] container mx-auto px-2 sm:px-4 md:px-6 lg:px-16 xl:px-35 2xl:px-60 pb-4">
        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-between py-2 h-[70vh] sm:h-[60vh] md:h-[65vh]">
          {/* 제스처 이미지 컨테이너 */}
          <div className="w-full sm:w-[85%] lg:w-[92%] h-[80%] sm:h-full flex items-center justify-center">
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
        <div className="h-[25vh] sm:h-[30vh] w-full">
          <DictListCarousel
            gestures={currentGestures}
            onSelectGesture={handleSelectGesture}
            selectedCountry={selectedCountry.code}
          />
        </div>
      </div>
    </div>
  );
}

export default Dictionary;
