import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList } from '@fortawesome/free-regular-svg-icons';

// Dictionary.tsx에서 정의된 타입 사용
type Country = {
  code: string;
  name: string;
};

interface HeaderProps {
  title: string;
  country?: Country; // 국가 관련 정보
  showCompareGuide?: boolean; // 비교 가이드 버튼 표시 여부
  className?: string;
}

function DictHeader({ title, country, showCompareGuide = false, className }: HeaderProps) {
  // 국기 이미지 경로 생성
  const getFlagPath = (country?: Country) => {
    if (!country) return undefined;
    return `/images/flags/${country.code}.png`;
  };

  return (
    <header
      className={`w-full h-[60px] mt-[20px] px-[24px] py-1 flex justify-center items-center bg-white rounded-lg drop-shadow-basic ${className || ''}`}
    >
      <div className="flex justify-center items-center flex-1">
        {/* 국기 있을 때 */}
        {country && (
          <img
            src={getFlagPath(country)}
            alt={`${country.name} flag`}
            className="w-[65px] h-[40px] mr-4 object-cover drop-shadow-basic"
          />
        )}
        <h1 className="text-[32px] font-[NanumSquareRoundEB] text-center">{title}</h1>
      </div>

      {/* 비교 가이드 버튼 있을 때 */}
      {showCompareGuide && (
        <button className="absolute flex items-center right-4 px-3 py-2 text-[15px] bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors rounded-lg">
          <FontAwesomeIcon icon={faRectangleList} className="mr-1.5" />
          <span className="font-[NanumSquareRound]">나라별 비교 가이드</span>
        </button>
      )}
    </header>
  );
}

export default DictHeader;
