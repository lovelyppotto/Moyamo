interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly MODE: string;
  readonly VITE_USE_MOCK_DATA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
