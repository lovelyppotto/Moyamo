import Progress from './Progress.tsx';
import Answers from './Answers.tsx';
import PbNumber from './PbNumber.tsx';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function Question({ questionText, answers, onSelectAnswer, quizImage, onSkipAnswer, Index }) {
  return (
    <>
      {/* 진행 바, 퀴즈박스 */}
      {/* 마진 탑(margin-top)을 뷰포트 높이(viewport height)의 5%로 설정 */}
      <div className="h-screen flex flex-col mt-[5vh] xl:mt-[10vh] mx-[2vh] xl:mx-[10vh]">
        <div className="flex justfy-center items-center align-middle">
          <PbNumber Index={Index} />
        </div>
        {/* 문제: 계속 이전의 progress값이 저장이 된다 */}
        <Progress
          // key={activeQuestionIndex} // key를 index값으로 변경 : 해당 컴포넌트가 재랜더링됨.
          timeout={10000}
          onTimeout={onSkipAnswer}
        />
        <div className="flex justify-between items-center mt-[3vh]">
          <h1 className="sm:text-sm md:text-2xl lg:text-3xl 2xl:text-4xl font-[NanumSquareRoundB]">
            {questionText}
          </h1>
          <button className="flex justify-between items-center rounded-2xl py-1 px-3 hover:bg-gray-200">
            <p className="sm:text-xs md:text-xl 2xl:text-2xl font-[NanumSquareRoundB]">Skip</p>
            <FontAwesomeIcon icon={faArrowRight} className="m-3 sm:text-xs md:text-xl" />
          </button>
        </div>
        <div className="flex justify-center w-full h-2/7 bg-white rounded-xl drop-shadow-quiz-box  my-[3vh]">
          {/* 추후, 백앤드에서 blender 애니메이션을 가져올 예정 */}
          <img src={quizImage} alt="sample_img" className="p-5" />
        </div>
        {/* 보기 */}
        <Answers
          // key={activeQuestionIndex}
          answers={answers}
          onSelect={onSelectAnswer}
        />
      </div>
    </>
  );
}

export default Question;
