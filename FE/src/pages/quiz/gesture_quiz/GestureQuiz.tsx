// import '../../index.css';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Progress from '@/pages/quiz/Progress';
import QuizResult from '../QuizResult';
import PbNumber from '../PbNumber';
import { useState, useCallback, useMemo } from 'react';
import QUSETIONS from '../questions.ts';

function GestureQuiz() {
  const [showCorrectImage, setShowCorrectImage] = useState(false);
  const [showWrongImage, setShowWrongImage] = useState(false);
  const [answerState, setAnswerState] = useState(''); // 유저가 답을 선택했는지 상태 (초기값은 빈 값.)
  const [userAnswers, setUserAnswers] = useState([]); //유저가 선택한 답들
  const activeQuestionIndex = answerState === '' ? userAnswers.length : userAnswers.length - 1; // 몇 번째 문제를 보여줄 지 index번호 (최소한의 useState로 최대한의 상태 가져오는 것: 최적화)/ 만약 해당 페이지에서 답 선택했으면 배열-1을 해서 아직 이 페이지에 머물게 해야함(결과 보여주기 위해).
  // 유저에게 보여지는 답변을 섞기: 복사본을 만들어야(원본은 유지) 정답 여부를 확인할 수 있음.
  const quizIsComplete = activeQuestionIndex === QUSETIONS.length;
  //useCallback: 주변 컴포넌트 함수가 다시 실행되어도, 재생성되지 않음.
  //함수: 유저가 선택한 답을 배열에 추가함.
  const handleSelectAnswer = useCallback(
    function handleSelectAnswer(selectedAnswer) {
      if (answerState !== '') return; // 이미 선택 상태일 때는 추가 클릭 방지
      setAnswerState('answered');
      setUserAnswers((prevUserAnswers) => {
        return [...prevUserAnswers, selectedAnswer];
      }); // 유저가 선택한 답을 저장하는 배열.
      //api에 맞춰서 [0]이 아니라 답을 백에서 받아오는 형식으로 수정해야 함!!
      const checkAnswerTimer = setTimeout(() => {
        const isCorrect = selectedAnswer === QUSETIONS[activeQuestionIndex].answers[0]; // 정답이면 true

        if (isCorrect) {
          setAnswerState('correct');
          setShowCorrectImage(true);
        } else {
          setAnswerState('wrong');
          setShowWrongImage(true);
        }

        //이미지 표시를 위한 타이머 (1초 후 이미지 숨김)
        const hideImageTimer = setTimeout(() => {
          setShowCorrectImage(false);
          setShowWrongImage(false);
        }, 1000);

        //다음문제로 넘어가기 위한 타이머 (2초 후):삼항연산식으로 인해 다음페이지로 넘어감.
        const nextQuestionTimer = setTimeout(() => {
          setAnswerState('');
        }, 1000);

        //타이머 정리 함수: 언마운트 시 자동 호출
        return () => {
          clearTimeout(hideImageTimer);
          clearTimeout(nextQuestionTimer);
        };
      }, 1000); // 선택한 후 1초 뒤에 맞는 답이면 correct, 틀린 답이면 wrong
      // 타이머 정리 함수 반환
      return () => {
        clearTimeout(checkAnswerTimer);
      };
    },
    [activeQuestionIndex, answerState, QUSETIONS] // activeQuestionIndex가 달라질 때마다 재생산
  );
  const handleSkipAnswer = useCallback(() => () => handleSelectAnswer(null), [handleSelectAnswer]);

  const shuffledAnswers = useMemo(() => {
    // 퀴즈가 완료되었거나 인덱스가 유효하지 않은 경우 빈 배열 반환
    if (quizIsComplete || !QUSETIONS[activeQuestionIndex]) return [];

    const answers = [...QUSETIONS[activeQuestionIndex].answers];
    answers.sort(() => Math.random() - 0.5); // 0~1미만의 값에서 0.5를 뺀다면 100가지 경우의 수 중 50개가 음수 (값이 섞임)
    return answers;
  }, [activeQuestionIndex, QUSETIONS, quizIsComplete]);

  if (quizIsComplete) {
    return <QuizResult />;
  }
  return (
    <>
      {showCorrectImage && (
        <img
          src="/images/correct.png"
          alt="correct_img"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-[80vh] h-[80vh]"
        />
      )}
      {showWrongImage && (
        <img
          src="/images/wrong.png"
          alt="wrong_img"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-[80vh] h-[80vh]"
        />
      )}
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
          <Progress
            key={activeQuestionIndex} // key를 index값으로 변경 : 해당 컴포넌트가 재랜더링됨.
            timeout={10000}
            onTimeout={() => handleSelectAnswer(null)}
          />
          <div className="flex justify-between items-center mt-[3vh]">
            <h1 className="sm:text-sm md:text-2xl lg:text-3xl 2xl:text-4xl font-[NanumSquareRoundB]">
              {`Q${activeQuestionIndex + 1}. ${QUSETIONS[activeQuestionIndex].text}`}
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
          <div className="flex flex-wrap justify-around h-screen">
            {shuffledAnswers.map((answer, index) => {
              const numberIcons = ['①', '②', '③', '④'];
              return (
                <div key={answer} className="flex justify-around w-full mt-[3vh]">
                  <button
                    className="flex justify-center items-center w-2/5 h-[10vh] bg-white rounded-xl drop-shadow-quiz-box hover:bg-[var(--color-kr-500)] hover:text-white sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB]"
                    onClick={() => handleSelectAnswer(answer)}
                  >
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

//문제: 답을 눌렀을 때 이미지가 뜨지 않음 + 2초에 한번씩 버튼이 재랜더링 됨...ㅎ 2초에 한번씩
//버튼 재렌더링 문제:
// shuffledAnswers가 컴포넌트 렌더링마다 새로 생성되어 섞이고 있습니다.
// 한 번 섞은 답안은 고정되어야 합니다.

//문제:"Cannot access 'shuffledAnswers' before initialization" 오류"
// 기존 코드에서는 shuffledAnswers 변수를 정의하면서 동시에 그 변수를 사용하려고 했습니다.
//useMemo: answers라는 새 변수를 만들어 배열을 복사, return.

//오류: react-router-dom.js?v=f36f18ed:5697 React Router caught the following error during render Error: Rendered fewer hooks than expected. This may be caused by an accidental early return statement.
// "Rendered fewer hooks than expected"(예상보다 적은 훅이 렌더링됨)이라는 중요한 React 훅 규칙 위반을 나타냅니다.
//조건부로 훅을 호출하거나 컴포넌트가 일찍 반환되어 일부 훅이 실행되지 않을 때 발생합니다. React 훅은 항상 동일한 순서로 호출되어야 함.
// if (quizIsComplete) {
//   return <QuizResult />;
// }
// 이 return 후에 useMemo 훅이 호출되려고 함

// 오류: Unexpected Application Error! Cannot read properties of undefined (reading 'answers')
// shuffledAnswers -> useMemo()에서 퀴즈가 완료되었거나 인덱스가 유효하지 않은 경우 빈 배열 반환 먼저 놔둠.
