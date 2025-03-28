// 제스처 타입
type Gesture = {
  id: string;
  title: string;
  image: string;
};

// 메인 이미지 컴포넌트 Props 타입
type MainGestureImageProps = {
  gesture: Gesture;
  countryCode: string;
};

function MainGestureImage({ gesture, countryCode }: MainGestureImageProps) {
  return (
    <div className="rounded-2xl font-[NanumSquareRound] w-full h-full max-w-lg mx-auto">
      {/* 이미지 */}
      <div className="bg-white rounded-t-2xl flex items-center justify-center border-4 border-kr-500 w-full h-[70%]">
        <img
          src={gesture.image}
          alt={gesture.title}
          className="max-h-[90%] max-w-[90%] object-contain"
        />
      </div>

      {/* 타이틀 */}
      <div
        className={`bg-${countryCode}-500 py-2 px-4 h-[15%] bg-kr-500 text-white text-center rounded-b-2xl flex items-center justify-center`}
      >
        <h2 className="text-lg md:text-xl font-bold">{gesture.title}</h2>
      </div>
    </div>
  );
}

export default MainGestureImage;
