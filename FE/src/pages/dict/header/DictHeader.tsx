import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import DictCountrySelector from './DictCountrySelector';
import { Country } from '@/types/dictionaryType';
import { getFlagImage } from '@/utils/imageUtils';
import { useCountryCode } from '@/hooks/useCountryCode';
import { GestureDetail } from '@/types/dictDetailType';
import { getLogoImage } from '@/utils/imageUtils';
import { useTheme } from 'next-themes';

// DictHeader 컴포넌트 prop 타입
interface DictHeaderProps {
  title?: string; // 제목
  gestureCompareInfo?: GestureDetail; // 국가 관련 정보
  showCompareGuide?: boolean; // 비교 가이드 버튼 표시 여부
  className?: string; // 드롭다운 관련 속성
  showCountrySelector?: boolean; // 국가 선택 드롭다운 표시 여부
  selectedCountry?: Country;
  onSelectCountry?: (country: Country) => void;
  countryOptions?: Country[];
}

function DictHeader({
  title,
  gestureCompareInfo,
  showCompareGuide = false,
  className,
  showCountrySelector = false,
  selectedCountry,
  onSelectCountry,
  countryOptions = [],
}: DictHeaderProps) {
  const navigate = useNavigate();
  const getCountryCode = useCountryCode();
  const countryCode = getCountryCode(gestureCompareInfo?.countryName);
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? `${getLogoImage('logo-dark')}` : `${getLogoImage('logo')}`;

  // 국가 선택 핸들러
  const handleCountrySelect = (country: Country) => {
    if (onSelectCountry) {
      onSelectCountry(country);
    } else {
      console.log('국가 선택 핸들러가 제공되지 않았습니다.');
    }
  };

  // 뒤로가기
  const handleGoBack = () => {
    // 현재 URL 확인
    const currentPath = window.location.pathname;

    // Dictionary 메인 페이지(목록 페이지)인 경우 홈으로 이동
    if (currentPath === '/dictionary') {
      navigate('/');
    } else {
      window.history.back();
    }
  };

  // 비교 가이드 페이지로 이동
  const handleGuideClick = () => {
    navigate(`/dictionary/compare?gesture_id=${gestureCompareInfo?.gestureId}`);
  };

  // 로고 클릭 시 홈으로 이동
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header
      className={`w-[95%] h-[65px] mx-auto mt-[24px] px-[24px] grid grid-cols-3 gap-1 bg-white rounded-lg drop-shadow-basic dark:bg-gray-500 dark:text-d-txt-50 overflow-hidden ${className || ''}`}
      style={{ height: '65px' }}
    >
      <div className="col-span-1 flex justify-start items-center">
        <button className="cursor-pointer" onClick={handleGoBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>

      {/* 가운데 - 제목 또는 국가 선택 드롭다운 */}
      <div className="flex justify-center items-center col-span-1">
        {/* 제목 표시할 때 */}
        {!showCountrySelector && (
          <div className="flex items-center w-full justify-center h-[40px]">
            {gestureCompareInfo && (
              <img
                src={getFlagImage(countryCode)}
                alt={`${gestureCompareInfo.countryName} flag`}
                className="w-[65px] h-[40px] mr-4 object-cover drop-shadow-nation"
                draggable="false"
              />
            )}
            <h1 className="text-[20px] md:text-[24px] xl:text-[32px] font-[NanumSquareRoundEB] text-center">
              {title}
            </h1>
          </div>
        )}

        {/* 국가 선택 드롭다운 표시*/}
        {showCountrySelector && selectedCountry && (
          <div className="flex justify-center items-center cursor-pointer py-0">
            <DictCountrySelector
              selectedCountry={selectedCountry}
              onSelectCountry={handleCountrySelect}
              countryOptions={countryOptions}
            />
          </div>
        )}
      </div>
      {/* 오른쪽 - 비교 가이드 버튼 있을 때 */}

      {/* 홈버튼 */}
      <div className="flex  col-span-1 justify-end items-center gap-1">
        {showCompareGuide && (
          <button
            className="flex items-center right-4 px-3 py-2 text-[13px] sm:text-[15px] bg-gray-200 text-gray-600
           hover:bg-gray-300 transition-colors rounded-xl cursor-pointer mr-3 lg:mr-3"
            onClick={handleGuideClick}
          >
            <FontAwesomeIcon icon={faRectangleList} className="mr-0.5 sm:mr-1.5" />
            <span className="hidden sm:inline font-[NanumSquareRound]">비교 가이드</span>
          </button>
        )}
        <div className="w-[60px] sm:w-[80px] md:w-[90px] lg:w-[100px] h-[30px] sm:h-[35px] md:h-[38px] lg:h-[40px]">
          <img
            src={logoSrc}
            alt="MoyamoLogo"
            className="w-full h-full object-contain select-none cursor-pointer"
            onClick={handleLogoClick}
            draggable="false" // 드래그 방지
          />
        </div>
      </div>
    </header>
  );
}

export default DictHeader;
