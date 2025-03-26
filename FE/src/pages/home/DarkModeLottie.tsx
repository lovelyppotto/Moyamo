import { useRef, useLayoutEffect, useState } from 'react';
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
  const { theme, setTheme } = useTheme();
  const lottieRef = useRef<any>(null);
  
  // 로티가 표시되기 전 상태 관리
  const [isReady, setIsReady] = useState(false);
  
  // 현재 테마가 다크인지 확인
  const isDarkMode = () => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  
  // 정확한 프레임 번호 상수 (로티 파일 기준)
  const LIGHT_FRAME = 20;  // 첫 프레임 (해)
  const DARK_FRAME = 153;  // 마지막 프레임 (달)
  
  // 렌더링 전 레이아웃 단계에서 적절한 프레임 설정 (깜빡임 방지)
  useLayoutEffect(() => {
    if (!lottieRef.current) return;
    
    // 현재 다크모드 상태 확인
    const isDark = isDarkMode();
    
    // 0ms 타임아웃으로 비동기 렌더링 큐에 추가 (더 안정적)
    setTimeout(() => {
      try {
        if (isDark) {
          // 다크모드 - 마지막 프레임으로 설정
          lottieRef.current.goToAndStop(DARK_FRAME, true);
        } else {
          // 라이트모드 - 첫 프레임으로 설정
          lottieRef.current.goToAndStop(LIGHT_FRAME, true);
        }
        // 준비 완료
        setIsReady(true);
      } catch (error) {
        console.error('로티 프레임 설정 오류:', error);
        setIsReady(true); // 오류가 있어도 표시
      }
    }, 0);
  }, [theme]);
  
  // 클릭 핸들러
  const handleClick = () => {
    if (!lottieRef.current || !isReady) return;
    
    // 현재 다크모드 상태 확인
    const isDark = isDarkMode();
    
    // 다음 테마 결정
    const nextTheme = isDark ? 'light' : 'dark';
    
    // 애니메이션 속도 설정
    lottieRef.current.setSpeed(1.5);
    
    try {
      if (isDark) {
        // 다크 -> 라이트 (역방향 재생)
        // playSegments를 사용하여 특정 구간 재생
        lottieRef.current.playSegments([DARK_FRAME, LIGHT_FRAME], true);
        
        // 애니메이션 시간 계산
        const animDuration = (DARK_FRAME - LIGHT_FRAME) / 60 * 1000 / 1.5;
        
        // 애니메이션 후 테마 변경
        setTimeout(() => {
          setTheme(nextTheme);
        }, animDuration * 0.6);
      } else {
        // 라이트 -> 다크 (정방향 재생)
        // playSegments를 사용하여 특정 구간 재생
        lottieRef.current.playSegments([LIGHT_FRAME, DARK_FRAME], true);
        
        // 애니메이션 시간 계산
        const animDuration = (DARK_FRAME - LIGHT_FRAME) / 60 * 1000 / 1.5;
        
        // 애니메이션 후 테마 변경
        setTimeout(() => {
          setTheme(nextTheme);
        }, animDuration * 0.6);
      }
    } catch (error) {
      console.error('애니메이션 재생 오류:', error);
      // 오류 발생 시 즉시 테마 변경
      setTheme(nextTheme);
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
      aria-label={isDarkMode() ? '라이트 모드로 전환' : '다크 모드로 전환'}
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
        onDOMLoaded={() => {
          // DOM 로드 완료 시 추가 안전장치
          if (!lottieRef.current) return;
          
          const isDark = isDarkMode();
          
          if (isDark) {
            lottieRef.current.goToAndStop(DARK_FRAME, true);
          } else {
            lottieRef.current.goToAndStop(LIGHT_FRAME, true);
          }
          
          setIsReady(true);
        }}
      />
    </div>
  );
}

export default DarkModeLottie;