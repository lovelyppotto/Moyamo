import { Search, Camera, ChevronDown } from 'lucide-react';
import DarkModeLottie from './DarkModeLottie';

function HeaderBar() {
  return (
    <div className="w-full flex justify-center dark:bg-gray-900 py-4 px-6">
      <div className="w-[80%] bg-white dark:bg-gray-900 py-1 px-6 rounded-xl shadow-sm">
        <div className="flex items-center">
          {/* 로고 */}
          {/* <div className="font-bold text-2xl mr-6">MoyaMo</div> */}

          {/* 검색 카테고리 선택 */}
          <div className="flex items-center flex-1">
            <Search size={16} className="mx-1" />
            <div className="bg-blue-100 dark:bg-blue-900 rounded-md p-1 flex items-center">
              <ChevronDown size={16} className="mx-1" />
              <span className="mx-1">전체</span>
            </div>

            {/* 검색창 */}
            <div className="flex-1 relative ml-2">
              <input
                className="w-full h-10 pl-4 pr-12 border-b focus:outline-none"
                placeholder="검색어를 입력하세요"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Camera className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>

          {/* 다크모드 토글과 언어 선택 */}
          <div className="flex items-center ml-6">
            {/* 다크모드 들어갈자리 */}
            <DarkModeLottie width={60} height={60} />

            <div className="flex items-center ml-4">
              <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center overflow-hidden mr-1">
                <span className="text-white font-bold text-xs">KR</span>
              </span>
              <span>KOR</span>
              <ChevronDown size={16} className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderBar;
