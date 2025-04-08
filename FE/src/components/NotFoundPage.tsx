import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    window.history.back();
  };
  
  const handleHomeClick = () => {
    navigate('/');
  };
  
  return (
    <div className="w-screen h-screen flex flex-col items-end justify-center font-[NanumSquareRoundB] bg-white dark:bg-gray-900 overflow-hidden">
      {/* 애니메이션 404 텍스트 */}
      <div className="absolute font-[Paperlogy-8ExtraBold] top-0 left-0 w-full overflow-hidden pointer-events-none">
        <div className="sliding-text-container">
          <div className="sliding-text sliding-text-very-slow">
            PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND 
          </div>
          <div className="sliding-text sliding-text-very-slow">
            PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND PAGE 404 NOT FOUND 
          </div>
        </div>
      </div>
      
      {/* 컨텐츠 */}
      <div className="z-10 flex flex-col items-end justify-center mr-10 md:mr-30 mt-20">
        <div className="text-right text-black dark:text-d-txt-50 text-[15px] sm:text-[20px] md:text-[25px] mb-3 md:mb-7 p-4 rounded-lg">
          <p className='select-none'>
            찾을 수 없는 페이지입니다
            <br />
            요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨습니다
          </p>
        </div>
        
        <div className="select-none flex flex-row gap-6 sm:gap-8 lg:gap-10">
          <button
            className="bg-kr-600 hover:bg-kr-700 dark:bg-d-kr-600 dark:hover:bg-d-kr-700 text-white dark:text-d-txt-50 
            px-5 py-2 md:px-12 md:py-4 rounded-full text-sm md:text-base lg:text-2xl cursor-pointer"
            onClick={handleHomeClick}
          >
            Home
          </button>
          <button
            className="bg-kr-600 hover:bg-kr-700 dark:bg-d-kr-600 dark:hover:bg-d-kr-700 text-white dark:text-d-txt-50 
            px-5 py-2 md:px-12 md:py-4 rounded-full text-sm md:text-base lg:text-2xl cursor-pointer"
            onClick={handleBackClick}
          >
            BACK
          </button>
        </div>
      </div>
      
      {/* 스타일 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .sliding-text-container, .sliding-text-container-reverse {
            display: flex;
            white-space: nowrap;
            overflow: hidden;
          }
          
          .sliding-text, .sliding-text-reverse {
            display: inline-block;
            font-size: 120px;
            font-weight: 800;
            color: var(--color-kr-500, #AB50D9);
            opacity: 0.3;
            padding-left: 0;
            text-transform: uppercase;
          }
          
          @media (max-width: 768px) {
            .sliding-text, .sliding-text-reverse {
              font-size: 64px;
            }
          }
          
          .sliding-text {
            animation: slide 20s linear infinite;
            font-size: 250px; /* 매우 큰 글씨 크기 */
          }
          
          .sliding-text-slow {
            animation: slide 40s linear infinite; /* 기존 30s에서 40s로 변경 */
          }
          
          .sliding-text-very-slow {
            animation: slide 70s linear infinite; /* 새로운 매우 느린 속도 */
          }
          
          .sliding-text-reverse {
            animation: slide-reverse 20s linear infinite;
          }
          
          @keyframes slide {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          
          @keyframes slide-reverse {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(0);
            }
          }
          
          /* 다크 모드 텍스트 색상 */
          @media (prefers-color-scheme: dark) {
            .sliding-text, .sliding-text-reverse {
              color: var(--color-d-kr-500, #CEA0FA);
            }
          }
          
          .dark .sliding-text, .dark .sliding-text-reverse {
            color: var(--color-d-kr-500, #CEA0FA);
          }
        `
      }} />
    </div>
  );
}

export default NotFoundPage;