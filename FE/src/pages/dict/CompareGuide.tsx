import DictHeader from './header/DictHeader';
import DictStatusLabel from './DictStatusLabel';
import { useCompareGuide } from '../../hooks/apiHooks';
import { MeaningItem } from '../../types/dictCompareType';
import { GlbViewer } from '@/components/GlbViewer';
import { useNavigate } from 'react-router-dom';

function CompareGuide() {
  // URL 쿼리 파라미터에서 gesture_id 추출
  const searchParams = new URLSearchParams(location.search);
  const gestureIdParam = searchParams.get('gesture_id');
  const gestureId = gestureIdParam ? parseInt(gestureIdParam, 10) : undefined;
  // useCompareGuide 훅을 사용하여 제스처 비교 가이드 가져오기
  const { data: gestureGuideData, isLoading, isError } = useCompareGuide(gestureId);
  const currentGestureData = gestureGuideData;
  const navigate = useNavigate();

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
    navigate('/error');
  }

  // 제스처 의미 데이터
  const gestureMeanings = currentGestureData?.meanings || [];

  // lg인데 카드가 1개일 때 중앙 정렬
  const gridLayoutClass =
    gestureMeanings.length === 1
      ? 'w-full md:max-w-[800px] md:px-8 lg:max-w-[600px] lg:px-0 mx-auto grid grid-cols-1 gap-6 place-items-center'
      : 'w-full md:max-w-[800px] md:px-8 lg:max-w-[1000px] lg:px-0 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6';

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
      return <p className="font-[NanumSquareRound] text-[17px] text-left ml-4">{situation}</p>;
    }

    // 여러개 있는 경우
    return (
      <ul className="list-disc font-[NanumSquareRound] text-[17px] ml-4 pl-4">
        {situations.map((item, index) => (
          <li key={index} className="mb-2">
            {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="h-screen w-full flex flex-col dark:bg-gray-900 dark:text-d-txt-50 overflow-hidden">
      {/* 헤더 - 10% */}
      <div className="h-[10vh] mb-8">
        <DictHeader title="나라별 제스처 비교 가이드" showCompareGuide={false} className="h-full" />
      </div>

      {/* 메인 이미지 - 30% */}
      <div className="h-[30vh] flex justify-center items-center">
        <div className="w-[25vmin] h-[25vmin] rounded-full bg-white dark:bg-gray-500 flex justify-center items-center drop-shadow-basic">
          {currentGestureData?.imageUrl ? (
            <GlbViewer url={`${currentGestureData.imageUrl}`} />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400 font-[NanumSquareRoundB]">
              이미지 준비 중
            </div>
          )}
        </div>
      </div>

      {/* 카드 컨테이너 */}
      <div className="h-[50vh] px-4 customScrollbar kr">
        {/* 국가 그룹 카드들 */}
        <div className={`${gridLayoutClass} h-full`}>
          {/* 국가별 제스처 의미 카드들 */}
          {gestureMeanings.map((meaning: MeaningItem, index: number) => {
            // 국가 이름, 이미지 URL 파싱
            const countryNames = meaning.countryName.split(',').map((name) => name.trim());
            const countryImageUrls = meaning.countryImageUrl.split(',').map((url) => url.trim());

            const renderFlags = () => {
              return (
                <div className="flex justify-center flex-wrap gap-2 md:gap-3 mb-3">
                  {countryNames.map((name, flagIndex) => {
                    const imageUrl = countryImageUrls[flagIndex] || countryImageUrls[0];
                    return (
                      <img
                        key={flagIndex}
                        src={imageUrl}
                        alt={`${name} flag`}
                        className="h-6 md:h-8 w-auto drop-shadow-nation"
                      />
                    );
                  })}
                </div>
              );
            };

            return (
              <div
                key={`meaning-${index}`}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-400 flex flex-col w-full"
              >
                {/* 고정된 헤더 부분 */}
                <div className="flex-none">
                  <DictStatusLabel
                    isPositive={meaning.isPositive}
                    className="mb-4 flex justify-center"
                  />
                  {/* 국기 이미지 */}
                  {renderFlags()}

                  {/* 국가 이름 */}
                  <h2 className="text-center text-[20px] lg:text-[22px] font-[NanumSquareRoundB] mb-3">
                    {countryNames.join(', ')}
                  </h2>

                  <hr className="text-gray-300 mb-3" />
                </div>

                {/* 콘텐츠 부분 */}
                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-4 px-4 pt-4">
                    {/* 의미 */}
                    <div className="flex flex-col">
                      <p className="font-[NanumSquareRoundB] text-[20px] mb-2 text-left ml-4 ">
                        의미
                      </p>
                      <p className="font-[NanumSquareRound] text-[17px] text-left ml-4">
                        {meaning.gestureMeaning}
                      </p>
                    </div>

                    {/* 사용 상황 */}
                    <div className="flex flex-col mt-3">
                      <p className="font-[NanumSquareRoundB] text-[20px] mb-2 text-left ml-4">
                        사용 상황
                      </p>
                      <div className="font-[NanumSquareRound]">
                        {parseSituation(meaning.gestureSituation)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 데이터 없는 경우 메시지 표시 */}
          {gestureMeanings.length === 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-400 col-span-1 lg:col-span-2 flex justify-center items-center h-full">
              <p className="text-center text-xl font-[NanumSquareRoundB]">
                이 제스처에 대한 국가별 의미 정보가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompareGuide;
