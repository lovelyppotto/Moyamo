export interface TranslationLanguage {
  code: string;
  name: string;
  flagUrl: string;
}

export type LanguageCode = 'KOR' | 'EN-US' | 'CN' | 'JPN';

export const translationLanguages: Record<string, TranslationLanguage> = {
  KOR: {
    code: 'kr',
    name: 'KOR',
    flagUrl: '/images/flags/kr.webp',
  },
  'EN-US': {
    code: 'us',
    name: 'EN-US',
    flagUrl: '/images/flags/us.webp',
  },
  CN: {
    code: 'cn',
    name: 'CN',
    flagUrl: '/images/flags/cn.webp',
  },
  JPN: {
    code: 'jp',
    name: 'JPN',
    flagUrl: '/images/flags/jp.webp',
  },
};

export const languageCodes = Object.keys(translationLanguages) as LanguageCode[];
