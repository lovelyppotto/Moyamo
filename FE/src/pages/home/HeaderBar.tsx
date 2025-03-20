import { useState } from 'react';
import { Camera, ChevronDown } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import DarkModeLottie from './DarkModeLottie';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function HeaderBar() {
  const [selectedCountry, setSelectedCountry] = useState('전체');

  const countries = ['전체', '한국', '미국', '중국', '일본', '이탈리아'];

  return (
    <div className="relative w-full">
      <div
        className="absolute
        left-[16%] top-[35px] md:left-[14.5%] md:top-[20px] lg:left-[14%] lg:top-[15px]"
      >
        <img
          src="./images/logo.png"
          alt="MoyamoLogo"
          className="w-25 h-10 md:w-32 md:h-13 lg:w-40 lg:h-15 "
        />
      </div>
      <div className="w-full flex justify-center dark:bg-gray-900 mt-11 mb-5 py-4 px-6">
        <div className="w-[75%] bg-white dark:bg-gray-900 py-1 px-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            {/* 검색 카테고리 선택 */}
            <div className="flex items-center flex-1">
              <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" className="mr-3" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className="flex items-center justify-between
                    min-w-[90px] md:min-w-[110px] lg:min-w-[130px] 
                    w-auto whitespace-nowrap
                    bg-kr-300 dark:bg-blue-900 rounded-md p-1 px-2
                    cursor-pointer"
                  >
                    <ChevronDown size={18} className="flex-shrink-0 ml-1 md:ml-2" />
                    <div className="flex-1 flex items-center justify-center">
                      <span
                        className="text-xs md:text-sm lg:text-base
                        font-[NanumSquareRound] font-extrabold"
                      >
                        {selectedCountry}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[130px]">
                  {countries.map((c) => (
                    <DropdownMenuItem
                      key={c}
                      className="font-[NanumSquareRound] cursor-pointer"
                      onClick={() => setSelectedCountry(c)}
                    >
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 검색창 */}
              <div className="flex items-center w-full ml-2 mr-2">
                <div className="relative flex-1 min-w-[70%]">
                  <input
                    className="w-full h-10 px-2 border-b border-gray-400 focus:outline-none font-[NanumSquareRound]"
                    placeholder="검색어를 입력하세요"
                  />
                </div>
                <div className="ml-3 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-500 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* 다크모드 토글 및 언어 선택 */}
            <div className="flex items-center ml-6">
              <DarkModeLottie />

              <div className="flex items-center">
                <span className="w-6 h-6 mr-2 bg-red-500 rounded-full flex items-center justify-center overflow-hidden">
                  <span className="text-white font-bold text-xs">KR</span>
                </span>
                <span className="font-[NanumSquareRound] font-extrabold">KOR</span>
                <ChevronDown size={18} className="ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderBar;
