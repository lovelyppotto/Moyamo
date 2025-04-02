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
    <div className="rounded-2xl font-[NanumSquareRoundB] w-full h-full max-w-2xl mx-auto flex flex-col">
      {/* 컨테이너 전체 */}
      <div className="w-full h-full flex flex-col">
        {/* 이미지 영역 - 비율 유지 */}
        <div
          className={`bg-white rounded-t-2xl flex items-center justify-center border-4 ${getBorderColorClass(countryCode)} w-full`}
        >
          {gesture.imageUrl ? (
            <img
              src={gesture.imageUrl}
              alt={`${gesture.gestureTitle} image`}
              className="max-h-[90%] max-w-[90%] object-contain"
            />
          ) : (
            <div className="text-gray-400 flex items-center justify-center h-full w-full text-center px-4">
              <p className="text-lg sm:text-xl">이미지가 없습니다</p>
            </div>
          )}
        </div>

        {/* 타이틀 영역 */}
        <div
          className={`${getColorClass(countryCode)} py-2 px-4 text-white text-center rounded-b-2xl flex items-center justify-center min-h-[50px]`}
        >
          <h2 className="text-base sm:text-lg md:text-xl">{gesture.gestureTitle}</h2>
        </div>
      </div>
    </div>
  );
}

export default MainGestureImage;
