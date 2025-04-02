import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { GestureItem } from '@/types/dictionaryType';
import { useCountryStyles } from '@/hooks/useCountryStyles';
import { DictGestureCard } from './DictGestureCard';

// 캐러셀 컴포넌트 프롭 타입
interface DictListCarouselProps {
  gestures?: GestureItem[];
  onSelectGesture?: (gestureId: number) => void;
  selectedCountry?: string;
}

export function DictListCarousel({
  gestures = [],
  onSelectGesture,
  selectedCountry,
}: DictListCarouselProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { getHoverBorderClass } = useCountryStyles();

  // 왼쪽으로 스크롤
  const scrollLeft = () => {
    if (scrollRef.current) {
      // 화면 크기에 따라 스크롤할 카드 수 조정
      const viewportWidth = window.innerWidth;
      let cardCount = 1; // 기본값: 1개 카드 스크롤

      if (viewportWidth >= 1024) {
        // lg 이상
        cardCount = 3;
      } else if (viewportWidth >= 640) {
        // sm 이상
        cardCount = 2;
      }

      const scrollAmount = scrollRef.current.clientWidth / cardCount;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  // 오른쪽으로 스크롤
  const scrollRight = () => {
    if (scrollRef.current) {
      // 화면 크기에 따라 스크롤할 카드 수 조정
      const viewportWidth = window.innerWidth;
      let cardCount = 1; // 기본값: 1개 카드 스크롤

      if (viewportWidth >= 1024) {
        // lg 이상
        cardCount = 3;
      } else if (viewportWidth >= 640) {
        // sm 이상
        cardCount = 2;
      }

      const scrollAmount = scrollRef.current.clientWidth / cardCount;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 제스처 클릭 핸들러
  const handleGestureClick = (gestureId: number) => {
    if (onSelectGesture) {
      onSelectGesture(gestureId);
    }
  };

  const getBorderClass = (countryCode?: string) => {
    const hoverClass = getHoverBorderClass(countryCode);
    return hoverClass.replace('hover:', '');
  };

  return (
    <div className="w-full h-full flex justify-center font-[NanumSquareRound]">
      <div ref={containerRef} className="w-full h-full flex items-center relative px-6">
        {/* 이전 버튼 */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md text-gray-600 cursor-pointer"
          aria-label="이전"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        {/* 스크롤 가능한 카드 컨테이너 */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x scrollbar-hide w-full h-full"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* 카드 관련 */}
          {gestures.map((gesture, index) => (
            <div
              key={`gesture-${gesture.gestureId || index}`}
              className="flex-shrink-0 w-[100%] sm:w-[50%] lg:w-[33.333%] snap-start px-2 h-full"
            >
              <DictGestureCard
                gesture={gesture}
                onClick={() => handleGestureClick(gesture.gestureId)}
                hoverBorderClass={`hover:${getBorderClass(selectedCountry)}`}
              />
            </div>
          ))}
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md text-gray-600 cursor-pointer"
          aria-label="다음"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}
