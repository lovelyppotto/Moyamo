import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

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

function DictionaryButton() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleDictionaryClick = (): void => {
    setOpen(true);
  };

  const handleCountrySelect = (countryId: number): void => {
    // 사전 페이지로 라우팅
    navigate(`/dictionary?country_id=${countryId}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={handleDictionaryClick}
          className="flex flex-col items-center bg-transparent border-none cursor-pointer transform transition-transform duration-300 hover:scale-105"
        >
          <div
            className="flex items-center justify-center relative
            w-48 h-22 md:w-62 md:h-25 lg:w-70 lg:h-28
            bg-inch-worm-500 dark:bg-inch-worm-450
            rounded-full drop-shadow-basic"
          >
            <div className="relative mb-14 md:mb-16 lg:mb-20">
              {/* 책 이미지 */}
              <img src="/images/dict.png" alt="DictionaryIcon" className="drop-shadow-basic" />
            </div>
          </div>
          <p
            className="font-[NanumSquareRoundEB]
            mt-2 md:mt-2 lg:mt-2
            text-lg md:text-xl lg:text-2xl"
          >
            Dictionary
          </p>
        </button>
      </DialogTrigger>
      
      <DialogContent className="p-0 sm:max-w-md rounded-2xl bg-white border-none">
        <div className='p-2 rounded-t-2xl bg-gray-200'>
          <DialogHeader className="relative m-0">
            <button 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">닫기</span>
            </button>
            
            <DialogTitle className="text-center text-3xl font-[NanumSquareRoundEB] mt-2">
              Dictionary
              <p className="text-base font-[NanumSquareRound] mt-2">제스처를 알아보고 싶은 나라를 선택하세요</p>
            </DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="flex flex-col space-y-3 px-2 mb-3">
          {countries.map((country) => (
            <DialogClose asChild key={country.id}>
              <button
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
            </DialogClose>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DictionaryButton;