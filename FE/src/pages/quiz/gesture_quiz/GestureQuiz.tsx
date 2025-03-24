// import '../../index.css';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Progress from '@/pages/quiz/Progress';
import QuizResult from '../QuizResult';
import PbNumber from '../PbNumber';
import { useState, useEffect } from 'react';

function GestureQuiz() {
  const [isResult, setIsResult] = useState(false);

  useEffect(() => {
    // 결과 페이지가 나오는 함수: 일단 60초 후에 열리도록 함. 추후 조건 수정할 것
    const timerId = setTimeout(() => {
      setIsResult(true);
      console.log('result창이 열렸습니다.');
    }, 10000);
    // 마운트 할 때 타이머 값은 초기화 된다.
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <>
      {isResult ? <QuizResult /> : ''}
      <div className="flex flex-col h-screen overflow-hidden w-full">
        <div className="absolute left-1/2 top-4 transform -translate-x-1/2 z-10">
          <div className="flex justfy-center items-conter">
            <PbNumber />
          </div>
        </div>
        {/* 진행 바, 퀴즈박스 */}
        {/* progress바를 seekbar로 교체하기!!! */}
        {/* 마진 탑(margin-top)을 뷰포트 높이(viewport height)의 5%로 설정 */}
        <div className="h-screen flex flex-col mt-[5vh] xl:mt-[10vh] mx-[2vh] xl:mx-[10vh]">
          <Progress />
          <div className="flex justify-between items-center mt-[3vh]">
            <h1 className="sm:text-sm md:text-2xl lg:text-3xl 2xl:text-4xl font-[NanumSquareRoundB]">
              Q.이 손 동작이 의미하는 것은 무엇일까요?
            </h1>
            <button className="flex justify-between items-center rounded-2xl py-1 px-3 hover:bg-gray-200">
              <p className="sm:text-xs md:text-xl 2xl:text-2xl font-[NanumSquareRoundB]">Skip</p>
              <FontAwesomeIcon icon={faArrowRight} className="m-3 sm:text-xs md:text-xl" />
            </button>
          </div>
          <div className="flex justify-center w-full h-2/7 bg-white rounded-xl drop-shadow-quiz-box  my-[3vh]">
            {/* 추후, 백앤드에서 blender 애니메이션을 가져올 예정 */}
            <img src="/images/gesture_example.png" alt="sample_img" className="p-5" />
          </div>
          {/* 퀴즈 보기 부분 */}
          {/* 퀴즈 내용 백앤드에서 받아와서 보여지도록 하기 */}
          {/* 폰트어썸 유료 결제하면 icon circle_1이걸로 바꾸기! */}
          <div className="flex justify-around mt-[3vh]">
            <button className=" flex justify-center items-center w-2/5 h-[10vh] bg-white rounded-xl drop-shadow-quiz-box hover:bg-[var(--color-kr-500)] hover:text-white sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB]">
              <p className="mr-5">①</p>
              <p>사랑해</p>
            </button>
            <button className=" flex justify-center items-center w-2/5 h-[10vh] bg-white rounded-xl drop-shadow-quiz-box hover:bg-[var(--color-kr-500)] hover:text-white sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB]">
              <p className="mr-5">②</p>
              <p>미안해</p>
            </button>
          </div>
          <div className="flex justify-around mt-[3vh]">
            <button className=" flex justify-center items-center w-2/5 h-[10vh] bg-white rounded-xl drop-shadow-quiz-box hover:bg-[var(--color-kr-500)] hover:text-white sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB]">
              <p className="mr-5">③</p>
              <p>승리</p>
            </button>{' '}
            <button className=" flex justify-center items-center w-2/5 h-[10vh] bg-white rounded-xl drop-shadow-quiz-box hover:bg-[var(--color-kr-500)] hover:text-white sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB]">
              <p className="mr-5">④</p>
              <p>약속</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default GestureQuiz;
