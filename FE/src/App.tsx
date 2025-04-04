import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import Dictionary from './pages/dict/Dictionary';
import Home from './pages/home/Home';
import ModelTest from './pages/test/modeltest';
import Quiz from './pages/quiz/QuizStart';
import QuizContent from './pages/quiz/Quiz';
import Result from './pages/result/Result';
import CompareGuide from './pages/dict/CompareGuide';
import GestureDetail from './pages/dict/GestureDetail';
import GesturePractice from './pages/dict/GesturePractice';
import ModeToggle from './components/ModeToggle';
import OfflineIndicator from './components/OfflineIndicator';
import './pwa';

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
        // 카메라 검색 결과
        path: 'search/camera',
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
          // 나라별 비교 가이드
          {
            path: 'compare',
            element: <CompareGuide />,
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
        ],
      },
      {
        // 퀴즈
        path: 'quiz',
        element: <Quiz />,
      },
      {
        // 퀴즈 컨텐츠
        path: 'quizcontent',
        element: <QuizContent />,
      },
      {
        // 퀴즈 컨텐츠
        path: 'modeltest',
        element: <ModelTest />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="h-[100dvh] overflow-hidden relative">
      <Toaster />
      <OfflineIndicator />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="absolute bottom-4 left-4 z-50">
          <ModeToggle />
        </div>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}
export default App;
