import QuizResult from './QuizResult';
import { useState, useCallback } from 'react';
import QUESTIONS from './questions.ts';
import Question from './Question.tsx';

// 실제 데이터 구조에 맞게 인터페이스 수정
interface QuestionData {
  question_id: number;
  question_text: string;
  question_type: 'MEANING' | 'GESTURE' | 'CAMERA';
  question_image?: string;
  options: Array<{
    option_id: number;
    option_meaning?: string;
    gesture_image?: string;
  }>;
  answer: {
    answer_id: number;
    correct_option_id: number;
    correct_meaning?: string;
    correct_gesture_id?: number;
  };
}

interface QuestionsResponse {
  status: number;
  data: QuestionData[];
}

function Quiz(): JSX.Element {
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]); // number로 변경
  const activeQuestionIndex = userAnswers.length;

  const quizIsComplete = activeQuestionIndex === QUESTIONS[0].data.length;

  const handleSelectAnswer = useCallback((selectedAnswer: number | null): void => {
    setUserAnswers((prevUserAnswers) => [...prevUserAnswers, selectedAnswer]);
  }, []);

  if (quizIsComplete) {
    return <QuizResult userAnswers={userAnswers} />;
  }

  return (
    <Question
      key={activeQuestionIndex}
      Index={activeQuestionIndex}
      onSelectAnswer={handleSelectAnswer}
    />
  );
}

export default Quiz;
