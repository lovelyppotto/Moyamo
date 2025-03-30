// stores/useSearchStore.ts
import { create } from 'zustand';

interface SearchUIState {
  // UI 상태만 관리
  searchTerm: string;
  searchCountry: number;
  
  // 액션
  setSearchTerm: (term: string) => void;
  setSearchCountry: (country: number) => void;
}

export const useSearchStore = create<SearchUIState>((set) => ({
  // 초기 상태
  searchTerm: '',
  searchCountry: 0,
  
  // 액션
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSearchCountry: (country) => set({ searchCountry: country }),
}));