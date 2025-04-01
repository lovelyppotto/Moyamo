import { useState, useEffect, useRef, useCallback } from 'react';

// 웹소켓 연결 상태를 나타내는 타입
export type WebSocketStatus = 'closed' | 'connecting' | 'open' | 'error';

// 제스처 인식 결과 타입
interface GestureRecognitionResult {
  gesture: string | null;
  confidence: number | null;
}

// 훅의 반환 타입
interface UseGestureWebSocketReturn {
  status: WebSocketStatus;
  gesture: string | null;
  confidence: number | null;
  sendLandmarks: (landmarks: any[]) => void;
  connect: () => void;
  disconnect: () => void;
}

/**
 * 제스처 인식을 위한 웹소켓 통신을 관리하는 커스텀 훅
 */
export const useGestureWebSocket = (): UseGestureWebSocketReturn => {
  const SERVER_URL = import.meta.env.VITE_SERVER_WS_URL
  // 웹소켓 상태 관리
  const [status, setStatus] = useState<WebSocketStatus>('closed');
  // 제스처 인식 결과 관리
  const [recognitionResult, setRecognitionResult] = useState<GestureRecognitionResult>({
    gesture: null,
    confidence: null
  });
  // 웹소켓 인스턴스 참조
  const socket = useRef<WebSocket | null>(null);

  // 웹소켓 연결 함수
  const connect = useCallback(() => {
    if (socket.current && (socket.current.readyState === WebSocket.OPEN || socket.current.readyState === WebSocket.CONNECTING)) {
      console.log("[🌐 웹소켓] 이미 연결 중입니다.");
      return;
    }

    try {
      console.log("[🌐 웹소켓] 연결 시도 중...", SERVER_URL);
      setStatus('connecting');
      
      socket.current = new WebSocket(SERVER_URL);

      socket.current.onopen = () => {
        console.log("[🌐 웹소켓] 연결 성공");
        setStatus('open');
      };

      socket.current.onmessage = (event) => {
        try {
          console.log("[🌐 웹소켓] 데이터 수신:", event.data);
          const response = JSON.parse(event.data);
          
          if (response.gesture) {
            setRecognitionResult({
              gesture: response.gesture,
              confidence: response.confidence !== undefined ? response.confidence : null
            });
          } else if (response.error) {
            console.error("[🌐 웹소켓] 서버 오류:", response.error);
          }
        } catch (err) {
          console.error("[🌐 웹소켓] 데이터 파싱 오류:", err);
        }
      };

      socket.current.onclose = () => {
        console.log("[🌐 웹소켓] 연결 종료");
        setStatus('closed');
      };

      socket.current.onerror = (error) => {
        console.error("[🌐 웹소켓] 오류 발생:", error);
        setStatus('error');
      };
    } catch (error) {
      console.error("[🌐 웹소켓] 연결 생성 오류:", error);
      setStatus('error');
    }
  }, []);

  // 웹소켓 연결 해제 함수
  const disconnect = useCallback(() => {
    if (socket.current) {
      console.log("[🌐 웹소켓] 연결 해제 중...");
      socket.current.close();
      socket.current = null;
      setStatus('closed');
    }
  }, []);

  // 랜드마크 데이터 전송 함수
  const sendLandmarks = useCallback((landmarks: any[]) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      try {
        // 랜드마크 데이터 직렬화 (x, y, z 좌표만 포함)
        const serializedLandmarks = landmarks.map(hand => 
          hand.map((lm: any) => ({
            x: lm.x,
            y: lm.y,
            z: lm.z
          }))
        );
        
        const data = JSON.stringify({ frames: serializedLandmarks });
        socket.current.send(data);
        console.log(`[🌐 웹소켓] 데이터 전송: ${serializedLandmarks.length} 손`);
      } catch (error) {
        console.error("[🌐 웹소켓] 데이터 전송 오류:", error);
      }
    } else {
      console.log("[🌐 웹소켓] 연결되지 않음 - 데이터 전송 불가");
    }
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    status,
    gesture: recognitionResult.gesture,
    confidence: recognitionResult.confidence,
    sendLandmarks,
    connect,
    disconnect
  };
};