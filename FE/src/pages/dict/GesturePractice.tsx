import { useLocation, useNavigate } from 'react-router-dom';
import DictHeader from './DictHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import WebCamera from '@/components/WebCamera';

function GesturePractice() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);

  const { country, gesture } = location.state || [];

  // 카메라 버튼 클릭 시 카메라로 전환
  const toggleScreen = () => {
    setShowCamera(!showCamera);
  };
  return (
    <div className="flex flex-col h-screen dark:bg-gray-900 dark:text-d-txt-50">
      {/* 헤더 */}
      <DictHeader title="연습하기" className="" />

      {/* 간단한 설명 */}
      <div
        className="font-[NanumSquareRoundB] text-[16px] sm:text-[18px] lg:text-[24px] pt-2 pb-1 px-4
        lg: mt-2 lg:pt-5 text-center flex justify-center items-center"
      >
        <span>제스처를 정확히 따라하면 화면에&nbsp;</span>
        <span className="text-fern-400 font-[NanumSquareRoundEB] sm:text-[22px] lg:text-[28px]">
          O
        </span>
        <span>가 표시됩니다.</span>
      </div>

      {/* 메인 컨텐츠 */}

      <div className="flex flex-col lg:flex-row w-full h-full max-w-full px-2 py-1 flex-1 justify-center items-center lg:gap-8 xl:gap-12">
        {/* 따라할 제스처 */}
        <div className="w-full max-w-[500px] lg:w-auto lg:flex-1 flex justify-center items-center mb-2 lg:mb-0">
          <div className="w-full max-w-[500px] md:max-w-[600px] lg:max-w-[100%] h-[38vh] lg:h-[70vh] bg-white rounded-lg drop-shadow-basic flex justify-center items-center p-3">
            <img
              src={gesture.imageUrl}
              alt={`${gesture.gestureTitle} image`}
              className="w-[90%] h-[90%] lg:w-[80%] lg:h-[80%] object-contain"
            />
          </div>
        </div>

        {/* 연습화면 */}
        <div
          className="w-full max-w-[500px] md:w-[500px] lg:w-[600px] h-[38vh] lg:h-[70vh] bg-gray-200 rounded-lg drop-shadow-basic flex justify-center items-center"
          onClick={toggleScreen}
        >
          {!showCamera ? (
            <div className="flex flex-col items-center text-gray-400 font-[NanumSquareRoundB] text-center space-y-2 sm:space-y-3">
              <div className="text-8xl lg:text-9xl ">
                <FontAwesomeIcon icon={faCamera} />
              </div>
              <p className="text-xl lg:text-2xl">
                카메라를 클릭 시<br />
                연습을 시작합니다.
              </p>
            </div>
          ) : (
            <WebCamera
              guidelineClassName="max-w-[500px] 
                w-[48%] lg:w-[80%]
                top-13  lg:top-22"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default GesturePractice;
