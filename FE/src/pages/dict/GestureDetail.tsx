import { useEffect, useRef, useState } from 'react';
import DictHeader from './DictHeader';
import gestureExampleImg from './gesture_example.png';

function GestureDetail() {
  // 더미 데이터
  const country = {
    code: 'us',
    name: '미국',
  };

  return (
    <div className="flex flex-col h-full w-full dark:bg-gray-900 dark:text-d-txt-50">
      {/* 헤더 */}
      <DictHeader title={country.name} country={country} showCompareGuide={true} className="" />

      {/* 메인 컨텐츠 */}
      <div className="flex flex-1 mx-auto max-h-[500px] pt-[30px]">
        {/* 제스처 이미지 */}
        <div className="w-1/2 p-6 flex justify-center items-center">
          <div className="w-[600px] h-[455px] bg-white dark:bg-gray-500 rounded-lg drop-shadow-basic flex justify-center items-center">
            <img src={gestureExampleImg} alt="테스트 이미지" className="w-80 h-80 object-contain" />
          </div>
        </div>

        {/* 제스처 관련 설명 */}
        <div className="w-1/2 p-6 relative">
          {/* 제스처 사전 제목 */}
          <div className="mb-2">
            <span className="font-[NanumSquareRoundEB] text-[25px]">제스처 사전</span>
          </div>
          <hr className="text-gray-400 mb-4" />

          {/* 제스처 관련 설명 */}
          <div className="h-[370px] overflow-y-auto pr-4 font-[NanumSquareRound]">
            <div>
              <h2 className="text-[20px] font-[NanumSquareRoundB] mb-2">제스처 의미</h2>
              <div className="bg-white dark:bg-gray-500 rounded-lg p-4 drop-shadow-basic mb-6">
                <p className="text-lg mb-8">
                  이 제스처는 미국에서 사랑이나 애정을 표현하는 방법으로 사용됩니다. 특히 젊은 세대
                  사이에서 인기가 많습니다.
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
      {/* 연습하기 버튼 */}
      <div className="mx-auto mt-8 mb-6">
        <button className="w-[600px] mx-auto py-3 bg-kr-500 text-white text-xl font-[NanumSquareRoundEB] rounded-lg hover:bg-kr-600 transition-colors">
          연습하기
        </button>
      </div>
    </div>
  );
}

export default GestureDetail;
