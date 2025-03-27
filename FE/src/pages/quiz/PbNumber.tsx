interface PbNumberProps {
  Index: number;
}

function PbNumber({ Index }: PbNumberProps) {
  let color1 = 'bg-white';
  let color2 = 'bg-white';
  let color3 = 'bg-white';
  let color4 = 'bg-white';
  let color5 = 'bg-white';

  if (Index === 0) {
    color1 = 'bg-[var(--color-kr-100)]';
  } else if (Index === 1) {
    color1 = 'bg-[var(--color-kr-100)]';
    color2 = 'bg-[var(--color-kr-200)]';
  } else if (Index === 2) {
    color1 = 'bg-[var(--color-kr-100)]';
    color2 = 'bg-[var(--color-kr-200)]';
    color3 = 'bg-[var(--color-kr-300)]';
  } else if (Index === 3) {
    color1 = 'bg-[var(--color-kr-100)]';
    color2 = 'bg-[var(--color-kr-200)]';
    color3 = 'bg-[var(--color-kr-300)]';
    color4 = 'bg-[var(--color-kr-400)]';
  } else if (Index === 4) {
    color1 = 'bg-[var(--color-kr-100)]';
    color2 = 'bg-[var(--color-kr-200)]';
    color3 = 'bg-[var(--color-kr-300)]';
    color4 = 'bg-[var(--color-kr-400)]';
    color5 = 'bg-[var(--color-kr-500)]';
  }

  return (
    <>
      <div className="flex justify-between w-[22vh] ">
        <div className={`w-5 h-5 rounded-full ${color1}`}></div>
        <div className={`w-5 h-5 rounded-full ${color2}`}></div>
        <div className={`w-5 h-5 rounded-full ${color3}`}></div>
        <div className={`w-5 h-5 rounded-full ${color4}`}></div>
        <div className={`w-5 h-5 rounded-full ${color5}`}></div>
      </div>
    </>
  );
}
export default PbNumber;
