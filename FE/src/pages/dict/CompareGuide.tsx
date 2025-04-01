import DictHeader from './DictHeader';
import DictStatusLabel from './DictStatusLabel';
import { useCompareGuide } from '../../hooks/apiHooks';
import { MeaningItem } from '../../types/dictCompareType';
import { getFlagImage } from '@/utils/imageUtils';
import { useCountryCode } from '@/hooks/useCountryCode';

function CompareGuide() {
  const getCountryCode = useCountryCode();
  
  // 이미지 제대로 들어오면 삭제!!!!
  const defaultImagePath = '/images/gestures/cross-finger.png';

  // URL 쿼리 파라미터에서 gesture_id 추출
  const searchParams = new URLSearchParams(location.search);
  const gestureIdParam = searchParams.get('gesture_id');
  const gestureId = gestureIdParam ? parseInt(gestureIdParam, 10) : undefined;
  // useCompareGuide 훅을 사용하여 제스처 비교 가이드 가져오기
  const { data: gestureGuideData, isLoading, isError } = useCompareGuide(gestureId);

  const currentGestureData = gestureGuideData;

  // 로딩 상태 확인
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">로딩 중...</div>;
  }

  // 에러 상태 확인
  if (isError || !currentGestureData) {
    return (
      <div className="h-screen flex items-center justify-center">데이터를 불러올 수 없습니다.</div>
    );
  }

  // 제스처 의미 데이터
  const gestureMeanings = currentGestureData.meanings || [];

  // lg인데 카드가 1개일 때 중앙 정렬
  const gridLayoutClass =
    gestureMeanings.length === 1
      ? 'w-full md:max-w-[800px] md:px-8 lg:max-w-[700px] lg:px-0 mx-auto grid grid-cols-1 gap-8 place-items-center'
      : 'w-full md:max-w-[800px] md:px-8 lg:max-w-[1000px] lg:px-0 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8';

  return (
    <div className="h-screen w-full flex flex-col dark:bg-gray-900 dark:text-d-txt-50">
      {/* 헤더 */}
      <DictHeader
        title="나라별 제스처 비교 가이드"
        showCompareGuide={false}
        className="mb-[4%] lg:mb-[3%]"
      />

      {/* 컨텐츠 */}
      <div className="h-[calc(100vh-80px)] flex flex-col">
        {/* 메인 이미지 */}
        <div className="h-[30vh] md:h-[25vh] flex justify-center items-center mb-[4%] lg:mb-[3%]">
          <div className="w-[35vmin] h-[35vmin] md:w-[30vmin] md:h-[30vmin] rounded-full bg-white dark:bg-gray-500 flex justify-center items-center drop-shadow-basic">
            <img
              src={currentGestureData.imageUrl || defaultImagePath}
              alt="compare guide image"
              className="w-[90%] h-[90%] object-contain"
            />
          </div>
        </div>

        {/* 카드 컨테이너 */}
        <div className="flex-1 px-4 pb-14 md:pb-24 overflow-y-auto">
          {/* 국가 그룹 카드들 */}
          <div className={gridLayoutClass}>
            {/* 국가별 제스처 의미 카드들 */}
            {gestureMeanings.map((meaning: MeaningItem, index: number) => {
              // 국가 이름 파싱
              const countryNames = meaning.countryName.split(',').map((name) => name.trim());

              // 국기 레이아웃 처리 : 3개 이상일 경우 2줄로 표시
              const renderFlags = () => {
                if (countryNames.length <= 3) {
                  return (
                    <div className="flex justify-center gap-[5%] mb-[4%]">
                      {countryNames.map((name, flagIndex) => {
                        const countryCode = getCountryCode(name);
                        return (
                          <img
                            key={flagIndex}
                            src={getFlagImage(countryCode)}
                            alt={`${name} flag`}
                            className="w-[25%] h-auto max-w-[80px] drop-shadow-nation"
                          />
                        );
                      })}
                    </div>
                  );
                } else {
                  const firstRowCount = Math.ceil(countryNames.length / 2);
                  const firstRow = countryNames.slice(0, firstRowCount);
                  const secondRow = countryNames.slice(firstRowCount);

                  return (
                    <>
                      {/* 첫번째 줄 */}
                      <div className="flex justify-center gap-[5%] mb-3">
                        {firstRow.map((name, flagIndex) => {
                          const countryCode = getCountryCode(name);
                          return (
                            <img
                              key={flagIndex}
                              src={getFlagImage(countryCode)}
                              alt={`${name} flag`}
                              className="w-[25%] h-auto max-w-[80px] drop-shadow-nation"
                            />
                          );
                        })}
                      </div>
                      {/* 두번째 줄 */}
                      <div className="flex justify-center gap-[5%] mb-[4%]">
                        {secondRow.map((name, flagIndex) => {
                          const countryCode = getCountryCode(name);
                          return (
                            <img
                              key={flagIndex}
                              src={getFlagImage(countryCode)}
                              alt={`${name} flag`}
                              className="w-[25%] h-auto max-w-[80px] drop-shadow-nation"
                            />
                          );
                        })}
                      </div>
                    </>
                  );
                }
              };
              return (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-400 flex flex-col h-auto min-h-[250px] max-h-full w-full">
                  <DictStatusLabel isPositive={meaning.isPositive} className="mb-6" />
                  {/* 국기 이미지 */}
                  {renderFlags()}

                  {/* 국가 이름 */}
                  <h2 className="text-center text-xl font-[NanumSquareRoundB] mb-6">
                    {countryNames.join(', ')}
                  </h2>

                  <hr className="text-gray-300" />
                  <div className="mt-auto grid grid-rows-2 h-[240px]">
                    {/* 의미 */}
                    <div className="flex flex-col items-center justify-start pt-[6%] text-lg">
                      <p className="font-[NanumSquareRoundB] pb-1">의미</p>
                      <p className="font-[NanumSquareRound] text-lg lg:text-xl text-center">
                        {meaning.gestureMeaning}
                      </p>
                    </div>
                    {/* 사용 상황 */}
                    <div className="flex flex-col items-center justify-start pt-[6%] text-lg">
                      <p className="font-[NanumSquareRoundB] pb-1">사용 상황</p>
                      <p className="font-[NanumSquareRound] lg:text-xl text-center">
                        {meaning.gestureSituation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 데이터 없는 경우 메시지 표시 */}
            {gestureMeanings.length === 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-400 col-span-1 lg:col-span-2 flex justify-center items-center">
                <p className="text-center text-lg">이 제스처에 대한 국가별 의미 정보가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareGuide;
