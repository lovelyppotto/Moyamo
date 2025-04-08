//서버에 type을 전달해야 함.
import '@/index.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';

function Quiz() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showCameraOption, setShowCameraOption] = useState(false);

  const handleButtonClick = (): void => {
    setOpen(true);
    setShowCameraOption(false);
  };

  const handleStart = (useCamera: boolean) => {
    // useCamera 값에 따라 다른 URL로 이동
    if (useCamera !== undefined) {
      // 다이얼로그에서 선택한 경우
      if (useCamera) {
        navigate('/quizcontent?useCamera=true');
      } else {
        navigate('/quizcontent?useCamera=false');
      }
    } else {
      // 기존 동작 유지
      navigate('/ququizcontentiz');
    }
  };

  const handleBack = (): void => {
    navigate('/');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* w-full h-full을 쓰면 스크롤이 생김!! 전체적으로 설정한 마진값 때문인 것 같음 */}
          <div className="flex flex-col h-screen overflow-hidden w-full bg-[var(--color-kr-100)] dark:bg-gray-900">
            <div className=" flex flex-col justify-center items-center h-3/4 ">
              {/* 중간 텍스트 부분 / 일단 마진값 */}
              <div className="flex flex-col items-center align-center font-['DNFBitBitv2'] mb-30 animate-pulse">
                <img src="/images/quiz_img1.png" alt="quiz-img" className="w-1/2 h-auto " />
                <div className=" text-gray-900 dark:text-gray-200 text-4xl md:text-6xl xl:text-8xl drop-shadow-quiz-box dark:drop-shadow-quiz ">
                  GESTURE QUIZ
                </div>
                {/* <img src="/images/quiz_img2.png" alt="quiz-img" className="w-1/5 h-1/5" /> */}
              </div>

              {/* 마지막 버튼 부분 */}
              <div className="flex justify-center ">
                {/* tailwind.config.js에 커스텀 그림자 정의해야 함 */}
                {/* 함수: 버튼을 누르면 랜덤으로 게임 페이지로 들어가도록 하기 */}
                <button
                  className="text-4xl xl:text-6xl font-['DNFBitBitv2']  text-gray-900  drop-shadow-quiz-box  dark:text-gray-200 px-[10vh] py-[1vh] rounded-xl flex justify-center items-center algin-center  bg-[var(--color-kr-400)] border-2 border-gray-200 dark:border-gray-400 dark:bg-[var(--color-kr-300)] dark:drop-shadow-quiz animate-bounce mt-[5vh] cursor-pointer"
                  onClick={handleButtonClick}
                >
                  <p className="drop-shadow-basic ">start</p>
                </button>
              </div>
            </div>
          </div>
        </DialogTrigger>
        {showCameraOption}
        <DialogContent
          className="py-10 px-10 drop-shadow-basic
            bg-white border-none font-[NanumSquareRound]
            dark:bg-gray-800 dark:text-d-txt-50"
          style={{ maxWidth: '530px', width: '90vw' }}
        >
          <DialogHeader>
            <DialogTitle className="my-4 text-3xl font-[NanumSquareRoundEB]">
              <FontAwesomeIcon icon={faSquareCheck} className="mr-2" />
              제스처 퀴즈 모드 선택
            </DialogTitle>
            <DialogDescription className="text-lg">
              <p>카메라를 활용하는 퀴즈 유형을 포함하시겠습니까?</p>
              <p>모든 데이터는 제스처 분석에만 이용되며 저장되지 않습니다.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-2">
            <Button className="bg-slate-200 dark:bg-slate-600 cursor-pointer" onClick={() => handleStart(false)}>
              제외하기
            </Button>
            <Button
              className="bg-kr-500 dark:bg-kr-450 text-white cursor-pointer"
              onClick={() => handleStart(true)}
            >
              포함하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Quiz;
//텍스트+버튼+그림들PNG우선
//start버튼 누르면 그 다음에 3개 중에 랜덤으로 가도록 함
