import apiClient from '@/api/apiClient';
import { QuizResponse, QuestionData, FrontendQuestionData } from '@/types/quizTypes';
import { quizMockData } from '@/pages/quiz/questions';

const isDevelopment = import.meta.env.MODE === 'development';

const useMockData = () => {
  try {
    const storedValue = localStorage.getItem('useMockData');
    if (storedValue !== null) {
      return storedValue === 'true';
    }
    return isDevelopment;
  } catch {
    return isDevelopment;
  }
};

// 서버 응답 데이터를 프론트엔드 형식으로 변환
const transformQuizData = (data: QuestionData[]): FrontendQuestionData[] => {
  return data.map((question) => ({
    id: question.question_id,
    text: question.question_text,
    type: question.question_type,
    gestureUrl: question.gesture_url,
    options: question.options.map((option) => ({
      id: option.option_id,
      meaning: option.option_meaning,
      gestureId: option.gesture_id,
      gestureImage: option.gesture_image,
    })),
    answer: {
      id: question.answer.answer_id,
      correctOptionId: question.answer.answer_option_id,
      correctGestureName: question.answer.correct_gesture_name,
    },
  }));
};

// 퀴즈 문제 가져오기
export const getQuizQuestions = async (useCamera: boolean): Promise<FrontendQuestionData[]> => {
  if (useMockData()) {
    // 개발 환경에서는 목 데이터 사용
    await new Promise((resolve) => setTimeout(resolve, 300));
    return transformQuizData(quizMockData);
  }

  try {
    // 실제 API 엔드포인트와 파라미터에 맞게 호출
    const params = new URLSearchParams();
    params.append('type', 'GESTURE');
    params.append('type', 'MEANING');
    if (useCamera) {
      params.append('type', 'CAMERA');
    }

    const { data } = await apiClient.get<QuizResponse>(`/api/quiz?${params.toString()}`);

    // 서버 응답을 프론트엔드 형식으로 변환
    return transformQuizData(data.data);
  } catch (error) {
    console.error('퀴즈 데이터를 가져오는 중 오류 발생:', error);

    if (error.response) {
      // API 에러 응답 구조에 맞게 처리
      const { status, data } = error.response;
      if (status === 404 && data.error === 'QUIZZES_NOT_FOUND') {
        throw new Error('충분한 퀴즈 문제를 찾을 수 없습니다.');
      }
      if (status === 400 && data.error === 'INVALID_PARAMETER') {
        throw new Error('잘못된 파라미터입니다.');
      }
    }

    // 기타 네트워크 오류 등
    throw new Error('퀴즈 데이터를 불러오는 중 오류가 발생했습니다.');
  }
};

// 카메라로 촬영한 제스처 인식 (mock)
export const detectGesture = async (imageData: string): Promise<{ gesture: string }> => {
  if (useMockData()) {
    // 개발 환경에서는 랜덤 제스처 반환
    const gestures = ['thumbs_up', 'victory', 'ok', 'pardon', 'money'];
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { gesture: gestures[Math.floor(Math.random() * gestures.length)] };
  }

  try {
    // 실제 API 호출 (구현 예정)
    const { data } = await apiClient.post('/api/gestures/detect', { image: imageData });
    return data;
  } catch (error) {
    console.error('제스처 인식 중 오류 발생:', error);
    throw new Error('제스처 인식에 실패했습니다.');
  }
};
