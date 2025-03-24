import { useLocation, useNavigate } from 'react-router-dom';
import DictHeader from './DictHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

// 목록에서 선택된 제스처
interface Gesture {
  id: string;
  title: string;
  image: string;
}

// 목록에서 선택된 국가
interface Country {
  code: string;
  name: string;
}

// location.stated의 타입 안정성을 보장 (기본적으로 any, unknown 타입임)
interface LocationState {
  country: Country;
  gesture: Gesture;
}

function GesturePractice() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    navigate('/dictionary');
  }

  const { country, gesture } = location.state as LocationState;
  console.log(country);
  console.log(gesture);

  return (
    <div className="w-full h-full">
      {/* 헤더 */}
      <DictHeader title="연습하기" className="" />
      {/* 간단한 설명 */}
      <div className="font-[NanumSquareRoundB] text-[24px] pt-10 px-4 text-center">
        <span>제스처를 정확히 따라하면 화면에 </span>
        <span className="text-fern-400 font-[NanumSquareRoundEB]">O</span>
        <span>가 표시됩니다.</span>
      </div>
      {/* 메인 컨텐츠 */}
      <div className="flex flex-1 mx-auto px-5">
        {/* 따라할 제스처 */}
        <div className="w-1/2 p-8 flex justify-center items-center">
          <div className="w-[600px] h-[455px] p-6 bg-white rounded-lg drop-shadow-basic flex justify-center items-center">
            <img
              src={gesture.image}
              alt={`${gesture.title} image`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* 연습화면 */}
        <div className="w-1/2 p-6 flex justify-center items-center">
          <div className="w-[600px] h-[455px] bg-gray-200 rounded-lg drop-shadow-basic flex justify-center items-center">
            <div className="flex flex-col items-center text-gray-400 font-[NanumSquareRoundB] text-center space-y-5">
              <FontAwesomeIcon icon={faCamera} className="fa-9x" />
              <p className="text-[26px]">
                카메라를 클릭 시<br />
                연습을 시작합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GesturePractice;
