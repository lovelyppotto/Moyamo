import QuizResult from './QuizResult';
import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Question from './Question.tsx';
import { useQuizQuestions } from '@/hooks/apiHooks';
// import { FrontendQuestionData } from '@/types/quizTypes';

function Quiz() {
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  // const [useCamera, setUseCamera] = useState<boolean>(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const useCamera = queryParams.get('useCamera') === 'true';

  // useQuizQuestions 훅 사용
  const { data: quizData, isLoading, error } = useQuizQuestions(useCamera); // 확인하기
  const activeQuestionIndex = userAnswers.length;

  const quizIsComplete = quizData && activeQuestionIndex === quizData.length; // 확인하기

  const handleSelectAnswer = useCallback((selectedAnswer: number | null): void => {
    setUserAnswers((prevUserAnswers) => [...prevUserAnswers, selectedAnswer]);
  }, []);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  if (quizIsComplete) {
    return <QuizResult userAnswers={userAnswers} />;
  }

  return (
    <Question
      key={activeQuestionIndex}
      Index={activeQuestionIndex}
      onSelectAnswer={handleSelectAnswer}
      questionData={quizData![activeQuestionIndex]}
    />
  );
}

export default Quiz;
