// import '../../index.css';

import QuizResult from './QuizResult';
import { useState, useCallback } from 'react';
import QUSETIONS from './questions.ts';
// import Animation from './Animation.tsx';
import Question from './Question.tsx';

interface Question {
  text: string;
  image: string;
  answers: string[];
}

// type AnswerState = '' | 'answered' | 'correct' | 'wrong';

function Quiz(): JSX.Element {
  // const [showCorrectImage, setShowCorrectImage] = useState<boolean>(false);
  // const [showWrongImage, setShowWrongImage] = useState<boolean>(false);
  // const [answerState, setAnswerState] = useState<AnswerState>(''); // 유저가 답을 선택했는지 상태 (초기값은 빈 값.)
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]); //유저가 선택한 답들
  const activeQuestionIndex = userAnswers.length; // 몇 번째 문제를 보여줄 지 index번호 (최소한의 useState로 최대한의 상태 가져오는 것: 최적화)/ 만약 해당 페이지에서 답 선택했으면 배열-1을 해서 아직 이 페이지에 머물게 해야함(결과 보여주기 위해).
  // 유저에게 보여지는 답변을 섞기: 복사본을 만들어야(원본은 유지) 정답 여부를 확인할 수 있음.
  const quizIsComplete = activeQuestionIndex === QUSETIONS.length;

  const handleSelectAnswer = useCallback(function handleSelectAnswer(
    selectedAnswer: string | null
  ): void {
    // if (answerState !== '') return; // 이미 선택 상태일 때는 추가 클릭 방지
    setUserAnswers((prevUserAnswers) => {
      const newAnswers = [...prevUserAnswers, selectedAnswer];
      return newAnswers;
    });
  }, []);
  // const handleSkipAnswer = useCallback((): void => handleSelectAnswer(null), [handleSelectAnswer]);

  if (quizIsComplete) {
    return <QuizResult />;
  }
  return (
    <>
      <Question
        key={activeQuestionIndex}
        Index={activeQuestionIndex}
        onSelectAnswer={handleSelectAnswer}
        // onSkipAnswer={handleSkipAnswer}
      />
      {/* </div> */}
      {/* </div> */}
    </>
  );
}

export default Quiz;

//문제: 답을 눌렀을 때 이미지가 뜨지 않음 + 2초에 한번씩 버튼이 재랜더링 됨...ㅎ 2초에 한번씩
//버튼 재렌더링 문제:
// shuffledAnswers가 컴포넌트 렌더링마다 새로 생성되어 섞이고 있습니다.
// 한 번 섞은 답안은 고정되어야 합니다.

//문제:"Cannot access 'shuffledAnswers' before initialization" 오류"
// 기존 코드에서는 shuffledAnswers 변수를 정의하면서 동시에 그 변수를 사용하려고 했습니다.
//useMemo: answers라는 새 변수를 만들어 배열을 복사, return.

//오류: react-router-dom.js?v=f36f18ed:5697 React Router caught the following error during render Error: Rendered fewer hooks than expected. This may be caused by an accidental early return statement.
// "Rendered fewer hooks than expected"(예상보다 적은 훅이 렌더링됨)이라는 중요한 React 훅 규칙 위반을 나타냅니다.
//조건부로 훅을 호출하거나 컴포넌트가 일찍 반환되어 일부 훅이 실행되지 않을 때 발생합니다. React 훅은 항상 동일한 순서로 호출되어야 함.
// if (quizIsComplete) {
//   return <QuizResult />;
// }
// 이 return 후에 useMemo 훅이 호출되려고 함

// 오류: Unexpected Application Error! Cannot read properties of undefined (reading 'answers')
// shuffledAnswers -> useMemo()에서 퀴즈가 완료되었거나 인덱스가 유효하지 않은 경우 빈 배열 반환 먼저 놔둠.
// Ref를 사용하여 조건을 달아준다!!! (Ref는 리랜더링 안되는 객체임!!!)

//key={activeQuestionIndex}를 사용하여, key값이 바뀔 때마다 해당 컴포넌트가 재랜더링될 수 있도록 함.

// Progress가 여러 개 생성됨: Progress와 Answers 컴포넌트의 key가 동일하기 때문임 => key가 동일한 것을 하난의 컴포넌트로 만들어서 key를 하나만 사용하도록 함.
