import WebCamera from '../WebCamera';

interface CameraDialogContentProps {
  open: boolean;
  guideText: string;
  isPaused?: boolean;
  onConnectionStatus: (status: boolean) => void;
  onHandDetected?: (detected: boolean) => void; // 추가
}

function CameraDialogContent({
  open,
  guideText,
  isPaused = false,
  onConnectionStatus,
  onHandDetected, // 추가
}: CameraDialogContentProps) {
  return (
    <div className="flex-grow bg-white rounded-b-lg flex items-center justify-center overflow-hidden">
      {/* 카메라 컨테이너를 정사각형 비율로 설정 */}
      <div className="bg-white">
        <div className="aspect-square w-full">
          {/* WebCamera 컴포넌트에 props 전달 */}
          {open && (
            <WebCamera
              key={`camera-instance`} // 키 값을 고정하여 불필요한 재렌더링 방지
              guidelineClassName="w-[70%] mt-35"
              guideText={guideText}
              onConnectionStatus={onConnectionStatus}
              isPaused={isPaused}
              onHandDetected={onHandDetected} // 추가
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraDialogContent;