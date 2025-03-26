import { useRef } from "react";
import Webcam from "react-webcam";

function WebCamera() {
  const webcamRef = useRef<Webcam>(null);

  return(
    <div className="p-3 w-[80vh] bg-white rounded-2xl relative">
      <Webcam
        audio={false}
        // 해상도 설정
        width={1280}
        height={720}
        ref={webcamRef}
        videoConstraints={{
          facingMode: 'user',
        }}
        // 백엔드에 반전된 상태로 넘어가는지 확인 필요 
        style={{ transform: 'scaleX(-1)' }}
      />
      {/* 가이드라인 컨테이너 - absolute 포지셔닝 조정 */}
      <div className="absolute top-10 left-0 w-full h-full flex justify-center items-center pointer-events-none">
        <div className="relative w-[70%] flex justify-center items-center">
          {/* SVG 가이드라인 */}
          <img 
            src="./images/guide-line.svg" 
            alt="얼굴 가이드라인" 
            className="w-full h-full object-contain"
          />

          {/* 안내 텍스트 - 위치 조정 */}
          <p className="absolute top-[15%] text-center text-sm md:text-lg font-[NanumSquareRoundB] text-white">
            얼굴과 상체를 가이드라인 안에 맞춰주세요
          </p>
        </div>
      </div>
    </div>
  );
}

export default WebCamera;