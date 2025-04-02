import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import DarkModeLottie from './DarkModeLottie';
import GestureSearchInput from '../../components/GestureSearch';
import { getLogoImage } from '@/utils/imageUtils';
import { useState, useEffect } from 'react';

// 메인 HeaderBar 컴포넌트
function HeaderBar() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const logoSrc = theme === 'dark' ? `${getLogoImage('logo-dark')}` : `${getLogoImage('logo')}`;
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // 화면 크기에 따라 모바일 여부 감지
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 610);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
  };

  return (
    <div className="relative w-full z-30">
      {/* 로고 */}
      <button
        className="absolute cursor-pointer
        left-[7%] top-[28px] sm:left-[6%] sm:top-[23px] md:left-[14.5%] md:top-[17px] lg:left-[13.5%] lg:top-[px]"
      >
        <img
          src={logoSrc}
          alt="MoyamoLogo"
          className="w-24 h-9 sm:w-27 sm:h-10 md:w-32 md:h-12 lg:w-40 lg:h-14 select-none"
          onClick={handleLogoClick}
          draggable="false"
        />
      </button>

      {/* 헤더 메인 컨테이너 */}
      <div className="w-full flex justify-center mt-11 mb-5 py-4 px-2 md:px-6">
        {/* 모바일 뷰 */}
        {isMobile ? (
          <div className="w-[90%] flex items-center justify-between bg-white dark:bg-white/15 px-3 rounded-xl shadow-sm">
            {/* 검색 아이콘 (모바일에서는 토글 형태) */}
            <button onClick={toggleSearch} className="text-gray-500 dark:text-white p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* 다크모드 토글 */}
            <div className="ml-auto">
              <DarkModeLottie />
            </div>
          </div>
        ) : (
          // 데스크탑 뷰
          <div className="w-[75%] flex items-center bg-white dark:bg-white/15 py-2 px-6 rounded-xl shadow-sm">
            {/* 검색 인풋 컴포넌트 */}
            <div className="flex-1">
              <GestureSearchInput />
            </div>

            {/* 다크모드 토글 및 언어 선택 */}
            <div className="ml-3 flex items-center">
              <DarkModeLottie />
            </div>
          </div>
        )}
      </div>

      {/* 모바일 검색창 (확장 시) */}
      {isMobile && isSearchActive && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-30 z-50 flex items-start justify-center pt-20">
          <div className="w-[90%] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="flex-1">
                <GestureSearchInput />
              </div>
              <button onClick={toggleSearch} className="ml-2 text-gray-500 dark:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderBar;
