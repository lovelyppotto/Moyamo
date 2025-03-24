function CountryBubble() {
  return (
    <div>
      {/* 국가별 관광지 사진 영역 - 6각형 레이아웃 */}
      {/* 각 border 채도 낮출 예정 */}
      <div className="absolute top-10 w-full h-full pointer-events-none">
        {/* 한국 (왼쪽 상단) */}
        <div className="absolute top-[20%] left-[10%]">
          <div className="relative">
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src="/images/attractions/korea.png"
                alt="Korea"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-13 -right-5
              transform translate-x-1/4 translate-y-1/4 px-4 
              rounded-full border-2 border-white
              text-white font-bold bg-blue-500"
            >
              Korea
            </div>
          </div>
        </div>

        {/* 미국 (오른쪽 상단) */}
        <div className="absolute top-[20%] right-[10%]">
          <div className="relative">
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-white shadow-lg -scale-x-100">
              <img
                src="/images/attractions/usa.jpg"
                alt="USA"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-13 -left-3 
              transform -translate-x-1/4 translate-y-1/4 px-4
              rounded-full text-white border-2 border-white
              font-bold bg-us-600"
            >
              USA
            </div>
          </div>
        </div>

        {/* 일본 (왼쪽 중간) */}
        <div className="absolute top-1/2 left-[20%] transform -translate-y-1/2">
          <div className="relative">
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src="/images/attractions/japan.jpg"
                alt="Japan"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-14 right-32 
              transform translate-x-1/2 translate-y-1/2 px-4 
              rounded-full text-white border-2 border-white
              font-bold bg-jp-500"
            >
              Japan
            </div>
          </div>
        </div>

        {/* 커뮤니케이션 (오른쪽 중간) */}
        <div className="absolute top-1/2 right-[20%] transform -translate-y-1/2">
          <div className="relative">
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src="/images/attractions/communication.jpg"
                alt="Communication"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-11 left-33
              transform -translate-x-1/2 px-4 
              rounded-full text-black border-2 border-black
              font-bold bg-white"
            >
              Communication
            </div>
          </div>
        </div>

        {/* 이탈리아 (왼쪽 하단) */}
        <div className="absolute bottom-[20%] left-[10%]">
          <div className="relative">
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src="/images/attractions/italy.webp"
                alt="Italy"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-14 right-0 
              transform translate-x-1/2 translate-y-1/2 px-4
              rounded-full bg-italy-600 border-2 border-white
              text-white font-bold"
            >
              Italy
            </div>
          </div>
        </div>

        {/* 중국 (오른쪽 하단) */}
        <div className="absolute bottom-[20%] right-[10%]">
          <div className="relative">
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src="/images/attractions/china.jpg"
                alt="China"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-14 left-0 
              transform -translate-x-1/2 translate-y-1/2 px-4 
              rounded-full bg-cn-600 border-2 border-white
              text-white font-bold"
            >
              China
            </div>
          </div>
        </div>

        {/* 점선 연결선 */}
      </div>
    </div>
  );
}

export default CountryBubble;