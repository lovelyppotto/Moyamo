import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GestureSearchResult } from '@/types/searchGestureType';

interface SearchResultItemProps {
  result: GestureSearchResult;
  onFlagClick?: (countryId: number, gestureName: string) => void;
}

function SearchResultItem({ result, onFlagClick }: SearchResultItemProps) {
  const navigate = useNavigate();
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);

  // 제스처 상세 페이지로 이동
  const handleFlagClick = (e: React.MouseEvent, countryId: number) => {
    // 같은 국가 클릭시 초기화, 다른 국가 클릭시 해당 국가로 변경
    setSelectedCountryId(selectedCountryId === countryId ? null : countryId);

    // 선택한 국가 정보 찾기
    const selectedCountryInfo = result.meanings.find((m) => m.countryId === countryId);

    if (!selectedCountryInfo) {
      console.error('선택한 국가 정보를 찾을 수 없습니다.');
      return;
    }

    // GestureDetail 컴포넌트에 필요한 최소한의 정보 전달
    navigate('/dictionary/detail', {
      state: {
        country: {
          id: countryId,
          name: selectedCountryInfo.countryName,
          // code는 제공되지 않으므로 빈 문자열 전달
          code: '',
        },
        gesture: {
          gestureId: result.gestureId,
          gestureTitle: result.gestureName,
          gestureImage: result.gestureImage,
          gestureMeaning: selectedCountryInfo.meaning,
        },
      },
    });

    // 상위 컴포넌트의 핸들러가 있으면 호출
    if (onFlagClick) {
      onFlagClick(countryId, result.gestureName);
    }
  };

  console.log('렌더링된 결과:', result.gestureName, 'gestureId:', result.gestureId);

  return (
    <div className="my-2">
      <div className="flex items-center">
        {/* 이미지 컨테이너 */}
        <div className="flex w-28 h-28 justify-center items-center mr-2 flex-shrink-0">
          <img
            src={result.gestureImage}
            alt={result.gestureName}
            className="h-full object-cover rounded-md"
          />
        </div>
        {/* 제스처 설명 - 말풍선 스타일 */}
        <div className="flex-1 ml-4 relative">
          <div
            className="relative rounded-lg shadow-md p-6
            bg-white
            dark:bg-gray-700 drop-shadow-basic
            "
          >
            {/* 말풍선 꼬리 */}
            <div className="absolute left-0 top-2/3 transform -translate-x-full -translate-y-1/2">
              <svg
                width="15"
                height="30"
                viewBox="0 0 15 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15 5 L0 15 L15 25 Z" fill="white" className="dark:fill-gray-700" />
              </svg>
            </div>

            {/* 제목 */}
            <div className="flex justify-between items-start mb-1 relative z-10">
              <h3
                className="text-3xl font-bold font-[NanumSquareRoundEB] text-gray-900
                dark:text-d-txt-50"
              >
                {result.gestureName}
              </h3>

              {/* 국가 플래그 영역 */}
              <div className="flex items-center space-x-2">
                {result.meanings.map((meaning) => (
                  <React.Fragment key={meaning.countryId}>
                    <div className="relative group">
                      <img
                        src={meaning.imageUrl}
                        alt={meaning.countryName}
                        className={`w-14 h-8 object-cover drop-shadow-nation hover:scale-110 transition-transform cursor-pointer
                          ${selectedCountryId === meaning.countryId ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                        onClick={(e) => handleFlagClick(e, meaning.countryId)}
                        title={`${meaning.countryName}의 의미: ${meaning.meaning}`}
                      />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* 설명 텍스트 */}
            <p
              className="relative z-10 
            text-lg text-gray-700 font-[NanumSquareRound]
            dark:text-d-txt-50"
            >
              {result.meanings[0]?.meaning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResultItem;
