// import '../../index.css';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Progress from '@/pages/quiz/Progress';
import QuizResult from '../QuizResult';
import PbNumber from '../PbNumber';
import { useState, useEffect } from 'react';
import QUSETIONS from '../questions.ts'

function GestureQuiz() {
  // const [isResult, setIsResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);//유저가 선택한 답들
  const activeQuestionIndex = userAnswers.length; // 몇 번째 문제를 보여줄 지 index번호 (최소한의 useState로 최대한의 상태 가져오는 것: 최적화)
  // 유저에게 보여지는 답변을 섞기: 복사본을 만들어야(원본은 유지) 정답 여부를 확인할 수 있음.
  const quizIsComplete = activeQuestionIndex === QUSETIONS.length;
  
  //함수: 유저가 선택한 답을 배열에 추가함.
  function handleSelectAnswer (selectedAnswer) {
    setUserAnswers((prevUserAnswers)=>{
      return [...prevUserAnswers, selectedAnswer];
    });
  }

  // useEffect(() => {
  //   // 결과 페이지가 나오는 함수: 일단 60초 후에 열리도록 함. 추후 조건 수정할 것
  //   const timerId = setTimeout(() => {
  //     setIsResult(true);
  //     console.log('result창이 열렸습니다.');
  //   }, 10000);
  //   // 마운트 할 때 타이머 값은 초기화 된다.
  //   return () => {
  //     clearTimeout(timerId);
  //   };
  // }, []);

  if (quizIsComplete) {
    return(<QuizResult/>)
  }
  const shuffledAnswers = [...QUSETIONS[activeQuestionIndex].answers]; 
  shuffledAnswers.sort(() => Math.random() - 0.5); // 0~1미만의 값에서 0.5를 뺀다면 100가지 경우의 수 중 50개가 음수 (값이 섞임)

  return (
    <>
      {/* {isResult ? <QuizResult /> : ''} */}
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
              {`Q${activeQuestionIndex+1}. ${QUSETIONS[activeQuestionIndex].text}`}
            </h1>
            <button className="flex justify-between items-center rounded-2xl py-1 px-3 hover:bg-gray-200">
              <p className="sm:text-xs md:text-xl 2xl:text-2xl font-[NanumSquareRoundB]">Skip</p>
              <FontAwesomeIcon icon={faArrowRight} className="m-3 sm:text-xs md:text-xl" />
            </button>
          </div>
          <div className="flex justify-center w-full h-2/7 bg-white rounded-xl drop-shadow-quiz-box  my-[3vh]">
            {/* 추후, 백앤드에서 blender 애니메이션을 가져올 예정 */}
              <img src={QUSETIONS[activeQuestionIndex].image} alt="sample_img" className="p-5" />   
          </div>
          {/* 퀴즈 보기 부분 */}
          {/* 퀴즈 내용 백앤드에서 받아와서 보여지도록 하기 */}
          {/* 폰트어썸 유료 결제하면 icon circle_1이걸로 바꾸기! */}
          {/* 디자인 수정하기! 함수 넣다가 flex부분이 좀 달라짐 */}
          <div className="flex flex-wrap justify-around">
            {shuffledAnswers.map((answer, index) => {
              const numberIcons = ['①', '②', '③', '④'];
              return (
                  <div key={index} className="flex justify-around w-full mt-[3vh]">
                    <button className="flex justify-center items-center w-2/5 h-[10vh] bg-white rounded-xl drop-shadow-quiz-box hover:bg-[var(--color-kr-500)] hover:text-white sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB]" onClick={() => handleSelectAnswer(answer)}>
                      <p className="mr-5">{numberIcons[index]}</p>
                      <p>{answer}</p>
                    </button>
                  </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default GestureQuiz;
