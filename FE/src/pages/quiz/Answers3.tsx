import { useState } from 'react';
import WebCamera from '@/components/WebCamera';
import CameraTimer from './CameraTimer';
import { FrontendQuestionData } from '@/types/quizTypes';

interface Answers3Props {
  options: FrontendQuestionData['options'];
  answer: FrontendQuestionData['answer'];
  onSelect: (answer: number | null) => void;
  isSelected: number | null;
  answerState: string;
  onProgressStart: () => void;
}

const Answers3: React.FC<Answers3Props> = ({ onSelect, answer, onProgressStart }) => {
  const [showTimer, setShowTimer] = useState(true);

  const handleTimerEnd = () => {
    setShowTimer(false);
    // 타이머가 끝나고 1초 후에 프로그레스 바 시작
    setTimeout(() => {
      onProgressStart();
    }, 1000);
  };

  return (
    <div className="flex justify-center relative h-screen mx-[2vh] xl:mx-[10vh] bg-transparent">
      <div className="h-1/3 sm:h-1/2  w-auto aspect-square ">
        <WebCamera onGestureDetected={(gestureId: number) => onSelect(gestureId)} />
        {showTimer && <CameraTimer onTimerEnd={handleTimerEnd} />}
      </div>
    </div>
  );
};

export default Answers3;
{
  /* 웹캠 + 가이드라인 */
}
{
  /* 카메라가 켜지기 전에 3초정도 가림막(3초 애니메이션)이 생기도록 하기!!*/
}
//영상인데... onSelect로 ai가 인식한 정답을 받은 것을 상위 페이지로 보낼 수 있나?
// answer.correct_gesture_id랑 ... ai가 보내주는 id랑 비교해서... 같으면 정답, 틀리면 오답!

// 상위 페이지에서 가져오는 값들
//   {QUESTIONS.data[Index].question_type === 'CAMERA' && (<Answers3
//   options={QUESTIONS.data[Index].options}
//   answer = {QUESTIONS.data[Index].answer}
//   onSelect={handleSelectAnswer}
//   isSelected={answer.selectedAnswer}
//   answerState={answer.answerState}
// />)}

// 목데이터
// {
//   question_id: 3,
//   question_text: '00나라에서 00의미로 사용되는 이 제스처를 맞추시오',
//   question_type: 'CAMERA',
//   options: [],
//   answer: {
//     answer_id: 3,
//     correct_gesture_id: 7,
//     correct_gesture_image: 'https://example.com/gesture7.png',
//     correct_gesture_name: 'finger_heart',

//   },
