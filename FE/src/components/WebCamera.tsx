import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { HandLandmarker, HandLandmarkerResult, FilesetResolver } from '@mediapipe/tasks-vision';

interface WebCameraProps {
  // 가이드라인 svg 조절 props
  guidelineClassName?: string;
  onConnectionStatus?: (status: boolean) => void;
}

const WebCamera = ({ guidelineClassName, onConnectionStatus }: WebCameraProps) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const resultsRef = useRef<HandLandmarkerResult | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null); // 일치율 추가
  const [gesture, setGesture] = useState<string | null>(null); // 서버 응답된 제스처
  const [isConnected, setIsConnected] = useState(false); // WebSocket 연결 상태
  const [isLoading, setIsLoading] = useState(true); // 모델 로딩 상태
  const animationRef = useRef<number | null>(null);
  const socket = useRef<WebSocket | null>(null);

  // HandLandmarker 모델 초기화 함수
  const initializeHandLandmarker = async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    const handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-tasks/hand_landmarker/hand_landmarker.task',
        delegate: 'GPU',
      },
      numHands: 2,
      runningMode: 'VIDEO',
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    handLandmarkerRef.current = handLandmarker;
    setIsLoading(false);
  };

  // 웹캠에서 프레임을 가져와 처리하는 함수
  const predictWebcam = useCallback(() => {
    if (
      !webcamRef.current ||
      !webcamRef.current.video ||
      !canvasRef.current ||
      !handLandmarkerRef.current ||
      webcamRef.current.video.readyState !== 4
    ) {
      // 아직 준비가 안 되었으면 다음 프레임에서 다시 시도
      animationRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    const video = webcamRef.current.video;
    const timestamp = performance.now();

    // 비디오 프레임에서 손 랜드마크 감지
    const results = handLandmarkerRef.current.detectForVideo(video, timestamp);
    resultsRef.current = results;

    // 실시간으로 서버로 전송
    if (results.landmarks && results.landmarks.length > 0) {
      sendLandmarksToServer(results.landmarks);
    }

    // 캔버스에 랜드마크 그리기
    drawCanvas(results);

    // 다음 프레임 처리
    animationRef.current = requestAnimationFrame(predictWebcam);
  }, []);

  // 캔버스에 랜드마크 그리기 함수
  const drawCanvas = (results: HandLandmarkerResult) => {
    const canvasCtx = canvasRef.current!.getContext('2d')!;
    const width = canvasRef.current!.width;
    const height = canvasRef.current!.height;

    // 캔버스 초기화
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, width, height);

    // 비디오를 캔버스에 그리기 (카메라 피드 표시)
    if (webcamRef.current && webcamRef.current.video) {
      canvasCtx.drawImage(webcamRef.current.video, 0, 0, width, height);
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
  };

  // 서버로 랜드마크 데이터를 즉시 전송하는 함수
  const sendLandmarksToServer = (landmarks: any[]) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      try {
        // 랜드마크 데이터 직렬화 (중요: x, y, z 좌표만 포함)
        const serializedLandmarks = landmarks.map((hand) =>
          hand.map((lm: any) => ({
            x: lm.x,
            y: lm.y,
            z: lm.z,
          }))
        );

        const data = JSON.stringify({ frames: serializedLandmarks });
        socket.current.send(data);
        console.log(`[📤 전송됨] landmark 전송: ${serializedLandmarks.length} 손`);
      } catch (error) {
        console.error('[⚠️ 데이터 전송 오류]', error);
      }
    } else {
      console.log('[⚠️ WebSocket 연결되지 않음] 데이터 전송 실패');
    }
  };

  // WebSocket 연결 관리: isConnected 상태에 따라 연결 생성 및 해제
  useEffect(() => {
    if (isConnected) {
      // 직접 서버 주소 지정 (import.meta.env 대신 하드코딩)
      const SERVER_URL = 'wss://moyamo.site/static-gesture/ws/predict';
      console.log('[🔄 WebSocket 연결 시도]', SERVER_URL);

      try {
        socket.current = new WebSocket(SERVER_URL);

        socket.current.onopen = () => {
          console.log('[✅ WebSocket 연결됨]');
          if (onConnectionStatus) {
            onConnectionStatus(true);
          }
        };
        socket.current.onmessage = (event) => {
          try {
            console.log('[📥 응답 수신] 데이터:', event.data);
            const response = JSON.parse(event.data);
            if (response.gesture) {
              setGesture(response.gesture);
              // 일치율 정보가 있으면 표시
              if (response.confidence !== undefined) {
                setConfidence(response.confidence);
              }
            } else if (response.error) {
              console.error('[⚠️ 서버 오류 응답]:', response.error);
            }
          } catch (err) {
            console.error('메시지 파싱 오류:', event.data);
          }
        };
        socket.current.onclose = () => {
          console.log('[❌ WebSocket 연결 종료]');
          if (onConnectionStatus) {
            onConnectionStatus(false);
          }
        };
        socket.current.onerror = (error) => {
          console.error('[⚠️ WebSocket 오류]', error);
          // 연결 실패 시 재시도 로직 (선택적)
          setTimeout(() => {
            console.log('[🔁 WebSocket 재연결 시도]');
            setIsConnected(false);
            setTimeout(() => setIsConnected(true), 1000);
          }, 2000);
        };
      } catch (error) {
        console.error('[⚠️ WebSocket 생성 오류]', error);
      }
    } else {
      if (socket.current) {
        console.log('[📴 WebSocket 연결 해제 중]');
        socket.current.close();
        socket.current = null;
      }
    }
    // 연결 상태가 변경될 때마다 실행
  }, [isConnected]);

  // 컴포넌트 마운트 시 HandLandmarker 초기화
  useEffect(() => {
    console.log("[🔍 WebCamera 컴포넌트 마운트]");
    initializeHandLandmarker();
    
    // 컴포넌트가 마운트되면 자동으로 연결 시작 - 약간의 지연 추가
    const timer = setTimeout(() => {
      console.log("[🔍 웹소켓 연결 시작]");
      setIsConnected(true);
    }, 500);
    
    return () => {
      console.log("[🔍 WebCamera 컴포넌트 언마운트]");
      clearTimeout(timer);
      
      // 리소스 정리
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // WebSocket 연결 해제
      if (socket.current) {
        socket.current.close();
        socket.current = null;
      }
    };
  }, []);

  // 모델 로딩이 완료되면 웹캠 예측 시작
  useEffect(() => {
    if (!isLoading && handLandmarkerRef.current) {
      predictWebcam();
    }
  }, [isLoading, predictWebcam]);

  // 손 연결 정보
  const HAND_CONNECTIONS = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4], // 엄지
    [0, 5],
    [5, 6],
    [6, 7],
    [7, 8], // 검지
    [5, 9],
    [9, 10],
    [10, 11],
    [11, 12], // 중지
    [9, 13],
    [13, 14],
    [14, 15],
    [15, 16], // 약지
    [13, 17],
    [17, 18],
    [18, 19],
    [19, 20], // 소지
    [0, 17],
    [17, 5],
    [5, 0], // 손바닥
  ];

  // 랜드마크 그리기 함수
  const drawLandmarks = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    options: { color: string; lineWidth: number; radius: number }
  ) => {
    const { color, lineWidth, radius } = options;

    for (const landmark of landmarks) {
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
    }
  };

  // 연결선 그리기 함수
  const drawConnectors = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    connections: number[][],
    options: { color: string; lineWidth: number }
  ) => {
    const { color, lineWidth } = options;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;

    for (const connection of connections) {
      const [start, end] = connection;
      if (landmarks[start] && landmarks[end]) {
        const startX = landmarks[start].x * ctx.canvas.width;
        const startY = landmarks[start].y * ctx.canvas.height;
        const endX = landmarks[end].x * ctx.canvas.width;
        const endY = landmarks[end].y * ctx.canvas.height;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }
  };

  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="text-white text-xl font-bold">모델 로딩 중...</div>
        </div>
      )}

      {/* 웹캠 (숨겨진 상태) */}
      <Webcam
        audio={false}
        width={1280}
        height={720}
        ref={webcamRef}
        videoConstraints={{
          facingMode: 'user',
        }}
        className="invisible absolute"
      />

      {/* 캔버스 (웹캠 화면과 손 랜드마크를 표시) */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* 가이드라인 컨테이너 */}
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
            손 제스처를 인식하고 있습니다
          </p>
        </div>
      </div>

      {/* 제스처 인식 결과 표시 (화면 상단에 표시) */}
      {/* 제스처 인식 결과 표시 (화면 상단에 표시) */}
      {gesture && (
        <div className="absolute top-20 left-0 right-0 flex justify-center items-center">
          <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg font-bold">
            인식된 제스처: {gesture}
            {confidence !== null && <div className="mt-1">일치율: {confidence.toFixed(1)}%</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebCamera;
