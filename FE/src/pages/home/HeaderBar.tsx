import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import DarkModeLottie from './DarkModeLottie';
import GestureSearchInput from '../../components/GestureSearch';
import TranslationDropdown from './dropdowns/TranslateDropdown';

// 메인 HeaderBar 컴포넌트
function HeaderBar() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const logoSrc = theme === 'dark' ? './images/logo-dark.png' : './images/logo.png';

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="relative w-full z-30">
      <button
        className="absolute cursor-pointer
        left-[15%] top-[35px] md:left-[14.5%] md:top-[12px] lg:left-[13.5%] lg:top-[5px]"
      >
        <img
          src={logoSrc}
          alt="MoyamoLogo"
          className="w-25 h-10 md:w-32 md:h-13 lg:w-40 lg:h-15 user-select-none"
          onClick={handleLogoClick}
          draggable="false" // 드래그 방지
        />
      </button>
      <div className="w-full flex justify-center mt-11 mb-5 py-4 px-6">
        <div className="dark:text-d-txt-50/80 w-[75%] bg-white dark:bg-white/15 py-1 px-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            {/* 검색 인풋 컴포넌트 */}
            <div className="flex-1">
              <GestureSearchInput />
            </div>

            {/* 다크모드 토글 및 언어 선택 */}
            <div className="flex items-center ml-6">
              <DarkModeLottie />
              <TranslationDropdown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderBar;
