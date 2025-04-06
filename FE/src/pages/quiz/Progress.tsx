import * as Progress from '@radix-ui/react-progress';
import { useState, useEffect } from 'react';
import '@/index.css';

interface QuizProgressProps {
  timeout?: number;
  onTimeout?: () => void;
  className?: string;
  startProgress?: boolean;
}

function QuizProgress({
  timeout = 0,
  onTimeout = () => {},
  className = '',
  startProgress = false,
}: QuizProgressProps) {
  const [remainingTime, setRemainingTime] = useState<number>(timeout);

  useEffect(() => {
    setRemainingTime(timeout);
  }, [timeout]);

  useEffect(() => {
    if (timeout <= 0) return;
    const timer = setTimeout(onTimeout, timeout); // 모든 문제를 다 풀었을 때 타이머가 작동하지 않도록 함.
    return () => clearTimeout(timer);
  }, [timeout, onTimeout]);

  useEffect(() => {
    if (timeout <= 0 || !startProgress) return; //  timeout이 0 이하 혹은 startProgress가 false이면 아무것도 하지 않음
    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => {
        return Math.max(0, prevRemainingTime - 1000); //1초에 한번 줄어든다.
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    }; // 클린업 함수: Effect함수 작동 전, 컴포넌트가 DOM으로부터 삭제될 때 실행
  }, [timeout, startProgress]);

  const progressPercent = timeout > 0 ? (remainingTime / timeout) * 100 : 0;

  return (
    <div className="flex justify-center">
      <Progress.Root
        // 배경화면 지우고 className변수에, 각 나라 컬러를 가져오도록 해야 함!!
        className={`w-full relative h-3 overflow-hidden rounded-full bg-gray-200 m-10 shadow-9xl drop-shadow-quiz-box ${className}`}
        style={{
          // Fix overflow clipping in Safari
          // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
          transform: 'translateZ(0)',
        }}
        value={progressPercent}
      >
        <Progress.Indicator
          className={`ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full ${className} stroke-black stroke-3 transition-transform duration-[660ms]`}
          style={{ transform: `translateX(-${100 - progressPercent}%)` }}
        />
      </Progress.Root>
    </div>
  );
}

export default QuizProgress;
