import { useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useGestureStore } from '@/stores/useGesturStore';

interface UseGestureTimerProps {
  isOpen: boolean;
  onTimerComplete: (gesture: string) => void;  // 제스처 파라미터 추가
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
    getMostFrequentGesture
  } = useGestureStore();
  
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  let toastCount = 0;
  
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
  
  // 제스처 결과 확인 함수
  const checkGestureResult = useCallback(() => {
    const detectedGesture = getMostFrequentGesture();
    const { gestureFrequency } = useGestureStore.getState();
    
    // 손 감지 여부 확인 (gestureFrequency가 비어 있으면 손이 감지되지 않은 것)
    const isHandDetected = Object.keys(gestureFrequency).length > 0;
    
    if (detectedGesture && detectedGesture !== "없음") {
      // 제스처 감지 성공 (유효한 제스처인 경우)
      setGuideText('인식 완료!');
      
      // 타이머 완료 콜백 (성공 시)
      setTimeout(() => onTimerComplete(detectedGesture), 300);
    } else {
      // 제스처 감지 실패 또는 '없음' 제스처인 경우
      setGuideText('버튼을 눌러 다시 시도해 주세요');
      setErrorState(true);
      
      // 토스트 카운터 증가 (매번 다른 ID 생성)
      toastCount++;
      
      if (!isHandDetected) {
        // 손이 감지되지 않은 경우
        toast.warning('손 감지 경고', {
          description: '손이 카메라에 인식되지 않았습니다. 손을 가이드라인 안에 위치시켜 주세요.',
          duration: 3000,
          position: 'top-right',
          id: `hand-not-detected-${toastCount}-${Date.now()}`,
          icon: '🖐️', // 손 이모지 추가
        });
      } else {
        // 손은 감지되었지만 유효한 제스처가 아닌 경우
        toast.info('제스처 인식 정보', {
          description: '제스처를 인식할 수 없습니다. 다른 제스처로 다시 시도해 주세요.',
          duration: 3000,
          position: 'top-right',
          id: `invalid-gesture-${toastCount}-${Date.now()}`,
          icon: '💬', // 정보 이모지 추가
        });
      }
    }
  }, [getMostFrequentGesture, setGuideText, setErrorState, onTimerComplete]);
  
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
        
        // 카운트다운 완료 후 제스처 결과 확인
        checkGestureResult();
      }
    }, 1000);
  }, [
    setPreparationState, 
    setCountdownState, 
    setGuideText, 
    decrementCountdown, 
    checkGestureResult
  ]);
  
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
        id: useGestureStore.getState().getUniqueToastId('server-connection-failed'),
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
    startActualCountdown
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
    clearTimers
  };
};