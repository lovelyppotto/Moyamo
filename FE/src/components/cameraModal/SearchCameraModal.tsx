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

declare global {
  interface Window {
    resetGestureSequence?: () => void;
    startCollectingFrames?: () => void;
    lastDetectedGesture?: {
      gesture: string;
      confidence: number;
    };
  }
}

function SearchCameraModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // 상태 관리
  const [apiActive, setApiActive] = useState(false);
  const [guideText, setGuideText] = useState('버튼을 누르면 검색이 진행됩니다');
  const [isPreparingGesture, setIsPreparingGesture] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [preparationCountdown, setPreparationCountdown] = useState(2);
  const [countdown, setCountdown] = useState(3);
  const [isApiConnected, setIsApiConnected] = useState(true);
  const [isErrorToastShown, setIsErrorToastShown] = useState(false);

  // 제스처 관련 상태
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null);
  const [lastConfidence, setLastConfidence] = useState<number>(0);
  const [handDetected, setHandDetected] = useState(false);

  const handDetectedRef = useRef(handDetected);

  useEffect(() => {
    handDetectedRef.current = handDetected;
  }, [handDetected]);

  // 손 감지 콜백
  const handleHandDetected = useCallback((detected: boolean) => {
    // console.log(`[🖐️ 손 감지 상태 업데이트] detected: ${detected}`);
    setHandDetected(detected);
  }, []);

  // 타이머 관리 훅 사용
  const { startTimer, clearTimer, cleanupTimers } = useGestureTimer();

  // 부적절한 제스처 목록
  const inappropriateGestures = ['middle_finger', 'devil'];

  // 모든 상태 초기화
  const resetAllState = useCallback(() => {
    // 타이머 정리
    clearTimer();

    // 상태 초기화
    setIsPreparingGesture(false);
    setIsCountingDown(false);
    setPreparationCountdown(2);
    setCountdown(3);
    setGuideText('버튼을 누르면 검색이 진행됩니다');
    setIsErrorToastShown(false);
    setDetectedGesture(null);
    setLastConfidence(0);
    setApiActive(false);

    // 토스트 메시지 모두 제거
    toast.dismiss();

    // API 시퀀스도 초기화 (전역 함수 활용)
    if (window.resetGestureSequence) {
      window.resetGestureSequence();
    }

    console.log('[🔄 상태 초기화] 완료');
  }, [clearTimer]);

  // 제스처 감지 이벤트 처리
  const handleGestureDetected = useCallback(
    (gesture: string, confidence: number) => {
      // 카운트다운 중이고 API가 활성화된 상태일 때만 제스처 저장
      if (isCountingDown && apiActive) {
        console.log(`[🖐️ 제스처 저장] ${gesture} (신뢰도: ${confidence})`);

        // 상태 업데이트 - 중요: 즉시 값을 업데이트합니다
        setDetectedGesture(gesture);
        setLastConfidence(confidence);
      }
    },
    [isCountingDown, apiActive]
  );

  // 제스처 이벤트 훅 사용
  useGestureEvents({
    isOpen: open,
    isPaused: !apiActive,
    onGestureDetected: handleGestureDetected,
  });

  // 준비 타이머
  const startPreparationTimer = useCallback(() => {
    // 이미 타이머가 실행 중이면 중복 실행 방지
    if (isPreparingGesture || isCountingDown) {
      return;
    }

    console.log('[⏱️ 준비 타이머] 시작');

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
      prepCountdown--;
      setPreparationCountdown(prepCountdown);

      if (prepCountdown <= 0) {
        clearInterval(prepInterval);
        startCountdownTimer();
      }
    }, 1000);

    return () => clearInterval(prepInterval);
  }, [isPreparingGesture, isCountingDown]);

  // 실제 카운트다운 타이머
  const startCountdownTimer = useCallback(() => {
    console.log('[⏱️ 카운트다운 타이머] 시작');

    // 준비 단계 종료, 카운트다운 시작
    setIsPreparingGesture(false);
    setIsCountingDown(true);
    setCountdown(8);
    setGuideText('제스처를 유지해주세요');

    // 최종 제스처를 저장할 변수
    let finalGesture: string | null = null;
    let wasHandDetected = false; // 초기값

    // 카운트다운 중 제스처 감지를 위한 이벤트 리스너
    const captureGesture = (event: Event) => {
      const gestureEvent = event as CustomEvent<{ gesture: string; confidence: number }>;
      if (gestureEvent.detail && gestureEvent.detail.gesture) {
        finalGesture = gestureEvent.detail.gesture;
        console.log(`[🖐️ 카운트다운 중 제스처 캡처] ${finalGesture}`);

        // 손이 감지되었음을 표시
        wasHandDetected = true;
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('gesture-detected', captureGesture);

    // 카운트다운
    let count = 8;
    const countInterval = setInterval(() => {
      count--;
      setCountdown(count);
      console.log(`[⏱️ 카운트다운] ${count}초 남음, 현재 손 감지 상태: ${handDetected}`);

      // 손 감지 상태 업데이트
      wasHandDetected = wasHandDetected || handDetected;

      if (count <= 0) {
        clearInterval(countInterval);

        // 리스너 제거
        window.removeEventListener('gesture-detected', captureGesture);

        // 카운트다운 완료 상태 설정
        setIsCountingDown(false);

        // 디버깅 로그 추가
        console.log(`[⏱️ 카운트다운 완료] 손 감지 여부: ${wasHandDetected}`);
        console.log('[🔍 디버깅] finalGesture:', finalGesture);
        console.log('[🔍 디버깅] detectedGesture:', detectedGesture);
        console.log('[🔍 디버깅] 전역 제스처:', window.lastDetectedGesture);

        // 전역 변수에서 제스처 가져오기
        if (!finalGesture && window.lastDetectedGesture) {
          finalGesture = window.lastDetectedGesture.gesture;
          console.log(`[🖐️ 전역 변수에서 제스처 가져옴] ${finalGesture}`);
        }

        // 최종 제스처 선택 (우선순위: 이벤트 캡처 > 전역 변수 > 상태 변수)
        const gestureToUse = finalGesture || detectedGesture;
        console.log(`[🔍 사용할 최종 제스처] ${gestureToUse || '없음'}`);

        // API 비활성화
        setApiActive(false);

        // 1. 손 감지가 일어나지 않았을 때
        if (!wasHandDetected) {
          toast.dismiss();
          toast.warning('손 감지 경고', {
            description:
              '손이 카메라에 인식되지 않았습니다. 손을 화면 내에 전부 들어가게 해주세요.',
            duration: 3000,
          });

          setGuideText('버튼을 눌러 다시 시도해 주세요');
          setIsErrorToastShown(true);
          return;
        }

        // 2. API 결과가 none인 경우 또는 제스처가 감지되지 않은 경우
        if (!gestureToUse || gestureToUse === 'none') {
          toast.dismiss();
          toast.warning('제스처 인식 오류', {
            description: '유효한 제스처가 감지되지 않았습니다. 다시 시도해 주세요.',
            duration: 3000,
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
          });

          setGuideText('다른 제스처로 다시 시도해 주세요');
          setIsErrorToastShown(true);

          // devil 제스처인 경우에만 검색으로 넘어감
          if (gestureToUse === 'devil') {
            setTimeout(() => {
              const targetUrl = `/search/camera?gesture_label=${gestureToUse}`;
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

        // 약간의 지연 후 페이지 이동 (토스트 메시지가 보이도록)
        setTimeout(() => {
          const targetUrl = `/search/camera?gesture_label=${gestureToUse}`;
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
        }, 500); // 토스트 메시지가 보일 수 있도록 약간의 지연
      }
    }, 1000);

    return () => {
      clearInterval(countInterval);
      window.removeEventListener('gesture-detected', captureGesture);
    };
  }, [detectedGesture, inappropriateGestures, location.pathname, navigate, handDetected]);

  // 캡처 버튼 클릭 핸들러
  const handleCaptureClick = useCallback(() => {
    // 이미 타이머가 실행 중이면 중복 실행 방지
    if (isPreparingGesture || isCountingDown) {
      return;
    }

    // 토스트 메시지 모두 제거
    toast.dismiss();

    // 타이머 정리
    clearTimer();

    // 상태 초기화
    setIsPreparingGesture(false);
    setIsCountingDown(false);
    setPreparationCountdown(2);
    setCountdown(3);
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
      setApiActive(true);
      startPreparationTimer();
    }, 300);
  }, [isPreparingGesture, isCountingDown, clearTimer, startPreparationTimer]);

  // 연결 상태 콜백
  const handleConnectionStatus = useCallback((status: boolean) => {
    setIsApiConnected(status);
  }, []);

  // 모달 열기/닫기 처리
  const handleDialogOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        resetAllState();
      }
      setOpen(isOpen);
    },
    [resetAllState]
  );

  // 모달 열릴 때 상태 초기화
  useEffect(() => {
    if (open) {
      resetAllState();
    }
  }, [open, resetAllState]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      cleanupTimers();
      toast.dismiss();
    };
  }, [cleanupTimers]);

  // 전역 시퀀스 리셋 함수 등록
  useEffect(() => {
    // WebCamera 컴포넌트에서 사용할 전역 시퀀스 리셋 함수 등록
    if (window.resetGestureSequence) {
      console.log('[🔄 기존 전역 시퀀스 리셋 함수 발견]');
    } else {
      console.log('[🔄 전역 시퀀스 리셋 함수 등록]');
      window.resetGestureSequence = () => {
        console.log('[🔄 전역에서 시퀀스 리셋 요청됨]');
        // 이 함수는 WebCamera에서 resetSequence 메서드를 호출하는 데 사용됨
      };
    }

    return () => {
      // 컴포넌트 언마운트 시 전역 함수 제거
      window.resetGestureSequence = undefined;
    };
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
              isPaused={!apiActive}
              onHandDetected={handleHandDetected}
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
