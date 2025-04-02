import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { GestureItem } from '@/types/dictionaryType';
import { useCountryStyles } from '@/hooks/useCountryStyles';
import { cn } from '@/lib/utils';

// 캐러셀 컴포넌트 프롭 타입
interface DictListCarouselProps {
  gestures?: GestureItem[];
  onSelectGesture?: (gestureId: number) => void;
  selectedCountry?: string;
}

// 제스처 카드 컴포넌트
interface GestureCardProps {
  gesture: GestureItem;
  onClick: () => void;
  hoverBorderClass: string;
}

const GestureCard = ({ gesture, onClick, hoverBorderClass }: GestureCardProps) => {
  return (
    <div
      className={cn(
        'h-full w-full rounded-lg border border-gray-300 overflow-hidden bg-white shadow-sm mx-auto',
        'cursor-pointer transition-all duration-200 group',
        hoverBorderClass
      )}
      onClick={onClick}
    >
      <div className="h-full flex flex-col">
        {/* 이미지 영역 */}
        <div className="flex-grow flex items-center justify-center p-2 sm:p-3">
          {gesture.imageUrl ? (
            <img
              src={gesture.imageUrl}
              alt={`${gesture.gestureTitle} 이미지`}
              className="object-contain max-h-full max-w-full"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              이미지 없음
            </div>
          )}
        </div>

        {/* 타이틀 영역 */}
        <div className="w-full bg-gray-200 p-2 sm:p-[14px]">
          <span className="text-sm sm:text-md text-center text-gray-500 font-[NanumSquareRoundB] block truncate">
            {gesture.gestureTitle}
          </span>
        </div>
      </div>
    </div>
  );
};

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
      const cardWidth = scrollRef.current.clientWidth / 3;
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  // 오른쪽으로 스크롤
  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth / 3;
      scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
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
    <div className="relative w-full h-full flex items-center font-[NanumSquareRound]">
      {/* 이전 버튼 */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 sm:left-4 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md text-gray-600 cursor-pointer"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x scrollbar-hide w-full px-10 h-full"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* 카드 관련 - 반응형 조정 */}
        {gestures.map((gesture, index) => (
          <div
            key={`gesture-${gesture.gestureId || index}`}
            className="flex-shrink-0 w-[60%] sm:w-[45%] md:w-[35%] lg:w-[30%] snap-start px-2 h-full"
          >
            <GestureCard
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
        className="absolute right-2 sm:right-4 z-10 flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full shadow-xl text-gray-600 cursor-pointer"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
