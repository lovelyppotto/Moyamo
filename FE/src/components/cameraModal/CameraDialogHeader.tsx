import { DialogTitle } from '@/components/ui/dialog';

function CameraDialogHeader() {
  return (
    <div className="bg-gray-200 dark:bg-gray-700 dark:text-d-txt-50 py-4 px-6">
      <DialogTitle className="flex item-center text-center text-2xl mb-1 font-[NanumSquareRoundEB]">
        제스처 검색
      </DialogTitle>
      <div className="flex flex-col justify-start">
        <p className="text-sm text-left font-[NanumSquareRound]">
          가이드라인에 맞춰 자세를 잡고 카메라 버튼을 누릅니다.
        </p>
        <p className="text-sm text-left font-[NanumSquareRound]">
          이후 준비 시간 2초가 주어지며, 3초간 제스처를 유지해 주세요.
        </p>
      </div>
    </div>
  );
};

export default CameraDialogHeader;