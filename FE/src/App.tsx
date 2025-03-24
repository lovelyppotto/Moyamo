import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import Layout from './components/Layout';
import Dictionary from './pages/dict/Dictionary';
import Home from './pages/home/Home';
import AiQuiz from './pages/quiz/ai_quiz/AiQuiz';
import GestureQuiz from './pages/quiz/gesture_quiz/GestureQuiz';
import MeaningQuiz from './pages/quiz/meaning_quiz/MeaningQuiz';
import Quiz from './pages/quiz/QuizStart';
import Result from './pages/result/Result';
import GestureDetail from './pages/dict/GestureDetail';
import GesturePractice from './pages/dict/GesturePractice';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // 공통 레이아웃
    children: [
      {
        // 홈
        index: true, // 기본 경로 (/)
        element: <Home />,
      },
      {
        // 검색 결과
        path: 'search',
        element: <Result />,
      },
      {
        // 딕셔너리
        path: 'dictionary',
        children: [
          // 딕셔너리 메인
          {
            index: true,
            element: <Dictionary />,
          },
          // 제스처 상세 페이지
          {
            path: 'detail',
            element: <GestureDetail />,
          },
          // 제스처 연습 페이지
          {
            path: 'practice',
            element: <GesturePractice />,
          },
          // 나라별 비교 가이드
        ],
      },
      {
        // 퀴즈
        path: 'quiz',
        element: <Quiz />,
      },
      {
        // meaning 퀴즈(페이지 확인용)
        path: 'meaningquiz',
        element: <MeaningQuiz />,
      },
      {
        // gesture 퀴즈(페이지 확인용)
        path: 'gesturequiz',
        element: <GestureQuiz />,
      },
      {
        // ai 퀴즈(페이지 확인용)
        path: 'aiquiz',
        element: <AiQuiz />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="h-screen overflow-hidden">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}
export default App;
