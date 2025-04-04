import { create } from 'zustand';
import { GuideTextState, GestureFrequency } from '@/types/gesture';

interface GestureState {
  // 현재 감지된 제스처
  currentGesture: string | null;
  currentConfidence: number | null;

  // 가이드 텍스트 상태
  guideText: GuideTextState;

  // 카운트다운 상태
  isPreparingGesture: boolean;
  preparationCountdown: number;
  isCountingDown: boolean;
  countdown: number;

  // 오류 상태
  isErrorToastShown: boolean;

  // 웹소켓 연결 상태
  isWebSocketConnected: boolean;

  // 제스처 빈도 기록
  gestureFrequency: GestureFrequency;

  // 상태 플래그
  isProcessing: boolean;
  toastShownTimestamp: number | null;

  // 고유 ID 생성용 카운터
  toastIdCounter: number;

  // 액션
  setCurrentGesture: (gesture: string | null) => void;
  setCurrentConfidence: (confidence: number | null) => void;
  setGuideText: (text: GuideTextState) => void;
  setPreparationState: (isPreparingGesture: boolean, countdown?: number) => void;
  setCountdownState: (isCountingDown: boolean, countdown?: number) => void;
  setErrorState: (isErrorShown: boolean) => void;
  setWebSocketConnected: (isConnected: boolean) => void;
  decrementPreparationCountdown: () => void;
  decrementCountdown: () => void;
  updateGestureFrequency: (gesture: string) => void;
  resetGestureData: () => void;
  resetAllState: () => void;
  getUniqueToastId: (prefix: string) => string;

  // 제스처 분석
  getMostFrequentGesture: () => string | null;
}

export const useGestureStore = create<GestureState>((set, get) => ({
  // 초기 상태
  currentGesture: null,
  currentConfidence: null,
  guideText: '버튼을 누르면 검색이 진행됩니다',
  isPreparingGesture: false,
  preparationCountdown: 2,
  isCountingDown: false,
  countdown: 3,
  isErrorToastShown: false,
  isWebSocketConnected: false,
  gestureFrequency: {},
  isProcessing: false,
  toastShownTimestamp: null,
  toastIdCounter: 0,

  // 액션
  setCurrentGesture: (gesture) => set({ currentGesture: gesture }),
  setCurrentConfidence: (confidence) => set({ currentConfidence: confidence }),

  setGuideText: (text) => set({ guideText: text }),

  setPreparationState: (isPreparingGesture, countdown = 2) =>
    set({
      isPreparingGesture,
      preparationCountdown: countdown,
    }),

  setCountdownState: (isCountingDown, countdown = 3) =>
    set({
      isCountingDown,
      countdown,
    }),

  setErrorState: (isErrorShown) =>
    set({
      isErrorToastShown: isErrorShown,
    }),

  setWebSocketConnected: (isConnected) =>
    set({
      isWebSocketConnected: isConnected,
    }),

  decrementPreparationCountdown: () =>
    set((state) => ({
      preparationCountdown: Math.max(0, state.preparationCountdown - 1),
    })),

  decrementCountdown: () =>
    set((state) => ({
      countdown: Math.max(0, state.countdown - 1),
    })),

  updateGestureFrequency: (gesture) =>
    set((state) => {
      const updatedFrequency = { ...state.gestureFrequency };
      updatedFrequency[gesture] = (updatedFrequency[gesture] || 0) + 1;
      return { gestureFrequency: updatedFrequency };
    }),

  resetGestureData: () =>
    set({
      currentGesture: null,
      currentConfidence: null,
      gestureFrequency: {},
      isProcessing: false,
      toastShownTimestamp: null,
    }),

  resetAllState: () =>
    set((state) => ({
      currentGesture: null,
      currentConfidence: null,
      guideText: '버튼을 누르면 검색이 진행됩니다',
      isPreparingGesture: false,
      preparationCountdown: 2,
      isCountingDown: false,
      countdown: 3,
      isErrorToastShown: false,
      gestureFrequency: {},
      isProcessing: false,
      toastShownTimestamp: null,
      // 카운터는 유지 (매번 초기화되지 않도록)
      toastIdCounter: state.toastIdCounter,
    })),

  // 고유한 토스트 ID 생성
  getUniqueToastId: (prefix) => {
    const counter = get().toastIdCounter;
    set((state) => ({ toastIdCounter: state.toastIdCounter + 1 }));
    return `${prefix}-${counter}-${Date.now()}`;
  },

  // 제스처 분석
  getMostFrequentGesture: () => {
    const { gestureFrequency, currentGesture } = get();

    // 감지된 제스처가 없는 경우
    if (Object.keys(gestureFrequency).length === 0) {
      return currentGesture; // 현재 감지된 제스처 반환 (null일 수도 있음)
    }

    // 가장 빈번한 제스처 찾기
    let mostFrequentGesture = '';
    let maxCount = 0;

    Object.entries(gestureFrequency).forEach(([gesture, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentGesture = gesture;
      }
    });

    return mostFrequentGesture || currentGesture;
  },
}));
