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

function MainGestureImage({ gesture }: MainGestureImageProps) {
  return (
    <div className="rounded-2xl shadow-md font-[NanumSquareRound] w-full max-w-full md:w-[550px] lg:w-[600px]">
      {/* 이미지 */}
      <div className="bg-white rounded-t-2xl flex items-center justify-center border-6 border-kr-500 w-full aspect-[4/3] md:max-h-[calc(70vh-120px)]">
        <img
          src={gesture.image}
          alt={gesture.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* 타이틀 */}
      <div className="bg-kr-500 py-4 px-4 text-white text-center rounded-b-2xl">
        <h2 className="text-[22px] font-bold">{gesture.title}</h2>
      </div>
    </div>
  );
}

export default MainGestureImage;
