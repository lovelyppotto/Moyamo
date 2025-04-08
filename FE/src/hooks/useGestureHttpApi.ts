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
  
  // 처리 중 상태 - API 요청 중복 방지
  const [isProcessing, setIsProcessing] = useState(false);

  // 제스처 인식 결과 관리
  const [recognitionResult, setRecognitionResult] = useState<GestureRecognitionResult>({
    gesture: null,
    confidence: null,
  });

  // 시퀀스 참조 - 프레임 데이터를 저장
  const sequenceRef = useRef<number[][]>([]);

  // 시퀀스 길이 (frame 수)
  const SEQUENCE_LENGTH = 90;

  // 마지막으로 데이터를 전송한 시간
  const lastSentTimeRef = useRef<number>(0);
  
  // 마지막 API 요청 타임스탬프
  const lastApiRequestRef = useRef<number>(0);

  // 데이터 전송 간격 (ms)
  const SEND_THROTTLE = 50;
  
  // API 요청 간격 (ms) - 재검색 시 동일한 요청이 너무 빠르게 발생하는 것 방지
  const API_REQUEST_THROTTLE = 500; // 0.5초로 줄여서 테스트

  // 시퀀스 클리어
  const clearSequence = useCallback(() => {
    sequenceRef.current = [];
  }, []);

  // 정적/동적 제스처 판별 함수
  const isDynamicGesture = useCallback((sequence: number[][], threshold = 0.005): boolean => {
    if (sequence.length < 2) return false;
    
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
        const now = Date.now();
        
        // API 요청 간격 제한 (쓰로틀링)
        if (now - lastApiRequestRef.current < API_REQUEST_THROTTLE) {
          console.log('[🔄 API 요청 쓰로틀링] 최근 요청 이후 충분한 시간이 지나지 않음');
          setIsProcessing(false);
          return;
        }
        
        lastApiRequestRef.current = now;
        
        // 수집된 시퀀스 데이터 확인
        if (sequenceData.length < 10) {
          console.log('[⚠️ 불충분한 데이터] 시퀀스 데이터가 너무 적습니다.');
          setIsProcessing(false);
          return;
        }
        
        const isDynamic = isDynamicGesture(sequenceData);
        const endpoint = isDynamic ? '/api/predict/dynamic' : '/api/predict/static';
        const url = SERVER_BASE_URL + endpoint;
  
        const payload = { frames: sequenceData };
        console.log(`[📤 전송됨] ${isDynamic ? '동적' : '정적'} 제스처 (${sequenceData.length} 프레임)`);
  
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`);
        }
        
        const res = await response.json();
        
        // 응답 처리
        const result = Array.isArray(res) ? res[0] : res;
        
        // gesture가 배열인 경우 첫 번째 요소를 제스처 이름으로 사용
        const gestureName = Array.isArray(result.gesture) ? result.gesture[0] : result.gesture;
        // gesture가 배열인 경우 두 번째 요소를 confidence로 사용
        const confidenceValue = Array.isArray(result.gesture) ? result.gesture[1] : result.confidence;
        
        console.log('[📥 응답]', JSON.stringify(res));
        console.log('[🔍 인식된 제스처]', gestureName, '(신뢰도:', confidenceValue, ')');

        // 결과 설정 전에 재확인 (유효한 응답인지)
        if (gestureName) {
          setRecognitionResult({
            gesture: gestureName,
            confidence: confidenceValue,
          });
          
          // 제스처 이벤트 발행 - 즉시 다른 컴포넌트에 알림
          const gestureEvent = new CustomEvent('gesture-detected', {
            detail: { 
              gesture: gestureName, 
              confidence: confidenceValue 
            }
          });
          window.dispatchEvent(gestureEvent);
        } else {
          console.warn('[⚠️ 인식 실패] 서버 응답에 유효한 제스처가 없습니다.');
          setRecognitionResult({
            gesture: null,
            confidence: null,
          });
        }
        
        // 처리 완료
        setIsProcessing(false);
      } catch (err) {
        console.error('[🌐 API 오류]', err);
        setStatus('error');
        setIsProcessing(false);
        
        // 오류 시 상태 리셋
        setRecognitionResult({
          gesture: null,
          confidence: null,
        });
      }
    },
    [SERVER_BASE_URL, isDynamicGesture, API_REQUEST_THROTTLE]
  );

  // 랜드마크 데이터 전송 함수
  const sendLandmarks = useCallback(
    (landmarks: any[]) => {
      try {
        // 상태가 'closed'이면 처리하지 않음
        if (status === 'closed') return;
        
        const now = Date.now();

        // 전송 간격 제한 (쓰로틀링)
        if (now - lastSentTimeRef.current < SEND_THROTTLE) {
          return;
        }

        lastSentTimeRef.current = now;

        if (status !== 'open') {
          setStatus('open');
        }

        // 각 손에 대해 랜드마크 처리 (내부 함수로 분리)
        processLandmarksToSequence(landmarks);

        // 충분한 프레임이 모였고, 처리 중이 아니면 서버로 전송
        if (sequenceRef.current.length >= SEQUENCE_LENGTH && !isProcessing) {
          console.log(`[🔄 시퀀스 완성] ${sequenceRef.current.length} 프레임`);
          setIsProcessing(true); // 처리 중 상태로 설정
          
          // 현재 시퀀스 복사 후 초기화
          const currentSequence = [...sequenceRef.current];
          clearSequence();
          
          // 서버로 전송
          sendToServer(currentSequence);
        }
      } catch (error) {
        console.error('[🌐 API] 데이터 처리 오류:', error);
        setIsProcessing(false);
      }
    },
    [SEND_THROTTLE, SEQUENCE_LENGTH, status, clearSequence, sendToServer, isProcessing]
  );
  
  // 랜드마크를 처리하여 시퀀스에 추가하는 내부 함수
  const processLandmarksToSequence = (landmarks: any[]) => {
    // 각 손에 대해 랜드마크 처리
    for (const hand of landmarks) {
      // 원점 (첫 번째 랜드마크)
      const origin = [hand[0].x, hand[0].y, hand[0].z];

      // 정규화된 랜드마크 계산 (원점 기준으로 상대적 위치)
      const normalized = hand.map((lm: any) => [
        lm.x - origin[0],
        lm.y - origin[1],
        lm.z - origin[2],
      ]);

      // 정규화된 랜드마크를 1차원 배열로 평탄화
      const flat = normalized.flat();

      // 벡터 정규화 (단위 벡터로 변환)
      const norm = Math.hypot(...flat);
      const normed = norm > 0 ? flat.map((v: number) => v / norm) : flat;

      // 양손 여부 추가 (현재 단일 손만 처리 중)
      const isTwoHands = landmarks.length === 2 ? 1 : 0;

      // 최종 벡터 생성 (63개 좌표 + 양손 여부 = 64차원)
      const vector64 = [...normed, isTwoHands];

      // 시퀀스에 추가 (최대 길이 유지)
      sequenceRef.current.push(vector64);
      
      // 시퀀스가 너무 길어지면 앞부분 제거
      if (sequenceRef.current.length > SEQUENCE_LENGTH * 1.5) {
        sequenceRef.current = sequenceRef.current.slice(-SEQUENCE_LENGTH);
      }
    }
  };

  // API 연결 함수
  const connect = useCallback(() => {
    console.log('[🌐 API] 연결 준비 완료');
    setStatus('open');
    clearSequence();
    setIsProcessing(false); // 처리 상태 초기화
    
    // 결과 초기화
    setRecognitionResult({
      gesture: null,
      confidence: null,
    });
  }, [clearSequence]);

  // API 연결 해제 함수
  const disconnect = useCallback(() => {
    console.log('[🌐 API] 연결 종료');
    setStatus('closed');
    clearSequence();
    setRecognitionResult({
      gesture: null,
      confidence: null,
    });
    setIsProcessing(false);
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