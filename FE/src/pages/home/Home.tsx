import { useNavigate } from 'react-router-dom';

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
      <div
        className="flex-grow flex flex-col justify-center
      px-16"
      >
        <div className="flex flex-col item-center font-[DNFBitBitv2] text-center">
          {/* 첫 번째 줄 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-2 md:mb-3 lg:mb-4">
            Unlock the world
          </h1>

          {/* 두 번째 줄 */}
          <div className="flex items-center justify-center mb-2 md:mb-3 lg:mb-4 w-full">
            <h1 className="text-4xl md:text-5xl lg:text-6xl">through</h1>
            <img
              src="/images/icons/puzzle.png"
              alt="pixel-puzzle"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-1 sm:mx-2"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl">meaningful</h1>
          </div>

          {/* 세 번째 줄 */}
          <div className="flex justify-center w-full mb-3 md:mb-4 lg:mb-5">
            <div className="relative inline-flex">
              <div
                className="flex bg-blue-300/60 rounded-l-lg
                px-6 pt-1 pb-2 md:pt-2 md:pb-3 lg:pt-3 lg:pb-4"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl">gestures</h1>
              </div>
              {/* 오른쪽 태그 장식 */}
              <div className="bg-indigo-500 w-2 lg:w-3"></div>
              <div
                className="bg-indigo-500 rounded-r-lg 
                w-10 h-5 md:w-14 md:h-7 lg:w-16 lg:h-8"
              ></div>
            </div>
          </div>
        </div>
        <p className="text-lg md:text-xl lg:text-2xl mt-2 text-center font-[NanumSquareRound]">
          의미있는 제스처를 통해 세상을 열어보세요
        </p>

        {/* 버튼 영역 */}
        <div 
          className="flex justify-center items-center space-x-8
          mt-15 md:mt-18 lg:mt-20 "
        >
          <button 
            onClick={handleDictionaryClick}
            className="flex flex-col items-center bg-transparent border-none cursor-pointer"
          >
            <div 
            className="flex items-center justify-center relative
            w-50 h-20 md:w-80 md:h-30 lg:w-95 lg:h-40 
            bg-inch-worm-500 rounded-full drop-shadow-basic"
            >
              <div className="relative mb-18 md:mb-20 lg:mb-25">
                {/* 책 이미지 */}
                <img src="/images/dict.png" alt="DictionaryIcon" className='drop-shadow-basic' />
              </div>
            </div>
            <p className="mt-4 text-2xl font-extrabold font-[NanumSquareRound]">Dictionary</p>
          </button>
          
          <button 
            onClick={handleQuizClick}
            className="flex flex-col items-center bg-transparent border-none cursor-pointer"
          >
            <div 
            className="flex items-center justify-center relative
            w-50 h-20 md:w-80 md:h-30 lg:w-95 lg:h-40 
            bg-lavender-rose-300 rounded-full drop-shadow-basic"
            >
              <div 
                className="relative 
                ml-5 w-40 mb-20 md:w-62 md:mb-23 lg:w-72 lg:mb-25"
              >
                {/* 퀴즈 이미지 */}
                <img src="/images/quiz.png" alt="DictionaryIcon" className='drop-shadow-basic' />
              </div>
            </div>
            <p className="mt-4 text-2xl font-extrabold font-[NanumSquareRound]">Quiz</p>
          </button>
        </div>
      </div>
    </div>
  );
}
export default Home;
