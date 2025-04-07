import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { faHands, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { DictListCarousel } from './DictListCarousel';
import DictMainImage from './MainGestureImage';
import IconButton from '@/components/IconButton';
import { useLocation, useNavigate } from 'react-router-dom';
import DictHeader from './header/DictHeader';
import { Country } from '@/types/dictionaryType';
import { useGesturesByCountry } from '@/hooks/apiHooks';
import ErrorPage from '@/components/ErrorPage';

function Dictionary() {
  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 country_id 파라미터 가져오기
  const queryParams = new URLSearchParams(location.search);
  const countryIdParam = queryParams.get('country_id');

  useEffect(() => {
    const countryIdParam = queryParams.get('country_id');

    // country_id가 있지만 유효하지 않은 경우 홈으로 리다이렉트
    if (countryIdParam !== null) {
      const parsedId = parseInt(countryIdParam);
      if (isNaN(parsedId) || parsedId < 1 || parsedId > 5) {
        navigate('/');
      }
    }
  }, []);

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
  const [shuffledGestures, setShuffledGestures] = useState<any[]>([]); // 셔플된 제스처 목록 상태

  // 리액트 쿼리를 사용하여 제스처 데이터 가져오기
  const { data: gestureData, isLoading, isError } = useGesturesByCountry(selectedCountry.id);

  // 로딩 상태 확인 - 로딩 페이지 구현 필요
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center font-[NanumSquareRoundEB] text-[40px]">
        로딩 중...
      </div>
    );
  }

  // 에러 상태 확인
  if (isError || !gestureData) {
    return <ErrorPage />;
  }

  // 제스처 데이터 섞기 및 초기 선택 제스처 설정
  useEffect(() => {
    if (gestureData?.gestures && gestureData.gestures.length > 0) {
      // 원본 배열을 복사해서 작업 (원본 데이터 유지)
      const newShuffledGestures = [...gestureData.gestures];

      // Fisher-Yates 셔플 알고리즘
      for (let i = newShuffledGestures.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newShuffledGestures[i], newShuffledGestures[j]] = [
          newShuffledGestures[j],
          newShuffledGestures[i],
        ];
      }

      setShuffledGestures(newShuffledGestures);

      // 국가 변경되면 첫번째 제스처를 선택
      setSelectedGesture(newShuffledGestures[0].gestureId);
    }
  }, [gestureData]);

  // 현재 제스처 목록
  const currentGestures = shuffledGestures;

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
          />
        </div>
      </div>
    </div>
  );
}

export default Dictionary;
