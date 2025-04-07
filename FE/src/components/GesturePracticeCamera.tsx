import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import WebCamera from './WebCamera';

interface GesturePracticeCameraProps {
  guidelineClassName?: string;
  guideText?: string;
  gestureLabel?: string;
}

const GesturePracticeCamera = ({
  guidelineClassName,
  guideText,
  gestureLabel,
}: GesturePracticeCameraProps) => {
  const [isCorrect, setIsCorrect] = useState(false);
  const [showGuideline, setShowGuideline] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);

  // 컨테이너 크기 조절을 위한 상태
  const [containerDimension, setContainerDimension] = useState('aspect-square');
  const containerRef = useRef<HTMLDivElement>(null);
  const correctTimeRef = useRef<NodeJS.Timeout | null>(null);

  // 반응형 컨테이너 조정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg 브레이크포인트
        setContainerDimension('h-[70vh] aspect-square');
      } else {
        setContainerDimension('h-[38vh] aspect-square');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleGesture = useCallback(
    (gesture: string, confidence: number) => {
      if (cameraActive) {
        console.log(
          `[🔍 제스처 이벤트] "${gesture}", "confidence": ${confidence}, "expected": ${gestureLabel}`
        );

        if (confidence >= 70 && gesture === gestureLabel) {
          setIsCorrect(true);
          setShowGuideline(false);
          setCameraActive(false);

          if (correctTimeRef.current) {
            clearTimeout(correctTimeRef.current);
          }
          correctTimeRef.current = setTimeout(() => {
            setIsCorrect(false);
          }, 1000);
        }
      }
    },
    [cameraActive, gestureLabel]
  );

  const handleRestart = useCallback(() => {
    setIsCorrect(false);
    setShowGuideline(true);
    setCameraActive(true);

    if (correctTimeRef.current) {
      clearTimeout(correctTimeRef.current);
      correctTimeRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (correctTimeRef.current) {
        clearTimeout(correctTimeRef.current);
      }
    };
  }, []);

  const handleConnectionStatus = useCallback((status: boolean) => {
    setWsConnected(status);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full ${containerDimension} bg-white relative overflow-hidden rounded-lg drop-shadow-basic`}
    >
      {/* 고정 비율 유지를 위한 래퍼 */}
      <div className="relative w-full h-full">
        {/* WebCamera 컴포넌트 사용 */}
        <WebCamera
          guidelineClassName={guidelineClassName}
          guideText={guideText}
          onConnectionStatus={handleConnectionStatus}
          isPaused={!cameraActive}
          onGesture={handleGesture}
          showGuideline={showGuideline}
        />

        {/* 정확도 70% 이상일 때 정답 표시 */}
        {isCorrect && (
          <div className="absolute inset-0 flex justify-center items-center z-10 pointer-events-none">
            <img
              src="/images/correct_mark.svg"
              alt="correct_mark"
              className="w-50 lg:w-80 max-w-[70%]"
            />
          </div>
        )}

        {/* 카메라 비활성화 시 오버레이 및 다시하기 버튼 */}
        {!cameraActive && !isCorrect && (
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center z-20">
            <button
              className="bg-kr-400 hover:bg-kr-500 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 md:py-3 md:px-8 rounded-full shadow-md transition-colors text-md lg:text-lg"
              onClick={handleRestart}
            >
              <FontAwesomeIcon icon={faRotateRight} className="mr-1 sm:mr-2" />
              <span> 다시 연습하기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GesturePracticeCamera;
