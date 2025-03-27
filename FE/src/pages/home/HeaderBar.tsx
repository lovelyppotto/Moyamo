import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import { ChevronDown } from 'lucide-react';
import DarkModeLottie from './DarkModeLottie';
import BaseDropdown from './BaseDropdown';
import GestureSearchInput from '../../components/GestureSearch';
import { ResultMockData } from '../result/resultMock';

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
  const location = useLocation();
  const [searchResults, setSearchResults] = useState<ResultMockData[]>([]);
  const logoSrc = theme === 'dark' ? './images/logo-dark.png' : './images/logo.png';

  // URL에서 검색 조건 가져오기
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gestureName = params.get('gesture_name') || '';
    const country = params.get('country') || '전체';

    // GestureSearchInput에서 이미 URL 변경에 대응하는 useEffect가 있으므로
    // 여기서는 검색 결과 상태만 업데이트하면 됩니다
    if (gestureName) {
      // performSearch 함수를 여기서 재구현하지 않고, onSearch 콜백으로 결과를 받습니다
      console.log(`URL에서 검색 조건 변경 감지: ${gestureName}, ${country}`);
    }
  }, [location.search]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSearch = (results: ResultMockData[]) => {
    setSearchResults(results);
    console.log('검색 결과:', results);

    // 다른 컴포넌트에서 검색 결과를 사용할 수 있도록 상태를 업데이트합니다
    // 필요에 따라 Context API나 상태 관리 라이브러리를 사용할 수 있습니다
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
              <GestureSearchInput onSearch={handleSearch} />
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
