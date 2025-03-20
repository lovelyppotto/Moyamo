import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

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
    <div
      className={`rounded-lg border border-gray-300 bg-white text-card-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

// 카드 컨텐츠
const CardContent = ({ children, className = '' }: CardContentProps) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

// 제스처 타입 정의
export type Gesture = {
  id: string;
  title: string;
  image: string;
};

// 캐러셀 컴포넌트 프롭 타입
interface DictListCarouselProps {
  gestures?: Gesture[];
  onSelectGesture?: (gestureId: string) => void;
}

export function DictListCarousel({ gestures = [], onSelectGesture }: DictListCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // 제스처 클릭 핸들러
  const handleGestureClick = (gestureId: string) => {
    if (onSelectGesture) {
      onSelectGesture(gestureId);
    }
  };

  return (
    <div className="relative w-full my-4">
      {/* 캐러셀 컨테이너 */}
      <div className="flex items-center">
        {/* 이전 버튼 */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-gray-600" />
        </button>

        {/* 캐러셀 내용 */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x scrollbar-hide w-full py-2 px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {gestures.map((gesture) => (
            <div
              key={gesture.id}
              className="flex-shrink-0 w-[140px] snap-start px-2"
              onClick={() => handleGestureClick(gesture.id)}
            >
              <Card className="cursor-pointer hover:border-blue-400 transition-colors">
                <CardContent className="flex flex-col items-center p-2">
                  <div className="w-full aspect-square flex items-center justify-center mb-2 overflow-hidden">
                    <img
                      src={gesture.image}
                      alt={gesture.title}
                      className="object-contain h-24 w-24"
                    />
                  </div>
                  <span className="text-sm text-center font-[30px]">{gesture.title}</span>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={scrollRight}
          className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md"
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
