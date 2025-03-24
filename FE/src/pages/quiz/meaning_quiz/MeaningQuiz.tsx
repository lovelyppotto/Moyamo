// import '../../index.css';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Progress from '@/pages/quiz/Progress';
import QuizResult from '../QuizResult';
import PbNumber from '../PbNumber';
import { useState, useEffect } from 'react';

function MeaningQuiz() {
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
        {/* 초시계: 디자인 더 이쁜 시계로 바꾸기! */}
        <div className="absolute left-1/2 top-4 transform -translate-x-1/2 z-10">
          <div className="flex justfy-center items-conter">
            <PbNumber />
          </div>
        </div>
        {/* 진행 바, 퀴즈박스 */}
        {/* progress바를 seekbar로 교체하기!!! */}
        {/* 마진 탑(margin-top)을 뷰포트 높이(viewport height)의 5%로 설정 */}
        <div className="h-screen flex flex-col mt-[10vh] sm:mx-[2vh] lg:mx-[10vh]">
          <Progress />
          <div className="flex justify-between items-center sm: mt-[1vh] md:mt-[3vh] ">
            <h1 className=" text-sm md:text-3xl 2xl:text-4xl font-[NanumSquareRoundB]">
              Q.이 상황에 적절한 제스처는 무엇인가요?
            </h1>
            <button className="flex justify-between items-center rounded-2xl py-1 px-3 hover:bg-gray-200">
              <p className="text-xs md:text-xl 2xl:text-2xl font-[NanumSquareRoundB]">Skip</p>
              <FontAwesomeIcon icon={faArrowRight} className="m-3 text-xs lg:xl" />
            </button>
          </div>
          <div className="flex justify-center items-center w-full min-h-[16.666vh]  bg-white rounded-xl drop-shadow-quiz-box  my-[3vh]">
            {/* 추후, 백앤드에서 제스처에 대한 설명을 가져올 예정 */}
            {/* min-h와 break-all 를 사용하여, 글의 길이에 따라 공간이 생기게 함 */}
            <p className="break-all p-3 text-sm md:text-2xl xl:text-3xl 2xl:text-4xl font-[NanumSquareRound]">
              한국에서 이 동작은 사랑한다는 의미를 지닌다. 사진을 찍을 때에도 자주 사용한다.{' '}
            </p>
          </div>
          {/* 퀴즈 보기 부분 */}
          {/* blender 애니메이션 백앤드에서 받아와서 보여지도록 하기 */}
          {/* 폰트어썸 유료 결제하면 icon circle_1이걸로 바꾸기! */}
          <div className="flex justify-around mt-[3vh]">
            <button className=" flex justify-center items-center w-2/5 h-[15vh] bg-white rounded-xl drop-shadow-quiz-box hover:bg-[var(--color-kr-500)] hover:text-white text-3xl lg:text-4xl font-[NanumSquareRoundB] ">
              <p className="mr-5">①</p>
              <img src="/images/gesture_example.png" alt="sample_img" className="w-[10vh] p-2" />
            </button>
            <button className=" flex justify-center items-center w-2/5 h-[15vh] bg-white rounded-xl drop-shadow-quiz-box hover:bg-[var(--color-kr-500)] hover:text-white text-3xl lg:text-4xl font-[NanumSquareRoundB]">
              <p className="mr-5">②</p>
              <img src="/images/gesture_example.png" alt="sample_img" className="w-[10vh] p-2" />
            </button>
          </div>
          <div className="flex justify-around mt-[3vh]">
            <button className=" flex justify-center items-center w-2/5 h-[15vh] bg-white rounded-xl drop-shadow-quiz-box hover:bg-[var(--color-kr-500)] hover:text-white text-3xl lg:text-4xl font-[NanumSquareRoundB]">
              <p className="mr-5">③</p>
              <img src="/images/gesture_example.png" alt="sample_img" className="w-[10vh] p-2" />
            </button>{' '}
            <button className=" flex justify-center items-center w-2/5 h-[15vh] bg-white rounded-xl drop-shadow-quiz-box hover:bg-[var(--color-kr-500)] hover:text-white text-3xl lg:text-4xl font-[NanumSquareRoundB]">
              <p className="mr-5">④</p>
              <img src="/images/gesture_example.png" alt="sample_img" className="w-[10vh] p-2" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MeaningQuiz;
