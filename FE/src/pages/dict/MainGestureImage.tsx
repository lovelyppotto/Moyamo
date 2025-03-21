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
    <div className="rounded-2xl overflow-hidden shadow-md mb-8 font-[NanumSquareRound] w-full max-w-[860px] mx-auto">
      {/* 이미지  */}
      <div className="bg-white rounded-t-2xl p-4 flex items-center justify-center border-4 border-kr-500 w-full h-[500px] md:h-[400px] sm:h-[300px]">
        <img
          src={gesture.image}
          alt={gesture.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* 타이틀*/}
      <div className="bg-kr-500 py-4 px-4 text-white text-center">
        <h2 className="text-xl font-bold">{gesture.title}</h2>
      </div>
    </div>
  );
}

export default MainGestureImage;
