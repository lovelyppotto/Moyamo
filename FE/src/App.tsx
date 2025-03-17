import Layout from './components/Layout';
import Home from './pages/Home';
import Result from './pages/Result';
import Dictionary from './pages/Dictionary';
import Quiz from './pages/Quiz';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
  return <RouterProvider router={router} />;
}

export default App;
