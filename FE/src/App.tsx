import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import Dictionary from './pages/dict/Dictionary';
import Home from './pages/home/Home';
// import ModelTest from './pages/test/modeltest';
import Quiz from './pages/quiz/QuizStart';
import QuizContent from './pages/quiz/Quiz';
import Result from './pages/result/Result';
import CompareGuide from './pages/dict/CompareGuide';
import GestureDetail from './pages/dict/GestureDetail';
import GesturePractice from './pages/dict/GesturePractice';
import ModeToggle from './components/ModeToggle';
import OfflineIndicator from './components/OfflineIndicator';
import './pwa';
import ErrorPage from './components/ErrorPage';
import { getHandLandmarker } from './utils/handLandmarkerSingleton';

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
      // {
      //   // 퀴즈 컨텐츠
      //   path: 'modeltest',
      //   element: <ModelTest />,
      // },
      // 에러페이지
      {
        path: 'url-error',
        element: <ErrorPage />,
      },
      // 404 페이지 - 모든 매칭되지 않는 경로에 대해
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

function App() {
  useEffect(() => {
    // 앱 로드 시 모델 미리 로딩
    getHandLandmarker().then(() => {
      console.log("HandLandmarker 미리 로딩 완료");
    });
    
    // 서비스 워커 정리 로직
    async function cleanupServiceWorkers() {
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          
          if (registrations.length > 1) {
            console.log(`${registrations.length}개의 서비스 워커 발견, 정리 시작...`);
            
            // 첫 번째는 남기고 나머지 제거
            const allRegistrations = [...registrations];
            for (let i = 1; i < allRegistrations.length; i++) {
              await allRegistrations[i].unregister();
              console.log(`서비스 워커 정리됨: ${allRegistrations[i].scope}`);
            }
            
            console.log('서비스 워커 정리 완료');
          }
        } catch (error) {
          console.error('서비스 워커 정리 중 오류 발생:', error);
        }
      }
    }
    
    // 서비스 워커 정리 함수 호출
    cleanupServiceWorkers();
    
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

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