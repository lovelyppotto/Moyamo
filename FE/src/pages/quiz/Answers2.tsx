/**
 * 섞인 답변의 목록을 출력하는 목적의 컴포넌트입니다.
 * 정답인 부분은 초록 색으로 바꾸기
 */
//옳바른 제스처를 선택하는 컴포넌트입니다.
//수정: img를 받아와서 답 칸에 적어야 합니다. ->
import React, { useRef, useState } from 'react';
import { GlbViewer } from '@/components/GlbViewer';
import { FrontendQuestionData } from '@/types/quizTypes';

interface Answers2Props {
  options: FrontendQuestionData['options'];
  answer: FrontendQuestionData['answer'];
  onSelect: (answer: boolean) => void;
  isTimeOut?: boolean;
}

const Answers2: React.FC<Answers2Props> = ({ options, answer, onSelect, isTimeOut = false }) => {
  const shuffledAnswers = useRef<FrontendQuestionData['options'] | null>(null);
  const [clicked, setClicked] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const baseButtonClass =
    'flex items-center justify-center w-full h-full rounded-xl drop-shadow-quiz-box sm:text-sm md:text-xl lg:text-2xl font-[NanumSquareRoundB] cursor-pointer hover:brightness-95 transition-all';

  if (!shuffledAnswers.current) {
    shuffledAnswers.current = [...options];
    shuffledAnswers.current.sort(() => Math.random() - 0.5);
  }

  const getButtonColor = (optionId: number): string => {
    if (isTimeOut) {
      // 정답은 초록색으로 표시
      if (answer?.correctOptionId === optionId) {
        return 'bg-[var(--color-correct-300)] text-white';
      }
      // 나머지는 회색으로 표시
      return 'bg-gray-200';
    }
    if (!clicked) {
      return 'bg-[var(--color-unselected-300)]';
    }

    const isCorrect = answer?.correctOptionId === optionId;

    if (!isCorrect && selectedOptionId !== optionId) {
      return 'bg-gray-200';
    }
    // 정답이면 초록색, 오답이면 빨간색 반환
    return isCorrect
      ? 'bg-[var(--color-correct-300)] text-white'
      : 'bg-[var(--color-wrong-300)] text-white';
  };

  const handleClick = (optionId: number): void => {
    const isCorrect = answer?.correctOptionId === optionId;
    setClicked(true);
    onSelect(isCorrect);
    setSelectedOptionId(optionId);
  };

  return (
    <div className="w-full h-[50vh] p-4">
      {shuffledAnswers.current && (
        <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full">
          {/* 첫 번째 버튼 */}
          <button
            type="button"
            className={`${baseButtonClass} ${getButtonColor(shuffledAnswers.current[0].id)}`}
            onClick={() => handleClick(shuffledAnswers.current![0].id)}
            disabled={clicked}
          >
            <div className="flex flex-col items-center justify-center w-full h-full p-2">
              <p className="text-2xl mb-2">①</p>
              {shuffledAnswers.current[0].gestureImage && (
                <div className="w-full h-[80%] flex items-center justify-center">
                  <GlbViewer url={shuffledAnswers.current[0].gestureImage} />
                </div>
              )}
            </div>
          </button>

          {/* 두 번째 버튼 */}
          <button
            type="button"
            className={`${baseButtonClass} ${getButtonColor(shuffledAnswers.current[1].id)}`}
            onClick={() => handleClick(shuffledAnswers.current![1].id)}
            disabled={clicked}
          >
            <div className="flex flex-col items-center justify-center w-full h-full p-2">
              <p className="text-2xl mb-2">②</p>
              {shuffledAnswers.current[1].gestureImage && (
                <div className="w-full h-[80%] flex items-center justify-center">
                  <GlbViewer url={shuffledAnswers.current[1].gestureImage} />
                </div>
              )}
            </div>
          </button>

          {/* 세 번째 버튼 */}
          <button
            type="button"
            className={`${baseButtonClass} ${getButtonColor(shuffledAnswers.current[2].id)}`}
            onClick={() => handleClick(shuffledAnswers.current![2].id)}
            disabled={clicked}
          >
            <div className="flex flex-col items-center justify-center w-full h-full p-2">
              <p className="text-2xl mb-2">③</p>
              {shuffledAnswers.current[2].gestureImage && (
                <div className="w-full h-[80%] flex items-center justify-center">
                  <GlbViewer url={shuffledAnswers.current[2].gestureImage} />
                </div>
              )}
            </div>
          </button>

          {/* 네 번째 버튼 */}
          <button
            type="button"
            className={`${baseButtonClass} ${getButtonColor(shuffledAnswers.current[3].id)}`}
            onClick={() => handleClick(shuffledAnswers.current![3].id)}
            disabled={clicked}
          >
            <div className="flex flex-col items-center justify-center w-full h-full p-2">
              <p className="text-2xl mb-2">④</p>
              {shuffledAnswers.current[3].gestureImage && (
                <div className="w-full h-[80%] flex items-center justify-center">
                  <GlbViewer url={shuffledAnswers.current[3].gestureImage} />
                </div>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Answers2;
