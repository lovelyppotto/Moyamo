import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { faHands, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { DictListCarousel } from './DictListCarousel';
import DictMainImage from './MainGestureImage';
import IconButton from '@/components/IconButton';
import { useNavigate } from 'react-router-dom';
import DictHeader from './DictHeader';
import { Country, countryGestures } from '@/types/dictionaryType';

function Dictionary() {
  const navigate = useNavigate();

  // 제스처 선택 상태
  const [selectedGesture, setSelectedGesture] = useState<number>(1);

  // 국가 선택 상태
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'us',
    name: '미국',
    id: 1,
  });

  // 국가 목록
  const countryOptions: Country[] = [
    { code: 'us', name: '미국', id: 1 },
    { code: 'kr', name: '한국', id: 2 },
    { code: 'cn', name: '중국', id: 3 },
    { code: 'jp', name: '일본', id: 4 },
    { code: 'it', name: '이탈리아', id: 5 },
  ];

  // 현재 선택한 국가에 해당하는 제스처 목록
  const currentGestures = countryGestures[selectedCountry.id]?.gestures || [];

  // 현재 선택된 제스처
  const currentGesture =
    currentGestures.find((gesture) => gesture.id === selectedGesture) || currentGestures[0];

  // 제스처 선택 핸들러
  const handleSelectGesture = (gestureId: number) => {
    setSelectedGesture(gestureId);
  };

  // 국가 선택 핸들러
  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);

    if (countryGestures[country.id]?.gestures?.length > 0) {
      setSelectedGesture(countryGestures[country.id].gestures[0].id);
    }
  };

  // 제스처 연습으로 이동
  const handlePracticeButtonClick = () => {
    navigate('/dictionary/practice', {
      state: {
        country: selectedCountry,
        gesture: currentGesture,
      },
    });
  };

  // 제스처 디테일로 이동
  const handleDetailButtonClick = () => {
    navigate('/dictionary/detail');
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
              />
              <IconButton
                icon={faMagnifyingGlassPlus}
                tooltipText="자세히 보기"
                onClick={handleDetailButtonClick}
              />
              <IconButton
                icon={faRectangleList}
                tooltipText="나라별 비교 가이드"
                onClick={handleGuideButtonClick}
              />
            </div>
          </div>
        </div>

        {/* 캐러셀 */}
        <div className="h-[22%] w-full flex items-center">
          <DictListCarousel gestures={currentGestures} onSelectGesture={handleSelectGesture} />
        </div>
      </div>
    </div>
  );
}

export default Dictionary;
