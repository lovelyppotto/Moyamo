import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

// 컴포넌트
import CameraDialogHeader from './CameraDialogHeader';
import CameraDialogContent from './CameraDialogContent';
import CameraDialogFooter from './CameraDialogFooter';

// WebCamera 컴포넌트에서 제스처 이벤트를 받기 위한 타입
interface GestureDetectedEvent extends CustomEvent {
  detail: {
    gesture: string;
    confidence: number;
  };
}

function SearchCameraModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  // 카메라 상태
  const [cameraActive, setCameraActive] = useState(false);
  
  // 제스처 및 가이드 상태
  const [guideText, setGuideText] = useState('버튼을 누르면 검색이 진행됩니다');
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null);
  const [lastConfidence, setLastConfidence] = useState<number>(0);
  
  // 타이머 상태
  const [isPreparingGesture, setIsPreparingGesture] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [preparationCountdown, setPreparationCountdown] = useState(2);
  const [countdown, setCountdown] = useState(3);
  
  // API 및 에러 상태
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isErrorToastShown, setIsErrorToastShown] = useState(false);
  
  // 제스처 처리 관련 상태
  const [gestureProcessComplete, setGestureProcessComplete] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);
  
  // 타이머 참조
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 부적절한 제스처 목록
  const inappropriateGestures = ['middle_finger', 'devil'];

  // 모든 상태 초기화
  const resetAllState = useCallback(() => {
    setIsPreparingGesture(false);
    setIsCountingDown(false);
    setPreparationCountdown(2);
    setCountdown(3);
    setGuideText('버튼을 누르면 검색이 진행됩니다');
    setIsErrorToastShown(false);
    setDetectedGesture(null);
    setLastConfidence(0);
    setGestureProcessComplete(false);
    setSearchExecuted(false);
    
    // 모든 타이머 정리
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (open) {
      resetAllState();
      setCameraActive(true);
      toast.dismiss();
      console.log('[🔄️ 모달 열림] 상태 초기화 완료');
    } else {
      setCameraActive(false);
    }
  }, [open, resetAllState]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 모든 토스트 제거
      toast.dismiss();
      
      // 타이머 정리
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // API 연결 상태 변경 처리
  const handleConnectionStatus = useCallback((status: boolean) => {
    console.log(`[🌐 API 연결 상태] ${status ? '연결됨' : '연결 안됨'}`);
    setIsApiConnected(status);
  }, []);

  // 제스처 이벤트 리스너 설정
  useEffect(() => {
    // 제스처 이벤트 핸들러
    const handleGestureDetected = (event: Event) => {
      // 모달이 닫혀있거나 준비 중이 아니면 이벤트 무시
      if (!open || gestureProcessComplete) {
        return;
      }

      const gestureEvent = event as GestureDetectedEvent;
      if (gestureEvent.detail && gestureEvent.detail.gesture) {
        const { gesture, confidence } = gestureEvent.detail;
        console.log(`[🖐️ 제스처 감지] ${gesture} (신뢰도: ${confidence})`);
        
        // 카운트다운 중일 때만 제스처 업데이트
        if (isCountingDown && !gestureProcessComplete) {
          setDetectedGesture(gesture);
          setLastConfidence(confidence);
          
          // 제스처 감지 시 즉시 처리 완료 표시
          // API가 이미 응답을 보냈으므로 제스처 처리를 완료로 표시
          setGestureProcessComplete(true);
          
          // 하지만 검색은 아직 실행하지 않음 (카운트다운 끝날 때 실행)
        }
      }
    };

    // 이벤트 리스너 등록 (모달이 열려 있을 때만)
    if (open) {
      window.addEventListener('gesture-detected', handleGestureDetected);
    }

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('gesture-detected', handleGestureDetected);
    };
  }, [open, isCountingDown, gestureProcessComplete]);

  // 제스처 검색 실행 함수
  const executeGestureSearch = useCallback(() => {
    // 이미 검색이 실행되었거나 제스처가 없으면 무시
    if (searchExecuted || !detectedGesture) return;
    
    // 검색 실행 표시 (중복 실행 방지)
    setSearchExecuted(true);
    
    // 부적절한 제스처 처리
    if (inappropriateGestures.includes(detectedGesture)) {
      toast.error('부적절한 제스처가 감지되었습니다', {
        description: '상대방을 존중하는 제스처를 사용해 주세요.',
        duration: 5000,
        position: 'top-right',
        icon: '⚠️',
      });
      
      setGuideText('다른 제스처로 다시 시도해 주세요');
      setIsErrorToastShown(true);
      return;
    }
    
    // 제스처 감지 성공
    console.log(`[🔍 검색 시작] 제스처: ${detectedGesture} (신뢰도: ${lastConfidence})`);
    setGuideText('인식 완료!');
    
    // 검색 페이지로 이동
    setTimeout(() => {
      try {
        if (location.pathname.includes('/search')) {
          window.location.href = `/search/camera?gesture_label=${detectedGesture}`;
        } else {
          navigate(`/search/camera?gesture_label=${detectedGesture}`);
        }
        
        // 모달 닫기 (검색 페이지로 이동 후)
        setTimeout(() => setOpen(false), 300);
      } catch (error) {
        console.error('[🔍 검색 이동 실패]', error);
        toast.error('검색 페이지로 이동하는 중 오류가 발생했습니다');
      }
    }, 300);
  }, [detectedGesture, lastConfidence, searchExecuted, location.pathname, navigate, inappropriateGestures]);

  // 카운트다운이 끝났을 때 제스처 검색 실행
  useEffect(() => {
    // 카운트다운이 끝나고 제스처가 감지된 경우에만 검색 실행
    if (!isCountingDown && countdown === 0 && detectedGesture && gestureProcessComplete && !searchExecuted) {
      executeGestureSearch();
    }
    // 카운트다운이 끝났는데 제스처가 없는 경우 에러 표시
    else if (!isCountingDown && countdown === 0 && !detectedGesture && !searchExecuted) {
      setGuideText('버튼을 눌러 다시 시도해 주세요');
      setIsErrorToastShown(true);
      
      toast.warning('손 감지 경고', {
        description: '손이 카메라에 인식되지 않았습니다. 손을 가이드라인 안에 위치시켜 주세요.',
        duration: 3000,
        position: 'top-right',
        icon: '🖐️',
      });
    }
  }, [isCountingDown, countdown, detectedGesture, gestureProcessComplete, searchExecuted, executeGestureSearch]);

  // 준비 타이머 시작
  const startPreparationTimer = useCallback(() => {
    // 이미 타이머가 실행 중이면 중복 실행 방지
    if (isPreparingGesture || isCountingDown) {
      return;
    }

    // API 연결 상태 확인
    if (!isApiConnected) {
      toast.dismiss();
      toast.error('서버 연결 실패', {
        description: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
        duration: 3000,
      });
      return;
    }

    console.log('[⏱️ 준비 카운트다운] 시작');
    
    // 준비 상태 설정
    setIsPreparingGesture(true);
    setGuideText('제스처를 준비해주세요');
    setDetectedGesture(null);
    setLastConfidence(0);
    setGestureProcessComplete(false);
    setSearchExecuted(false);
    
    // 준비 타이머 시작
    prepTimerRef.current = setInterval(() => {
      setPreparationCountdown(prev => {
        // 카운트다운이 1이면 준비 타이머 종료 및 실제 카운트다운 시작
        if (prev <= 1) {
          if (prepTimerRef.current) {
            clearInterval(prepTimerRef.current);
            prepTimerRef.current = null;
          }
          
          // 준비 완료 후 실제 카운트다운 시작
          startActualCountdown();
          return 2; // 초기값으로 리셋
        }
        return prev - 1;
      });
    }, 1000);
  }, [isPreparingGesture, isCountingDown, isApiConnected]);

  // 실제 카운트다운 시작
  const startActualCountdown = useCallback(() => {
    console.log('[⏱️ 실제 카운트다운] 시작');
    
    setIsPreparingGesture(false);
    setIsCountingDown(true);
    setGuideText('제스처를 유지해주세요');
    
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        // 카운트다운이 0이면 타이머 종료
        if (prev <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          setIsCountingDown(false);
          
          // 여기서는 검색을 실행하지 않음
          // useEffect에서 카운트다운 완료 시 제스처가 있는지 확인하여 검색 실행
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // 촬영 버튼 클릭 핸들러
  const handleCaptureClick = useCallback(() => {
    setCameraActive(true);
    
    if (isErrorToastShown) {
      // 에러 상태 초기화 후 재시도
      setIsErrorToastShown(false);
      setGuideText('버튼을 누르면 검색이 진행됩니다');
      setTimeout(() => {
        startPreparationTimer();
      }, 100);
    } else {
      startPreparationTimer();
    }
  }, [isErrorToastShown, startPreparationTimer]);

  // 모달 열기 버튼 클릭 핸들러
  const handleCameraClick = useCallback(() => {
    setOpen(true);
  }, []);

  // 모달 닫힐 때 처리
  const handleDialogOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    
    // 모달이 닫힐 때 토스트 메시지 제거
    if (!isOpen) {
      toast.dismiss();
    }
  }, []);

  return (
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
              isPaused={!cameraActive}
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
            isWebSocketConnected={isApiConnected}
            onCaptureClick={handleCaptureClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchCameraModal;