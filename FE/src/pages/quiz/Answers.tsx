/**
 * 섞인 답변의 목록을 출력하는 목적의 컴포넌트입니다.
 * 정답인 부분은 초록 색으로 바꾸기
 */
import React, { useRef } from 'react';

interface AnswersProps {
  answers: string[];
  onSelect: (answer: string) => void;
  isSelected: string;
  answerState: string;
  quizImage: string;
}

const Answers: React.FC<AnswersProps> = ({
  answers,
  onSelect,
  isSelected,
  answerState,
  quizImage,
}) => {
  const shuffledAnswers = useRef<string[] | null>(null);

  if (!shuffledAnswers.current) {
    shuffledAnswers.current = [...answers];
    shuffledAnswers.current.sort(() => Math.random() - 0.5);
  }

  /**
   * 답변 아이템의 CSS 클래스를 결정하는 함수
   */
  const getCssClass = (answer: string): string => {
    const baseClass =
      'flex items-center p-[2vh] w-full h-[22%] mb-[2vh] rounded-xl drop-shadow-quiz-box  sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB] cursor-pointer';

    // 현재 답변이 사용자가 선택한 답변인지 확인
    const isThisAnswerSelected = answer === isSelected;
    const unSelected = answer !== isSelected;

    // 현재 답변이 정답인지 확인
    const isCorrectAnswer = answer === answers[0];

    // 색상 변수 결정: 배경색상을 바꾸기 위해서 조건문 사용함.
    let colorClass;

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
    } else {
      // 기본 상태 (미선택: 배경 흰색)
      colorClass = 'bg-white';
    }

    return `${baseClass} ${colorClass}`;
  };

  return (
    <>
      <div className="h-100 flex flex-row justify-around my-3">
        {/* 문제 이미지 부분 */}
        <div className=" bg-white w-[44%] h-full rounded-xl drop-shadow-quiz-box flex justify-center items-center ">
          {/* 추후, 백앤드에서 blender 애니메이션을 가져올 예정 */}
          <img src={quizImage} alt="sample_img" className="p-5" />
        </div>
        {/* 퀴즈 보기 부분 */}
        <div className="w-[44%] h-full flex flex-col justify-between ">
          <button
            type="button"
            className={getCssClass(shuffledAnswers.current[0])}
            disabled={answerState !== ''}
            onClick={() => onSelect(shuffledAnswers.current[0])}
          >
            <p className="mr-5">①</p>
            <p>{shuffledAnswers.current[0]}</p>
          </button>
          <button
            type="button"
            className={getCssClass(shuffledAnswers.current[1])}
            disabled={answerState !== ''}
            onClick={() => onSelect(shuffledAnswers.current[1])}
          >
            <p className="mr-5">②</p>
            <p>{shuffledAnswers.current[1]}</p>
          </button>

          <button
            type="button"
            className={getCssClass(shuffledAnswers.current[2])}
            disabled={answerState !== ''}
            onClick={() => onSelect(shuffledAnswers.current[2])}
          >
            <p className="mr-5">③</p>
            <p>{shuffledAnswers.current[2]}</p>
          </button>
          <button
            type="button"
            className={getCssClass(shuffledAnswers.current[3])}
            disabled={answerState !== ''}
            onClick={() => onSelect(shuffledAnswers.current[3])}
          >
            <p className="mr-5">④</p>
            <p>{shuffledAnswers.current[3]}</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default Answers;
