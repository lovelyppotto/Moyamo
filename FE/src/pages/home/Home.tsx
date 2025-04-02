import HeaderBar from './HeaderBar';
import { useTheme } from '@/components/theme-provider';
import DictionaryButton from './buttons/DictButton';
import QuizButton from './buttons/QuizButton';
import CountryBubble from './CountryBubble';
import { getBackgroundImage, getIconImage } from '@/utils/imageUtils';

function Home() {
  const { theme } = useTheme();

  return (
    <div
      className="h-screen overflow-hidden w-full flex flex-col"
      style={{
        backgroundImage:
          theme === 'dark' ? `url(${getBackgroundImage('background-dark')})` : `url(${getBackgroundImage('background')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <HeaderBar />
      <CountryBubble />

      <div
        className="flex-grow flex flex-col justify-center
      px-10 dark:text-d-txt-50"
      >
        <div
          className="flex flex-col item-center font-[DNFBitBitv2]
          text-3xl text-center "
        >
          {/* 첫 번째 줄 */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl mb-1 sm:mb-3 md:mb-4">Unlock the world</h1>

          {/* 두 번째 줄 */}
          <div className="flex items-center justify-center mb-1 sm:mb-3 md:mb-4 w-full">
            <h1 className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl">through</h1>
            <img
              src={getIconImage('puzzle')}
              alt="pixel-puzzle"
              className="w-10 h-10 md:w-14 md:h-14 
              lg:w-16 lg:h-16 xl:w-20 xl:h-20 mx-1 sm:mx-2"
            />
            <h1 className="dark:text-d-txt-50 text-2xl sm:text-4xl md:text-5xl xl:text-6xl">meaningful</h1>
          </div>

          {/* 세 번째 줄 */}
          <div className="flex justify-center w-full sm:mb-3 md:mb-6">
            <div className="relative inline-flex">
              <div
                className="flex bg-blue-300/60 dark:bg-blue-200 rounded-l-lg
                px-3 pt-1 pb-1
                sm:px-4 sm:pt-2 sm:pb-3
                md:px-5 md:pt-2 md:pb-3 
                lg:px-6 lg:pt-3 lg:pb-4"
              >
                <h1 className="dark:text-black text-2xl sm:text-4xl md:text-5xl xl:text-6xl mb-1">gestures</h1>
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
          className="text-sm sm:text-xl md:text-2xl
          text-center font-[NanumSquareRoundB]
          mt-3 md:mt-1"
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
