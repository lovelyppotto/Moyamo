import Progress from './Progress.tsx';
import Answers from './Answers.tsx';
import Answers2 from './Answers2.tsx';
import Answers3 from './Answers3.tsx';
import PbNumber from './PbNumber.tsx';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useCallback, useEffect } from 'react';
import { FrontendQuestionData } from '@/types/quizTypes';
import Animation from './Animation.tsx';

interface ResultProps {
  Index: number;
  onSelectAnswer: (answer: boolean | null) => void;
  questionData: FrontendQuestionData;
}

interface AnswerState {
  isCorrect: boolean | null;
}

function Question({ onSelectAnswer, Index, questionData }: ResultProps): JSX.Element {
  const [answer, setAnswer] = useState<AnswerState>({
    isCorrect: null,
  });
  const [showCorrectImage, setShowCorrectImage] = useState<boolean>(false);
  const [showWrongImage, setShowWrongImage] = useState<boolean>(false);
  const [timer, setTimer] = useState(questionData.type === 'CAMERA' ? 30000 : 10000);
  const [progressClass, setProgressClass] = useState('bg-[var(--color-kr-600)]');
  const [startProgress, setStartProgress] = useState(true); // 모든 타입에서 바로 시작하도록 변경
  const [isTimeOut, setIsTimedOut] = useState(false);

  // useEffect를 제거하고 항상 프로그레스 바가 시작되도록 함

  function handleSelectAnswer(isCorrect: boolean | null) {
    // 모든 케이스(정답, 오답, 스킵)에 대해 처리
    setAnswer({
      isCorrect: isCorrect,
    });
    
    let newTimer = questionData.type === 'CAMERA' ? 20000 : 10000;
    let newProgressClass = 'bg-[var(--color-kr-600)]';

    // 스킵(null) 처리
    if (isCorrect === null) {
      newTimer = 2000;
      newProgressClass = 'bg-gray-200';
      setShowWrongImage(true); // 스킵도 오답으로 처리
    } else {
      // 정답/오답 처리
      if (isCorrect) {
        setShowCorrectImage(true);
      } else {
        setShowWrongImage(true);
      }
    }

    setTimer(newTimer);
    setProgressClass(newProgressClass);

    // 이미지 표시를 위한 타이머 (1초 후 이미지 숨김)
    setTimeout(() => {
      setShowCorrectImage(false);
      setShowWrongImage(false);
      
      // 다음 문제로 넘어가기
      onSelectAnswer(isCorrect);
    }, 1000);
  }

  const handleSkipAnswer = useCallback((): void => {
    console.log('Skip button clicked or timer expired');
    setIsTimedOut(true);
    // handleSelectAnswer를 통해 스킵 처리
    handleSelectAnswer(null);
  }, []);

  return (
    <div className="h-screen mx-[2vh] xl:mx-[10vh] bg-transparent">
      <div className="h-1/3">
        <Animation showCorrectImage={showCorrectImage} showWrongImage={showWrongImage} />
        {/* 진행 바, 퀴즈박스 */}
        {/* 마진 탑(margin-top)을 뷰포트 높이(viewport height)의 5%로 설정 */}
        <div className="h-screen flex flex-col mt-[5vh] xl:mt-[10vh] ">
          <div className="flex justfy-center items-center align-middle">
            <PbNumber Index={Index} />
          </div>
          {/* 문제: 계속 이전의 progress값이 저장이 된다 */}

          <Progress
            key={timer}
            timeout={timer}
            startProgress={startProgress}
            onTimeout={handleSkipAnswer}
            className={progressClass}
          />

          <div className="flex justify-between items-center mt-[3vh]">
            <h1 className="sm:text-sm md:text-2xl lg:text-3xl 2xl:text-4xl font-[NanumSquareRoundB] mx-[2%] dark:text-white">
              {`Q${Index + 1}. ${questionData?.text}`}
            </h1>
            <button
              className="flex justify-between items-center rounded-2xl py-1 px-3 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer dark:text-white"
              onClick={handleSkipAnswer}
            >
              <p className="sm:text-xs md:text-xl 2xl:text-2xl font-[NanumSquareRoundB]">Skip</p>
              <FontAwesomeIcon icon={faArrowRight} className="m-3 sm:text-xs md:text-xl" />
            </button>
          </div>
          <div className="h-2/3 w-full overflow-x-visible  mt-[3vh]">
            {/* form 태그 제거하고 직접 컴포넌트들 렌더링 */}
            {questionData?.type === 'MEANING' && (
              <Answers
                options={questionData.options}
                answer={questionData.answer}
                onSelect={handleSelectAnswer}
                quizImage={questionData.gestureUrl}
                isTimeOut={isTimeOut}
              />
            )}
            {questionData?.type === 'GESTURE' && (
              <Answers2
                options={questionData.options}
                answer={questionData.answer}
                onSelect={handleSelectAnswer}
                isTimeOut={isTimeOut}
              />
            )}
            {questionData?.type === 'CAMERA' && (
              <Answers3
                options={questionData.options}
                answer={questionData.answer}
                onSelect={handleSelectAnswer}                                             
                isTimeOut={isTimeOut}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Question;