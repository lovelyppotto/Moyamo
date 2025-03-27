interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // 다른 환경변수는 필요에 따라 추가합니다
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
