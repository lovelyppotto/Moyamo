import * as Progress from '@radix-ui/react-progress';
import { useState, useEffect } from 'react';
import '../../index.css';

interface QuizProgressProps {
  timeout?: number;
  onTimeout?: () => void;
  className?: string;
}

function QuizProgress({ timeout = 0, onTimeout = () => {}, className = '' }: QuizProgressProps) {
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
    if (timeout <= 0) return;
    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => {
        return Math.max(0, prevRemainingTime - 100);
      });
    }, 100);

    return () => {
      clearInterval(interval);
    }; // 클린업 함수: Effect함수 작동 전, 컴포넌트가 DOM으로부터 삭제될 때 실행
  }, [timeout]);
  //문제: 오른쪽에서 왼쪽으로 줄어든다.

  //   return () => clearTimeout(timer);
  // }, [buttonPressed]); // 버튼이 눌러지면 25프로 증가함.
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
          className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full bg-[var(--color-kr-600)] stroke-black stroke-3 transition-transform duration-[660ms]"
          style={{ transform: `translateX(-${100 - progressPercent}%)` }}
        />
      </Progress.Root>
    </div>
  );
}

export default QuizProgress;

// 에러메세지지: 
// @radix-ui_react-prog…ss.js?v=8045e8cd:39 Invalid prop `value` of value `600` supplied to `Progress`. The `value` prop must be:
//   - a positive number
//   - less than the value passed to `max` (or 100 if no `max` prop is set)
//   - `null` or `undefined` if the progress is indeterminate.
// Defaulting to `null`.
//이유:  Progress 컴포넌트의 value prop에 문제가 있습니다. 에러는 value 속성이 다음 조건을 만족해야 한다고 알려주고 있습니다:
// 양수여야 함. remainingTime 상태가 시간이 지남에 따라 계속 감소하고 있어서 결국 음수가 되기 때문입니다. 타이머가 실행될 때 remainingTime이 0 이하로 떨어지면 Progress 컴포넌트에 대한 유효한 값이 아니게 됩니다.
//해결: 진행률을 0-100% 범위 내에서 관리하도록 코드 수정함. progressPercent를 계산 & 양수가 되도록 함. 
