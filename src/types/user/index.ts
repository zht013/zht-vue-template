import type { Ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { AppMenu } from '../app'

/** 用户信息 */
export interface User {
  /** 用户id */
  id?: string
  /** 用户账号 */
  account: string
  /** 用户名称 */
  name?: string
  /** 用户角色 */
  roles?: string[]
  /** 用户菜单 */
  menus?: string[]
  /** 用户头像 */
  avatar?: string
}

/**
 * 用户状态信息
 */
export interface UserState {
  /** 当前用户信息 */
  user: Ref<User>
  /** 用户可访问的 menu 列表 */
  menus: Ref<AppMenu[]>
  /** 用户可访问的当前 route 的路径列表 */
  creadcrumbMenus: Ref<RouteRecordRaw[]>
  /**
   * 初始化用户信息
   * 并初始化用户可访问的路由
   * @param user 用户信息
   */
  initUserInfo: (user: User) => void
  /** 重置用户信息 */
  $reset: () => void
  /** 用户登出 */
  logout: () => void
  /** 展平菜单 */
  flatMenus: () => AppMenu[]
}
