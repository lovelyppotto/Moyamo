import * as React from 'react';
import { useState } from 'react';
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

  // 마우스 드래그를 위한 상태 추가
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);

  // 왼쪽으로 스크롤
  const scrollToPrev = () => {
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
  const scrollToNext = () => {
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

  // 마우스 드래그 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setStartScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 2; // 스크롤 속도 조절
      scrollRef.current.scrollLeft = startScrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // 클릭 이벤트가 드래그 중에 발생하지 않도록 처리
  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className="w-full h-full flex justify-center font-[NanumSquareRound]">
      <div ref={containerRef} className="w-full h-full flex items-center relative px-6">
        {/* 이전 버튼 - 모바일에서는 숨김 */}
        <button
          onClick={scrollToPrev}
          className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 h-8 bg-white rounded-full shadow-md text-gray-600 cursor-pointer"
          aria-label="이전"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        {/* 카드 컨테이너 */}
        <div
          ref={scrollRef}
          className={`flex overflow-x-auto snap-x scrollbar-hide w-full h-full ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* 카드 관련 */}
          {gestures.map((gesture, index) => (
            <div
              key={`gesture-${gesture.gestureId || index}`}
              className="flex-shrink-0 w-[100%] sm:w-[50%] lg:w-[33.333%] snap-start px-2 h-full"
              onClick={handleClick}
            >
              <DictGestureCard
                gesture={gesture}
                onClick={() => !isDragging && handleGestureClick(gesture.gestureId)}
                hoverBorderClass={`hover:${getBorderClass(selectedCountry)}`}
              />
            </div>
          ))}
        </div>

        {/* 다음 버튼 - 모바일에서는 숨김 */}
        <button
          onClick={scrollToNext}
          className="absolute -right-1 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 h-8 bg-white rounded-full shadow-md text-gray-600 cursor-pointer"
          aria-label="다음"
        >
          <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}
