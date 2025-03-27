// 먼저 로드할 폰트 가져오는 hook
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function preloadFont(url: string, type: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = 'font';
  link.type = type;
  link.crossOrigin = 'anonymous';

  // 같은 preload 링크 존재하는지 확인
  const existingLink = document.querySelector(`link[rel="preload"][href="${url}"]`);
  if (!existingLink) {
    document.head.appendChild(link);
  }
}

function FontPreloader() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname == '/') {
      preloadFont('https://cdn.df.nexon.com/img/common/font/DNFBitBitv2.otf', 'font/otf');
    }
  }, [location]);

  return null;
}

export default FontPreloader;