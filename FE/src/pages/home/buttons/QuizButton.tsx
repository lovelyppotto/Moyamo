import { useNavigate } from 'react-router-dom';
import { getIconImage } from '@/utils/imageUtils';

function QuizButton() {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/quiz');
  };

  return (
    <button
      onClick={handleButtonClick}
      className="flex flex-col items-center
          bg-transparent border-none z-20
          cursor-pointer transform transition-transform duration-300
          hover:scale-105"
    >
      <div
        className="flex items-center justify-center relative
            w-48 h-22 md:w-62 md:h-25 lg:w-70 lg:h-28
            bg-lavender-rose-300 dark:bg-lavender-rose-250
            rounded-full drop-shadow-basic"
      >
        <div
          className="relative 
              ml-5 w-41 mb-18 md:w-50 md:mb-20 lg:w-55 lg:mb-25"
        >
          <img
            src={getIconImage('quiz')}
            alt="QuizIcon"
            className="drop-shadow-basic"
            draggable="false"
          />
        </div>
      </div>
      <p
        className="font-[NanumSquareRoundEB]
            mt-2 md:mt-2 lg:mt-2
            text-lg md:text-xl lg:text-2xl"
      >
        Quiz
      </p>
    </button>
  );
}

export default QuizButton;
