import {
  HandLandmarker,
  FilesetResolver
} from '@mediapipe/tasks-vision';

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
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      const handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
        // 기존 옵션들...
      });

      handLandmarkerInstance = handLandmarker;
      return handLandmarker;
    } finally {
      isInitializing = false;
    }
  })();

  return initPromise;
};
