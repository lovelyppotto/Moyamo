// handLandmarkerSingleton.ts
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let handLandmarkerInstance: HandLandmarker | null = null;
let isInitializing = false;
let initPromise: Promise<HandLandmarker> | null = null;

export const getHandLandmarker = async (): Promise<HandLandmarker> => {
  if (handLandmarkerInstance) {
    return handLandmarkerInstance;
  }

  if (isInitializing) {
    return initPromise!;
  }

  isInitializing = true;
  initPromise = (async () => {
    try {
      console.log('[🖐️ HandLandmarker 싱글톤] 초기화 중...');

      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      const handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          // 절대 경로 사용
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        numHands: 2,
        runningMode: 'VIDEO',
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      handLandmarkerInstance = handLandmarker;
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
