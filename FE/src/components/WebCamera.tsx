import { useRef } from "react";
import Webcam from "react-webcam";

function WebCamera() {
  const webcamRef = useRef<Webcam>(null);

  return(
    <div className="p-3 w-[80vh]  bg-white rounded-2xl ">
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
      <div className="absolute top-45 left-0 w-full h-full flex justify-center items-center pointer-events-none">
        <div className="relative w-[50%] h-[80%] flex justify-center items-center animate-puls">
          {/* 얼굴 가이드선 (원) */}
          <div className="absolute top-[12vh] w-[33vh] h-[33vh] rounded-full border-2 border-dashed border-white "></div>

          {/* 상체 가이드선 (타원) */}
          <div className="absolute top-[45vh] w-[50vh] h-[20vh] rounded-t-[50%] border-t-2 border-l-2 border-r-2 border-dashed border-white"></div>

          {/* 안내 텍스트 */}
          <p className="absolute top-[7vh] text-center text-sm md:text-lg font-[NanumSquareRoundB] text-white">
            얼굴과 상체를 가이드라인 안에 맞춰주세요
          </p>
        </div>
      </div>
    </div>
  );
}

export default WebCamera;