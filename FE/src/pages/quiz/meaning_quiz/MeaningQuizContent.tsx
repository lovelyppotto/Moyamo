// MeaningQuizContent.tsx
import React from 'react';

// 선택 후 결과를 표시하는 컴포넌트
function ResultOverlay({ isCorrect = true }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl font-bold">
        ○
      </div>
    </div>
  );
}

function MeaningQuizContent() {
  // 예시 데이터
  const imageUrl = '/api/placeholder/150/150';
  const options = ['사랑해', '미안해', '승리', '약속'];

  return (
    <div className="mt-4">
      {/* 이미지 영역 */}
      <div className="relative bg-white rounded-lg shadow-md p-6 mb-4 flex justify-center">
        <img src={imageUrl} alt="손동작 이미지" className="h-32 object-contain" />
        {/* 정답 표시는 기능 구현 시 조건부로 표시되도록 주석 처리
        <ResultOverlay isCorrect={true} /> 
        */}
      </div>

      {/* 선택지 버튼 영역 */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <button
            type="button"
            key={index}
            className={`p-3 rounded flex items-center ${
              index === 0 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            } border shadow-sm`}
          >
            <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center mr-2">
              {index + 1}
            </span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MeaningQuizContent;

// function MeaningQuizContent() {
//   return <div>MeaningQuizContent</div>;
// }

// export default MeaningQuizContent;
// //네모 안에 손동작 이미지 :가져오기/ 일단 PNG목데이터 하나 가져오기기
// //버튼 4개 : 텍스트 가져오기: 일단 목데이터 1.사랑해 2. 미안해 3. 승리 4. 약속
