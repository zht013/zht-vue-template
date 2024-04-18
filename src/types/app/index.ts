import type { Ref } from 'vue'
import type { RouteMeta, RouteRecordName } from 'vue-router'

/** app 配置 */
export interface AppConfig {
  /** 应用标题 */
  title?: string
  /** 用户 token 过期时间，以秒为单位 */
  tokenExpiresIn?: number
}

/** app 状态信息 */
export interface AppState {
  /** App 配置信息 */
  config: Ref<AppConfig>
  /** App 主题 */
  theme: Ref<ThemeType>
  /** App 布局 */
  layoutType: Ref<LayoutType>
  /** 重置 App Store 信息 */
  $reset: () => void
  /** 是否 mount 过了 sortable 的 swap 插件 */
  mountedSortableSwap: Ref<boolean>
  /** 内容区域是否全屏 */
  contentFullscreen: Ref<boolean>
  /** 当前激活的菜单项 */
  activeMenuId: Ref<string>
  /** 路由历史 */
  routeHistories: Ref<AppMenu[]>
}

/** app 布局 */
export enum LayoutType {
  default = 'default',
  concise = 'concise',
  mobile = 'mobile',
  print = 'print',
  empty = 'empty'
}

/** app 主题 */
export enum ThemeType {
  dark = 'dark',
  light = 'light'
}

export interface AppMenu {
  id: string
  name: RouteRecordName
  path: string
  meta?: RouteMeta
  children?: AppMenu[]
}

// export enum ScreenSize {
//   maxXSmall = 'not all and (min-width: 640px)',
//   maxSmall = 'not all and (min-width: 768px)',
//   maxMiddle = 'not all and (min-width: 1024px)'
// }
