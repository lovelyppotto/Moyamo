function DictStatusLabel({ isPositive }: { isPositive: boolean }) {
  return (
    <div className="font-[NanumSquareRoundEB]">
      {isPositive ? (
        <label className="w-[100px] h-[50px] rounded-2xl bg-[#CDDCFF] border-[#2466FF] text-[#2466FF] text-[22px]">
          긍정
        </label>
      ) : (
        <label className="w-[100px] h-[50px] rounded-2xl bg-[#FBCBCB] border-[#FF2424] text-[#FF2424] text-[22px]">
          부정
        </label>
      )}
    </div>
  );
}

export default DictStatusLabel;
