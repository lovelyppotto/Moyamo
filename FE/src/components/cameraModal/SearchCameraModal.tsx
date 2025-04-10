import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

// 컴포넌트
import CameraDialogHeader from './CameraDialogHeader';
import CameraDialogContent from './CameraDialogContent';
import CameraDialogFooter from './CameraDialogFooter';

// 커스텀 훅
import { useGestureEvents } from '@/hooks/useGestureEvents';
import { useGestureTimer } from '@/hooks/useGestureTimer';
import { useZoomPrevention } from '@/hooks/useZoomPrevention';

declare global {
  interface Window {
    resetGestureSequence?: () => void;
    startCollectingFrames?: () => void;
    lastDetectedGesture?: {
      gesture: string;
      confidence: number;
    };
    stopGestureAPI?: () => void;
  }
}

function SearchCameraModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // 타이머 ID 관리를 위한 refs
  const prepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waitingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 프레임 수집 상태 ref
  const isCollectingFramesRef = useRef(false);

  // 상태 관리
  const [apiActive, setApiActive] = useState(false);
  const [guideText, setGuideText] = useState('');
  const [isPreparingGesture, setIsPreparingGesture] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isWaitingForProcessing, setIsWaitingForProcessing] = useState(false);
  const [preparationCountdown, setPreparationCountdown] = useState(2);
  const [countdown, setCountdown] = useState(2);
  const [waitingCountdown, setWaitingCountdown] = useState(1);
  const [isApiConnected, setIsApiConnected] = useState(true);
  const [isErrorToastShown, setIsErrorToastShown] = useState(false);

  // 제스처 관련 상태
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null);
  const [lastConfidence, setLastConfidence] = useState<number>(0);
  const [handDetected, setHandDetected] = useState(false);
  const handDetectedRef = useRef(handDetected);

  useZoomPrevention();

  useEffect(() => {
    handDetectedRef.current = handDetected;
  }, [handDetected]);

  // 타이머 관리 훅 사용
  const { startTimer, clearTimer, cleanupTimers } = useGestureTimer();

  // 부적절한 제스처 목록
  const inappropriateGestures = ['middle_finger', 'devil'];

  // 모든 타이머 정리 함수
  const clearAllTimers = useCallback(() => {
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    if (waitingTimerRef.current) {
      clearInterval(waitingTimerRef.current);
      waitingTimerRef.current = null;
    }

    if (navigationTimerRef.current) {
      clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
    }

    clearTimer();
  }, [clearTimer]);

  // 대기 타이머 (프레임 수집 후)
  const startWaitingTimer = useCallback(() => {
    if (!open) return;

    console.log('[⏱️ 대기 타이머] 시작');

    // 카운트다운 종료, 대기 상태 시작
    setIsCountingDown(false);
    setIsWaitingForProcessing(true);
    setWaitingCountdown(1);
    setGuideText('잠시 기다려 주세요...');

    // 최종 제스처를 저장할 변수
    let finalGesture: string | null = null;
    let wasHandDetected = handDetectedRef.current;

    // 제스처 감지 이벤트 핸들러
    const gestureHandler = (event: Event) => {
      const gestureEvent = event as CustomEvent<{ gesture: string; confidence: number }>;
      if (gestureEvent.detail && gestureEvent.detail.gesture) {
        finalGesture = gestureEvent.detail.gesture;
        console.log(`[🖐️ 대기 중 제스처 캡처] ${finalGesture}`);
        wasHandDetected = true;

        // 실시간으로 상태 업데이트
        setDetectedGesture(finalGesture);
        setLastConfidence(gestureEvent.detail.confidence);
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('gesture-detected', gestureHandler);

    // 대기 카운트다운
    let waitCount = 1;
    const waitInterval = setInterval(() => {
      // 모달이 닫혔으면 타이머 중지
      if (!open) {
        clearInterval(waitInterval);
        window.removeEventListener('gesture-detected', gestureHandler);
        return;
      }

      waitCount--;
      setWaitingCountdown(waitCount);

      if (waitCount <= 0) {
        clearInterval(waitInterval);
        waitingTimerRef.current = null;

        // 리스너 제거
        window.removeEventListener('gesture-detected', gestureHandler);

        // 대기 상태 종료
        setIsWaitingForProcessing(false);

        // 전역 변수에서 제스처 가져오기
        if (!finalGesture && window.lastDetectedGesture) {
          finalGesture = window.lastDetectedGesture.gesture;
          console.log(`[🖐️ 전역 변수에서 제스처 가져옴] ${finalGesture}`);
        }

        // 최종 제스처 선택
        const gestureToUse = finalGesture || detectedGesture;
        console.log(`[🔍 사용할 최종 제스처] ${gestureToUse || '없음'}`);

        // API 비활성화
        setApiActive(false);
        isCollectingFramesRef.current = false;

        // 모달이 여전히 열려있는지 확인 후 처리
        if (!open) return;

        // 1. 손 감지가 일어나지 않았을 때
        if (!wasHandDetected) {
          toast.dismiss();
          toast.info('손 감지 경고', {
            description:
              '손이 카메라에 인식되지 않았습니다. 손을 화면 내에 전부 들어가게 해주세요.',
            duration: 3000,
            position: 'top-right',
            icon: '👋',
          });

          setGuideText('버튼을 눌러 다시 시도해 주세요');
          setIsErrorToastShown(true);
          return;
        }

        // 2. API 결과가 none인 경우 또는 제스처가 감지되지 않은 경우
        if (!gestureToUse || gestureToUse === '없음' || gestureToUse === 'none') {
          toast.dismiss();
          toast.warning('제스처 인식 오류', {
            description: '유효한 제스처가 감지되지 않았습니다. 다시 시도해 주세요.',
            duration: 3000,
            position: 'top-right',
            icon: '⚠️',
          });

          setGuideText('버튼을 눌러 다시 시도해 주세요');
          setIsErrorToastShown(true);
          return;
        }

        // 3 & 4. 부적절한 제스처 처리
        if (inappropriateGestures.includes(gestureToUse)) {
          toast.dismiss();
          toast.error('부적절한 제스처가 감지되었습니다', {
            description: '상대방을 존중하는 제스처를 사용해 주세요.',
            duration: 3000,
            position: 'top-right',
            icon: '🚫',
          });

          setGuideText('다른 제스처로 다시 시도해 주세요');
          setIsErrorToastShown(true);

          // devil 제스처인 경우에만 검색으로 넘어감
          if (gestureToUse === 'devil') {
            const targetUrl = `/search/camera?gesture_label=${gestureToUse}`;
            navigationTimerRef.current = setTimeout(() => {
              if (!open) return;

              try {
                if (location.pathname.includes('/search')) {
                  window.location.href = targetUrl;
                } else {
                  navigate(targetUrl);
                }
                setOpen(false);
              } catch (error) {
                console.error('[🔍 검색 이동 실패]', error);
              }
            }, 1000);
          }

          return;
        }

        // 일반 제스처 처리 (검색으로 이동)
        console.log(`[🔍 검색 실행] 제스처: ${gestureToUse}`);
        setGuideText('인식 완료!');

        // 약간의 지연 후 페이지 이동
        const targetUrl = `/search/camera?gesture_label=${gestureToUse}`;
        navigationTimerRef.current = setTimeout(() => {
          if (!open) return;

          try {
            if (location.pathname.includes('/search')) {
              window.location.href = targetUrl;
            } else {
              navigate(targetUrl);
            }
            setOpen(false);
          } catch (error) {
            console.error('[🔍 검색 이동 실패]', error);
            toast.error('검색 페이지로 이동하는 중 오류가 발생했습니다');
          }
        }, 500);
      }
    }, 1000);

    // 타이머 ID 저장
    waitingTimerRef.current = waitInterval;

    return () => {
      clearInterval(waitInterval);
      window.removeEventListener('gesture-detected', gestureHandler);
    };
  }, [detectedGesture, inappropriateGestures, location.pathname, navigate, open]);

  // 실제 카운트다운 타이머
  const startCountdownTimer = useCallback(() => {
    if (!open) return;

    console.log('[⏱️ 카운트다운 타이머] 시작');

    // 준비 단계 종료, 카운트다운 시작
    setIsPreparingGesture(false);
    setIsCountingDown(true);
    setCountdown(3);
    setGuideText('3초 동안 동일한 제스처를 유지해 주세요');

    // 이 시점에서 프레임 수집 시작
    if (window.startCollectingFrames && !isCollectingFramesRef.current) {
      console.log('[🎬 프레임 수집 시작 요청] - 카운트다운 타이머');
      window.startCollectingFrames();
      isCollectingFramesRef.current = true;
    }

    // 카운트다운
    let count = 3; // 2초로 변경
    const countInterval = setInterval(() => {
      // 모달이 닫혔으면 타이머 중지
      if (!open) {
        clearInterval(countInterval);
        return;
      }

      count--;
      setCountdown(count);
      console.log(`[⏱️ 카운트다운] ${count}초 남음, 현재 손 감지 상태: ${handDetectedRef.current}`);

      if (count <= 0) {
        clearInterval(countInterval);
        countdownTimerRef.current = null;

        // 대기 타이머 시작 (새로 추가)
        startWaitingTimer();
      }
    }, 1000);

    // 타이머 ID 저장
    countdownTimerRef.current = countInterval;

    return () => {
      clearInterval(countInterval);
    };
  }, [open, startWaitingTimer]);

  // 준비 타이머
  const startPreparationTimer = useCallback(() => {
    if (!open || isPreparingGesture || isCountingDown || isWaitingForProcessing) {
      return;
    }

    console.log('[⏱️ 준비 타이머] 시작');

    // 기존 타이머 정리
    clearAllTimers();

    // 상태 초기화
    setDetectedGesture(null);
    setLastConfidence(0);
    setIsErrorToastShown(false);

    // 준비 상태 설정
    setIsPreparingGesture(true);
    setPreparationCountdown(2);
    setGuideText('제스처를 준비해주세요');

    // API 활성화
    setApiActive(true);

    // 준비 카운트다운
    let prepCountdown = 2;
    const prepInterval = setInterval(() => {
      if (!open) {
        clearInterval(prepInterval);
        return;
      }

      prepCountdown--;
      setPreparationCountdown(prepCountdown);

      if (prepCountdown <= 0) {
        clearInterval(prepInterval);
        prepTimerRef.current = null;
        // 여기서 직접 함수 호출
        startCountdownTimer();
      }
    }, 1000);

    // 타이머 ID 저장
    prepTimerRef.current = prepInterval;
  }, [
    isPreparingGesture,
    isCountingDown,
    isWaitingForProcessing,
    open,
    clearAllTimers,
    startCountdownTimer,
  ]);

  // 손 감지 콜백
  const handleHandDetected = useCallback((detected: boolean) => {
    setHandDetected(detected);
  }, []);

  // 제스처 감지 이벤트 처리
  const handleGestureDetected = useCallback(
    (gesture: string, confidence: number) => {
      if (!open) return;

      if ((isCountingDown || isWaitingForProcessing) && apiActive) {
        console.log(`[🖐️ 제스처 감지] ${gesture} (신뢰도: ${confidence})`);
        setDetectedGesture(gesture);
        setLastConfidence(confidence);
      }
    },
    [isCountingDown, isWaitingForProcessing, apiActive, open]
  );

  // 모든 상태 초기화
  const resetAllState = useCallback(() => {
    console.log('[🔄 모든 상태 초기화 시작]');

    // 모든 타이머 정리
    clearAllTimers();

    // 상태 초기화
    setIsPreparingGesture(false);
    setIsCountingDown(false);
    setIsWaitingForProcessing(false);
    setPreparationCountdown(2);
    setCountdown(3);
    setWaitingCountdown(1);
    setGuideText('버튼을 누른 뒤 손 전체가 화면에 나오게 준비해 주세요');
    setIsErrorToastShown(false);
    setDetectedGesture(null);
    setLastConfidence(0);
    setApiActive(false);
    isCollectingFramesRef.current = false;

    // 토스트 메시지 모두 제거
    toast.dismiss();

    // API 시퀀스도 초기화 (전역 함수 활용)
    if (window.resetGestureSequence) {
      console.log('[🔄 제스처 시퀀스 리셋]');
      window.resetGestureSequence();
    }

    // API 강제 중지 함수 호출
    if (window.stopGestureAPI) {
      console.log('[🛑 API 강제 중지 요청]');
      window.stopGestureAPI();
    }

    console.log('[🔄 상태 초기화] 완료');
  }, [clearAllTimers]);

  // 제스처 이벤트 훅 사용
  useGestureEvents({
    isOpen: open,
    isPaused: !apiActive || !open, // 모달이 닫혔거나 API가 비활성화되면 일시정지
    onGestureDetected: handleGestureDetected,
  });

  // 캡처 버튼 클릭 핸들러
  const handleCaptureClick = useCallback(() => {
    if (!open || isPreparingGesture || isCountingDown || isWaitingForProcessing) {
      return;
    }

    console.log('[🔘 캡처 버튼 클릭]');

    // 토스트 메시지 모두 제거
    toast.dismiss();

    // 타이머 정리
    clearAllTimers();

    // 상태 초기화
    setIsPreparingGesture(false);
    setIsCountingDown(false);
    setIsWaitingForProcessing(false);
    setPreparationCountdown(2);
    setCountdown(3);
    setWaitingCountdown(1);
    setGuideText('제스처를 준비해주세요');
    setIsErrorToastShown(false);
    setDetectedGesture(null);
    setLastConfidence(0);

    // API 시퀀스 초기화 (전역 함수 사용)
    if (window.resetGestureSequence) {
      window.resetGestureSequence();
    }

    // API 비활성화 후 재활성화
    setApiActive(false);

    // 약간의 지연 후 타이머 시작
    setTimeout(() => {
      if (!open) return;

      setApiActive(true);
      startPreparationTimer();
    }, 300);
  }, [
    isPreparingGesture,
    isCountingDown,
    isWaitingForProcessing,
    open,
    clearAllTimers,
    startPreparationTimer,
  ]);

  // 연결 상태 콜백
  const handleConnectionStatus = useCallback((status: boolean) => {
    setIsApiConnected(status);
  }, []);

  // 모달 열기/닫기 처리
  const handleDialogOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen !== open) {
        if (!isOpen) {
          console.log('[🔄 모달 닫힘] 모든 상태 초기화 및 API 중지');
          resetAllState();
        } else {
          console.log('[🔄 모달 열림]');
        }
        setOpen(isOpen);
      }
    },
    [resetAllState, open]
  );

  // 모달 열릴 때 상태 초기화
  useEffect(() => {
    if (open) {
      resetAllState();
      setGuideText('버튼을 누른 뒤 손 전체가 화면에 나오게 준비해 주세요');
    }
  }, [open, resetAllState]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      console.log('[🧹 컴포넌트 언마운트] 정리 작업');
      clearAllTimers();
      toast.dismiss();

      // API 관련 작업 중지
      if (window.stopGestureAPI) {
        window.stopGestureAPI();
      }

      // 전역 함수 제거
      window.resetGestureSequence = undefined;
      window.startCollectingFrames = undefined;
      window.stopGestureAPI = undefined;
    };
  }, [clearAllTimers]);

  // 전역 함수 등록 (컴포넌트 초기화 시 1회)
  useEffect(() => {
    if (!window.stopGestureAPI) {
      console.log('[🛑 전역 API 중지 함수 등록]');
      window.stopGestureAPI = () => {
        console.log('[🛑 API 강제 중지 실행]');
        isCollectingFramesRef.current = false;
      };
    }

    // 중요: startCollectingFrames 전역 함수가 이미 등록되어 있는지 확인
    if (!window.startCollectingFrames) {
      console.log('[🎬 전역 프레임 수집 시작 함수 등록]');
      window.startCollectingFrames = () => {
        console.log('[🎬 전역에서 프레임 수집 시작!]');
        isCollectingFramesRef.current = true;
      };
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <button
          onClick={() => setOpen(true)}
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
              isPaused={!apiActive || !open}
              onHandDetected={handleHandDetected}
            />
          )}

          <div className="h-2 bg-none"></div>

          {/* 하단 버튼 영역 */}
          <CameraDialogFooter
            isPreparingGesture={isPreparingGesture}
            isCountingDown={isCountingDown}
            isWaitingForProcessing={isWaitingForProcessing}
            preparationCountdown={preparationCountdown}
            countdown={countdown}
            waitingCountdown={waitingCountdown}
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
