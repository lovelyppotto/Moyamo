// src/stores/useSearchStore.ts
import { create } from 'zustand';
import { GestureSearchResult } from '@/types/searchGestureType';
import { searchResultMock } from '../pages/result/resultMock';

interface SearchState {
  // 검색 상태
  searchTerm: string;
  searchCountry: string;
  searchResults: GestureSearchResult[];
  isLoading: boolean;

  // 액션
  setSearchTerm: (term: string) => void;
  setSearchCountry: (country: string) => void;
  performSearch: (term?: string, country?: string) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  // 초기 상태
  searchTerm: '',
  searchCountry: '전체',
  searchResults: [],
  isLoading: false,

  // 액션
  setSearchTerm: (term) => set({ searchTerm: term }),

  setSearchCountry: (country) => set({ searchCountry: country }),

  performSearch: (term?: string, country?: string) => {
    const searchTerm = term !== undefined ? term : get().searchTerm;
    const searchCountry = country !== undefined ? country : get().searchCountry;

    set({ isLoading: true });

    // 검색어가 비어있으면 결과 비우기
    if (!searchTerm.trim()) {
      set({ searchResults: [], isLoading: false });
      return;
    }

    // 검색 로직 실행
    const results = searchResultMock.filter((item) => {
      // 제스처 이름으로 검색
      const nameMatch = item.gestureName.includes(searchTerm);

      // 국가별 필터링
      const countryMatch =
        searchCountry === '전체' ||
        item.meanings.some((meaning) => {
          // 한국 -> 대한민국 변환
          const searchCountryName = searchCountry === '한국' ? '대한민국' : searchCountry;
          return meaning.name.includes(searchCountryName);
        });

      return nameMatch && countryMatch;
    });

    // 검색 결과 및 로딩 상태 업데이트
    set({ searchResults: results, isLoading: false });
  },
}));
