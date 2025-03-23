import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ChevronDown } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import DarkModeLottie from './DarkModeLottie';
import BaseDropdown from './BaseDropdown';
import { useTheme } from '@/components/theme-provider';

// 번역 국가/언어 정보 인터페이스
interface TranslationLanguage {
  code: string;
  name: string;
  flagUrl: string;
}

// 번역 언어 데이터
const translationLanguages: Record<string, TranslationLanguage> = {
  KOR: {
    code: 'kr',
    name: 'KOR',
    flagUrl: '/images/flags/kr.png',
  },
  'EN-US': {
    code: 'us',
    name: 'EN-US',
    flagUrl: '/images/flags/us.png',
  },
  CN: {
    code: 'cn',
    name: 'CN',
    flagUrl: '/images/flags/cn.png',
  },
  JPN: {
    code: 'jp',
    name: 'JPN',
    flagUrl: '/images/flags/jp.png',
  },
};

// 언어 코드 목록
const languageCodes = Object.keys(translationLanguages);

// 번역 언어 드롭다운 컴포넌트
function TranslationDropdown() {
  const [selectedLanguage, setSelectedLanguage] = useState('KOR');

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    // 번역 로직 추가 예정
    console.log(`언어 상태: ${language}`);
  };

  return (
    <BaseDropdown
      selected={selectedLanguage}
      options={languageCodes}
      onSelect={handleLanguageSelect}
      label="번역 언어"
    >
      <div className="flex items-center cursor-pointer dark:text-d-txt-50">
        <img
          src={translationLanguages[selectedLanguage].flagUrl}
          alt={`${selectedLanguage} 국기`}
          className="w-6 h-6 mr-2 drop-shadow-nation rounded-full object-cover"
        />
        <img src="" alt="" />
        <span className="font-[NanumSquareRoundB] text-lg">{selectedLanguage}</span>
        <ChevronDown size={18} className="ml-1" />
      </div>
    </BaseDropdown>
  );
}

// 메인 HeaderBar 컴포넌트
function HeaderBar() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchCountry, setSearchCountry] = useState('전체');
  const countries = ['전체', '한국', '미국', '중국', '일본', '이탈리아'];
  const logoSrc = theme === 'dark' ? './images/logo-dark.png' : './images/logo.png';

  const handleLogoClick = () => {
    navigate('/');
  }

  return (
    <div className="relative w-full">
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
      <div className="w-full flex justify-center mt-11 mb-10 py-4 px-6">
        <div className="dark:text-d-txt-50/80 w-[75%] bg-white dark:bg-white/15 py-1 px-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            {/* 검색 카테고리 선택 */}
            <div className="flex items-center flex-1">
              <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" className="mr-3" />
              <BaseDropdown
                selected={searchCountry}
                options={countries}
                label="검색 국가"
                onSelect={setSearchCountry}
              />

              {/* 검색창 */}
              <div className="flex items-center w-full ml-2 mr-2">
                <div className="relative flex-1 min-w-[70%]">
                  <input
                    className="w-full h-10 px-2 
                    border-b border-gray-400 focus:outline-none
                    dark:border-d-txt-50/80
                    dark:text-d-txt-50/90
                    font-[NanumSquareRound]"
                    placeholder="검색어를 입력하세요"
                  />
                </div>
                <div className="ml-3 flex items-center justify-center">
                  <Camera className="w-6 h-6 cursor-pointer" />
                </div>
              </div>
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
