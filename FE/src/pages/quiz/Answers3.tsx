import { useState, useRef, useEffect } from 'react';
import { FrontendQuestionData } from '@/types/quizTypes';
import GesturePracticeCamera from '@/components/GesturePracticeCamera';

interface Answers3Props {
  options: FrontendQuestionData['options'];
  answer: FrontendQuestionData['answer'];
  onSelect: (answer: boolean) => void;
  isTimeOut?: boolean;
  questionData?: FrontendQuestionData;
}

const Answers3: React.FC<Answers3Props> = ({ onSelect, answer, questionData, isTimeOut }) => {
  const [isAnswered, setIsAnswered] = useState(false);
  // 중요: 답변 제출 여부를 추적하는 ref
  const hasSubmittedRef = useRef(false);

  // 제스처 인식 성공 시 호출될 함수
  const handleGestureCorrect = (correct: boolean) => {
    // 이미 답변을 제출했거나 타임아웃된 경우 무시
    if (hasSubmittedRef.current || isTimeOut) {
      return;
    }

    console.log('제스처 인식 결과:', correct ? '정답' : '오답');

    // 정답 처리
    hasSubmittedRef.current = true;
    setIsAnswered(true);
    onSelect(correct);
  };

  // 타임아웃 감지
  useEffect(() => {
    if (isTimeOut && !hasSubmittedRef.current) {
      console.log('타임아웃 발생, 오답으로 처리');
      hasSubmittedRef.current = true;
      setIsAnswered(true);
    }
  }, [isTimeOut]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 클린업 로직 (필요한 경우)
    };
  }, []);

  return (
    <div className="flex justify-center relative h-screen mx-[2vh] xl:mx-[10vh] bg-transparent">
      <div className="h-1/3 sm:h-1/2 w-auto aspect-square relative">
        <div className="absolute inset-0">
          <GesturePracticeCamera
            guidelineClassName="max-w-[500px] 
              w-[40%] lg:w-[60%]
              top-16 lg:top-22"
            guideText={isAnswered ? '정답입니다!' : '제스처를 유지해주세요.'}
            gestureLabel={answer?.correctGestureName}
            gestureType={questionData?.gestureType}
            isPaused={isAnswered || isTimeOut} // 정답 처리되거나 타임아웃되면 카메라 일시 정지
            onCorrect={handleGestureCorrect}
          />
        </div>
      </div>
    </div>
  );
};

export default Answers3;
