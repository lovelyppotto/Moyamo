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

      {/* 국가별 관광지 사진 영역 - 6각형 레이아웃 */}
      <div className="absolute w-full h-full pointer-events-none">
        {/* 한국 (왼쪽 상단) */}
        <div className="absolute top-[20%] left-[10%]">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img 
                src="/images/attractions/korea.png" 
                alt="Korea"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 px-5 py-2 rounded-full text-white font-bold bg-blue-500">
              Korea
            </div>
          </div>
        </div>

        {/* 미국 (오른쪽 상단) */}
        <div className="absolute top-[20%] right-[10%]">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img 
                src="/images/attractions/usa.jpg" 
                alt="USA"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4 px-5 py-2 rounded-full text-white font-bold bg-us-600">
              USA
            </div>
          </div>
        </div>

        {/* 일본 (왼쪽 중간) */}
        <div className="absolute top-1/2 left-[20%] transform -translate-y-1/2">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img 
                src="/images/attractions/japan.jpg" 
                alt="Japan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 right-0 transform translate-x-1/2 translate-y-1/2 px-5 py-2 rounded-full text-white font-bold bg-yellow-400">

              Japan
            </div>
          </div>
        </div>

        {/* 커뮤니케이션 (오른쪽 중간) */}
        <div className="absolute top-1/2 right-[20%] transform -translate-y-1/2">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img 
                src="/images/attractions/communication.jpg" 
                alt="Communication"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-5 py-2 rounded-full text-black font-bold bg-white border-2 border-black">
              Communication
            </div>
          </div>
        </div>

        {/* 일본 (왼쪽 하단) */}
        <div className="absolute bottom-[20%] left-[10%]">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img 
                src="/images/attractions/italy.webp" 
                alt="Italy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 right-0 transform translate-x-1/2 translate-y-1/2 px-5 py-2 rounded-full text-white font-bold bg-italy-600">
              Italy
            </div>
          </div>
        </div>

        {/* 중국 (오른쪽 하단) */}
        <div className="absolute bottom-[20%] right-[10%]">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img 
                src="/images/attractions/china.jpg" 
                alt="China"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-0 transform -translate-x-1/2 translate-y-1/2 px-5 py-2 rounded-full text-white font-bold bg-cn-600">
              China
            </div>
          </div>
        </div>

        {/* 점선 연결선 */}
        {/* 한국 -> 제스처 */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <line 
            x1="15%" 
            y1="15%" 
            x2="20%" 
            y2="50%" 
            stroke="#888888" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
        </svg>

        {/* 제스처 -> 일본 */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <line 
            x1="20%" 
            y1="50%" 
            x2="15%" 
            y2="85%" 
            stroke="#888888" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
        </svg>

        {/* 한국 -> 미국 */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <line 
            x1="15%" 
            y1="15%" 
            x2="85%" 
            y2="15%" 
            stroke="#888888" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
        </svg>

        {/* 미국 -> 커뮤니케이션 */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <line 
            x1="85%" 
            y1="15%" 
            x2="80%" 
            y2="50%" 
            stroke="#888888" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
        </svg>

        {/* 커뮤니케이션 -> 중국 */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <line 
            x1="80%" 
            y1="50%" 
            x2="85%" 
            y2="85%" 
            stroke="#888888" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
        </svg>

        {/* 일본 -> 중국 */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <line 
            x1="15%" 
            y1="85%" 
            x2="85%" 
            y2="85%" 
            stroke="#888888" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
        </svg>

        {/* 제스처 -> 커뮤니케이션 */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <line 
            x1="20%" 
            y1="50%" 
            x2="80%" 
            y2="50%" 
            stroke="#888888" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
        </svg>
      </div>



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
        <p className="text-md md:text-lg lg:text-xl text-center font-[NanumSquareRoundB]">
          의미있는 제스처를 통해 세상을 열어보세요
        </p>

        {/* 버튼 영역 */}
        <div
          className="flex justify-center items-center space-x-8
          mt-20 md:mt-22 lg:mt-24 "
        >
          <button
            onClick={handleDictionaryClick}
            className="flex flex-col items-center bg-transparent border-none cursor-pointer transform transition-transform duration-300 hover:scale-105"
          >
            <div
              className="flex items-center justify-center relative
              w-48 h-22 md:w-63 md:h-28 lg:w-78 lg:h-32 
              bg-inch-worm-500 rounded-full drop-shadow-basic"
            >
              <div className="relative mb-14 md:mb-16 lg:mb-20">
                {/* 책 이미지 */}
                <img src="/images/dict.png" alt="DictionaryIcon" className="drop-shadow-basic" />
              </div>
            </div>
            <p
              className="font-[NanumSquareRoundEB]
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
            w-48 h-22 md:w-63 md:h-28 lg:w-78 lg:h-32 
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
              className="font-[NanumSquareRoundEB]
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
