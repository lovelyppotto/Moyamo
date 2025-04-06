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

  const handleAnswer = (optionId: number): void => {
    const isCorrect = answer?.correctOptionId === optionId;
    onSelect(isCorrect);
  };

  const handleTimerEnd = () => {
    setShowTimer(false);
    // 타이머가 끝나고 1초 후에 프로그레스 바 시작
    setTimeout(() => {
      onProgressStart();
    }, 1000);
  };

  return (
    <div className="flex justify-center relative h-screen mx-[2vh] xl:mx-[10vh] bg-transparent">
      <div className="h-1/3 sm:h-1/2  w-auto aspect-square ">
        <WebCamera onGestureDetected={(gestureId: number) => handleAnswer(gestureId)} />
        {showTimer && <CameraTimer onTimerEnd={handleTimerEnd} />}
      </div>
    </div>
  );
};

export default Answers3;
