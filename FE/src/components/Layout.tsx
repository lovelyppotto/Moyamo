import { faArrowLeft, faDoorOpen, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isResultPage = location.pathname === '/search';
  const isQuizPage = location.pathname === '/quiz';
  const isQuizPage2 =
    location.pathname === '/gesturequiz' ||
    location.pathname === '/aiquiz' ||
    location.pathname === '/meaningquiz';
  const isDictPage = location.pathname.includes('/dictionary');

  const handleBack = () => {
    navigate(-1);
  };

  // 패딩 적용하지 않는 페이지
  const noPaddingPage = isHomePage || isResultPage || isDictPage || isQuizPage || isQuizPage2;

  // Result 페이지는 배경색 적용 안 함 (배경 이미지가 있으므로)
  const bgStyle = isResultPage ? {} : { backgroundColor: '#f5f5f5' };

  return (
    <div className="relative flex flex-col h-screen w-full h-full overflow-hidden" style={bgStyle}>
      {/* 뒤로 가기 버튼 - result, dict 페이지*/}
      {isResultPage && (
        <button className="absolute top-4 left-4 z-10 dark:text-white" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      )}
      {/* 뒤로 가기 버튼 - quiz 페이지*/}
      {isQuizPage && (
        <>
          <button className="absolute top-4 left-4 z-10 cursor-pointer" onClick={handleBack}>
            <FontAwesomeIcon
              icon={faDoorOpen}
              className="text-xl md:text-2xl lg:text-3xl text-white"
            />
          </button>
          {/* 함수: 누를 때마다 볼륨 상태 바뀌도록! */}
          <button className="absolute top-4 right-4 z-10 cursor-pointer">
            <FontAwesomeIcon
              icon={faVolumeHigh}
              className="text-xl md:text-2xl lg:text-3xl  text-white"
            />
          </button>
        </>
      )}
      {isQuizPage2 && (
        <>
          <button className="absolute top-4 left-4 z-10" onClick={handleBack}>
            <FontAwesomeIcon
              icon={faDoorOpen}
              className="text-xl md:text-2xl lg:text-3xl "
            />
          </button>
          {/* 함수: 누를 때마다 볼륨 상태 바뀌도록! */}
          <button className="absolute top-4 right-4 z-10">
            <FontAwesomeIcon
              icon={faVolumeHigh}
              className="text-xl md:text-2xl lg:text-3xl  "
            />
          </button>
        </>
      )}
      {/* 메인 컨텐츠 - 홈에는 적용X */}
      <main className={`w-full flex-1 ${noPaddingPage ? '' : 'px-6 md:px-8 lg:px-12'}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
