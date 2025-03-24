import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { faHands, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import DictCountrySelector from './DictCountrySelector';
import { DictListCarousel, Gesture } from './DictListCarousel';
import gestureExampleImg from './gesture_example.png';
import DictMainImage from './MainGestureImage';
import IconButton from '@/components/IconButton';
import { useNavigate } from 'react-router-dom';

type Country = {
  code: string;
  name: string;
};

// 국가별 제스쳐 데이터 관리하는 타입
type CountryGestures = {
  [countryCode: string]: Gesture[];
};

function Dictionary() {
  const navigate = useNavigate();

  // 제스처 선택 상태
  const [selectedGesture, setSelectedGesture] = useState<string>('victory');

  // 국가 선택 상태
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'us',
    name: '미국',
  });

  // 국가 목록
  const countryOptions: Country[] = [
    { code: 'us', name: '미국' },
    { code: 'kr', name: '한국' },
    { code: 'cn', name: '중국' },
    { code: 'jp', name: '일본' },
    { code: 'it', name: '이탈리아' },
  ];

  // 제스처 더미 데이터
  const countryGestures: CountryGestures = {
    kr: [
      { id: 'victory', title: '승리, 평화', image: gestureExampleImg },
      { id: 'money', title: '돈, 부유함', image: gestureExampleImg },
      { id: 'emphasis', title: '강조, 풍자', image: gestureExampleImg },
      { id: 'come', title: '이리와', image: gestureExampleImg },
      { id: 'luck', title: '행운을 빌어', image: gestureExampleImg },
    ],
    us: [
      { id: 'thumbs-up', title: '좋아요', image: gestureExampleImg },
      { id: 'ok', title: '괜찮아', image: gestureExampleImg },
      { id: 'peace', title: '평화', image: gestureExampleImg },
      { id: 'rock', title: '락앤롤', image: gestureExampleImg },
      { id: 'highfive', title: '하이파이브', image: gestureExampleImg },
    ],
    cn: [
      { id: 'cn-1', title: '환영', image: gestureExampleImg },
      { id: 'cn-2', title: '번영', image: gestureExampleImg },
      { id: 'cn-3', title: '행운', image: gestureExampleImg },
      { id: 'cn-4', title: '존경', image: gestureExampleImg },
      { id: 'cn-5', title: '인사', image: gestureExampleImg },
    ],
    jp: [
      { id: 'jp-1', title: '존경', image: gestureExampleImg },
      { id: 'jp-2', title: '사죄', image: gestureExampleImg },
      { id: 'jp-3', title: '감사', image: gestureExampleImg },
      { id: 'jp-4', title: '거절', image: gestureExampleImg },
      { id: 'jp-5', title: '초대', image: gestureExampleImg },
    ],
    it: [
      { id: 'it-1', title: '맛있어요', image: gestureExampleImg },
      { id: 'it-2', title: '완벽해', image: gestureExampleImg },
      { id: 'it-3', title: '질문', image: gestureExampleImg },
      { id: 'it-4', title: '무슨 소리야', image: gestureExampleImg },
      { id: 'it-5', title: '잠시만', image: gestureExampleImg },
    ],
  };

  // 현재 선택한 국가에 해당하는 제스처 목록
  const currentGestures = countryGestures[selectedCountry.code] || [];

  // 현재 선택된 제스처
  const currentGesture =
    currentGestures.find((gesture) => gesture.id === selectedGesture) || currentGestures[0];

  // 제스처 선택 핸들러
  const handleSelectGesture = (gestureId: string) => {
    setSelectedGesture(gestureId);
  };

  // 국가 선택 핸들러
  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);

    if (countryGestures[country.code]?.length > 0) {
      setSelectedGesture(countryGestures[country.code][0].id);
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
    console.log('비교 가이드 버튼 클릭');
  };

  return (
    <div className="h-screen flex flex-col font-[NanumSquareRound] max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
      <div className="flex flex-1 justify-center items-start py-6">
        {/* 메인 이미지 */}
        <div className="flex-grow flex items-center justify-center pr-5 max-h-[calc(100vh-250px)]">
          {currentGesture && (
            <DictMainImage gesture={currentGesture} countryCode={selectedCountry.code} />
          )}
        </div>
        {/* 국가 선택 드롭다운, 아이콘 버튼 */}
        <div className="w-auto flex flex-col space-y-10 cursor-pointer">
          {/* 국가 선택 드롭다운 */}
          <DictCountrySelector
            selectedCountry={selectedCountry}
            onSelectCountry={handleSelectCountry}
            countryOptions={countryOptions}
          />
          {/* 아이콘 버튼 */}
          <div className="flex flex-col space-y-10">
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
      <div className="mt-auto py-6">
        <DictListCarousel gestures={currentGestures} onSelectGesture={handleSelectGesture} />
      </div>
    </div>
  );
}

export default Dictionary;
