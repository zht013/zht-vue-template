/// <reference types="vite/client" />

/**
 * import.meta.env类型定义
 */
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_BASE_URL: string
  readonly VITE_LOCAL_SERVER: string
  readonly VITE_PREVIEW_SERVER: string
  readonly VITE_USER_LAYOUT_KEY: string
  readonly VITE_USER_THEME_KEY: string
  readonly VITE_USER_TOKEN_KEY: string
  readonly VITE_REFRESH_TOKEN_KEY: string
  readonly VITE_GITHUB_API_TOKEN_KEY: string
  readonly VITE_GITEE_API_SERVER: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
