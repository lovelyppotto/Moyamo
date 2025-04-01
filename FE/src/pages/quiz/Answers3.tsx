import WebCamera from '@/components/WebCamera';
import { FrontendQuestionData } from '@/types/quizTypes';

interface Answers3Props {
  options: FrontendQuestionData['options'];
  answer: FrontendQuestionData['answer'];
  onSelect: (answer: number | null) => void;
  isSelected: number | null;
  answerState: string;
}

const Answers3: React.FC<Answers3Props> = ({ onSelect, answer }) => {
  return (
    <div className="flex-col mt-[3vh] h-2/3 flex items-center">
      <div className="flex justify-between items-center mb-[2vh]"></div>
      <WebCamera onGestureDetected={(gestureId: number) => onSelect(gestureId)} />
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
