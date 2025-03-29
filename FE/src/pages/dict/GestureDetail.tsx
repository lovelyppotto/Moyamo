import DictHeader from './DictHeader';
import { Country } from '@/types/dictionaryType';
import '@/components/ui/scrollbar.css';
import { useLocation } from 'react-router-dom';

function GestureDetail() {
  const location = useLocation();
  const { country, gesture } = location.state || {};
  console.log('country : ', country);
  console.log('gesture : ', gesture);

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <DictHeader title={country.name} country={country} showCompareGuide={true} className="" />

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-col h-[80%] overflow-hidden w-full dark:bg-gray-900 dark:text-d-txt-50">
        <div
          className="flex flex-col md:flex-col lg:flex-row mx-auto w-full max-w-6xl pt-[30px] 
          overflow-y-auto customScrollbar kr h-full"
        >
          {/* 제스처 이미지 */}
          <div className="w-full lg:w-1/2 p-6 flex justify-center items-center">
            <div
              className="w-full max-w-[600px] md:max-w-[400px] sm:max-w-[350px] lg:h-[90%] md:h-[220px] sm:h-[200px] min-h-[200px] 
              bg-white dark:bg-gray-500 rounded-lg drop-shadow-basic flex justify-center items-center"
            >
              <img
                src={gesture.image_url}
                alt="테스트 이미지"
                className="w-[35%] md:w-[60%] lg:w-[80%] h-auto max-h-[90%] object-contain"
              />
            </div>
          </div>

          {/* 제스처 관련 설명 */}
          <div className="w-full lg:w-1/2 p-6 relative overflow-y-auto customScrollbar kr">
            {/* 제스처 사전 제목 */}
            <div className="mb-2">
              <span className="font-[NanumSquareRoundEB] text-[25px]">제스처 사전</span>
            </div>
            <hr className="text-gray-400 mb-4" />

            {/* 제스처 관련 설명 */}
            <div
              className="
              pr-4 
              font-[NanumSquareRound]
            "
            >
              <div>
                <h2 className="text-[20px] font-[NanumSquareRoundB] mb-2">제스처 의미</h2>
                <div className="bg-white dark:bg-gray-500 rounded-lg p-4 drop-shadow-basic mb-6">
                  <p className="text-lg mb-8">
                    이 제스처는 미국에서 사랑이나 애정을 표현하는 방법으로 사용됩니다. 특히 젊은
                    세대 사이에서 인기가 많습니다.
                  </p>
                </div>
              </div>

              <h2 className="text-[20px] font-[NanumSquareRoundB] mb-2">제스처 쓰는 상황</h2>
              <div className="bg-white dark:bg-gray-500 rounded-lg p-4 drop-shadow-basic mb-6">
                <ul className="text-lg mb-8 space-y-2">
                  <li>- 사랑하는 사람에게 애정 표현할 때</li>
                  <li>- 소셜 미디어에서 사진 찍을 때</li>
                  <li>- 친구들과 함께 있을 때 재미있게 사용</li>
                </ul>
              </div>

              <h2 className="text-[20px] font-[NanumSquareRoundB] mb-2">주의사항</h2>
              <div className="bg-white dark:bg-gray-500 rounded-lg p-4 drop-shadow-basic mb-6">
                <ul className="text-lg mb-8 space-y-2">
                  <li>- 비즈니스 미팅이나 공식적인 상황에서는 적절하지 않을 수 있습니다.</li>
                  <li>- 문화적 맥락에 따라 해석이 다를 수 있으니 주의하세요.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 연습하기 버튼 - 전체 화면의 10% */}
      <div className="h-[10%] w-full bg-[#f5f5f5] dark:bg-gray-900 flex items-center justify-center mb-3">
        <div className="w-full max-w-6xl px-6">
          <button
            className="w-full max-w-[600px] mx-auto py-3 bg-kr-500 text-white text-xl font-[NanumSquareRoundEB] rounded-lg 
            hover:bg-kr-600 transition-colors block"
          >
            연습하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default GestureDetail;
