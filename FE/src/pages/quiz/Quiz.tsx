import QuizResult from './QuizResult';
import { useState, useCallback } from 'react';
import QUSETIONS from './questions.ts';
import Question from './Question.tsx';

interface Question {
  text: string;
  image: string;
  answers: string[];
}

function Quiz(): JSX.Element {
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]); //유저가 선택한 답들
  const activeQuestionIndex = userAnswers.length; //key값으로 최적화

  const quizIsComplete = activeQuestionIndex === QUSETIONS.length;

  const handleSelectAnswer = useCallback(function handleSelectAnswer(
    selectedAnswer: string | null
  ): void {
    setUserAnswers((prevUserAnswers) => {
      const newAnswers = [...prevUserAnswers, selectedAnswer];
      return newAnswers;
    });
  }, []);

  if (quizIsComplete) {
    return <QuizResult />;
  }
  return (
    <>
      <Question
        key={activeQuestionIndex}
        Index={activeQuestionIndex}
        onSelectAnswer={handleSelectAnswer}
      />
    </>
  );
}

export default Quiz;
