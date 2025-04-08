import { useCallback, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { useHandLandmarker } from '@/hooks/useHandLandmarker';
import { useGestureHttpApi } from '@/hooks/useGestureHttpApi';

interface WebCameraProps {
  // 가이드라인 svg 조절 props
  guidelineClassName?: string;
  guideText?: string;
  // 연결 상태를 외부에서 제어할 수 있도록 추가
  onConnectionStatus?: (status: boolean) => void;
  isPaused?: boolean;
  onGesture?: (gesture: string, confidence: number) => void;
  // 가이드라인 표시 여부 제어
  showGuideline?: boolean;
}

const WebCamera = ({
  guidelineClassName,
  guideText,
  onConnectionStatus,
  isPaused = true,
  onGesture,
  showGuideline = true,
}: WebCameraProps) => {
  // HTTP API 서비스 사용
  const {
    status: apiStatus,
    gesture,
    confidence,
    sendLandmarks,
    connect: connectApi,
    disconnect: disconnectApi,
  } = useGestureHttpApi();

  // HandLandmarker 훅 사용
  const { isLoading, error, detectFrame, HAND_CONNECTIONS, drawLandmarks, drawConnectors } =
    useHandLandmarker();

  // 컴포넌트 상태 및 참조
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const resultsRef = useRef<HandLandmarkerResult | null>(null);

  // 마지막으로 이벤트를 발행한 시간 추적
  const lastEventTimeRef = useRef<number>(0);
  // 이벤트 쓰로틀링 간격 (ms)
  const EVENT_THROTTLE = 150;

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

  // 부모 컴포넌트에 API 연결 상태 알림
  useEffect(() => {
    if (onConnectionStatus) {
      onConnectionStatus(apiStatus === 'open');
    }
  }, [apiStatus, onConnectionStatus]);

  // 컴포넌트 마운트 시 API 연결
  useEffect(() => {
    if (!isPaused) {
      console.log('[🔍 WebCamera 컴포넌트 활성화됨]');

      // API URL 확인
      console.log('[🔍 API URL]', import.meta.env.VITE_API_BASE_URL);

      // API 연결 시작 전에 약간의 지연
      const timer = setTimeout(() => {
        console.log('[🔍 API 연결 시작]');
        connectApi();
      }, 1000); // 1초로 지연 시간 설정

      return () => {
        clearTimeout(timer);
        disconnectApi();

        // 웹캠 리소스 명시적으로 해제
        if (webcamRef.current && webcamRef.current.video) {
          const video = webcamRef.current.video;
          if (video.srcObject) {
            const tracks = (video.srcObject as MediaStream).getTracks();
            tracks.forEach((track) => track.stop());
            video.srcObject = null;
          }
        }
      };
    }
  }, [connectApi, disconnectApi, isPaused]);

  // 제스처 정보가 변경될 때마다 이벤트 발행 (부모 컴포넌트로 데이터 전달)
  useEffect(() => {
    // isPaused가 true이거나 gesture가 없으면 이벤트를 발행하지 않음
    if (gesture && !isPaused) {
      const now = Date.now();

      // 마지막 이벤트 발행 시간으로부터 EVENT_THROTTLE 시간이 지났는지 확인
      if (now - lastEventTimeRef.current > EVENT_THROTTLE) {
        // 커스텀 이벤트 생성하여 제스처 데이터 전달
        const gestureEvent = new CustomEvent('gesture-detected', {
          detail: { gesture, confidence },
        });

        // 이벤트 발행
        window.dispatchEvent(gestureEvent);
        if (onGesture) {
          onGesture(gesture, confidence || 0);
        }

        lastEventTimeRef.current = now;
      }
    }
  }, [gesture, confidence, isPaused, onGesture]);

  // 웹캠에서 프레임을 가져와 처리하는 함수
  const predictWebcam = useCallback(async () => {
    // isPaused가 true이면 프로세싱을 중단
    if (isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    if (!webcamRef.current || !webcamRef.current.video || !canvasRef.current) {
      // 아직 준비가 안 되었으면 다음 프레임에서 다시 시도
      animationRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    const video = webcamRef.current.video;

    try {
      // 비디오 프레임에서 손 랜드마크 감지
      const results = await detectFrame(video);

      if (results) {
        resultsRef.current = results;

        // 손 랜드마크가 감지되면 즉시 서버로 전송
        if (results.landmarks && results.landmarks.length > 0 && !isPaused) {
          sendLandmarks(results.landmarks);
        }

        // 캔버스에 랜드마크 그리기
        if (canvasRef.current) {
          // 추가 안전 검사
          drawCanvas(results);
        }
      }
    } catch (e) {
      console.error('[🖐️ 손 감지 오류]', e);
    }

    // 다음 프레임 처리
    if (!isPaused) {
      animationRef.current = requestAnimationFrame(predictWebcam);
    }
  }, [detectFrame, sendLandmarks, drawCanvas, isPaused]);

  // 모델 로딩이 완료되면 웹캠 예측 시작
  useEffect(() => {
    if (!isLoading && !error && !isPaused) {
      console.log('[🔍 WebCamera] 예측 시작');
      animationRef.current = requestAnimationFrame(predictWebcam);
    } else if (isPaused && animationRef.current) {
      console.log('[🔍 WebCamera] 일시 중지됨');
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // 컴포넌트 언마운트나 isPaused 변경 시 애니메이션 정리
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isLoading, error, predictWebcam, isPaused]);

  // 에러 발생 시 로깅
  useEffect(() => {
    if (error) {
      console.error('[🖐️ HandLandmarker 오류]', error);
    }
  }, [error]);

  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
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
        width={720}
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
            {/* 안내 텍스트 - 가시성 향상 */}
            <div className="absolute top-5 left-0 right-0 flex justify-center items-center">
              <p
                className="bg-black/60 text-white px-4 py-2 rounded-lg
              text-sm md:text-base font-[NanumSquareRoundEB] 
              drop-shadow-lg"
              >
                {guideText}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebCamera;
