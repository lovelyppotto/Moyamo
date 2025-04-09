import React, { useEffect } from 'react';
import WebCamera from '../WebCamera';
import { useGestureHttpApi } from '@/hooks/useGestureHttpApi';

interface CameraDialogContentProps {
  open: boolean;
  guideText?: string;
  onConnectionStatus?: (status: boolean) => void;
  isPaused: boolean;
  onHandDetected?: (detected: boolean) => void;
}

/**
 * 카메라 다이얼로그의 내용 컴포넌트
 * - 웹캠 출력 및 상태 관리
 */
const CameraDialogContent: React.FC<CameraDialogContentProps> = ({
  open,
  guideText = '제스처를 준비해주세요',
  onConnectionStatus,
  isPaused,
  onHandDetected,
}) => {
  // useGestureHttpApi 훅의 resetSequence 메서드에 접근하기 위한 참조
  const { resetSequence } = useGestureHttpApi();

  // 컴포넌트 마운트 시 전역 시퀀스 리셋 함수 연결
  useEffect(() => {
    if (resetSequence) {
      // 전역 함수에 실제 resetSequence 메서드 연결
      window.resetGestureSequence = resetSequence;

      console.log('[🔄 전역 시퀀스 리셋 함수 연결됨]');
    }

    return () => {
      // 컴포넌트 언마운트 시 연결 해제
      window.resetGestureSequence = undefined;
      console.log('[🔄 전역 시퀀스 리셋 함수 연결 해제]');
    };
  }, [resetSequence]);

  // 모달이 열릴 때마다 시퀀스 초기화
  useEffect(() => {
    if (open && resetSequence) {
      resetSequence();
      console.log('[🔄 모달 열림: 시퀀스 초기화]');
    }
  }, [open, resetSequence]);

  // 일시 정지 상태 변경 시 시퀀스 초기화
  useEffect(() => {
    if (isPaused && resetSequence) {
      resetSequence();
      console.log('[🔄 일시 정지: 시퀀스 초기화]');
    }
  }, [isPaused, resetSequence]);

  return (
    <div className="w-full aspect-square bg-gray-100 relative">
      {open && (
        <WebCamera
          guidelineClassName="w-[70%] h-auto top-20 opacity-70"
          guideText={guideText}
          onConnectionStatus={onConnectionStatus}
          isPaused={isPaused}
          onHandDetected={onHandDetected}
        />
      )}
    </div>
  );
};

export default CameraDialogContent;
