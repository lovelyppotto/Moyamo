import { useState, useRef, useEffect } from 'react';
import Lottie from 'react-lottie';
import darkModeAnimation from '@/assets/lottie/darkMode.json';

interface ReversibleLottieProps {
  width?: number;
  height?: number;
}

function ReversibleLottie({ width = 200, height = 200 }: ReversibleLottieProps) {
  const [direction, setDirection] = useState(1); // 1: 정방향, -1: 역방향
  const [isStopped, setIsStopped] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [animationData, setAnimationData] = useState(darkModeAnimation);
  const lottieRef = useRef<any>(null);

  const defaultOptions = {
    loop: false, // 루프 비활성화
    autoplay: false, // 자동 재생 비활성화
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // 애니메이션 완료 이벤트 핸들러
  const handleAnimationComplete = () => {
    setIsStopped(true);
  };

  // 클릭 시 재생/역재생 토글
  const toggleAnimation = () => {
    if (isStopped) {
      // 애니메이션이 멈춰있으면 현재 방향으로 재생
      setIsStopped(false);
    } else {
      // 재생 중이면 일단 멈추기
      setIsStopped(true);

      // 방향 전환은 멈춘 후에 설정
      setTimeout(() => {
        // 방향 전환
        setDirection((prevDirection) => prevDirection * -1);
        setIsStopped(false);
      }, 50);
    }
  };

  // 방향이 바뀔 때마다 애니메이션 속성 업데이트
  useEffect(() => {
    if (direction === -1) {
      // 역방향으로 재생하기 위해 애니메이션 데이터 조작
      const reversedData = { ...darkModeAnimation };
      // 프레임 관련 설정
      if (lottieRef.current && lottieRef.current.anim) {
        const anim = lottieRef.current.anim;
        anim.setSpeed(-1); // 속도를 음수로 설정해 역재생

        // 마지막 프레임으로 이동 후 재생 (역재생 효과)
        if (isStopped) {
          const totalFrames = anim.totalFrames;
          anim.goToAndStop(totalFrames, true);
        }
      }
    } else {
      // 정방향으로 재생
      if (lottieRef.current && lottieRef.current.anim) {
        const anim = lottieRef.current.anim;
        anim.setSpeed(1);

        if (isStopped) {
          anim.goToAndStop(0, true);
        }
      }
    }
  }, [direction, isStopped]);

  return (
    <div
      className="lottie-container cursor-pointer"
      onClick={toggleAnimation}
      style={{ width, height }}
    >
      <Lottie
        options={defaultOptions}
        height={height}
        width={width}
        isStopped={isStopped}
        isPaused={isPaused}
        eventListeners={[
          {
            eventName: 'complete',
            callback: handleAnimationComplete,
          },
        ]}
        ref={lottieRef}
      />
    </div>
  );
}

export default ReversibleLottie;
