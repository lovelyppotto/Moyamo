//섞인 답변의 목록을 출력하는 목적의 컴포넌트입니다.
import { useRef } from 'react';

interface AnswersProps {
  answers: string[];
  onSelect: (answer: string) => void;
}

function Answers({ answers, onSelect }: AnswersProps): JSX.Element {
  const shuffledAnswers = useRef<string[] | null>(null);

  if (!shuffledAnswers.current) {
    shuffledAnswers.current = [...answers];
    shuffledAnswers.current.sort(() => Math.random() - 0.5);
  }

  return (
    <>
      {/* 퀴즈 보기 부분 */}
      {/* 퀴즈 내용 백앤드에서 받아와서 보여지도록 하기 */}
      {/* 폰트어썸 유료 결제하면 icon circle_1이걸로 바꾸기! */}
      {/* 디자인 수정하기! 함수 넣다가 flex부분이 좀 달라짐 */}
      <div className="flex flex-wrap justify-around h-screen">
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
      </div>
    </>
  );
}

export default Answers;
