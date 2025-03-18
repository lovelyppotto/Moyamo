function Home() {
  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: 'url(/images/background.webp)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="flex-grow flex flex-col justify-center
      px-16"
      >
        <div className="flex flex-col item-center font-[DNFBitBitv2] text-center">
          {/* 첫 번째 줄 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4">Unlock the world</h1>

          {/* 두 번째 줄 */}
          <div className="flex items-center justify-center mb-4 w-full">
            <h1 className="text-4xl md:text-5xl lg:text-6xl">through</h1>
            <img
              src="/images/icons/puzzle.png"
              alt="pixel-puzzle"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-1 sm:mx-2"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl">meaningful</h1>
          </div>

          {/* 세 번째 줄 */}
          <div className="flex justify-center w-full mb-3 md:mb-5 lg:mb-7">
            <div className="relative inline-flex">
              <div className="flex bg-blue-300/60 px-6 pt-1 pb-3 lg:pt-2 lg:pb-4 rounded-l-lg">
                <h1 className="text-4xl md:text-5xl lg:text-6xl">gestures</h1>
              </div>
              {/* 오른쪽 태그 장식 */}
              <div className="bg-indigo-500 w-2 lg:w-3"></div>
              <div className="bg-indigo-500 w-12 h-6 md:w-14 md:h-7 lg:w-16 lg:h-8 rounded-r-lg"></div>
            </div>
          </div>
        </div>
        <p className="text-lg md:text-xl mt-2 text-center font-[NanumSquareRound]">
          의미있는 제스처를 통해 세상을 열어보세요
        </p>
      </div>
    </div>
  );
}
export default Home;
