import { SearchResponse, GestureSearchResult, ApiMeaning } from '@/types/searchGestureType';
import apiClient from '@/api/apiClient';
import { searchResultMock } from '@/data/resultMock';

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

//검색 API 호출 함수
export const searchGestures = async (
  gestureName: string,
  countryId?: number,
  isCameraSearch?: boolean
): Promise<GestureSearchResult[]> => {
  // 파라미터로 받은 카메라 검색 여부가 없으면 URL에서 확인
  if (isCameraSearch === undefined) {
    const url = new URL(window.location.href);
    const hasGestureLabel = url.searchParams.has('gesture_label');
    const gestureLabel = url.searchParams.get('gesture_label') || '';
    isCameraSearch = hasGestureLabel && gestureLabel.trim() !== '';
  }

  // 검색 파라미터 결정
  let searchQuery = gestureName;
  if (isCameraSearch) {
    // URL에서 gesture_label 값을 가져와서 사용
    const url = new URL(window.location.href);
    const gestureLabel = url.searchParams.get('gesture_label') || '';
    searchQuery = gestureLabel || gestureName;
  }

  // 목 데이터 사용 여부 확인
  if (useMockData()) {
    console.log(
      `[개발 환경] 목 데이터 사용 중... ${isCameraSearch ? '(카메라 검색)' : '(일반 검색)'}`
    );
    // API 응답 딜레이 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 300));
    // 카메라 검색에 맞게 목 데이터 필터링
    return getMockSearchResults(searchQuery, countryId);
  }

  // 실제 API 호출
  console.log(
    `[프로덕션 환경] 실제 API 호출 중... ${isCameraSearch ? '(카메라 검색)' : '(일반 검색)'}`
  );
  try {
    let endpoint = '/api/search';
    let params: Record<string, string | number | undefined> = {};

    if (isCameraSearch) {
      // 카메라 검색 API
      endpoint = '/api/search/camera';
      params = {
        gesture_label: searchQuery,
        country_id: countryId,
      };
    } else {
      // 일반 검색 API
      params = {
        gesture_name: searchQuery,
        country_id: countryId,
      };
    }

    const { data } = await apiClient.get<SearchResponse>(endpoint, { params });

    // camelCase로 변환한 단일 결과를 배열로 감싸서 반환
    const result = {
      gestureId: data.data.gesture_id,
      gestureName: data.data.gesture_name,
      gestureImage: data.data.gesture_image,
      meanings: data.data.meanings.map((m: ApiMeaning) => ({
        countryId: m.country_id,
        imageUrl: m.image_url,
        countryName: m.country_name,
        meaning: m.meaning,
      })),
    };
    return [result]; // 배열로 반환
  } catch (error) {
    console.error('API 호출 실패, 목 데이터로 대체:', error);
    // API 호출 실패 시 목 데이터로 대체
    return getMockSearchResults(searchQuery, countryId);
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
