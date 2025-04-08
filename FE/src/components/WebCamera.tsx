import { useCallback, useEffect, useRef, useState } from 'react';
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
  // HandLandmarker 훅 사용
  const { isLoading, error, detectFrame, HAND_CONNECTIONS, drawLandmarks, drawConnectors } =
    useHandLandmarker();

  // HTTP API 서비스 사용
  const {
    status: apiStatus,
    gesture,
    confidence,
    sendLandmarks,
    connect: connectApi,
    disconnect: disconnectApi,
  } = useGestureHttpApi();

  // 컴포넌트 상태 및 참조
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // API 연결 상태 콜백
  useEffect(() => {
    if (onConnectionStatus) {
      onConnectionStatus(true); // 항상 연결됨으로 보고
    }
  }, [onConnectionStatus]);

  // API 상태 관리 - 별도 useEffect로 분리
  useEffect(() => {
    // isPaused가 false일 때만 API 연결
    if (!isPaused && apiStatus === 'closed') {
      console.log('[🌐 API 연결 시작]');
      connectApi();
    } 
    // isPaused가 true일 때 API 연결 해제
    else if (isPaused && apiStatus === 'open') {
      console.log('[🌐 API 연결 해제]');
      disconnectApi();
    }
    
    // 컴포넌트 언마운트 시 API 연결 해제
    return () => {
      if (apiStatus === 'open') {
        disconnectApi();
      }
    };
  }, [isPaused, apiStatus, connectApi, disconnectApi]);

  // 제스처 정보가 변경될 때만 이벤트 발행
  useEffect(() => {
    // 제스처 감지 시 이벤트 발행
    if (gesture && !isPaused) {
      console.log(`[🖐️ 제스처 감지] ${gesture} (신뢰도: ${confidence || 0})`);
      
      // 새 이벤트를 발행하기 전에 이벤트 발행 지연 (중복 방지)
      setTimeout(() => {
        // 이미 모달이 닫혔거나 isPaused 상태가 변경되었으면 이벤트 발행 취소
        if (isPaused) {
          console.log('[🖐️ 제스처 이벤트 취소] 일시 정지 상태');
          return;
        }
        
        // 커스텀 이벤트 생성하여 제스처 데이터 전달
        const gestureEvent = new CustomEvent('gesture-detected', {
          detail: { gesture, confidence },
        });
  
        // 이벤트 발행
        window.dispatchEvent(gestureEvent);
        console.log(`[🖐️ 제스처 이벤트 발행] ${gesture}`);
        
        // onGesture 콜백이 있으면 호출
        if (onGesture) {
          onGesture(gesture, confidence || 0);
        }
      }, 100);
    }
  }, [gesture, confidence, isPaused, onGesture]);

  // 캔버스에 랜드마크 그리기 함수
  const drawCanvas = useCallback(
    (results: HandLandmarkerResult) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;
      
      const width = canvas.width;
      const height = canvas.height;

      // 캔버스 초기화
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, width, height);

      // 정사각형 영역에 비디오 그리기 
      if (webcamRef.current?.video) {
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

  // 웹캠 스트림 설정
useEffect(() => {
  if (webcamRef.current && webcamRef.current.video) {
    console.log('Setting up video loadedmetadata event');
    webcamRef.current.video.onloadedmetadata = () => {
      console.log('Video metadata loaded');
      setIsStreaming(true);
    };
  }
}, []);

  // 웹캠에서 프레임을 가져와 처리하는 함수
const predictWebcam = useCallback(async () => {
  // 조기 종료 조건
  if (!webcamRef.current?.video?.readyState || !canvasRef.current) {
    // 다음 프레임에서 다시 시도
    animationRef.current = requestAnimationFrame(predictWebcam);
    return;
  }

  try {
    const video = webcamRef.current.video;
    
    // 손 랜드마크 감지 시도
    const results = await detectFrame(video);
    
    // 감지된 랜드마크 그리기 (공통 함수 활용)
    drawCanvas(results || { landmarks: [], worldLandmarks: [], handednesses: [], handedness: [] });
    
    // API 통신 (isPaused가 false일 때만)
    if (results?.landmarks && results.landmarks.length > 0 && !isPaused) {
      // 주기적으로만 로그 출력 (10프레임마다)
      if (Math.random() < 0.1) {
        console.log(`[🖐️ 손 감지] ${results.landmarks.length}개 손 감지됨, isPaused=${isPaused}`);
      }
      sendLandmarks(results.landmarks);
    } else if (isPaused && results?.landmarks && results.landmarks.length > 0) {
      // 주기적으로만 로그 출력 (10프레임마다)
      if (Math.random() < 0.1) {
        console.log(`[🖐️ 손 감지됨] isPaused=${isPaused} 상태라 전송 안 함`);
      }
    }
  } catch (e) {
    console.error('[🖐️ 손 감지 오류]', e);
  }

  // 항상 다음 프레임 요청
  animationRef.current = requestAnimationFrame(predictWebcam);
}, [detectFrame, sendLandmarks, isPaused, drawCanvas]);

// 애니메이션 프레임 관리 - 분리된 useEffect로 처리
useEffect(() => {
  console.log('Animation frame effect triggered', { isLoading, error });
  // 초기 애니메이션 프레임 요청
  if (!isLoading && !error) {
    console.log('Starting animation frame');
    animationRef.current = requestAnimationFrame(predictWebcam);
  }
  
  // 정리 함수
  return () => {
    if (animationRef.current) {
      console.log('Canceling animation frame');
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
}, [isLoading, error, predictWebcam]);

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