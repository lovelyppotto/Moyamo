import { faArrowLeft, faDoorOpen, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Outlet, useLocation } from 'react-router-dom';

function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isResultPage = location.pathname === '/result';
  const isDictPage = location.pathname === '/dictionary';
  const isQuizPage = location.pathname === '/quiz';
  const isQuizPage2 =location.pathname === '/gesturequiz'||location.pathname === '/aiquiz'||location.pathname === '/meaningquiz';
  return (
    <div className="relative flex flex-col bg-[#f5f5f5] h-screen">
      {/* 뒤로 가기 버튼 - result, dict 페이지*/}
      {(isDictPage || isResultPage) && (
        <button className="absolute top-4 left-4 z-10">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      )}
      {/* 뒤로 가기 버튼 - quiz 페이지*/}
      {isQuizPage||isQuizPage2 && (
        <>
          <button className="absolute top-4 left-4 z-10">
            <FontAwesomeIcon icon={faDoorOpen} className='text-xl md:text-2xl lg:text-3xl'/>
          </button>
           {/* 함수: 누를 때마다 볼륨 상태 바뀌도록! */}
          <button className="absolute top-4 right-4 z-10">
            <FontAwesomeIcon icon={faVolumeHigh} className='text-xl md:text-2xl lg:text-3xl'/>
          </button>
        </>
      )}      
      {/* 메인 컨텐츠 - 홈에는 적용X */}
      <main className={`w-full ${isHomePage || isQuizPage ? '' : 'px-6 md:px-8 lg:px-12'}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
