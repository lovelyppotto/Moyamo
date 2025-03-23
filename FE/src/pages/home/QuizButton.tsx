import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';

// 국가 타입 
interface Country {
  id: number;
  code: string;
  name: string;
  flagSrc: string;
}

// 국가 데이터
const countries: Country[] = [
  {
    id: 1,
    code: 'KR',
    name: '한국',
    flagSrc: '/images/flags/kr.png',
  },
  {
    id: 2,
    code: 'US',
    name: '미국',
    flagSrc: '/images/flags/us.png',
  },
  {
    id: 3,
    code: 'JP',
    name: '일본',
    flagSrc: '/images/flags/jp.png',
  },
  {
    id: 4,
    code: 'CN',
    name: '중국',
    flagSrc: '/images/flags/cn.png',
  },
  {
    id: 5,
    code: 'ITA',
    name: '이탈리아',
    flagSrc: '/images/flags/ita.svg',
  },
];

function QuizButton() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [showCameraOption, setShowCameraOption] = useState(false);

  const handleButtonClick = (): void => {
    setOpen(true);
    setShowCameraOption(false);
    setSelectedCountry(null);
  };

  const handleCountrySelect = (countryId: number): void => {
    setSelectedCountry(countryId);
    setShowCameraOption(true);
  };

  const handleQuizClick = (useCamera: boolean) => {
    // useCamera 값에 따라 다른 URL로 이동
    if (useCamera !== undefined) {
      // 다이얼로그에서 선택한 경우
      if (useCamera) {
        navigate('/quiz?useCamera=true');
      } else {
        navigate('/quiz?useCamera=false');
      }
    } else {
      // 기존 동작 유지
      navigate('/quiz');
    }
  };

  const handleBack = (): void => {
    setShowCameraOption(false);
    setSelectedCountry(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={handleButtonClick}
          className="flex flex-col items-center bg-transparent border-none cursor-pointer transform transition-transform duration-300 hover:scale-105"
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
              <img src="/images/quiz.png" alt="QuizIcon" className="drop-shadow-basic" />
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
      </DialogTrigger>

      {!showCameraOption ? (
        // 국가 선택 다이얼로그 (Dictionary와 유사한 형태)
        <DialogContent className="p-0 sm:max-w-md rounded-2xl bg-white border-none">
          <div className="p-2 rounded-t-2xl bg-gray-200">
            <DialogHeader className="relative m-0">
              <button 
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">닫기</span>
              </button>
              
              <DialogTitle className="text-center text-3xl font-[NanumSquareRoundEB] mt-2">
                Quiz
                <p className="text-base font-[NanumSquareRound] mt-2">퀴즈를 풀고 싶은 나라를 선택하세요</p>
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="flex flex-col px-2 mb-3">
            {countries.map((country) => (
              <button
                key={country.id}
                className="flex justify-center items-center hover:bg-kr-200 rounded-xl py-4 px-6 transition-colors"
                onClick={() => handleCountrySelect(country.id)}
              >
                <div className="w-12 h-8 flex items-center justify-center mr-4 overflow-hidden">
                  <img 
                    src={country.flagSrc} 
                    alt={`${country.name} 국기`} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="text-xl font-medium">{country.name}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      ) : (
        // 카메라 옵션 다이얼로그 (국가 선택 후 표시)
        <DialogContent
          className="py-10 px-10 drop-shadow-basic
            bg-white border-none font-[NanumSquareRound]
            dark:bg-gray-800 dark:text-d-txt-50"
          style={{ maxWidth: '530px', width: '90vw' }}
        >
          <DialogHeader>
            <button 
              className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
              onClick={handleBack}
            >
              <span className="sr-only">뒤로</span>
              ← 뒤로
            </button>
            
            <DialogTitle className="mb-2 text-3xl font-[NanumSquareRoundEB]"> 
              <FontAwesomeIcon icon={faSquareCheck} className="mr-2" />
              제스처 퀴즈 모드 선택
            </DialogTitle>
            <DialogDescription className="text-lg">
              <p>카메라를 활용하는 퀴즈 유형을 포함하시겠습니까?</p>
              <p>모든 데이터는 제스처 분석에만 이용되며 저장되지 않습니다.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-2">
            <Button 
              className="bg-slate-200 dark:bg-slate-600"
              onClick={() => handleQuizClick(false)}
            >
              제외하기
            </Button>
            <Button
              className="bg-kr-500 dark:bg-kr-450 text-white"
              onClick={() => handleQuizClick(true)}
            >
              포함하기
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default QuizButton;