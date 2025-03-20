import { useState } from 'react';
import { Camera, ChevronDown } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import DarkModeLottie from './DarkModeLottie';
import CountryDropdown from './CountryDropdown';


function HeaderBar() {
  const [selectedCountry, setSelectedCountry] = useState('전체');

  const countries = ['전체', '한국', '미국', '중국', '일본', '이탈리아'];

  return (
    <div className="relative w-full">
      <div
        className="absolute
        left-[15%] top-[35px] md:left-[14.5%] md:top-[12px] lg:left-[13.5%] lg:top-[5px]"
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
              <CountryDropdown 
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                countries={countries}
              />
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
