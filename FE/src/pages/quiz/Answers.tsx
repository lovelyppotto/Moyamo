//섞인 답변의 목록을 출력하는 목적의 컴포넌트입니다.
//정답인 부분은 초록 색으로 바꾸기
import { useRef } from 'react';

interface AnswersProps {
  answers: string[];
  onSelect: (answer: string) => void;
  isSelected: string;
  answerState: string;
}

function Answers({ answers, onSelect, isSelected, answerState }: AnswersProps): JSX.Element {
  const shuffledAnswers = useRef<string[] | null>(null);

  if (!shuffledAnswers.current) {
    shuffledAnswers.current = [...answers];
    shuffledAnswers.current.sort(() => Math.random() - 0.5);
  }

  // cssClass 기본값 설정
  const getCssClass = (answer: string) => {
    const baseClass =
      'flex justify-center items-center w-2/5 h-[10vh] rounded-xl drop-shadow-quiz-box sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB] cursor-pointer';
    // 현재 답변이 사용자가 선택한 답변인지 확인
    const isThisAnswerSelected = answer === isSelected;

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
    } else if (answerState === 'wrong' && isThisAnswerSelected) {
      // 사용자가 선택한 답변이 오답일 때(빨간색)
      colorClass = 'bg-[var(--color-wrong-300)] text-white';
    } else if (answerState === 'wrong' && isCorrectAnswer) {
      // 사용자가 오답을 선택했을 때 정답 표시
      colorClass = 'bg-[var(--color-correct-300)] text-white';
    } else {
      // 기본 상태 (미선택: 배경 흰색)
      colorClass = 'bg-white';
    }

    return `${baseClass} ${colorClass}`;
  };
  return (
    <>
      {/* 퀴즈 보기 부분 */}
      {/* 퀴즈 내용 백앤드에서 받아와서 보여지도록 하기 */}
      {/* 폰트어썸 유료 결제하면 icon circle_1이걸로 바꾸기! */}
      {/* 버튼 컴포넌트 만들기 */}
      <div>
        <div className="flex justify-around mt-[3vh]">
          <button
            className={getCssClass(shuffledAnswers.current[0])}
            onClick={() => onSelect(shuffledAnswers.current[0])}
          >
            <p className="mr-5">①</p>
            <p>{shuffledAnswers.current[0]}</p>
          </button>
          <button
            className={getCssClass(shuffledAnswers.current[1])}
            onClick={() => onSelect(shuffledAnswers.current[1])}
          >
            <p className="mr-5">②</p>
            <p>{shuffledAnswers.current[1]}</p>
          </button>
        </div>

        <div className="flex justify-around mt-[3vh]">
          <button
            className={getCssClass(shuffledAnswers.current[2])}
            onClick={() => onSelect(shuffledAnswers.current[2])}
          >
            <p className="mr-5">③</p>
            <p>{shuffledAnswers.current[2]}</p>
          </button>
          <button
            className={getCssClass(shuffledAnswers.current[3])}
            onClick={() => onSelect(shuffledAnswers.current[3])}
          >
            <p className="mr-5">④</p>
            <p>{shuffledAnswers.current[3]}</p>
          </button>
        </div>
      </div>
    </>
  );
}

export default Answers;

//아래: map을 사용할 때 두 개씩 디자인 하기 어려움.
{
  /* <div className="flex flex-wrap justify-around h-screen">
{shuffledAnswers.current.map((answer, index) => {
  const numberIcons = ['①', '②', '③', '④'];
  return (
    <div key={answer} className="flex justify-around w-full mt-[3vh]">
      <button
        className="flex justify-center items-center w-2/5 h-[10vh] bg-white rounded-xl drop-shadow-quiz-box hover:bg-[var(--color-kr-500)] hover:text-white sm:text-sm md:text-3xl lg:text-4xl font-[NanumSquareRoundB] cursor-pointer"
        onClick={() => onSelect(answer)}
      >
        <p className="mr-5">{numberIcons[index]}</p>
        <p>{answer}</p>
      </button>
    </div>
  );
})}
</div> */
}
//버튼 결과에 따라서, 한번에 4개 버튼이 눌림 -> getCssClass 함수를 넣는다.
//문제: hover배경색이 계속 남아있는 경우도 있고, 아닌 경우도 있음...! 배경화면이 없음...!
//해결: 색상 변수 결정. 배경색상을 바꾸기 위해서 조건문 사용함. ${baseClass} ${colorClass} 형식으로 중복 방지.
