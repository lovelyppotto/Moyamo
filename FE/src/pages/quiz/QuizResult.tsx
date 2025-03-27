import { faHouse, faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import QUESTIONS from './questions.ts';
function QuizResult({ userAnswers }) {
  const navigate = useNavigate();
  const handleQuiz = () => {
    navigate('/quiz');
  };
  const handleHome = () => {
    navigate('/');
  };
  const isCorrectAnswers = userAnswers.filter(
    (answer, index) => answer === QUESTIONS[index].answers[0]
  );
  const isCorrectNumber = isCorrectAnswers.length;
  return (
    <>
      <div className="h-screen w-full overflow-hidden  flex flex-col justify-center  items-center bg-black/80 z-20 absolute">
        {/* lottie 움직이는 이모티콘 하나 넣기 */}
        <div className="text-xl font-bold font-[Galmuri11] p-[3vh] drop-shadow-quiz-box text-white animate-bounce">
          VERY GOOD!
        </div>
        <div className="flex flex-col justify-center items-center bg-white border-5 border-yellow-400 rounded-xl w-1/2 h-1/3 md:h-[44vh] xl:h-1/2 p-[5vh] py-[5vh] ">
          <h1 className="text-4xl font-bold font-[DNFBitBitv2] text-yellow-500 drop-shadow-quiz-box">
            SCORE
          </h1>
          {/* 함수: 맞춘 갯수 count를 한 후에, 숫자로 보여주기 */}
          <p className="  text-yellow-500  text-4xl font-bold font-[DNFBitBitv2] p-5">
            {isCorrectNumber}
          </p>
          {/* 함수: 맞춘 갯수에 따라서 다른 사진 (로티 애니메이션) 제공 */}
          <img src="/images/star4.png" alt="stars" className="w-2/3 drop-shadow-quiz-box" />
        </div>
        <div className="flex justify-center p-[3vh] w-1/2 h-1/6">
          <button
            className="bg-white in-hover:not-only:not-first:not-odd:: rounded-xl w-1/4 h-full mx-[2vh] text-2xl drop-shadow-quiz-box  hover:bg-yellow-200 cursor-pointer"
            onClick={handleHome}
          >
            <FontAwesomeIcon icon={faHouse} />
          </button>
          <button
            className="bg-white rounded-xl w-1/4 h-full mx-[2vh] drop-shadow-quiz-box text-2xl -box hover:bg-yellow-200 cursor-pointer"
            onClick={handleQuiz}
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>
        </div>
      </div>
    </>
  );
}

export default QuizResult;
