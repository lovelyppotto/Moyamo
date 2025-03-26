import GestureQuiz from "./gesture_quiz/GestureQuiz";
import MeaningQuiz from "./meaning_quiz/MeaningQuiz";
import AiQuiz from "./ai_quiz/AiQuiz";

function QuizContent() {
// 컴포넌트 나눠서 관리: 추후 수정하기기
// 조건1: ai 추가하는 퀴즈들 중 랜덤으로 가져오기
const items = [<GestureQuiz/>, <MeaningQuiz/>, <AiQuiz/>];
const getRandomFromThree = () => {
    return Math.floor(Math.random() * 3);
  };
const randomItem = items[getRandomFromThree()];
// 조건2: ai 제외한 퀴즈들 중 랜덤으로 가져오기

return (
    randomItem
)
}

export default QuizContent




 