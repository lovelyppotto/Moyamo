import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';
import WebCamera from './WebCamera';

function SearchCameraModal() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 끝난 후 로직
  const handleTimerEnd = () => {
    navigate('/dictionary/detail');
  };

  // 카운트다운 타이머 시작
  const startCountdown = () => {
    // 웹소켓이 연결되지 않았다면 카운트다운 시작하지 않음
    if (!isWebSocketConnected) {
      console.log('[⚠️ 웹소켓 연결 확인 필요] 카운트다운을 시작할 수 없습니다.');
      return;
    }

    setIsCountingDown(true);
    setCountdown(3);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // 타이머 종료
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setIsCountingDown(false);
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 모달이 닫힐 때 타이머 정리
  useEffect(() => {
    if (!open && timerRef.current) {
      clearInterval(timerRef.current);
      setIsCountingDown(false);
    }
  }, [open]);

  const handleCameraClick = (): void => {
    console.log('[🎬 카메라 모달 열기]');
    setOpen(true);
  };

  const handleCaptureClick = (): void => {
    console.log('[📸 캡처 버튼 클릭] 웹소켓 연결 상태:', isWebSocketConnected);
    startCountdown();
  };

  // WebSocket 연결 상태 콜백 핸들러
  const handleConnectionStatus = (status: boolean) => {
    console.log('[🌐 WebSocket 연결 상태 변경]:', status);
    setIsWebSocketConnected(status);
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
          className="p-0 w-[95vw] max-w-[500px] max-h-[90vh]
          rounded-2xl border-none
          mx-auto overflow-hidden
          dark:text-d-txt-50"
        >
          {/* 전체 컨테이너 */}
          <div className="flex flex-col rounded-2xl overflow-hidden">
            {/* 헤더 부분 */}
            <div className="bg-gray-200 dark:bg-gray-700 dark:text-d-txt-50 py-4 px-6">
              <DialogTitle className="flex item-center text-center text-xl font-[NanumSquareRoundEB]">
                제스처 검색
              </DialogTitle>
              <div className="flex flex-col justify-start">
                <p className="text-sm text-left font-[NanumSquareRound]">
                  가이드라인에 맞춰 자세를 잡고 제스처를 취한 상태로 카메라 버튼을 누릅니다.
                </p>
                <p className="text-sm text-left font-[NanumSquareRound]">
                  3초간 자세를 유지해 주세요.
                </p>
              </div>
            </div>

            {/* 카메라 영역 */}
            <div className="flex-grow bg-white rounded-b-lg flex items-center justify-center overflow-hidden">
              {/* 카메라 컨테이너를 정사각형 비율로 설정 */}
              <div className="bg-white">
                <div className="aspect-square w-full">
                  <WebCamera
                    guidelineClassName="w-[70%] mt-35"
                    guideText="버튼을 누르면 검색이 진행됩니다"
                    onConnectionStatus={handleConnectionStatus}
                  />
                </div>
              </div>
            </div>
            <div className="h-2 bg-none"></div>

            {/* 하단 버튼 영역 */}
            <div className="flex rounded-md justify-center py-1 bg-white dark:bg-gray-700">
              <button
                onClick={handleCaptureClick}
                disabled={isCountingDown || !isWebSocketConnected}
                className={`flex items-center justify-center w-7 h-7 ${isWebSocketConnected ? 'bg-black' : 'bg-gray-400'} text-white rounded-full`}
              >
                {isCountingDown ? (
                  <span className="text-lg font-bold">{countdown}</span>
                ) : (
                  <Camera size={20} />
                )}
              </button>
            </div>

            {/* 연결 상태 표시 */}
            {!isWebSocketConnected && open && (
              <div className="absolute bottom-24 left-0 right-0 flex justify-center">
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm">
                  서버 연결 중입니다. 잠시만 기다려주세요.
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SearchCameraModal;
