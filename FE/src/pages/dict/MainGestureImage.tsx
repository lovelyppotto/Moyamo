import { GestureItem } from '@/types/dictionaryType';
import { useCountryStyles } from '@/hooks/useCountryStyles';

// 메인 이미지 컴포넌트 Props 타입
type MainGestureImageProps = {
  gesture: GestureItem;
  countryCode: string;
};

function MainGestureImage({ gesture, countryCode }: MainGestureImageProps) {
  const { getColorClass, getBorderColorClass } = useCountryStyles(); //useCountryStyles 훅 사용
  return (
    <div className="rounded-2xl font-[NanumSquareRound] w-full h-full max-w-lg mx-auto">
      {/* 이미지 */}
      <div
        className={`bg-white rounded-t-2xl flex items-center justify-center border-4 ${getBorderColorClass(countryCode)} w-full h-[70%]`}
      >
        {gesture.imageUrl ? (
          <img
            src={gesture.imageUrl}
            alt={`${gesture.gestureTitle} image`}
            className="max-h-[90%] max-w-[90%] object-contain"
          />
        ) : (
          <div className="text-gray-400 flex items-center justify-center h-full w-full">
            이미지가 없습니다
          </div>
        )}
      </div>

      {/* 타이틀 */}
      <div
        className={`bg-${countryCode}-500 py-2 px-4 h-[15%] ${getColorClass(countryCode)} text-white text-center rounded-b-2xl flex items-center justify-center`}
      >
        <h2 className="text-lg md:text-xl font-bold">{gesture.gestureTitle}</h2>
      </div>
    </div>
  );
}

export default MainGestureImage;
