import { useState, useRef, useEffect } from 'react';
import { FrontendQuestionData } from '@/types/quizTypes';
import GesturePracticeCamera from '@/components/GesturePracticeCamera';

interface Answers3Props {
  options: FrontendQuestionData['options'];
  answer: FrontendQuestionData['answer'];
  onSelect: (answer: boolean) => void;
  onCorrect: (correct: boolean) => void;
  isTimeOut: boolean;
  questionData?: FrontendQuestionData;
}

const Answers3: React.FC<Answers3Props> = ({
  onSelect,
  onCorrect,
  answer,
  isTimeOut,
  questionData,
}) => {
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);
  const [currentConfidence, setCurrentConfidence] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const gestureType = questionData?.gestureType;
  console.log(`타입:${gestureType}`);
  console.log(`이름:${answer?.correctGestureName}`);

  // 중요: 답변 제출 여부를 추적하는 ref
  const hasSubmittedRef = useRef(false);

  // 제스처 연속 감지 횟수 추적을 위한 ref 추가
  const correctGestureCountRef = useRef(0);
  // 마지막으로 감지된 제스처를 추적하는 ref 추가
  const lastGestureRef = useRef<string | null>(null);
  // 디바운스 타이머 ref 추가
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 타임아웃 감지 - 의존성 배열 제거하여 마운트 시에만 실행되게 함
  useEffect(() => {
    // 현재 isTimeOut, onSelect를 클로저로 캡처
    const checkTimeout = () => {
      // 이미 답변을 제출했거나 정답 처리된 경우 무시
      if (isTimeOut && !hasSubmittedRef.current && !isAnswered) {
        console.log('카메라 시간 초과 - 오답 처리');

        // 답변 제출 상태 업데이트
        hasSubmittedRef.current = true;
        setIsAnswered(true);

        // 오답 처리 (딱 한 번만 호출됨)
        onCorrect(false);
      }
    };

    // isTimeOut이 변경될 때마다 체크
    const intervalId = setInterval(checkTimeout, 100);

    // 컴포넌트 언마운트 시 정리
    return () => {
      clearInterval(intervalId);
      // 디바운스 타이머 정리
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []); // 빈 의존성 배열로 마운트 시에만 한 번 실행

  // 제스처 감지 처리 함수
  const handleGesture = (gesture: string, confidence: number) => {
    // 이미 답변을 제출했거나 정답 처리된 경우 무시
    if (hasSubmittedRef.current || isAnswered) {
      return;
    }

    // 이전 디바운스 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // 제스처 감지 디바운싱 (200ms)
    debounceTimerRef.current = setTimeout(() => {
      setCurrentGesture(gesture);
      setCurrentConfidence(confidence);
      const correctAnswer = answer?.correctGestureName;

      console.log(`감지된 제스처: ${gesture}, 신뢰도: ${confidence}, 정답: ${correctAnswer}`);

      // 제스처 연속성 확인 로직 추가
      if (correctAnswer === gesture) {
        // 같은 제스처가 연속으로 감지될 때만 카운트 증가
        if (lastGestureRef.current === gesture) {
          correctGestureCountRef.current += 1;
          console.log(`정답 제스처 연속 감지: ${correctGestureCountRef.current}회`);

          // 3회 이상 연속으로 감지되면 정답으로 처리 (안정성 향상)
          if (correctGestureCountRef.current >= 3) {
            console.log('정답 처리 - 연속 3회 감지');

            // 답변 제출 상태 업데이트
            hasSubmittedRef.current = true;
            setIsAnswered(true);

            // 정답 처리 (딱 한 번만 호출됨)
            onCorrect(true);
          }
        } else {
          // 다른 제스처 후 정답 제스처가 감지되면 카운트 1로 초기화
          correctGestureCountRef.current = 1;
        }
      } else {
        // 오답이 감지되면 카운트 리셋
        correctGestureCountRef.current = 0;
      }

      // 현재 제스처를 마지막 제스처로 저장
      lastGestureRef.current = gesture;
    }, 200);
  };

  // 디버깅용 - 현재 상태 로깅
  useEffect(() => {
    console.log('현재 상태:', {
      isTimeOut,
      hasSubmitted: hasSubmittedRef.current,
      isAnswered,
      currentGesture,
      correctGestureCount: correctGestureCountRef.current,
    });
  }, [isTimeOut, isAnswered, currentGesture]);

  return (
    <div className="flex justify-center relative h-screen mx-[2vh] xl:mx-[10vh] bg-transparent">
      <div className="h-1/3 sm:h-1/2 w-auto aspect-square relative ">
        <div className="absolute inset-0">
          <GesturePracticeCamera
            guidelineClassName="max-w-[500px] 
              w-[40%] lg:w-[60%]
              top-16 lg:top-22"
            guideText={
              isAnswered
                ? '정답입니다!'
                : currentGesture === answer?.correctGestureName
                  ? '제스처를 유지해주세요...'
                  : '제스처를 3초간 유지해주세요.'
            }
            gestureLabel={answer?.correctGestureName}
            gestureType={gestureType}
            isPaused={isAnswered} // 정답 처리되면 카메라 일시 정지
            onGesture={handleGesture}
          />
        </div>
      </div>
    </div>
  );
};

export default Answers3;
