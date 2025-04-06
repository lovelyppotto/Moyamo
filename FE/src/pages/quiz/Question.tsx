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
  onSelectAnswer: (answer: number | null) => void;
  questionData: FrontendQuestionData;
}

interface AnswerState {
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  answerState: string;
}

function Question({ onSelectAnswer, Index, questionData }: ResultProps): JSX.Element {
  const [answer, setAnswer] = useState<AnswerState>({
    selectedAnswer: null,
    isCorrect: null,
    answerState: '',
  });
  const [showCorrectImage, setShowCorrectImage] = useState<boolean>(false);
  const [showWrongImage, setShowWrongImage] = useState<boolean>(false);
  const [timer, setTimer] = useState(10000);
  const [progressClass, setProgressClass] = useState('bg-[var(--color-kr-600)]');
  const [startProgress, setStartProgress] = useState(false);

  useEffect(() => {
    // CAMERA 타입이 아닌 경우 바로 프로그레스 시작
    if (questionData.type !== 'CAMERA') {
      setStartProgress(true);
    }
  }, [questionData.type]);

  function handleSelectAnswer(selectedAnswer: number | null) {
    setAnswer({
      selectedAnswer: selectedAnswer,
      isCorrect: null,
      answerState: 'answered',
    });
    let newTimer = 10000; //시간의 기본 최대값
    let newProgressClass = '';
    if (selectedAnswer !== null) {
      newTimer = 1000;
    }
    if (answer.isCorrect !== null) {
      newTimer = 2000;
      newProgressClass = 'bg-gray-200';
    }
    setTimer(newTimer);
    setProgressClass(newProgressClass);

    // 1초 후 정답 여부 확인
    setTimeout(() => {
      const isCorrect = selectedAnswer === questionData.answer.correctOptionId;
      setAnswer({
        selectedAnswer: selectedAnswer,
        isCorrect,
        answerState: isCorrect ? 'correct' : 'wrong',
      });
      // 정답 여부에 따라 이미지 표시
      if (isCorrect) {
        setShowCorrectImage(true);
      } else {
        setShowWrongImage(true);
      }

      //이미지 표시를 위한 타이머 (1초 후 이미지 숨김)
      setTimeout(() => {
        setShowCorrectImage(false);
        setShowWrongImage(false);
      }, 1000);
      // 다음 문제로 넘어가기 위한 타이머
      setTimeout(() => {
        onSelectAnswer(selectedAnswer);
      }, 400);
    }, 200);
  }

  const handleSkipAnswer = useCallback((): void => handleSelectAnswer(null), [handleSelectAnswer]);

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
          {startProgress && (
            <Progress
              key={timer}
              timeout={timer}
              onTimeout={handleSkipAnswer}
              className={progressClass}
            />
          )}
          <div className="flex justify-between items-center mt-[3vh]">
            <h1 className="sm:text-sm md:text-2xl lg:text-3xl 2xl:text-4xl font-[NanumSquareRoundB] mx-[2%] dark:text-white">
              {`Q${Index + 1}. ${questionData.text}`}
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
            {questionData.type === 'MEANING' && (
              <Answers
                options={questionData.options}
                answer={questionData.answer}
                onSelect={handleSelectAnswer}
                isSelected={answer.selectedAnswer}
                answerState={answer.answerState}
                quizImage={questionData.gestureUrl}
              />
            )}
            {questionData.type === 'GESTURE' && (
              <Answers2
                options={questionData.options}
                answer={questionData.answer}
                onSelect={handleSelectAnswer}
                isSelected={answer.selectedAnswer}
                answerState={answer.answerState}
              />
            )}
            {questionData.type === 'CAMERA' && (
              <Answers3
                options={questionData.options}
                answer={questionData.answer}
                onSelect={handleSelectAnswer}
                isSelected={answer.selectedAnswer}
                answerState={answer.answerState}
                onProgressStart={() => setStartProgress(true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Question;
