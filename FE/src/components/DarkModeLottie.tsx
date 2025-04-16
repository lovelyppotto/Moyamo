// 다크모드 토글버튼
// 추후 persist 옵션에 따라 로티 애니메이션 시작점 변경예정
import { useRef, useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import darkModeAnimation from '@/assets/lottie/darkMode.json';
import { useTheme } from '@/components/theme-provider';

interface DarkModeLottieProps {
  width?: number | string;
  height?: number | string;
}

function DarkModeLottie({
  width = 60,
  height = 60,
}: DarkModeLottieProps) {
  // shadcn/ui의 테마 시스템 사용
  const { theme, setTheme } = useTheme();
  const lottieRef = useRef<any>(null);
  const [initialized, setInitialized] = useState(false);
  
  // 현재 테마에 따라 애니메이션 초기 상태 설정
  useEffect(() => {
    if (lottieRef.current) {
      if (theme === 'dark') {
        // 다크모드일 때 최종 프레임으로 설정
        const totalFrames = lottieRef.current.totalFrames - 1;
        lottieRef.current.goToAndStop(totalFrames, true);
      } else {
        // 라이트모드일 때 첫 프레임으로 설정
        lottieRef.current.goToAndStop(0, true);
      }
      setInitialized(true);
    }
  }, [lottieRef.current, theme]);

  // 클릭 핸들러(최적화 필요)
  const handleClick = () => {
    if (!lottieRef.current || !initialized) return;
    
    try {
      // 다음 테마 결정
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      
      // 애니메이션 속도 설정
      lottieRef.current.setSpeed(1.5);
      
      if (theme === 'dark') {
        // 다크 -> 라이트 (역방향 재생)
        lottieRef.current.setDirection(-1);
        lottieRef.current.play();
        
        // 애니메이션 시간 계산 (약간의 여유)
        const animDuration = lottieRef.current.getDuration() * 1000 / 1.7;
        
        // 애니메이션 후 테마 변경
        setTimeout(() => {
          setTheme(nextTheme);
        }, animDuration * 0.55); // 약간 일찍 변경하여 부드러운 전환
      } else {
        // 라이트 -> 다크 (정방향 재생)
        lottieRef.current.setDirection(1);
        lottieRef.current.play();
        
        // 애니메이션 시간 계산
        const animDuration = lottieRef.current.getDuration() * 1000 / 1.5;
        
        // 애니메이션 후 테마 변경
        setTimeout(() => {
          setTheme(nextTheme);
        }, animDuration * 0.55);
      }
    } catch (error) {
      console.error('애니메이션 제어 오류:', error);
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
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}

export default DarkModeLottie;