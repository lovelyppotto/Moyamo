import * as Progress from '@radix-ui/react-progress';
import { useState, useEffect } from 'react';
import '../../index.css';

interface QuizProgressProps {
  timeout?: number;
  onTimeout?: null;
  className?: string;
}

function QuizProgress({ timeout = 0, onTimeout=null, className = '' }: QuizProgressProps) {
  const [remainingTime, setRemainingTime] = useState(timeout);
  useEffect(()=>{
    setTimeout(onTimeout, timeout);
  }, [timeout, onTimeout]);
  useEffect(() => {
    setInterval(() => {
      setRemainingTime((prevRemainingTime) =>  prevRemainingTime - 100);
      },100);
    }, []); 
    //문제: 오른쪽에서 왼쪽으로 줄어든다.


    
  //   return () => clearTimeout(timer);
  // }, [buttonPressed]); // 버튼이 눌러지면 25프로 증가함.

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
        value={remainingTime}
      >
        <Progress.Indicator
          className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full bg-[var(--color-kr-600)] stroke-black stroke-3 transition-transform duration-[660ms]"
          style={{ transform: `translateX(-${100 - remainingTime}%)` }}
        />
      </Progress.Root>
    </div>
  );
}

export default QuizProgress;
