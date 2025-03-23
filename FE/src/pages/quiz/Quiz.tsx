import '@/index.css';

function Quiz() {
  return (
    <>
    {/* w-full h-full을 쓰면 스크롤이 생김!! 전체적으로 설정한 마진값 때문인 것 같음 */}
     <div 
     className='flex flex-col h-screen overflow-hidden w-full bg-[#313131] '>
      <div className=" flex flex-col justify-center items-center h-3/4 ">
        {/* 중간 텍스트 부분 / 일단 마진값 */}
        <div className="flex flex-col items-center align-center font-['DNFBitBitv2'] mb-30 animate-pulse">
          <img src="/images/quiz_img1.png" alt="quiz-img" className="w-1/2 h-auto " />
          <div className="text-gray-200 text-4xl md:text-6xl xl:text-8xl drop-shadow-quiz ">GESTURE QUIZ</div>
          {/* <img src="/images/quiz_img2.png" alt="quiz-img" className="w-1/5 h-1/5" /> */}
        </div>


        {/* 마지막 버튼 부분 */}
        <div className="flex justify-center ">
          {/* tailwind.config.js에 커스텀 그림자 정의해야 함 */}
          <button className="text-4xl xl:text-6xl font-['DNFBitBitv2'] text-gray-200 px-[10vh] py-[1vh] rounded-xl flex justify-center items-center algin-center bg-[var(--color-lavender-rose-300)] drop-shadow-quiz animate-bounce mt-[5vh]">
            <p className='drop-shadow-basic '>start</p>
          </button>
        </div>
      
      </div>
      </div>
    </>
  );
}

export default Quiz;
//텍스트+버튼+그림들PNG우선
//start버튼 누르면 그 다음에 3개 중에 랜덤으로 가도록 함


