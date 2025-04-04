import { useEffect } from 'react';
import { GestureDetectedEvent } from '@/types/gesture';
import { useGestureStore } from '@/stores/useGesturStore';

interface UseGestureEventsProps {
  isOpen: boolean;
}

export const useGestureEvents = ({ isOpen }: UseGestureEventsProps) => {
  const {
    isPreparingGesture,
    isCountingDown,
    guideText,
    isErrorToastShown,
    setCurrentGesture,
    setCurrentConfidence,
    updateGestureFrequency,
  } = useGestureStore();

  // 제스처 감지 리스너 설정
  useEffect(() => {
    // 제스처 이벤트 핸들러
    const handleGestureDetected = (event: Event) => {
      // 모달이 닫혀있으면 이벤트 무시
      if (!isOpen) {
        return;
      }

      // 이미 오류가 발생했거나, 특정 상태에서는 이벤트 무시
      if (
        isErrorToastShown ||
        (!isPreparingGesture && !isCountingDown && guideText === '인식 완료!') ||
        guideText === '버튼을 눌러 다시 시도해 주세요'
      ) {
        return;
      }

      const gestureEvent = event as GestureDetectedEvent;

      if (gestureEvent.detail && gestureEvent.detail.gesture) {
        const { gesture, confidence } = gestureEvent.detail;

        // 현재 감지된 제스처 업데이트
        setCurrentGesture(gesture);
        setCurrentConfidence(confidence);

        // 제스처 유지 카운트다운 중인 경우에만 히스토리에 기록
        if (isCountingDown) {
          updateGestureFrequency(gesture);
        }
      }
    };

    // 이벤트 리스너 등록 (모달이 열려 있을 때만)
    if (isOpen) {
      window.addEventListener('gesture-detected', handleGestureDetected);
    }

    // 컴포넌트 언마운트 시 또는 의존성 변경 시 리스너 제거
    return () => {
      window.removeEventListener('gesture-detected', handleGestureDetected);
    };
  }, [
    isOpen,
    isPreparingGesture,
    isCountingDown,
    guideText,
    isErrorToastShown,
    setCurrentGesture,
    setCurrentConfidence,
    updateGestureFrequency,
  ]);
};
