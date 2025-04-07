import { useState } from 'react';
import WebCamera from '@/components/WebCamera';
import CameraTimer from './CameraTimer';
import { FrontendQuestionData } from '@/types/quizTypes';

interface Answers3Props {
  options: FrontendQuestionData['options'];
  answer: FrontendQuestionData['answer'];
  onSelect: (answer: boolean) => void;
  onProgressStart: () => void;
}

const Answers3: React.FC<Answers3Props> = ({ onSelect, answer, onProgressStart }) => {
  const [showTimer, setShowTimer] = useState(true);
  const [isPaused, setIsPaused] = useState(true); // 카메라 일시 정지 상태
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);
  const [currentConfidence, setCurrentConfidence] = useState<number>(0);

  // 제스처 감지 처리 함수
  const handleGesture = (gesture: string, confidence: number) => {
    setCurrentGesture(gesture);
    setCurrentConfidence(confidence);

    // 타이머가 끝난 후에만 정답 처리
    if (!showTimer) {
      console.log(`감지된 제스처: ${gesture}, 신뢰도: ${confidence}`);

      const isCorrect = answer?.correctGestureName === gesture;
      onSelect(isCorrect);
    }
  };

  const handleTimerEnd = () => {
    setShowTimer(false);
    setIsPaused(false); // 타이머가 끝나면 카메라 활성화

    // 타이머가 끝나고 1초 후에 프로그레스 바 시작
    setTimeout(() => {
      handleTimerEnd();
      onProgressStart();
    }, 1000);
  };

  return (
    <div className="flex justify-center relative h-screen mx-[2vh] xl:mx-[10vh] bg-transparent">
      <div className="h-1/3 sm:h-1/2 w-auto aspect-square relative">
        {showTimer && (
          <div className="absolute inset-0 z-10">
            <CameraTimer onTimerEnd={handleTimerEnd} />
          </div>
        )}
        <div className="absolute inset-0">
          <WebCamera
            isPaused={isPaused}
            guideText={
              currentGesture
                ? `감지된 제스처: ${currentGesture} (${Math.round(currentConfidence * 100)}%)`
                : '손을 화면 중앙에 위치시켜 주세요'
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
