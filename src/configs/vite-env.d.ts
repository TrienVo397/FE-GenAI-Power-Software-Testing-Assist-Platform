/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_AUTH_TOKEN_KEY: string;
  readonly VITE_AUTH_USER_KEY: string;
  readonly VITE_ENABLE_GOOGLE_LOGIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
