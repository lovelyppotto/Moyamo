import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { faHands, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { DictListCarousel } from './DictListCarousel';
import DictMainImage from './MainGestureImage';
import IconButton from '@/components/IconButton';
import { useLocation, useNavigate } from 'react-router-dom';
import DictHeader from './DictHeader';
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
        country: selectedCountry,
        gesture: currentGesture,
      },
    });
  };

  // 제스처 디테일로 이동
  const handleDetailButtonClick = () => {
    if (!currentGesture) return; // 제스처가 없으면 이동 안함

    navigate('/dictionary/detail', {
      state: {
        country: selectedCountry,
        gesture: currentGesture,
      },
    });
  };

  // 비교 가이드로 이동
  const handleGuideButtonClick = () => {
    navigate('/dictionary/guide');
  };

  return (
    <div className="flex flex-col h-screen dark:bg-gray-900 dark:text-d-txt-50">
      {/* 헤더 - 고정 높이 사용 */}
      <div className="flex-none mb-[29px]">
        <DictHeader
          showCountrySelector={true}
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
          countryOptions={countryOptions}
          showCompareGuide={true}
        />
      </div>
      {/* 로딩 페이지 */}

      <div className="h-full flex-1 flex flex-col font-[NanumSquareRound] max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
        {/* 메인 컨텐츠 영역 */}
        <div className="h-[70%] flex justify-center items-center py-2">
          {/* 메인 이미지 */}
          <div className="relative flex-grow h-full flex items-center justify-center pr-5">
            {currentGesture && (
              <DictMainImage gesture={currentGesture} countryCode={selectedCountry.code} />
            )}
            {/* 아이콘 버튼 */}
            <div className="w-auto h-full flex flex-col items-center justify- space-y-[30px] cursor-pointer">
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
              />
            </div>
          </div>
        </div>

        {/* 캐러셀 */}
        <div className="h-[22%] w-full flex items-center">
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
