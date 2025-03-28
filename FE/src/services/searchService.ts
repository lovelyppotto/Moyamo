import { SearchResponse, GestureSearchResult } from '@/types/searchGestureType';
import apiClient from '@/api/apiClient';
import { searchResultMock } from '@/pages/result/resultMock';

// 개발 환경 확인
const isDevelopment = import.meta.env.MODE === 'development';
// 목 데이터 사용 여부를 localStorage에서 가져오기 (개발 중 전환 가능하도록)
const useMockData = () => {
  try {
    const storedValue = localStorage.getItem('useMockData');
    // localStorage에 값이 명시적으로 있으면 그 값을 사용
    if (storedValue !== null) {
      return storedValue === 'true';
    }
    // 없으면 개발 환경 여부로 결정
    return isDevelopment;
  } catch {
    return isDevelopment;
  }
};

// 목 데이터로 검색 결과 필터링하는 함수
const getMockSearchResults = (gestureName: string, countryId?: number): GestureSearchResult[] => {
  // 검색어가 없으면 빈 배열 반환
  if (!gestureName.trim()) return [];

  return searchResultMock.filter((item) => {
    // 제스처 이름으로 검색
    const nameMatch = item.gestureName.includes(gestureName);

    // 국가별 필터링
    const countryMatch =
      !countryId || item.meanings.some((meaning) => meaning.countryId === countryId);

    return nameMatch && countryMatch;
  });
};

// 검색 API 호출 함수 (기존 코드)
export const searchGestures = async (
  gestureName: string,
  countryId?: number
): Promise<GestureSearchResult | GestureSearchResult[]> => {
  // 목 데이터 사용 여부 확인
  if (useMockData()) {
    console.log('[개발 환경] 목 데이터 사용 중...');
    // API 응답 딜레이 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getMockSearchResults(gestureName, countryId);
  }

  // 실제 API 호출 (기존 코드 유지)
  console.log('[운영 환경] 실제 API 호출 중...');
  try {
    const { data } = await apiClient.get<SearchResponse>('/search/gestures', {
      params: {
        gesture_name: gestureName,
        country_id: countryId,
      },
    });

    // camelCase로 변환
    return {
      gestureId: data.data.gesture_id,
      gestureName: data.data.gesture_name,
      gestureImage: data.data.gesture_image,
      meanings: data.data.meanings.map((m) => ({
        countryId: m.country_id,
        name: m.name,
        meaning: m.meaning,
      })),
    };
  } catch (error) {
    console.error('API 호출 실패, 목 데이터로 대체:', error);
    // API 호출 실패 시 목 데이터로 대체
    return getMockSearchResults(gestureName, countryId);
  }
};

// 목 데이터와 API 사용 모드 전환 함수 (개발 편의용)
export const toggleMockDataMode = (useMock: boolean) => {
  try {
    localStorage.setItem('useMockData', useMock ? 'true' : 'false');
    console.log(`데이터 소스 변경: ${useMock ? '목 데이터' : '실제 API'} 사용 모드`);
    return true;
  } catch {
    console.warn('데이터 모드 설정 실패');
    return false;
  }
};

// 현재 데이터 모드 확인
export const isMockDataMode = () => {
  return useMockData();
};
