import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Camera } from 'lucide-react';
import WebCamera from './Webcamera';

function SearchCameraModal() {
  const [open, setOpen] = useState(false);

  const handleCameraClick = (): void => {
    setOpen(true);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            onClick={handleCameraClick}
            className="flex flex-col items-center
          bg-transparent border-none 
          cursor-pointer"
          >
            <Camera className="w-6 h-6 cursor-pointer" />
          </button>
        </DialogTrigger>
        <DialogContent
          className="p-0 w-full h-[90vh] max-h-[90%]
          rounded-2xl border-none
          max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-5xl overflow-hidden"
        >
          {/* 전체 컨테이너 */}
          <div className="flex flex-col h-full w-full rounded-2xl overflow-hidden">
            {/* 헤더 부분 */}
            <DialogTitle
              className="flex item-center py-6 pl-8
              text-center text-3xl font-[NanumSquareRoundEB]
              bg-gray-200"
            >
              <h1 className="flex item-center mt-1 mr-5">제스처 검색</h1>
              <div className="flex flex-col justify-start">
                <p className="text-base text-left font-[NanumSquareRoundL]">
                  가이드라인에 맞춰 자세를 잡고 제스처를 취한 상태로 카메라 버튼을 누릅니다.
                </p>
                <p className="text-base text-left font-[NanumSquareRoundL]">
                  3초간 자세를 유지해 주세요.
                </p>
              </div>
            </DialogTitle>

            {/* 카메라 영역 */}
            <div className="flex-grow bg-white rounded-b-lg flex items-center justify-center overflow-hidden">
              {/* 카메라 컨테이너에 고정된 높이 비율 설정 */}
              <div className="w-full h-0 pb-[100%] md:pb-[80%] lg:pb-[65%] xl:pb-[50%] relative">
                {/* 실제 카메라 컴포넌트 */}
                <div className="absolute inset-0">
                  <WebCamera
                    // 아래와 같이 반응형으로 화면 비율을 조절합니다
                    guidelineClassName="max-w-[550px] 
                    w-[85%] md:w-[70%] lg:w-[60%] xl:w-[80%] 
                    top-25 md:top-20 lg:top-22 xl:top-15"
                  />
                </div>
              </div>
            </div>
            <div className='h-2 bg-none'></div>
            {/* 하단 버튼 영역 */}
            <div
              className="flex justify-center px-2 py-3 
              bg-white rounded-t-lg "
            >
              <button className="bg-black text-white rounded-full flex items-center justify-center w-14 h-14">
                <Camera className="" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SearchCameraModal;
