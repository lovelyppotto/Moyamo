import { GestureItem } from '@/types/dictionaryType';
import { cn } from '@/lib/utils';

// 제스처 카드 컴포넌트 프롭 타입
interface DictGestureCardProps {
  gesture: GestureItem;
  onClick: () => void;
  hoverBorderClass: string;
}

export function DictGestureCard({ gesture, onClick, hoverBorderClass }: DictGestureCardProps) {
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
}
