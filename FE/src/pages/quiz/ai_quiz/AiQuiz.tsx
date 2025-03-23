// import '../../index.css';
import { faArrowRight} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Progress from '@/pages/quiz/Progress.tsx';
import Webcam from 'react-webcam';
import { useRef } from 'react';

function AiQuiz() {
  const webcamRef = useRef<Webcam>(null);
  return (
    <div>
        <div className='flex flex-col h-screen overflow-hidden w-full'>
          {/* 초시계: 디자인 더 이쁜 시계로 바꾸기! */}
          <div className="absolute left-1/2 top-4 transform -translate-x-1/2 z-10">
            <div className="flex justfy-center items-conter">
              {/* 퀴즈 화면에 들어왔을 때부터 초가 줄어드는 부분: 함수 만들기 => progress component로 옮기는것 고려하기기*/}
              <p className="absolute z-10 transform translate-x-3 translate-y-3 text-2xl font-[NanumSquareRoundB] text-gray-400">10</p>
              <img src="/images/Time.png" alt="Timer" className="z-1 w-15 h-15" />
            </div>
          </div>

          {/* 진행 바, 문제와 스킵버튼 */}
          {/* progress바를 seekbar로 교체하기!!! */}
          {/* 마진 탑(margin-top)을 뷰포트 높이(viewport height)의 5%로 설정 */}
          <div className='h-screen flex flex-col mt-[10vh] mx-[10vh]'>
            <Progress/>
            <div className='flex-col mt-[3vh] h-2/3 flex items-center'>
              <div className='flex justify-between items-center mb-[2vh]'>
                <h1 className='text-2xl lg:text-3xl 2xl:text-3xl font-[NanumSquareRoundB] mr-[18vh]'>Q.화면에 '사랑해'라는 의미의 제스처를 해주세요.</h1>
                <button className='flex justify-between items-center rounded-2xl py-1 px-3 hover:bg-gray-200'>
                  <p className='text-xl 2xl:text-2xl font-[NanumSquareRoundB]'>Skip</p>
                  <FontAwesomeIcon icon={faArrowRight} className='m-3'/>
                </button>
              </div>
                {/* 웹캠 + 가이드라인 */}
                {/* 카메라가 켜지기 전에 3초정도 가림막(3초 애니메이션)이 생기도록 하기!!          */}
                <div className='p-3 w-[80vh]  bg-white rounded-2xl '>
                  <Webcam
                    audio={false}
                    width={1280}
                    height={720}
                    ref={webcamRef}
                    videoConstraints={{
                      facingMode: "user"
                    } }
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  <div className="absolute top-45 left-0 w-full h-full flex justify-center items-center pointer-events-none">
                  <div className="relative w-[50%] h-[80%] flex justify-center items-center animate-puls">
                    {/* 얼굴 가이드선 (원) */}
                    <div className="absolute top-[12vh] w-[33vh] h-[33vh] rounded-full border-2 border-dashed border-white "></div>
                    
                    {/* 상체 가이드선 (타원) */}
                    <div className="absolute top-[45vh] w-[50vh] h-[20vh] rounded-t-[50%] border-t-2 border-l-2 border-r-2 border-dashed border-white"></div>
                    
                    {/* 안내 텍스트 */}
                    <p className="absolute top-[7vh] text-center text-lg font-[NanumSquareRoundB] text-white">
                      얼굴과 상체를 가이드라인 안에 맞춰주세요
                    </p>
                  </div>
                </div>
                </div>
                
            </div>
          </div>

        </div>

    </div>
  );
}

export default AiQuiz;
