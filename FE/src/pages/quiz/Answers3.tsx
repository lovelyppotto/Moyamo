import { useState, useRef, useEffect } from 'react';
import WebCamera from '@/components/WebCamera';
import { FrontendQuestionData } from '@/types/quizTypes';

interface Answers3Props {
  options: FrontendQuestionData['options'];
  answer: FrontendQuestionData['answer'];
  onSelect: (answer: boolean) => void;
  isTimeOut: boolean;
}

const Answers3: React.FC<Answers3Props> = ({ onSelect, answer, isTimeOut }) => {
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);
  const [currentConfidence, setCurrentConfidence] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // 중요: 답변 제출 여부를 추적하는 ref
  const hasSubmittedRef = useRef(false);
  
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
        onSelect(false);
      }
    };

    // isTimeOut이 변경될 때마다 체크
    const intervalId = setInterval(checkTimeout, 100);
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      clearInterval(intervalId);
    };
  }, []); // 빈 의존성 배열로 마운트 시에만 한 번 실행

  // 제스처 감지 처리 함수
  const handleGesture = (gesture: string, confidence: number) => {
    // 이미 답변을 제출했거나 정답 처리된 경우 무시
    if (hasSubmittedRef.current || isAnswered) {
      return;
    }

    setCurrentGesture(gesture);
    setCurrentConfidence(confidence);
    const correctAnswer = answer?.correctGestureName;

    console.log(`감지된 제스처: ${gesture}, 신뢰도: ${confidence}, 정답: ${correctAnswer}`);

    if (correctAnswer === gesture) {
      console.log('정답 처리');
      
      // 답변 제출 상태 업데이트
      hasSubmittedRef.current = true;
      setIsAnswered(true);
      
      // 정답 처리 (딱 한 번만 호출됨)
      onSelect(true);
    }
  };

  // 디버깅용 - 현재 상태 로깅
  useEffect(() => {
    console.log('현재 상태:', { 
      isTimeOut, 
      hasSubmitted: hasSubmittedRef.current, 
      isAnswered, 
      currentGesture 
    });
  }, [isTimeOut, isAnswered, currentGesture]);

  return (
    <div className="flex justify-center relative h-screen mx-[2vh] xl:mx-[10vh] bg-transparent">
      <div className="h-1/3 sm:h-1/2 w-auto aspect-square relative ">
        <div className="absolute inset-0">
          <WebCamera
            isPaused={isAnswered} // 정답 처리되면 카메라 일시 정지
            guideText={
              isAnswered ? '응답이 처리되었습니다' : 
              currentGesture ? `제스처가 감지되었습니다: ${currentGesture}` : 
              '3초 이상 동작을 유지해주세요.'
            }
            guidelineClassName="w-4/5 opacity-50"
            onGesture={handleGesture}
          />
        </div>
      </div>
    </div>
  );
};

export default Answers3;