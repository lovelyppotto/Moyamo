import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DictCountrySelector from './DictCountrySelector';

// Dictionary.tsx에서 정의된 타입 사용
type Country = {
  code: string;
  name: string;
};

interface HeaderProps {
  title?: string; // 제목
  country?: Country; // 국가 관련 정보
  showCompareGuide?: boolean; // 비교 가이드 버튼 표시 여부
  className?: string;
  // 드롭다운 관련 속성
  showCountrySelector?: boolean; // 국가 선택 드롭다운 표시 여부
  selectedCountry?: Country;
  onSelectCountry?: (country: Country) => void;
  countryOptions?: Country[];
}

function DictHeader({
  title,
  country,
  showCompareGuide = false,
  className,
  showCountrySelector = false,
  selectedCountry,
  onSelectCountry,
  countryOptions = [],
}: HeaderProps) {
  const navigate = useNavigate();

  // 국가 선택 핸들러
  const handleCountrySelect = (country: Country) => {
    if (onSelectCountry) {
      onSelectCountry(country);
    } else {
      console.log('국가 선택 핸들러가 제공되지 않았습니다.');
    }
  };

  // 국기 이미지 경로 생성
  const getFlagPath = (country?: Country) => {
    if (!country) return undefined;
    return `/images/flags/${country.code}.png`;
  };

  // 뒤로가기
  const handleGoBack = () => {
    window.history.back();
  };

  // 비교 가이드 페이지로 이동
  const handleGuideClick = () => {
    navigate('/dictionary/guide');
  };

  return (
    <header
      className={`w-[95%] h-[65px] mx-auto mt-[24px] px-[24px] py-1 flex justify-center items-center bg-white rounded-lg drop-shadow-basic dark:bg-gray-500 dark:text-d-txt-50 ${className || ''}`}
    >
      <div>
        <button className="cursor-pointer" onClick={handleGoBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>

      {/* 가운데 - 제목 또는 국가 선택 드롭다운 */}
      <div className="flex justify-center items-center flex-1">
        {/* 제목 표시할 때 */}
        {!showCountrySelector && (
          <>
            {country && (
              <img
                src={getFlagPath(country)}
                alt={`${country.name} flag`}
                className="w-[65px] h-[40px] mr-4 object-cover drop-shadow-nation"
              />
            )}
            <h1 className="text-[32px] font-[NanumSquareRoundEB] text-center">{title}</h1>
          </>
        )}

        {/* 국가 선택 드롭다운 표시*/}
        {showCountrySelector && selectedCountry && (
          <div className="flex justify-center">
            <DictCountrySelector
              selectedCountry={selectedCountry}
              onSelectCountry={handleCountrySelect}
              countryOptions={countryOptions}
            />
          </div>
        )}
      </div>
      {/* 오른쪽 - 비교 가이드 버튼 있을 때 */}
      {showCompareGuide && (
        <button
          className="absolute flex items-center right-4 px-3 py-2 text-[15px] bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors rounded-lg"
          onClick={handleGuideClick}
        >
          <FontAwesomeIcon icon={faRectangleList} className="mr-1.5" />
          <span className="font-[NanumSquareRound]">나라별 비교 가이드</span>
        </button>
      )}
    </header>
  );
}

export default DictHeader;
