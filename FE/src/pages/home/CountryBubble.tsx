import { tipsMockData } from "./tipMock";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useTips } from "@/hooks/apiHooks";

 // 툴팁 위치 정보 타입
interface TooltipPosition {
  side: 'top' | 'right' | 'bottom' | 'left';
  align: 'start' | 'center' | 'end';
  sideOffset: number;
  alignOffset: number;
}

// 툴팁 관련 인터페이스
interface CountryData {
  id: string;
  countryId: number;
  name: string;
  image: string;
  position: string;
  labelPosition: string;
  labelBackground: string;
  tooltipBackground: string;
  labelDirection: 'left' | 'right';
  tooltipPosition: TooltipPosition;
}

// 툴팁 세팅
const countrySetup: CountryData[] = [
  {
    id: 'korea',
    countryId: 1,
    name: 'Korea',
    image: '/images/attractions/korea.webp',
    position: 'absolute top-[20%] left-[10%]',
    labelPosition: 'absolute bottom-13 -right-5 transform translate-x-1/4 translate-y-1/4',
    labelBackground: 'bg-kr-500 dark:bg-d-kr-600',
    tooltipBackground: 'bg-kr-100 dark:bg-d-kr-900 dark:text-d-txt-50',
    labelDirection: 'right',
    tooltipPosition: {
      side: 'top',
      align: 'start',
      sideOffset: -45,
      alignOffset: 100
    },
  },
  {
    id: 'usa',
    countryId: 2,
    name: 'USA',
    image: '/images/attractions/usa.webp',
    position: 'absolute top-[20%] right-[10%]',
    labelPosition: 'absolute bottom-13 -left-3 transform -translate-x-1/4 translate-y-1/4',
    labelBackground: 'bg-us-600 dark:bg-d-us-500',
    tooltipBackground: 'bg-us-100 dark:bg-d-us-600 dark:text-d-txt-50',
    labelDirection: 'left',
    tooltipPosition: {
      side: 'top',
      align: 'end',
      sideOffset: -45,
      alignOffset: 100
    },
  },
  {
    id: 'japan',
    countryId: 3,
    name: 'Japan',
    image: '/images/attractions/japan.webp',
    position: 'absolute top-1/2 left-[20%] transform -translate-y-1/2',
    labelPosition: 'absolute bottom-14 right-32 transform translate-x-1/2 translate-y-1/2',
    labelBackground: 'bg-jp-500 dark:bg-d-jp-400',
    tooltipBackground: 'bg-jp-100 dark:bg-jp-100',
    labelDirection: 'right',
    tooltipPosition: {
      side: 'right',
      align: 'center',
      sideOffset: -10,
      alignOffset: 0,
    },
  },
  {
    id: 'china',
    countryId: 4,
    name: 'China',
    image: '/images/attractions/china.webp',
    position: 'absolute bottom-[20%] right-[10%]',
    labelPosition: 'absolute bottom-14 left-0 transform -translate-x-1/2 translate-y-1/2',
    labelBackground: 'bg-cn-600 dark:bg-d-cn-400',
    tooltipBackground: 'bg-cn-100 dark:bg-d-cn-800 dark:text-d-txt-50',
    labelDirection: 'left',
    tooltipPosition: {
      side: 'bottom',
      align: 'end',
      sideOffset: -40,
      alignOffset: 100,
    },
  },
  {
    id: 'italy',
    countryId: 5,
    name: 'Italy',
    image: '/images/attractions/italy.webp',
    position: 'absolute bottom-[20%] left-[10%]',
    labelPosition: 'absolute bottom-14 right-0 transform translate-x-1/2 translate-y-1/2',
    labelBackground: 'bg-italy-600 dark:bg-d-italy-600',
    tooltipBackground: 'bg-italy-100 dark:bg-d-italy-800 dark:text-d-txt-50',
    labelDirection: 'right',
    tooltipPosition: {
      side: 'bottom',
      align: 'start',
      sideOffset: -40,
      alignOffset: 100,
    },
  },
  {
    id: 'communication',
    countryId: 0, // 국가가 아니므로 특별 ID 부여
    name: 'Communication',
    image: '/images/attractions/communication.webp',
    position: 'absolute top-1/2 right-[20%] transform -translate-y-1/2',
    labelPosition: 'absolute bottom-11 left-33 transform -translate-x-1/2',
    labelBackground: 'bg-white',
    tooltipBackground: 'bg-gray-50 dark:bg-slate-100',
    labelDirection: 'left',
    tooltipPosition: {
      side: 'left',
      align: 'center',
      sideOffset: -10,
      alignOffset: 0,
    },
  },
];

function CountryBubble() {
  const { data: tips } = useTips();

  const getTipContent = (countryId: number): string => {
    const tip = tips?.find(tip => tip.countryId === countryId);
    return tip?.content || '제스처로 소통하며 새로운 문화를 경험해보세요!';
  };

  return (
    <TooltipProvider>
      <div>
        {/* 국가별 관광지 사진 영역 - 6각형 레이아웃
        {/* 각 border 채도 낮출 예정 */}
        <div className="absolute top-10 w-full h-full z-30 pointer-events-none">
          {countrySetup.map((country) => 
            <div key={country.id} className={country.position}>
              <div className="relative">
                <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative cursor-pointer z-30 pointer-events-auto">
                    <div 
                      className={`w-30 h-30 rounded-full overflow-hidden
                        border-2 border-white shadow-lg 
                        transition-transform hover:scale-105
                        dark:border-slate-100`}
                    >
                      <img
                        src={country.image}
                        alt={country.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`${country.labelPosition} px-4 rounded-full border-2 dark:border-slate-100 font-bold ${
                        country.labelBackground
                      } ${country.name === 'Communication' ? 'text-black border-black dark:bg-gray-900 dark:text-d-txt-50' : 'text-white'}`}
                    >
                      {country.name}
                    </div>
                  </div>
                </TooltipTrigger>
                {/* Portal 통해 DOM 최상위에 렌더링 */}
                <TooltipContent
                  side={country.tooltipPosition.side}
                  align={country.tooltipPosition.align}
                  sideOffset={country.tooltipPosition.sideOffset}
                  alignOffset={country.tooltipPosition.alignOffset}
                  className={`${country.tooltipBackground} text-black p-6 rounded-lg shadow-lg max-w-xs`}
                  style={{ zIndex: 20 }}
                >
                  <div className="flex flex-col gap-2">
                    <p className="font-[Galmuri11] font-bold text-sm">{getTipContent(country.countryId)}</p>
                  </div>
                </TooltipContent>

                </Tooltip>
              </div>
            </div>
          )}
        {/* 점선 연결선 */}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default CountryBubble;