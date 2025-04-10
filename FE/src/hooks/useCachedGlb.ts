import { useState, useEffect } from 'react';
import { loadGlbModel, prefetchGlbModels } from '../services/localforageGlbService';

// LocalForage를 활용하여 GLB 모델을 캐싱하고 관리하는 커스텀 훅
export const useCachedGlb = (url: string, prefetchNext: boolean = true) => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // 모델 로드
  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const loadModel = async () => {
      try {
        const blobUrl = await loadGlbModel(url);

        if (isMounted) {
          setModelUrl(blobUrl);
          setIsLoading(false);
          setProgress(100);
        }

        // 다음 모델 미리 로드 (url 패턴이 있는 경우)
        if (prefetchNext) {
          prefetchNextModels(url);
        }
      } catch (err) {
        console.error('모델 로드 실패:', err);

        if (isMounted) {
          setError(err instanceof Error ? err : new Error('모델 로드 실패'));
          setIsLoading(false);
        }
      }
    };

    loadModel();

    // 정리 함수
    return () => {
      isMounted = false;

      // Blob URL 해제
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [url, prefetchNext]);

  // 다음 모델 미리 로드 함수
  const prefetchNextModels = (currentUrl: string) => {
    // URL 패턴 분석 (예: /models/kr/1.glb -> /models/kr/)
    const urlPattern = currentUrl.match(/(.+?)\/[^\/]+\.glb$/);

    if (urlPattern && urlPattern[1]) {
      const baseUrl = urlPattern[1];

      // 현재 ID 추출 (예: /models/kr/1.glb -> 1)
      const currentIdMatch = currentUrl.match(/\/(\d+)\.glb$/);

      if (currentIdMatch && currentIdMatch[1]) {
        const currentId = parseInt(currentIdMatch[1]);

        // 다음 4개 모델 URL 생성
        const nextUrls: string[] = [];
        for (let i = currentId + 1; i <= currentId + 4; i++) {
          nextUrls.push(`${baseUrl}/${i}.glb`);
        }

        // 백그라운드에서 미리 로드
        if (nextUrls.length > 0) {
          prefetchGlbModels(nextUrls);
        }
      }
    }
  };

  return {
    modelUrl,
    isLoading,
    error,
    progress,
  };
};
