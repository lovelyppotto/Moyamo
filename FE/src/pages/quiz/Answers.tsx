/**
 * 섞인 답변의 목록을 출력하는 목적의 컴포넌트입니다.
 * 정답인 부분은 초록 색으로 바꾸기
 */
import React, { useRef, useState } from 'react';
import { GlbViewer } from '@/components/GlbViewer';
import { FrontendQuestionData } from '@/types/quizTypes';

interface AnswersProps {
  options: FrontendQuestionData['options'];
  answer: FrontendQuestionData['answer'];
  onSelect: (answer: boolean) => void;
  quizImage: string | null;
}

const Answers: React.FC<AnswersProps> = ({ options, answer, onSelect, quizImage }) => {
  const shuffledAnswers = useRef<FrontendQuestionData['options'] | null>(null);
  const [clicked, setClicked] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const baseButtonClass =
    'flex items-center p-[2vh] w-full h-[22%] mb-[2vh] rounded-xl drop-shadow-quiz-box  sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB] cursor-pointer';

  if (!shuffledAnswers.current) {
    shuffledAnswers.current = [...options];
    shuffledAnswers.current.sort(() => Math.random() - 0.5);
  }

  const getButtonColor = (optionId: number): string => {
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
    <>
      <div className="h-100 flex flex-row justify-around my-3">
        <p className="sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB] cursor-pointer">
          {answer.correctGestureName}
        </p>
        {/* 문제 이미지 부분 */}
        <div className=" bg-white w-[44%] h-full rounded-xl drop-shadow-quiz-box flex justify-center items-center ">
          {/* 추후, 백앤드에서 blender 애니메이션을 가져올 예정 */}
          {quizImage && <GlbViewer url={quizImage} />}
        </div>
        {/* 퀴즈 보기 부분 */}
        <div className="w-[44%] h-full flex flex-col justify-between ">
          {shuffledAnswers.current && (
            <>
              <button
                type="button"
                className={`${baseButtonClass} ${getButtonColor(shuffledAnswers.current[0].id)}`}
                onClick={() => handleClick(shuffledAnswers.current![0].id)} // 클릭 -> 함수 isClick 실행 -> const isCorrect 비교 후 false, true로 onSelect 내보내기-> 중복: 괜찮나?
                disabled={clicked}
              >
                <p className="mr-5">①</p>
                <p>{shuffledAnswers.current[0].meaning}</p>
              </button>
              <button
                type="button"
                className={`${baseButtonClass} ${getButtonColor(shuffledAnswers.current[1].id)}`}
                onClick={() => handleClick(shuffledAnswers.current![1].id)}
                disabled={clicked}
              >
                <p className="mr-5">②</p>
                <p>{shuffledAnswers.current[1].meaning}</p>
              </button>

              <button
                type="button"
                className={`${baseButtonClass} ${getButtonColor(shuffledAnswers.current[2].id)}`}
                onClick={() => handleClick(shuffledAnswers.current![2].id)}
                disabled={clicked}
              >
                <p className="mr-5">③</p>
                <p>{shuffledAnswers.current[2].meaning}</p>
              </button>
              <button
                type="button"
                className={`${baseButtonClass} ${getButtonColor(shuffledAnswers.current[3].id)}`}
                onClick={() => handleClick(shuffledAnswers.current![3].id)}
                disabled={clicked}
              >
                <p className="mr-5">④</p>
                <p>{shuffledAnswers.current[3].meaning}</p>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Answers;
