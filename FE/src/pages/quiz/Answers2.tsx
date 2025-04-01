/**
 * 섞인 답변의 목록을 출력하는 목적의 컴포넌트입니다.
 * 정답인 부분은 초록 색으로 바꾸기
 */
//옳바른 제스처를 선택하는 컴포넌트입니다.
//수정: img를 받아와서 답 칸에 적어야 합니다. ->
import React, { useRef } from 'react';
import { GlbViewer } from '@/components/GlbViewer';
import { FrontendQuestionData } from '@/types/quizTypes';

interface Answers2Props {
  options: FrontendQuestionData['options'];
  answer: FrontendQuestionData['answer'];
  onSelect: (answer: number | null) => void;
  isSelected: number | null;
  answerState: string;
}

const Answers2: React.FC<Answers2Props> = ({
  options,
  answer,
  onSelect,
  isSelected,
  answerState,
}) => {
  const shuffledAnswers = useRef<FrontendQuestionData['options'] | null>(null);

  if (!shuffledAnswers.current) {
    shuffledAnswers.current = [...options];
    shuffledAnswers.current.sort(() => Math.random() - 0.5);
  }

  /**
   * 답변 아이템의 CSS 클래스를 결정하는 함수
   */
  const getCssClass = (optionId: number): string => {
    const baseClass =
      'flex flex-col items-center justify-around p-4 w-[45%] h-[80%] rounded-xl drop-shadow-quiz-box sm:text-sm md:text-xl lg:text-2xl font-[NanumSquareRoundB] cursor-pointer';

    const isThisAnswerSelected = optionId === isSelected;
    const unSelected = optionId !== isSelected;
    const isCorrectAnswer = answer?.correctOptionId === optionId;

    let colorClass = 'bg-white';

    if (!answer) {
      return `${baseClass} ${colorClass}`;
    }

    if (answerState === 'answered' && isThisAnswerSelected) {
      // 사용자가 선택한 답변 (정답 확인 전, 기본색상)
      colorClass = 'bg-[var(--color-answered-300)] text-white';
    } else if (answerState === 'correct' && isThisAnswerSelected) {
      // 사용자가 선택한 답변이 정답일 때(연두색)
      colorClass = 'bg-[var(--color-correct-300)] text-white';
    } else if (answerState === 'correct' && unSelected) {
      // 사용자가 오답을 선택했을 때 정답 표시
      colorClass = 'bg-gray-200 text-white';
    } else if (answerState === 'wrong' && isThisAnswerSelected) {
      // 사용자가 선택한 답변이 오답일 때(빨간색)
      colorClass = 'bg-[var(--color-wrong-300)] text-white';
    } else if (answerState === 'wrong' && isCorrectAnswer) {
      // 사용자가 오답을 선택했을 때 정답 표시
      colorClass = 'bg-[var(--color-correct-300)] text-white';
    } else if (answerState === 'wrong' && unSelected) {
      // 사용자가 오답을 선택했을 때 정답 표시
      colorClass = 'bg-gray-200 text-white';
    } else if (answerState === 'correct' && unSelected) {
      // 사용자가 오답을 선택했을 때 정답 표시
      colorClass = 'bg-gray-200 text-white';
    }

    return `${baseClass} ${colorClass}`;
  };

  // 옵션이나 답변이 없는 경우 처리
  if (!options.length || !answer) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col px-4 pt-[3vh]">
      {shuffledAnswers.current && (
        <>
          <div className="flex justify-between h-[44%]">
            <button
              type="button"
              className={getCssClass(shuffledAnswers.current[0].id)}
              disabled={answerState !== ''}
              onClick={() => onSelect(shuffledAnswers.current![0].id)}
            >
              <p className="text-2xl">①</p>
              {shuffledAnswers.current[0].gestureImage && (
                <div className="w-full h-[80%] flex items-center justify-center">
                  <GlbViewer url={shuffledAnswers.current[0].gestureImage} />
                </div>
              )}
            </button>

            <button
              type="button"
              className={getCssClass(shuffledAnswers.current[1].id)}
              disabled={answerState !== ''}
              onClick={() => onSelect(shuffledAnswers.current![1].id)}
            >
              <p className="text-2xl">②</p>
              {shuffledAnswers.current[1].gestureImage && (
                <div className="w-full h-[80%] flex items-center justify-center">
                  <GlbViewer url={shuffledAnswers.current[1].gestureImage} />
                </div>
              )}
            </button>
          </div>
          <div className="flex justify-between  h-[44%]">
            <button
              type="button"
              className={getCssClass(shuffledAnswers.current[2].id)}
              disabled={answerState !== ''}
              onClick={() => onSelect(shuffledAnswers.current![2].id)}
            >
              <p className="text-2xl">③</p>
              {shuffledAnswers.current[2].gestureImage && (
                <div className="w-full h-[80%] flex items-center justify-center">
                  <GlbViewer url={shuffledAnswers.current[2].gestureImage} />
                </div>
              )}
            </button>
            <button
              type="button"
              className={getCssClass(shuffledAnswers.current[3].id)}
              disabled={answerState !== ''}
              onClick={() => onSelect(shuffledAnswers.current![3].id)}
            >
              <p className="text-2xl">④</p>
              {shuffledAnswers.current[3].gestureImage && (
                <div className="w-full h-[80%] flex items-center justify-center">
                  <GlbViewer url={shuffledAnswers.current[3].gestureImage} />
                </div>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Answers2;
