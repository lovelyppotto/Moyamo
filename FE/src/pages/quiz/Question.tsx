import Progress from './Progress.tsx';
import Answers from './Answers.tsx';
import Answers2 from './Answers2.tsx';
import Answers3 from './Answers3.tsx';
import PbNumber from './PbNumber.tsx';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useCallback, useEffect, useRef } from 'react';
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
  const [startProgress, setStartProgress] = useState(true);
  const [isTimeOut, setIsTimedOut] = useState(false);

  // 컴포넌트 마운트 추적
  const isMountedRef = useRef(true);
  // 답변 처리 완료 여부 추적
  const answerProcessedRef = useRef(false);

  // 컴포넌트 마운트/언마운트 처리
  useEffect(() => {
    console.log(`[Question] 컴포넌트 마운트됨, 문제 인덱스: ${Index}, 타입: ${questionData.type}`);
    isMountedRef.current = true;
    answerProcessedRef.current = false;

    return () => {
      console.log(`[Question] 컴포넌트 언마운트됨, 문제 인덱스: ${Index}`);
      isMountedRef.current = false;
    };
  }, [Index, questionData.type]);

  // 답변 선택 핸들러 - 안전하게 처리
  function handleSelectAnswer(isCorrect: boolean | null) {
    // 이미 처리되었거나 컴포넌트가 언마운트된 경우 무시
    if (answerProcessedRef.current || !isMountedRef.current) {
      console.log(`[Question] 답변 이미 처리됨 또는 언마운트됨, 무시: ${isCorrect}`);
      return;
    }

    console.log(`[Question] 답변 처리 시작: ${isCorrect}`);
    answerProcessedRef.current = true;

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
      // 컴포넌트가 언마운트되었는지 확인
      if (!isMountedRef.current) {
        console.log('[Question] 컴포넌트 언마운트됨, 상태 업데이트 무시');
        return;
      }

      setShowCorrectImage(false);
      setShowWrongImage(false);

      // 다음 문제로 넘어가기
      onSelectAnswer(isCorrect);
    }, 1000);
  }

  // 타임아웃 또는 스킵 처리
  const handleSkipAnswer = useCallback((): void => {
    // 이미 처리된 경우 중복 처리 방지
    if (answerProcessedRef.current || !isMountedRef.current) {
      console.log('[Question] 이미 답변이 처리되었거나 언마운트됨. 스킵 무시.');
      return;
    }

    console.log('[Question] Skip button clicked or timer expired');
    setIsTimedOut(true);

    // 스킵은 false(오답)로 처리
    handleSelectAnswer(false);
  }, []);

  // 타임아웃 설정
  useEffect(() => {
    // 카메라 타입일 경우 타이머 로그 추가
    if (questionData.type === 'CAMERA') {
      console.log(`[Question] 카메라 타입 문제, 타이머 설정: ${timer}ms`);
    }
  }, [questionData.type, timer]);

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

          <Progress
            key={`${Index}-${timer}`}
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
              className="flex justify-between items-center rounded-2xl py-1 px-3 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer dark:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
              onClick={handleSkipAnswer}
              disabled={answer.isCorrect !== null || isTimeOut}
            >
              <p className="sm:text-xs md:text-xl 2xl:text-2xl font-[NanumSquareRoundB]">Skip</p>
              <FontAwesomeIcon icon={faArrowRight} className="m-3 sm:text-xs md:text-xl" />
            </button>
          </div>
          <div className="h-2/3 w-full overflow-x-visible mt-[3vh]">
            {/* 문제 유형별 컴포넌트 렌더링 */}
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
                key={`camera-answer-${Index}`}
                options={questionData.options}
                answer={questionData.answer}
                onSelect={handleSelectAnswer}
                isTimeOut={isTimeOut}
                questionData={questionData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Question;
