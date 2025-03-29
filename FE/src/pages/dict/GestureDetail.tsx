import DictHeader from './DictHeader';
import { Country } from '@/types/dictionaryType';
import '@/components/ui/scrollbar.css';
import { useLocation } from 'react-router-dom';
import { useCountryStyles } from '@/hooks/useCountryStyles';

function GestureDetail() {
  const location = useLocation();
  const { country, gesture } = location.state || {};
  const { getColorClass, getHoverClass, isDark } = useCountryStyles(); //useCountryStyles 훅 사용

  console.log('country : ', country);
  console.log('gesture : ', gesture);

  // '다른 나라에서의 의미' 데이터 파싱
  const parseGestureOthers = (getureOthers: string) => {
    if (!gesture) return [];

    const groups = getureOthers.split('/');
    return groups.map((group) => {
      const [countries, meaning] = group.split(':');
      return {
        countries: countries.trim(),
        meaning: meaning.trim(),
      };
    });
  };

  // TMI 데이터 파싱
  const parseTmiData = (tmiData: string) => {
    return tmiData.split('/').map((item) => item.trim());
  };

  // '다른 나라에서의 의미' 파싱된 데이터 저장
  const otherMeanings = gesture?.gesture_others ? parseGestureOthers(gesture.gesture_others) : [];

  // 'TMI' 파싱된 데이터 저장
  const tmi = gesture?.gesture_tmi ? parseTmiData(gesture.gesture_tmi) : [];

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <DictHeader title={country.name} country={country} showCompareGuide={true} className="" />

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-col h-[80%] overflow-hidden w-full dark:bg-gray-900 dark:text-d-txt-50">
        <div
          className={`flex flex-col md:flex-col lg:flex-row mx-auto w-full max-w-6xl pt-[30px] 
          overflow-y-auto customScrollbar ${country?.code ? country.code : ''} h-full`}
        >
          {/* 제스처 이미지 */}
          <div className="w-full lg:w-1/2 p-6 flex justify-center items-center">
            <div
              className="w-full max-w-[600px] md:max-w-[400px] sm:max-w-[350px] lg:h-[90%] md:h-[220px] sm:h-[200px] min-h-[200px] 
              bg-white dark:bg-gray-500 rounded-lg drop-shadow-basic flex justify-center items-center"
            >
              <img
                src={gesture.image_url}
                alt={`${gesture.title} image`}
                className="w-[35%] md:w-[60%] lg:w-[80%] h-auto max-h-[90%] object-contain"
              />
            </div>
          </div>

          {/* 제스처 관련 설명 */}
          <div
            className={`w-full lg:w-1/2 p-6 relative overflow-y-auto customScrollbar ${country?.code ? country.code : ''}`}
          >
            {/* 제스처 사전 제목 */}
            <div className="mb-2">
              <span className="font-[NanumSquareRoundEB] text-[25px]">제스처 사전</span>
            </div>
            <hr className="text-gray-400 mb-4" />

            <div className="pr-4 font-[NanumSquareRound] text-[18px]">
              <h2 className="text-[20px] font-[NanumSquareRoundB] mb-2">의미</h2>
              <div className="bg-white dark:bg-gray-500 rounded-lg p-5 drop-shadow-basic mb-8">
                {gesture.gesture_meaning}
              </div>

              <h2 className="text-[20px] font-[NanumSquareRoundB] mb-2">사용 상황</h2>
              <div className="bg-white dark:bg-gray-500 rounded-lg p-5 drop-shadow-basic mb-8">
                {gesture.gesture_situation}
              </div>

              <h2 className="text-[20px] font-[NanumSquareRoundB] mb-2">다른 나라에서의 의미</h2>
              <div className="bg-white dark:bg-gray-500 rounded-lg p-5 drop-shadow-basic mb-8">
                <ul className="text-lg space-y-3">
                  {otherMeanings.map((item, index) => (
                    <li key={index}>
                      • {item.countries.replace(/,/g, ', ')} : {item.meaning}
                    </li>
                  ))}
                </ul>
              </div>

              <h2 className="text-[20px] font-[NanumSquareRoundB] mb-2">TMI</h2>
              <div className="bg-white dark:bg-gray-500 rounded-lg p-5 drop-shadow-basic mb-8">
                <ul className="text-lg space-y-3">
                  {tmi.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 연습하기 버튼 */}
      <div className="h-[10%] w-full bg-[#f5f5f5] dark:bg-gray-900 flex items-center justify-center mb-3 mt-3">
        <div className="w-full max-w-6xl px-6">
          <button
            className={`w-full max-w-[600px] mx-auto py-3 ${getColorClass(country.code)} text-white text-xl font-[NanumSquareRoundEB] rounded-lg 
            hover:${getHoverClass} transition-colors block`}
          >
            연습하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default GestureDetail;
