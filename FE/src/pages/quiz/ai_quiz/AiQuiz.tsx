// import '../../index.css';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Progress from '@/pages/quiz/Progress.tsx';
import QuizResult from '../QuizResult';
import PbNumber from '../PbNumber';
import { useState, useEffect } from 'react';
import WebCamera from '@/components/Webcamera';

function AiQuiz() {
  // const webcamRef = useRef<Webcam>(null);
  const [isResult, setIsResult] = useState(false);

  useEffect(() => {
    // 결과 페이지가 나오는 함수: 일단 60초 후에 열리도록 함. 추후 조건 수정할 것
    const timerId = setTimeout(() => {
      setIsResult(true);
      console.log('result창이 열렸습니다.');
    }, 10000);
    // 마운트 할 때 타이머 값은 초기화 된다.
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <div>
      {isResult ? <QuizResult /> : ''}
      <div className="flex flex-col h-screen overflow-hidden w-full ">
        {/* 문제 번호 확인 창창 */}
        <div className="absolute left-1/2 top-4 transform -translate-x-1/2 z-10">
          <div className="flex justfy-center items-conter">
            <PbNumber />
          </div>
        </div>

        {/* 진행 바, 문제와 스킵버튼 */}
        {/* progress바를 seekbar로 교체하기!!! */}
        {/* 마진 탑(margin-top)을 뷰포트 높이(viewport height)의 5%로 설정 */}
        <div className="h-screen flex flex-col mt-[5vh] md:mt-[10vh] mx-[1vh] md:mx-[2vh] xl:mx-[10vh]">
          <Progress />
          <div className="flex-col mt-[3vh] h-2/3 flex items-center">
            <div className="flex justify-between items-center mb-[2vh]">
              <h1 className="text-xs md:text-2xl lg:text-3xl 2xl:text-3xl font-[NanumSquareRoundB] mr-[2vh] md:mr-[5vh] xl:mr-[18vh]">
                Q.화면에 '사랑해'라는 의미의 제스처를 해주세요.
              </h1>
              <button className="flex justify-between items-center rounded-2xl py-1 px-3 hover:bg-gray-200">
                <p className="text-xs md:text-xl 2xl:text-2xl font-[NanumSquareRoundB]">Skip</p>
                <FontAwesomeIcon icon={faArrowRight} className="m-3" />
              </button>
            </div>
            {/* 웹캠 + 가이드라인 */}
            {/* 카메라가 켜지기 전에 3초정도 가림막(3초 애니메이션)이 생기도록 하기!!          */}
            <WebCamera />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiQuiz;
