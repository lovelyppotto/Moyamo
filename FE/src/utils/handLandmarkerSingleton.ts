// handLandmarkerSingleton.ts 수정
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// 모델 URL을 상수로 정의 (쿼리 파라미터 포함)
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task?v=1';
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';

// 싱글톤 변수들
let handLandmarkerInstance: HandLandmarker | null = null;
let isInitializing = false;
let initPromise: Promise<HandLandmarker> | null = null;
let filesetResolverInstance: any = null;

// 전역 캐시 플래그 (세션 간 유지)
const MODEL_LOADED_KEY = 'handLandmarkerModelLoaded';

export const getHandLandmarker = async (): Promise<HandLandmarker> => {
  // 이미 인스턴스가 있는 경우
  if (handLandmarkerInstance) {
    console.log('[🖐️ HandLandmarker 싱글톤] 캐시된 인스턴스 반환');
    return handLandmarkerInstance;
  }

  // 초기화 중인 경우
  if (isInitializing) {
    console.log('[🖐️ HandLandmarker 싱글톤] 초기화 진행 중... 기존 Promise 반환');
    return initPromise!;
  }

  // 초기화 시작
  isInitializing = true;
  console.log('[🖐️ HandLandmarker 싱글톤] 초기화 시작');
  
  initPromise = (async () => {
    try {
      // 로컬 스토리지 확인
      const modelLoaded = localStorage.getItem(MODEL_LOADED_KEY);
      console.log(`[🖐️ HandLandmarker 싱글톤] 이전 로드 기록: ${modelLoaded ? '있음' : '없음'}`);
      
      console.log('[🖐️ HandLandmarker 싱글톤] FilesetResolver 초기화');
      
      // FilesetResolver 캐싱
      if (!filesetResolverInstance) {
        filesetResolverInstance = await FilesetResolver.forVisionTasks(WASM_URL);
        console.log('[🖐️ HandLandmarker 싱글톤] FilesetResolver 생성 완료');
      } else {
        console.log('[🖐️ HandLandmarker 싱글톤] 캐시된 FilesetResolver 사용');
      }
      
      console.log('[🖐️ HandLandmarker 싱글톤] HandLandmarker 생성 시작');
      
      // 미디어파이프 손 감지 모델 생성
      const handLandmarker = await HandLandmarker.createFromOptions(filesetResolverInstance, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: 'GPU'
        },
        numHands: 1, // 성능 향상을 위해 최대 감지 손 수 제한
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      
      // 인스턴스 저장
      handLandmarkerInstance = handLandmarker;
      
      // 로컬 스토리지에 로드 상태 저장
      localStorage.setItem(MODEL_LOADED_KEY, 'true');
      
      console.log('[🖐️ HandLandmarker 싱글톤] 초기화 완료');
      return handLandmarker;
    } catch (err) {
      console.error('[🖐️ HandLandmarker 싱글톤] 초기화 오류:', err);
      isInitializing = false;
      throw err;
    }
  })();

  return initPromise;
};

// 필요한 경우 메모리 정리 (앱 종료나 페이지 언로드 시)
export const disposeHandLandmarker = () => {
  if (handLandmarkerInstance) {
    try {
      // 어떤 dispose 메소드가 있는지 확인 필요
      if (typeof handLandmarkerInstance.close === 'function') {
        handLandmarkerInstance.close();
      }
      handLandmarkerInstance = null;
      console.log('[🖐️ HandLandmarker 싱글톤] 인스턴스 정리됨');
    } catch (err) {
      console.error('[🖐️ HandLandmarker 싱글톤] 정리 중 오류:', err);
    }
  }
};

// 다음과 같이 전역 window 객체에 등록하여 앱 종료 시 정리하기
if (typeof window !== 'undefined') {
  window.addEventListener('unload', () => {
    disposeHandLandmarker();
  });
}