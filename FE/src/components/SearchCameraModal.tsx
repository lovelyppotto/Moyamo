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
  const [isPreparingGesture, setIsPreparingGesture] = useState(false); // 제스처 준비 상태
  const [preparationCountdown, setPreparationCountdown] = useState(2); // 제스처 준비 카운트다운
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null); // 준비 시간용 타이머 참조

  // 현재 감지된 제스처
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);
  const [currentConfidence, setCurrentConfidence] = useState<number | null>(null);
  
  // 가이드 텍스트 상태
  const [guideText, setGuideText] = useState<string>("버튼을 누르면 검색이 진행됩니다");

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

        // 카운트다운 중인 경우에만 히스토리에 기록 (준비 중일 때는 기록하지 않음)
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
      setGuideText("버튼을 누르면 검색이 진행됩니다");
      setIsPreparingGesture(false);
      setIsCountingDown(false);
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

  // 준비 카운트다운이 끝나면 실제 카운트다운 시작
  const startActualCountdown = () => {
    console.log('[⏱️ 실제 카운트다운] 시작');
    setIsPreparingGesture(false);
    setIsCountingDown(true);
    setCountdown(3);
    setGuideText("제스처를 유지해주세요");

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        console.log(`[⏱️ 카운트다운] ${prev}초 남음, 현재 제스처: ${currentGesture || '없음'}`);

        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsCountingDown(false);
          setGuideText("인식 완료!");

          // 타이머 종료 후 제스처 선택하여 페이지 이동
          setTimeout(() => handleTimerEnd(), 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 카운트다운 타이머 시작 - 먼저 준비 시간 제공
  const startCountdown = () => {
    if (!isWebSocketConnected) {
      console.log('[⚠️ 경고] 웹소켓 연결이 되지 않았습니다');
      return;
    }

    console.log('[⏱️ 준비 카운트다운] 시작');

    // 카운트다운 시작 시 제스처 히스토리 초기화
    gestureFrequency.current = {};

    // 준비 상태로 설정
    setIsPreparingGesture(true);
    setPreparationCountdown(2);
    setGuideText("제스처를 준비해주세요"); // 준비 안내 텍스트 변경

    prepTimerRef.current = setInterval(() => {
      setPreparationCountdown((prev) => {
        console.log(`[⏱️ 준비 카운트다운] ${prev}초 남음`);

        if (prev <= 1) {
          if (prepTimerRef.current) {
            clearInterval(prepTimerRef.current);
            prepTimerRef.current = null;
          }
          
          // 준비 시간 종료 후 실제 카운트다운 시작
          startActualCountdown();
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
      if (prepTimerRef.current) {
        clearInterval(prepTimerRef.current);
        prepTimerRef.current = null;
      }
    };
  }, []);

  // 모달 닫힐 때 타이머 정리
  useEffect(() => {
    if (!open) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (prepTimerRef.current) {
        clearInterval(prepTimerRef.current);
        prepTimerRef.current = null;
      }
      setIsCountingDown(false);
      setIsPreparingGesture(false);
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
          className="p-0 w-[95vw] sm:w-[450px] max-w-[500px] max-h-[90vh]
          rounded-2xl border-none
          mx-auto overflow-hidden
          dark:text-d-txt-50"
        >
          {/* 전체 컨테이너 */}
          <div className="flex flex-col rounded-2xl overflow-hidden">
            {/* 헤더 부분 */}
            <div className="bg-gray-200 dark:bg-gray-700 dark:text-d-txt-50 py-4 px-6">
              <DialogTitle className="flex item-center text-center text-2xl mb-1 font-[NanumSquareRoundEB]">
                제스처 검색
              </DialogTitle>
              <div className="flex flex-col justify-start">
                <p className="text-sm text-left font-[NanumSquareRound]">
                  가이드라인에 맞춰 자세를 잡고 카메라 버튼을 누릅니다.
                </p>
                <p className="text-sm text-left font-[NanumSquareRound]">
                  이후 준비 시간 2초가 주어지며, 3초간 제스처를 유지해 주세요.
                </p>
              </div>
            </div>

            {/* 카메라 영역 */}
            <div className="flex-grow bg-white rounded-b-lg flex items-center justify-center overflow-hidden">
              {/* 카메라 컨테이너를 정사각형 비율로 설정 */}
              <div className="bg-white">
                <div className="aspect-square w-full">
                  {/* WebCamera 컴포넌트에 props 전달 */}
                  <WebCamera 
                    guidelineClassName="w-[70%] mt-35"
                    guideText={guideText}
                    onConnectionStatus={handleConnectionStatus}
                  />
                </div>
              </div>
            </div>
            <div className="h-2 bg-none"></div>

            {/* 하단 버튼 영역 */}
            <div className="w-full bg-white dark:bg-gray-700">
              <div className="">
                <button
                  onClick={handleCaptureClick}
                  disabled={isPreparingGesture || isCountingDown || !isWebSocketConnected}
                  className={`flex items-center justify-center w-full py-3 rounded-b-lg ${
                    isWebSocketConnected && !isPreparingGesture && !isCountingDown
                      ? 'bg-white text-black'
                      : 'bg-black text-white'
                  }`}
                >
                  {isPreparingGesture ? (
                    <span className="text-center font-[NanumSquareRoundB]">
                      <span className="font-[NanumSquareRoundEB] mr-1">{preparationCountdown}</span>
                      초 후 인식 시작
                    </span>
                  ) : isCountingDown ? (
                    <span className="text-cente font-[NanumSquareRoundB]r">
                      <span className="font-[NanumSquareRoundEB] mr-1">{countdown}</span>
                      초 동안 유지
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Camera size={20} className="mr-2" />
                    </span>
                  )}
                </button>
              </div>
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