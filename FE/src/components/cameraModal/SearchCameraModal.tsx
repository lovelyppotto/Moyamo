import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

// Zustand 스토어와 훅
import { useGestureStore } from '@/stores/useGesturStore';
import { useGestureEvents } from '@/hooks/useGestureEvents';
import { useGestureTimer } from '@/hooks/useGestureTimer';

// 컴포넌트
import CameraDialogHeader from './CameraDialogHeader';
import CameraDialogContent from './CameraDialogContent';
import CameraDialogFooter from './CameraDialogFooter';
import ConnectionStatus from './ConnectionStatus';

function SearchCameraModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const mountCountRef = useRef<number>(0);
  
  // Zustand 스토어에서 상태 가져오기
  const {
    guideText,
    isPreparingGesture,
    preparationCountdown,
    isCountingDown,
    countdown,
    isErrorToastShown,
    isWebSocketConnected,
    setWebSocketConnected,
    resetAllState,
  } = useGestureStore();

  // 제스처 이벤트 리스너 설정
  useGestureEvents({ isOpen: open });     

  // 줌 방지 핸들러
  useEffect(() => {
    const preventZoom = (e: KeyboardEvent) => {
      console.log('key:', e.key)
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
        e.preventDefault();
      }
    };

    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // 이벤트 리스너 추가
    window.addEventListener('keydown', preventZoom);
    window.addEventListener('wheel', preventWheelZoom, { passive: false });

    return () => {
      // 이벤트 리스너 제거
      window.removeEventListener('keydown', preventZoom);
      window.removeEventListener('wheel', preventWheelZoom);
    };
  }, []);
  
  // 타이머 완료 후 처리 함수
  const handleTimerComplete = useCallback((detectedGesture: string) => {
    // 여기서는 이미 유효한 제스처만 전달받게 됨
    console.log(`[🔍 검색 시작] 제스처: ${detectedGesture}`);
    
    // 페이지 이동
    if (location.pathname.includes('/search')) {
      window.location.href = `/search/camera?gesture_label=${detectedGesture}`;
    } else {
      navigate(`/search/camera?gesture_label=${detectedGesture}`);
    }
    
    // 모달 닫기
    setTimeout(() => setOpen(false), 300);
  }, [location.pathname, navigate]);
  
  // 제스처 타이머 설정
  const { startPreparationTimer, handleRetry } = useGestureTimer({
    isOpen: open,
    onTimerComplete: handleTimerComplete
  });
  
  // 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    mountCountRef.current += 1;
    console.log(`[🔍 SearchCameraModal] 마운트 (${mountCountRef.current}번째)`);

    return () => {
      console.log('[🔍 SearchCameraModal] 언마운트');
      // 모든 토스트 제거
      toast.dismiss();
    };
  }, []);
  
  // 모달이 열리면 모든 상태 초기화
  useEffect(() => {
    if (open) {
      resetAllState();
      toast.dismiss();
      console.log('[🔄️ 모달 열림] 상태 초기화 완료');
    }
  }, [open, resetAllState]);
  
  // 카메라 버튼 클릭 핸들러
  const handleCameraClick = () => {
    setOpen(true);
  };
  
  // 촬영 버튼 클릭 핸들러
  const handleCaptureClick = () => {
    if (isErrorToastShown) {
      handleRetry();
    } else {
      startPreparationTimer();
    }
  };
  
  // 웹소켓 연결 상태 콜백 핸들러
  const handleConnectionStatus = useCallback((status: boolean) => {
    console.log(`[🌐 WebSocket 연결 상태] ${status ? '연결됨' : '연결 안됨'}`);
    setWebSocketConnected(status);
  }, [setWebSocketConnected]);
  
  // Dialog가 닫힐 때 호출되는 함수
  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    // 대화상자가 닫히면 토스트 메시지 제거
    if (!isOpen) {
      toast.dismiss();
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>
          <button
            onClick={handleCameraClick}
            className="flex flex-col items-center
            bg-transparent border-none 
            cursor-pointer"
          >
            <Camera className="w-6 h-6 cursor-pointer text-gray-600 dark:text-d-txt-50" />
          </button>
        </DialogTrigger>
        
        <DialogContent
          className="p-0 w-[95vw] sm:w-[450px] max-w-[500px] max-h-[90vh]
          rounded-2xl border-none
          mx-auto overflow-hidden
          dark:text-d-txt-50"
        >
          {/* 전체 컨테이너 */}
          <div className="flex flex-col rounded-2xl overflow-hidden">
            {/* 헤더 부분 */}
            <CameraDialogHeader />
            
            {/* 카메라 영역 */}
            <CameraDialogContent 
              open={open}
              guideText={guideText}
              onConnectionStatus={handleConnectionStatus}
            />
            
            <div className="h-2 bg-none"></div>

            {/* 하단 버튼 영역 */}
            <CameraDialogFooter 
              isPreparingGesture={isPreparingGesture}
              isCountingDown={isCountingDown}
              preparationCountdown={preparationCountdown}
              countdown={countdown}
              isErrorToastShown={isErrorToastShown}
              isWebSocketConnected={isWebSocketConnected}
              onCaptureClick={handleCaptureClick}
            />

            {/* 연결 상태 표시 */}
            <ConnectionStatus 
              isWebSocketConnected={isWebSocketConnected} 
              isOpen={open} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchCameraModal;