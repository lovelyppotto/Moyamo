import '../../index.css';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Quiz() {
  return (
    <>
      {/* 레이아웃에서 배경화면 넣어주면 가져오기(헤더때문에 잠시 레이앙웃 제거함) */}
      {/* 헤더부분 */}
      <div className="pb-1 flex justify-between py-3 ">
        <button>
          <FontAwesomeIcon icon={faDoorOpen} />
        </button>
        {/* icon을 volume-xmark로 바꾸기 */}
        {/* 함수: 누를 때마다 볼륨 상태 바뀌도록! */}
        <button>
          <FontAwesomeIcon icon={faDoorOpen} />
        </button>
      </div>
      <div className="py-30">
        {/* 중간 텍스트 부분 / 일단 마진값 */}
        <div className="flex justify-between items-center pb-3 font-['DNFBitBitv2'] mx-20">
          <img src="/images/quiz_img1.png" alt="quiz-img" className="w-1/5 h-1/5" />
          <div className="text-4xl md:text-5xl xl:text-6xl">GESTURE QUIZ</div>
          <img src="/images/quiz_img2.png" alt="quiz-img" className="w-1/5 h-1/5" />
        </div>
        {/* 마지막 버튼 부분 */}
        <div className="flex justify-center pt-5">
          {/* tailwind.config.js에 커스텀 그림자 정의해야 함 */}
          <button className="text-2xl xl:text-4xl font-['DNFBitBitv2'] shadow-xl p-3 rounded-xl flex justify-center items-center algin-center bg-gray-50">
            start
          </button>
        </div>
      </div>
    </>
  );
}

export default Quiz;
//텍스트+버튼+그림들PNG우선
//start버튼 누르면 그 다음에 3개 중에 랜덤으로 가도록 함
