import QuizResult from './QuizResult';
import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Question from './Question.tsx';
import { useQuizQuestions } from '@/hooks/apiHooks';

function Quiz() {
  const [userAnswers, setUserAnswers] = useState<(boolean | null)[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const useCamera = queryParams.get('useCamera') === 'true';

  // useQuizQuestions 훅 사용
  const { data: quizData, isLoading, error } = useQuizQuestions(useCamera); // 확인하기
  const activeQuestionIndex = userAnswers.length;

  const quizIsComplete = quizData && activeQuestionIndex === quizData.length; // 확인하기

  const handleSelectAnswer = useCallback((selectedAnswer: boolean | null): void => {
    const newAnswers = setUserAnswers((prevUserAnswers) => [...prevUserAnswers, selectedAnswer]);
    console.log('New answers:', newAnswers);
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
