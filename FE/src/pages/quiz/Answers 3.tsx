import WebCamera from '@/components/WebCamera';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Answers3() {
  return (
    <>
      <div className="flex-col mt-[3vh] h-2/3 flex items-center">
        <div className="flex justify-between items-center mb-[2vh]">
          <button className="flex justify-between items-center rounded-2xl py-1 px-3 hover:bg-gray-200">
            <p className="text-xs md:text-xl 2xl:text-2xl font-[NanumSquareRoundB]">Skip</p>
            <FontAwesomeIcon icon={faArrowRight} className="m-3" />
          </button>
        </div>
        {/* 웹캠 + 가이드라인 */}
        {/* 카메라가 켜지기 전에 3초정도 가림막(3초 애니메이션)이 생기도록 하기!!          */}
        <WebCamera />
      </div>
    </>
  );
}

export default Answers3;
