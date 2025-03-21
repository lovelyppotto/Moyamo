import Layout from './components/Layout';
import Home from './pages/home/Home';
import Result from './pages/result/Result';
import Dictionary from './pages/dict/Dictionary';
import Quiz from './pages/quiz/Quiz';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';

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
        path: 'result',
        element: <Result />,
      },
      {
        // 딕셔너리
        path: 'dictionary',
        element: <Dictionary />,
      },
      {
        // 퀴즈
        path: 'quiz',
        element: <Quiz />,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}
export default App;
