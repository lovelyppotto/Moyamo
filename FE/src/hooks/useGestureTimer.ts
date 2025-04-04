import { useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useGestureStore } from '@/stores/useGesturStore';

interface UseGestureTimerProps {
  isOpen: boolean;
  onTimerComplete: () => void;
}

export const useGestureTimer = ({ isOpen, onTimerComplete }: UseGestureTimerProps) => {
  const {
    isPreparingGesture,
    isCountingDown,
    isWebSocketConnected,
    setPreparationState,
    setCountdownState,
    decrementPreparationCountdown,
    decrementCountdown,
    setGuideText,
    setErrorState,
    resetGestureData,
  } = useGestureStore();

  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 정리 함수
  const clearTimers = useCallback(() => {
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 준비 타이머에서 실제 타이머로 전환
  const startActualCountdown = useCallback(() => {
    console.log('[⏱️ 실제 카운트다운] 시작');

    setPreparationState(false);
    setCountdownState(true);
    setGuideText('제스처를 유지해주세요');

    timerRef.current = setInterval(() => {
      decrementCountdown();

      // Zustand에서 현재 값을 가져올 수 없으므로 상태 확인용 함수 추가
      const countdown = useGestureStore.getState().countdown;

      if (countdown <= 1) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        setCountdownState(false);
        setGuideText('인식 완료!');

        // 타이머 완료 콜백
        setTimeout(onTimerComplete, 300);
      }
    }, 1000);
  }, [setPreparationState, setCountdownState, setGuideText, decrementCountdown, onTimerComplete]);

  // 준비 타이머 시작
  const startPreparationTimer = useCallback(() => {
    // 이미 타이머가 실행 중이면 중복 실행 방지
    if (isPreparingGesture || isCountingDown) {
      return;
    }

    if (!isWebSocketConnected) {
      toast.dismiss();
      toast.error('서버 연결 실패', {
        description: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
        duration: 3000,
        id: 'server-connection-failed',
      });
      return;
    }

    console.log('[⏱️ 준비 카운트다운] 시작');

    // 제스처 데이터 초기화
    resetGestureData();

    // 준비 상태 설정
    setPreparationState(true);
    setGuideText('제스처를 준비해주세요');

    // 기존 타이머 정리
    clearTimers();

    // 준비 타이머 시작
    prepTimerRef.current = setInterval(() => {
      decrementPreparationCountdown();

      // Zustand에서 현재 값을 가져올 수 없으므로 상태 확인용 함수 추가
      const countdown = useGestureStore.getState().preparationCountdown;

      if (countdown <= 1) {
        if (prepTimerRef.current) {
          clearInterval(prepTimerRef.current);
          prepTimerRef.current = null;
        }

        // 준비 완료 후 실제 카운트다운 시작
        startActualCountdown();
      }
    }, 1000);
  }, [
    isPreparingGesture,
    isCountingDown,
    isWebSocketConnected,
    resetGestureData,
    setPreparationState,
    setGuideText,
    clearTimers,
    decrementPreparationCountdown,
    startActualCountdown,
  ]);

  // 오류 발생 시 재시도 처리
  const handleRetry = useCallback(() => {
    setErrorState(false);
    setGuideText('버튼을 누르면 검색이 진행됩니다');
    setTimeout(() => {
      startPreparationTimer();
    }, 100);
  }, [setErrorState, setGuideText, startPreparationTimer]);

  // 모달이 닫힐 때 타이머 정리
  useEffect(() => {
    if (!isOpen) {
      clearTimers();
    }

    return () => {
      clearTimers();
    };
  }, [isOpen, clearTimers]);

  return {
    startPreparationTimer,
    handleRetry,
    clearTimers,
  };
};
