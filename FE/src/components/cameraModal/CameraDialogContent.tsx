import WebCamera from '../WebCamera';

interface CameraDialogContentProps {
  open: boolean;
  guideText: string;
  onConnectionStatus: (status: boolean) => void;
}

function CameraDialogContent ({
  open,
  guideText,
  onConnectionStatus,
}: CameraDialogContentProps) {
  return (
    <div className="flex-grow bg-white rounded-b-lg flex items-center justify-center overflow-hidden">
      {/* 카메라 컨테이너를 정사각형 비율로 설정 */}
      <div className="bg-white">
        <div className="aspect-square w-full">
          {/* WebCamera 컴포넌트에 props 전달 */}
          <WebCamera
            key={open ? 'camera-open' : 'camera-closed'} // 키를 추가하여 컴포넌트 강제 재생성
            guidelineClassName="w-[70%] mt-35"
            guideText={guideText}
            onConnectionStatus={onConnectionStatus}
            isPaused={!open}
          />
        </div>
      </div>
    </div>
  );
};

export default CameraDialogContent;
