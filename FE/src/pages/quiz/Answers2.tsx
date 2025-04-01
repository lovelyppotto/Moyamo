/**
 * 섞인 답변의 목록을 출력하는 목적의 컴포넌트입니다.
 * 정답인 부분은 초록 색으로 바꾸기
 */
//옳바른 제스처를 선택하는 컴포넌트입니다.
//수정: img를 받아와서 답 칸에 적어야 합니다. ->
import React, { useRef } from 'react';
import { GlbViewer } from '../../components/GlbViewer';

interface Option {
  option_id: number;
  gesture_id: number;
  gesture_image: string;
}

interface Answer {
  answer_id: number;
  correct_option_id: number;
  correct_gesture_id: number;
}

interface Answers2Props {
  options: Option[];
  answer: Answer;
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
      'flex items-center p-[2vh] w-full h-[22%] mb-[2vh] mx-[2vh] rounded-xl drop-shadow-quiz-box  sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB] cursor-pointer';

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

  // 옵션이나 답변이 없는 경우 처리
  if (!options.length || !answer) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col ">
      {/* 문제 이미지 부분 */}
      <div className=" bg-white w-full h-1/5 rounded-xl drop-shadow-quiz-box flex justify-center items-center ">
        {/* 추후, 백앤드에서 blender 애니메이션을 가져올 예정 */}
        <p className="sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB] ">
          ~~~한 상황에서 주로 사용하는 표현
        </p>
      </div>
      <div className="flex justify-between mt-[3vh]">
        {shuffledAnswers.current && (
          <>
            <button
              type="button"
              className={getCssClass(shuffledAnswers.current[0].option_id)}
              disabled={answerState !== ''}
              onClick={() => onSelect(shuffledAnswers.current![0].option_id)}
            >
              <p className="mr-5">①</p>
              <GlbViewer url={shuffledAnswers.current[0].gesture_image} />
            </button>
            <button
              type="button"
              className={getCssClass(shuffledAnswers.current[1].option_id)}
              disabled={answerState !== ''}
              onClick={() => onSelect(shuffledAnswers.current![1].option_id)}
            >
              <p className="mr-5">②</p>
              <GlbViewer url={shuffledAnswers.current[1].gesture_image} />
            </button>
          </>
        )}
      </div>

      <div className="flex justify-between mt-[3vh]">
        {shuffledAnswers.current && (
          <>
            <button
              type="button"
              className={getCssClass(shuffledAnswers.current[2].option_id)}
              disabled={answerState !== ''}
              onClick={() => onSelect(shuffledAnswers.current![2].option_id)}
            >
              <p className="mr-5">③</p>
              <GlbViewer url={shuffledAnswers.current[2].gesture_image} />
            </button>
            <button
              type="button"
              className={getCssClass(shuffledAnswers.current[3].option_id)}
              disabled={answerState !== ''}
              onClick={() => onSelect(shuffledAnswers.current![3].option_id)}
            >
              <p className="mr-5">④</p>
              <GlbViewer url={shuffledAnswers.current[3].gesture_image} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Answers2;
