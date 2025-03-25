import { useLocation } from 'react-router-dom';
import DictHeader from './DictHeader';
import gestureExampleImg from './gesture_example.png';
import DictStatusLabel from './DictStatusLabel';

function CompareGuide() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* 헤더 사용 - Layout의 뒤로가기 버튼과 함께 사용 */}
      <DictHeader title="나라별 제스처 비교 가이드" showCompareGuide={false} className="mb-8" />

      {/* 메인 이미지 */}
      <div className="w-[200px] h-[200px] mb-8 rounded-full bg-white flex justify-center items-center overflow-hidden drop-shadow-basic">
        <img
          src={gestureExampleImg}
          alt="V 사인 제스처"
          className="w-[150px] h-[160px] object-contain"
        />
      </div>

      <div className="w-full flex-1 overflow-y-auto pb-6">
        {/* 국가 그룹 카드들 */}
        <div className="w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
          {/* 영국, 호주, 뉴질랜드 카드 */}
          <div className="bg-white p-6 rounded-lg border border-gray-400 flex flex-col justify-between h-80">
            <div>
              <DictStatusLabel isPositive={true} />
            </div>
            <div className="flex justify-center gap-2 mb-4">
              <img src="/images/flags/uk.png" alt="영국 국기" className="h-8 shadow-sm" />
              <img src="/images/flags/au.png" alt="호주 국기" className="h-8 shadow-sm" />
              <img src="/images/flags/nz.png" alt="뉴질랜드 국기" className="h-8 shadow-sm" />
            </div>
            <h2 className="text-center text-lg font-bold mb-4">영국, 호주, 뉴질랜드</h2>
            <div className="border-t pt-4">
              <p className="text-center">
                손등이 밖을 향하게 하는 V 사인은
                <br />
                무례한 의미를 가집니다.
              </p>
            </div>
          </div>

          {/* 그리스, 터키 카드 */}
          <div className="bg-white p-6 rounded-lg border border-gray-400">
            <div className="flex justify-center gap-2 mb-4">
              <img src="/images/flags/gr.png" alt="그리스 국기" className="h-8 shadow-sm" />
              <img src="/images/flags/tr.png" alt="터키 국기" className="h-8 shadow-sm" />
            </div>
            <h2 className="text-center text-lg font-bold mb-4">그리스, 터키</h2>
            <div className="border-t pt-4">
              <p className="text-center">
                손바닥이 상대를 향하게 하는 V사인은
                <br />
                무례한 의미를 가집니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareGuide;
