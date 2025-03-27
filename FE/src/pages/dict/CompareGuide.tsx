import DictHeader from './DictHeader';
import gestureExampleImg from './gesture_example.png';
import DictStatusLabel from './DictStatusLabel';

function CompareGuide() {
  return (
    <div className="h-screen w-full flex flex-col dark:bg-gray-900 dark:text-d-txt-50">
      {/* 헤더 */}
      <DictHeader
        title="나라별 제스처 비교 가이드"
        showCompareGuide={false}
        className="mb-[3%] lg:mb-[2%]"
      />

      {/* 컨텐츠 - flex-1 대신 고정된 높이 계산 */}
      <div className="h-[calc(100vh-80px)] flex flex-col">
        {/* 메인 이미지 - 고정 높이 사용 */}
        <div className="h-[180px] flex justify-center items-center mb-[3%] lg:mb-[2%]">
          <div className="w-[180px] h-[180px] rounded-full bg-white dark:bg-gray-500 flex justify-center items-center drop-shadow-basic">
            <img
              src={gestureExampleImg}
              alt="V 사인 제스처"
              className="w-[80%] h-[80%] object-contain"
            />
          </div>
        </div>

        {/* 카드 컨테이너 */}
        <div className="flex-1 px-4 pb-6 overflow-y-auto">
          {/* 국가 그룹 카드들 */}
          <div className="w-full md:max-w-[800px] md:px-8 lg:max-w-[1000px] lg:px-0 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 영국, 호주, 뉴질랜드 카드 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-400 flex flex-col h-auto min-h-[250px] max-h-[350px]">
              <DictStatusLabel isPositive={true} className="mb-6" />
              <div className="flex justify-center gap-[5%] mb-[4%]">
                <img
                  src="/images/flags/uk.png"
                  alt="영국 국기"
                  className="w-[25%] h-auto max-w-[80px] drop-shadow-nation"
                />
                <img
                  src="/images/flags/au.png"
                  alt="호주 국기"
                  className="w-[25%] h-auto max-w-[80px] drop-shadow-nation"
                />
                <img
                  src="/images/flags/nz.png"
                  alt="뉴질랜드 국기"
                  className="w-[25%] h-auto max-w-[80px] drop-shadow-nation"
                />
              </div>
              <h2 className="text-center text-xl font-[NanumSquareRoundB] mb-6">
                영국, 호주, 뉴질랜드
              </h2>
              <hr className="text-gray-400" />
              <div className="pt-[6%] mt-auto">
                <p className="text-center font-[NanumSquareRound] text-lg lg:text-xl">
                  손등이 밖을 향하게 하는 V 사인은
                  <br />
                  무례한 의미를 가집니다.
                </p>
              </div>
            </div>

            {/* 그리스, 터키 카드 */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-400 flex flex-col h-auto min-h-[250px] max-h-[350px]">
              <DictStatusLabel isPositive={false} className="mb-6" />
              <div className="flex justify-center gap-[5%] mb-[5%]">
                <img
                  src="/images/flags/gr.png"
                  alt="그리스 국기"
                  className="w-[25%] h-auto max-w-[80px] drop-shadow-nation"
                />
                <img
                  src="/images/flags/tr.png"
                  alt="터키 국기"
                  className="w-[25%] h-auto max-w-[80px] drop-shadow-nation"
                />
              </div>
              <h2 className="text-center text-xl font-[NanumSquareRoundB] mb-6">그리스, 터키</h2>
              <hr className="text-gray-400" />
              <div className="pt-[6%] mt-auto">
                <p className="text-center font-[NanumSquareRound] text-lg lg:text-xl">
                  손바닥이 상대를 향하게 하는 V사인은
                  <br />
                  무례한 의미를 가집니다.
                </p>
              </div>
            </div>
            {/* 테스트 */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-400 flex flex-col h-auto min-h-[250px] max-h-[350px]">
              <DictStatusLabel isPositive={false} className="mb-6" />
              <div className="flex justify-center gap-[5%] mb-[5%]">
                <img
                  src="/images/flags/gr.png"
                  alt="그리스 국기"
                  className="w-[25%] h-auto max-w-[80px] drop-shadow-nation"
                />
                <img
                  src="/images/flags/tr.png"
                  alt="터키 국기"
                  className="w-[25%] h-auto max-w-[80px] drop-shadow-nation"
                />
              </div>
              <h2 className="text-center text-xl font-[NanumSquareRoundB] mb-6">그리스, 터키</h2>
              <hr className="text-gray-400" />
              <div className="pt-[6%] mt-auto">
                <p className="text-center font-[NanumSquareRound] text-lg lg:text-xl">
                  손바닥이 상대를 향하게 하는 V사인은
                  <br />
                  무례한 의미를 가집니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareGuide;
