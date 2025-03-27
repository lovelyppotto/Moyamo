// 버튼 타입
export type ButtonType = 'Dict' | 'Quiz';

// 국가 정보 인터페이스
export interface Country {
  id: number;
  code: string;
  name: string;
  flagSrc: string;
}

// 국가 데이터
export const countries: Country[] = [
  {
    id: 1,
    code: 'KR',
    name: '한국',
    flagSrc: '/images/flags/kr.webp',
  },
  {
    id: 2,
    code: 'US',
    name: '미국',
    flagSrc: '/images/flags/us.webp',
  },
  {
    id: 3,
    code: 'JP',
    name: '일본',
    flagSrc: '/images/flags/jp.webp',
  },
  {
    id: 4,
    code: 'CN',
    name: '중국',
    flagSrc: '/images/flags/cn.webp',
  },
  {
    id: 5,
    code: 'ITA',
    name: '이탈리아',
    flagSrc: '/images/flags/it.webp',
  },
];
