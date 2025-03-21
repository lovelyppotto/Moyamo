// import '../../index.css';
import { faDoorOpen, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import QuizProgress from '../Progress';

function GestureQuiz() {
  return (
    <>
      {/* 헤더부분 */}
      <div className="pb-1 flex justify-between items-center py-3">
        <button>
          <FontAwesomeIcon icon={faDoorOpen} />
        </button>
        <div className="flex justfy-center items-conter">
          {/* 화면에 들어왔을 때부터 초가 줄어드는 함수 만들기 */}
          <p className="absolute z-10 transform translate-x-2 translate-y-0.5 text-[15px] ">60</p>
          <img src="/images/Time.png" alt="Timer" className="z-1 w-8 h-8" />
        </div>
        {/* icon을 volume-xmark로 바꾸기 */}
        <button>
          <FontAwesomeIcon icon={faVolumeXmark} />
        </button>
      </div>
      <div>
        <QuizProgress value={13} className="w-3/5" />
      </div>
      <div className="w-full h-50 bg-amber-400 rounded-xl "></div>
      <div></div>
    </>
  );
}

export default GestureQuiz;
