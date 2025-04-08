import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

// 컴포넌트
import CameraDialogHeader from './CameraDialogHeader';
import CameraDialogContent from './CameraDialogContent';
import CameraDialogFooter from './CameraDialogFooter';

// WebCamera 컴포넌트에서 제스처 이벤트를 받기 위한 타입
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
  
  // API 활성화 상태 - 버튼 클릭 시에만 활성화
  const [apiActive, setApiActive] = useState(false);
  
  // 제스처 및 가이드 상태
  const [guideText, setGuideText] = useState('버튼을 누르면 검색이 진행됩니다');
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null);
  const [lastConfidence, setLastConfidence] = useState<number>(0);
  
  // 타이머 상태
  const [isPreparingGesture, setIsPreparingGesture] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [preparationCountdown, setPreparationCountdown] = useState(2);
  const [countdown, setCountdown] = useState(3);
  
  // API 및 에러 상태
  const [isApiConnected, setIsApiConnected] = useState(true); // 기본값 true로 유지
  const [isErrorToastShown, setIsErrorToastShown] = useState(false);
  
  // 제스처 처리 관련 상태
  const [gestureProcessComplete, setGestureProcessComplete] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);
  
  // 토스트 ID 관리
  const toastIdRef = useRef('');
  
  // 타이머 참조
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 부적절한 제스처 목록
  const inappropriateGestures = ['middle_finger', 'devil'];

  // 모든 상태 초기화
  const resetAllState = useCallback(() => {
    setIsPreparingGesture(false);
    setIsCountingDown(false);
    setPreparationCountdown(2);
    setCountdown(3);
    setGuideText('버튼을 누르면 검색이 진행됩니다');
    setIsErrorToastShown(false);
    setDetectedGesture(null);
    setLastConfidence(0);
    setGestureProcessComplete(false);
    setSearchExecuted(false);
    setApiActive(false);
    
    // 모든 타이머 정리
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // 토스트 제거
    toast.dismiss();
  }, []);

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (open) {
      resetAllState();
      console.log('[🔄️ 모달 열림] 상태 초기화 완료');
    }
  }, [open, resetAllState]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 모든 토스트 제거
      toast.dismiss();
      
      // 타이머 정리
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // API 연결 상태 변경 처리 (WebCamera에서 호출됨)
  const handleConnectionStatus = useCallback((status: boolean) => {
    console.log(`[🌐 API 연결 상태] ${status ? '연결됨' : '연결 안됨'}`);
    setIsApiConnected(status);
  }, []);

  // 제스처 이벤트 리스너 설정
  useEffect(() => {
    // 제스처 이벤트 핸들러
    const handleGestureDetected = (event: Event) => {
      // 모달이 닫혀있거나, API가 비활성화 상태거나, 이미 처리 완료된 경우 무시
      if (!open || !apiActive || gestureProcessComplete) {
        console.log('[🖐️ 제스처 무시] 조건 불충족', {open, apiActive, gestureProcessComplete});
        return;
      }
  
      const gestureEvent = event as GestureDetectedEvent;
      if (gestureEvent.detail && gestureEvent.detail.gesture) {
        const { gesture, confidence } = gestureEvent.detail;
        console.log(`[🖐️ 제스처 감지] ${gesture} (신뢰도: ${confidence})`);
        
        // 카운트다운 중일 때만 제스처 업데이트
        if (isCountingDown && !gestureProcessComplete) {
          setDetectedGesture(gesture);
          setLastConfidence(confidence);
          
          // 제스처 감지 시 즉시 처리 완료 표시
          setGestureProcessComplete(true);
          console.log('[✅ 제스처 처리 완료] 처리 완료 표시');
        }
      }
    };
  
    // 클린업 함수에서 이전 리스너 제거를 보장
    window.removeEventListener('gesture-detected', handleGestureDetected);
  
    // 조건이 맞을 때만 리스너 등록
    if (open) {
      window.addEventListener('gesture-detected', handleGestureDetected);
      console.log('[🎧 이벤트 리스너] 등록됨');
    }
  
    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('gesture-detected', handleGestureDetected);
      console.log('[🎧 이벤트 리스너] 제거됨');
    };
  }, [open, apiActive, isCountingDown, gestureProcessComplete]);

  // 제스처 검색 실행 함수
const executeGestureSearch = useCallback(() => {
  // 이미 검색이 실행되었거나 제스처가 없으면 무시
  if (searchExecuted || !detectedGesture) {
    console.log('[🔍 검색 중단] 이미 실행됨 또는 제스처 없음', { searchExecuted, detectedGesture });
    return;
  }
  
  // 검색 실행 표시 (중복 실행 방지)
  setSearchExecuted(true);
  console.log('[🔍 검색 실행 플래그] 설정됨');
  
  // 부적절한 제스처 처리
  if (inappropriateGestures.includes(detectedGesture)) {
    const id = `inappropriate-gesture-${Date.now()}`;
    toastIdRef.current = id;
    
    toast.error('부적절한 제스처가 감지되었습니다', {
      description: '상대방을 존중하는 제스처를 사용해 주세요.',
      duration: 3000,
      id: id,
    });
    
    setGuideText('다른 제스처로 다시 시도해 주세요');
    setIsErrorToastShown(true);
    return;
  }
  
  // 제스처가 'none'이거나 유효하지 않은 경우
  if (detectedGesture === 'none') {
    const id = `invalid-gesture-${Date.now()}`;
    toastIdRef.current = id;
    
    toast.warning('제스처 인식 오류', {
      description: '유효한 제스처가 감지되지 않았습니다. 다시 시도해 주세요.',
      duration: 3000,
      id: id,
    });
    
    setGuideText('버튼을 눌러 다시 시도해 주세요');
    setIsErrorToastShown(true);
    return;
  }
  
  // 제스처 감지 성공
  console.log(`[🔍 검색 시작] 제스처: ${detectedGesture} (신뢰도: ${lastConfidence})`);
  setGuideText('인식 완료!');
  
  // API 비활성화 (추가 이벤트 방지)
  setApiActive(false);
  
  // 검색 페이지로 이동
  setTimeout(() => {
    try {
      const targetUrl = `/search/camera?gesture_label=${detectedGesture}`;
      console.log('[🔍 검색 이동] 대상 URL:', targetUrl);
      
      // 경로를 기반으로 이동 방식 선택
      if (location.pathname.includes('/search')) {
        console.log('[🔍 페이지 리로드] 현재 경로에서 리로드:', targetUrl);
        window.location.href = targetUrl;
      } else {
        console.log('[🔍 페이지 이동] navigate 호출:', targetUrl);
        navigate(targetUrl);
      }
      
      // 검색 후 모달 닫기
      setTimeout(() => {
        console.log('[🔍 모달 닫기]');
        setOpen(false);
      }, 300);
    } catch (error) {
      console.error('[🔍 검색 이동 실패]', error);
      const id = `navigation-error-${Date.now()}`;
      toastIdRef.current = id;
      
      toast.error('검색 페이지로 이동하는 중 오류가 발생했습니다', {
        id: id,
      });
    }
  }, 500); // 지연 시간을 500ms로 증가
}, [detectedGesture, lastConfidence, searchExecuted, location.pathname, navigate, inappropriateGestures]);

  // 카운트다운이 끝났을 때 제스처 검색 실행
  useEffect(() => {
    // 카운트다운이 끝나고 제스처가 감지된 경우에만 검색 실행
    if (!isCountingDown && countdown === 0 && detectedGesture && gestureProcessComplete && !searchExecuted) {
      console.log('[🔍 카운트다운 완료] 검색 실행');
      executeGestureSearch();
    }
    // 카운트다운이 끝났는데 제스처가 없는 경우 에러 표시
    else if (!isCountingDown && countdown === 0 && !gestureProcessComplete && !searchExecuted) {
      setGuideText('버튼을 눌러 다시 시도해 주세요');
      setIsErrorToastShown(true);
      
      // API 비활성화 (추가 이벤트 방지)
      setApiActive(false);
      
      const id = `hand-not-detected-${Date.now()}`;
      toastIdRef.current = id;
      
      toast.warning('손 감지 경고', {
        description: '손이 카메라에 인식되지 않았습니다. 손을 가이드라인 안에 위치시켜 주세요.',
        duration: 3000,
        id: id,
      });
    }
  }, [isCountingDown, countdown, detectedGesture, gestureProcessComplete, searchExecuted, executeGestureSearch]);

  // 준비 타이머 시작
  const startPreparationTimer = useCallback(() => {
    // 이미 타이머가 실행 중이면 중복 실행 방지
    if (isPreparingGesture || isCountingDown) {
      return;
    }

    console.log('[⏱️ 준비 카운트다운] 시작');
    
    // 준비 상태 설정
    setIsPreparingGesture(true);
    setGuideText('제스처를 준비해주세요');
    setDetectedGesture(null);
    setLastConfidence(0);
    setGestureProcessComplete(false);
    setSearchExecuted(false);
    
    // API 활성화 (제스처 감지 시작)
    setApiActive(true);
    
    // 준비 타이머 시작
    prepTimerRef.current = setInterval(() => {
      setPreparationCountdown(prev => {
        // 카운트다운이 1이면 준비 타이머 종료 및 실제 카운트다운 시작
        if (prev <= 1) {
          if (prepTimerRef.current) {
            clearInterval(prepTimerRef.current);
            prepTimerRef.current = null;
          }
          
          // 준비 완료 후 실제 카운트다운 시작
          startActualCountdown();
          return 2; // 초기값으로 리셋
        }
        return prev - 1;
      });
    }, 1000);
  }, [isPreparingGesture, isCountingDown]);

  // 실제 카운트다운 시작
  const startActualCountdown = useCallback(() => {
    setIsPreparingGesture(false);
    setIsCountingDown(true);
    setGuideText('제스처를 유지해주세요');
    
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          setIsCountingDown(false);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // 촬영 버튼 클릭 핸들러
  const handleCaptureClick = useCallback(() => {
    // 모든 토스트 메시지 제거
    toast.dismiss();
    
    // 모든 상태 초기화 (에러 상태 포함)
    setIsErrorToastShown(false);
    setGuideText('제스처를 준비해주세요');
    setDetectedGesture(null);
    setLastConfidence(0);
    setGestureProcessComplete(false);
    setSearchExecuted(false);
    
    // 약간의 지연 후 타이머 시작 (UI 업데이트 시간 확보)
    setTimeout(() => {
      console.log('[🔄 시도] API 활성화 시작');
      startPreparationTimer();
    }, 100);
  }, [startPreparationTimer]);

  // 모달 열기 버튼 클릭 핸들러
  const handleCameraClick = useCallback(() => {
    setOpen(true);
  }, []);

  // 모달 닫힐 때 처리
  const handleDialogOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      // 모달이 닫힐 때 모든 상태 초기화 및 API 연결 완전 해제
      resetAllState();
      
      // 모든 토스트 메시지 제거
      toast.dismiss();
      
      // 열린 애니메이션 프레임과 카운트다운 명시적 정리
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (prepTimerRef.current) {
        clearInterval(prepTimerRef.current);
        prepTimerRef.current = null;
      }
      
      // 이벤트 리스너 명시적 제거
      window.removeEventListener('gesture-detected', () => {});
      
      // 확실하게 API 활성화 상태 해제
      setApiActive(false);
    }
    setOpen(isOpen);
  }, [resetAllState]);

  useEffect(() => {
    if (open) {
      resetAllState();
      // 콘솔 로그 제거 (불필요한 로그 출력 방지)
    }
  }, [open, resetAllState]);

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
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
          <CameraDialogHeader />

          {/* 카메라 영역 */}
          {open && (
            <CameraDialogContent
              open={open}
              guideText={guideText}
              onConnectionStatus={handleConnectionStatus}
              isPaused={!apiActive}
            />
          )}

          <div className="h-2 bg-none"></div>

          {/* 하단 버튼 영역 */}
          <CameraDialogFooter
            isPreparingGesture={isPreparingGesture}
            isCountingDown={isCountingDown}
            preparationCountdown={preparationCountdown}
            countdown={countdown}
            isErrorToastShown={isErrorToastShown}
            isWebSocketConnected={isApiConnected}
            onCaptureClick={handleCaptureClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchCameraModal;