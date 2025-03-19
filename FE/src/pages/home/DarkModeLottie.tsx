// 다크모드 토글버튼
import { useState, useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import darkModeAnimation from '@/assets/lottie/darkMode.json';

interface DarkModeLottieProps {
  width?: number | string;
  height?: number | string;
  initialDarkMode?: boolean;
  onToggle?: (isDark: boolean) => void;
}

function DarkModeLottie({
  width = 60,
  height = 60,
  initialDarkMode = false,
  onToggle
}: DarkModeLottieProps) {
  const [isDark, setIsDark] = useState(initialDarkMode);
  const lottieRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  // 애니메이션 최적화를 위한 설정
  const lottieOptions = {
    animationData: darkModeAnimation,
    loop: false,
    autoplay: false,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      // 렌더링 성능 최적화
      progressiveLoad: false,
      hideOnTransparent: true
    }
  };

  // 컴포넌트 마운트 시 단 한번만 실행
  useEffect(() => {
    if (lottieRef.current && !isInitializedRef.current) {
      try {
        if (isDark) {
          // 다크모드면 마지막 프레임으로 즉시 이동
          const durationInFrames = Math.round(lottieRef.current.getDuration(true) * 30);
          lottieRef.current.goToAndStop(durationInFrames, true);
        } else {
          // 라이트모드면 첫 프레임으로 이동
          lottieRef.current.goToAndStop(0, true);
        }
        isInitializedRef.current = true;
      } catch (error) {
        console.error("초기화 오류:", error);
      }
    }
  }, [lottieRef.current, isDark]);

  // 클릭 처리 - 즉시 응답
  const handleClick = () => {
    if (!lottieRef.current) return;

    try {
      const newDarkMode = !isDark;
      
      // 애니메이션 속도 증가 (기본 1)
      lottieRef.current.setSpeed(1.5);
      
      if (isDark) {
        // 다크모드 -> 라이트모드 (역방향)
        lottieRef.current.setDirection(-1);
        lottieRef.current.play();
      } else {
        // 라이트모드 -> 다크모드 (정방향)
        lottieRef.current.setDirection(1);
        lottieRef.current.play();
      }

      // 상태 즉시 업데이트
      setIsDark(newDarkMode);
      
      if (onToggle) {
        onToggle(newDarkMode);
      }
    } catch (error) {
      console.error("애니메이션 제어 오류:", error);
    }
  };

  return (
    <div
      style={{ 
        width, 
        height, 
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        willChange: 'transform', // 성능 최적화
        transform: 'translateZ(0)' // 하드웨어 가속
      }}
      onClick={handleClick}
    >
      <Lottie
        lottieRef={lottieRef}
        {...lottieOptions}
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    </div>
  );
}

export default DarkModeLottie;