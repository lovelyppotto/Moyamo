import { faArrowLeft, faDoorOpen, faVolumeHigh, faVolumeOff, faVolumeLow} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isResultPage = location.pathname === '/search';
  const isQuizPage = location.pathname === '/quiz';
  const isQuizPage2 = location.pathname === '/quizcontent';
 
  const isDictPage = location.pathname.includes('/dictionary');
  const volumeHight = <FontAwesomeIcon icon={faVolumeHigh} className="text-xl md:text-2xl lg:text-3xl  "/>
  const volumeOff = <FontAwesomeIcon icon={faVolumeOff} className="text-xl md:text-2xl lg:text-3xl  "/>
  const volumeLow = <FontAwesomeIcon icon={faVolumeLow} className="text-xl md:text-2xl lg:text-3xl  "/>
  const volumeList = [ volumeHight, volumeLow, volumeOff]
  const [index, setIndex] = useState(0); //// 볼륨 상태 index
  
  const handleBack = () => {
    navigate(-1);
  };
  const handleHome = () => {
    navigate("/");
  };
  // 볼륨 상태가 바뀌는 함수: 1)아이콘 바뀌기 2)실제 소리 받아오기 3) 상태저장
  const handleVolume = () => {
    setIndex((index+1)%3) //0,1,2
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
          <button className="absolute top-4 right-4 z-10 cursor-pointer text-white" onClick={handleVolume}>
            {volumeList[index]}
          </button>
        </>
      )}
      {/* isQuizPage2는 게임 진행 페이지: 이전으로 돌아가는게 아니라 홈으로 돌아감. 검은 색.  */}
      {isQuizPage2 && (
        <>
          <button className="absolute top-4 left-4 z-10 cursor-pointer" onClick={handleHome}>
            <FontAwesomeIcon
              icon={faDoorOpen}
              className="text-xl md:text-2xl lg:text-3xl "
            />
          </button>
          <button className="absolute top-4 right-4 z-10 cursor-pointer" onClick={handleVolume}>
            {volumeList[index]}
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
