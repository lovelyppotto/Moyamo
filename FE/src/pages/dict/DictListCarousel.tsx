import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Gesture } from '@/types/dictionaryType';
import { useCountryStyles } from '@/hooks/useCountryStyles';

// 카드 컴포넌트 prop 타입
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// 카드 컨텐츠 prop 타입
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

// 카드 컴포넌트
const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`rounded-lg border border-gray-300 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
};

// 카드 컨텐츠
const CardContent = ({ children, className = '' }: CardContentProps) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

// 캐러셀 컴포넌트 프롭 타입
interface DictListCarouselProps {
  gestures?: Gesture[];
  onSelectGesture?: (gestureId: number) => void;
  selectedCountry?: string;
}

export function DictListCarousel({
  gestures = [],
  onSelectGesture,
  selectedCountry,
}: DictListCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { getHoverBorderClass } = useCountryStyles();
  // 왼쪽으로 스크롤
  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth >= 1024 ? -280 : -220;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 오른쪽으로 스크롤
  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth >= 1024 ? 280 : 220;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 제스처 클릭 핸들러
  const handleGestureClick = (gestureId: number) => {
    if (onSelectGesture) {
      onSelectGesture(gestureId);
    }
  };

  return (
    <div className="relative w-full mx-auto px-8 font-[NanumSquareRound] ">
      {/* 캐러셀 컨테이너 */}
      <div className="flex items-center">
        {/* 이전 버튼 */}
        <button
          onClick={scrollLeft}
          className="absolute left-4 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md text-gray-600 cursor-pointer"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x scrollbar-hide w-full px-10"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* 카드 관련 */}
          {gestures.map((gesture, index) => (
            <div
              key={`gesture-${gesture.id || index}`}
              className="flex-shrink-0 sm:w-[33%] md:w-[33%] lg:w-[27%] xl:w-[27%] snap-start px-2 items-center"
              onClick={() => handleGestureClick(gesture.id)}
            >
              <Card
                className={`flex flex-col cursor-pointer ${getHoverBorderClass(selectedCountry)} transition-colors h-full`}
              >
                <CardContent className="flex flex-col items-center p-3 flex-grow">
                  <div className="flex items-center justify-center w-full flex-grow">
                    {gesture.image_url ? (
                      <img
                        src={gesture.image_url}
                        alt={`${gesture} image`}
                        className="object-contain h-22 w-20"
                      />
                    ) : (
                      <div className="h-22 w-20 flex items-center justify-center text-gray-400">
                        이미지 없음
                      </div>
                    )}
                  </div>
                </CardContent>
                <div className="w-full bg-gray-200 p-[14px]">
                  <span className="text-md text-center text-gray-500 font-[NanumSquareRoundB] block">
                    {gesture.title}
                  </span>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={scrollRight}
          className="absolute right-4 z-10 flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full shadow-xl text-gray-600 cursor-pointer"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}
