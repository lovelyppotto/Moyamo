/**
 * 섞인 답변의 목록을 출력하는 목적의 컴포넌트입니다.
 * 정답인 부분은 초록 색으로 바꾸기
 */
//옳바른 제스처를 선택하는 컴포넌트입니다.
//수정: img를 받아와서 답 칸에 적어야 합니다. ->
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { GlbViewer } from '@/components/GlbViewer';
import { FrontendQuestionData } from '@/types/quizTypes';

interface Answers2Props {
  options: FrontendQuestionData['options'];
  answer: FrontendQuestionData['answer'];
  onSelect: (answer: boolean) => void;
  isTimeOut?: boolean;
  isButtonDisabled?: boolean; // 마지막 1초에 버튼 비활성화 여부
}

const Answers2: React.FC<Answers2Props> = ({
  options,
  answer,
  onSelect,
  isTimeOut = false,
  isButtonDisabled = false,
}) => {
  const shuffledAnswers = useMemo(() => {
    return [...options].sort(() => Math.random() - 0.5);
  }, [options]);

  const [clicked, setClicked] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const answerProcessedRef = useRef(false);

  const baseButtonClass =
    'flex items-center justify-center w-full h-full rounded-xl drop-shadow-quiz-box sm:text-sm md:text-xl lg:text-2xl font-[NanumSquareRoundB] cursor-pointer hover:brightness-95 transition-all';

  // 새로운 문제가 로드될 때마다 상태 초기화
  useEffect(() => {
    if (!isTimeOut) {
      setClicked(false);
      setSelectedOptionId(null);
      answerProcessedRef.current = false;
    }
  }, [options, isTimeOut]);

  // 타임아웃 처리
  useEffect(() => {
    if (isTimeOut && !clicked && !answerProcessedRef.current) {
      answerProcessedRef.current = true;
      setClicked(true);
      // 부모 컴포넌트에 타임아웃 알림 (오답으로 처리)
      onSelect(false);
    }
  }, [isTimeOut, clicked, onSelect]);

  const getButtonColor = (optionId: number): string => {
    // 타임아웃인 경우
    if (isTimeOut) {
      // 정답은 초록색으로 표시
      if (answer?.correctOptionId === optionId) {
        return 'bg-[var(--color-correct-300)] text-white';
      }
      // 나머지는 회색으로 표시
      return 'bg-gray-200';
    }

    // 사용자가 답을 선택한 경우
    if (clicked) {
      // 정답은 항상 초록색으로 표시
      if (answer?.correctOptionId === optionId) {
        return 'bg-[var(--color-correct-300)] text-white';
      }

      // 사용자가 선택한 오답은 빨간색으로 표시
      if (selectedOptionId === optionId) {
        return 'bg-[var(--color-wrong-300)] text-white';
      }

      // 나머지는 회색으로 표시
      return 'bg-gray-200';
    }

    // 기본 상태 (선택되지 않음)
    return 'bg-[var(--color-unselected-300)]';
  };

  const handleClick = (optionId: number): void => {
    // 이미 클릭되었거나 타임아웃이거나 1초 남은 경우 처리하지 않음
    if (clicked || isTimeOut || answerProcessedRef.current || isButtonDisabled) return;

    answerProcessedRef.current = true;
    const isCorrect = answer?.correctOptionId === optionId;
    setClicked(true);
    setSelectedOptionId(optionId);
    onSelect(isCorrect);
  };

  return (
    <div className="w-full h-[50vh] p-4">
      <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full">
        {shuffledAnswers.map((option, index) => (
          <button
            key={option.id}
            type="button"
            className={`${baseButtonClass} ${getButtonColor(option.id)} ${
              isButtonDisabled && !clicked && !isTimeOut ? 'opacity-70' : ''
            }`}
            onClick={() => handleClick(option.id)}
            disabled={clicked || isTimeOut || isButtonDisabled}
          >
            <div className="flex flex-col items-center justify-center w-full h-full p-2">
              <p className="text-2xl mb-2">{['①', '②', '③', '④'][index]}</p>
              {option.gestureImage && (
                <div className="w-full h-[80%] flex items-center justify-center">
                  <GlbViewer url={option.gestureImage} />
                  <div className="absolute inset-0 bg-transparent z-10"></div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Answers2;
