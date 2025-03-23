import HeaderBar from './HeaderBar';
import { useTheme } from '@/components/theme-provider';
import DictionaryButton from './buttons/DictButton';
import QuizButton from './buttons/QuizButton';


function Home() {
  const { theme } = useTheme();

  return (
    <div
      className="h-screen overflow-hidden w-full flex flex-col"
      style={{
        backgroundImage:
          theme === 'dark' ? 'url(/images/background-dark.webp)' : 'url(/images/background.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <HeaderBar />

      {/* 국가별 관광지 사진 영역 - 6각형 레이아웃 */}
      {/* 각 border 채도 낮출 예정 */}
      <div className="absolute w-full h-full pointer-events-none">
        {/* 한국 (왼쪽 상단) */}
        <div className="absolute top-[20%] left-[10%]">
          <div className="relative">
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src="/images/attractions/korea.png"
                alt="Korea"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-13 -right-5
              transform translate-x-1/4 translate-y-1/4 px-4 
              rounded-full border-2 border-white
              text-white font-bold bg-blue-500"
            >
              Korea
            </div>
          </div>
        </div>

        {/* 미국 (오른쪽 상단) */}
        <div className="absolute top-[20%] right-[10%]">
          <div className="relative">
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-white shadow-lg -scale-x-100">
              <img
                src="/images/attractions/usa.jpg"
                alt="USA"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-13 -left-3 
              transform -translate-x-1/4 translate-y-1/4 px-4
              rounded-full text-white border-2 border-white
              font-bold bg-us-600"
            >
              USA
            </div>
          </div>
        </div>

        {/* 일본 (왼쪽 중간) */}
        <div className="absolute top-1/2 left-[20%] transform -translate-y-1/2">
          <div className="relative">
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src="/images/attractions/japan.jpg"
                alt="Japan"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-14 right-33 
              transform translate-x-1/2 translate-y-1/2 px-4 
              rounded-full text-white border-2 border-white
              font-bold bg-jp-500"
            >
              Japan
            </div>
          </div>
        </div>

        {/* 커뮤니케이션 (오른쪽 중간) */}
        <div className="absolute top-1/2 right-[20%] transform -translate-y-1/2">
          <div className="relative">
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src="/images/attractions/communication.jpg"
                alt="Communication"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-11 left-33
              transform -translate-x-1/2 px-4 
              rounded-full text-black border-2 border-black
              font-bold bg-white"
            >
              Communication
            </div>
          </div>
        </div>

        {/* 이탈리아 (왼쪽 하단) */}
        <div className="absolute bottom-[20%] left-[10%]">
          <div className="relative">
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src="/images/attractions/italy.webp"
                alt="Italy"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-14 right-0 
              transform translate-x-1/2 translate-y-1/2 px-4
              rounded-full bg-italy-600 border-2 border-white
              text-white font-bold"
            >
              Italy
            </div>
          </div>
        </div>

        {/* 중국 (오른쪽 하단) */}
        <div className="absolute bottom-[20%] right-[10%]">
          <div className="relative">
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src="/images/attractions/china.jpg"
                alt="China"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-14 left-0 
              transform -translate-x-1/2 translate-y-1/2 px-4 
              rounded-full bg-cn-600 border-2 border-white
              text-white font-bold"
            >
              China
            </div>
          </div>
        </div>

        {/* 점선 연결선 */}
      </div>

      <div
        className="flex-grow flex flex-col justify-center
      px-16 dark:text-d-txt-50"
      >
        <div
          className="flex flex-col item-center font-[DNFBitBitv2] 
          text-3xl text-center "
        >
          {/* 첫 번째 줄 */}
          <h1 className="md:text-4xl lg:text-5xl mb-1 md:mb-2 lg:mb-3">
            Unlock the world
          </h1>

          {/* 두 번째 줄 */}
          <div className="flex items-center justify-center mb-1 md:mb-2 lg:mb-3 w-full">
            <h1 className="md:text-4xl lg:text-5xl">through</h1>
            <img
              src="/images/icons/puzzle.png"
              alt="pixel-puzzle"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-1 sm:mx-2"
            />
            <h1 className="dark:text-d-txt-50 md:text-4xl lg:text-5xl">meaningful</h1>
          </div>

          {/* 세 번째 줄 */}
          <div className="flex justify-center w-full mb-3 md:mb-4 lg:mb-5">
            <div className="relative inline-flex">
              <div
                className="flex bg-blue-300/60 dark:bg-blue-200 rounded-l-lg
                px-5 pt-1 pb-2 md:pt-2 md:pb-3 lg:pt-3 lg:pb-4"
              >
                <h1 className="dark:text-black md:text-4xl lg:text-5xl">gestures</h1>
              </div>
              {/* 오른쪽 태그 장식 */}
              <div className="flex">
                <div className="bg-indigo-500 w-2 lg:w-3"></div>
                <div
                  className="bg-indigo-500 rounded-r-lg mr-2
                  w-8 h-5 md:w-11 md:h-7 lg:w-14 lg:h-8"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <p 
          className="text-md md:text-lg lg:text-xl
          text-center font-[NanumSquareRoundB]"
        >
          의미있는 제스처를 통해 세상을 열어보세요
        </p>

        {/* 버튼 영역 */}
        <div
          className="flex justify-center items-center space-x-8
          mt-15 md:mt-17 lg:mt-20 "
        >
          <DictionaryButton />
          <QuizButton />
        </div>
      </div>
    </div>
  );
}
export default Home;
