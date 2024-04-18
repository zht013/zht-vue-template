// typings.d.ts or router.ts
import type { LayoutType } from '@/types'
import 'vue-router'

declare module 'vue-router' {
  /**
   * route.meta类型定义
   */
  interface RouteMeta {
    /** 是否需要授权 */
    requireAuth?: boolean
    /** 页面标题 */
    title: string
    /** 排序位置 */
    rank?: number
    /** 图标 */
    icon?: string | FunctionalComponent
    /** 是否显示为菜单 */
    isMenu?: boolean
    /** 是否是静态路由 */
    isStatic?: boolean
    /** 权限码 */
    authCode?: string
    /** 是否使用动态 layout */
    dynamicLayout?: boolean
    /** layout */
    layout?: LayoutType
  }
}
