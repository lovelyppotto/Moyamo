import { faArrowLeft, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Outlet, useLocation } from 'react-router-dom';

function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isResultPage = location.pathname === '/result';
  const isDictPage = location.pathname === '/dictionary';
  const isQuizPage = location.pathname === '/quiz.';

  // 패딩 적용하지 않는 페이지
  const noPaddingPage = isHomePage || isResultPage;

  return (
    <div className="relative flex flex-col bg-[#f5f5f5]">
      {/* 뒤로 가기 버튼 - result, dict 페이지*/}
      {(isDictPage || isResultPage) && (
        <button className="absolute top-4 left-4 z-10">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      )}
      {/* 뒤로 가기 버튼 - quiz 페이지*/}
      {isQuizPage && (
        <button className="absolute top-4 left-4 z-10">
          <FontAwesomeIcon icon={faDoorOpen} />
        </button>
      )}
      {/* 메인 컨텐츠 - 홈에는 적용X */}
      <main className={`w-full ${noPaddingPage ? '' : 'px-6 md:px-8 lg:px-12'}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
