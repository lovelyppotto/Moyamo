import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

// Zustand 스토어와 훅
import { useGestureStore } from '@/stores/useGesturStore';
import { useGestureEvents } from '@/hooks/useGestureEvents';
import { useGestureTimer } from '@/hooks/useGestureTimer';
import { useZoomPrevention } from '@/hooks/useZoomPrevention';

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
    setGuideText,
    setWebSocketConnected,
    resetAllState,
  } = useGestureStore();

  // 제스처 이벤트 리스너 설정
  useGestureEvents({ isOpen: open });

  // 강력한 줌 방지 적용 (기존 코드 대체)
  useZoomPrevention();

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

  // 타이머 완료 후 처리 함수
  const handleTimerComplete = useCallback(
    (detectedGesture: string) => {
      // 여기서는 이미 유효한 제스처만 전달받게 됨
      console.log(`[🔍 검색 시작] 제스처: ${detectedGesture}`);

      // middle_finger 제스처 감지 시
      if (detectedGesture === 'middle_finger') {
        toast.error('부적절한 제스처가 감지되었습니다', {
          description: '상대방을 존중하는 제스처를 사용해 주세요.',
          duration: 5000,
          position: 'top-right',
          icon: '⚠️',
        });

        // 가이드 텍스트 변경
        setGuideText('다른 제스처로 다시 시도해 주세요');
        return;
      }

      // devil 제스처 감지 시
      if (detectedGesture === 'devil') {
        toast.error('부적절한 제스처가 감지되었습니다', {
          description: '상대방을 존중하는 제스처를 사용해 주세요.',
          duration: 5000,
          position: 'top-right',
          icon: '⚠️',
        });
      }

      // 검색 진행 (middle_finger가 아닌 경우만 여기에 도달)
      if (location.pathname.includes('/search')) {
        window.location.href = `/search/camera?gesture_label=${detectedGesture}`;
      } else {
        navigate(`/search/camera?gesture_label=${detectedGesture}`);
      }

      // 모달 닫기
      setTimeout(() => setOpen(false), 300);
    },
    [location.pathname, navigate, setOpen, setGuideText]
  );

  // 제스처 타이머 설정
  const { startPreparationTimer, handleRetry } = useGestureTimer({
    isOpen: open,
    onTimerComplete: handleTimerComplete,
  });

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
  const handleConnectionStatus = useCallback(
    (status: boolean) => {
      console.log(`[🌐 WebSocket 연결 상태] ${status ? '연결됨' : '연결 안됨'}`);
      setWebSocketConnected(status);
    },
    [setWebSocketConnected]
  );

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
            {open && (
              <CameraDialogContent
                open={open}
                guideText={guideText}
                onConnectionStatus={handleConnectionStatus}
              />
            )}

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
            <ConnectionStatus isServerConnected={isWebSocketConnected} isOpen={open} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SearchCameraModal;
