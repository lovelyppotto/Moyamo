import { useNavigate } from 'react-router-dom';
import HeaderBar from './HeaderBar';

function Home() {
  const navigate = useNavigate();

  const handleDictionaryClick = () => {
    // Dictionary로 이동
    navigate('/dictionary');
  };

  const handleQuizClick = () => {
    // Quiz로 이동
    navigate('/quiz');
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: 'url(/images/background.webp)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
      }}
    >
      <HeaderBar />

      <div
        className="flex-grow flex flex-col justify-center
      px-16"
      >
        <div className="flex flex-col item-center font-[DNFBitBitv2] text-center">
          {/* 첫 번째 줄 */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-1 md:mb-2 lg:mb-3">
            Unlock the world
          </h1>

          {/* 두 번째 줄 */}
          <div className="flex items-center justify-center mb-1 md:mb-2 lg:mb-3 w-full">
            <h1 className="text-3xl md:text-4xl lg:text-5xl">through</h1>
            <img
              src="/images/icons/puzzle.png"
              alt="pixel-puzzle"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-1 sm:mx-2"
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl">meaningful</h1>
          </div>

          {/* 세 번째 줄 */}
          <div className="flex justify-center w-full mb-3 md:mb-4 lg:mb-5">
            <div className="relative inline-flex">
              <div
                className="flex bg-blue-300/60 rounded-l-lg
                px-5 pt-1 pb-2 md:pt-2 md:pb-3 lg:pt-3 lg:pb-4"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl">gestures</h1>
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
        <p className="text-md md:text-lg lg:text-xl mt-2 text-center font-[NanumSquareRound]">
          의미있는 제스처를 통해 세상을 열어보세요
        </p>

        {/* 버튼 영역 */}
        <div
          className="flex justify-center items-center space-x-8
          mt-18 md:mt-20 lg:mt-22 "
        >
          <button
            onClick={handleDictionaryClick}
            className="flex flex-col items-center bg-transparent border-none cursor-pointer transform transition-transform duration-300 hover:scale-105"
          >
            <div
              className="flex items-center justify-center relative
            w-48 h-22 md:w-63 md:h-28 lg:w-75 lg:h-32 
            bg-inch-worm-500 rounded-full drop-shadow-basic"
            >
              <div className="relative mb-16 md:mb-20 lg:mb-25">
                {/* 책 이미지 */}
                <img src="/images/dict.png" alt="DictionaryIcon" className="drop-shadow-basic" />
              </div>
            </div>
            <p
              className="font-extrabold font-[NanumSquareRound]
              mt-2 md:mt-2 lg:mt-3
              text-lg md:text-xl lg:text-2xl "
            >
              Dictionary
            </p>
          </button>

          <button
            onClick={handleQuizClick}
            className="flex flex-col items-center bg-transparent border-none cursor-pointer transform transition-transform duration-300 hover:scale-105"
          >
            <div
              className="flex items-center justify-center relative
            w-48 h-22 md:w-63 md:h-28 lg:w-75 lg:h-32 
            bg-lavender-rose-300 rounded-full drop-shadow-basic"
            >
              <div
                className="relative 
                ml-5 w-41 mb-18 md:w-54 md:mb-20 lg:w-60 lg:mb-25"
              >
                {/* 퀴즈 이미지 */}
                <img src="/images/quiz.png" alt="DictionaryIcon" className="drop-shadow-basic" />
              </div>
            </div>
            <p
              className="font-extrabold font-[NanumSquareRound]
              mt-2 md:mt-2 lg:mt-3
              text-lg md:text-xl lg:text-2xl "
            >
              Quiz
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
export default Home;
