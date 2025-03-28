// src/stores/useSearchStore.ts
import { create } from 'zustand';
import { GestureSearchResult } from '@/types/searchGestureType';
import { searchGestures } from '@/services/searchService';

interface SearchState {
  // 검색 상태
  searchTerm: string;
  searchCountry: string;
  searchResults: GestureSearchResult[];
  isLoading: boolean;
  error: Error | null;

  // 액션
  setSearchTerm: (term: string) => void;
  setSearchCountry: (country: string) => void;
  performSearch: (term?: string, country?: string) => Promise<void>;
}

// 국가 이름을 ID로 변환하는 함수
const getCountryId = (country: string): number | undefined => {
  if (country === '전체') return undefined;
  
  const countryMap: Record<string, number> = {
    '대한민국': 1,
    '미국': 2,
    '일본': 3,
    '중국': 4,
    '이탈리아': 5,
  };
  
  return countryMap[country];
};

export const useSearchStore = create<SearchState>((set, get) => ({
  // 초기 상태
  searchTerm: '',
  searchCountry: '전체',
  searchResults: [],
  isLoading: false,
  error: null,

  // 액션
  setSearchTerm: (term) => set({ searchTerm: term }),

  setSearchCountry: (country) => set({ searchCountry: country }),

  performSearch: async (term?: string, country?: string) => {
    const searchTerm = term !== undefined ? term : get().searchTerm;
    const searchCountry = country !== undefined ? country : get().searchCountry;

    // 검색어가 비어있으면 결과 비우기
    if (!searchTerm.trim()) {
      set({ searchResults: [], isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // 국가 ID 가져오기
      const countryId = getCountryId(searchCountry);
      
      // 서비스 레이어 호출 (자동으로 목 데이터/API 선택)
      const results = await searchGestures(searchTerm, countryId);
      
      // 결과가 배열인지 확인 후 처리
      const searchResults = Array.isArray(results) ? results : [results];
      
      // 검색 결과 및 로딩 상태 업데이트
      set({ searchResults, isLoading: false });
    } catch (error) {
      console.error('검색 오류:', error);
      set({ 
        error: error instanceof Error ? error : new Error('검색 중 오류가 발생했습니다.'),
        isLoading: false 
      });
    }
  },
}));