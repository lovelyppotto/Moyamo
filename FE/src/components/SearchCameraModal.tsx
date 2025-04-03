import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';
import WebCamera from './WebCamera';

// 커스텀 이벤트 타입 정의
interface GestureDetectedEvent extends CustomEvent {
  detail: {
    gesture: string;
    confidence: number;
  };
}

function SearchCameraModal() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 현재 감지된 제스처
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);
  const [currentConfidence, setCurrentConfidence] = useState<number | null>(null);

  const gestureFrequency = useRef<Record<string, number>>({});

  // 제스처 감지를 위한 이벤트 리스너 추가 (WebCamera 컴포넌트와 통신)
  useEffect(() => {
    // WebCamera 컴포넌트에서 보내는 제스처 이벤트를 수신하는 커스텀 이벤트 리스너
    const handleGestureDetected = (event: Event) => {
      const gestureEvent = event as GestureDetectedEvent;

      if (gestureEvent.detail && gestureEvent.detail.gesture) {
        const { gesture, confidence } = gestureEvent.detail;

        // 현재 감지된 제스처 업데이트
        setCurrentGesture(gesture);
        setCurrentConfidence(confidence);

        // 카운트다운 중인 경우에만 히스토리에 기록
        if (isCountingDown) {
          gestureFrequency.current[gesture] = (gestureFrequency.current[gesture] || 0) + 1;
          console.log(`[📊 제스처 빈도] ${gesture}: ${gestureFrequency.current[gesture]}회`);
        }
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('gesture-detected', handleGestureDetected);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('gesture-detected', handleGestureDetected);
    };
  }, [isCountingDown]);

  // 모달이 열리면 제스처 히스토리 초기화
  useEffect(() => {
    if (open) {
      gestureFrequency.current = {};
      setCurrentGesture(null);
      setCurrentConfidence(null);
    }
  }, [open]);

  // 타이머 종료 후 제스처 선택 및 페이지 이동
  const handleTimerEnd = () => {
    // 감지된 제스처 개수 확인 (모든 빈도 합계)
    const totalDetections = Object.values(gestureFrequency.current).reduce(
      (sum, count) => sum + count,
      0
    );
    console.log(
      `[📊 제스처 분석] 총 ${totalDetections}개의 제스처 감지, ${Object.keys(gestureFrequency.current).length}종류`
    );

    if (totalDetections === 0) {
      console.log('[⚠️ 경고] 수집된 제스처가 없습니다');

      // 현재 표시 중인 제스처가 있다면 그것을 사용
      if (currentGesture) {
        console.log(`[🔍 현재 제스처 사용] ${currentGesture}`);

        // 카메라 검색 API로 변경: gesture_name 대신 gesture_label 사용
        if (location.pathname.includes('/search')) {
          window.location.href = `/search?gesture_label=${currentGesture}`;
        } else {
          navigate(`/search?gesture_label=${currentGesture}`);
        }

        // 모달 닫기
        setTimeout(() => setOpen(false), 300);
        return;
      }

      alert('인식된 제스처가 없습니다. 다시 시도해주세요.');
      return;
    }

    // 가장 빈번한 제스처 찾기
    let mostFrequentGesture = '';
    let maxCount = 0;

    Object.entries(gestureFrequency.current).forEach(([gesture, count]) => {
      console.log(
        `[📊 제스처 빈도] ${gesture}: ${count}회 (${((count / totalDetections) * 100).toFixed(1)}%)`
      );
      if (count > maxCount) {
        maxCount = count;
        mostFrequentGesture = gesture;
      }
    });

    const lastGesture = currentGesture; // 현재 표시 중인 제스처가 마지막 감지된 제스처

    console.log(
      `[📊 제스처 분석 결과] 최다 빈도: ${mostFrequentGesture} (${maxCount}회), 마지막: ${lastGesture}`
    );

    // 최종 제스처 선택 (주로 빈도가 가장 높은 제스처 사용)
    const finalGesture = mostFrequentGesture || lastGesture;

    console.log(`[🔍 검색 시작] 제스처: ${finalGesture}`);

    // 페이지 이동
    if (location.pathname.includes('/search')) {
      window.location.href = `/search/camera?gesture_label=${finalGesture}`;
    } else {
      navigate(`/search/camera?gesture_label=${finalGesture}`);
    }

    // 모달 닫기
    setTimeout(() => setOpen(false), 300);
  };

  // 카운트다운 타이머 시작
  const startCountdown = () => {
    if (!isWebSocketConnected) {
      console.log('[⚠️ 경고] 웹소켓 연결이 되지 않았습니다');
      return;
    }

    console.log('[⏱️ 카운트다운] 시작');

    // 카운트다운 시작 시 제스처 히스토리 초기화
    gestureFrequency.current = {};

    setIsCountingDown(true);
    setCountdown(3);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        console.log(`[⏱️ 카운트다운] ${prev}초 남음, 현재 제스처: ${currentGesture || '없음'}`);

        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsCountingDown(false);

          // 타이머 종료 후 제스처 선택하여 페이지 이동
          setTimeout(() => handleTimerEnd(), 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // 모달 닫힐 때 타이머 정리
  useEffect(() => {
    if (!open && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsCountingDown(false);
    }
  }, [open]);

  const handleCameraClick = () => {
    setOpen(true);
  };

  const handleCaptureClick = () => {
    startCountdown();
  };

  // WebSocket 연결 상태 콜백 핸들러
  const handleConnectionStatus = (status: boolean) => {
    console.log(`[🌐 WebSocket 연결 상태] ${status ? '연결됨' : '연결 안됨'}`);
    setIsWebSocketConnected(status);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            onClick={handleCameraClick}
            className="flex flex-col items-center
          bg-transparent border-none 
          cursor-pointer"
          >
            <Camera className="w-6 h-6 cursor-pointer text-gray-600 dark:text-d-txt-50" />
          </button>
        </DialogTrigger>
        <DialogContent
          className="p-0 w-[95vw] max-w-[500px] max-h-[90vh]
          rounded-2xl border-none
          mx-auto overflow-hidden
          dark:text-d-txt-50"
        >
          {/* 전체 컨테이너 */}
          <div className="flex flex-col rounded-2xl overflow-hidden">
            {/* 헤더 부분 */}
            <div className="bg-gray-200 dark:bg-gray-700 dark:text-d-txt-50 py-4 px-6">
              <DialogTitle className="flex item-center text-center text-xl font-[NanumSquareRoundEB]">
                제스처 검색
              </DialogTitle>
              <div className="flex flex-col justify-start">
                <p className="text-sm text-left font-[NanumSquareRound]">
                  가이드라인에 맞춰 자세를 잡고 제스처를 취한 상태로 카메라 버튼을 누릅니다.
                </p>
                <p className="text-sm text-left font-[NanumSquareRound]">
                  3초간 자세를 유지해 주세요.
                </p>
              </div>
            </div>

            {/* 카메라 영역 */}
            <div className="flex-grow bg-white rounded-b-lg flex items-center justify-center overflow-hidden">
              {/* 카메라 컨테이너를 정사각형 비율로 설정 */}
              <div className="bg-white">
                <div className="aspect-square w-full">
                  <WebCamera
                    guidelineClassName="w-[70%] mt-35"
                    guideText="버튼을 누르면 검색이 진행됩니다"
                    onConnectionStatus={handleConnectionStatus}
                  />
                </div>
              </div>
            </div>
            <div className="h-2 bg-none"></div>

            {/* 하단 버튼 영역 */}
            <div className="flex rounded-md justify-center py-1 bg-white dark:bg-gray-700">
              <button
                onClick={handleCaptureClick}
                disabled={isCountingDown || !isWebSocketConnected}
                className={`flex items-center justify-center w-7 h-7 ${isWebSocketConnected ? 'bg-black' : 'bg-gray-400'} text-white rounded-full`}
              >
                {isCountingDown ? (
                  <span className="text-lg font-bold">{countdown}</span>
                ) : (
                  <Camera size={20} />
                )}
              </button>
            </div>

            {/* 연결 상태 표시 */}
            {!isWebSocketConnected && open && (
              <div className="absolute bottom-24 left-0 right-0 flex justify-center">
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm">
                  서버 연결 중입니다. 잠시만 기다려주세요.
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SearchCameraModal;
