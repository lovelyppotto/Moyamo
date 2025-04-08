import { useState, useRef, useCallback } from 'react';

// API 연결 상태를 나타내는 타입
export type ApiStatus = 'closed' | 'connecting' | 'open' | 'error';

// 제스처 인식 결과 타입
interface GestureRecognitionResult {
  gesture: string | null;
  confidence: number | null;
}

// 훅의 반환 타입
interface UseGestureHttpApiReturn {
  status: ApiStatus;
  gesture: string | null;
  confidence: number | null;
  sendLandmarks: (landmarks: any[]) => void;
  connect: () => void;
  disconnect: () => void;
}

/**
 * 제스처 인식을 위한 HTTP API 통신을 관리하는 커스텀 훅
 */
export const useGestureHttpApi = (): UseGestureHttpApiReturn => {
  const SERVER_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // API 상태 관리
  const [status, setStatus] = useState<ApiStatus>('closed');
  const [isProcessing, setIsProcessing] = useState(false);

  // 제스처 인식 결과 관리
  const [recognitionResult, setRecognitionResult] = useState<GestureRecognitionResult>({
    gesture: null,
    confidence: null,
  });

  // 시퀀스 참조
  const sequenceRef = useRef<number[][]>([]);

  // 시퀀스 길이 (frame 수)
  const SEQUENCE_LENGTH = 90;

  // 마지막으로 데이터를 전송한 시간
  const lastSentTimeRef = useRef<number>(0);

  // 데이터 전송 간격 (ms)
  const SEND_THROTTLE = 50;

  // 시퀀스 클리어
  const clearSequence = useCallback(() => {
    sequenceRef.current = [];
  }, []);

  // 정적/동적 제스처 판별 함수
  const isDynamicGesture = useCallback((sequence: number[][], threshold = 0.005): boolean => {
    const centers = sequence.map((frame) => {
      const joint3D = frame.slice(0, 63); // 21*3
      const coords = Array.from({ length: 21 }, (_, i) => joint3D.slice(i * 3, i * 3 + 3));

      const [sumX, sumY, sumZ] = coords.reduce(
        ([sx, sy, sz], [x, y, z]) => [sx + x, sy + y, sz + z],
        [0, 0, 0]
      );

      return [sumX / 21, sumY / 21, sumZ / 21];
    });

    let totalMove = 0;
    for (let i = 1; i < centers.length; i++) {
      const [x1, y1, z1] = centers[i - 1];
      const [x2, y2, z2] = centers[i];
      const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
      totalMove += dist;
    }

    const avgMove = totalMove / (centers.length - 1);
    console.log('[📈 평균 이동량]', avgMove);
    return avgMove > threshold;
  }, []);

  // 데이터를 서버로 전송하는 함수
  const sendToServer = useCallback(
    async (sequenceData: number[][]) => {
      try {
        const isDynamic = isDynamicGesture(sequenceData);
        const endpoint = isDynamic ? '/api/predict/dynamic' : '/api/predict/static';
        const url = SERVER_BASE_URL + endpoint;
  
        const payload = { frames: sequenceData };
        console.log(`[📤 전송됨] ${isDynamic ? '동적' : '정적'} 제스처`);
  
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        
        const res = await response.json();
        
        // 응답 처리
        const result = Array.isArray(res) ? res[0] : res;
        
        // gesture가 배열인 경우 첫 번째 요소를 제스처 이름으로 사용
        const gestureName = Array.isArray(result.gesture) ? result.gesture[0] : result.gesture;
        // gesture가 배열인 경우 두 번째 요소를 confidence로 사용
        const confidenceValue = Array.isArray(result.gesture) ? result.gesture[1] : result.confidence;
        
        setRecognitionResult({
          gesture: gestureName,
          confidence: confidenceValue,
        });
        
        console.log('[📥 응답]', res);
        console.log('[🔍 인식된 제스처]', gestureName);
      } catch (err) {
        setStatus('error');
      }
    },
    [SERVER_BASE_URL, isDynamicGesture]
  );

  // 랜드마크 데이터 전송 함수
  const sendLandmarks = useCallback(
    (landmarks: any[]) => {
      try {
        if (isProcessing) return;

        const now = Date.now();

        // 전송 간격 제한 (쓰로틀링)
        if (now - lastSentTimeRef.current < SEND_THROTTLE) {
          return;
        }

        lastSentTimeRef.current = now;

        if (status !== 'open') {
          setStatus('open');
        }

        // 각 손에 대해 랜드마크 처리
        for (const hand of landmarks) {
          // 원점 (첫 번째 랜드마크)
          const origin = [hand[0].x, hand[0].y, hand[0].z];

          // 정규화된 랜드마크 계산
          const normalized = hand.map((lm: any) => [
            lm.x - origin[0],
            lm.y - origin[1],
            lm.z - origin[2],
          ]);

          // 정규화된 랜드마크를 1차원 배열로 평탄화
          const flat = normalized.flat();

          // 벡터 정규화
          const norm = Math.hypot(...flat);
          const normed = norm > 0 ? flat.map((v: number) => v / norm) : flat;

          // 양손 여부 추가 (현재 단일 손만 처리 중)
          const isTwoHands = landmarks.length === 2 ? 1 : 0;

          // 최종 벡터 생성
          const vector64 = [...normed, isTwoHands];

          // 시퀀스에 추가
          sequenceRef.current.push(vector64);
        }

        if (sequenceRef.current.length >= SEQUENCE_LENGTH && !isProcessing) {
          console.log(`[🔄 시퀀스 완성] ${sequenceRef.current.length} 프레임`);
          setIsProcessing(true); // 처리 중 상태로 설정
          sendToServer(sequenceRef.current);
          clearSequence();
        }
      } catch (error) {
        console.error('[🌐 API] 데이터 처리 오류:', error);
      }
    },
    [SEND_THROTTLE, SEQUENCE_LENGTH, status, clearSequence, sendToServer, isProcessing]
  );

  // API 연결 함수 (웹소켓과 호환성 유지를 위한 더미 함수)
  const connect = useCallback(() => {
    console.log('[🌐 API] 연결 준비 완료');
    setStatus('open');
    clearSequence();
    setIsProcessing(false); // 처리 상태 초기화
  }, [clearSequence]);

  // API 연결 해제 함수 (웹소켓과 호환성 유지를 위한 더미 함수)
  const disconnect = useCallback(() => {
    console.log('[🌐 API] 연결 종료');
    setStatus('closed');
    clearSequence();
    setRecognitionResult({
      gesture: null,
      confidence: null,
    });
  }, [clearSequence]);

  return {
    status,
    gesture: recognitionResult.gesture,
    confidence: recognitionResult.confidence,
    sendLandmarks,
    connect,
    disconnect,
  };
};
