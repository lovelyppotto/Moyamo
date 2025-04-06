import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { useHandLandmarker } from '@/hooks/useHandLandmarker';
import { useGestureWebSocket } from '@/hooks/useGestureWebSocket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

interface GesturePracticeCameraProps {
  // 가이드라인 svg 조절 props
  guidelineClassName?: string;
  guideText?: string;
  // 연결 상태를 외부에서 제어할 수 있도록 추가
  onConnectionStatus?: (status: boolean) => void;
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
  onConnectionStatus,
  gestureLabel,
}: GesturePracticeCameraProps) => {
  // 웹소켓 서비스 사용
  const {
    status: wsStatus,
    gesture,
    confidence,
    sendLandmarks,
    connect: connectWs,
    disconnect: disconnectWs,
  } = useGestureWebSocket();

  // HandLandmarker 훅 사용
  const { isLoading, error, detectFrame, HAND_CONNECTIONS, drawLandmarks, drawConnectors } =
    useHandLandmarker();

  // 정확도가 70% 이상인지 확인하는 상태
  const [isCorrect, setIsCorrect] = useState(false);
  // 가이드라인 표시 상태
  const [showGuideline, setShowGuideline] = useState(true);
  // 카메라 활성화 상태
  const [cameraActive, setCameraActive] = useState(true);

  // 최근 3초 동안의 제스처 프레임을 저장하는 상태
  const [gestureFrames, setGestureFrames] = useState<GestureFrame[]>([]);
  // 최빈값 제스처 상태
  const [mostFrequentGesture, setMostFrequentGesture] = useState<string | null>(null);

  // 컴포넌트 상태 및 참조
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const resultsRef = useRef<HandLandmarkerResult | null>(null);
  const correctTimeRef = useRef<NodeJS.Timeout | null>(null);
  const processingFramesRef = useRef<boolean>(false);

  // 부모 컴포넌트에 웹소켓 연결 상태 알림
  useEffect(() => {
    if (onConnectionStatus) {
      onConnectionStatus(wsStatus === 'open');
    }
  }, [wsStatus, onConnectionStatus]);

  // 컴포넌트 마운트 시 웹소켓 연결
  useEffect(() => {
    console.log('[🔍 GesturePracticeCamera 컴포넌트 마운트]');

    // 약간의 지연 후 웹소켓 연결 시작
    const timer = setTimeout(() => {
      console.log('[🔍 웹소켓 연결 시작]');
      connectWs();
    }, 500);

    return () => {
      console.log('[🔍 GesturePracticeCamera 컴포넌트 언마운트]');
      clearTimeout(timer);

      // 애니메이션 정리
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // 타이머 정리
      if (correctTimeRef.current) {
        clearTimeout(correctTimeRef.current);
      }

      // WebSocket 연결 해제
      disconnectWs();
    };
  }, [connectWs, disconnectWs]);

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

    // 애니메이션 프레임 다시 시작
    if (!animationRef.current && !isLoading && !error) {
      requestAnimationFrame(predictWebcam);
    }
  }, [isLoading, error]);

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

          // 애니메이션 정리
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
        }
      } finally {
        processingFramesRef.current = false;
      }
    }, 500); // 500ms마다 최빈값 계산 및 확인

    return () => {
      clearInterval(processFramesInterval);
    };
  }, [gestureFrames, gestureLabel, calculateMostFrequentGesture, cameraActive]);

  // 제스처 정보가 변경될 때마다 프레임 추가 및 이벤트 발행
  useEffect(() => {
    if (gesture && confidence !== null && cameraActive) {
      // 현재 제스처 프레임을 기록
      setGestureFrames((prev) => [
        ...prev,
        {
          gesture,
          confidence,
          timestamp: Date.now(),
        },
      ]);

      // 커스텀 이벤트 생성하여 제스처 데이터 전달
      const gestureEvent = new CustomEvent('gesture-detected', {
        detail: { gesture, confidence },
      });

      // 이벤트 발행
      window.dispatchEvent(gestureEvent);

      console.log(
        `[🔍 제스처 이벤트 발행] "${gesture}", "confidence": ${confidence}, "mostFrequent": ${mostFrequentGesture}, "expected": ${gestureLabel}`
      );
    }
  }, [gesture, confidence, mostFrequentGesture, gestureLabel, cameraActive]);

  // 웹캠에서 프레임을 가져와 처리하는 함수
  const predictWebcam = useCallback(async () => {
    if (!webcamRef.current || !webcamRef.current.video || !canvasRef.current || !cameraActive) {
      // 카메라가 비활성화되어 있거나 준비가 안 된 경우
      if (cameraActive) {
        // 카메라는 활성화 상태지만 준비가 안 되었으면 다음 프레임에서 다시 시도
        animationRef.current = requestAnimationFrame(predictWebcam);
      }
      return;
    }

    const video = webcamRef.current.video;

    // 비디오 프레임에서 손 랜드마크 감지
    const results = await detectFrame(video);

    if (results) {
      resultsRef.current = results;

      // 손 랜드마크가 감지되면 즉시 서버로 전송
      if (results.landmarks && results.landmarks.length > 0) {
        sendLandmarks(results.landmarks);
      }

      // 캔버스에 랜드마크 그리기
      drawCanvas(results);
    }

    // 다음 프레임 처리
    animationRef.current = requestAnimationFrame(predictWebcam);
  }, [detectFrame, sendLandmarks, cameraActive]);

  // 캔버스에 랜드마크 그리기 함수
  const drawCanvas = useCallback(
    (results: HandLandmarkerResult) => {
      const canvasCtx = canvasRef.current!.getContext('2d')!;
      const width = canvasRef.current!.width;
      const height = canvasRef.current!.height;

      // 캔버스 초기화
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, width, height);

      // 정사각형 영역에 비디오 그리기
      if (webcamRef.current && webcamRef.current.video) {
        const video = webcamRef.current.video;

        // 정사각형 크기 계산
        const size = Math.min(width, height);
        const offsetX = (width - size) / 2;
        const offsetY = (height - size) / 2;

        // 정사각형 영역에 비디오 그리기
        canvasCtx.drawImage(video, offsetX, offsetY, size, size);
      }

      // 랜드마크 그리기
      if (results.landmarks) {
        for (const landmarks of results.landmarks) {
          // 관절 연결선 그리기 (손가락과 손 윤곽)
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: '#ebc853',
            lineWidth: 5,
          });

          // 랜드마크 점 그리기
          drawLandmarks(canvasCtx, landmarks, {
            color: '#fffcc6',
            lineWidth: 2,
            radius: 4,
          });
        }
      }

      canvasCtx.restore();
    },
    [HAND_CONNECTIONS, drawConnectors, drawLandmarks]
  );

  // 모델 로딩이 완료되면 웹캠 예측 시작
  useEffect(() => {
    if (!isLoading && !error && cameraActive) {
      predictWebcam();
    }
  }, [isLoading, error, predictWebcam, cameraActive]);

  // 에러 발생 시 로깅
  useEffect(() => {
    if (error) {
      console.error('[🖐️ HandLandmarker 오류]', error);
    }
  }, [error]);

  return (
    <div className="w-full bg-white relative overflow-hidden rounded-lg drop-shadow-basic">
      <div className="relative w-full h-full aspect-square">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="text-white text-xl font-bold">모델 로딩 중...</div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="text-red-500 text-xl font-bold">모델 로딩 오류</div>
          </div>
        )}

        {/* 웹캠 (숨겨진 상태) */}
        <Webcam
          audio={false}
          width={720} // 정사각형에 가까운 비율
          height={720}
          ref={webcamRef}
          videoConstraints={{
            facingMode: 'user',
            width: 720,
            height: 720,
          }}
          className="invisible absolute"
        />

        {/* 캔버스 (웹캠 화면과 손 랜드마크를 표시) */}
        <canvas
          ref={canvasRef}
          width={720}
          height={720}
          className="w-full h-full"
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* 정확도 70% 이상이고 gestureLabel과 일치할 때만 정답 표시 */}
        {isCorrect && (
          <div className="absolute flex justify-center items-center top-16 left-4 lg:top-25 lg:right-4 z-10">
            <img src="/images/correct_mark.svg" alt="correct_mark" className="w-[40%] lg:w-[76%]" />
          </div>
        )}

        {/* 가이드라인 컨테이너 */}
        {showGuideline && (
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <div className="relative w-full h-[90%] flex justify-center items-center overflow-hidden">
              {/* SVG 가이드라인 */}
              <img
                src="/images/guide-line.svg"
                alt="카메라 가이드라인"
                className={`absolute ${guidelineClassName}`}
              />
              {/* 안내 텍스트 - 위치 조정 */}
              <p
                className="absolute top-5 text-center
                text-sm md:text-lg xl:text-xl font-[NanumSquareRoundEB] text-white
                drop-shadow-basic"
              >
                {guideText}
              </p>
            </div>
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
