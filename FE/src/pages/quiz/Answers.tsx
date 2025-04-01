/**
 * 섞인 답변의 목록을 출력하는 목적의 컴포넌트입니다.
 * 정답인 부분은 초록 색으로 바꾸기
 */
import React, { useRef } from 'react';
import { GlbViewer } from '@/components/GlbViewer';

interface Option {
  option_id: number;
  option_meaning: string;
}

interface Answer {
  answer_id: number;
  correct_option_id: number;
  correct_meaning: string;
}

interface AnswersProps {
  options: Option[];
  answer: Answer;
  onSelect: (answer: number | null) => void;
  isSelected: number | null;
  answerState: string;
  quizImage: string;
}

const Answers: React.FC<AnswersProps> = ({
  options,
  answer,
  onSelect,
  isSelected,
  answerState,
  quizImage,
}) => {
  const shuffledAnswers = useRef<Option[] | null>(null);

  if (!shuffledAnswers.current) {
    shuffledAnswers.current = [...options];
    shuffledAnswers.current.sort(() => Math.random() - 0.5);
  }

  /**
   * 답변 아이템의 CSS 클래스를 결정하는 함수
   */
  const getCssClass = (optionId: number): string => {
    const baseClass =
      'flex items-center p-[2vh] w-full h-[22%] mb-[2vh] rounded-xl drop-shadow-quiz-box  sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB] cursor-pointer';

    // 현재 답변이 사용자가 선택한 답변인지 확인
    const isThisAnswerSelected = optionId === isSelected;
    const unSelected = optionId !== isSelected;

    // 현재 답변이 정답인지 확인
    const isCorrectAnswer = answer?.correct_option_id === optionId;

    // 색상 변수 결정: 배경색상을 바꾸기 위해서 조건문 사용함.
    let colorClass = 'bg-white'; // 기본값 설정

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

  return (
    <>
      <div className="h-100 flex flex-row justify-around my-3">
        {/* 문제 이미지 부분 */}
        <div className=" bg-white w-[44%] h-full rounded-xl drop-shadow-quiz-box flex justify-center items-center ">
          {/* 추후, 백앤드에서 blender 애니메이션을 가져올 예정 */}
          <GlbViewer url={quizImage} />
        </div>
        {/* 퀴즈 보기 부분 */}
        <div className="w-[44%] h-full flex flex-col justify-between ">
          {shuffledAnswers.current && (
            <>
              <button
                type="button"
                className={getCssClass(shuffledAnswers.current[0].option_id)}
                disabled={answerState !== ''}
                onClick={() => onSelect(shuffledAnswers.current![0].option_id)}
              >
                <p className="mr-5">①</p>
                <p>{shuffledAnswers.current[0].option_meaning}</p>
              </button>
              <button
                type="button"
                className={getCssClass(shuffledAnswers.current[1].option_id)}
                disabled={answerState !== ''}
                onClick={() => onSelect(shuffledAnswers.current![1].option_id)}
              >
                <p className="mr-5">②</p>
                <p>{shuffledAnswers.current[1].option_meaning}</p>
              </button>

              <button
                type="button"
                className={getCssClass(shuffledAnswers.current[2].option_id)}
                disabled={answerState !== ''}
                onClick={() => onSelect(shuffledAnswers.current![2].option_id)}
              >
                <p className="mr-5">③</p>
                <p>{shuffledAnswers.current[2].option_meaning}</p>
              </button>
              <button
                type="button"
                className={getCssClass(shuffledAnswers.current[3].option_id)}
                disabled={answerState !== ''}
                onClick={() => onSelect(shuffledAnswers.current![3].option_id)}
              >
                <p className="mr-5">④</p>
                <p>{shuffledAnswers.current[3].option_meaning}</p>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Answers;
