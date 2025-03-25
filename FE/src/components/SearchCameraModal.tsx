import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Camera } from 'lucide-react';

function SearchCameraModal() {
  const [open, setOpen] = useState(false);

  const handleCameraClick = (): void => {
    setOpen(true);
  };
  return(
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
        className="p-0 w-full h-full max-h-[80%]
        rounded-2xl border-none
        max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-5xl
        bg-white
        dark:bg-gray-800 dark:text-d-txt-50"
      >
        <div className="p-2 rounded-t-2xl bg-gray-200 dark:bg-gray-900">
          <DialogHeader className="relative m-0">
            <DialogTitle className="text-center text-3xl font-[NanumSquareRoundEB] mt-2">
              <h1>제스처 검색</h1>
              <p className="text-base font-[NanumSquareRound] mt-2">
                가이드라인에 맞춰 자세를 잡고 제스처를 취한 상태로 버튼을 누릅니다.
              </p>
              <p className="text-base font-[NanumSquareRound] mt-2">
                3초간 자세를 유지해 주세요.
              </p>
            </DialogTitle>
          </DialogHeader>
        </div>
        <div>
          카메라 컴포넌트 
        </div>
        
      </DialogContent>
        <button className='max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-5xl
        bg-white'>
          버튼
        </button>
    </Dialog>
    </>
  );
}

export default SearchCameraModal;