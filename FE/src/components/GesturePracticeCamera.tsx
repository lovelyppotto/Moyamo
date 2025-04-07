import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import WebCamera from './WebCamera';

interface GesturePracticeCameraProps {
  // 가이드라인 svg 조절 props
  guidelineClassName?: string;
  guideText?: string;
  gestureLabel?: string;
}

const GesturePracticeCamera = ({
  guidelineClassName,
  guideText,
  gestureLabel,
}: GesturePracticeCameraProps) => {
  // 상태 관리
  const [isCorrect, setIsCorrect] = useState(false);
  const [showGuideline, setShowGuideline] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);

  // 참조
  const correctTimeRef = useRef<NodeJS.Timeout | null>(null);

  // WebCamera에서 받은 제스처 처리
  const handleGesture = useCallback(
    (gesture: string, confidence: number) => {
      if (cameraActive) {
        console.log(
          `[🔍 제스처 이벤트] "${gesture}", "confidence": ${confidence}, "expected": ${gestureLabel}`
        );

        // 신뢰도가 70% 이상이고 gestureLabel과 일치하면 카메라 종료
        if (confidence >= 70 && gesture === gestureLabel) {
          // 정답 표시, 가이드라인 숨김 설정, 카메라 비활성화
          setIsCorrect(true);
          setShowGuideline(false);
          setCameraActive(false);

          // 1초 후에 정답 표시 숨기고 다시하기 버튼 표시
          if (correctTimeRef.current) {
            clearTimeout(correctTimeRef.current);
          }
          correctTimeRef.current = setTimeout(() => {
            setIsCorrect(false);
          }, 1500);
        }
      }
    },
    [cameraActive, gestureLabel]
  );

  // 다시하기 버튼 핸들러
  const handleRestart = useCallback(() => {
    // 상태 초기화
    setIsCorrect(false);
    setShowGuideline(true);
    setCameraActive(true);

    // 타이머 정리
    if (correctTimeRef.current) {
      clearTimeout(correctTimeRef.current);
      correctTimeRef.current = null;
    }
  }, []);

  // 컴포넌트 언마운트 시 리소스 정리
  useEffect(() => {
    return () => {
      if (correctTimeRef.current) {
        clearTimeout(correctTimeRef.current);
      }
    };
  }, []);

  // 웹소켓 연결 상태 처리
  const handleConnectionStatus = useCallback((status: boolean) => {
    setWsConnected(status);
  }, []);

  return (
    <div className="w-full bg-white relative overflow-hidden rounded-lg drop-shadow-basic">
      <div className="relative w-full h-full aspect-square">
        {/* WebCamera 컴포넌트 사용 */}
        <WebCamera
          guidelineClassName={guidelineClassName}
          guideText={guideText}
          onConnectionStatus={handleConnectionStatus}
          isPaused={!cameraActive}
          onGesture={handleGesture}
        />

        {/* 정확도 70% 이상이고 gestureLabel과 일치할 때만 정답 표시 */}
        {isCorrect && (
          <div className="absolute flex justify-center items-center top-16 left-4 lg:top-25 lg:right-4 z-10">
            <img src="/images/correct_mark.svg" alt="correct_mark" className="w-[40%] lg:w-[76%]" />
          </div>
        )}

        {/* 카메라 비활성화 시 오버레이 및 다시하기 버튼 */}
        {!cameraActive && !isCorrect && (
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center z-20">
            <div className="text-white text-xl font-bold text-center mb-6"></div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-md transition-colors"
              onClick={handleRestart}
            >
              <FontAwesomeIcon icon={faRotateRight} className="mr-0.5 sm:mr-1.5" />
              <span> 다시 연습하기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GesturePracticeCamera;
