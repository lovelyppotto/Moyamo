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

  // 로딩 상태 확인 - 로딩 페이지 구현 필요
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center font-[NanumSquareRoundEB] text-[40px]">
        로딩 중...
      </div>
    );
  }

  // 에러 상태 확인
  if (isError || !currentGestureData) {
    return (
      <div className="h-screen flex items-center justify-center font-[NanumSquareRoundEB] text-[40px]">
        데이터를 불러올 수 없습니다.
      </div>
    );
  }

  // 제스처 의미 데이터
  const gestureMeanings = currentGestureData.meanings || [];

  // lg인데 카드가 1개일 때 중앙 정렬
  const gridLayoutClass =
    gestureMeanings.length === 1
      ? 'w-full md:max-w-[800px] md:px-8 lg:max-w-[600px] lg:px-0 mx-auto grid grid-cols-1 gap-8 place-items-center'
      : 'w-full md:max-w-[800px] md:px-8 lg:max-w-[1000px] lg:px-0 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8';

  // 사용 상황 텍스트를 / 구분자로 파싱하여 표시하는 함수
  const parseSituation = (situation: string) => {
    if (!situation) return null;

    // /로 문자열 분리
    const situations = situation
      .split('/')
      .map((item) => item.trim())
      .filter(Boolean);

    // 상황이 하나만 있는 경우 그대로 표시
    if (situations.length <= 1) {
      return (
        <p className="font-[NanumSquareRound] text-[16px] lg:text-[18px] text-center">
          {situation}
        </p>
      );
    }

    // 여러개 있는 경우
    return (
      <ul className="list-disc w-[70%] mx-auto pl-8 font-[NanumSquareRound] text-[16px] lg:text-[18px]">
        {situations.map((item, index) => (
          <li key={index} className="mb-2 pl-1">
            {item}
          </li>
        ))}
      </ul>
    );
  };

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

              // 국기 이미지 렌더링 - 모두 한 줄로 표시하고 크기 축소
              const renderFlags = () => {
                return (
                  <div className="flex justify-center flex-wrap gap-2 md:gap-3 mb-[4%]">
                    {countryNames.map((name, flagIndex) => {
                      const countryCode = getCountryCode(name);
                      return (
                        <img
                          key={flagIndex}
                          src={getFlagImage(countryCode)}
                          alt={`${name} flag`}
                          className="h-6 md:h-8 w-auto drop-shadow-nation"
                        />
                      );
                    })}
                  </div>
                );
              };

              return (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-400 flex flex-col w-full">
                  <DictStatusLabel isPositive={meaning.isPositive} className="mb-6" />
                  {/* 국기 이미지 */}
                  {renderFlags()}

                  {/* 국가 이름 */}
                  <h2 className="text-center text-[20px] lg:text-[22px] font-[NanumSquareRoundB] mb-6">
                    {countryNames.join(', ')}
                  </h2>

                  <hr className="text-gray-300 mb-4" />

                  <div className="flex flex-col gap-4">
                    {/* 의미 */}
                    <div className="flex flex-col items-center">
                      <p className="font-[NanumSquareRoundB] text-[18px] lg:text-[20px] mb-2">
                        의미
                      </p>
                      <p className="font-[NanumSquareRound] text-[16px] lg:text-[18px]  text-center">
                        {meaning.gestureMeaning}
                      </p>
                    </div>

                    {/* 사용 상황 */}
                    <div className="flex flex-col items-center">
                      <p className="font-[NanumSquareRoundB] text-[18px] lg:text-[20px] mb-2">
                        사용 상황
                      </p>
                      <div className="font-[NanumSquareRound] text-[16px] lg:text-[18px] text-center">
                        {parseSituation(meaning.gestureSituation)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 데이터 없는 경우 메시지 표시 */}
            {gestureMeanings.length === 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-400 col-span-1 lg:col-span-2 flex justify-center items-center">
                <p className="text-center text-[100px]">
                  이 제스처에 대한 국가별 의미 정보가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareGuide;
