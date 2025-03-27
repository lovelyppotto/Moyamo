export interface Gesture {
  meaningId: number;
  gestureId: number;
  gestureImage: string;
  gestureTitle: string;
  gestureMeaning: string;
  gestureSituation: string;
  gestureOthers: string;
  gestureTmi: string;
  isPositive: boolean;
  multipleGestures: number;
}

export type QuizType = 'GESTURE' | 'MEANING' | 'CAMERA';

interface GestureOption {
  optionId: number;
  gestureId: number;
  gestureImage: string;
}
interface MeanOption {
  optionId: number;
  optionMeaning: string;
}

export interface Quiz {
  questionId: number;
  questionText: string;
  questionType: GestureOption | MeanOption | []; 
  answer: 
}