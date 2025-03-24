import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import CountrySelector from '../CountrySelector';


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
              <img src="/images/dict.png" alt="DictionaryIcon" className="drop-shadow-basic" draggable="false" />
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
      <CountrySelector
        title = 'Dictionary'
        subtitle='제스처를 알아보고 싶은 나라를 선택하세요'
        onSelectCountry={handleCountrySelect}
        onClose={() => setOpen(false)}
      />
    </Dialog>
  );
};

export default DictionaryButton;