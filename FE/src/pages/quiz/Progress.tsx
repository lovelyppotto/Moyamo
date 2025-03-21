import * as Progress from '@radix-ui/react-progress';
import { useState, useEffect } from 'react';
import '../../index.css';

interface QuizProgressProps {
  value?: number;
  buttonPressed?: boolean;
  className?: string;
}

function QuizProgress({ value = 0, buttonPressed = false, className = '' }: QuizProgressProps) {
  const [progress, setProgress] = useState(value);
  // 버튼을 누르면 25%씩 증가//settimeout은 한번만 실행됨. setInterval으로 변경.
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 25;

        if (newProgress > 100) {
          // 결과 모달창이 띄워지도록
        }
        return newProgress;
      });
    }, 1000); // 60초가 지나면(60000ms) 자동으로 25프로 증가함.
    return () => clearTimeout(timer);
  }, [buttonPressed]); // 버튼이 눌러지면 25프로 증가함.

  return (
    <div className="flex justify-center mx-30">
      <Progress.Root
        // 배경화면 지우고 className변수에, 각 나라 컬러를 가져오도록 해야 함!!
        className={`w-full relative h-3 overflow-hidden rounded-full bg-gray-200 m-10 shadow-9xl ${className}`}
        style={{
          // Fix overflow clipping in Safari
          // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
          transform: 'translateZ(0)',
        }}
        value={progress}
      >
        <Progress.Indicator
          className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full bg-[var(--color-us-600)] stroke-black stroke-3 transition-transform duration-[660ms]"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
    </div>
  );
}

export default QuizProgress;
