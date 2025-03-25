interface LabelPorps {
  isPositive: boolean;
  className: string;
}
function DictStatusLabel({ isPositive, className }: LabelPorps) {
  return (
    <div className={`font-[NanumSquareRoundB] text-center mx-auto ${className}`}>
      {isPositive ? (
        <label className="flex justify-center items-center w-[60px] h-[40px] rounded-2xl bg-[#CDDCFF] border-2 border-[#2466FF] text-[#2466FF] text-[20px]">
          긍정
        </label>
      ) : (
        <label className="flex justify-center items-center w-[60px] h-[40px] rounded-2xl bg-[#FBCBCB] border-2 border-[#FF2424] text-[#FF2424] text-[20px]">
          부정
        </label>
      )}
    </div>
  );
}

export default DictStatusLabel;
