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

interface GestureFrame {
  gesture: string;
  confidence: number;
  timestamp: number;
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
  const [gestureFrames, setGestureFrames] = useState<GestureFrame[]>([]);
  const [mostFrequentGesture, setMostFrequentGesture] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  // 참조
  const correctTimeRef = useRef<NodeJS.Timeout | null>(null);
  const processingFramesRef = useRef<boolean>(false);

  // WebCamera에서 받은 제스처 처리
  const handleGesture = useCallback(
    (gesture: string, confidence: number) => {
      if (cameraActive) {
        // 현재 제스처 프레임을 기록
        setGestureFrames((prev) => [
          ...prev,
          {
            gesture,
            confidence,
            timestamp: Date.now(),
          },
        ]);

        console.log(
          `[🔍 제스처 이벤트] "${gesture}", "confidence": ${confidence}, "mostFrequent": ${mostFrequentGesture}, "expected": ${gestureLabel}`
        );
      }
    },
    [cameraActive, mostFrequentGesture, gestureLabel]
  );

  // 다시하기 버튼 핸들러
  const handleRestart = useCallback(() => {
    // 상태 초기화
    setIsCorrect(false);
    setShowGuideline(true);
    setGestureFrames([]);
    setMostFrequentGesture(null);
    setCameraActive(true);

    // 타이머 정리
    if (correctTimeRef.current) {
      clearTimeout(correctTimeRef.current);
      correctTimeRef.current = null;
    }
  }, []);

  // 최빈값 계산 함수
  const calculateMostFrequentGesture = useCallback((frames: GestureFrame[]) => {
    if (frames.length === 0) return null;

    // 70% 이상 프레임만 필터링
    const confidentFrames = frames.filter((frame) => frame.confidence >= 70);

    if (confidentFrames.length === 0) return null;

    // 제스처별 빈도수 계산
    const gestureCounts: Record<string, number> = {};

    for (const frame of confidentFrames) {
      if (frame.gesture) {
        gestureCounts[frame.gesture] = (gestureCounts[frame.gesture] || 0) + 1;
      }
    }

    // 최빈값 찾기
    let mostFrequent: string | null = null;
    let highestCount = 0;

    for (const [gesture, count] of Object.entries(gestureCounts)) {
      if (count > highestCount) {
        mostFrequent = gesture;
        highestCount = count;
      }
    }

    return mostFrequent;
  }, []);

  // 정기적으로 최빈값 계산 및 확인
  useEffect(() => {
    if (processingFramesRef.current || !cameraActive) return;

    const processFramesInterval = setInterval(() => {
      if (gestureFrames.length === 0) return;

      processingFramesRef.current = true;

      try {
        // 현재 시간 기준 3초 이내의 프레임만 유지
        const now = Date.now();
        const recentFrames = gestureFrames.filter((frame) => now - frame.timestamp <= 3000);

        // 프레임 목록 업데이트
        setGestureFrames(recentFrames);

        // 최빈값 계산
        const frequentGesture = calculateMostFrequentGesture(recentFrames);
        setMostFrequentGesture(frequentGesture);

        // 최빈값 제스처가 gestureLabel과 일치하는지 확인
        if (frequentGesture && frequentGesture === gestureLabel) {
          // 타이머 제거
          if (correctTimeRef.current) {
            clearTimeout(correctTimeRef.current);
          }

          // 정답 표시, 가이드라인 숨김 설정, 카메라 비활성화
          setIsCorrect(true);
          setShowGuideline(false);
          setCameraActive(false);
        }
      } finally {
        processingFramesRef.current = false;
      }
    }, 500); // 500ms마다 최빈값 계산 및 확인

    return () => {
      clearInterval(processFramesInterval);
    };
  }, [gestureFrames, gestureLabel, calculateMostFrequentGesture, cameraActive]);

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
        {!cameraActive && (
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
