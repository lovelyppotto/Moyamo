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
    const CorrectAnswer = answer?.correctGestureName;

    // 타이머가 끝난 후에만 정답 처리
    if (!showTimer) {
      console.log(`감지된 제스처: ${gesture}, 신뢰도: ${confidence}`);
      // gesture랑 answer?.correctGestureName이 일치한다면 정답처리하기. (빠르게 가져오는데 일치는 빠르게 처리 가능?)
      if (CorrectAnswer === currentGesture) {
        onSelect(true);
      }
    }
  };

  //퀴즈를 풀 때

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
              currentGesture ? '동작을 인식하고 있습니다.' : '3초 이상 동작을 유지해주세요.'
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

//고칠 부분: 감지된 제스처: 없음, 신뢰도: 52.3 -> 얼마 안 지나서 바로 멈춤. PROGRESS 시작된건가? 2개만 받고 끝남?2번째 문제여도 끝남'''
//RESULT에 VERY GOOD, 버튼 돌아가기 아이콘콘
//다음 퀴즈를 건너뜀...?
//index를 넘어서 다음 퀴즈 페이지가 보임...!
