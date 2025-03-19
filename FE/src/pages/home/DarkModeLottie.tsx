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
  width = 50,
  height = 50,
  initialDarkMode = false,
  onToggle
}: DarkModeLottieProps) {
  const [isDark, setIsDark] = useState(initialDarkMode);
  const lottieRef = useRef<any>(null);

  // 컴포넌트 마운트 시 초기 설정
  useEffect(() => {
    // 약간의 지연 후 초기 상태 설정
    const timer = setTimeout(() => {
      if (lottieRef.current) {
        if (isDark) {
          // 다크모드면 마지막 프레임으로 이동
          const durationInFrames = Math.round(lottieRef.current.getDuration(true) * 30); // 30fps 가정
          lottieRef.current.goToAndStop(durationInFrames, true);
        } else {
          // 라이트모드면 첫 프레임으로 이동
          lottieRef.current.goToAndStop(0, true);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 클릭 처리
  const handleClick = () => {
    if (!lottieRef.current) return;

    try {
      if (isDark) {
        // 다크모드 -> 라이트모드 (역방향)
        console.log("역방향 재생 시작 (다크->라이트)");
        lottieRef.current.setDirection(-1);
        lottieRef.current.play();
      } else {
        // 라이트모드 -> 다크모드 (정방향)
        console.log("정방향 재생 시작 (라이트->다크)");
        lottieRef.current.setDirection(1);
        lottieRef.current.play();
      }

      // 상태 업데이트
      const newDarkMode = !isDark;
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
        overflow: 'hidden'
      }}
      onClick={handleClick}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={darkModeAnimation}
        loop={false}
        autoplay={false}
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block' // 중요: 인라인 요소의 여백 문제 방지
        }}
        onComplete={() => {
          console.log("애니메이션 완료됨, 현재 상태:", isDark ? "다크모드" : "라이트모드");
        }}
      />
    </div>
  );
}

export default DarkModeLottie;