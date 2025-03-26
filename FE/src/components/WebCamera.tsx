import { useRef } from "react";
import Webcam from "react-webcam";

function WebCamera() {
  const webcamRef = useRef<Webcam>(null);

  return(
    <div className="w-full h-full bg-white relative overflow-hidden">
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
        style={{ 
          transform: 'scaleX(-1)',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      {/* 가이드라인 컨테이너 - absolute 포지셔닝 조정 */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="relative w-full h-[90%] flex justify-center items-center overflow-hidden">
          {/* SVG 가이드라인 */}
          <img 
            src="./images/guide-line.svg" 
            alt="카메라 가이드라인" 
            className="absolute 
            max-w-[550px] w-[85%] md:w-[70%] lg:w-[60%] xl:w-[80%] 
            top-25 md:top-20 lg:top-22 xl:top-15
            object-contain"
          />
          {/* 안내 텍스트 - 위치 조정 */}
          <p className="absolute top-5 text-center text-sm md:text-lg font-[NanumSquareRoundB] text-white">
            얼굴과 상체를 가이드라인에 맞춰주세요
          </p>
        </div>
      </div>
    </div>
  );
}

export default WebCamera;